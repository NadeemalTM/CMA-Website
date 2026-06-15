import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus, Edit, Trash2, X } from 'lucide-react';
import { adminApplicationForms, uploadFile } from '../../services/api';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h2 style={{ margin: 0 }}>{title}</h2><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button></div>
      {children}
    </div>
  </div>
);

export default function ApplicationFormsAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title_en: '', title_si: '', title_ta: '', file_path: '', file_type: 'PDF', file_size: '', is_active: true, order: 0 });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => { setLoading(true); adminApplicationForms.list().then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm({ title_en: '', title_si: '', title_ta: '', file_path: '', file_type: 'PDF', file_size: '', is_active: true, order: 0 }); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ title_en: item.title_en||'', title_si: item.title_si||'', title_ta: item.title_ta||'', file_path: item.file_path||'', file_type: item.file_type||'PDF', file_size: item.file_size||'', is_active: item.is_active??true, order: item.order||0 }); setModal(true); };
  const handleSave = async () => { setSaving(true); try { if (editing) await adminApplicationForms.update(editing.id, form); else await adminApplicationForms.create(form); setModal(false); load(); } catch (e) { alert(e.response?.data?.message || 'Error'); } finally { setSaving(false); } };
  const handleDelete = async (id) => { if (!window.confirm('Are you sure you want to delete this form?')) return; try { await adminApplicationForms.remove(id); load(); } catch (e) { alert('Error'); } };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Auto calculate file size in KB or MB
    let sizeStr = '';
    const bytes = file.size;
    if (bytes >= 1048576) {
      sizeStr = (bytes / 1048576).toFixed(1) + ' MB';
    } else {
      sizeStr = (bytes / 1024).toFixed(0) + ' KB';
    }

    setUploading(true);
    try {
      const res = await uploadFile(file);
      setForm(f => ({ ...f, file_path: res.data.path, file_size: sizeStr }));
    } catch (e) {
      alert(e.response?.data?.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}><FileText size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--crimson)' }} />Application Forms</h1>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Form</button>
      </div>

      {loading ? <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div> : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead><tr style={{ background: 'var(--off-white)', textAlign: 'left' }}><th style={{ padding: '0.85rem 1rem' }}>Order</th><th style={{ padding: '0.85rem 1rem' }}>Title</th><th style={{ padding: '0.85rem 1rem' }}>Type</th><th style={{ padding: '0.85rem 1rem' }}>Size</th><th style={{ padding: '0.85rem 1rem' }}>Active</th><th style={{ padding: '0.85rem 1rem' }}>Actions</th></tr></thead>
            <tbody>{items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>{item.order}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{item.title_en}</td>
                <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-crimson">{item.file_type}</span></td>
                <td style={{ padding: '0.75rem 1rem' }}>{item.file_size}</td>
                <td style={{ padding: '0.75rem 1rem' }}><span className={`badge badge-${item.is_active ? 'success' : 'warning'}`}>{item.is_active ? 'Yes' : 'No'}</span></td>
                <td style={{ padding: '0.75rem 1rem' }}><div style={{ display: 'flex', gap: '0.5rem' }}><button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}><Edit size={14} /></button><button className="btn btn-sm" style={{ color: 'var(--error)', border: '1px solid var(--error)' }} onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      <SimpleModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Form' : 'Add Form'}>
        <div className="form-group"><label className="form-label">Title (English) *</label><input className="form-control" value={form.title_en || ''} onChange={e => setForm({...form, title_en: e.target.value})} /></div>
        <div className="form-group"><label className="form-label">Title (Sinhala)</label><input className="form-control" value={form.title_si || ''} onChange={e => setForm({...form, title_si: e.target.value})} /></div>
        <div className="form-group"><label className="form-label">Title (Tamil)</label><input className="form-control" value={form.title_ta || ''} onChange={e => setForm({...form, title_ta: e.target.value})} /></div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">File Type</label><input className="form-control" value={form.file_type || ''} onChange={e => setForm({...form, file_type: e.target.value})} placeholder="e.g. PDF" /></div>
          <div className="form-group"><label className="form-label">File Size</label><input className="form-control" value={form.file_size || ''} onChange={e => setForm({...form, file_size: e.target.value})} placeholder="e.g. 1.2 MB" /></div>
          <div className="form-group"><label className="form-label">Display Order</label><input type="number" className="form-control" value={form.order || 0} onChange={e => setForm({...form, order: parseInt(e.target.value)||0})} /></div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 600, color: 'var(--dark-gray)', display: 'block', marginBottom: '0.5rem' }}>Upload Form Document *</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem 1.2rem', background: 'var(--crimson)', color: '#fff',
              borderRadius: 8, fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <input type="file" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
              {uploading ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <FileText size={18} />}
              {uploading ? 'Uploading...' : 'Choose File'}
            </label>
            {form.file_path && <div style={{ fontSize: '0.85rem', color: 'var(--success)' }}>File uploaded ✓</div>}
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
            <span style={{ fontWeight: 600 }}>Active (Visible to public)</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.title_en || !form.file_path}>
            {saving ? 'Saving...' : 'Save Form'}
          </button>
        </div>
      </SimpleModal>
    </div>
  );
}
