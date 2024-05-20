from sqlalchemy.orm import Session
from typing import Union
from backend import models as mo


def get_orders(db: Session) -> Union[mo.Order, None]:
    """function to get all Orders from the database

    Keyword arguments:
    :param db: the sqlalchemy session on wich to perform the query
    Return: Order model
    """

    order: mo.Order = db.query(mo.Order)\
                          .all()
    return order


def get_order_by_id(db: Session, order_id: str) -> mo.Order | None:
    """
    Returns the order with the uuid given or none if nothing is found
    """

    order = db.query(mo.Order).filter(mo.Order.id == order_id).first()
    return order