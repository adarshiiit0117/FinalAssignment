import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Availability from './pages/Availability';
import Booking from './pages/Booking';
import SlugBooking from './pages/SlugBooking';
import Meetings from './pages/Meetings';
 
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/availability" element={<Availability />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/book/:slug" element={<SlugBooking />} />
            <Route path="/meetings" element={<Meetings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}