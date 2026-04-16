# Schedify — Scheduling Platform Frontend

A clean, modern scheduling UI built with React, Tailwind CSS, and Axios — similar to Calendly.

## Tech Stack
- **React 18** — Functional components + Hooks
- **React Router v6** — Client-side routing
- **Axios** — API calls to `http://127.0.0.1:8000`
- **Tailwind CSS v3** — Utility-first styling
- **Vite** — Fast dev server + build

---

## Project Structure

```
schedify/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── index.jsx          # Entry point
    ├── index.css          # Global styles + Tailwind
    ├── App.jsx            # Router + layout
    ├── api/
    │   └── config.js      # Axios instance + all API functions
    ├── components/
    │   ├── UI.jsx         # Button, Card, Input, Select, Spinner, Toast, Badge, EmptyState
    │   └── Navbar.jsx     # Top navigation bar
    └── pages/
        ├── Home.jsx       # Landing page
        ├── Events.jsx     # Event management (CRUD)
        ├── Availability.jsx # Availability management
        ├── Booking.jsx    # Main booking flow
        └── Meetings.jsx   # Upcoming & past meetings
```

---

## Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```
App runs at: **http://localhost:3000**

### 3. Make sure your backend is running at `http://127.0.0.1:8000`

---

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Landing page with feature overview |
| `/events` | Events | Create, edit, delete event types |
| `/availability` | Availability | Set weekly time slots |
| `/book` | Booking | Guest-facing booking flow |
| `/meetings` | Meetings | View & cancel meetings |

---

## API Endpoints Used

```
GET    /events                          List all events
POST   /events                          Create event
PUT    /events/{id}                     Update event
DELETE /events/{id}                     Delete event

GET    /availability                    List availability slots
POST   /availability                    Add availability slot
DELETE /availability/{id}               Remove slot

GET    /bookings/slots?event_id=&selected_date=   Get available time slots
POST   /bookings                        Create a booking
GET    /bookings/upcoming               Get upcoming bookings
GET    /bookings/past                   Get past bookings
DELETE /bookings/{id}                   Cancel a booking
```

---

## Booking Request Body
```json
{
  "event_id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "start_time": "2025-01-20T10:00:00"
}
```

---

## To change the backend URL
Edit `src/api/config.js`:
```js
const BASE_URL = 'http://127.0.0.1:8000'; // change this
```

---

## Features
- ✅ Full CRUD for Event Types
- ✅ Weekly availability slots (by day + time range)
- ✅ Interactive calendar date picker
- ✅ Real-time slot fetching
- ✅ Booking form with validation
- ✅ Booking success screen
- ✅ Upcoming / Past meetings with cancel
- ✅ Toast notifications
- ✅ Loading spinners
- ✅ Error handling on all API calls
- ✅ Responsive layout
- ✅ Clean Calendly-like UX
