import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Key, User, MapPin, Building, Mail, Phone, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { submitCitizenService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function PropertyServicePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { citizen, isCitizenLoggedIn } = useAuth();

  const [type, setType] = useState('Buying'); // Buying or Renting
  const [condoName, setCondoName] = useState('');
  const [unitNo, setUnitNo] = useState('');
  const [address, setAddress] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refNo, setRefNo] = useState('');
  const [error, setError] = useState('');

  // Redirect if not logged in
  if (!isCitizenLoggedIn) {
    navigate('/login?redirect=/services/property');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = {
      applicant_name: citizen.name,
      applicant_email: citizen.email,
      applicant_phone: citizen.phone,
      applicant_nic: citizen.nic,
      transaction_type: type,
      condominium_name: condoName,
      unit_number: unitNo,
      property_address: address,
      current_owner_name: ownerName,
      additional_notes: notes,
    };

    try {
      const res = await submitCitizenService({
        service_type: 'property_transaction',
        amount: 0,
        form_data: formData,
      });
      setRefNo(res.data.data.reference_no);
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit application. Please try again.');
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
          <span style={{ color: 'var(--crimson)', fontWeight: 600 }}>Buying & Renting Property</span>
        </div>

        {success ? (
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
              Submission Successful!
            </h2>
            <p style={{ color: '#666', fontSize: '1rem', margin: '0 0 1.5rem' }}>
              Your application for Buying and Renting Private Property clearance has been recorded.
            </p>
            
            <div
              style={{
                background: 'var(--off-white)',
                border: '1.5px dashed var(--gold)',
                borderRadius: '10px',
                padding: '1rem',
                display: 'inline-block',
                marginBottom: '2rem',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                Application Reference Number
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--crimson)', marginTop: '0.25rem' }}>
                {refNo}
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
        ) : (
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
                <Key size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--crimson)', margin: 0 }}>
                  Buying & Renting Private Property
                </h1>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: '#666' }}>
                  Register or submit private residential/condominium transaction clearance documents.
                </p>
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: '#fff5f5',
                  border: '1px solid #fed7d7',
                  color: '#c53030',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  marginBottom: '1.5rem',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* Type Switch */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' }}>
                  Transaction Intent
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setType('Buying')}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: `2px solid ${type === 'Buying' ? 'var(--crimson)' : '#e5e7eb'}`,
                      background: type === 'Buying' ? 'rgba(139,0,0,0.05)' : '#fff',
                      color: type === 'Buying' ? 'var(--crimson)' : '#4b5563',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    Buying Property
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('Renting')}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: `2px solid ${type === 'Renting' ? 'var(--crimson)' : '#e5e7eb'}`,
                      background: type === 'Renting' ? 'rgba(139,0,0,0.05)' : '#fff',
                      color: type === 'Renting' ? 'var(--crimson)' : '#4b5563',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    Renting Property
                  </button>
                </div>
              </div>

              {/* Grid 2 Columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                    Condominium / Property Name
                  </label>
                  <input
                    type="text"
                    value={condoName}
                    onChange={(e) => setCondoName(e.target.value)}
                    required
                    placeholder="Empire Residences"
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
                    Unit / Flat Number
                  </label>
                  <input
                    type="text"
                    value={unitNo}
                    onChange={(e) => setUnitNo(e.target.value)}
                    required
                    placeholder="Block B, 4th Floor, Unit 402"
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

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                  Full Property Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="No. 42, Braybrooke Place, Colombo 02"
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

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                  Current Property Owner Name
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                  placeholder="Mr. Suneth De Silva"
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

              {/* Applicant Info Banner */}
              <div
                style={{
                  background: 'var(--off-white)',
                  border: '1px solid var(--mid-gray)',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Applicant Information (Logged In User)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                  <div><strong>Name:</strong> {citizen.name}</div>
                  <div><strong>Email:</strong> {citizen.email}</div>
                  <div><strong>NIC:</strong> {citizen.nic}</div>
                  <div><strong>Phone:</strong> {citizen.phone}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                  Additional Notes or Remarks (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide any additional details or files reference link..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: loading ? '#c4b5b5' : 'linear-gradient(135deg, var(--crimson), #a50000)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(139,0,0,0.2)',
                }}
              >
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
                <span>{loading ? 'Submitting…' : 'Submit Clearance Application'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
