import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Users, Image, BriefcaseBusiness, FileText,
  Newspaper, Megaphone, FolderOpen, Building2, ClipboardList,
  MessageSquare, LogOut, Menu, X, CheckSquare, Calendar, Home, Star, Award, Landmark, Banknote, Download, BookOpen, UserCog, History as HistoryIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminLogout } from '../../services/api';
import logo from '../../assets/logo.png';

// NAV_ITEMS now uses i18n keys so labels update on language change
const NAV_ITEM_DEFS = [
  { to: '/cma/dashboard',           tKey: 'admin.dashboard',          icon: LayoutDashboard, permission: 'dashboard' },
  { to: '/cma/history',             tKey: 'History',                  icon: HistoryIcon, permission: 'history' },
  { to: '/cma/leadership',          tKey: 'admin.leadership',         icon: Users, permission: 'leadership' },
  { to: '/cma/staff',               tKey: 'admin.staff',              icon: BriefcaseBusiness, permission: 'staff' },
  { to: '/cma/hero-slides',         tKey: 'admin.hero_slides',        icon: Image, permission: 'hero_slides' },
  { to: '/cma/vacancies',           tKey: 'admin.vacancies',          icon: BriefcaseBusiness, permission: 'vacancies' },
  { to: '/cma/job-applications',    tKey: 'Job Applications',         icon: FileText, permission: 'job_applications' },
  { to: '/cma/documents',           tKey: 'admin.documents',          icon: FileText, permission: 'documents' },
  { to: '/cma/news',                tKey: 'admin.news',               icon: Newspaper, permission: 'news' },
  { to: '/cma/announcements',       tKey: 'admin.announcements',      icon: Megaphone, permission: 'announcements' },
  { to: '/cma/laws',                tKey: 'Laws & Acts',              icon: BookOpen, permission: 'laws' },
  { to: '/cma/projects',            tKey: 'admin.projects',           icon: FolderOpen, permission: 'projects' },
  { to: '/cma/condominiums',        tKey: 'admin.condominiums',       icon: Building2, permission: 'condominiums' },
  { to: '/cma/application-tariffs', tKey: 'Application Fees',         icon: Banknote, permission: 'application_tariffs' },
  { to: '/cma/application-forms',   tKey: 'Application Forms',        icon: Download, permission: 'application_forms' },
  { to: '/cma/applications',        tKey: 'admin.applications',       icon: ClipboardList, permission: 'applications' },
  { to: '/cma/complaints',          tKey: 'admin.complaints',         icon: MessageSquare, permission: 'complaints' },
  { to: '/cma/feedbacks',           tKey: 'admin.feedbacks',          icon: Star, permission: 'feedbacks' },
  { to: '/cma/citizens',            tKey: 'Registered Users',         icon: Users, permission: 'citizens' },
  { to: '/cma/citizen-submissions', tKey: 'admin.citizen_services',   icon: CheckSquare, permission: 'citizen_submissions' },
  { to: '/cma/bookings',            tKey: 'admin.bookings',           icon: Calendar, permission: 'bookings' },
  { to: '/cma/bungalow-rooms',      tKey: 'admin.bungalow_rooms',     icon: Home, permission: 'bungalow_rooms' },
  { to: '/cma/certificates',        tKey: 'admin.certificates',       icon: Award, permission: 'certificates' },
  { to: '/cma/mc-fees',             tKey: 'admin.mc_fees',            icon: Landmark, permission: 'mc_fees' },
  { to: '/cma/admin-users',          tKey: 'admin.admin_users',        icon: UserCog, superOnly: true },
];

// Route → i18n key map for page titles
const PAGE_TITLE_KEYS = {
  '/cma/dashboard':           'admin.dashboard',
  '/cma/history':             'History',
  '/cma/leadership':          'admin.leadership',
  '/cma/staff':               'admin.staff',
  '/cma/hero-slides':         'admin.hero_slides',
  '/cma/vacancies':           'admin.vacancies',
  '/cma/documents':           'admin.documents',
  '/cma/news':                'admin.news',
  '/cma/announcements':       'admin.announcements',
  '/cma/laws':                'Laws & Acts',
  '/cma/projects':            'admin.projects',
  '/cma/condominiums':        'admin.condominiums',
  '/cma/application-tariffs': 'Application Fees',
  '/cma/application-forms':   'Application Forms',
  '/cma/applications':        'admin.applications',
  '/cma/complaints':          'admin.complaints',
  '/cma/feedbacks':           'admin.feedbacks',
  '/cma/citizens':            'Registered Users',
  '/cma/citizen-submissions': 'admin.citizen_services',
  '/cma/bookings':            'admin.bookings',
  '/cma/bungalow-rooms':      'admin.bungalow_rooms',
  '/cma/certificates':        'admin.certificates',
  '/cma/mc-fees':             'admin.mc_fees',
  '/cma/admin-users':          'admin.admin_users',
  '/cma/access-denied':        'admin.access_denied',
};


