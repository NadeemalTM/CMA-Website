import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hammer, User, MapPin, Building, Calendar, Info, Send, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { submitCitizenService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function RenovationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { citizen, isCitizenLoggedIn } = useAuth();

  const [condoName, setCondoName] = useState('');
  const [unitNo, setUnitNo] = useState('');
  const [address, setAddress] = useState('');
  const [renovationType, setRenovationType] = useState('Interior Only');
  const [contractor, setContractor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [durationWeeks, setDurationWeeks] = useState('4');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refNo, setRefNo] = useState('');
  const [error, setError] = useState('');

  // Redirect if not logged in
  if (!isCitizenLoggedIn) {
    navigate('/login?redirect=/services/renovation');
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
      condominium_name: condoName,
      unit_number: unitNo,
      property_address: address,
      renovation_type: renovationType,
      contractor_name_contact: contractor,
      work_start_date: startDate,
      estimated_duration_weeks: durationWeeks,
      work_description: description,
    };

    try {
      const res = await submitCitizenService({
        service_type: 'renovation_clearance',
        amount: 0,
        form_data: formData,
      });
      setRefNo(res.data.data.reference_no);
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit clearance. Please try again.');
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
          <span style={{ color: 'var(--crimson)', fontWeight: 600 }}>Renovating Private Residential Property</span>
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
              Clearance Filed Successfully!
            </h2>
            <p style={{ color: '#666', fontSize: '1rem', margin: '0 0 1.5rem' }}>
              Your private residential renovation clearance request has been received. Our team will review the structural impact of the works.
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
                <Hammer size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--crimson)', margin: 0 }}>
                  Renovating Residential Property
                </h1>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: '#666' }}>
                  Submit details of planned residential renovations to get structural/regulatory clearance.
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
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                    Condominium Name
                  </label>
                  <input
                    type="text"
                    value={condoName}
                    onChange={(e) => setCondoName(e.target.value)}
                    required
                    placeholder="Grandview Condos"
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
                    placeholder="Floor 10, Unit 10C"
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
                  Property Location Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="No. 15, Park Street, Colombo 02"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                    Type of Renovation
                  </label>
                  <select
                    value={renovationType}
                    onChange={(e) => setRenovationType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '8px',
                      outline: 'none',
                      fontSize: '0.9rem',
                    }}
                  >
                    <option value="Interior Only">Interior Styling / Painting (Low Risk)</option>
                    <option value="Structural Walls">Structural Walls / Partition Removal</option>
                    <option value="Plumbing & Tiling">Bathroom Plumbing / Retiling</option>
                    <option value="Electrical Rewiring">Whole Unit Electrical Rewiring</option>
                    <option value="Major Remodeling">Major Remodeling & Structural Changes</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                    Contractor & Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={contractor}
                    onChange={(e) => setContractor(e.target.value)}
                    placeholder="Saman Builders - 0777123456"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                    Proposed Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
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
                    Estimated Duration (Weeks)
                  </label>
                  <input
                    type="number"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(e.target.value)}
                    required
                    min={1}
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

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.375rem' }}>
                  Detailed Description of Renovation Work
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe structural walls being moved, new kitchen layout, materials being brought in..."
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

              {/* Informative block */}
              <div
                style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.82rem',
                  color: '#1e3a8a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.5rem',
                }}
              >
                <Info size={16} style={{ flexShrink: 0 }} />
                <span>Notice: High-risk renovations affecting building structural integrity require physical inspection by a CMA structural engineer.</span>
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
                <span>{loading ? 'Filing Clearance…' : 'Submit Clearance Request'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
