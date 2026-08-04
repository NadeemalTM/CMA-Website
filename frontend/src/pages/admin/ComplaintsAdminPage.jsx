import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Eye, X } from 'lucide-react';
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

const statusColors = { new: '#d97706', reviewed: '#1e40af', resolved: '#1a7f5a', removed: '#dc2626' };

export default function ComplaintsAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [viewing, setViewing] = useState(null);
  const [reply, setReply] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); api.get('/admin/complaints', { params: { status: statusFilter || undefined } }).then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, [statusFilter]);

  const handleReply = async (status) => {
    if (!reply.trim() || !viewing) return;
    setSaving(true);
    try {
      await api.patch(`/admin/complaints/${viewing.id}/reply`, { reply: reply, status: status });
      setViewing(null); setReply(''); load();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleRemoveComplaint = async (id) => {
    if (!window.confirm('Are you sure you want to mark this complaint as removed?')) return;
    try {
      await api.delete(`/admin/complaints/${id}`);
      load();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const statuses = ['', 'new', 'reviewed', 'resolved', 'removed'];

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}><MessageSquare size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--crimson)' }} />{t('admin.complaints')}</h1>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {statuses.map(s => <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setStatusFilter(s)}>{s || 'All'}</button>)}
      </div>
      {loading ? <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div> : items.length === 0 ? (
        <div className="empty-state"><h3>No complaints found</h3></div>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead><tr style={{ background: 'var(--off-white)', textAlign: 'left' }}><th style={{ padding: '0.85rem 1rem' }}>Name</th><th style={{ padding: '0.85rem 1rem' }}>Email</th><th style={{ padding: '0.85rem 1rem' }}>Subject</th><th style={{ padding: '0.85rem 1rem' }}>Status</th><th style={{ padding: '0.85rem 1rem' }}>Date</th><th style={{ padding: '0.85rem 1rem' }}>Actions</th></tr></thead>
            <tbody>{items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{item.name}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{item.email}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{item.subject}</td>
                <td style={{ padding: '0.75rem 1rem' }}><span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.75rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, background: `${statusColors[item.status] || '#777'}20`, color: statusColors[item.status] || '#777' }}>{item.status}</span></td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{item.created_at?.substring(0, 10)}</td>
                <td style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => { setViewing(item); setReply(item.reply || ''); }}><Eye size={14} /> View</button>
                  {item.status !== 'removed' && (
                    <button className="btn btn-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5' }} onClick={() => handleRemoveComplaint(item.id)}>Remove</button>
                  )}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <SimpleModal isOpen={!!viewing} onClose={() => setViewing(null)} title="Complaint Details">
        {viewing && <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div><p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Name</p><p>{viewing.name}</p></div>
            <div><p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email</p><p>{viewing.email}</p></div>
            <div><p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Phone</p><p>{viewing.phone || '—'}</p></div>
            <div><p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Subject</p><p>{viewing.subject}</p></div>
          </div>
          <div style={{ background: 'var(--off-white)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Message</p>
            <p style={{ lineHeight: 1.7 }}>{viewing.message}</p>
          </div>
          <div className="form-group"><label className="form-label">Reply / Admin Notes</label><textarea className="form-control" rows={4} value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." /></div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={() => setViewing(null)}>Close</button>
            <button className="btn" style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd', fontWeight: 600 }} onClick={() => handleReply('reviewed')} disabled={saving || !reply.trim()}>Mark as Received</button>
            <button className="btn btn-primary" onClick={() => handleReply('resolved')} disabled={saving || !reply.trim()}>Mark as Resolved</button>
          </div>
        </>}
      </SimpleModal>
    </div>
  );
}
