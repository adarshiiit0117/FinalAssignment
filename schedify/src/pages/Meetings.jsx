import { useState, useEffect } from 'react';
import { getUpcomingBookings, getPastBookings, cancelBooking } from '../api/config';
import { Button, Card, Spinner, Toast, EmptyState, Badge } from '../components/UI';

function formatDateTime(iso) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  };
}

function Avatar({ name }) {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const colors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-amber-100 text-amber-700'];
  const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${color}`}>
      {initials}
    </div>
  );
}

function MeetingCard({ meeting, onCancel, isUpcoming }) {
  const { date, time } = formatDateTime(meeting.start_time);
  const [canceling, setCanceling] = useState(false);

  async function handleCancel() {
    if (!confirm('Cancel this meeting?')) return;
    setCanceling(true);
    await onCancel(meeting.id);
    setCanceling(false);
  }

  return (
    <Card hover className="p-5">
      <div className="flex items-start gap-4">
        <Avatar name={meeting.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-900 truncate">{meeting.name}</p>
              <p className="text-sm text-gray-500 truncate">{meeting.email}</p>
            </div>
            {isUpcoming && <Badge color="green">Upcoming</Badge>}
            {!isUpcoming && <Badge color="gray">Past</Badge>}
          </div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{time}</span>
            </div>
            {meeting.event_name && (
              <Badge color="blue">{meeting.event_name}</Badge>
            )}
          </div>
        </div>
        {isUpcoming && (
          <Button size="sm" variant="danger" onClick={handleCancel} loading={canceling}>
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function Meetings() {
  const [tab, setTab] = useState('upcoming');
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [up, pa] = await Promise.all([getUpcomingBookings(), getPastBookings()]);
      setUpcoming(up.data);
      setPast(pa.data);
    } catch {
      showToast('Failed to load meetings', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    try {
      await cancelBooking(id);
      setUpcoming(upcoming.filter(m => m.id !== id));
      showToast('Meeting cancelled', 'info');
    } catch {
      showToast('Failed to cancel', 'error');
    }
  }

  function showToast(message, type) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  const current = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage your scheduled meetings</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{upcoming.length} upcoming</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 w-fit">
        {['upcoming', 'past'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
            <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs ${tab === t ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>
              {t === 'upcoming' ? upcoming.length : past.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : current.length === 0 ? (
        <EmptyState
          icon={tab === 'upcoming' ? '📭' : '📪'}
          title={tab === 'upcoming' ? 'No upcoming meetings' : 'No past meetings'}
          description={tab === 'upcoming' ? 'When someone books with you, they\'ll show up here.' : 'Your completed meetings will appear here.'}
        />
      ) : (
        <div className="space-y-3">
          {current.map(meeting => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              onCancel={handleCancel}
              isUpcoming={tab === 'upcoming'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
