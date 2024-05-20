"""
DB models for suppliers, orders and products
"""

from database import db
from sqlalchemy import (
    Column,
    String,
    DateTime,
    func,
    Integer,
    ForeignKey,
    Boolean,
    TypeDecorator
)
import pytz
from sqlalchemy.orm import relationship
from backend.lib.utils.database.database_utils import get_random_uuid4_string

class AwareDateTime(TypeDecorator):
    """Results returned as aware datetimes, not naive ones."""

    impl = DateTime

    def process_result_value(self, value, dialect):
        return value.replace(tzinfo=pytz.utc).astimezone(pytz.timezone("Europe/Berlin")) if value else None


class OrderProduct(db.Model):
    """Ordered Product Database model"""

    __tablename__ = 'order_product'
    order_id = Column(String(120), ForeignKey('orders.id'), primary_key=True)
    product_id = Column(String(120), ForeignKey('products.id'), primary_key=True)
    quantity = Column(Integer, nullable=False)  # Additional field to store quantity of each product in an order

    order = relationship("Order", back_populates="order_products")
    product = relationship("Product", back_populates="order_products")

class Supplier(db.Model):
    """Suppliers Database model"""

    __tablename__ = "suppliers"

    id = Column(String(120), primary_key=True,
                default=get_random_uuid4_string)
    name = Column(String)
    created = Column(AwareDateTime, default=func.current_timestamp())
    updated = Column(
        AwareDateTime,
        default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )
    products = relationship("Product", back_populates="supplier")

class Product(db.Model):
    """Products Database model"""

    __tablename__ = "products"

    id = Column(String(120), primary_key=True,
                default=get_random_uuid4_string)
    name = Column(String)
    quantity = Column(Integer) # stock quantity
    created = Column(AwareDateTime, default=func.current_timestamp())
    updated = Column(
        AwareDateTime,
        default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )
    supplier_id = Column(String(120), ForeignKey('suppliers.id'))
    supplier = relationship("Supplier", back_populates="products")
    order_products = relationship("OrderProduct", back_populates="product")

class Order(db.Model):
    __tablename__ = "orders"

    id = Column(String(120), primary_key=True, default=get_random_uuid4_string)
    order_products = relationship("OrderProduct", back_populates="order")
    is_active = Column(Boolean, default=True)
    is_canceled = Column(Boolean, default=False)
    is_done = Column(Boolean, default=False)
    is_archived = Column(Boolean, default=False)
    created = Column(
        AwareDateTime, 
        default=func.current_timestamp() 
    )
    updated = Column(
        AwareDateTime,
        default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )