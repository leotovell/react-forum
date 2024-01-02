from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from uuid import uuid4
from config import ApplicationConfig
import datetime
from random import choice
from string import digits
db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

def get_pin():
    return "".join([choice(digits) for i in range(6)])

def generate_token_expiry_date():
    return datetime.date.today() + datetime.timedelta(minutes=10)

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(345), unique=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    date_joined = db.Column(db.DateTime(timezone=True), server_default=func.now())

class Forum(db.Model):
    __tablename__ = "forums"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(255), unique=True, nullable=False)
    vanity_url = db.Column(db.String(32), unique=True)
    owner = db.Column(db.String(32), db.ForeignKey("users.id"))
    posts = db.relationship("Post", backref="forum", lazy=True)

class ForumSettings(db.Model):
    __tablename__ = "forum_settings"
    forum_id = db.Column(db.String(32), db.ForeignKey("forums.id"), primary_key=True, unique=True)
    public = db.Column(db.Boolean, default=True)
    description = db.Column(db.Text, nullable=True)
    language = db.Column(db.String(2), nullable=False) #Language codes found in applicationConfig

class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    title = db.Column(db.String(255))
    author = db.Column(db.String(32), db.ForeignKey("users.id"))
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime(timezone=True), server_default=func.now())
    forum_id = db.Column(db.String(32), db.ForeignKey("forums.id"), nullable=False)

class Subscription(db.Model):
    __tablename__ = "subscriptions"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey("users.id"), nullable=False)
    forum_id = db.Column(db.String(32), db.ForeignKey("forums.id"), nullable=False)

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

class ResetToken(db.Model):
    __tablename__ = "reset_tokens"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey("users.id"))
    key = db.Column(db.Text, nullable=False, unique=True, default=get_uuid)
    pin = db.Column(db.String(6), nullable=False, unique=False, default=get_pin)
    expiry = db.Column(db.DateTime(timezone=True), default=generate_token_expiry_date)
    used = db.Column(db.Boolean, default=False)