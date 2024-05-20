from flask import Blueprint, current_app, request, abort, jsonify
from flask_login import login_user, logout_user, current_user
from backend.models import User
from database import db
from flask_wtf.csrf import generate_csrf

auth_blueprint = Blueprint("auth", __name__, template_folder='templates', url_prefix="/auth")


@auth_blueprint.post("/login")
def login():

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if email is None or password is None:
        abort(400, "Email or password is missing")

    if current_app.config.get("AUTH_METHOD") == "LOCAL":
        user: User | None = db.session.query(User).filter_by(email=email).first()
        if user is None:
            return abort(401, "invalid email or password")
        else:
            if user.check_password(password=password) is True:
                login_user(user)
                return jsonify({
                    "message": "logged in successfully"
                }), 200
            else:
                return abort(401, "invalid email or password")

    # ! LDAP optional
    elif current_app.config.get("AUTH_METHOD") == "LDAP":
        return abort(500, "server is set to ldap auth and it isnt implemented yet")


@auth_blueprint.route("/logout", methods=["GET", "POST"])
def logout():

    logout_user()

    return {
        "message": "logged out current user"
    }, 200


@auth_blueprint.get("/csrf-token")
def get_csrf_token():
    csrf_token = generate_csrf()

    return {
            "csrf_token": csrf_token
        }


@auth_blueprint.get("/me")
def get_user_info():

    if current_user.is_authenticated:
        return {
            "username": current_user.username,
            "email": current_user.email,
            "user_id": current_user.user_id,
            "created": str(current_user.created),
            "is_admin": current_user.is_admin,
            "is_authenticated": True
        }
    
    else:
        return {
            "username": "",
            "email": "",
            "user_id": "",
            "created": "",
            "is_admin": False,
            "is_authenticated": False
        }, 401
