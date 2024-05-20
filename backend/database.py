from sqlalchemy.orm import DeclarativeBase
from flask_sqlalchemy import SQLAlchemy
from logger import aw_logger
from sqlalchemy import text

class Base(DeclarativeBase):
    pass


# Flask Sqlalchemy
db = SQLAlchemy(model_class=Base)


def get_pg_database_size() -> str:
    """
    Get the database size from the connected postgres database
    returns it as a pretty string (e.g. 1 GB, 12 MB)
    """
    result = db.session.execute(text("SELECT pg_size_pretty(pg_database_size(current_database()))"))
    size = result.fetchone()[0]
    aw_logger.info(f"Database size: {size}")
    return size