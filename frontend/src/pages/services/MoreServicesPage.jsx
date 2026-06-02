import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, User, ShieldCheck, Mail, Phone, CreditCard, ChevronRight, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { getCitizenSubmissions } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SERVICES = [
  { path: '/services/property',  label: 'Buying and Renting Private Property',       desc: 'Obtain clearance clearances for selling, buying or leasing units.', icon: CreditCard },
  { path: '/services/dev-fee',   label: 'Pay Electronic Development Application Fee', desc: 'Securely pay fees for plan applications and building proposals.', icon: ShieldCheck },
  { path: '/services/renovation',label: 'Renovating Private Residential Property',    desc: 'File building modification details to ensure safety standard clearances.', icon: LayoutGrid },
  { path: '/services/pay-fines', label: 'Pay Fines',                                  desc: 'Pay structural, late fee, or common amenities obstruction tickets.', icon: Clock },
];

export default function MoreServicesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { citizen, isCitizenLoggedIn } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not logged in
  if (!isCitizenLoggedIn) {
    navigate('/login?redirect=/services/more');
    return null;
  }

  const fetchSubmissions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getCitizenSubmissions();
      setSubmissions(res.data.data);
    } catch (err) {
      setError('Could not retrieve historical submissions. Please try again.');
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
      case 'dev_fee_payment': return 'Development Application Fee';
      case 'renovation_clearance': return 'Renovation Clearance';
      case 'fine_payment': return 'Fine Payment Settlement';
      default: return type.replace(/_/g, ' ');
    }
  };

  const getStatusBadge = (status) => {
    let bg = '#fef3c7'; let color = '#d97706'; // amber (pending)
    if (status === 'approved' || status === 'paid') {
      bg = '#dcfce7'; color = '#15803d'; // green
    } else if (status === 'rejected') {
      bg = '#fee2e2'; color = '#b91c1c'; // red
    } else if (status === 'processing') {
      bg = '#dbeafe'; color = '#1d4ed8'; // blue
    }
    
    return (
      <span style={{
        padding: '0.25rem 0.6rem',
        borderRadius: '12px',
        fontSize: '0.75rem',
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

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh', padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--crimson)', margin: 0 }}>
              Citizen Portal & Dashboard
            </h1>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#666' }}>
              Manage your private property applications, permits, and fee payments.
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
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,0,0,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <RefreshCw size={14} />
            <span>Refresh Portal</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* Profile Sidebar */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ textAlign: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'var(--crimson)',
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                }}
              >
                {citizen.name[0].toUpperCase()}
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>
                {citizen.name}
              </h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', tracking: '0.05em' }}>
                Verified Citizen
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div>
                <div style={{ color: '#64748b', fontWeight: 600, marginBottom: '0.15rem' }}>Email Address</div>
                <div style={{ fontWeight: 500, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={14} color="#94a3b8" />
                  <span>{citizen.email}</span>
                </div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontWeight: 600, marginBottom: '0.15rem' }}>National ID (NIC)</div>
                <div style={{ fontWeight: 500, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CreditCard size={14} color="#94a3b8" />
                  <span>{citizen.nic}</span>
                </div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontWeight: 600, marginBottom: '0.15rem' }}>Phone Number</div>
                <div style={{ fontWeight: 500, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={14} color="#94a3b8" />
                  <span>{citizen.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Submissions Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Historical Submissions Table */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 1rem' }}>
                Your Submitted E-Services & Applications
              </h2>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div className="spinner" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ color: '#666', fontSize: '0.88rem' }}>Retrieving your records...</p>
                </div>
              ) : error ? (
                <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '1rem', borderRadius: '8px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              ) : submissions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1.5px dashed #e2e8f0' }}>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1rem' }}>
                    No service clearance or fine payment history found under your account yet.
                  </p>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Click any link on the navbar or select from the services card grid below to get started.
                  </span>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 700, textAlign: 'left' }}>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Reference No</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Service Clearance Type</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Amount Paid</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Submission Status</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Submitted Date</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Admin Remarks / Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub) => (
                        <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--crimson)' }}>
                            {sub.reference_no}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: '#334155' }}>
                            {getServiceLabel(sub.service_type)}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>
                            {sub.amount > 0 ? `LKR ${Number(sub.amount).toLocaleString()}` : 'N/A'}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            {getStatusBadge(sub.status)}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', color: '#64748b' }}>
                            {new Date(sub.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', color: '#475569', fontStyle: sub.remarks ? 'normal' : 'italic' }}>
                            {sub.remarks || 'Pending administrative review'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Services Grid */}
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 1rem' }}>
                All Citizen E-Services Clearance Portals
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {SERVICES.map((s) => {
                  const Icon = s.icon;
                  return (
                    <Link
                      key={s.path}
                      to={s.path}
                      style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'all 0.25s',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--gold)';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      }}
                    >
                      <div>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '8px',
                            background: 'rgba(139,0,0,0.06)',
                            color: 'var(--crimson)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.75rem',
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.92rem', fontWeight: 700, color: '#1f2937' }}>
                          {s.label}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#666', lineHeight: 1.4 }}>
                          {s.desc}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--crimson)', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.75rem' }}>
                        <span>Open Form</span>
                        <ChevronRight size={13} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
