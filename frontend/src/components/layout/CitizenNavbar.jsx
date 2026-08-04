import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutGrid,
  UserCheck,
  LogOut,
  Award,
  ClipboardList,
  History,
  MessageSquare
} from 'lucide-react';

const SERVICES = [
  { path: '/services/certificate',  key: 'citizen.nav.certificate',  label: 'Get Certificate',  icon: Award, requireLogin: true },
  { path: '/applications',          key: 'citizen.nav.applications', label: 'Applications & Fees', icon: ClipboardList, requireLogin: false },
  { path: '/about/history',         key: 'nav.history',              label: 'History',          icon: History, requireLogin: false },
  { path: '/services/complaints',   key: 'citizen.nav.complaints',   label: 'Condo Complains',  icon: MessageSquare, requireLogin: true },
  { path: '/services/more',         key: 'citizen.nav.more',         label: 'More E-Services',  icon: LayoutGrid, requireLogin: true },
];

export default function CitizenNavbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isCitizenLoggedIn, citizen, citizenLogout } = useAuth();

  const handleServiceClick = (e, service) => {
    e.preventDefault();

    if (service.requireLogin && !isCitizenLoggedIn) {
      // Redirect to login page and preserve requested destination
      navigate(`/login?redirect=${encodeURIComponent(service.path)}`);
    } else {
      navigate(service.path);
    }
  };

  return (
    <div
      className="citizen-nav-outer"
      style={{
        background: 'var(--off-white)',
        borderBottom: '2px solid var(--gold)',
        padding: '0.4rem 1rem',
        boxShadow: 'var(--shadow-sm)',
        zIndex: 90,
      }}
    >
      <div
        className="citizen-nav-container"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Nav Items List */}
        <nav
          className="citizen-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          {SERVICES.map((s) => {
            const Icon = s.icon;
            const isCert = s.path === '/services/certificate';
            return (
              <a
                key={s.path}
                href={s.path}
                onClick={(e) => handleServiceClick(e, s)}
                className="citizen-nav-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: isCert ? '#fff' : '#4a0000',
                  background: isCert ? 'var(--crimson)' : 'transparent',
                  border: `1px solid ${isCert ? 'var(--crimson)' : 'rgba(139,0,0,0.15)'}`,
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isCert) {
                    e.currentTarget.style.background = 'rgba(139,0,0,0.06)';
                    e.currentTarget.style.borderColor = 'var(--crimson)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCert) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(139,0,0,0.15)';
                  }
                }}
              >
                <Icon size={14} />
                <span>{t(s.key, s.label)}</span>
              </a>
            );
          })}

          {/* Citizen Profile Status Panel inside nav for inline alignment */}
          <div className="citizen-nav-profile citizen-nav-item">
            {isCitizenLoggedIn && citizen ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: '#fff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '25px',
                  border: '1.5px solid var(--gold)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Link
                  to="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    textDecoration: 'none',
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'var(--crimson)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {citizen.name[0].toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#333' }}>
                    Hi, <span style={{ color: 'var(--crimson)' }}>{citizen.name.split(' ')[0]}</span>
                  </div>
                </Link>
                <div style={{ height: 14, width: 1.5, background: '#ddd' }} />
                <button
                  onClick={() => {
                    citizenLogout();
                    navigate('/');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    transition: 'color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#b91c1c')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#ef4444')}
                >
                  <LogOut size={13} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  background: '#fff',
                  color: 'var(--crimson)',
                  border: '1.5px solid var(--gold)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--crimson)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = 'var(--crimson)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = 'var(--crimson)';
                  e.currentTarget.style.borderColor = 'var(--gold)';
                }}
              >
                <UserCheck size={13} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </nav>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .citizen-nav-outer {
            padding: 0.35rem 0.5rem !important;
          }
          .citizen-nav-container {
            justify-content: flex-start !important;
            overflow-x: auto !important;
            width: 100% !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .citizen-nav-container::-webkit-scrollbar {
            display: none;
          }
          .citizen-nav {
            justify-content: flex-start !important;
            gap: 0.4rem !important;
          }
          .citizen-nav-item {
            flex-shrink: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
