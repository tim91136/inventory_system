from sqlalchemy.orm import Session
from typing import Union
from backend import models as mo


def get_suppliers(db: Session) -> Union[mo.Supplier, None]:
    """function to get all Suppliers from the database

    Keyword arguments:
    :param db: the sqlalchemy session on wich to perform the query
    Return: Supplier model
    """

    supplier: mo.Supplier = db.query(mo.Supplier)\
                          .all()
    return supplier


def get_supplier_by_id(db: Session, supplier_id: str) -> mo.Supplier | None:
    """
    Returns the supplier with the uuid given or none if nothing is found
    """

    supplier = db.query(mo.Supplier).filter(mo.Supplier.id == supplier_id).first()
    return supplier