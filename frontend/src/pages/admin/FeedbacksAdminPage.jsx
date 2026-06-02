import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Trash2, Eye, X, MessageSquare, ShieldAlert } from 'lucide-react';
import api from '../../services/api';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const ratingEmojis = {
  1: '😞',
  2: '😐',
  3: '🙂',
  4: '😄',
  5: '😍',
};

const ratingLabels = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export default function FeedbacksAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [ratingFilter, setRatingFilter] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadFeedbacks = () => {
    setLoading(true);
    api.get('/admin/feedbacks')
      .then(res => {
        // Handle paginated or direct array payload
        setItems(res.data.data || res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(loadFeedbacks, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirm_delete') || 'Are you sure you want to delete this item?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/feedbacks/${id}`);
      loadFeedbacks();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete feedback');
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#f59e0b' : '#cbd5e1', fontSize: '1.2rem', marginRight: '2px' }}>
        ★
      </span>
    ));
  };

  // Local filter for quick responsive filtering
  const filteredItems = items.filter(item => {
    if (!ratingFilter) return true;
    return item.rating === parseInt(ratingFilter, 10);
  });

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
          <Star size={24} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--crimson)' }} />
          {t('admin.feedbacks') || 'User Feedbacks'}
        </h1>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Filter Rating:</span>
          <select 
            value={ratingFilter} 
            onChange={e => setRatingFilter(e.target.value)} 
            className="form-control"
            style={{ width: '130px', padding: '0.35rem 0.5rem', fontSize: '0.85rem', height: 'auto', borderRadius: '6px' }}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars 😍</option>
            <option value="4">4 Stars 😄</option>
            <option value="3">3 Stars 🙂</option>
            <option value="2">2 Stars 😐</option>
            <option value="1">1 Star 😞</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '4rem' }}>
          <div className="spinner" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <h3>No feedbacks found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Visitors haven't submitted any feedbacks matching your filter.</p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--off-white)', textAlign: 'left' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Email</th>
                <th style={{ padding: '0.85rem 1rem' }}>Rating</th>
                <th style={{ padding: '0.85rem 1rem' }}>Message Excerpt</th>
                <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                <th style={{ padding: '0.85rem 1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>
                    {item.name || <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>Anonymous</span>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                    {item.email || <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>N/A</span>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span title={ratingLabels[item.rating]}>{ratingEmojis[item.rating] || '⭐'}</span>
                      {renderStars(item.rating)}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.message}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                    {item.created_at?.substring(0, 10)} {item.created_at?.substring(11, 16)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-outline btn-sm" 
                        onClick={() => setViewing(item)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0.3rem 0.6rem' }}
                      >
                        <Eye size={13} /> View
                      </button>
                      <button 
                        className="btn btn-sm" 
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px', 
                          padding: '0.3rem 0.6rem',
                          background: 'none',
                          border: '1px solid #ef4444',
                          color: '#ef4444',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={13} /> {deletingId === item.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for viewing entire feedback details */}
      <SimpleModal 
        isOpen={!!viewing} 
        onClose={() => setViewing(null)} 
        title="Feedback Details"
      >
        {viewing && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>Name</p>
                <p style={{ margin: 0, fontWeight: 500 }}>{viewing.name || 'Anonymous citizen'}</p>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>Email</p>
                <p style={{ margin: 0 }}>{viewing.email || 'No email provided'}</p>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>Rating</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <span>{ratingEmojis[viewing.rating]}</span>
                  <span>{renderStars(viewing.rating)}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>({ratingLabels[viewing.rating]})</span>
                </div>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>Submitted Date & Time</p>
                <p style={{ margin: 0 }}>{viewing.created_at?.replace('T', ' ').replace(/\.\d+Z/, '')}</p>
              </div>
            </div>

            <div style={{ background: 'var(--off-white)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>Original Message</p>
                <p style={{ lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{viewing.message}</p>
              </div>
              {viewing.message_si && viewing.message_si !== viewing.message && (
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.75rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--crimson)', margin: '0 0 4px' }}>Sinhala Translation (සිංහල පරිවර්තනය)</p>
                  <p style={{ lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>{viewing.message_si}</p>
                </div>
              )}
              {viewing.message_ta && viewing.message_ta !== viewing.message && (
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.75rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e3a8a', margin: '0 0 4px' }}>Tamil Translation (தமிழ் மொழிபெயர்ப்பு)</p>
                  <p style={{ lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>{viewing.message_ta}</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => setViewing(null)}
              >
                Close
              </button>
              <button 
                className="btn" 
                onClick={() => {
                  const id = viewing.id;
                  setViewing(null);
                  handleDelete(id);
                }}
                style={{ 
                  background: '#ef4444',
                  color: 'white',
                  border: 'none'
                }}
              >
                Delete Feedback
              </button>
            </div>
          </div>
        )}
      </SimpleModal>
    </div>
  );
}
