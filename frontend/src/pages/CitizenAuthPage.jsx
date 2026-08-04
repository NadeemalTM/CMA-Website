import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Phone, CreditCard, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { citizenLogin, citizenRegister } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CitizenAuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { citizenLogin: saveCitizen, isCitizenLoggedIn } = useAuth();

  const redirectUrl = searchParams.get('redirect') || '/services/more';
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nic, setNic] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isCitizenLoggedIn) {
      navigate(redirectUrl);
    }
  }, [isCitizenLoggedIn, navigate, redirectUrl]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await citizenLogin({ email, password });
      const { user, token } = res.data;
      saveCitizen(user, token);
      setSuccess('Successfully authenticated!');
      setTimeout(() => {
        navigate(redirectUrl);
      }, 800);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Authentication failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await citizenRegister({
        name,
        email,
        password,
        phone,
        nic,
      });
      setSuccess('Account created successfully! You can now log in.');
      // Auto-fill login credentials and switch tab
      setActiveTab('login');
      setPassword('');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a0000 0%, #3d0000 50%, #1a0000 100%)',
        padding: '3rem 1rem',
        fontFamily: 'inherit',
      }}
    >
      {/* Background decoration elements */}
      <div
        style={{
          position: 'absolute',
          width: '28rem',
          height: '28rem',
          borderRadius: '50%',
          background: 'rgba(201,162,39,0.04)',
          top: '15%',
          right: '5%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '20rem',
          height: '20rem',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.02)',
          bottom: '10%',
          left: '5%',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          position: 'relative',
          zIndex: 1,
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--crimson)',
              letterSpacing: '-0.02em',
            }}
          >
            Citizen Services Portal
          </h1>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.88rem', color: '#666' }}>
            Condominium Management Authority — Sri Lanka
          </p>
        </div>

        {/* Tab Selection */}
        <div
          style={{
            display: 'flex',
            background: '#f3f4f6',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '1.75rem',
          }}
        >
          <button
            onClick={() => {
              setActiveTab('login');
              setError('');
              setSuccess('');
            }}
            style={{
              flex: 1,
              padding: '0.6rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeTab === 'login' ? '#fff' : 'transparent',
              color: activeTab === 'login' ? 'var(--crimson)' : '#666',
              boxShadow: activeTab === 'login' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setError('');
              setSuccess('');
            }}
            style={{
              flex: 1,
              padding: '0.6rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeTab === 'register' ? '#fff' : 'transparent',
              color: activeTab === 'register' ? 'var(--crimson)' : '#666',
              boxShadow: activeTab === 'register' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Register
          </button>
        </div>

        {/* Success Alert */}
        {success && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              color: '#15803d',
              fontSize: '0.88rem',
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            {success}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: '#fff5f5',
              border: '1px solid #fed7d7',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              color: '#c53030',
              fontSize: '0.88rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '1.15rem' }}>
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.375rem',
                }}
              >
                Email Address <span style={{ color: 'var(--crimson)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                  }}
                />
                <input
                  id="login-email"
                  name="login-email"
                  autoComplete="username"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@email.com"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.5rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--crimson)')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label
                htmlFor="login-password"
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.375rem',
                }}
              >
                Password <span style={{ color: 'var(--crimson)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                  }}
                />
                <input
                  id="login-password"
                  name="login-password"
                  autoComplete="current-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.65rem 2.5rem 0.65rem 2.5rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--crimson)')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
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
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {loading ? 'Logging in…' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Registration Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="reg-name"
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.375rem',
                }}
              >
                Full Name <span style={{ color: 'var(--crimson)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                  }}
                />
                <input
                  id="reg-name"
                  name="reg-name"
                  autoComplete="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Kamal Perera"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.5rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--crimson)')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="reg-email"
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.375rem',
                }}
              >
                Email Address <span style={{ color: 'var(--crimson)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                  }}
                />
                <input
                  id="reg-email"
                  name="reg-email"
                  autoComplete="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="kamal@email.com"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.5rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--crimson)')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="reg-nic"
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.375rem',
                }}
              >
                NIC Number (National Identity Card) <span style={{ color: 'var(--crimson)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <CreditCard
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                  }}
                />
                <input
                  id="reg-nic"
                  name="reg-nic"
                  autoComplete="off"
                  type="text"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  required
                  placeholder="199012345678 or 901234567V"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.5rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--crimson)')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="reg-phone"
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.375rem',
                }}
              >
                Phone Number <span style={{ color: 'var(--crimson)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Phone
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                  }}
                />
                <input
                  id="reg-phone"
                  name="reg-phone"
                  autoComplete="tel"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="0771234567"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.5rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--crimson)')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="reg-password"
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.375rem',
                }}
              >
                Password <span style={{ color: 'var(--crimson)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                  }}
                />
                <input
                  id="reg-password"
                  name="reg-password"
                  autoComplete="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 8 characters"
                  style={{
                    width: '100%',
                    padding: '0.65rem 2.5rem 0.65rem 2.5rem',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--crimson)')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
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
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {loading ? 'Creating Account…' : 'Register Account'}
            </button>
          </form>
        )}

        <p
          style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#888',
            marginTop: '1.75rem',
            marginBottom: 0,
          }}
        >
          CMA Citizen Portal © {new Date().getFullYear()} · Sri Lanka
        </p>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
