import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignUp.css';

export default function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', name: '', phone: '', email: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 4) {
      setError('รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร');
      return;
    }
    const result = await register(form);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <span className="auth-icon">&#128221;</span>
          <h2>สมัครสมาชิก</h2>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ชื่อผู้ใช้</label>
            <input type="text" name="username" value={form.username} onChange={handleChange} className="input-field" required />
          </div>
          <div className="form-group">
            <label>รหัสผ่าน</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="input-field" required />
          </div>
          <div className="form-group">
            <label>ชื่อ-นามสกุล</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>เบอร์โทร</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input-field" required />
            </div>
            <div className="form-group">
              <label>อีเมล</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" required />
            </div>
          </div>
          <button type="submit" className="btn-primary full-width">สมัครสมาชิก</button>
        </form>
        <p className="auth-footer">
          มีบัญชีอยู่แล้ว? <Link to="/signin">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}
