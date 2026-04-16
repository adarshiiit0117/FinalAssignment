#  Schedify – Smart Scheduling Platform

Schedify is a full-stack scheduling application inspired by tools like Calendly.  
It allows users to create event types, manage availability, and share booking links so others can schedule meetings seamlessly.


##  Live Demo
 
- **Frontend (Vercel):** https://final-assignment-brown.vercel.app/
- **Backend (Render):** https://finalassignment-2.onrender.com
- **API Docs (Swagger):** https://finalassignment-2.onrender.com/docs
> ⚠️ **Important – Please read before opening the app:**
> 
> The backend is hosted on **Render's free tier**, which **spins down after inactivity** and takes **~30–50 seconds to wake up** on the first request.
>
> **Follow these steps to avoid a blank or broken page:**
> 1. First open the **backend URL** → https://finalassignment-2.onrender.com and wait for it to load
> 2. Once the backend is awake, open the **frontend** → https://final-assignment-brown.vercel.app/
>
> Skipping step 1 may cause the frontend to show errors or empty data on first load.
 
---

##  Features

###  Event Management
- Create, update, and delete event types
- Auto-generate **slug-based URLs**
- Event duration customization (15min, 30min, etc.)

###  Availability Management
- Set weekly availability (day-wise)
- Define time slots (start → end)
- Dynamic slot generation

###  Smart Booking System
- Public booking page via shareable link → `/book/{slug}`
- Prevent double bookings
- Automatically block already booked slots
- Filters **past time slots (real-time)**
- Handles **timezone synchronization between cloud server (UTC) and user locale (IST)**
  - Ensures accurate slot availability regardless of deployment environment
  - Converts server time to local time before validating slots
  - Prevents incorrect display of past/future slots due to timezone mismatch

###  Slug-based Public Pages
- Each event has a unique slug
- Example: `/book/60-min-consultation`
- Anyone with the link can book

###  Upcoming & Past Meetings
- Separate views for:
  - Upcoming bookings
  - Past bookings
- Cancel bookings

###  Copy & Share Booking Link
- One-click copy booking URL
- Dynamic URL (works for both localhost & production)

###  Responsive UI
- Built with Tailwind CSS
- Clean modern interface
- Mobile-friendly navigation

---

##  Tech Stack

### Frontend
- React (Vite)
- React Router
- Tailwind CSS
- Axios

### Backend
- FastAPI
- SQLAlchemy ORM
- PostgreSQL (Neon DB)
- Pydantic

### Deployment
- Frontend → Vercel
- Backend → Render
- Database → Neon

---

##  Project Structure

```
root/
├── backend/
│   ├── api/
│   ├── services/
│   ├── models/
│   ├── schemas/
│   └── app.py
│
├── schedify/           (frontend)
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── api/
│       └── App.jsx
│
└── README.md
```

---

##  Setup Instructions
 
###  Backend Setup
 
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app:app --reload
```
 
Once running, the backend will be available at:
- **Local:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs
- **Hosted:** https://finalassignment-2.onrender.com
###  Frontend Setup
 
```bash
cd schedify
npm install
npm run dev
```
 
Once running, the frontend will be available at:
- **Local:** http://localhost:5173
- **Hosted:** https://final-assignment-brown.vercel.app/
>  When running locally, make sure the frontend is pointing to `http://localhost:8000` as the backend URL, not the hosted Render URL.
 
---

##  API Endpoints

### Events

```
GET     /events
POST    /events
PUT     /events/{id}
DELETE  /events/{id}
GET     /events/slug/{slug}
```

### Availability

```
GET     /availability
POST    /availability
DELETE  /availability/{id}
```

### Bookings

```
GET     /bookings/slots
POST    /bookings
GET     /bookings/upcoming
GET     /bookings/past
DELETE  /bookings/{id}
```

---

##  Database Schema
<img width="1352" height="1416" alt="image" src="https://github.com/user-attachments/assets/75481b44-ab9c-4ac5-8ba9-3b661ff99b8c" />

###  Entities

#### Event

| Field | Notes |
|-------|-------|
| `id` | PK |
| `name` | |
| `slug` | UNIQUE |
| `duration` | |

#### Availability

| Field | Notes |
|-------|-------|
| `id` | PK |
| `day_of_week` | |
| `start_time` | |
| `end_time` | |

#### Booking

| Field | Notes |
|-------|-------|
| `id` | PK |
| `event_id` | FK |
| `name` | |
| `email` | |
| `start_time` | |
| `end_time` | |

