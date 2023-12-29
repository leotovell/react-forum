from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from uuid import uuid4
db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)
    date_joined = db.Column(db.DateTime(timezone=True), server_default=func.now())

class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    title = db.Column(db.String(255))
    author = db.Column(db.String(32), db.ForeignKey("users.id"))
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime(timezone=True), server_default=func.now())

class Edit(db.Model):
    __tablename__ = "edits"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    post_id = db.Column(db.String(32))
    previous = db.Column(db.Text)
    date = db.Column(db.DateTime(timezone=True), server_default=func.now())

class Comment(db.Model):
    __tablename__ = "comments"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    post_id = db.Column(db.String(32), db.ForeignKey("posts.id"))
    author = db.Column(db.String(32), db.ForeignKey("users.id"))
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime(timezone=True), server_default=func.now())