import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Plus, Edit, Trash2, X } from 'lucide-react';
import { adminVacancies, adminCreateVacancy, adminUpdateVacancy } from '../../services/api';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h2 style={{ margin: 0 }}>{title}</h2><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button></div>
      {children}
    </div>
  </div>
);

export default function VacanciesAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title_en: '', title_si: '', title_ta: '', description_en: '', description_si: '', description_ta: '', deadline: '', is_active: true });
  const [saving, setSaving] = useState(false);
  const [langTab, setLangTab] = useState('en');

  const load = () => { setLoading(true); adminVacancies.list().then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm({ title_en: '', title_si: '', title_ta: '', description_en: '', description_si: '', description_ta: '', deadline: '', is_active: true }); setLangTab('en'); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ title_en: item.title_en||'', title_si: item.title_si||'', title_ta: item.title_ta||'', description_en: item.description_en||'', description_si: item.description_si||'', description_ta: item.description_ta||'', deadline: item.deadline||'', is_active: item.is_active??true }); setLangTab('en'); setModal(true); };

  const handleSave = async () => { 
    setSaving(true); 
    try { 
      const fd = new FormData();
      Object.keys(form).forEach(k => {
        if (form[k] !== null && form[k] !== undefined && k !== 'document') {
          fd.append(k, form[k]);
        }
      });
      
      if (form.document instanceof File) {
        fd.append('document', form.document);
      }

      if (editing) await adminUpdateVacancy(editing.id, fd); 
      else await adminCreateVacancy(fd); 
      
      setModal(false); 
      load(); 
    } catch (e) { 
      alert(e.response?.data?.message || 'Error'); 
    } finally { 
      setSaving(false); 
    } 
  };
  const handleDelete = async (id) => { if (!window.confirm(t('admin.confirm_delete'))) return; try { await adminVacancies.remove(id); load(); } catch (e) { alert('Error'); } };

  const langTabs = [{ key: 'en', label: 'English' }, { key: 'si', label: 'සිංහල' }, { key: 'ta', label: 'தமிழ்' }];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}><Briefcase size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--crimson)' }} />{t('admin.vacancies')}</h1>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> {t('admin.add')}</button>
      </div>
      {loading ? <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div> : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead><tr style={{ background: 'var(--off-white)', textAlign: 'left' }}><th style={{ padding: '0.85rem 1rem' }}>Title</th><th style={{ padding: '0.85rem 1rem' }}>Deadline</th><th style={{ padding: '0.85rem 1rem' }}>Active</th><th style={{ padding: '0.85rem 1rem' }}>Document</th><th style={{ padding: '0.85rem 1rem' }}>Actions</th></tr></thead>
            <tbody>{items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{item.title_en}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--crimson)', fontWeight: 600 }}>{item.deadline || '—'}</td>
                <td style={{ padding: '0.75rem 1rem' }}><span className={`badge badge-${item.is_active ? 'success' : 'warning'}`}>{item.is_active ? 'Active' : 'Inactive'}</span></td>
                <td style={{ padding: '0.75rem 1rem' }}>{item.document_path ? <a href={`http://localhost:8000/storage/${item.document_path}`} target="_blank" rel="noreferrer" style={{color: 'var(--primary)'}}>View</a> : '—'}</td>
                <td style={{ padding: '0.75rem 1rem' }}><div style={{ display: 'flex', gap: '0.5rem' }}><button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}><Edit size={14} /></button><button className="btn btn-sm" style={{ color: 'var(--error)', border: '1px solid var(--error)' }} onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <SimpleModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Vacancy' : 'Add Vacancy'}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>{langTabs.map(l => <button key={l.key} className={`btn btn-sm ${langTab === l.key ? 'btn-primary' : 'btn-outline'}`} onClick={() => setLangTab(l.key)}>{l.label}</button>)}</div>
        <div className="form-group"><label className="form-label">Title ({langTab.toUpperCase()})</label><input className="form-control" value={form[`title_${langTab}`] || ''} onChange={e => setForm({...form, [`title_${langTab}`]: e.target.value})} /></div>
        <div className="form-group"><label className="form-label">Description ({langTab.toUpperCase()})</label><textarea className="form-control" rows={5} value={form[`description_${langTab}`] || ''} onChange={e => setForm({...form, [`description_${langTab}`]: e.target.value})} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Deadline</label><input className="form-control" type="date" value={form.deadline || ''} onChange={e => setForm({...form, deadline: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Attach Document (PDF/Word)</label><input type="file" className="form-control" accept=".pdf,.doc,.docx" onChange={e => setForm({...form, document: e.target.files[0]})} /></div>
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', marginTop: '1rem' }}><label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={form.is_active ?? true} onChange={e => setForm({...form, is_active: e.target.checked})} /> Active Vacancy</label></div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn btn-outline" onClick={() => setModal(false)}>{t('admin.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : t('admin.save')}</button>
        </div>
      </SimpleModal>
    </div>
  );
}
