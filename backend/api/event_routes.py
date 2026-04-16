from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from models.event import Event
from schemas.event_schema import EventCreate, EventResponse, EventUpdate
from services import event_service

router = APIRouter()


# ✅ CREATE EVENT (slug auto-generated in service)
@router.post("/", response_model=EventResponse)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    return event_service.create_event(db, event)


# ✅ GET ALL EVENTS
@router.get("/", response_model=list[EventResponse])
def get_events(db: Session = Depends(get_db)):
    return event_service.get_all_events(db)


# ✅ GET EVENT BY SLUG (IMPORTANT 🔥)
@router.get("/slug/{slug}", response_model=EventResponse)
def get_event_by_slug(slug: str, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.slug == slug).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return event


# ✅ UPDATE EVENT
@router.put("/{event_id}", response_model=EventResponse)
def update_event(event_id: int, data: EventUpdate, db: Session = Depends(get_db)):
    updated = event_service.update_event(db, event_id, data)

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return updated


# ✅ DELETE EVENT
@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    deleted = event_service.delete_event(db, event_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return {"message": "Event deleted successfully"}