from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.booking_schema import BookingCreate, BookingResponse
from services import booking_service
from datetime import date

router = APIRouter()


@router.get("/slots")
def get_slots(event_id: int, selected_date: date, db: Session = Depends(get_db)):
    return booking_service.get_available_slots(db, event_id, selected_date)


@router.post("/", response_model=BookingResponse)
def create_booking(data: BookingCreate, db: Session = Depends(get_db)):
    booking = booking_service.create_booking(db, data)
    if not booking:
        return {"error": "Slot already booked or event not found"}
    return booking
@router.get("/upcoming", response_model=list[BookingResponse])
def upcoming_meetings(db: Session = Depends(get_db)):
    return booking_service.get_upcoming_meetings(db)
@router.get("/past", response_model=list[BookingResponse])
def past_meetings(db: Session = Depends(get_db)):
    return booking_service.get_past_meetings(db)
@router.delete("/{booking_id}")
def cancel_meeting(booking_id: int, db: Session = Depends(get_db)):
    return booking_service.cancel_booking(db, booking_id)