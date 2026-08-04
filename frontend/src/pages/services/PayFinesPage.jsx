import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Coins, FileText, User, Mail, ShieldCheck, ArrowLeft, CheckCircle2, Lock, Loader2 } from 'lucide-react';
import { submitCitizenService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function PayFinesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { citizen, isCitizenLoggedIn } = useAuth();

  const [step, setStep] = useState('form'); // form, payment, success
  const [ticketNo, setTicketNo] = useState('');
  const [offenseType, setOffenseType] = useState('Parking Violation');
  const [amount, setAmount] = useState('');

  // Payment states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const [loading, setLoading] = useState(false);
  const [refNo, setRefNo] = useState('');
  const [error, setError] = useState('');

  // Redirect if not logged in
  if (!isCitizenLoggedIn) {
    navigate('/login?redirect=/services/pay-fines');
    return null;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (Number(amount) <= 0) {
      setError('Fine amount must be greater than 0.');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = {
      applicant_name: citizen.name,
      applicant_email: citizen.email,
      applicant_phone: citizen.phone,
      applicant_nic: citizen.nic,
      fine_ticket_number: ticketNo,
      offense_type: offenseType,
      payment_method: 'Credit Card (Mock)',
    };

    try {
      const res = await submitCitizenService({
        service_type: 'fine_payment',
        amount: Number(amount),
        form_data: formData,
      });

      const submissionId = res.data.data.id;
      setRefNo(res.data.data.reference_no);

      await submitCitizenService({
        service_type: 'fine_payment_confirmation',
        amount: Number(amount),
        form_data: { ...formData, submission_id: submissionId, mock_payment: 'success' }
      });

      setStep('success');
    } catch (err) {
      setError(err?.response?.data?.message || 'Transaction failed. Please check payment details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '80vh', padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
          <span>/</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/services/more')}>E-Services</span>
          <span>/</span>
          <span style={{ color: 'var(--crimson)', fontWeight: 600 }}>Pay Fines</span>
        </div>

        {step === 'form' && (
          <div
            style={{
              background: '#fff',
              border: '1px solid var(--mid-gray)',
              borderRadius: '16px',
              padding: '2.5rem 2rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '12px',
                  background: 'rgba(139,0,0,0.08)',
                  color: 'var(--crimson)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Coins size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--crimson)', margin: 0 }}>
                  Pay Outstanding Fines & Penalties
                </h1>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: '#666' }}>
                  Pay CMA structural violation fines, late registration penalties, or common area obstruction tickets.
                </p>
              </div>
            </div>

            {error && (
              <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                    Fine Ticket / Reference Number
                  </label>
                  <input
                    type="text"
                    value={ticketNo}
                    onChange={(e) => setTicketNo(e.target.value)}
                    required
                    placeholder="WP-CMA-FN-12345"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '8px',
                      outline: 'none',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                    Offense Category
                  </label>
                  <select
                    value={offenseType}
                    onChange={(e) => setOffenseType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '8px',
                      outline: 'none',
                      fontSize: '0.9rem',
                    }}
                  >
                    <option value="Parking Violation">Illegal Parking / Permit Abuse (LKR 2,500 - 5,000)</option>
                    <option value="Common Area Obstruction">Obstruction of Common Amenities (LKR 10,000)</option>
                    <option value="Late Registration">Late Management Corp Registration Fee (LKR 5,000)</option>
                    <option value="Unapproved Renovation">Unapproved Structural Modification Fine (LKR 50,000)</option>
                    <option value="Other Penalty">Other Regulatory Penalties / Custom Fine</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                  Fine Amount to Pay (LKR)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min={1}
                  placeholder="5000"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, var(--crimson), #a50000)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>Proceed to Pay Securely</span>
              </button>
            </form>
          </div>
        )}

        {step === 'payment' && (
          <div
            style={{
              background: '#fff',
              border: '1px solid var(--mid-gray)',
              borderRadius: '16px',
              padding: '2.5rem 2rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--mid-gray)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--crimson)', margin: 0 }}>
                  Secure Payment Gateway
                </h2>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#666' }}>
                  CMA Unified Fine Settlement Portal
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>Merchant Ref</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#333' }}>CMA-FINES-MOCK</div>
              </div>
            </div>

            <div
              style={{
                background: 'var(--off-white)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem',
                border: '1px solid var(--mid-gray)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Fine Settlement Amount</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1a1a1a', marginTop: '0.15rem' }}>
                  LKR {Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <div style={{ width: 32, height: 20, background: 'var(--mid-gray)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700, color: '#475569' }}>VISA</div>
                <div style={{ width: 32, height: 20, background: 'var(--mid-gray)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 700, color: '#475569' }}>MC</div>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', marginBottom: '0.35rem' }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                  placeholder="KAMAL PERERA"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', marginBottom: '0.35rem' }}>
                  Card Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    placeholder="4111 2222 3333 4444"
                    maxLength={19}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '8px',
                      outline: 'none',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', marginBottom: '0.35rem' }}>
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '8px',
                      outline: 'none',
                      fontSize: '0.9rem',
                      textAlign: 'center',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', marginBottom: '0.35rem' }}>
                    CVV / Security Code
                  </label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    required
                    placeholder="•••"
                    maxLength={3}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '8px',
                      outline: 'none',
                      fontSize: '0.9rem',
                      textAlign: 'center',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1.5px solid var(--mid-gray)',
                    borderRadius: '8px',
                    background: '#fff',
                    color: '#64748b',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Back to Details
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2,
                    padding: '0.75rem',
                    background: loading ? '#c4b5b5' : 'linear-gradient(135deg, #16a34a, #15803d)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <ShieldCheck size={16} />}
                  <span>{loading ? 'Processing…' : 'Pay LKR ' + Number(amount).toLocaleString('en-US')}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div
            style={{
              background: '#fff',
              border: '1px solid var(--mid-gray)',
              borderRadius: '16px',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: '#f0fdf4',
                color: '#15803d',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <CheckCircle2 size={40} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a1a1a', margin: '0 0 0.5rem' }}>
              Fine Settled Successfully!
            </h2>
            <p style={{ color: '#666', fontSize: '1rem', margin: '0 0 1.5rem' }}>
              Your outstanding fine ticket has been paid and settled in full.
            </p>
            
            <div
              style={{
                background: 'var(--off-white)',
                border: '1.5px dashed var(--gold)',
                borderRadius: '10px',
                padding: '1.25rem',
                display: 'inline-block',
                marginBottom: '2rem',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                CMA Payment Reference No
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--crimson)', marginTop: '0.25rem' }}>
                {refNo}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.82rem', color: '#475569', borderTop: '1px solid var(--mid-gray)', marginTop: '0.75rem', paddingTop: '0.5rem' }}>
                <div><strong>Ticket No:</strong> {ticketNo}</div>
                <div><strong>Paid:</strong> LKR {Number(amount).toLocaleString()}</div>
              </div>
            </div>

            <div>
              <button
                onClick={() => navigate('/services/more')}
                style={{
                  padding: '0.75rem 2rem',
                  background: 'var(--crimson)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <ArrowLeft size={16} />
                <span>Go to My Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
