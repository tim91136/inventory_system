# Configuration for the whole project
from typing import Literal
import os
import datetime
from dotenv import load_dotenv
import pathlib

from marshmallow import Schema, fields, validate, ValidationError, EXCLUDE

load_dotenv()

basedir = pathlib.Path(__file__).parent.resolve()

# ! startup will FAIL without these set
MANDATORY_ENV_VARS = [
    "SQLALCHEMY_DATABASE_URI",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "USER_EMAIL",
    "USER_PASSWORD"
]

for var in MANDATORY_ENV_VARS:
    if var not in os.environ:
        raise EnvironmentError(
            f"Failed because env var \033[0;31m {var} is not set! \033 \
                [0m Mandatory ENV vars: {[(var, f'{os.environ.get(var)}') for var in MANDATORY_ENV_VARS]}"  # noqa
        )
    elif os.environ[var] == "":
        raise EnvironmentError(
            f"Failed because env var \033[0;31m {var} is an empty string! \033 [0m Mandatory ENV vars: {[(var, f'{os.environ.get(var)}') for var in MANDATORY_ENV_VARS]}"  # noqa
        )


class InvalidConfigError(Exception):
    """Raised when the values in the config are invalid"""
    pass


class ConfigSchema(Schema):
    """
    The marshmallow schema for the correct configuration
    used for validation
    """

    class Meta:
        unknown = EXCLUDE

    AUTH_METHOD = fields.Str(validate=validate.OneOf(
        ["LDAP", "LOCAL"]), required=True)
    SQLALCHEMY_DATABASE_URI = fields.Str(required=True)
    SECRET_KEY = fields.Str(required=True)
    LOG_FORMAT = fields.Str(required=True)
    SESSION_COOKIE_NAME = fields.Str(required=True)
    ADMIN_EMAIL = fields.Email(required=True)
    ADMIN_USERNAME = fields.Str(required=True)
    ADMIN_PASSWORD = fields.Str(required=True)
    USER_EMAIL = fields.Email(required=True)
    USER_USERNAME = fields.Str(required=True)
    USER_PASSWORD = fields.Str(required=True)
    WTF_CSRF_ENABLED = fields.Bool(required=True)
    SESSION_COOKIE_HTTPONLY = fields.Bool(required=True)
    SESSION_PERMANENT = fields.Bool(required=True)
    SESSION_USE_SIGNER = fields.Bool(required=True)
    PERMANENT_SESSION_LIFETIME = fields.Raw(required=True)
    DEFAULT_SENSOR_MAIN_RULES_FILE_PATH = fields.Str(required=True)


class Config:
    """
    Main Production Config class for the inventory
    backend
    This is being loaded as config for flask aswell

    all the keys need to be fully in upper case for flask
    to read them
    """

    # currently only local is implemented
    AUTH_METHOD: Literal["LDAP", "LOCAL"] = "LOCAL"

    SQLALCHEMY_DATABASE_URI: str = os.environ.get("SQLALCHEMY_DATABASE_URI")

    SECRET_KEY = "bad-secret-keyajsdklhjfjkla.rhl15135jgxnvjdyifjudoijfiosj"

    LOG_FORMAT = f"%(asctime)s | pid: {os.getpid()}| %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]"  # noqa

    SESSION_COOKIE_NAME = "inventory-session"

    # default user for development
    ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")
    ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")

    USER_EMAIL = os.environ.get("USER_EMAIL")
    USER_USERNAME = os.environ.get("USER_USERNAME", "user")
    USER_PASSWORD = os.environ.get("USER_PASSWORD")

    # csrf proctection on routes
    WTF_CSRF_ENABLED = False

    # flask session settings
    SESSION_COOKIE_HTTPONLY = True
    SESSION_PERMANENT = True
    SESSION_USE_SIGNER = True
    PERMANENT_SESSION_LIFETIME = datetime.timedelta(minutes=30)

def get_config() -> Config:
    """
    main function to get the configuration
    inside the application besides the flask
    app.config object
    """
    return Config()
