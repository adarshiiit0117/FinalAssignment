from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine, Base
from api import availability_routes, booking_routes, event_routes
import models.event
import models.availability
import models.booking

app = FastAPI()  # ✅ Create app FIRST

app.add_middleware(       # ✅ Then add middleware
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(event_routes.router, prefix="/events", tags=["Events"])
app.include_router(availability_routes.router, prefix="/availability", tags=["Availability"])
app.include_router(booking_routes.router, prefix="/bookings", tags=["Bookings"])

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}

Base.metadata.create_all(bind=engine)