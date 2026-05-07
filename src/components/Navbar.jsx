import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">&#9917;</span>
          <span className="logo-text">KH <span className="logo-accent">ARENA</span></span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">หน้าแรก</Link>

          {currentUser && currentUser.role === 'user' && (
            <Link to="/my-bookings" className="nav-link">การจองของฉัน</Link>
          )}

          {currentUser && currentUser.role === 'owner' && (
            <>
              <Link to="/dashboard" className="nav-link">แดชบอร์ด</Link>
              <Link to="/manage-fields" className="nav-link">จัดการสนาม</Link>
              <Link to="/manage-bookings" className="nav-link">จัดการการจอง</Link>
            </>
          )}
        </div>

        <div className="navbar-auth">
          {currentUser ? (
            <div className="user-menu">
              <span className="user-name">&#9733; {currentUser.name}</span>
              <button className="btn-logout" onClick={handleLogout}>ออกจากระบบ</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/signin" className="btn-signin">เข้าสู่ระบบ</Link>
              <Link to="/signup" className="btn-signup">สมัครสมาชิก</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
