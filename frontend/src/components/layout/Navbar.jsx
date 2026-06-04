import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  Globe,
  LogIn,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'si', label: 'සිංහල', flag: '🇱🇰' },
  { code: 'ta', label: 'தமிழ்', flag: '🇱🇰' },
];

const NAV_ITEMS = [
  { key: 'nav.home', default: 'Home', path: '/' },
  {
    key: 'nav.about', default: 'About Us', path: '/about',
    children: [
      { key: 'nav.role', default: 'Role of the CMA', path: '/about/role' },
      { key: 'nav.objectives', default: 'Objectives of the Authority', path: '/about/objectives' },
      { key: 'nav.aboutPowers', default: 'Powers', path: '/about/powers' },
      { key: 'nav.leadership', default: 'Leadership', path: '/about/leadership' },
      { key: 'nav.staff', default: 'Staff Members', path: '/about/staff' },
      { key: 'nav.visionMission', default: 'Vision & Mission', path: '/about/vision-mission' },
    ],
  },
  {
    key: 'nav.laws', default: 'Laws & Plans', path: '/laws',
    children: [
      { key: 'nav.lawsList', default: 'Condominium Laws', path: '/laws/condominium-laws' },
      { key: 'nav.condoPlan', default: 'Condominium Plan', path: '/laws/condominium-plan' },
      { key: 'nav.certProcedure', default: 'Certificate Procedure', path: '/laws/certificate-procedure' },
      { key: 'nav.consequence', default: 'Main Consequence & Legal Status', path: '/laws/consequence' },
    ],
  },
  {
    key: 'nav.applications', default: 'Applications', path: '/applications',
    children: [
      { key: 'nav.appGuide', default: 'Application Guide & Checklists', path: '/applications/guide' },
      { key: 'nav.regFees', default: 'Registration Fees', path: '/applications/fees' },
      { key: 'nav.downloads', default: 'Download Applications', path: '/applications/downloads' },
      { key: 'nav.kataragama', default: 'Kataragama Bungalow', path: '/booking/kataragama' },
    ],
  },
  {
    key: 'nav.corps', default: 'Management Corps', path: '/management-corps',
    children: [
      { key: 'nav.setupMC', default: 'How to Setup MC', path: '/management-corps/setup' },
      { key: 'nav.structureMC', default: 'MC Structure & Members', path: '/management-corps/structure' },
      { key: 'nav.responsibilityMC', default: 'Responsibility of the MC', path: '/management-corps/responsibility' },
      { key: 'nav.powersMC', default: 'Power of the MC', path: '/management-corps/powers' },
    ],
  },
  {
    key: 'nav.media', default: 'News & Publications', path: '#',
    children: [
      { key: 'nav.news', default: 'News & Events', path: '/news' },
      { key: 'nav.projects', default: 'Projects', path: '/projects' },
      { key: 'nav.publications', default: 'Publications', path: '/publications' },
      { key: 'nav.careers', default: 'Careers', path: '/careers' },
    ],
  },
  { key: 'nav.contact', default: 'Contact Us', path: '/contact' },
];


