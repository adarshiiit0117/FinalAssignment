from sqlalchemy import Column, Integer, String
from db.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    