import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Eye, X } from 'lucide-react';
import api from '../../services/api';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><h2 style={{ margin: 0 }}>{title}</h2><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button></div>
      {children}
    </div>
  </div>
);

const statusColors = { pending: '#d97706', processing: '#1e40af', approved: '#1a7f5a', rejected: '#dc2626' };

export default function ApplicationsAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [viewing, setViewing] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); api.get('/admin/applications', { params: { status: statusFilter || undefined } }).then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, [statusFilter]);

  const updateStatus = async () => {
    if (!newStatus || !viewing) return;
    setSaving(true);
    try {
      await api.patch(`/admin/applications/${viewing.id}/status`, { status: newStatus });
      setViewing(null); load();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const statuses = ['', 'pending', 'processing', 'approved', 'rejected'];

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}><ClipboardList size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--crimson)' }} />{t('admin.applications')}</h1>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {statuses.map(s => <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setStatusFilter(s)}>{s || 'All'}</button>)}
      </div>
      {loading ? <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div> : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead><tr style={{ background: 'var(--off-white)', textAlign: 'left' }}><th style={{ padding: '0.85rem 1rem' }}>Ref. No</th><th style={{ padding: '0.85rem 1rem' }}>Name</th><th style={{ padding: '0.85rem 1rem' }}>Email</th><th style={{ padding: '0.85rem 1rem' }}>Type</th><th style={{ padding: '0.85rem 1rem' }}>Status</th><th style={{ padding: '0.85rem 1rem' }}>Date</th><th style={{ padding: '0.85rem 1rem' }}>Actions</th></tr></thead>
            <tbody>{items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--crimson)' }}>{item.reference_no}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{item.applicant_name}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{item.applicant_email}</td>
                <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-crimson">{item.type}</span></td>
                <td style={{ padding: '0.75rem 1rem' }}><span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.75rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, background: `${statusColors[item.status] || '#777'}20`, color: statusColors[item.status] || '#777' }}>{item.status}</span></td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{item.created_at?.substring(0, 10)}</td>
                <td style={{ padding: '0.75rem 1rem' }}><button className="btn btn-outline btn-sm" onClick={() => { setViewing(item); setNewStatus(item.status); }}><Eye size={14} /> View</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <SimpleModal isOpen={!!viewing} onClose={() => setViewing(null)} title={`Application: ${viewing?.reference_no}`}>
        {viewing && <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div><p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Applicant</p><p>{viewing.applicant_name}</p></div>
            <div><p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email</p><p>{viewing.applicant_email}</p></div>
            <div><p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Phone</p><p>{viewing.applicant_phone || '—'}</p></div>
            <div><p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Type</p><p>{viewing.type}</p></div>
          </div>
          {viewing.form_data && <div style={{ background: 'var(--off-white)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}><pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(viewing.form_data, null, 2)}</pre></div>}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}><label className="form-label">Update Status</label><select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}><option value="pending">Pending</option><option value="processing">Processing</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></div>
            <button className="btn btn-primary" onClick={updateStatus} disabled={saving}>{saving ? 'Saving...' : 'Update Status'}</button>
          </div>
        </>}
      </SimpleModal>
    </div>
  );
}
