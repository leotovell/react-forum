from dotenv import load_dotenv
import os
import redis

load_dotenv()

class ApplicationConfig:

    # FLASK SECRET KEY
    SECRET_KEY = os.environ["SECRET_KEY"]
    
    # SQLALCHEMY
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = r"sqlite:///./db.sqlite"

    # SESSIONS
    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = False # True WHEN FIXED. CURRENTLY CAUSES ERROR
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")

    # CONSTANTS
    PER_PAGE = 2