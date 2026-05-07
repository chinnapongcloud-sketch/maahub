import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { timeSlots } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { getField, getBookedSlots, createBooking } from '../api';
import BookingModal from '../components/BookingModal';
import './FieldDetail.css';

export default function FieldDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [field, setField] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getField(id).then((data) => {
      setField(data);
      setLoading(false);
    });
  }, [id]);

  const handleDateChange = (date) => {
    getBookedSlots(id, date).then(setBookedSlots);
  };

  const handleBooking = async (bookingData) => {
    try {
      await createBooking({
        ...bookingData,
        slipImage: bookingData.slipFilename || '',
      });
      setShowBooking(false);
      alert('จองสนามสําเร็จ! รอการยืนยันจากเจ้าของสนาม');
      navigate('/my-bookings');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="field-detail"><p className="loading-text">กำลังโหลด...</p></div>;
  if (!field) {
    return (
      <div className="field-detail not-found">
        <h2>ไม่พบสนามนี้</h2>
        <button className="btn-primary" onClick={() => navigate('/')}>กลับหน้าแรก</button>
      </div>
    );
  }

  return (
    <div className="field-detail">
      <div className="detail-hero" style={{ backgroundImage: `url(${field.image})` }}>
        <div className="detail-hero-overlay">
          <button className="back-btn" onClick={() => navigate('/')}>&#8592; กลับ</button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-header">
            <span className="detail-badge">{field.size}</span>
            <h1>{field.name}</h1>
            <p className="detail-desc">{field.description}</p>
          </div>

          <div className="facilities-section">
            <h3>สิ่งอํานวยความสะดวก</h3>
            <div className="facilities-grid">
              {field.facilities?.map((f) => (
                <div key={f} className="facility-item">
                  <span className="facility-icon">&#10003;</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="price-card">
            <div className="price-amount-large">
              {field.price.toLocaleString()}
              <span className="price-unit"> บาท/ชม.</span>
            </div>
            <button
              className="btn-primary full-width"
              onClick={() => {
                if (!currentUser) {
                  navigate('/signin');
                  return;
                }
                setShowBooking(true);
              }}
            >
              {currentUser ? 'จองเลย' : 'เข้าสู่ระบบเพื่อจอง'}
            </button>
          </div>

          <div className="available-slots">
            <h3>เวลาที่ว่างวันนี้</h3>
            <div className="mini-slots">
              {timeSlots.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                return (
                  <span key={slot} className={`mini-slot ${isBooked ? 'booked' : ''}`}>
                    {slot}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          field={field}
          bookedSlots={bookedSlots}
          onClose={() => setShowBooking(false)}
          onConfirm={handleBooking}
          onDateChange={handleDateChange}
        />
      )}
    </div>
  );
}
