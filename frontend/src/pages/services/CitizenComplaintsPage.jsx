import React, { useState, useEffect } from 'react';
import T from '../../components/ui/T';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getCitizenComplaints, submitCitizenComplaint, deleteCitizenComplaint } from '../../services/api';
import { 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Inbox,
  AlertTriangle,
  Trash2
} from 'lucide-react';

const styles = {
  pageContainer: {
    background: '#f8fafc',
    minHeight: '80vh',
    padding: '3rem 1rem',
  },
  innerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  headerSection: {
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '1rem',
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    alignItems: 'start',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
    border: '1px solid #e2e8f0',
  },
  formTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#334155',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  formGroup: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    minHeight: '150px',
    resize: 'vertical',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '0.85rem',
    background: 'var(--crimson, #8b0000)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  complaintList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  complaintItem: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '1.25rem',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  complaintHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '0.75rem',
    gap: '1rem',
  },
  complaintSubject: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
  },
  complaintDate: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    marginTop: '0.25rem',
  },
  complaintMsg: {
    fontSize: '0.9rem',
    color: '#475569',
    lineHeight: 1.5,
    margin: '0 0 1rem 0',
    whiteSpace: 'pre-wrap',
  },
  statusBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '0.25rem 0.6rem',
    borderRadius: '9999px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  feedbackBox: {
    background: '#f8fafc',
    borderLeft: '4px solid var(--gold, #C9A227)',
    borderRadius: '4px 8px 8px 4px',
    padding: '1rem',
    marginTop: '0.75rem',
  },
  feedbackTitle: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#856404',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
  },
  feedbackText: {
    fontSize: '0.875rem',
    color: '#334155',
    margin: 0,
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: '#64748b',
  }
};

export default function CitizenComplaintsPage() {
  const { t } = useTranslation();
  const { isCitizenLoggedIn } = useAuth();
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await getCitizenComplaints();
      setComplaints(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this complaint?')) return;
    try {
      setErrorMsg('');
      setSuccessMsg('');
      await deleteCitizenComplaint(id);
      setSuccessMsg('Complaint removed successfully.');
      fetchComplaints();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to remove complaint.');
    }
  };

  useEffect(() => {
    document.title = 'Condo Complaints – Condominium Management Authority';
    if (isCitizenLoggedIn) {
      fetchComplaints();
    }
  }, [isCitizenLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setErrorMsg('Please fill in both Subject and Description.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');
      
      await submitCitizenComplaint({
        subject,
        message,
        phone: phone || undefined
      });

      setSuccessMsg('Complaint submitted successfully!');
      setSubject('');
      setMessage('');
      setPhone('');
      fetchComplaints();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'received':
        return {
          background: '#dbeafe',
          color: '#1e40af',
          icon: <CheckCircle2 size={12} />
        };
      case 'resolved':
        return {
          background: '#dcfce7',
          color: '#15803d',
          icon: <CheckCircle2 size={12} />
        };
      case 'new':
      default:
        return {
          background: '#fef3c7',
          color: '#92400e',
          icon: <Clock size={12} />
        };
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'received':
        return 'Received';
      case 'resolved':
        return 'Resolved';
      case 'new':
      default:
        return 'Pending';
    }
  };

  if (!isCitizenLoggedIn) {
    return (
      <div style={styles.pageContainer}>
        <div style={{ ...styles.innerContainer, textAlign: 'center', padding: '4rem 1rem' }}>
          <AlertTriangle size={48} color="var(--crimson)" style={{ marginBottom: '1rem' }} />
          <h2><T>Access Denied</T></h2>
          <p><T>You must be logged in to submit condominium-related complaints.</T></p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.innerContainer}>
        
        {/* Header */}
        <div style={styles.headerSection}>
          <h1 style={styles.title}><T>Condominium Related Complaints</T></h1>
          <p style={styles.subtitle}><T>
            Submit your complaints and track feedback directly from the Condominium Management Authority.
          </T></p>
        </div>

        {/* Main Grid */}
        <div style={styles.layoutGrid}>
          
          {/* Submission Form */}
          <div style={styles.card}>
            <h2 style={styles.formTitle}>
              <MessageSquare size={20} color="var(--crimson)" />
              File a Complaint
            </h2>

            {errorMsg && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label htmlFor="complaint-subject" style={styles.label}>Subject / Issue Title</label>
                <input 
                  id="complaint-subject"
                  name="complaint-subject"
                  type="text" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  placeholder="e.g. Broken elevator, leaking common pipe..."
                  style={styles.input} 
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="complaint-phone" style={styles.label}>Contact Phone (Optional)</label>
                <input 
                  id="complaint-phone"
                  name="complaint-phone"
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="e.g. 0771234567"
                  style={styles.input} 
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="complaint-message" style={styles.label}>Detailed Description</label>
                <textarea 
                  id="complaint-message"
                  name="complaint-message"
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Describe your issue in detail..."
                  style={styles.textarea} 
                  required
                />
              </div>

              <button 
                type="submit" 
                style={{
                  ...styles.button,
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
                disabled={submitting}
              >
                <Send size={16} />
                {submitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>

          {/* Complaints List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155', margin: '0 0 0.5rem 0' }}><T>
              Your Complaints History
            </T></h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Loading complaints...</div>
            ) : complaints.length > 0 ? (
              <div style={styles.complaintList}>
                {complaints.map((item) => {
                  const badge = getStatusBadgeStyle(item.status);
                  return (
                    <div key={item.id} style={styles.complaintItem}>
                      <div style={styles.complaintHeader}>
                        <div>
                          <h3 style={styles.complaintSubject}>{item.subject}</h3>
                          <span style={styles.complaintDate}>
                            <Clock size={12} />
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            ...styles.statusBadge,
                            background: badge.background,
                            color: badge.color
                          }}>
                            {badge.icon}
                            {formatStatus(item.status)}
                          </span>
                          {item.status === 'new' && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                transition: 'color 0.2s'
                              }}
                              title="Remove Complaint"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <p style={styles.complaintMsg}>{item.message}</p>
                      
                      {item.reply && (
                        <div style={styles.feedbackBox}>
                          <div style={styles.feedbackTitle}>CMA Admin Feedback</div>
                          <p style={styles.feedbackText}>{item.reply}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ ...styles.card, ...styles.emptyState }}>
                <Inbox size={32} style={{ marginBottom: '0.5rem', color: '#cbd5e1' }} />
                <p style={{ margin: 0 }}><T>You haven't submitted any complaints yet.</T></p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
