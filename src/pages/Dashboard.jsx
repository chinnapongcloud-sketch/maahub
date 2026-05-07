import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFields, getBookings } from '../api';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalFields: 0, pendingBookings: 0, totalRevenue: 0, recentBookings: [] });
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFields(), getBookings()]).then(([fieldsData, bookingsData]) => {
      const pending = bookingsData.filter((b) => b.status === 'pending').length;
      const approved = bookingsData.filter((b) => b.status === 'approved').length;
      const revenue = bookingsData
        .filter((b) => b.status === 'approved')
        .reduce((sum, b) => sum + b.price, 0);

      setStats({
        totalFields: fieldsData.length,
        pendingBookings: pending,
        totalRevenue: revenue,
        recentBookings: bookingsData.slice(0, 5),
        approvedBookings: approved,
        totalBookings: bookingsData.length,
      });
      setFields(fieldsData);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="dashboard"><p className="loading-text">กำลังโหลด...</p></div>;

  const statsList = [
    { label: 'สนามทั้งหมด', value: stats.totalFields, icon: 'stadium', link: '/manage-fields', gradient: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)' },
    { label: 'รออนุมัติ', value: stats.pendingBookings, icon: 'clock', link: '/manage-bookings', gradient: 'linear-gradient(135deg, #F57F17 0%, #E65100 100%)' },
    { label: 'อนุมัติแล้ว', value: stats.approvedBookings, icon: 'check', link: '/manage-bookings', gradient: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' },
    { label: 'รายได้รวม', value: `${stats.totalRevenue.toLocaleString()} ฿`, icon: 'revenue', link: '/manage-bookings', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <div className="dashboard-hero-content">
          <p className="dashboard-greeting">สวัสดีครับ ยินดีต้อนรับ</p>
          <h1 className="dashboard-title">KH ARENA <span className="title-badge">OWNER</span></h1>
          <p className="dashboard-subtitle">ศูนย์ควบคุมและจัดการสนามฟุตบอล</p>
        </div>
        <div className="dashboard-hero-pattern" />
      </div>

      <div className="stats-grid">
        {statsList.map((stat) => (
          <Link key={stat.label} to={stat.link} className="stat-card">
            <div className="stat-card-bg" style={{ background: stat.gradient }} />
            <div className="stat-card-content">
              <div className="stat-icon-wrap">
                {stat.icon === 'stadium' && <span className="stat-icon">&#9917;</span>}
                {stat.icon === 'clock' && <span className="stat-icon">&#9203;</span>}
                {stat.icon === 'check' && <span className="stat-icon">&#10003;</span>}
                {stat.icon === 'revenue' && <span className="stat-icon">&#128176;</span>}
              </div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-title">
            <h3>การจองล่าสุด</h3>
            <Link to="/manage-bookings" className="view-all-link">ดูทั้งหมด &#8594;</Link>
          </div>
          <div className="bookings-table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>สนาม</th>
                  <th>วันที่</th>
                  <th>ลูกค้า</th>
                  <th>เวลา</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((b) => {
                  const field = fields.find((f) => f.id === b.field_id);
                  return (
                    <tr key={b.id}>
                      <td className="td-field">{field?.name}</td>
                      <td>{b.booking_date}</td>
                      <td>{b.user_name}</td>
                      <td className="td-time">{b.time_slot}</td>
                      <td>
                        <span className={`status-pill ${b.status === 'approved' ? 'approved' : b.status === 'rejected' ? 'rejected' : 'pending'}`}>
                          {b.status === 'pending' ? 'รอตรวจ' : b.status === 'approved' ? 'ผ่าน' : 'ไม่ผ่าน'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
