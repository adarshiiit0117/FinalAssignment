from pydantic import BaseModel
from datetime import datetime

class BookingCreate(BaseModel):
    event_id: int
    name: str
    email: str
    start_time: datetime

class BookingResponse(BaseModel):
    id: int
    event_id: int
    name: str
    email: str
    start_time: datetime
    end_time: datetime

    class Config:
        orm_mode = True