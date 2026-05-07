import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">&#9917; KH ARENA</span>
          <p>สนามฟุตบอลมาตรฐาน พร้อมให้บริการทุกวัน</p>
        </div>
        <div className="footer-info">
          <div className="footer-section">
            <h4>ติดต่อเรา</h4>
            <p>&#9742; 089-999-8888</p>
            <p>&#9993; admin@kharena.com</p>
          </div>
          <div className="footer-section">
            <h4>เวลาทำการ</h4>
            <p>ทุกวัน 08:00 - 22:00</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 KH Arena. All rights reserved.</p>
      </div>
    </footer>
  );
}
