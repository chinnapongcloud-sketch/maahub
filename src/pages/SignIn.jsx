import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignIn.css';

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      navigate(result.user.role === 'owner' ? '/dashboard' : '/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">&#9917;</span>
          <h2>เข้าสู่ระบบ</h2>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ชื่อผู้ใช้</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="กรอกชื่อผู้ใช้"
              required
            />
          </div>
          <div className="form-group">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>
          <button type="submit" className="btn-primary full-width">เข้าสู่ระบบ</button>
        </form>
        <p className="auth-footer">
          ยังไม่มีบัญชี? <Link to="/signup">สมัครสมาชิก</Link>
        </p>
        <div className="demo-hint">
          <p>ทดสอบ: user / 1234 หรือ owner / 1234</p>
        </div>
      </div>
    </div>
  );
}
