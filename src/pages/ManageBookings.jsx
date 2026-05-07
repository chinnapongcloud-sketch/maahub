import { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus, getFields } from '../api';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [fields, setFields] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([getBookings(), getFields()]).then(([bookingsData, fieldsData]) => {
      setBookings(bookingsData);
      setFields(fieldsData);
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, []);

  const handleAction = async (id, action) => {
    await updateBookingStatus(id, action);
    loadData();
  };

  if (loading) return <div className="manage-bookings"><p className="loading-text">กำลังโหลด...</p></div>;

  return (
    <div className="manage-bookings">
      <h2 className="page-title">จัดการการจอง</h2>

      <div className="filter-tabs">
        <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          ทั้งหมด ({bookings.length})
        </button>
        <button className={`tab ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
          รออนุมัติ ({bookings.filter((b) => b.status === 'pending').length})
        </button>
        <button className={`tab ${filter === 'approved' ? 'active' : ''}`} onClick={() => setFilter('approved')}>
          อนุมัติแล้ว ({bookings.filter((b) => b.status === 'approved').length})
        </button>
        <button className={`tab ${filter === 'rejected' ? 'active' : ''}`} onClick={() => setFilter('rejected')}>
          ปฏิเสธ ({bookings.filter((b) => b.status === 'rejected').length})
        </button>
      </div>

      {bookings.length === 0 ? (
        <p className="empty-state">ไม่มีรายการ</p>
      ) : (
        <div className="bookings-admin-list">
          {(filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)).map((booking) => {
            const field = fields.find((f) => f.id === booking.field_id);
            return (
              <div key={booking.id} className="booking-admin-card">
                <div className="booking-admin-header">
                  <div>
                    <h3>{field?.name}</h3>
                    <p className="booking-admin-user">{booking.user_name}</p>
                  </div>
                  <span className={`status-badge ${booking.status === 'approved' ? 'success' : booking.status === 'rejected' ? 'danger' : 'warning'}`}>
                    {booking.status === 'pending' ? 'รออนุมัติ' : booking.status === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}
                  </span>
                </div>
                <div className="booking-admin-details">
                  <span>&#128197; {booking.booking_date}</span>
                  <span>&#128337; {booking.time_slot}</span>
                  <span className="booking-admin-price">{booking.price.toLocaleString()} บาท</span>
                </div>
                {booking.slip_image && (
                  <div className="slip-link">
                    <a href={booking.slip_image.startsWith('/') ? booking.slip_image : `/api${booking.slip_image}`} target="_blank" rel="noreferrer">
                      ดูสลิป &#128064;
                    </a>
                  </div>
                )}
                {booking.status === 'pending' && (
                  <div className="booking-admin-actions">
                    <button className="btn-approve" onClick={() => handleAction(booking.id, 'approved')}>
                      &#10003; อนุมัติ
                    </button>
                    <button className="btn-reject" onClick={() => handleAction(booking.id, 'rejected')}>
                      &#10007; ปฏิเสธ
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
