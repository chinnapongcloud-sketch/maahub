import { useRef, useState } from 'react';
import './SlipUpload.css';

export default function SlipUpload({ onChange }) {
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        onChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div className="slip-upload">
      <label className="upload-label">อัปโหลดสลิปการโอนเงิน</label>
      <div
        className={`upload-area ${dragging ? 'dragging' : ''} ${preview ? 'has-preview' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Slip preview" className="slip-preview" />
        ) : (
          <div className="upload-placeholder">
            <span className="upload-icon">&#128247;</span>
            <p>คลิกหรือลากไฟล์มาวางที่นี่</p>
            <span className="upload-hint">รองรับไฟล์ PNG, JPG</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files[0])}
          hidden
        />
      </div>
    </div>
  );
}
