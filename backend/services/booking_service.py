from models.booking import Booking
from models.event import Event
from models.availability import Availability
from datetime import datetime, timedelta
from datetime import datetime

from models.booking import Booking
from models.event import Event
from models.availability import Availability
from datetime import datetime, timedelta

def get_available_slots(db, event_id, date):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        return []

    duration = event.duration
    day_of_week = date.weekday()

    availability_list = db.query(Availability).filter(
        Availability.day_of_week == day_of_week
    ).all()

    slots = []

    # 🔥 FIX 1: remove seconds for clean comparison
    now = datetime.now().replace(second=0, microsecond=0)

    for availability in availability_list:
        start = datetime.combine(date, availability.start_time)
        end = datetime.combine(date, availability.end_time)

        current = start

        while current + timedelta(minutes=duration) <= end:

            # 🔥 FIX 2: unified logic
            if date > now.date():
                slots.append(current)

            elif date == now.date() and current > now:
                slots.append(current)

            current += timedelta(minutes=duration)

    # remove booked slots
    bookings = db.query(Booking).filter(
        Booking.event_id == event_id
    ).all()

    booked_times = [b.start_time.replace(second=0, microsecond=0) for b in bookings]

    available_slots = [slot for slot in slots if slot not in booked_times]

    return available_slots
def create_booking(db, data):
    event = db.query(Event).filter(Event.id == data.event_id).first()

    if not event:
        return None

    end_time = data.start_time + timedelta(minutes=event.duration)

    # safe duplicate check
    existing = db.query(Booking).filter(
        Booking.event_id == data.event_id
    ).all()

    for b in existing:
        if b.start_time == data.start_time:
            return None

    new_booking = Booking(
        event_id=data.event_id,
        name=data.name,
        email=data.email,
        start_time=data.start_time,
        end_time=end_time
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking


def get_upcoming_meetings(db):
    now = datetime.now()
    return db.query(Booking).filter(Booking.start_time >= now).all()
def get_past_meetings(db):
    now = datetime.now()
    return db.query(Booking).filter(Booking.start_time < now).all()
def cancel_booking(db, booking_id):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking:
        db.delete(booking)
        db.commit()
    return booking
