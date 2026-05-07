import { useState } from 'react';
import { timeSlots } from '../data/mockData';
import TimeSlotPicker from './TimeSlotPicker';
import SlipUpload from './SlipUpload';
import { uploadSlip } from '../api';

export default function BookingModal({ field, bookedSlots, onClose, onConfirm, onDateChange }) {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [slipFile, setSlipFile] = useState(null);
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    if (onDateChange) onDateChange(newDate);
  };

  const handleConfirm = async () => {
    if (!date || !timeSlot || !slipFile) return;
    setUploading(true);
    try {
      const { path } = await uploadSlip(slipFile);
      setUploading(false);
      onConfirm({ fieldId: field.id, date, timeSlot, slipFilename: path });
    } catch (err) {
      setUploading(false);
      alert('อัปโหลดสลิปไม่สําเร็จ: ' + err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>จองสนาม {field.name}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1 เลือกเวลา</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2 ชําระเงิน</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3 ยืนยัน</div>
        </div>

        {step === 1 && (
          <div className="modal-body">
            <div className="form-group">
              <label>วันที่ต้องการจอง</label>
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="input-field"
              />
            </div>
            {date && (
              <TimeSlotPicker
                slots={timeSlots}
                selected={timeSlot}
                onSelect={setTimeSlot}
                bookedSlots={bookedSlots}
              />
            )}
            <button
              className="btn-primary full-width"
              disabled={!date || !timeSlot}
              onClick={() => setStep(2)}
            >
              ถัดไป
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="modal-body">
            <div className="payment-info">
              <h3>ข้อมูลการจอง</h3>
              <div className="payment-detail">
                <span>สนาม:</span> <strong>{field.name}</strong>
              </div>
              <div className="payment-detail">
                <span>วันที่:</span> <strong>{date}</strong>
              </div>
              <div className="payment-detail">
                <span>เวลา:</span> <strong>{timeSlot}</strong>
              </div>
              <div className="payment-total">
                <span>ยอดรวม:</span>
                <span className="total-price">{field.price.toLocaleString()} บาท</span>
              </div>
            </div>
            <div className="bank-info">
              <h4>โอนเข้าบัญชี</h4>
              <p>ธนาคารกรุงไทย</p>
              <p>เลขที่: <strong>123-4-56789-0</strong></p>
              <p>ชื่อบัญชี: <strong>KH Arena Co., Ltd.</strong></p>
            </div>
            <SlipUpload onChange={setSlipFile} />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setStep(1)}>ย้อนกลับ</button>
              <button className="btn-primary" disabled={!slipFile} onClick={() => setStep(3)}>ถัดไป</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="modal-body">
            <div className="confirm-summary">
              <div className="summary-item">
                <span>สนาม</span>
                <strong>{field.name}</strong>
              </div>
              <div className="summary-item">
                <span>วันที่</span>
                <strong>{date}</strong>
              </div>
              <div className="summary-item">
                <span>เวลา</span>
                <strong>{timeSlot}</strong>
              </div>
              <div className="summary-item">
                <span>จำนวนเงิน</span>
                <strong className="text-primary">{field.price.toLocaleString()} บาท</strong>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setStep(2)}>ย้อนกลับ</button>
              <button className="btn-primary" disabled={uploading} onClick={handleConfirm}>
                {uploading ? 'กำลังอัปโหลด...' : 'ยืนยันการจอง'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