---


##  Business Logic

Schedify follows a structured scheduling workflow similar to real-world platforms like Calendly.

###  Event Creation
- Users create events with:
  - Name
  - Duration
- A unique **slug** is automatically generated for each event
- Slug is used to create public booking links: `/book/{slug}`

---

###  Availability Management
- Users define weekly availability using:
  - Day of week (0–6)
  - Start time
  - End time
- Multiple availability entries per day are supported

---

###  Slot Generation
- Time slots are dynamically generated based on:
  - Event duration
  - Availability window
- **Example:**
  - Availability: 9:00 – 12:00
  - Duration: 30 mins
  - → Slots: 9:00, 9:30, 10:00, 10:30, 11:00, 11:30

---

###  Real-Time Slot Filtering
Before showing slots to users:
-  Past time slots are removed
-  Already booked slots are removed
-  Only valid future slots are displayed

---

### Booking Flow
1. User opens public booking link (`/book/{slug}`)
2. Selects date & available time slot
3. Submits booking details (name, email)
4. System:
   - Validates slot availability
   - Prevents duplicate bookings
   - Stores booking in database

---

###  Meeting Management
- Upcoming meetings: `start_time >= current time`
- Past meetings: `start_time < current time`
- Users can cancel bookings

---

##  Architecture

The project follows a **layered MVC-inspired architecture** using FastAPI.

###  Model Layer
- Defines database structure using **SQLAlchemy**
- Entities:
  - `Event`
  - `Availability`
  - `Booking`

---

###  Controller Layer (Routes)
- FastAPI routes act as controllers
- Handle HTTP requests and responses
- Key endpoints:
  - `/events`
  - `/availability`
  - `/bookings`

---

###  Service Layer (Business Logic)
- Core logic is implemented in `services/`
- Responsibilities:
  - Slot generation
  - Booking validation
  - Slug creation
- Keeps routes clean and maintainable

---

###  Schema Layer (Pydantic)
- Uses **Pydantic models** for:
  - Request validation
  - Response serialization
- Ensures type safety and clean API contracts
- Prevents invalid data from entering the system

---

###  Async Processing
- FastAPI supports **asynchronous request handling**
- Non-blocking architecture ensures:
  - Faster API response times
  - Better scalability under load

---

###  Frontend (View Layer)
- **React + Tailwind CSS**
- Consumes API endpoints to render dynamic data
- Implements routing for public booking pages

---

###  Architecture Flow

```
Client (React UI)
       ↓
FastAPI Routes (Controller)
       ↓
Service Layer (Business Logic)
       ↓
SQLAlchemy Models (Database)
       ↓
PostgreSQL (Neon DB)
```

---

##  Database Design & PostgreSQL Optimization

The system uses **PostgreSQL (Neon DB)** with an optimized schema design.

###  Normalized Schema
- Data is split into separate tables:
  - `Events`
  - `Availability`
  - `Bookings`
- Avoids redundancy and ensures data consistency

---

###  Indexing
- Indexed columns:
  - `event.slug` → fast lookup for public booking pages
  - `event.id` → primary key access
- Significantly improves query performance at scale

---

###  Efficient Queries
- Filtering is handled **at the database level**:
  - Fetch availability by `day_of_week`
  - Fetch bookings by `event_id`
- Reduces unnecessary data processing in the backend

---

###  Constraint Handling
- Unique slug constraint ensures no duplicate booking URLs
- Application-level validation prevents double booking of the same time slot

---

###  Transaction Safety
- Each booking is committed atomically
- Prevents inconsistent state under concurrent requests

---

###  Time-Based Optimization
- Slot filtering ensures only future slots are processed
- Uses efficient datetime comparisons at the DB level
- Reduces unnecessary computation load

---

###  Scalability Considerations
- Stateless backend (FastAPI) — supports horizontal scaling
- Async-ready architecture
- PostgreSQL handles concurrent transactions efficiently
- Can be extended with:
  - **Redis** for caching
  - **Celery** for background task queues

---

##  Code Quality Principles

###  Low Coupling
- Routes do **not** directly access the database
- All logic is delegated to the service layer
- Each module has a single, clear responsibility

###  High Cohesion
- Each service handles one domain:
  - `booking_service` → booking logic
  - `event_service` → event logic

###  Separation of Concerns

| Layer | Responsibility |
|-------|---------------|
| Models | Database structure |
| Services | Business logic |
| Routes | Request handling |
| Schemas | Validation |

---



