import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: '⬡' },
  { path: '/events', label: 'Events', icon: '◈' },
  { path: '/availability', label: 'Availability', icon: '◷' },
  { path: '/book', label: 'Book', icon: '◉' },
  { path: '/meetings', label: 'Meetings', icon: '◫' },
];

export default function Navbar() {
  const location = useLocation();
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">Schedify</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.slice(1).map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-1">
          {navItems.slice(1).map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                location.pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
