import './TimeSlotPicker.css';

export default function TimeSlotPicker({ slots, selected, onSelect, bookedSlots = [] }) {
  return (
    <div className="time-slot-picker">
      <label className="picker-label">เลือกช่วงเวลา</label>
      <div className="slots-grid">
        {slots.map((slot) => {
          const isBooked = bookedSlots.includes(slot);
          const isSelected = selected === slot;
          return (
            <button
              key={slot}
              className={`slot-btn ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
              disabled={isBooked}
              onClick={() => onSelect(slot)}
            >
              {slot}
              {isBooked && <span className="booked-dot" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
