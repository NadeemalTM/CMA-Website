import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Trash2, Download, MapPin } from 'lucide-react';
import { adminJobApplications } from '../../services/api';

export default function JobApplicationsAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminJobApplications.list()
      .then(r => setItems(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  
  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirm_delete') || 'Are you sure you want to delete this application?')) return;
    try {
      await adminJobApplications.remove(id);
      load();
    } catch (e) {
      alert('Error deleting application');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>
          <FileText size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--crimson)' }} />
          Job Applications
        </h1>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No applications found.</p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--off-white)', textAlign: 'left' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Applicant</th>
                <th style={{ padding: '0.85rem 1rem' }}>Vacancy</th>
                <th style={{ padding: '0.85rem 1rem' }}>Contact</th>
                <th style={{ padding: '0.85rem 1rem' }}>Applied On</th>
                <th style={{ padding: '0.85rem 1rem' }}>CV Document</th>
                <th style={{ padding: '0.85rem 1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--primary)' }}>
                    {item.vacancy?.title_en || 'Unknown Vacancy'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontSize: '0.85rem' }}>
                      <a href={`mailto:${item.email}`} style={{ color: 'var(--text-dark)' }}>{item.email}</a>
                      {item.phone && <div style={{ color: 'var(--text-muted)', marginTop: 4 }}>{item.phone}</div>}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {item.cv_path ? (
                      <a 
                        href={`http://localhost:8000/storage/${item.cv_path}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-sm btn-outline"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        <Download size={14} /> Download CV
                      </a>
                    ) : (
                      'No CV'
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button 
                      className="btn btn-sm" 
                      style={{ color: 'var(--error)', border: '1px solid var(--error)' }} 
                      onClick={() => handleDelete(item.id)}
                      title="Delete Application"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
