from dotenv import load_dotenv
import os
import redis

load_dotenv()

class RESPONSES:
    # 1xx INFORMATIONAL RESPONSE
    # 2xx SUCCESS
    # 3xx REDIRECTION
    # 4xx CLIENT ERROR
    # 5xx SERVER ERROR

    class SUCCESS:
        SUCCESS_200 = ("success", "Your request was processed successfully.", 200)

    class CLIENT:
        BAD_REQUEST_400 = ("error", "Bad request, please try again later.", 400)
        UNAUTHORISED_401 = ("error", "Oops, looks like you are unauthorised! Check you are logged in and try again...", 401)
        FORBIDDEN_403 = ("error", "Oops, looks like you aren't allowed to go there!", 403)
        NOT_FOUND_404 = ("error", "Oops, looks like what you are looking for isn't there... Perhaps it has moved?", 404)
        METHOD_NOT_ALLOWED_405 = ("error", "We don't like how you asked for that... If this is an unexpected error, please contact an admin with the error code below.", 405)
        NOT_ACCEPTED_406 = ("error", "Seems like you've given us something we don't accept, contact an admin with the code below if this is not what you are expecting to see!", 406)
        TIMED_OUT_408 = ("error", "Oops, you've timed out, check your connection and try again!", 408)
        CONFLICT_409 = ("error", "Hmm... Seems like you've slipped through the nets and caused a conflict! Try change something and try again.", 409)
        PAYLOAD_TOO_LARGE_413 = ("error", "Wow! That's a big payload, try upload something smaller...", 413)
        LOCKED_423 = ("error", "Hmm... The content you are trying to access is currently locked!", 423)
        RATE_LIMITED_429 = ("error", "Whew, calm down and let me catch up! We've limited the amount of requests you can make until we catch up with you!", 429)
        ILLEGAL_451 = ("error", "That content is currently hidden due to legal reasons.", 451)

    class SERVER:
        SERVER_ERROR_500 = ("error", "Seems like we've had a problem our end, try again or contact an admin.", 500)
        NOT_IMPLEMENTED_501 = ("error", "Uh oh, we don't support that type of request method!", 501)
        BAD_GATEWAY_502 = ("error", "That's a bad gateway, whatever that means... Please contact an admin!", 502)
        UNAVAILABLE_503 = ("error", "Seems like we cant do that right now, please try again soon.", 503)
        GATEWAY_TIMEOUT_504 = ("error", "Seems like we took too long to respond, please try again soon.", 504)
        HTTP_UNSUPPORTED_505 = ("error", "Hmm, we don't support the version of HTTP you are using, switch and try again!", 505)  

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