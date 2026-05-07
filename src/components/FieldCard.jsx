import { Link } from 'react-router-dom';
import './FieldCard.css';

export default function FieldCard({ field }) {
  return (
    <Link to={`/field/${field.id}`} className="field-card">
      <div className="field-image-wrapper">
        <img src={field.image} alt={field.name} className="field-image" />
        <span className="field-badge">{field.size}</span>
      </div>
      <div className="field-info">
        <h3 className="field-name">{field.name}</h3>
        <p className="field-desc">{field.description}</p>
        <div className="field-footer">
          <span className="field-price">
            <span className="price-amount">{field.price.toLocaleString()}</span>
            <span className="price-unit"> บาท/ชั่วโมง</span>
          </span>
          <span className="field-arrow">&#8594;</span>
        </div>
      </div>
    </Link>
  );
}
