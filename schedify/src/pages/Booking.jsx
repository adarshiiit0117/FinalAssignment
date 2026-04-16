import { useState, useEffect } from 'react';
import { getEvents, getSlots, createBooking } from '../api/config';
import { Button, Card, Input, Spinner, Toast } from '../components/UI';

function formatDateDisplay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatSlotTime(isoStr) {
  return new Date(isoStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getMiniCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Booking() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [form, setForm] = useState({ name: '', email: '' });
  const [formErrors, setFormErrors] = useState({});
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getEvents().then(r => setEvents(r.data)).catch(() => {}).finally(() => setLoadingEvents(false));
  }, []);

  useEffect(() => {
    if (selectedEvent && selectedDate) fetchSlots();
  }, [selectedEvent, selectedDate]);

  async function fetchSlots() {
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot('');
    try {
      const res = await getSlots(selectedEvent.id, selectedDate);
      setSlots(res.data);
    } catch {
      showToast('Could not load slots', 'error');
    } finally {
      setLoadingSlots(false);
    }
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Your name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleBook() {
    if (!validate()) return;
    setBooking(true);
    try {
      await createBooking({
        event_id: selectedEvent.id,
        name: form.name,
        email: form.email,
        start_time: selectedSlot,
      });
      setSuccess({ event: selectedEvent, slot: selectedSlot, ...form });
    } catch (e) {
      showToast(e.response?.data?.detail || 'Booking failed. Please try again.', 'error');
    } finally {
      setBooking(false);
    }
  }

  function resetAll() {
    setSelectedSlot('');
    setSuccess(null);
    setForm({ name: '', email: '' });
    setFormErrors({});
  }

  function showToast(message, type) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  function selectDate(day) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setSelectedSlot('');
  }

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const { firstDay, daysInMonth } = getMiniCalendar(calYear, calMonth);

  // Success screen
  if (success) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">You're booked!</h2>
        <p className="text-gray-500 mb-6">A confirmation has been sent to <strong>{success.email}</strong></p>
        <Card className="p-6 text-left mb-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Event</span>
              <span className="font-medium text-gray-900">{success.event.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">When</span>
              <span className="font-medium text-gray-900">{formatSlotTime(success.slot)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-900">{formatDateDisplay(selectedDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Duration</span>
              <span className="font-medium text-gray-900">{success.event.duration} minutes</span>
            </div>
          </div>
        </Card>
        <div className="flex gap-3 justify-center">
          <Button onClick={resetAll}>Book another</Button>
          <Button variant="secondary" onClick={() => { resetAll(); setSelectedEvent(null); setSelectedDate(''); }}>
            Start over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Book a Meeting</h1>
        <p className="text-gray-500 text-sm mt-1">Pick an event, choose a time, done.</p>
      </div>

      {loadingEvents ? <Spinner /> : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Event Info */}
          <div className="lg:w-72 flex-shrink-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Select event type</p>
            <div className="space-y-2">
              {events.map(event => (
                <button
                  key={event.id}
                  onClick={() => { setSelectedEvent(event); setSelectedSlot(''); setSelectedDate(''); }}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 ${
                    selectedEvent?.id === event.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedEvent?.id === event.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${selectedEvent?.id === event.id ? 'text-blue-700' : 'text-gray-900'}`}>{event.name}</p>
                      <p className="text-xs text-gray-400">{event.duration} minutes</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedEvent && (
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Selected</p>
                <p className="font-semibold text-gray-900">{selectedEvent.name}</p>
                <p className="text-sm text-gray-500">{selectedEvent.duration} min · /{selectedEvent.slug}</p>
              </div>
            )}
          </div>

          {/* Right: Calendar + Slots */}
          {selectedEvent ? (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{MONTH_NAMES[calMonth]} {calYear}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => { const d = new Date(calYear, calMonth - 1); setCalMonth(d.getMonth()); setCalYear(d.getFullYear()); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-600"
                    >‹</button>
                    <button
                      onClick={() => { const d = new Date(calYear, calMonth + 1); setCalMonth(d.getMonth()); setCalYear(d.getFullYear()); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-600"
                    >›</button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                    <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(firstDay)].map((_, i) => <div key={`e-${i}`} />)}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                    const isPast = dateStr < todayStr;
                    const isSelected = dateStr === selectedDate;
                    const isToday = dateStr === todayStr;
                    return (
                      <button
                        key={day}
                        onClick={() => !isPast && selectDate(day)}
                        disabled={isPast}
                        className={`aspect-square text-xs rounded-xl flex items-center justify-center transition-all font-medium ${
                          isPast ? 'text-gray-200 cursor-not-allowed' :
                          isSelected ? 'bg-blue-600 text-white shadow-sm' :
                          isToday ? 'bg-blue-50 text-blue-700 font-bold' :
                          'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                {selectedDate && (
                  <p className="text-xs text-center text-gray-500 mt-3 pt-3 border-t border-gray-50">
                    {formatDateDisplay(selectedDate)}
                  </p>
                )}
              </Card>

              {/* Slots + Form */}
              <div>
                {!selectedDate ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <div className="text-4xl mb-3">📆</div>
                    <p className="text-gray-500 text-sm">Select a date to see available times</p>
                  </div>
                ) : loadingSlots ? (
                  <Spinner />
                ) : slots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <div className="text-4xl mb-3">😔</div>
                    <p className="font-medium text-gray-900 mb-1">No slots available</p>
                    <p className="text-sm text-gray-500">Try a different date</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Available times</p>
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {slots.map((slot, i) => {
                        const startISO = typeof slot === 'string' ? slot : slot.start_time;
                        const isBooked = slot.is_booked;
                        const isSelected = selectedSlot === startISO;
                        return (
                          <button
                            key={i}
                            onClick={() => !isBooked && setSelectedSlot(startISO)}
                            disabled={isBooked}
                            className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                              isBooked ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through' :
                              isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-sm' :
                              'bg-white text-gray-700 border-gray-100 hover:border-blue-300 hover:text-blue-600'
                            }`}
                          >
                            {formatSlotTime(startISO)}
                          </button>
                        );
                      })}
                    </div>

                    {/* Booking form appears after slot selection */}
                    {selectedSlot && (
                      <Card className="p-5 border-blue-100 bg-blue-50/20 animate-fade-in">
                        <h3 className="font-semibold text-gray-900 mb-4 text-sm">Your details</h3>
                        <div className="space-y-3 mb-4">
                          <Input
                            label="Full Name"
                            placeholder="Jane Doe"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            error={formErrors.name}
                          />
                          <Input
                            label="Email Address"
                            type="email"
                            placeholder="jane@example.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            error={formErrors.email}
                          />
                        </div>
                        <div className="flex items-center gap-2 mb-4 p-3 bg-white rounded-xl border border-gray-100 text-xs text-gray-600">
                          <span>🕐</span>
                          <span>{formatSlotTime(selectedSlot)} · {selectedDate} · {selectedEvent.duration} min</span>
                        </div>
                        <Button onClick={handleBook} loading={booking} className="w-full">
                          Confirm Booking
                        </Button>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-4">👆</div>
                <p className="text-gray-500">Select an event type to get started</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
