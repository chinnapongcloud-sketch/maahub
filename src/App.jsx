import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import FieldDetail from './pages/FieldDetail';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/Dashboard';
import ManageFields from './pages/ManageFields';
import ManageBookings from './pages/ManageBookings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/field/:id" element={<FieldDetail />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/manage-fields" element={<ManageFields />} />
              <Route path="/manage-bookings" element={<ManageBookings />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
