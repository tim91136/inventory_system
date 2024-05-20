"""
This file contains the main app factory function for the Flask app.
It's a function that sets up the flask application and returns it.
"""

from flask import Flask, jsonify, request
from werkzeug.exceptions import HTTPException
from flask_restful import Api
from flask_migrate import Migrate
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_login import LoginManager, current_user, login_required
from flask_wtf import CSRFProtect

from database import db
from backend.models import User
import config

from backend.auth import auth_blueprint
from backend.suppliers import suppliers_blueprint
from backend.products import products_blueprint
from backend.orders import orders_blueprint

def create_app(*args, **kwargs) -> Flask:
    # ! Vanilla Flask
    app = Flask(__name__)
    app.config.from_object(config.Config)

    uri = app.config['SQLALCHEMY_DATABASE_URI']
    print(f"SQLALCHEMY_DATABASE_URI: {uri}")

    # ! Flask Restful
    _ = Api(app)

    # ! Flask Sqlalchemy
    db.init_app(app)

    with app.app_context():
        db.create_all()

    _ = Migrate(app, db)

    # ! Flask admin (not used)
    # set optional bootswatch theme
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'

    admin = Admin(app, name='inventory', template_mode='bootstrap3')
    admin.add_view(ModelView(User, db.session))

    # ! Flask Login -- https://flask-login.readthedocs.io/en/latest/
    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)

    @login_manager.unauthorized_handler
    def unauthorized():
        if not current_user.is_authenticated:
            return jsonify({"message": "Unauthorized access"}), 401

    # ? Initial admin user
    a_uname = app.config.get("ADMIN_USERNAME")
    a_email = app.config.get("ADMIN_EMAIL")
    a_pw = app.config.get("ADMIN_PASSWORD")

    # ? Second user with less permissions
    u_username = app.config.get("USER_USERNAME")
    u_email = app.config.get("USER_EMAIL")
    u_password = app.config.get("USER_PASSWORD")


    with app.app_context():
        current_admin = User.get_by_email(email=a_email, session=db.session)
        if current_admin is None:
            admin = User.create(db.session, a_email, a_pw, a_uname, True)
            admin.set_admin(True)
        else:
            print("Admin already exists changing pw to pw in config")
            current_admin.set_password(a_pw)
            current_admin.set_admin(True)

        # Initialize General User
        current_user = User.get_by_email(email=u_email, session=db.session)
        if current_user is None:
            user = User.create(db.session, u_email, u_password, u_username, False)
            user.set_admin(False)
        else:
            print("User already exists, updating password to config password")
            current_user.set_password(u_password)
            current_user.set_admin(False)

    # ! Flask WTF CSRF
    _ = CSRFProtect(app)

    # convert werkzeug exceptions to json (all exceptions return json)
    @app.errorhandler(HTTPException)
    def handle_exception(e):
        if request.accept_mimetypes.accept_json:
            response = jsonify(
                {
                    "error": str(e),
                    "code": e.code,
                    "description": e.description,
                    "url": request.url,
                }
            )
            response.status_code = e.code
            return response
        return e.get_response()

    # ! Blueprints
    # ? https://flask.palletsprojects.com/en/2.3.x/tutorial/views/
    # ? https://www.youtube.com/watch?v=_LMiUOYDxzE
    with app.app_context():
        app.register_blueprint(auth_blueprint)
        app.register_blueprint(suppliers_blueprint)
        app.register_blueprint(products_blueprint)
        app.register_blueprint(orders_blueprint)

    @app.get("/")
    @login_required
    def home():
        return "<h1>Hello World</h1>"

    return app
