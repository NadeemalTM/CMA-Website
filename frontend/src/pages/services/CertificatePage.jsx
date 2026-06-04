import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { 
  Award, FileText, Lock, CheckCircle, Download, 
  AlertCircle, CreditCard, ArrowRight, ChevronRight, 
  Calendar, ShieldAlert, Sparkles, Receipt, ExternalLink
} from 'lucide-react';
import { 
  getCertificates, getCertificate, initiateCertificatePayment, 
  completeCertificatePayment, getMyCertificatePayments 
} from '../../services/api';

export default function CertificatePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { citizen, isCitizenLoggedIn } = useAuth();

  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState('');
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccessRef, setPaymentSuccessRef] = useState('');

  // 1. Fetch certificate types
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await getCertificates();
      const list = res.data.data;
      setCertificates(list);
      
      // Parse id from URL query parameter if available
      const queryParams = new URLSearchParams(location.search);
      const targetId = queryParams.get('id');
      let defaultCert = null;
      
      if (targetId && list.length > 0) {
        defaultCert = list.find(c => c.id === parseInt(targetId));
      }
      
      if (defaultCert) {
        handleSelectCertificate(defaultCert);
      } else if (list.length > 0) {
        handleSelectCertificate(list[0]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load certificates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch payments if logged in
  const fetchPayments = async () => {
    if (!isCitizenLoggedIn) return;
    try {
      const res = await getMyCertificatePayments();
      setPayments(res.data.data);
    } catch (err) {
      console.error('Error fetching payments', err);
    }
  };

  // 3. Fetch full details (with documents) of selected certificate
  const handleSelectCertificate = async (cert) => {
    setLoadingDetails(true);
    try {
      const res = await getCertificate(cert.id);
      setSelectedCert(res.data.data);
      // Update query param in URL so that URL reflects selection
      navigate(`/services/certificate?id=${cert.id}`, { replace: true });
    } catch (err) {
      console.error(err);
      setError('Failed to load certificate instructions.');
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [i18n.language]); // Refetch when language changes so titles are updated

  useEffect(() => {
    fetchPayments();
  }, [isCitizenLoggedIn]);

  // Check if current selected certificate type is paid
  const getSelectedCertPayment = () => {
    if (!selectedCert || !isCitizenLoggedIn) return null;
    return payments.find(p => Number(p.certificate_type_id) === Number(selectedCert.id) && p.status === 'completed');
  };

  const isPaid = !!getSelectedCertPayment();

  // Initiate Payment Flow
  const handleInitiatePayment = async () => {
    if (!isCitizenLoggedIn) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    setShowPaymentModal(true);
  };

  // Submit Simulated Payment
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!selectedCert) return;
    
    setPaymentProcessing(true);
    try {
      // 1. Call API to initiate payment (creates reference)
      const initRes = await initiateCertificatePayment(selectedCert.id);
      const { reference_no } = initRes.data.data;

      // Simulate a small delay for bank response
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 2. Complete payment in backend
      await completeCertificatePayment(reference_no, { payment_method: 'card' });

      // 3. Update local states
      setPaymentSuccessRef(reference_no);
      await fetchPayments(); // refresh payment records
      
      // reload certificate details to get files list
      const res = await getCertificate(selectedCert.id);
      setSelectedCert(res.data.data);

      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccessRef('');
        setPaymentData({ cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '' });
        // Redirect directly to the document downloads page
        navigate(`/services/certificate/downloads/${selectedCert.id}`);
      }, 2000);


    } catch (err) {
      console.error(err);
      alert('Payment processing failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Demo bypass payment function
  const handleDemoBypassPayment = async () => {
    if (!selectedCert) return;
    setPaymentProcessing(true);
    setPaymentData({
      cardNumber: '4111 2222 3333 4444',
      cardExpiry: '12/29',
      cardCvv: '123',
      cardName: 'Demo Citizen'
    });
    try {
      // 1. Call API to initiate payment
      const initRes = await initiateCertificatePayment(selectedCert.id);
      const { reference_no } = initRes.data.data;

      // 2. Complete payment in backend immediately (no long delay)
      await completeCertificatePayment(reference_no, { payment_method: 'demo_bypass' });

      // 3. Update local states
      setPaymentSuccessRef(reference_no);
      await fetchPayments(); // refresh payment records
      
      // reload certificate details
      const res = await getCertificate(selectedCert.id);
      setSelectedCert(res.data.data);

      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccessRef('');
        setPaymentData({ cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '' });
        // Redirect directly to the document downloads page
        navigate(`/services/certificate/downloads/${selectedCert.id}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      alert('Demo bypass payment failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const renderInstructions = (text) => {
    if (!text) return null;
    // If it looks like HTML, render it as-is for backwards compatibility
    if (text.includes('</') || text.includes('/>') || text.includes('<h3>') || text.includes('<ul>')) {
      return <div dangerouslySetInnerHTML={{ __html: text }} />;
    }

    // Otherwise, parse it as plain text with simple markdown rules
    const lines = text.split('\n');
    const elements = [];
    let currentList = null; // { type: 'ul'|'ol', items: [] }

    const pushCurrentList = () => {
      if (currentList) {
        if (currentList.type === 'ul') {
          elements.push(
            <ul key={elements.length} style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', listStyleType: 'disc' }}>
              {currentList.items.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '0.4rem', color: '#475569' }}>{item}</li>
              ))}
            </ul>
          );
        } else {
          elements.push(
            <ol key={elements.length} style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', listStyleType: 'decimal' }}>
              {currentList.items.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '0.4rem', color: '#475569' }}>{item}</li>
              ))}
            </ol>
          );
        }
        currentList = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        pushCurrentList();
        continue;
      }

      // Check for headings: starts with '#'
      if (line.startsWith('### ')) {
        pushCurrentList();
        elements.push(
          <h4 key={elements.length} style={{ fontSize: '1.02rem', fontWeight: 750, marginTop: '1.25rem', marginBottom: '0.5rem', color: '#1f2937' }}>
            {line.replace('### ', '')}
          </h4>
        );
      } else if (line.startsWith('## ') || line.startsWith('# ')) {
        pushCurrentList();
        const cleanLine = line.replace(/^##?\s+/, '');
        elements.push(
          <h3 key={elements.length} style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '1.5rem', marginBottom: '0.6rem', color: '#1f2937' }}>
            {cleanLine}
          </h3>
        );
      } 
      // Check for bullets: starts with '-', '*', or '•'
      else if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
        const cleanLine = line.replace(/^[-*•]\s+/, '');
        if (currentList && currentList.type !== 'ul') {
          pushCurrentList();
        }
        if (!currentList) {
          currentList = { type: 'ul', items: [] };
        }
        currentList.items.push(cleanLine);
      }
      // Check for numbered lists: starts with digits and a dot
      else if (/^\d+\.\s+/.test(line)) {
        const cleanLine = line.replace(/^\d+\.\s+/, '');
        if (currentList && currentList.type !== 'ol') {
          pushCurrentList();
        }
        if (!currentList) {
          currentList = { type: 'ol', items: [] };
        }
        currentList.items.push(cleanLine);
      }
      // Regular paragraph
      else {
        pushCurrentList();
        elements.push(
          <p key={elements.length} style={{ margin: '0.6rem 0 0.85rem', lineHeight: '1.6', color: '#475569' }}>
            {line}
          </p>
        );
      }
    }
    pushCurrentList();

    return <div>{elements}</div>;
  };

  return (

    <div style={{ background: '#fcfbf9', minHeight: '80vh', padding: '3.5rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Page title header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ 
            fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold)', 
            textTransform: 'uppercase', letterSpacing: '2.5px', display: 'block', marginBottom: '0.5rem' 
          }}>
            Official Clearance &amp; Certification
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 850, color: 'var(--crimson)', margin: 0 }}>
            Get Condominium Certificates
          </h1>
          <p style={{ margin: '0.5rem 0 0', fontSize: '1rem', color: '#666', maxWidth: '600px', marginInline: 'auto' }}>
            Verify requirements, submit your clearance payments, and download certified condominium documents directly.
          </p>
        </div>

        {error && (
          <div style={{ 
            background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', 
            padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '2rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem' 
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="spinner" style={{ margin: '0 auto 1.5rem' }} />
            <p style={{ color: '#666', fontWeight: 500 }}>Loading certificate options...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2.5rem', alignItems: 'start' }}>
            
            {/* Sidebar with 4 Certificate Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                fontSize: '0.8rem', fontWeight: 700, color: '#64748b', 
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem', paddingLeft: '0.5rem'
              }}>
                Select Certificate Process
              </div>
              {certificates.map((cert) => {
                const isActive = selectedCert && selectedCert.id === cert.id;
                return (
                  <button
                    key={cert.id}
                    onClick={() => handleSelectCertificate(cert)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      padding: '1.25rem 1.5rem',
                      background: isActive ? '#fff' : 'transparent',
                      border: isActive ? '2px solid var(--crimson)' : '1px solid rgba(139,0,0,0.15)',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                      transform: isActive ? 'scale(1.02)' : 'none',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', 
                        background: isActive ? 'var(--crimson)' : 'rgba(139,0,0,0.06)',
                        color: isActive ? '#fff' : 'var(--crimson)',
                        display: 'flex', alignItems: 'center', justifyItems: 'center',
                        justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700
                      }}>
                        {cert.order}
                      </div>
                      <div style={{
                        fontSize: '0.92rem', fontWeight: 700,
                        color: isActive ? 'var(--crimson)' : '#334155',
                        maxWidth: '200px', lineHeight: 1.3
                      }}>
                        {cert.title}
                      </div>
                    </div>
                    <ChevronRight size={16} color={isActive ? 'var(--crimson)' : '#94a3b8'} />
                  </button>
                );
              })}

              {/* Citizen Payments quick reference */}
              {isCitizenLoggedIn && payments.length > 0 && (
                <div style={{
                  background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', 
                  padding: '1.25rem', marginTop: '1.5rem', boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Receipt size={16} color="var(--gold)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 750, color: '#1f2937', textTransform: 'uppercase' }}>
                      Your Paid Clearances
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {payments.filter(p => p.status === 'completed').slice(0, 5).map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => p.certificate_type_id && navigate(`/services/certificate/downloads/${p.certificate_type_id}`)}
                        style={{ 
                          display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', 
                          borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem', 
                          cursor: p.certificate_type_id ? 'pointer' : 'default',
                          transition: 'all 0.2s',
                          alignItems: 'center'
                        }}
                        onMouseEnter={e => { if (p.certificate_type_id) e.currentTarget.style.color = 'var(--crimson)'; }}
                        onMouseLeave={e => { if (p.certificate_type_id) e.currentTarget.style.color = 'inherit'; }}
                      >
                        <span style={{ fontWeight: 600, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: p.certificate_type_id ? 'underline' : 'none' }}>
                          {p.certificate}
                        </span>
                        <span style={{ color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <span>PAID</span>
                          {p.certificate_type_id && <ExternalLink size={10} />}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Instruction & Download Panel */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-md)',
              minHeight: '400px'
            }}>
              {loadingDetails ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                  <div className="spinner" />
                  <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>Fetching instructions and documents...</p>
                </div>
              ) : selectedCert ? (
                <div>
                  
                  {/* Selected title & fee */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1f2937', margin: 0 }}>
                        {selectedCert.title}
                      </h2>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                        Process Code: <strong style={{ color: 'var(--crimson)' }}>{selectedCert.code.toUpperCase()}</strong>
                      </span>
                    </div>
                    <div style={{
                      background: 'rgba(199,162,39,0.08)', border: '1.5px solid var(--gold)',
                      padding: '0.5rem 1rem', borderRadius: '12px', textAlign: 'right'
                    }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                        Document Access Fee
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--crimson)' }}>
                        LKR {Number(selectedCert.document_fee).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Auth Condition for Instructions */}
                  {!isCitizenLoggedIn ? (
                    /* Locked View for Unauthenticated Users */
                    <div style={{
                      background: '#fafaf9', border: '1.5px solid #e2e8f0', borderRadius: '16px',
                      padding: '2.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '1.25rem'
                    }}>
                      <div style={{
                        width: 54, height: 54, borderRadius: '50%', background: 'rgba(139,0,0,0.06)',
                        color: 'var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Lock size={24} />
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem', color: '#1f2937', fontSize: '1.1rem', fontWeight: 750 }}>
                          Access Restricted to Registered Citizens
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.88rem', color: '#666', maxWidth: '440px', lineHeight: 1.5 }}>
                          Please log in to your CMA Citizen account to review the process instructions, complete the fee payment, and download required official documents.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          background: 'var(--crimson)', color: '#fff', border: 'none',
                          padding: '0.75rem 1.5rem', borderRadius: '30px', fontWeight: 700,
                          fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139,0,0,0.2)'
                        }}
                      >
                        <span>Sign In / Register</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  ) : (
                    /* Instructions and Download Interface (Authenticated) */
                    <div>
                      <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 1rem' }}>
                          Process Instructions & Guidelines
                        </h3>
                        <div 
                          className="instructions-body"
                          style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6 }}
                        >
                          {renderInstructions(selectedCert.instructions)}
                        </div>
                      </div>

                      {/* Payment/Download state wrapper */}
                      <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '2rem', marginTop: '2rem' }}>
                        {isPaid ? (
                          /* PAID STATE - Show downloads */
                          <div>
                            <div style={{
                              background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '16px',
                              padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyItems: 'center',
                              justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                  width: 38, height: 38, borderRadius: '50%', background: '#22c55e',
                                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                  <CheckCircle size={20} />
                                </div>
                                <div>
                                  <h4 style={{ margin: 0, color: '#14532d', fontSize: '0.92rem', fontWeight: 800 }}>
                                    Clearance Completed &amp; Document Access Granted
                                  </h4>
                                  <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 500, marginTop: '0.1rem' }}>
                                    Ref: <strong>{getSelectedCertPayment()?.reference_no}</strong> • Paid: {new Date(getSelectedCertPayment()?.paid_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => navigate(`/services/certificate/downloads/${selectedCert.id}`)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                                  background: '#15803d', color: '#fff', border: 'none',
                                  padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 750,
                                  fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#166534'}
                                onMouseLeave={e => e.currentTarget.style.background = '#15803d'}
                              >
                                <span>View Document Downloads</span>
                                <ExternalLink size={12} />
                              </button>
                            </div>

                            {/* Download Cards Grid */}
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1f2937', marginBottom: '1rem' }}>
                              Attached Downloadable Documents
                            </h3>
                            
                            {!selectedCert.documents || selectedCert.documents.length === 0 ? (
                              <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                                  Payment successful. However, no documents have been attached to this certificate by the administrator yet.
                                </p>
                              </div>
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                                {selectedCert.documents.map((doc) => (
                                  <div
                                    key={doc.id}
                                    style={{
                                      background: '#fff',
                                      border: '1.5px solid #e2e8f0',
                                      borderRadius: '16px',
                                      padding: '1.25rem',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'space-between',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                      transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => {
                                      e.currentTarget.style.borderColor = 'var(--gold)';
                                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                    }}
                                    onMouseLeave={e => {
                                      e.currentTarget.style.borderColor = '#e2e8f0';
                                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                                    }}
                                  >
                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <FileText size={18} color="var(--crimson)" />
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '0.15rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                                          {doc.file_type || 'PDF'}
                                        </span>
                                      </div>
                                      <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: 750, color: '#334155', lineHeight: 1.4 }}>
                                        {doc.title}
                                      </h4>
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
                                        padding: '0.6rem',
                                        background: 'rgba(139,0,0,0.06)',
                                        border: '1px solid rgba(139,0,0,0.15)',
                                        borderRadius: '10px',
                                        color: 'var(--crimson)',
                                        fontSize: '0.8rem',
                                        fontWeight: 750,
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        textAlign: 'center',
                                        marginTop: '1rem',
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
                                      <Download size={13} />
                                      <span>Download File</span>
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          /* UNPAID STATE - Show payment button */
                          <div style={{
                            background: '#fafaf9', border: '1px solid #e2e8f0', borderRadius: '20px',
                            padding: '2rem', display: 'flex', alignItems: 'center', justifyItems: 'center',
                            justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', maxWidth: '500px' }}>
                              <div style={{
                                width: 42, height: 42, borderRadius: '50%', background: 'rgba(199,162,39,0.12)',
                                color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginTop: '0.2rem', flexShrink: 0
                              }}>
                                <CreditCard size={18} />
                              </div>
                              <div>
                                <h4 style={{ margin: '0 0 0.25rem', color: '#1f2937', fontSize: '0.98rem', fontWeight: 800 }}>
                                  Pay Document Access Fee
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', lineHeight: 1.4 }}>
                                  To unlock and download all official registration documents, application guides, and templates for this certificate type, please pay the document fee.
                                </p>
                              </div>
                            </div>
                            
                            <button
                              onClick={handleInitiatePayment}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                background: 'var(--crimson)', color: '#fff', border: 'none',
                                padding: '0.85rem 1.75rem', borderRadius: '30px', fontWeight: 800,
                                fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139,0,0,0.18)',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(139,0,0,0.25)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139,0,0,0.18)';
                              }}
                            >
                              <span>Download Document</span>
                              <ArrowRight size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
                  <Award size={48} strokeWidth={1} style={{ marginBottom: '1rem', color: '#cbd5e1' }} />
                  <p>Please select a certificate type to view instructions.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* ── SIMULATED PAYMENT GATEWAY MODAL ── */}
      {showPaymentModal && selectedCert && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div 
            style={{ position: 'absolute', inset: 0, background: 'rgba(13,0,0,0.7)', backdropFilter: 'blur(4px)' }} 
            onClick={() => !paymentProcessing && setShowPaymentModal(false)}
          />
          
          <div style={{
            position: 'relative', background: '#fff', borderRadius: '24px',
            border: '2px solid var(--gold)', width: '100%', maxWidth: '480px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)', overflow: 'hidden',
            animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both'
          }}>
            
            {/* Modal Header */}
            <div style={{
              background: '#8B0000', padding: '1.5rem', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CreditCard size={20} color="var(--gold)" />
                <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.5px' }}>
                  CMA Secure Checkout
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                <Sparkles size={11} color="var(--gold)" />
                <span>SSL Encrypted</span>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '2rem' }}>
              {paymentSuccessRef ? (
                /* Success Screen */
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%', background: '#dcfce7',
                    color: '#22c55e', display: 'inline-flex', alignItems: 'center',
                    justifyContent: 'center', marginBottom: '1.5rem'
                  }}>
                    <CheckCircle size={36} />
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem', color: '#1f2937', fontSize: '1.25rem', fontWeight: 800 }}>
                    Payment Successful!
                  </h3>
                  <p style={{ margin: '0 0 1.5rem', fontSize: '0.85rem', color: '#666' }}>
                    Your transaction has been processed successfully.
                  </p>
                  <div style={{
                    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px',
                    padding: '0.75rem', fontSize: '0.8rem', color: '#475569', wordBreak: 'break-all'
                  }}>
                    Ref: <strong style={{ color: 'var(--crimson)' }}>{paymentSuccessRef}</strong>
                  </div>
                </div>
              ) : (
                /* Form Form */
                <form onSubmit={handleProcessPayment}>
                  
                  {/* Order summary info */}
                  <div style={{
                    background: '#fcfbf9', border: '1px solid #f1e9db', borderRadius: '12px',
                    padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                        Certificate Document Fee
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 750, color: '#1f2937', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedCert.title}
                      </div>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 850, color: 'var(--crimson)' }}>
                      LKR {Number(selectedCert.document_fee).toLocaleString()}
                    </div>
                  </div>

                  {/* Demo/Testing Autofill & Bypass Button */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <button
                      type="button"
                      disabled={paymentProcessing}
                      onClick={handleDemoBypassPayment}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(199,162,39,0.08)',
                        border: '1.5px dashed var(--gold)',
                        color: '#b78b00',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box'
                      }}
                      onMouseEnter={e => {
                        if (!paymentProcessing) {
                          e.currentTarget.style.background = 'rgba(199,162,39,0.15)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!paymentProcessing) {
                          e.currentTarget.style.background = 'rgba(199,162,39,0.08)';
                        }
                      }}
                    >
                      <Sparkles size={14} />
                      <span>Autofill &amp; Express Checkout (Bypass)</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    {/* Cardholder Name */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={paymentData.cardName}
                        onChange={e => setPaymentData({ ...paymentData, cardName: e.target.value })}
                        disabled={paymentProcessing}
                        style={{
                          width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1',
                          borderRadius: '10px', fontSize: '0.88rem', outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Card Number */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                        Card Number
                      </label>
                      <input
                        type="text"
                        required
                        maxLength="19"
                        placeholder="4111 2222 3333 4444"
                        value={paymentData.cardNumber}
                        onChange={e => {
                          // Format with spaces
                          const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                          const matches = v.match(/\d{4,16}/g);
                          const match = (matches && matches[0]) || '';
                          const parts = [];
                          for (let i = 0, len = match.length; i < len; i += 4) {
                            parts.push(match.substring(i, i + 4));
                          }
                          const formatted = parts.length > 0 ? parts.join(' ') : v;
                          setPaymentData({ ...paymentData, cardNumber: formatted });
                        }}
                        disabled={paymentProcessing}
                        style={{
                          width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1',
                          borderRadius: '10px', fontSize: '0.88rem', outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          required
                          maxLength="5"
                          placeholder="MM/YY"
                          value={paymentData.cardExpiry}
                          onChange={e => {
                            let val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.length > 2) {
                              val = val.substring(0, 2) + '/' + val.substring(2, 4);
                            }
                            setPaymentData({ ...paymentData, cardExpiry: val });
                          }}
                          disabled={paymentProcessing}
                          style={{
                            width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1',
                            borderRadius: '10px', fontSize: '0.88rem', outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                          Security Code (CVV)
                        </label>
                        <input
                          type="password"
                          required
                          maxLength="3"
                          placeholder="123"
                          value={paymentData.cardCvv}
                          onChange={e => setPaymentData({ ...paymentData, cardCvv: e.target.value.replace(/[^0-9]/g, '') })}
                          disabled={paymentProcessing}
                          style={{
                            width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1',
                            borderRadius: '10px', fontSize: '0.88rem', outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    style={{
                      width: '100%', padding: '0.85rem', background: '#8B0000',
                      color: '#fff', border: 'none', borderRadius: '12px',
                      fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                      marginTop: '2rem', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(139,0,0,0.2)', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => !paymentProcessing && (e.currentTarget.style.background = 'var(--crimson)')}
                    onMouseLeave={e => !paymentProcessing && (e.currentTarget.style.background = '#8B0000')}
                  >
                    {paymentProcessing ? (
                      <>
                        <div className="spinner" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', margin: 0 }} />
                        <span>Authorizing Transaction...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={15} />
                        <span>Pay LKR {Number(selectedCert.document_fee).toLocaleString()} Securely</span>
                      </>
                    )}
                  </button>

                  {/* Cancel button */}
                  {!paymentProcessing && (
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      style={{
                        width: '100%', padding: '0.6rem', background: 'transparent',
                        color: '#64748b', border: 'none', borderRadius: '10px',
                        fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                        marginTop: '0.5rem', textAlign: 'center',
                      }}
                    >
                      Cancel and Go Back
                    </button>
                  )}

                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Styled animation keyframes injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .instructions-body ul, .instructions-body ol {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          padding-left: 1.5rem;
        }
        .instructions-body li {
          margin-bottom: 0.4rem;
        }
        .instructions-body h3 {
          font-size: 1.05rem;
          font-weight: 750;
          color: #1f2937;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
      `}} />

    </div>
  );
}