export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language || 'en';
  const isCompactLang = lang === 'ta' || lang === 'si'; // Tamil & Sinhala need smaller sizes
  const logoTitleSize = lang === 'ta' ? '10.5px' : lang === 'si' ? '12px' : '13px';
  const logoSubSize = lang === 'ta' ? '8px' : lang === 'si' ? '8.5px' : '9.5px';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const langRef = useRef(null);
  const dropdownRefs = useRef({});
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (!Object.values(dropdownRefs.current).some(ref => ref && ref.contains(e.target))) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('cma_lang', code);
    setLangOpen(false);
    window.location.reload();
  };

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const s = {
    nav: {
      position: 'relative',
      zIndex: 999,
      backgroundColor: '#ffffff',
      height: '80px',

      display: 'flex',
      alignItems: 'center',
      transition: 'box-shadow 0.3s ease',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.06)',
    },
    container: {
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      gap: '8px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textDecoration: 'none',
      flexShrink: 0,
      maxWidth: '380px',
    },
    logoIcon: {
      width: '44px',
      height: '44px',
      borderRadius: '8px',
      backgroundColor: '#8B0000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#C9A227',
      flexShrink: 0,
    },
    logoText: {
      display: 'flex',
      flexDirection: 'column',
    },
    logoTitle: {
      fontSize: logoTitleSize,
      fontWeight: '700',
      color: '#8B0000',
      lineHeight: 1.25,
      letterSpacing: '0.01em',
      whiteSpace: 'nowrap',
    },
    logoSub: {
      fontSize: logoSubSize,
      color: '#666',
      lineHeight: 1.3,
      fontWeight: '500',
      whiteSpace: 'nowrap',
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: isCompactLang ? '0px' : '1px',
      flex: 1,
      justifyContent: 'center',
      flexWrap: 'nowrap',
    },
    navItem: {
      position: 'relative',
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      padding: isCompactLang ? '5px 3px' : '6px 5px',
      fontSize: isCompactLang ? '10px' : '11.5px',
      fontWeight: '600',
      color: '#333',
      textDecoration: 'none',
      borderRadius: '4px',
      transition: 'color 0.2s, background 0.2s',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      fontFamily: 'inherit',
    },
    navLinkActive: {
      color: '#8B0000',
    },
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      left: '0',
      minWidth: '180px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      border: '1px solid rgba(0,0,0,0.08)',
      padding: '6px',
      zIndex: 1000,
    },
    dropdownLink: {
      display: 'block',
      padding: '8px 12px',
      fontSize: '13px',
      color: '#444',
      textDecoration: 'none',
      borderRadius: '6px',
      fontWeight: '500',
      transition: 'background 0.15s, color 0.15s',
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexShrink: 0,
    },
    iconBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: '#555',
      transition: 'background 0.2s, color 0.2s',
    },
    langBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '6px 10px',
      border: '1px solid #ddd',
      borderRadius: '20px',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      color: '#444',
      transition: 'border-color 0.2s',
      fontFamily: 'inherit',
    },
    langDropdown: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: 0,
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      border: '1px solid rgba(0,0,0,0.08)',
      padding: '6px',
      minWidth: '150px',
      zIndex: 1100,
    },
    langOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 10px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      color: '#333',
      border: 'none',
      background: 'transparent',
      width: '100%',
      textAlign: 'left',
      fontFamily: 'inherit',
      transition: 'background 0.15s',
    },
    loginBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      backgroundColor: '#8B0000',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12.5px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      transition: 'background 0.2s',
      fontFamily: 'inherit',
    },
    hamburger: {
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: '#333',
    },
    mobileMenu: {
      position: 'fixed',
      top: '80px',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#fff',
      zIndex: 998,
      overflowY: 'auto',
      padding: '16px',
      transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s ease',
    },
    mobileNavLink: {
      display: 'block',
      padding: '12px 16px',
      fontSize: '15px',
      fontWeight: '600',
      color: '#333',
      textDecoration: 'none',
      borderBottom: '1px solid #f0f0f0',
    },
    mobileSubLink: {
      display: 'block',
      padding: '10px 32px',
      fontSize: '14px',
      color: '#666',
      textDecoration: 'none',
      borderBottom: '1px solid #f8f8f8',
    },
    searchOverlay: {
      position: 'absolute',
      top: '80px',
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      padding: '16px 24px',
      zIndex: 997,
      display: searchOpen ? 'flex' : 'none',
      alignItems: 'center',
      gap: '12px',
    },
    searchInput: {
      flex: 1,
      maxWidth: '600px',
      margin: '0 auto',
      padding: '10px 16px',
      border: '2px solid #8B0000',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      fontFamily: 'inherit',
    },
  };

  return (
    <>
      <nav style={s.nav}>
        <div style={s.container}>
          {/* Logo */}
          <NavLink to="/" style={s.logo} onClick={() => setMobileOpen(false)}>
            <div style={{ ...s.logoIcon, background: 'transparent', width: '44px', height: '44px' }}>
              <img src={logo} alt="CMA Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={s.logoText}>
              <span style={s.logoTitle}>
                {t('nav.orgName', 'Condominium Management Authority')}
              </span>
              <span style={s.logoSub}>
                {t('nav.ministry', 'Ministry of Transport, Highways and Urban Development — Sri Lanka')}
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <div style={s.navLinks} className="desktop-nav">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.key}
                style={s.navItem}
                ref={el => dropdownRefs.current[item.key] = el}
              >
                {item.children ? (
                  <>
                    <button
                      style={s.navLink}
                      onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key)}
                      onMouseEnter={() => setOpenDropdown(item.key)}
                    >
                      {t(item.key, item.default)}
                      <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: openDropdown === item.key ? 'rotate(180deg)' : 'rotate(0)' }} />
                    </button>
                    {openDropdown === item.key && (
                      <div style={s.dropdown} onMouseLeave={() => setOpenDropdown(null)}>
                        {item.children.map(child => (
                          <NavLink
                            key={child.key}
                            to={child.path}
                            style={({ isActive }) => ({
                              ...s.dropdownLink,
                              backgroundColor: isActive ? '#fff5f5' : 'transparent',
                              color: isActive ? '#8B0000' : '#444',
                            })}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {t(child.key, child.default)}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    style={({ isActive }) => ({
                      ...s.navLink,
                      color: isActive ? '#8B0000' : '#333',
                      backgroundColor: isActive ? '#fff0f0' : 'transparent',
                    })}
                    end={item.path === '/'}
                  >
                    {t(item.key, item.default)}
                  </NavLink>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={s.actions}>
            {/* Search */}
            <button
              style={s.iconBtn}
              onMouseDown={(e) => { e.stopPropagation(); setSearchOpen(prev => !prev); }}
              aria-label="Search"
              title="Search"
            >
              <Search size={18} />
            </button>

            {/* Language Switcher */}
            <div style={{ position: 'relative' }} ref={langRef} className="nav-action-lang">
              <button
                style={s.langBtn}
                onClick={() => setLangOpen(!langOpen)}
                aria-label="Change Language"
              >
                <Globe size={14} />
                <span>{currentLang.flag}</span>
                {!isCompactLang && <span>{currentLang.code.toUpperCase()}</span>}
                <ChevronDown size={12} style={{ transform: langOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>
              {langOpen && (
                <div style={s.langDropdown}>
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      style={{
                        ...s.langOption,
                        backgroundColor: i18n.language === lang.code ? '#fff5f5' : 'transparent',
                        color: i18n.language === lang.code ? '#8B0000' : '#333',
                        fontWeight: i18n.language === lang.code ? '700' : '500',
                      }}
                      onClick={() => changeLang(lang.code)}
                    >
                      <span style={{ fontSize: '18px' }}>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bungalow Booking Button */}
            <NavLink
              to="/booking/kataragama"
              className="nav-action-booking-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isCompactLang ? '0' : '6px',
                padding: isCompactLang ? '6px 8px' : '6px 14px',
                border: '1.5px solid #8B0000',
                borderRadius: '20px',
                background: '#8B0000',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: '700',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 6px rgba(139,0,0,0.2)',
                whiteSpace: 'nowrap',
                title: t('nav.bookingBtn', 'Bungalow Booking'),
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = '#8B0000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#8B0000';
                e.currentTarget.style.color = '#fff';
              }}
            >
              <Building2 size={13} />
              {!isCompactLang && <span>{t('nav.bookingBtn', 'Bungalow Booking')}</span>}
            </NavLink>

            {/* Hamburger */}
            <button
              style={{ ...s.hamburger, display: 'flex' }}

              className="hamburger-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <div style={s.searchOverlay} ref={searchRef}>
        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <input
            style={s.searchInput}
            type="text"
            placeholder={t('nav.searchPlaceholder', 'Search CMA Sri Lanka...')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus={searchOpen}
          />
        </form>
      </div>

      {/* Mobile Menu */}
      <div style={s.mobileMenu}>
        {NAV_ITEMS.map(item => (
          <React.Fragment key={item.key}>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                ...s.mobileNavLink,
                color: isActive ? '#8B0000' : '#333',
              })}
              onClick={() => !item.children && setMobileOpen(false)}
              end={item.path === '/'}
            >
              {t(item.key, item.default)}
            </NavLink>
            {item.children && item.children.map(child => (
              <NavLink
                key={child.key}
                to={child.path}
                style={({ isActive }) => ({
                  ...s.mobileSubLink,
                  color: isActive ? '#8B0000' : '#666',
                })}
                onClick={() => setMobileOpen(false)}
              >
                {t(child.key, child.default)}
              </NavLink>
            ))}
          </React.Fragment>
        ))}
        {/* Mobile Login Button */}
        <div style={{ padding: '16px 16px 0', borderBottom: '1px solid #f0f0f0' }}>
          <NavLink
            to="/admin/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#8B0000',
              textDecoration: 'none',
            }}
            onClick={() => setMobileOpen(false)}
          >
            <LogIn size={18} />
            {t('nav.login', 'Login')}
          </NavLink>
        </div>
        <div style={{ padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { changeLang(lang.code); setMobileOpen(false); }}
              style={{
                padding: '8px 14px',
                border: `2px solid ${i18n.language === lang.code ? '#8B0000' : '#ddd'}`,
                borderRadius: '20px',
                background: i18n.language === lang.code ? '#fff0f0' : 'transparent',
                color: i18n.language === lang.code ? '#8B0000' : '#555',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'inherit',
              }}
            >
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 1280px) {
          .hamburger-btn { display: none !important; }
        }
        @media (max-width: 1279px) {
          .desktop-nav { display: none !important; }
        }
        .desktop-nav a:hover, .desktop-nav button:hover {
          background-color: #fff0f0 !important;
          color: #8B0000 !important;
        }
        @media (max-width: 768px) {
          .nav-action-lang { display: none !important; }
          .nav-action-login { display: none !important; }
          .nav-action-booking-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
