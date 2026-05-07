import { useState, useEffect } from 'react';
import { getBookings, getFields } from '../api';

const statusLabels = { pending: 'รอการยืนยัน', approved: 'ยืนยันแล้ว', rejected: 'ถูกปฏิเสธ' };
const statusColors = { pending: 'warning', approved: 'success', rejected: 'danger' };

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBookings(), getFields()]).then(([bookingsData, fieldsData]) => {
      setBookings(bookingsData);
      setFields(fieldsData);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="my-bookings"><p className="loading-text">กำลังโหลด...</p></div>;

  if (bookings.length === 0) {
    return (
      <div className="my-bookings empty">
        <h2>ยังไม่มีรายการจอง</h2>
        <p>เริ่มต้นจองสนามฟุตบอลได้เลย</p>
      </div>
    );
  }

  return (
    <div className="my-bookings">
      <h2 className="page-title">การจองของฉัน</h2>
      <div className="bookings-list">
        {bookings.map((booking) => {
          const field = fields.find((f) => f.id === booking.field_id);
          return (
            <div key={booking.id} className="booking-card">
              <div className="booking-field-info">
                {field?.image && <img src={field.image} alt={field.name} className="booking-thumb" />}
                <div className="booking-details">
                  <h3>{field?.name}</h3>
                  <p>{booking.booking_date} | {booking.time_slot}</p>
                </div>
              </div>
              <div className="booking-meta">
                <span className={`status-badge ${statusColors[booking.status]}`}>
                  {statusLabels[booking.status]}
                </span>
                <span className="booking-price">{booking.price.toLocaleString()} บาท</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
