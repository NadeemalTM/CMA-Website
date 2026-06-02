import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus, Edit, Trash2, X } from 'lucide-react';
import { adminDocuments } from '../../services/api';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h2 style={{ margin: 0 }}>{title}</h2><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button></div>
      {children}
    </div>
  </div>
);

export default function DocumentsAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title_en: '', title_si: '', title_ta: '', type: 'law', category: '', file_path: '', language: 'en', year: 2025, is_active: true });
  const [saving, setSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');

  const load = () => { setLoading(true); adminDocuments.list({ type: typeFilter || undefined }).then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, [typeFilter]);

  const openNew = () => { setEditing(null); setForm({ title_en: '', title_si: '', title_ta: '', type: 'law', category: '', file_path: '', language: 'en', year: 2025, is_active: true }); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ title_en: item.title_en||'', title_si: item.title_si||'', title_ta: item.title_ta||'', type: item.type||'law', category: item.category||'', file_path: item.file_path||'', language: item.language||'en', year: item.year||2025, is_active: item.is_active??true }); setModal(true); };
  const handleSave = async () => { setSaving(true); try { if (editing) await adminDocuments.update(editing.id, form); else await adminDocuments.create(form); setModal(false); load(); } catch (e) { alert(e.response?.data?.message || 'Error'); } finally { setSaving(false); } };
  const handleDelete = async (id) => { if (!window.confirm(t('admin.confirm_delete'))) return; try { await adminDocuments.remove(id); load(); } catch (e) { alert('Error'); } };

  const docTypes = ['', 'law', 'publication', 'form', 'gazette', 'annual_report'];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}><FileText size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--crimson)' }} />{t('admin.documents')}</h1>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> {t('admin.add')}</button>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {docTypes.map(tp => <button key={tp} className={`btn btn-sm ${typeFilter === tp ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTypeFilter(tp)}>{tp || 'All'}</button>)}
      </div>
      {loading ? <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div> : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead><tr style={{ background: 'var(--off-white)', textAlign: 'left' }}><th style={{ padding: '0.85rem 1rem' }}>Title</th><th style={{ padding: '0.85rem 1rem' }}>Type</th><th style={{ padding: '0.85rem 1rem' }}>Year</th><th style={{ padding: '0.85rem 1rem' }}>Lang</th><th style={{ padding: '0.85rem 1rem' }}>Active</th><th style={{ padding: '0.85rem 1rem' }}>Actions</th></tr></thead>
            <tbody>{items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>{item.title_en}</td>
                <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-crimson">{item.type}</span></td>
                <td style={{ padding: '0.75rem 1rem' }}>{item.year}</td>
                <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-gold">{(item.language||'').toUpperCase()}</span></td>
                <td style={{ padding: '0.75rem 1rem' }}><span className={`badge badge-${item.is_active ? 'success' : 'warning'}`}>{item.is_active ? 'Yes' : 'No'}</span></td>
                <td style={{ padding: '0.75rem 1rem' }}><div style={{ display: 'flex', gap: '0.5rem' }}><button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}><Edit size={14} /></button><button className="btn btn-sm" style={{ color: 'var(--error)', border: '1px solid var(--error)' }} onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <SimpleModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Document' : 'Add Document'}>
        <div className="form-group"><label className="form-label">Title (English) *</label><input className="form-control" value={form.title_en || ''} onChange={e => setForm({...form, title_en: e.target.value})} /></div>
        <div className="form-group"><label className="form-label">Title (Sinhala)</label><input className="form-control" value={form.title_si || ''} onChange={e => setForm({...form, title_si: e.target.value})} /></div>
        <div className="form-group"><label className="form-label">Title (Tamil)</label><input className="form-control" value={form.title_ta || ''} onChange={e => setForm({...form, title_ta: e.target.value})} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Type</label><select className="form-control" value={form.type || 'law'} onChange={e => setForm({...form, type: e.target.value})}><option value="law">Law</option><option value="publication">Publication</option><option value="form">Form</option><option value="gazette">Gazette</option><option value="annual_report">Annual Report</option></select></div>
          <div className="form-group"><label className="form-label">Category</label><input className="form-control" value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})} /></div>
        </div>
        <div className="form-group"><label className="form-label">File Path</label><input className="form-control" value={form.file_path || ''} onChange={e => setForm({...form, file_path: e.target.value})} placeholder="documents/filename.pdf" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Language</label><select className="form-control" value={form.language || 'en'} onChange={e => setForm({...form, language: e.target.value})}><option value="en">English</option><option value="si">Sinhala</option><option value="ta">Tamil</option><option value="all">All</option></select></div>
          <div className="form-group"><label className="form-label">Year</label><input className="form-control" type="number" value={form.year ?? 2025} onChange={e => setForm({...form, year: parseInt(e.target.value) || 2025})} /></div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={form.is_active ?? true} onChange={e => setForm({...form, is_active: e.target.checked})} /> Active</label></div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn btn-outline" onClick={() => setModal(false)}>{t('admin.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : t('admin.save')}</button>
        </div>
      </SimpleModal>
    </div>
  );
}