export default function AdminLayout() {
  const { t } = useTranslation();
  const { isLoggedIn, adminProfileReady, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  if (!isLoggedIn) return <Navigate to="/cma/login" replace />;
  if (!adminProfileReady) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#8B0000', fontWeight: 700 }}>
        Loading administrator access…
      </div>
    );
  }

  const isSuperAdmin = user?.is_super_admin || user?.role === 'super_admin' || user?.email?.toLowerCase() === 'admin@condominium.lk';
  const permissions = new Set(user?.permissions || []);
  const visibleNavItems = NAV_ITEM_DEFS.filter((item) =>
    isSuperAdmin || (!item.superOnly && permissions.has(item.permission))
  );
  const requestedNavItem = NAV_ITEM_DEFS.find((item) => location.pathname.startsWith(item.to));

  if (requestedNavItem && !visibleNavItems.includes(requestedNavItem)) {
    return <Navigate to={visibleNavItems[0]?.to || '/cma/access-denied'} replace />;
  }

  const currentTitleKey = Object.entries(PAGE_TITLE_KEYS).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] ?? null;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await adminLogout();
    } catch {
      // ignore API errors — clear locally regardless
    } finally {
      logout();
      navigate('/cma/login');
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSidebar}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999,
              display: 'none',
            }}
            className="sidebar-overlay"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>

        {/* Logo */}
        <div style={{
          padding: '1.5rem 1.25rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <img src={logo} alt="CMA Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>CMA Sri Lanka</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.3 }}>
              Admin Panel
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={closeSidebar}
            style={{
              marginLeft: 'auto', color: 'rgba(255,255,255,0.6)',
              padding: '0.25rem', borderRadius: 6,
              display: 'none',
            }}
            className="sidebar-close-btn"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '0.75rem 0.75rem' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            {visibleNavItems.map(({ to, tKey, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={closeSidebar}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.65rem 0.875rem',
                    borderRadius: 8,
                    fontSize: '0.88rem', fontWeight: 500,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                    background: isActive ? 'var(--crimson)' : 'transparent',
                    transition: 'all 0.18s ease',
                    boxShadow: isActive ? '0 2px 8px rgba(139,0,0,0.4)' : 'none',
                    textDecoration: 'none',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                      <span>{t(tKey)}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div style={{
          padding: '0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* User chip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.6rem 0.875rem',
            marginBottom: '0.5rem',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.06)',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: '#1a0a0a',
              flexShrink: 0,
            }}>
              {(user?.name || user?.email || 'A')[0].toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '0.8rem', fontWeight: 600, color: '#fff',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user?.name || 'Admin'}
              </div>
              <div style={{
                fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user?.email || ''}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              width: '100%',
              padding: '0.65rem 0.875rem',
              borderRadius: 8,
              fontSize: '0.88rem', fontWeight: 500,
              color: loggingOut ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.65)',
              background: 'transparent',
              border: 'none', cursor: loggingOut ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={e => {
              if (!loggingOut) {
                e.currentTarget.style.background = 'rgba(220,38,38,0.18)';
                e.currentTarget.style.color = '#fca5a5';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
            }}
          >
            <LogOut size={17} />
            <span>{loggingOut ? t('admin.logging_out', 'Logging out…') : t('admin.logout')}</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="admin-main">

        {/* Top header bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          height: 60,
          background: '#fff',
          borderBottom: '1px solid var(--mid-gray)',
          display: 'flex', alignItems: 'center',
          padding: '0 1.5rem',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Mobile burger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="mobile-burger"
            style={{
              display: 'none',
              color: 'var(--text-dark)',
              padding: '0.35rem',
              borderRadius: 6,
            }}
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          {/* Mobile Logo */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.4rem',
            marginRight: '0.25rem',
          }} className="admin-header-logo">
            <img src={logo} alt="CMA Logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          </div>

          {/* Page title */}
          <h1 style={{
            fontSize: '1.05rem', fontWeight: 700,
            color: 'var(--text-dark)',
            flex: 1,
          }}>
            {currentTitleKey ? t(currentTitleKey) : t('admin.panel', 'Admin Panel')}
          </h1>

          {/* User name */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.85rem', color: 'var(--text-muted)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--crimson)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: '#fff',
            }}>
              {(user?.name || user?.email || 'A')[0].toUpperCase()}
            </div>
            <span style={{ fontWeight: 500, color: 'var(--text-body)' }}>
              {user?.name || 'Admin'}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '1.75rem' }}>
          <Outlet />
        </main>
      </div>

      {/* Inline responsive overrides */}
      <style>{`
        @media (max-width: 1024px) {
          .sidebar-overlay { display: block !important; }
          .sidebar-close-btn { display: flex !important; }
          .mobile-burger { display: flex !important; }
          .admin-header-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
