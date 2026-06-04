import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { 
  Award, FileText, Download, CheckCircle, AlertTriangle, 
  ArrowLeft, Calendar, ShieldCheck, DollarSign, ExternalLink
} from 'lucide-react';
import { getCertificate, getMyCertificatePayments } from '../../services/api';

export default function CertificateDownloadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isCitizenLoggedIn } = useAuth();

  const [cert, setCert] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  // Re-verify login status
  useEffect(() => {
    if (!isCitizenLoggedIn) {
      navigate(`/login?redirect=/services/certificate/downloads/${id}`);
    }
  }, [isCitizenLoggedIn, navigate, id]);

  const verifyAndLoadData = async () => {
    if (!isCitizenLoggedIn) return;
    setLoading(true);
    setError('');
    try {
      // 1. Fetch citizen's certificate payments
      const paymentsRes = await getMyCertificatePayments();
      const activePayments = paymentsRes.data.data || [];
      
      // Check if there is a completed payment for this certificate ID
      const matchingPayment = activePayments.find(
        p => Number(p.certificate_type_id) === Number(id) && p.status === 'completed'
      );

      if (!matchingPayment) {
        setVerified(false);
        setError('No completed payment found for this certificate type. Access denied.');
        setLoading(false);
        return;
      }

      setPayment(matchingPayment);

      // 2. Fetch the certificate documents
      const certRes = await getCertificate(id);
      setCert(certRes.data.data);
      setVerified(true);
    } catch (err) {
      console.error(err);
      setError('Could not verify document access. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAndLoadData();
  }, [id, isCitizenLoggedIn]);

  if (!isCitizenLoggedIn) return null;

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh', padding: '3.5rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Back Link */}
        <Link 
          to="/services/certificate"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
            marginBottom: '2rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--crimson)'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
        >
          <ArrowLeft size={16} />
          <span>Back to Certificates</span>
        </Link>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="spinner" style={{ margin: '0 auto 1.5rem' }} />
            <p style={{ color: '#666', fontWeight: 500 }}>Verifying access and loading documents...</p>
          </div>
        ) : error || !verified ? (
          /* Error State: Unpaid or Access Denied */
          <div style={{
            background: '#fff',
            border: '1px solid #fee2e2',
            borderRadius: '24px',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            maxWidth: '600px',
            marginInline: 'auto'
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', background: 'rgba(239,68,68,0.08)',
              color: '#ef4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <AlertTriangle size={28} />
            </div>
            <h2 style={{ margin: '0 0 0.5rem', color: '#1f2937', fontSize: '1.35rem', fontWeight: 800 }}>
              Access Denied
            </h2>
            <p style={{ margin: '0 0 2rem', fontSize: '0.92rem', color: '#64748b', lineHeight: 1.5 }}>
              You do not have active document clearance for this certificate type yet. Please complete the application document fee payment first.
            </p>
            <button
              onClick={() => navigate('/services/certificate')}
              style={{
                background: 'var(--crimson)',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '30px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(139,0,0,0.2)'
              }}
            >
              Go to Payment Page
            </button>
          </div>
        ) : (
          /* Paid State: Display Documents */
          <div>
            
            {/* Header Success Section */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%', background: '#dcfce7',
                    color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CheckCircle size={26} />
                  </div>
                  <div>
                    <span style={{ 
                      fontSize: '0.75rem', fontWeight: 700, color: '#15803d', 
                      background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '6px',
                      textTransform: 'uppercase', letterSpacing: '0.5px'
                    }}>
                      Payment Completed
                    </span>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 850, color: '#1f2937', margin: '0.35rem 0 0' }}>
                      {cert.title}
                    </h1>
                  </div>
                </div>

                {/* Receipt Details Box */}
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1rem 1.5rem',
                  minWidth: '220px',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem' }}>
                    <span style={{ color: '#64748b', fontWeight: 500 }}>Reference Code</span>
                    <strong style={{ color: 'var(--crimson)' }}>{payment.reference_no}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#64748b' }}>Paid Amount</span>
                    <strong style={{ color: '#1f2937' }}>LKR {Number(payment.amount).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Paid At</span>
                    <strong style={{ color: '#1f2937' }}>{new Date(payment.paid_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction quick view */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 0.75rem' }}>
                Quick Instructions
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
                You have successfully paid the document fee for <strong>{cert.title}</strong>. 
                Below are all the downloadable materials, guidebooks, and application forms attached to this certificate. 
                You can return to this page to download these documents at any time.
              </p>
            </div>

            {/* Document Download Cards Grid */}
            <h2 style={{ fontSize: '1.2rem', fontWeight: 850, color: '#1f2937', marginBottom: '1.25rem' }}>
              Your Downloadable Documents
            </h2>

            {!cert.documents || cert.documents.length === 0 ? (
              <div style={{ 
                padding: '4rem 2rem', background: '#fff', borderRadius: '24px', 
                border: '1.5px dashed #cbd5e1', textAlign: 'center', boxShadow: 'var(--shadow-sm)'
              }}>
                <FileText size={42} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                  No documents have been attached to this certificate yet by the administrator.
                </p>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem', display: 'block' }}>
                  Please check back later or contact CMA support at info@condominium.lk.
                </span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {cert.documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      background: '#fff',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--gold)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '8px', 
                          background: 'rgba(139,0,0,0.06)', color: 'var(--crimson)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <FileText size={16} />
                        </div>
                        <span style={{ 
                          fontSize: '0.7rem', fontWeight: 700, color: '#475569', 
                          background: '#f1f5f9', padding: '0.15rem 0.4rem', borderRadius: '4px', 
                          textTransform: 'uppercase' 
                        }}>
                          {doc.file_type || 'PDF'}
                        </span>
                      </div>
                      
                      <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', fontWeight: 800, color: '#334155', lineHeight: 1.4 }}>
                        {doc.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', wordBreak: 'break-all' }}>
                        File: {doc.file_name}
                      </p>
                    </div>

                    <a
                      href={doc.url}
                      download={doc.file_name}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.75rem',
                        background: 'rgba(139,0,0,0.06)',
                        border: '1px solid rgba(139,0,0,0.15)',
                        borderRadius: '12px',
                        color: 'var(--crimson)',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                        marginTop: '1.5rem',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--crimson)';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(139,0,0,0.06)';
                        e.currentTarget.style.color = 'var(--crimson)';
                      }}
                    >
                      <Download size={15} />
                      <span>Download File</span>
                    </a>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
