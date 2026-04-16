from models.event import Event
import uuid
def create_event(db, event):
    slug = generate_slug(event.name)

    db_event = Event(
        name=event.name,
        duration=event.duration,
      slug = generate_slug(event.name)
    )

    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    return db_event

def get_all_events(db):
    return db.query(Event).all()


def delete_event(db, event_id):
    event = db.query(Event).filter(Event.id == event_id).first()
    if event:
        db.delete(event)
        db.commit()
    return event
def update_event(db, event_id, event_data):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        return None

    if event_data.name is not None:
        event.name = event_data.name

    if event_data.duration is not None:
        event.duration = event_data.duration

    if event_data.slug is not None:
        event.slug = event_data.slug

    db.commit()
    db.refresh(event)

    return event
def generate_slug(name: str):
    return name.lower().replace(" ", "-") + "-" + str(uuid.uuid4())[:6]