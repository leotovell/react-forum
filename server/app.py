from flask import Flask, Response, jsonify, request, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS
from flask_migrate import Migrate
from models import User, Post, Comment, ResetToken, Forum, ForumSettings, db
from config import ApplicationConfig, RESPONSES, languageCodes, countries
import math

from emailClient import sendResetEmail

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True, methods=["POST", "GET"], max_age=3600, resources={r"/*": {"origins": "http://localhost:3000"}})
server_session = Session(app)
db.init_app(app)

with app.app_context():
    # db.drop_all()
    db.create_all()

def flash_message(session: Session, message: tuple) -> None:
    mess = session.get("flash_messages", [])
    mess.append(message)
    session["flash_messages"] = mess
    # return session

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res
        


@app.route("/@me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "unauthorised"
        }), 401
    
    user = User.query.filter_by(id=user_id).first()

    forums = Forum.query.filter_by(owner=user_id).all()
    new_forums = []
    for forum in forums:
        new_forums.append({"name": forum.name, "url": forum.vanity_url})

    # Get forums 
    return jsonify({
        "id": user.id,
        "email": user.email,
        "forums": new_forums
    })

@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    username = request.json["username"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({
            "error": "User already exists."
        }), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    flash_message(session, ("success", f"Registered successfully! Welcome to the forum, {new_user.username}"))

    return jsonify({
        "email": new_user.email,
        "id": new_user.id
    })

@app.route("/register-check-username", methods=["POST"])
def check_username_valid():
    username = request.json["username"]
    user = User.query.filter_by(username=username).first()
    if user is None:
        return "200"
    return jsonify({
        "error": "taken"
    }), 409

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

    flash_message(session, ("success", f"Logged in successfully, welcome back {user.username}!"))
    
    return jsonify({
        "email": user.email,
        "id": user.id
    })

@app.route("/logout", methods=["POST"])
def logout_user():
    flash_message(session, ("success", "Successfully logged out, hope to see you soon!"))
    session.pop("user_id")
    return "200"

@app.route("/get-language-codes", methods=["GET"])
def get_language_codes():
    return jsonify({
        "codes": languageCodes
    })

@app.route("/get-country-codes", methods=["GET"])
def get_country_codes():
    return jsonify({
        "codes": countries
    })

@app.route("/check-forum-name", methods=["POST"])
def check_forum_name():
    forum_name = request.json["name"]
    forum = Forum.query.filter_by(name=forum_name).first()
    print(forum)
    if forum is None:
        return jsonify({
            "exists": False
        }), 200
    else:
        return jsonify({
            "exists": True
        }), 409
    
@app.route("/check-vanity-url", methods=["POST"])
def check_vanity_url():
    url = request.json["url"]
    forum = Forum.query.filter_by(vanity_url=url).first()
    print(forum)
    if forum is None:
        return jsonify({
            "exists": False
        }), 200
    else:
        return jsonify({
            "exists": True
        }), 409

@app.route("/create-forum", methods=["POST"])
def create_forum():
    #General Forum
    name = request.json["forumName"]
    url = request.json["vanityUrl"]
    owner = session.get("user_id")
    #Forum Settings
    description = request.json["description"]
    settings = request.json["forumSettings"]
    language = request.json["language"]
    region = request.json["region"]
    if not all([name, url, owner, description, settings]):
       print([name, url, owner, description, settings])
       return jsonify({"error": "malformed or missing data"}), 401 
    new_forum = Forum(name=name, vanity_url=url, owner=owner)
    db.session.add(new_forum)
    db.session.commit()
    new_settings = ForumSettings(forum_id=new_forum.id, description=description, language=language, region=region, **settings)
    db.session.add(new_settings)
    db.session.commit()

    flash_message(session, ("success", f"Great! {new_forum.name} is now live!"))

    return jsonify({
        "id": new_forum.id,
        "name": new_forum.name
    }), 200


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

    flash_message(session, ("success", "Great! Your post is now live!"))

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

@app.route("/get-posts-forum", methods=["POST"])
def get_forum_posts():
    forum_name = request.json["forum_id"]
    page = request.json["page"]
    per_page = ApplicationConfig.PER_PAGE
    forum = Forum.query.filter_by(name=forum_name).first()
    if forum is None:
        return "404", 404
    posts = Post.query.filter_by(forum_id=forum.id).order_by(Post.date.desc())
    pageCount = math.ceil(posts.count() / per_page)
    posts = posts.paginate(page=page, per_page=per_page, error_out=False)
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
        "total_posts": pageCount
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

    flash_message(session, ("success", "Your post has been deleted!"))

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

    flash_message(session, ("success", "Your comment has been posted."))

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

    flash_message(session, ("success", "Your comment has been deleted."))    
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

@app.route("/reset-password", methods=["POST"])
def reset_password():
    email = request.json["resetEmail"]
    exists = User.query.filter_by(email=email).first()
    if exists is None:
        flash_message(session, RESPONSES.CLIENT.FORBIDDEN_403)
        return "403"
    # key + pin is generated by DB.
    token = ResetToken(user_id=exists.id)
    
    res = sendResetEmail(email, token.key, token.pin)

    if res:
        flash_message("success", ("Email sent successfully."))
        return "200"
    flash_message(session, RESPONSES.CLIENT.FORBIDDEN_403)
    return "403"

@app.route("/api/get-forum", methods=["POST"])
def get_forum():
    url = request.json["url"]
    forum = Forum.query.filter_by(vanity_url=url).first()
    settings = forum.settings[0]
    return jsonify({
        "forum": {
            "name": forum.name,
            "desc": settings.description,
            "image": forum.image
        },
        "settings": {
            "public": settings.public,
            "language": settings.language,
            "region": settings.region,
            "allow_edits": settings.allow_edits,
            "allow_polls": settings.allow_polls
        }
    })

if __name__ == "__main__":
    app.run(debug=True)