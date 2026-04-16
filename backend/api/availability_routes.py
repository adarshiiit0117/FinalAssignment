from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.availability_schema import AvailabilityCreate, AvailabilityResponse
from services import availability_service

router = APIRouter()


@router.post("/", response_model=AvailabilityResponse)
def create_availability(data: AvailabilityCreate, db: Session = Depends(get_db)):
    return availability_service.create_availability(db, data)


@router.get("/", response_model=list[AvailabilityResponse])
def get_availability(db: Session = Depends(get_db)):
    return availability_service.get_all_availability(db)


@router.delete("/{availability_id}")
def delete_availability(availability_id: int, db: Session = Depends(get_db)):
    return availability_service.delete_availability(db, availability_id)