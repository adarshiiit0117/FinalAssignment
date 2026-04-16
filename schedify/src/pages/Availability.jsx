import { useState, useEffect } from 'react';
import { getAvailability, createAvailability, deleteAvailability } from '../api/config';
import { Button, Card, Input, Select, Spinner, Toast, EmptyState, Badge } from '../components/UI';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_COLORS = ['blue', 'green', 'blue', 'green', 'blue', 'green', 'gray'];

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayH = hour % 12 || 12;
  return `${displayH}:${m} ${ampm}`;
}

export default function Availability() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ day_of_week: '1', start_time: '09:00', end_time: '17:00' });
  const [formErrors, setFormErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchAvailability(); }, []);

  async function fetchAvailability() {
    try {
      setLoading(true);
      const res = await getAvailability();
      setAvailability(res.data);
    } catch {
      showToast('Failed to load availability', 'error');
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    const errs = {};
    if (!form.start_time) errs.start_time = 'Start time required';
    if (!form.end_time) errs.end_time = 'End time required';
    if (form.start_time && form.end_time && form.start_time >= form.end_time) {
      errs.end_time = 'End time must be after start time';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        day_of_week: Number(form.day_of_week),
        start_time: form.start_time + ':00',
        end_time: form.end_time + ':00',
      };
      const res = await createAvailability(payload);
      setAvailability([...availability, res.data]);
      showToast('Availability added!', 'success');
      setShowForm(false);
    } catch (e) {
      showToast(e.response?.data?.detail || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteAvailability(id);
      setAvailability(availability.filter(a => a.id !== id));
      showToast('Removed', 'info');
    } catch {
      showToast('Failed to delete', 'error');
    }
  }

  function showToast(message, type) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  // Group by day
  const grouped = DAYS.map((day, i) => ({
    day, idx: i,
    slots: availability.filter(a => a.day_of_week === i),
  }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          <p className="text-gray-500 text-sm mt-1">Set when you're open for bookings</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Slot'}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6 mb-8 border-blue-100 bg-blue-50/30">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Add Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <Select
              label="Day of Week"
              value={form.day_of_week}
              onChange={e => setForm({ ...form, day_of_week: e.target.value })}
            >
              {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </Select>
            <Input
              label="Start Time"
              type="time"
              value={form.start_time}
              onChange={e => setForm({ ...form, start_time: e.target.value })}
              error={formErrors.start_time}
            />
            <Input
              label="End Time"
              type="time"
              value={form.end_time}
              onChange={e => setForm({ ...form, end_time: e.target.value })}
              error={formErrors.end_time}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSubmit} loading={saving}>Add Availability</Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {loading ? (
        <Spinner />
      ) : availability.length === 0 && !showForm ? (
        <EmptyState icon="🗓️" title="No availability set" description="Add your available time slots so people can book meetings with you." />
      ) : (
        <div className="space-y-3">
          {grouped.map(({ day, idx, slots }) => (
            slots.length > 0 && (
              <Card key={idx} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-xs text-blue-400 font-medium">{DAY_SHORT[idx]}</span>
                    <span className="text-xs text-blue-600 font-bold mt-0.5">{idx}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{day}</h3>
                    <div className="flex flex-wrap gap-2">
                      {slots.map(slot => (
                        <div key={slot.id} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5">
                          <span className="text-sm text-gray-700">
                            {formatTime(slot.start_time)} — {formatTime(slot.end_time)}
                          </span>
                          <button
                            onClick={() => handleDelete(slot.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none ml-1"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )
          ))}
          {/* Show days with no slots as empty rows */}
          <div className="mt-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Days with no availability</p>
            <div className="flex flex-wrap gap-2">
              {grouped.filter(g => g.slots.length === 0).map(({ day, idx }) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2">
                  <span className="text-sm text-gray-400">{day}</span>
                  <Badge color="gray">Closed</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
