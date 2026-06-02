import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Plus, Edit, Trash2, X, Search } from 'lucide-react';
import { adminCondominiums } from '../../services/api';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h2 style={{ margin: 0 }}>{title}</h2><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button></div>
      {children}
    </div>
  </div>
);

export default function CondominiumsAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ registration_no: '', name: '', address: '', district: '', city: '', unit_count: 0, developer_name: '', mc_name: '', mc_registration_no: '', status: 'registered', registered_at: '' });
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); adminCondominiums.list({ search: search || undefined }).then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, [search]);

  const openNew = () => { setEditing(null); setForm({ registration_no: '', name: '', address: '', district: '', city: '', unit_count: 0, developer_name: '', mc_name: '', mc_registration_no: '', status: 'registered', registered_at: '' }); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ registration_no: item.registration_no||'', name: item.name||'', address: item.address||'', district: item.district||'', city: item.city||'', unit_count: item.unit_count||0, developer_name: item.developer_name||'', mc_name: item.mc_name||'', mc_registration_no: item.mc_registration_no||'', status: item.status||'registered', registered_at: item.registered_at||'' }); setModal(true); };
  const handleSave = async () => { setSaving(true); try { if (editing) await adminCondominiums.update(editing.id, form); else await adminCondominiums.create(form); setModal(false); load(); } catch (e) { alert(e.response?.data?.message || 'Error'); } finally { setSaving(false); } };
  const handleDelete = async (id) => { if (!window.confirm(t('admin.confirm_delete'))) return; try { await adminCondominiums.remove(id); load(); } catch (e) { alert('Error'); } };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}><Building2 size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--crimson)' }} />{t('admin.condominiums')}</h1>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> {t('admin.add')}</button>
      </div>
      <div style={{ position: 'relative', maxWidth: 400, marginBottom: '1.5rem' }}>
        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input className="form-control" style={{ paddingLeft: 42 }} placeholder="Search condominiums..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {loading ? <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div> : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead><tr style={{ background: 'var(--off-white)', textAlign: 'left' }}><th style={{ padding: '0.85rem 1rem' }}>Reg. No</th><th style={{ padding: '0.85rem 1rem' }}>Name</th><th style={{ padding: '0.85rem 1rem' }}>District</th><th style={{ padding: '0.85rem 1rem' }}>Units</th><th style={{ padding: '0.85rem 1rem' }}>Status</th><th style={{ padding: '0.85rem 1rem' }}>Actions</th></tr></thead>
            <tbody>{items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--crimson)' }}>{item.registration_no}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{item.name}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{item.district || '—'}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{item.unit_count || '—'}</td>
                <td style={{ padding: '0.75rem 1rem' }}><span className={`badge badge-${item.status === 'registered' ? 'success' : 'warning'}`}>{item.status}</span></td>
                <td style={{ padding: '0.75rem 1rem' }}><div style={{ display: 'flex', gap: '0.5rem' }}><button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}><Edit size={14} /></button><button className="btn btn-sm" style={{ color: 'var(--error)', border: '1px solid var(--error)' }} onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <SimpleModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Condominium' : 'Add Condominium'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Registration No *</label><input className="form-control" value={form.registration_no || ''} onChange={e => setForm({...form, registration_no: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Name *</label><input className="form-control" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} /></div>
        </div>
        <div className="form-group"><label className="form-label">Address</label><textarea className="form-control" rows={2} value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">District</label><input className="form-control" value={form.district || ''} onChange={e => setForm({...form, district: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">City</label><input className="form-control" value={form.city || ''} onChange={e => setForm({...form, city: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Unit Count</label><input className="form-control" type="number" value={form.unit_count ?? 0} onChange={e => setForm({...form, unit_count: parseInt(e.target.value)||0})} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Developer Name</label><input className="form-control" value={form.developer_name || ''} onChange={e => setForm({...form, developer_name: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">MC Name</label><input className="form-control" value={form.mc_name || ''} onChange={e => setForm({...form, mc_name: e.target.value})} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">MC Reg. No</label><input className="form-control" value={form.mc_registration_no || ''} onChange={e => setForm({...form, mc_registration_no: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Status</label><select className="form-control" value={form.status || 'registered'} onChange={e => setForm({...form, status: e.target.value})}><option value="registered">Registered</option><option value="pending">Pending</option><option value="suspended">Suspended</option></select></div>
          <div className="form-group"><label className="form-label">Registered At</label><input className="form-control" type="date" value={form.registered_at || ''} onChange={e => setForm({...form, registered_at: e.target.value})} /></div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn btn-outline" onClick={() => setModal(false)}>{t('admin.cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : t('admin.save')}</button>
        </div>
      </SimpleModal>
    </div>
  );
}
