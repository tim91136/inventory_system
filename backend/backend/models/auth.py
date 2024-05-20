from sqlalchemy import Integer, String, Column, DateTime, func
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import Session
from typing import Any
import uuid
from flask_login import UserMixin
from database import db
from backend.lib.utils.database.database_utils import get_random_uuid4_string


class User(UserMixin, db.Model):

    __tablename__ = "users"

    user_id = Column(String(128), primary_key=True,
                     default=get_random_uuid4_string)

    username = Column(String(120), unique=True, nullable=True)

    email = Column(String(), unique=True, nullable=False)

    salt = Column(String(120))

    created = Column(DateTime, default=func.current_timestamp())

    password_hash = Column(String(256), nullable=False)

    is_admin = Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<User username:{self.username} id={self.user_id}>"

    def get_id(self):
        return self.user_id

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def delete(self, db: Session):
        db.delete(self)
        db.commit()
    
    def set_admin(self, admin_status: bool):
        self.is_admin = admin_status
        db.session.commit()

    @classmethod
    def get_by_email(cls, email: str, session: Session) -> Any | None:
        "returns None if user with email does not exist and User if it does"
        return session.query(User).filter_by(email=email).first()

    @classmethod
    def create(cls, session: Session, email: str, password: str, username: str, is_admin: bool, user_id=uuid.uuid4()) -> any:
        """
        @returns
        - None on failure
        - User Model on success
        """
        if cls.get_by_email(email, session) is not None:
            print("[ERROR] User already exists!")

        try:
            user = cls(
                user_id=str(user_id),
                username=username,
                email=email,
                is_admin=is_admin
            )
            user.set_password(password)
            session.add(user)
            session.commit()
            session.refresh(user)
            return user
        except Exception as e:
            print("Error when trying to add user to database: ", e)
            return None
