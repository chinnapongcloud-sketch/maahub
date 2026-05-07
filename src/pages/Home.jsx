import { useState, useEffect } from 'react';
import FieldCard from '../components/FieldCard';
import ChatWidget from '../components/ChatWidget';
import { getFields } from '../api';

export default function Home() {
  const [fields, setFields] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFields().then(setFields).finally(() => setLoading(false));
  }, []);

  const sizes = ['all', ...new Set(fields.map((f) => f.size))];
  const filtered = filter === 'all' ? fields : fields.filter((f) => f.size === filter);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-icon">&#9917;</span> KH ARENA
          </h1>
          <p className="hero-subtitle">สนามฟุตบอลมาตรฐาน พร้อมให้บริการทุกวัน</p>
          <p className="hero-desc">
            เลือกสนามที่เหมาะกับทีมของคุณ จองง่าย สะดวก รวดเร็ว
          </p>
          <a href="#fields" className="hero-cta">ดูสนามทั้งหมด</a>
        </div>
        <div className="hero-stripe" />
      </section>

      <section id="fields" className="fields-section">
        <div className="section-header">
          <h2>สนามของเรา</h2>
          <div className="filter-buttons">
            {sizes.map((size) => (
              <button
                key={size}
                className={`filter-btn ${filter === size ? 'active' : ''}`}
                onClick={() => setFilter(size)}
              >
                {size === 'all' ? 'ทั้งหมด' : size}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <p className="loading-text">กำลังโหลดสนาม...</p>
        ) : (
          <div className="fields-grid">
            {filtered.map((field) => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>
        )}
      </section>
      <ChatWidget />
    </div>
  );
}
