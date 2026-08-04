import { useState, useRef, useEffect } from 'react';
import T from '../components/ui/T';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, CreditCard, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCitizenProfile, uploadCitizenProfilePicture } from '../services/api';

export default function CitizenProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { citizen, isCitizenLoggedIn, citizenToken, citizenLogin } = useAuth();
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isCitizenLoggedIn) {
      navigate('/login?redirect=/profile');
      return;
    }

    getCitizenProfile()
      .then(({ data }) => {
        citizenLogin(data.data, citizenToken);
      })
      .catch(err => console.error('Failed to sync profile:', err));
  }, [isCitizenLoggedIn, navigate, citizenToken]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please select a file smaller than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append('profile_picture', file);

    setIsUploading(true);
    try {
      const response = await uploadCitizenProfilePicture(formData);
      // Sync auth context with new user data containing the picture URL
      citizenLogin(response.data.data, citizenToken);
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      alert('There was an error uploading your picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isCitizenLoggedIn || !citizen) return null;

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '80vh', padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--crimson)', margin: 0 }}><T>
            Citizen Profile
          </T></h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#666' }}><T>
            View your personal details and account status.
          </T></p>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--mid-gray)', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ textAlign: 'center', paddingBottom: '2rem', borderBottom: '1px solid var(--light-gray)', marginBottom: '2rem' }}>
            
            {/* Avatar container */}
            <div 
              style={{
                position: 'relative',
                width: 90,
                height: 90,
                margin: '0 auto 1rem',
                borderRadius: '50%',
                cursor: 'pointer',
                overflow: 'hidden',
                background: 'var(--crimson)',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* Display Profile Picture or Initial */}
              {citizen.profile_picture_url ? (
                <img 
                  src={citizen.profile_picture_url} 
                  alt={citizen.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ width: '100%', height: '100%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700 }}>
                  {citizen.name[0].toUpperCase()}
                </div>
              )}

              {/* Hover Overlay */}
              <div 
                className="avatar-overlay"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
              >
                {isUploading ? <Loader2 className="spinner" color="#fff" size={24} /> : <Camera color="#fff" size={24} />}
              </div>
            </div>

            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/png, image/jpeg, image/jpg" 
              style={{ display: 'none' }} 
            />

            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>
              {citizen.name}
            </h3>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}><T>
              Verified Citizen
            </T></span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1rem' }}>
            <div>
              <div style={{ color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>Email Address</div>
              <div style={{ fontWeight: 500, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} color="#94a3b8" />
                <span>{citizen.email}</span>
              </div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>National ID (NIC)</div>
              <div style={{ fontWeight: 500, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={18} color="#94a3b8" />
                <span>{citizen.nic}</span>
              </div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>Phone Number</div>
              <div style={{ fontWeight: 500, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={18} color="#94a3b8" />
                <span>{citizen.phone}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
