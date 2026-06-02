import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Search, AlertCircle, FileText, CheckCircle2, RefreshCw, Loader2, MessageSquare, ClipboardCheck, CornerDownRight } from 'lucide-react';
import { adminGetCitizenSubmissions, adminUpdateCitizenSubmission } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function CitizenSubmissionsAdminPage() {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, pending, approved, rejected, paid

  // Modal State
  const [selectedSub, setSelectedSub] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminGetCitizenSubmissions();
      setSubmissions(res.data.data);
    } catch (err) {
      setError('Could not retrieve citizen submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const getServiceLabel = (type) => {
    switch (type) {
      case 'property_transaction': return 'Property Transaction Clearance';
      case 'parking_renew': return 'Parking Permit Renewal';
      case 'dev_fee_payment': return 'Development Application Fee';
      case 'renovation_clearance': return 'Renovation Clearance';
      case 'parking_apply': return 'New Parking Application';
      case 'fine_payment': return 'Fine Payment Settlement';
      default: return type.replace(/_/g, ' ');
    }
  };

  // Convert DB status to human badges
  const getStatusBadge = (status) => {
    let bg = '#fef3c7'; let color = '#d97706';
    if (status === 'approved' || status === 'paid') {
      bg = '#dcfce7'; color = '#15803d';
    } else if (status === 'rejected') {
      bg = '#fee2e2'; color = '#b91c1c';
    } else if (status === 'processing') {
      bg = '#dbeafe'; color = '#1d4ed8';
    }
    return (
      <span style={{
        padding: '0.25rem 0.6rem',
        borderRadius: '12px',
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        background: bg,
        color: color,
        display: 'inline-block',
      }}>
        {status}
      </span>
    );
  };

  // Format form_data key to human-readable title
  const formatKeyName = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .replace('Nic', 'NIC')
      .replace('Id', 'ID')
      .replace('App', 'Application')
      .replace('No', 'Number');
  };

  const handleOpenReview = (sub) => {
    setSelectedSub(sub);
    setReviewStatus(sub.status);
    setReviewRemarks(sub.remarks || '');
    setError('');
    setSuccessMsg('');
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;
    setUpdating(true);
    setError('');
    setSuccessMsg('');

    try {
      await adminUpdateCitizenSubmission(selectedSub.id, {
        status: reviewStatus,
        remarks: reviewRemarks,
      });

      setSuccessMsg('Submission status updated successfully!');
      
      // Update local array
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSub.id
            ? { ...sub, status: reviewStatus, remarks: reviewRemarks }
            : sub
        )
      );

      setTimeout(() => {
        setSelectedSub(null);
      }, 1000);
    } catch (err) {
      setError('Failed to save administrative updates. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Filter & Search Logic
  const filteredSubmissions = submissions.filter((sub) => {
    // 1. Search Query
    const nameMatch = sub.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const emailMatch = sub.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const refMatch = sub.reference_no?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const typeMatch = sub.service_type?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const basicMatch = nameMatch || emailMatch || refMatch || typeMatch;

    if (!basicMatch) return false;

    // 2. Tab selection
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return sub.status === 'pending';
    if (activeTab === 'approved') return sub.status === 'approved';
    if (activeTab === 'rejected') return sub.status === 'rejected';
    if (activeTab === 'paid') return sub.status === 'paid';
    return true;
  });

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
              Citizen E-Services Portal Submissions
            </h1>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#666' }}>
              Review, approve, reject, or comment on public services applications and fine payment settlements.
            </p>
          </div>
          <button
            onClick={fetchSubmissions}
            style={{
              padding: '0.5rem 1rem',
              background: '#fff',
              border: '1.5px solid var(--gold)',
              borderRadius: '8px',
              color: 'var(--crimson)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <RefreshCw size={14} />
            <span>Sync Submissions</span>
          </button>
        </div>

        {/* Success / Error Toast alert */}
        {successMsg && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Filter Controls & Search */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid var(--mid-gray)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {['all', 'pending', 'approved', 'rejected', 'paid'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.4rem 0.85rem',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: activeTab === tab ? 'var(--crimson)' : 'transparent',
                  color: activeTab === tab ? '#fff' : '#64748b',
                }}
              >
                <span style={{ textTransform: 'capitalize' }}>{tab}</span>
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, citizen, email..."
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '0.85rem',
              }}
            />
          </div>
        </div>

        {/* Data list Table */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid var(--mid-gray)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem' }} />
              <p style={{ color: '#666', fontSize: '0.88rem' }}>Loading submissions records...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#c53030' }}>
              <AlertCircle size={28} style={{ margin: '0 auto 0.5rem' }} />
              <p>{error}</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <FileText size={28} style={{ margin: '0 auto 0.5rem', color: '#94a3b8' }} />
              <p style={{ fontWeight: 600 }}>No matching submissions found.</p>
              <span style={{ fontSize: '0.8rem' }}>Try clearing filters or search keywords.</span>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #edf2f7', color: '#475569', fontWeight: 700 }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Reference No</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Service Type</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Citizen Name & NIC</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Amount</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Submitted Date</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #edf2f7', transition: 'background 0.15s' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--crimson)' }}>
                        {sub.reference_no}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#334155' }}>
                        {getServiceLabel(sub.service_type)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: '#1f2937' }}>{sub.user?.name || 'Unknown'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>NIC: {sub.form_data?.applicant_nic || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                        {sub.amount > 0 ? `LKR ${Number(sub.amount).toLocaleString()}` : 'N/A'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {getStatusBadge(sub.status)}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>
                        {new Date(sub.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleOpenReview(sub)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            background: '#fff',
                            border: '1.5px solid var(--crimson)',
                            borderRadius: '6px',
                            color: 'var(--crimson)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'var(--crimson)';
                            e.currentTarget.style.color = '#fff';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = '#fff';
                            e.currentTarget.style.color = 'var(--crimson)';
                          }}
                        >
                          <Eye size={13} />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Review Modal Dialog */}
      {selectedSub && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          {/* Backdrop overlay */}
          <div
            onClick={() => setSelectedSub(null)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(3px)',
            }}
          />

          {/* Modal Container */}
          <div
            style={{
              position: 'relative',
              background: '#fff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '750px',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              border: '1px solid var(--mid-gray)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #edf2f7',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase' }}>
                  Submission Review
                </span>
                <h3 style={{ margin: '0.15rem 0 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--crimson)' }}>
                  {selectedSub.reference_no} · {getServiceLabel(selectedSub.service_type)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.75rem',
                  lineHeight: 1,
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                &times;
              </button>
            </div>

            {/* Body (Scrollable) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {error && (
                <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              {/* Grid: 2 Columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                
                {/* Citizen Information */}
                <div style={{ background: '#f8fafc', border: '1px solid #edf2f7', borderRadius: '10px', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ClipboardCheck size={14} />
                    <span>Citizen Details</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div><strong>Name:</strong> {selectedSub.user?.name || 'Unknown'}</div>
                    <div><strong>Email:</strong> {selectedSub.user?.email || 'N/A'}</div>
                    <div><strong>Phone:</strong> {selectedSub.form_data?.applicant_phone || 'N/A'}</div>
                    <div><strong>NIC No:</strong> {selectedSub.form_data?.applicant_nic || 'N/A'}</div>
                  </div>
                </div>

                {/* Submission Metadata */}
                <div style={{ background: '#fcfcf9', border: '1px solid #edf2f7', borderRadius: '10px', padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ClipboardCheck size={14} />
                    <span>Metadata</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div><strong>Amount Paid:</strong> {selectedSub.amount > 0 ? `LKR ${Number(selectedSub.amount).toLocaleString()}` : 'N/A'}</div>
                    <div><strong>Current Status:</strong> {getStatusBadge(selectedSub.status)}</div>
                    <div><strong>Submitted Date:</strong> {new Date(selectedSub.created_at).toLocaleString()}</div>
                    <div><strong>Payment status:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 700, color: selectedSub.payment_status === 'paid' ? '#16a34a' : '#d97706' }}>{selectedSub.payment_status}</span></div>
                  </div>
                </div>

              </div>

              {/* Form Data Key-Value Fields */}
              <div style={{ border: '1px solid #edf2f7', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>
                  Form Application Form Fields
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                  {Object.entries(selectedSub.form_data || {}).map(([key, val]) => {
                    // Skip basic contact info already shown in citizen details
                    if (['applicant_name', 'applicant_email', 'applicant_phone', 'applicant_nic'].includes(key)) return null;
                    return (
                      <div key={key} style={{ borderBottom: '1px solid #f8fafc', paddingBottom: '0.5rem' }}>
                        <div style={{ color: '#64748b', fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.15rem' }}>
                          {formatKeyName(key)}
                        </div>
                        <div style={{ fontWeight: 500, color: '#1f2937', wordBreak: 'break-word' }}>
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Administrative Updates Panel */}
              <form onSubmit={handleSaveReview} style={{ border: '1.5px solid var(--gold)', borderRadius: '10px', padding: '1.25rem', background: '#fffbeb' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: 'var(--crimson)', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MessageSquare size={15} />
                  <span>Administrative Review & Action</span>
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'start' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                      Change Status
                    </label>
                    <select
                      value={reviewStatus}
                      onChange={(e) => setReviewStatus(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '6px',
                        outline: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem' }}>
                      Official Feedback / Remarks
                    </label>
                    <textarea
                      value={reviewRemarks}
                      onChange={(e) => setReviewRemarks(e.target.value)}
                      placeholder="Write official remarks, comments or request revision here..."
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '6px',
                        outline: 'none',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedSub(null)}
                    style={{
                      padding: '0.45rem 1rem',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '6px',
                      background: '#fff',
                      color: '#475569',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    style={{
                      padding: '0.45rem 1.25rem',
                      background: updating ? '#cbd5e1' : 'linear-gradient(135deg, var(--crimson), #a50000)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: updating ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    {updating ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
