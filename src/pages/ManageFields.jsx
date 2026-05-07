import { useState, useEffect } from 'react';
import { getFields, createField, updateField, deleteField } from '../api';

export default function ManageFields() {
  const [fields, setFields] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', size: '5-a-side', price: '', image: '', description: '' });

  useEffect(() => {
    getFields().then(setFields);
  }, []);

  const openAdd = () => {
    setForm({ name: '', size: '5-a-side', price: '', image: '', description: '' });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (field) => {
    setForm({ ...field, facilities: field.facilities || [] });
    setEditing(field.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('ต้องการลบสนามนี้?')) {
      await deleteField(id);
      setFields(fields.filter((f) => f.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      const updated = await updateField(editing, form);
      setFields(fields.map((f) => (f.id === editing ? updated : f)));
    } else {
      const created = await createField({ ...form, facilities: [] });
      setFields([...fields, created]);
    }
    setShowForm(false);
  };

  return (
    <div className="manage-fields">
      <div className="page-header">
        <h2 className="page-title">จัดการสนาม</h2>
        <button className="btn-primary" onClick={openAdd}>+ เพิ่มสนาม</button>
      </div>

      <div className="fields-admin-grid">
        {fields.map((field) => (
          <div key={field.id} className="field-admin-card">
            <img src={field.image} alt={field.name} className="field-admin-img" />
            <div className="field-admin-info">
              <h3>{field.name}</h3>
              <span className="field-admin-size">{field.size}</span>
              <p className="field-admin-price">{field.price.toLocaleString()} บาท/ชม.</p>
              <div className="field-admin-actions">
                <button className="btn-edit" onClick={() => openEdit(field)}>แก้ไข</button>
                <button className="btn-delete" onClick={() => handleDelete(field.id)}>ลบ</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'แก้ไขสนาม' : 'เพิ่มสนามใหม่'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>ชื่อสนาม</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
              </div>
              <div className="form-group">
                <label>ขนาดสนาม</label>
                <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="input-field">
                  <option value="5-a-side">5 คน</option>
                  <option value="7-a-side">7 คน</option>
                  <option value="11-a-side">11 คน</option>
                </select>
              </div>
              <div className="form-group">
                <label>ราคา (บาท/ชม.)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input-field" required />
              </div>
              <div className="form-group">
                <label>URL รูปภาพ</label>
                <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input-field" />
              </div>
              <div className="form-group">
                <label>รายละเอียด</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows="3" />
              </div>
              <button type="submit" className="btn-primary full-width">{editing ? 'บันทึก' : 'เพิ่มสนาม'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
