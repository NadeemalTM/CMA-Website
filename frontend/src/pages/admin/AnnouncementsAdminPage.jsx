import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Megaphone, Plus, Edit, Trash2, X } from 'lucide-react';
import { adminAnnouncements } from '../../services/api';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

export default function AnnouncementsAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ text_en: '', text_si: '', text_ta: '', link: '', is_active: true, order: 1 });
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); adminAnnouncements.list().then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm({ text_en: '', text_si: '', text_ta: '', link: '', is_active: true, order: 1 }); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ text_en: item.text_en || '', text_si: item.text_si || '', text_ta: item.text_ta || '', link: item.link || '', is_active: item.is_active ?? true, order: item.order || 1 }); setModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) await adminAnnouncements.update(editing.id, form);
      else await adminAnnouncements.create(form);
      setModal(false); load();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirm_delete'))) return;
    try { await adminAnnouncements.remove(id); load(); } catch (e) { alert('Error deleting'); }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}><Megaphone size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--crimson)' }} />{t('admin.announcements')}</h1>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> {t('admin.add')}</button>
      </div>
      {loading ? <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div> : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead><tr style={{ background: 'var(--off-white)', textAlign: 'left' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Text</th><th style={{ padding: '0.85rem 1rem' }}>Link</th><th style={{ padding: '0.85rem 1rem' }}>Order</th><th style={{ padding: '0.85rem 1rem' }}>Active</th><th style={{ padding: '0.85rem 1rem' }}>Actions</th>
            </tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                  <td style={{ padding: '0.75rem 1rem', maxWidth: 300 }}>{(item.text_en || '').substring(0, 80)}...</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{item.link || '—'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{item.order}</td>
                  <td style={{ padding: '0.75rem 1rem' }}><span className={`badge badge-${item.is_active ? 'success' : 'warning'}`}>{item.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}><Edit size={14} /></button>
                      <button className="btn btn-sm" style={{ color: 'var(--error)', border: '1px solid var(--error)' }} onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <SimpleModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Notice' : 'Add Notice'}>
        <div className="form-group"><label className="form-label" htmlFor="text_en" htmlFor="text_en">Text (English) *</label><textarea id="text_en" name="text_en" className="form-control" rows={3} value={form.text_en || ''} onChange={e => setForm({...form, text_en: e.target.value})} /></div>
        <div className="form-group"><label className="form-label" htmlFor="text_si" htmlFor="text_si">Text (Sinhala)</label><textarea id="text_si" name="text_si" className="form-control" rows={3} value={form.text_si || ''} onChange={e => setForm({...form, text_si: e.target.value})} /></div>
        <div className="form-group"><label className="form-label" htmlFor="text_ta" htmlFor="text_ta">Text (Tamil)</label><textarea id="text_ta" name="text_ta" className="form-control" rows={3} value={form.text_ta || ''} onChange={e => setForm({...form, text_ta: e.target.value})} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label" htmlFor="link" htmlFor="link">Link</label><input id="link" name="link" className="form-control" value={form.link || ''} onChange={e => setForm({...form, link: e.target.value})} /></div>
          <div className="form-group"><label className="form-label" htmlFor="order" htmlFor="order">Order</label><input id="order" name="order" className="form-control" type="number" value={form.order ?? 1} onChange={e => setForm({...form, order: parseInt(e.target.value) || 1})} /></div>
        </div>
        <div className="form-group"><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input id="is_active" name="is_active" type="checkbox" checked={form.is_active ?? true} onChange={e => setForm({...form, is_active: e.target.checked})} /> Active</label></div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn btn-outline" onClick={() => setModal(false)}>{t('admin.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : t('admin.save')}</button>
        </div>
      </SimpleModal>
    </div>
  );
}


