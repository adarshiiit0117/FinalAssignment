from pydantic import BaseModel
from datetime import time

class AvailabilityCreate(BaseModel):
    day_of_week: int   # 0 = Monday
    start_time: time
    end_time: time

class AvailabilityResponse(BaseModel):
    id: int
    day_of_week: int
    start_time: time
    end_time: time

    class Config:
        orm_mode = True