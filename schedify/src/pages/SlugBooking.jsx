import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSlots, createBooking } from '../api/config';
import { api } from '../api/config';
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
 
export default function SlugBooking() {
  const { slug } = useParams();
 
  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [notFound, setNotFound] = useState(false);
 
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
 
  // Fetch event by slug on mount
  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await api.get(`/events/slug/${slug}`);
        setEvent(res.data);
      } catch (e) {
        if (e.response?.status === 404) setNotFound(true);
        else showToast('Failed to load event', 'error');
      } finally {
        setLoadingEvent(false);
      }
    }
    fetchEvent();
  }, [slug]);
 
  useEffect(() => {
    if (event && selectedDate) fetchSlots();
  }, [event, selectedDate]);
 
  async function fetchSlots() {
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot('');
    try {
      const res = await getSlots(event.id, selectedDate);
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
        event_id: event.id,
        name: form.name,
        email: form.email,
        start_time: selectedSlot,
      });
      setSuccess({ event, slot: selectedSlot, ...form });
    } catch (e) {
      showToast(e.response?.data?.detail || 'Booking failed. Please try again.', 'error');
    } finally {
      setBooking(false);
    }
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
 
  // ── Loading state ──
  if (loadingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
 
  // ── 404 state ──
  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
          <p className="text-gray-500 mb-6">
            No booking page found for <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">{slug}</code>.
            The link may be invalid or the event was deleted.
          </p>
          <a href="/" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            Go home
          </a>
        </div>
      </div>
    );
  }
 
  // ── Success screen ──
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You're booked!</h2>
          <p className="text-gray-500 mb-6">
            A confirmation will be sent to <strong>{success.email}</strong>
          </p>
          <Card className="p-6 text-left mb-6">
            <div className="space-y-3">
              {[
                ['Event', success.event.name],
                ['Date', formatDateDisplay(selectedDate)],
                ['Time', formatSlotTime(success.slot)],
                ['Duration', `${success.event.duration} minutes`],
                ['Name', success.name],
                ['Email', success.email],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </Card>
          <button
            onClick={() => { setSuccess(null); setSelectedSlot(''); setSelectedDate(''); setForm({ name: '', email: '' }); }}
            className="text-sm text-blue-600 hover:underline"
          >
            Book another time
          </button>
        </div>
      </div>
    );
  }
 
  // ── Main booking page ──
  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
 
      <div className="max-w-4xl mx-auto">
        {/* Event header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
          <p className="text-gray-500 mt-1">{event.duration} minutes · Video Call</p>
        </div>
 
        <Card className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Select a date</p>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{MONTH_NAMES[calMonth]} {calYear}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => { const d = new Date(calYear, calMonth - 1); setCalMonth(d.getMonth()); setCalYear(d.getFullYear()); }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-600 text-lg"
                  >‹</button>
                  <button
                    onClick={() => { const d = new Date(calYear, calMonth + 1); setCalMonth(d.getMonth()); setCalYear(d.getFullYear()); }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-600 text-lg"
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
                <p className="text-xs text-center text-blue-600 font-medium mt-3 pt-3 border-t border-gray-100">
                  {formatDateDisplay(selectedDate)}
                </p>
              )}
            </div>
 
            {/* Right: Slots or form */}
            <div>
              {!selectedDate ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                  <div className="text-4xl mb-3">📆</div>
                  <p className="text-gray-500 text-sm">Pick a date on the left to see available times</p>
                </div>
              ) : loadingSlots ? (
                <Spinner />
              ) : slots.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                  <div className="text-4xl mb-3">😔</div>
                  <p className="font-medium text-gray-900 mb-1">No times available</p>
                  <p className="text-sm text-gray-500">Please try a different date</p>
                </div>
              ) : !selectedSlot ? (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    {formatDateDisplay(selectedDate)}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {slots.map((slot, i) => {
                      const startISO = typeof slot === 'string' ? slot : slot.start_time;
                      const isBooked = slot.is_booked;
                      return (
                        <button
                          key={i}
                          onClick={() => !isBooked && setSelectedSlot(startISO)}
                          disabled={isBooked}
                          className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                            isBooked
                              ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through'
                              : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                          }`}
                        >
                          {formatSlotTime(startISO)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Booking form after slot selected */
                <div className="animate-fade-in">
                  <button
                    onClick={() => setSelectedSlot('')}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mb-4"
                  >
                    ← {formatSlotTime(selectedSlot)}
                  </button>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Your details</p>
                  <div className="space-y-3 mb-5">
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
                  <div className="bg-blue-50 rounded-xl p-3 mb-5 text-xs text-blue-700 space-y-1">
                    <div className="flex justify-between"><span>Event</span><strong>{event.name}</strong></div>
                    <div className="flex justify-between"><span>Date</span><strong>{formatDateDisplay(selectedDate)}</strong></div>
                    <div className="flex justify-between"><span>Time</span><strong>{formatSlotTime(selectedSlot)}</strong></div>
                    <div className="flex justify-between"><span>Duration</span><strong>{event.duration} min</strong></div>
                  </div>
                  <Button onClick={handleBook} loading={booking} className="w-full">
                    Confirm Booking
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
 
        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by <span className="font-semibold text-gray-500">Schedify</span>
        </p>
      </div>
    </div>
  );
}
 