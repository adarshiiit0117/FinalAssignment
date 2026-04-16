from models.availability import Availability

def create_availability(db, data):
    new_availability = Availability(
        day_of_week=data.day_of_week,
        start_time=data.start_time,
        end_time=data.end_time
    )
    db.add(new_availability)
    db.commit()
    db.refresh(new_availability)
    return new_availability


def get_all_availability(db):
    return db.query(Availability).all()


def delete_availability(db, availability_id):
    item = db.query(Availability).filter(Availability.id == availability_id).first()
    if item:
        db.delete(item)
        db.commit()
    return item