/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, ArrowRight, Award, CheckCircle, Clock3, FileText, Lock, Receipt, X, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCertificate, getCertificates, getMyCertificatePayments, initiateCertificatePayment, getCertificateSettings, getStorageURL } from '../../services/api';

const emptyForm = {
  applicant_name: '',
  nic_or_passport: '',
  phone: '',
  email: '',
  address: '',
  organization: '',
  notes: '',
};

const statusLabel = (status) => {
  if (status === 'completed') return 'Paid — Downloads Available';
  if (status === 'failed') return 'Payment Rejected';
  return 'Pending Payment Review';
};

export default function CertificatePage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { citizen, isCitizenLoggedIn } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [certSettings, setCertSettings] = useState({ reference_banner: '', reference_banner_alt: '', payment_guideline_pdf: '', payment_guideline_title: '' });

  useEffect(() => {
    getCertificateSettings()
      .then((res) => {
        if (res.data?.data) setCertSettings(res.data.data);
      })
      .catch(() => {});
  }, []);

  const requestedId = Number(new URLSearchParams(location.search).get('id') || 1);

  const loadPayments = async () => {
    if (!isCitizenLoggedIn) {
      setPayments([]);
      return;
    }
    const response = await getMyCertificatePayments();
    setPayments(response.data.data || []);
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    getCertificates()
      .then(async (response) => {
        if (!active) return;
        const list = response.data.data || [];
        setCertificates(list);
        const selected = list.find((item) => Number(item.id) === requestedId) || list[0];
        if (!selected) return;
        const detailResponse = await getCertificate(selected.id);
        if (active) setSelectedCert(detailResponse.data.data);
      })
      .catch(() => active && setError('Unable to load certificate information. Please try again.'))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [requestedId, i18n.language]);

  useEffect(() => {
    loadPayments().catch(() => setError('Unable to load your certificate requests.'));
  }, [isCitizenLoggedIn]);

  const currentPayment = useMemo(() => {
    if (!selectedCert) return null;
    const matching = payments.filter((payment) => Number(payment.certificate_type_id) === Number(selectedCert.id));
    return matching.find((payment) => payment.status === 'completed') || matching[0] || null;
  }, [payments, selectedCert]);

  const openRequestForm = () => {
    if (!isCitizenLoggedIn) {
      navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
      return;
    }

    setForm({
      ...emptyForm,
      applicant_name: citizen?.name || '',
      nic_or_passport: citizen?.nic || '',
      phone: citizen?.phone || '',
      email: citizen?.email || '',
    });
    setSubmittedRequest(null);
    setFormOpen(true);
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    if (!selectedCert) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await initiateCertificatePayment(selectedCert.id, form);
      setSubmittedRequest(response.data.data);
      await loadPayments();
    } catch (requestError) {
      const validation = requestError?.response?.data?.errors;
      setError(validation ? Object.values(validation).flat().join(' ') : requestError?.response?.data?.message || 'Unable to submit the request.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectCertificate = (certificate) => {
    navigate(`/services/certificate?id=${certificate.id}`);
  };

  const renderInstructions = (instructions) => {
    if (!instructions) return <p>No instructions have been published.</p>;
    if (instructions.includes('<')) return <div dangerouslySetInnerHTML={{ __html: instructions }} />;
    return instructions.split('\n').filter(Boolean).map((line, index) => {
      if (line.startsWith('#')) return <h4 key={index} style={{ margin: '1rem 0 0.35rem', color: '#1f2937' }}>{line.replace(/^#+\s*/, '')}</h4>;
      if (/^[-*•]\s/.test(line)) return <div key={index} style={{ margin: '0.35rem 0', paddingLeft: '0.5rem' }}>• {line.replace(/^[-*•]\s*/, '')}</div>;
      return <p key={index} style={{ margin: '0.5rem 0' }}>{line}</p>;
    });
  };

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '80vh', padding: '3.5rem 1rem' }}>
      <div className="container" style={{ maxWidth: 1180, margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ color: 'var(--gold)', fontWeight: 800, letterSpacing: 2, fontSize: '0.78rem' }}>OFFICIAL CERTIFICATE DOCUMENTS</span>
          <h1 style={{ color: 'var(--crimson)', margin: '0.5rem 0', fontSize: '2.2rem' }}>Condominium Certificate Services</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Submit your details, receive a reference number, and wait for CMA payment verification before downloading documents.</p>
        </header>

        {error && (
          <div style={{ padding: '0.9rem 1rem', marginBottom: '1rem', color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, display: 'flex', gap: 8 }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : (
          <div className="cert-review-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
            <aside style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {certificates.map((certificate) => {
                const active = Number(certificate.id) === Number(selectedCert?.id);
                return (
                  <button key={certificate.id} onClick={() => selectCertificate(certificate)} style={{ textAlign: 'left', padding: '1rem', borderRadius: 12, border: active ? '2px solid var(--crimson)' : '1px solid #ddd', background: '#fff', color: active ? 'var(--crimson)' : '#334155', fontWeight: 750, cursor: 'pointer' }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginBottom: 4 }}>SERVICE {certificate.order}</span>
                    {certificate.title}
                  </button>
                );
              })}

              {isCitizenLoggedIn && payments.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 12, padding: '1rem', marginTop: 12 }}>
                  <strong style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}><Receipt size={15} /> Your Requests</strong>
                  {payments.slice(0, 8).map((payment) => (
                    <button key={payment.id} onClick={() => selectCertificate({ id: payment.certificate_type_id })} style={{ width: '100%', background: 'none', border: 0, borderTop: '1px solid #eee', padding: '8px 0', textAlign: 'left', cursor: 'pointer' }}>
                      <b style={{ color: 'var(--crimson)', fontSize: '0.78rem' }}>{payment.reference_no}</b>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: payment.status === 'completed' ? '#15803d' : payment.status === 'failed' ? '#b91c1c' : '#b45309' }}>{statusLabel(payment.status)}</span>
                    </button>
                  ))}
                </div>
              )}
            </aside>

            {selectedCert && (
              <main style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 20, padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', borderBottom: '1px solid #eee', paddingBottom: '1.25rem' }}>
                  <div>
                    <h2 style={{ margin: 0, color: '#1f2937' }}>{selectedCert.title}</h2>
                    <span style={{ color: 'var(--crimson)', fontWeight: 800, fontSize: '0.8rem' }}>{selectedCert.code.toUpperCase()}</span>
                  </div>
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '0.65rem 1rem', color: '#92400e' }}>
                    <small style={{ display: 'block' }}>Document fee</small>
                    <strong>LKR {Number(selectedCert.document_fee).toLocaleString()}</strong>
                  </div>
                </div>

                <section style={{ color: '#475569', lineHeight: 1.65, margin: '1.5rem 0' }}>
                  <h3 style={{ color: 'var(--crimson)', fontSize: '1.05rem' }}>Process Instructions</h3>
                  {renderInstructions(selectedCert.instructions)}
                </section>

                {!isCitizenLoggedIn ? (
                  <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: 14, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <Lock size={28} color="var(--crimson)" />
                    <h3 style={{ margin: '0.5rem 0' }}>Registered-user access</h3>
                    <p style={{ color: '#64748b' }}>Sign in or register before submitting payment details and accessing paid documents.</p>
                    <button className="btn btn-primary" onClick={openRequestForm}>Sign In / Register <ArrowRight size={14} /></button>
                  </div>
                ) : currentPayment?.status === 'completed' ? (
                  <div style={{ padding: '1.5rem', background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: 14 }}>
                    <CheckCircle size={26} color="#15803d" />
                    <h3 style={{ color: '#14532d', margin: '0.5rem 0' }}>Payment verified — documents available</h3>
                    <p style={{ color: '#166534' }}>Reference: <strong>{currentPayment.reference_no}</strong></p>
                    <button className="btn btn-primary" onClick={() => navigate(`/services/certificate/downloads/${selectedCert.id}`)}>View Downloadable Documents</button>
                  </div>
                ) : currentPayment?.status === 'pending' ? (
                  <div style={{ padding: '1.5rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 14 }}>
                    {certSettings.reference_banner && (
                      <div style={{ marginBottom: '12px' }}>
                        <img src={getStorageURL(certSettings.reference_banner)} alt={certSettings.reference_banner_alt || 'Certificate information'} style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: 10, border: '1px solid #fde68a' }} />
                      </div>
                    )}
                    <Clock3 size={26} color="#b45309" />
                    <h3 style={{ color: '#92400e', margin: '0.5rem 0' }}>Payment review pending</h3>
                    <p style={{ color: '#92400e' }}>Reference: <strong style={{ fontSize: '1.1rem' }}>{currentPayment.reference_no}</strong></p>
                    <p style={{ color: '#92400e', fontSize: '0.85rem' }}>CMA administrators will review this request. Downloads become available after it is marked as paid.</p>

                    {certSettings.payment_guideline_pdf && (
                      <div style={{ margin: '14px 0', padding: '12px', background: '#fff', borderRadius: 10, border: '1px solid #fde68a', textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, color: '#0369a1', fontSize: '0.82rem', marginBottom: 6 }}>
                          {certSettings.payment_guideline_title || 'Payment Guidelines & Bank Instructions'}
                        </div>
                        <a
                          href={getStorageURL(certSettings.payment_guideline_pdf)}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
                        >
                          <Download size={13} /> Download Payment Guidelines (PDF)
                        </a>
                      </div>
                    )}

                    <button className="btn btn-outline" onClick={() => loadPayments().catch(() => setError('Unable to refresh payment status.'))}>Refresh Status</button>
                  </div>
                ) : (
                  <div style={{ padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                      <FileText size={24} color="var(--crimson)" />
                      <h3 style={{ margin: '0.35rem 0' }}>{currentPayment?.status === 'failed' ? 'Previous request was not approved' : 'Request document access'}</h3>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Enter your details to create a pending payment-review request.</p>
                    </div>
                    <button className="btn btn-primary" onClick={openRequestForm}>Download Document <ArrowRight size={14} /></button>
                  </div>
                )}
              </main>
            )}
          </div>
        )}
      </div>

      {formOpen && selectedCert && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={() => !submitting && setFormOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.65)' }} />
          <div style={{ position: 'relative', background: '#fff', borderRadius: 18, padding: '1.75rem', width: '100%', maxWidth: 650, maxHeight: '90vh', overflow: 'auto' }}>
            <button onClick={() => setFormOpen(false)} style={{ position: 'absolute', right: 16, top: 16, border: 0, background: 'none', cursor: 'pointer' }}><X size={20} /></button>
            {submittedRequest ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                {certSettings.reference_banner && (
                  <div style={{ marginBottom: '14px' }}>
                    <img src={getStorageURL(certSettings.reference_banner)} alt={certSettings.reference_banner_alt || 'Certificate banner'} style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: 10, border: '1px solid #eee' }} />
                  </div>
                )}
                <Clock3 size={44} color="#b45309" />
                <h2 style={{ color: '#92400e', margin: '0.5rem 0' }}>Payment Review Pending</h2>
                <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Your details were submitted successfully. No online payment has been recorded yet.</p>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '1rem', margin: '1rem 0' }}>
                  <small style={{ display: 'block', color: '#92400e' }}>Meaningful Reference Number</small>
                  <strong style={{ color: 'var(--crimson)', fontSize: '1.6rem', letterSpacing: 1 }}>{submittedRequest.reference_no}</strong>
                </div>

                {certSettings.payment_guideline_pdf && (
                  <div style={{ margin: '14px 0', padding: '12px', background: '#f0f9ff', borderRadius: 10, border: '1px solid #bae6fd', textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#0369a1', fontSize: '0.82rem', marginBottom: 6 }}>
                      {certSettings.payment_guideline_title || 'Payment Guidelines & Bank Instructions'}
                    </div>
                    <a
                      href={getStorageURL(certSettings.payment_guideline_pdf)}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
                    >
                      <Download size={13} /> Download Payment Guidelines (PDF)
                    </a>
                  </div>
                )}

                <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '10px 0 16px' }}>Keep this reference number. Once an administrator marks the payment as paid, your registered account will show the downloadable documents.</p>
                <button className="btn btn-primary" onClick={() => setFormOpen(false)}>Close</button>
              </div>
            ) : (
              <form onSubmit={submitRequest}>
                <Award size={30} color="var(--crimson)" />
                <h2 style={{ margin: '0.5rem 0 0' }}>Document Access Request</h2>
                <p style={{ color: '#64748b', marginTop: 6 }}>{selectedCert.title} — LKR {Number(selectedCert.document_fee).toLocaleString()}</p>
                <div className="certificate-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <label>Full Name *<input className="form-control" required value={form.applicant_name} onChange={(e) => setForm({ ...form, applicant_name: e.target.value })} /></label>
                  <label>NIC / Passport *<input className="form-control" required value={form.nic_or_passport} onChange={(e) => setForm({ ...form, nic_or_passport: e.target.value })} /></label>
                  <label>Phone Number *<input className="form-control" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
                  <label>Email Address *<input className="form-control" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                  <label style={{ gridColumn: '1 / -1' }}>Postal Address *<textarea className="form-control" required rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
                  <label>Organization / Company<input className="form-control" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} /></label>
                  <label>Additional Notes<textarea className="form-control" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setFormOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit for Payment Review'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .certificate-form-grid label { color:#475569; font-size:.78rem; font-weight:700; }
        .certificate-form-grid .form-control { width:100%; margin-top:5px; box-sizing:border-box; }
        @media (max-width: 850px) { .cert-review-grid { grid-template-columns:1fr !important; } }
        @media (max-width: 560px) { .certificate-form-grid { grid-template-columns:1fr !important; } .certificate-form-grid label { grid-column:auto !important; } }
      `}</style>
    </div>
  );
}
