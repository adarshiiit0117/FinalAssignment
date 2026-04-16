from pydantic import BaseModel

class EventCreate(BaseModel):
    name: str
    duration: int
    

class EventResponse(BaseModel):
    id: int
    name: str
    duration: int
    slug: str

    class Config:
        orm_mode = True
class EventUpdate(BaseModel):
    name: str | None = None
    duration: int | None = None
    slug: str | None = None
class EventOut(BaseModel):
    id: int
    name: str
    duration: int
    slug: str   # ✅ OK here

    class Config:
        orm_mode = True