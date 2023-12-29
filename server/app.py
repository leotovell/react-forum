from flask import Flask, jsonify, request, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS
from models import User, Post, Comment, db
from config import ApplicationConfig
import math

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    # db.drop_all()
    db.create_all()

def flash_message(session, status, message):
    mess = session.get("flash_messages", [])
    mess.append((status, message))
    session["flash_messages"] = mess
    # return session
@app.route("/@me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "unauthorised"
        }), 401
    
    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "email": user.email,
    })

@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({
            "error": "User already exists."
        }), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "email": new_user.email,
        "id": new_user.id
    })

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({
            "error": "Unauthorised"
        }), 401
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({
            "error": "Unauthorised"
        }), 401
    
    session["user_id"] = user.id
    
    return jsonify({
        "email": user.email,
        "id": user.id
    })

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"

@app.route("/create-post", methods=["POST"])
def create_post():
    user_id = session.get("user_id")
    if user_id is None:
        return jsonify({
            "error": "Unauthorised"
        }), 401
    user = User.query.filter_by(id=user_id).first()
    new_post = Post(author=user_id, title=request.json["title"], content=request.json["content"])
    db.session.add(new_post)
    db.session.commit()

    return jsonify({
        "id": new_post.id,
        "title": new_post.title,
        "date": new_post.date
    })

@app.route("/get-posts", methods=["POST"])
def get_posts():
    page = int(request.json["page"])
    per_page = ApplicationConfig.PER_PAGE
    # posts = Post.query.limit(5).all()
    posts = Post.query.order_by(Post.date.desc()).paginate(page=page, per_page=per_page, error_out=False)
    postCount = math.ceil(Post.query.count() / per_page)
    new_posts = []
    for post in posts:
        comments = Comment.query.filter_by(post_id=post.id).all()
        new_comments = []
        for comment in comments:
            new_comments.append({
                "id": comment.id,
                "author": comment.author,
                "content": comment.content,
                "date": comment.date
            })
        new_posts.append({
            "id": post.id,
            "title": post.title,
            "author": post.author,
            "content": post.content,
            "date": post.date,
            "comments": new_comments
        })

    return jsonify({
        "posts": new_posts,
        "total_posts": postCount
    })

@app.route("/delete-post", methods=["POST"])
def delete_post():
    post_id = request.json["post_id"]
    post = Post.query.filter_by(id=post_id).first()
    user_id = session.get("user_id")
    if user_id is None:
        return jsonify({
            "error": "Unauthorised"
        }), 401
    if session.get("user_id") != post.author:
        return jsonify({
            "error": "Unauthorised"
        }), 401
    db.session.delete(post)
    db.session.commit()

    return jsonify({
        "success": "post deleted."
    }), 200

@app.route("/post-comment", methods=["POST"])
def post_comment():
    post_id = request.json["post_id"]
    content = request.json["comment"]
    user_id = session.get("user_id")
    if user_id is None:
        flash_message(session, "error", "Not logged in.")

        return jsonify({
            "error": "unauthorised"
        }), 401
    comment = Comment(post_id=post_id, author=user_id, content=content)
    db.session.add(comment)
    db.session.commit()
    return jsonify({
        "id": comment.id,
        "content": comment.content
    })

@app.route("/delete-comment", methods=["POST"])
def delete_comment():
    comment_id = request.json["comment_id"]
    user_id = session.get("user_id")
    if user_id is None:
        return jsonify({
            "error": "Unauthorised"
        }), 401
    comment = Comment.query.filter_by(id=comment_id).first()
    if user_id != comment.author:
        if user_id is None:
            return jsonify({
            "error": "Unauthorised"
        }), 401
    db.session.delete(comment)
    db.session.commit()

    return "200"

@app.route("/profile", methods=["POST"])
def profile_info():
    # This returns a users email, date joined, posts. 
    user_id = request.json["id"]
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return jsonify({
            "error": "User doesn't exist."
        }), 404
    posts = Post.query.filter_by(author=user.id).all()
    new_posts = []
    for post in posts:
        comments = Comment.query.filter_by(post_id=post.id).all()
        new_comments = []
        for comment in comments:
            new_comments.append({
                "id": comment.id,
                "author": comment.author,
                "content": comment.content,
                "date": comment.date
            })
        new_posts.append({
            "id": post.id,
            "title": post.title,
            "author": post.author,
            "content": post.content,
            "date": post.date,
            "comments": new_comments
        })
    
    return jsonify({
        "email": user.email,
        "date_joined": user.date_joined,
        "posts": new_posts,
    })

@app.route("/get-flash-messages", methods=["GET"])
def get_flash_messages():
    messages = session.get("flash_messages", [])
    if messages:
        session.pop("flash_messages")
    return jsonify({
        "messages": messages
    })

if __name__ == "__main__":
    app.run(debug=True)