from sqlalchemy.orm import Session
from typing import Union
from backend import models as mo


def get_products(db: Session) -> Union[mo.Product, None]:
    """function to get all Products from the database

    Keyword arguments:
    :param db: the sqlalchemy session on wich to perform the query
    Return: Product model
    """

    product: mo.Product = db.query(mo.Product)\
                          .all()
    return product


def get_product_by_id(db: Session, product_id: str) -> mo.Product | None:
    """
    Returns the product with the uuid given or none if nothing is found
    """

    product = db.query(mo.Product).filter(mo.Product.id == product_id).first()
    return product