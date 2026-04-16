import { Link } from 'react-router-dom';

export default function Home() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Flexible Event Types',
      desc: 'Create unlimited meeting types — demos, calls, interviews — with custom durations and unique booking links.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Smart Availability',
      desc: 'Set your weekly availability and Schedify automatically computes open slots, preventing double-bookings.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Instant Confirmations',
      desc: 'Guests book in seconds. Everyone gets instant confirmation and a clean record of all upcoming meetings.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: 'Meeting History',
      desc: 'View upcoming and past meetings at a glance. Cancel or reschedule with one click from your dashboard.',
    },
  ];

  const steps = [
    { num: '01', title: 'Set your availability', desc: 'Define which days and hours you are open for meetings.' },
    { num: '02', title: 'Create event types', desc: 'Build different meeting types with custom durations.' },
    { num: '03', title: 'Share your link', desc: 'Send your booking page link to anyone, anywhere.' },
    { num: '04', title: 'Meet seamlessly', desc: 'Guests book, you get notified. Zero back-and-forth.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-b from-blue-50/60 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Scheduling made effortless
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Book meetings<br />
            <span className="text-blue-600">without the chaos</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Schedify gives you a smart, clean booking experience. Set your availability, create event types, and let people schedule time with you — no back-and-forth emails.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book"
              className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-base"
            >
              Book a meeting →
            </Link>
            <Link
              to="/events"
              className="px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all text-base"
            >
              Manage events
            </Link>
          </div>
        </div>

        {/* Mockup card */}
        <div className="max-w-2xl mx-auto mt-16">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-60"></div>
            <div className="relative grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">30 Min Call</p>
                    <p className="text-xs text-gray-500">30 minutes · Video</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Select a date</p>
                <div className="grid grid-cols-7 gap-1 text-xs text-center text-gray-500 mb-2">
                  {['S','M','T','W','T','F','S'].map((d,i) => <span key={i} className="font-medium">{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-center">
                  {[...Array(31)].map((_, i) => (
                    <button key={i} className={`aspect-square flex items-center justify-center rounded-lg text-xs transition-colors ${i+1 === 15 ? 'bg-blue-600 text-white font-semibold' : i+1 < 10 ? 'text-gray-300' : 'text-gray-700 hover:bg-blue-50'}`}>
                      {i+1}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Available times</p>
                <div className="space-y-2">
                  {['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM'].map((t, i) => (
                    <button key={t} className={`w-full py-2 rounded-xl text-sm font-medium border transition-colors ${i===1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to schedule better</h2>
            <p className="text-gray-500 text-lg">Powerful tools, minimal interface, zero friction.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500 text-lg">Up and running in under 5 minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-sm">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to simplify scheduling?</h2>
          <p className="text-gray-500 mb-8">Start managing your events and let people book time with you instantly.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/availability" className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Set availability →
            </Link>
            <Link to="/book" className="px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all">
              View booking page
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Schedify. Built with care.</p>
      </footer>
    </div>
  );
}
