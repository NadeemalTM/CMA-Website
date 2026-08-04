import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderOpen, Plus, Edit, Trash2, X } from 'lucide-react';
import { adminProjects, uploadFile, getStorageURL } from '../../services/api';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h2 style={{ margin: 0 }}>{title}</h2><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button></div>
      {children}
    </div>
  </div>
);

export default function ProjectsAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title_en: '', title_si: '', title_ta: '', description_en: '', description_si: '', description_ta: '', image: '', status: 'ongoing', location: '', start_date: '', end_date: '', is_active: true });
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); adminProjects.list().then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm({ title_en: '', title_si: '', title_ta: '', description_en: '', description_si: '', description_ta: '', image: '', status: 'ongoing', location: '', start_date: '', end_date: '', is_active: true }); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ title_en: item.title_en||'', title_si: item.title_si||'', title_ta: item.title_ta||'', description_en: item.description_en||'', description_si: item.description_si||'', description_ta: item.description_ta||'', image: item.image||'', status: item.status||'ongoing', location: item.location||'', start_date: item.start_date ? item.start_date.split('T')[0] : '', end_date: item.end_date ? item.end_date.split('T')[0] : '', is_active: item.is_active??true }); setModal(true); };
  const handleSave = async () => { setSaving(true); try { if (editing) await adminProjects.update(editing.id, form); else await adminProjects.create(form); setModal(false); load(); } catch (e) { alert(e.response?.data?.message || 'Error'); } finally { setSaving(false); } };
  const handleDelete = async (id) => { if (!window.confirm(t('admin.confirm_delete'))) return; try { await adminProjects.remove(id); load(); } catch (e) { alert('Error'); } };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}><FolderOpen size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--crimson)' }} />{t('admin.projects')}</h1>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> {t('admin.add')}</button>
      </div>
      {loading ? <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div> : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead><tr style={{ background: 'var(--off-white)', textAlign: 'left' }}><th style={{ padding: '0.85rem 1rem' }}>Title</th><th style={{ padding: '0.85rem 1rem' }}>Status</th><th style={{ padding: '0.85rem 1rem' }}>Location</th><th style={{ padding: '0.85rem 1rem' }}>Start Date</th><th style={{ padding: '0.85rem 1rem' }}>Active</th><th style={{ padding: '0.85rem 1rem' }}>Actions</th></tr></thead>
            <tbody>{items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{item.title_en}</td>
                <td style={{ padding: '0.75rem 1rem' }}><span className={`badge badge-${item.status === 'completed' ? 'success' : item.status === 'ongoing' ? 'gold' : 'crimson'}`}>{item.status}</span></td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{item.location || '—'}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{item.start_date || '—'}</td>
                <td style={{ padding: '0.75rem 1rem' }}><span className={`badge badge-${item.is_active ? 'success' : 'warning'}`}>{item.is_active ? 'Yes' : 'No'}</span></td>
                <td style={{ padding: '0.75rem 1rem' }}><div style={{ display: 'flex', gap: '0.5rem' }}><button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}><Edit size={14} /></button><button className="btn btn-sm" style={{ color: 'var(--error)', border: '1px solid var(--error)' }} onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <SimpleModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Project' : 'Add Project'}>
        <div className="form-group"><label className="form-label" htmlFor="title_en" htmlFor="title_en">Title (English) *</label><input id="title_en" name="title_en" className="form-control" value={form.title_en || ''} onChange={e => setForm({...form, title_en: e.target.value})} /></div>
        <div className="form-group"><label className="form-label" htmlFor="title_si" htmlFor="title_si">Title (Sinhala)</label><input id="title_si" name="title_si" className="form-control" value={form.title_si || ''} onChange={e => setForm({...form, title_si: e.target.value})} /></div>
        <div className="form-group"><label className="form-label" htmlFor="title_ta" htmlFor="title_ta">Title (Tamil)</label><input id="title_ta" name="title_ta" className="form-control" value={form.title_ta || ''} onChange={e => setForm({...form, title_ta: e.target.value})} /></div>
        <div className="form-group"><label className="form-label" htmlFor="description_en" htmlFor="description_en">Description (English)</label><textarea id="description_en" name="description_en" className="form-control" rows={4} value={form.description_en || ''} onChange={e => setForm({...form, description_en: e.target.value})} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label" htmlFor="status" htmlFor="status">Status</label><select id="status" name="status" className="form-control" value={form.status || 'ongoing'} onChange={e => setForm({...form, status: e.target.value})}><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="planned">Planned</option></select></div>
          <div className="form-group"><label className="form-label" htmlFor="location" htmlFor="location">Location</label><input id="location" name="location" className="form-control" value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} /></div>
        </div>
        <div className="form-group">
          <label className="form-label">Project Image</label>
          {form.image && <img src={form.image.startsWith('http') ? form.image : getStorageURL(form.image)} alt="Preview" style={{ display: 'block', height: 80, borderRadius: 4, marginBottom: 8 }} />}
          <input className="form-control" type="file" accept="image/*" onChange={async e => {
            if (e.target.files[0]) {
              try {
                const res = await uploadFile(e.target.files[0], 'projects');
                setForm({...form, image: res.data.path});
              } catch(err) { alert('Upload failed'); }
            }
          }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label" htmlFor="start_date" htmlFor="start_date">Start Date</label><input id="start_date" name="start_date" className="form-control" type="date" value={form.start_date || ''} onChange={e => setForm({...form, start_date: e.target.value})} /></div>
          <div className="form-group"><label className="form-label" htmlFor="end_date" htmlFor="end_date">End Date</label><input id="end_date" name="end_date" className="form-control" type="date" value={form.end_date || ''} onChange={e => setForm({...form, end_date: e.target.value})} /></div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input id="is_active" name="is_active" type="checkbox" checked={form.is_active ?? true} onChange={e => setForm({...form, is_active: e.target.checked})} /> Active</label></div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn btn-outline" onClick={() => setModal(false)}>{t('admin.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : t('admin.save')}</button>
        </div>
      </SimpleModal>
    </div>
  );
}


