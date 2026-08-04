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
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';

/* â”€â”€ Responsive breakpoint hook â”€â”€ */
function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener('resize', fn, { passive: true });
    return () => window.removeEventListener('resize', fn);
  }, []);
  return width;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'Sinhala' },
  { code: 'ta', label: 'Tamil' },
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
      { key: 'nav.setupMC', default: 'Management Corporation', path: '/management-corps/setup' },
      { key: 'nav.structureMC', default: 'Composition of the MC Official and Council', path: '/management-corps/structure' },
      { key: 'nav.responsibilityMC', default: 'Responsibility of the MC', path: '/management-corps/responsibility' },
      { key: 'nav.powersMC', default: 'Power of the MC', path: '/management-corps/powers' },
      { key: 'nav.adminFundsMC', default: 'Administration & Funds', path: '/management-corps/administration-funds' },
      { key: 'nav.unitOwnersRespMC', default: 'Unit Owners Responsibility', path: '/management-corps/unit-owners-responsibility' },
      { key: 'nav.livingHabitsMC', default: 'Condominium Living Habits', path: '/management-corps/living-habits' },
      { key: 'nav.regFeeMC', default: 'Registration Fee of Management Corporations', path: '/management-corps/registration-fees' },
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
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 1024;
  const lang = i18n.language || 'en';
  const isCompactLang = lang === 'ta' || lang === 'si';
  const logoTitleSize = lang === 'ta' ? '10.5px' : lang === 'si' ? '12px' : '13px';
  const logoSubSize = lang === 'ta' ? '8px' : lang === 'si' ? '8.5px' : '9.5px';

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  // Accordion: which mobile nav item is expanded
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const langRef = useRef(null);
  const dropdownRefs = useRef({});
  const searchRef = useRef(null);
  const searchBtnRef = useRef(null);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (
        searchRef.current && !searchRef.current.contains(e.target) &&
        searchBtnRef.current && !searchBtnRef.current.contains(e.target)
      ) setSearchOpen(false);
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

  const toggleMobileExpanded = (key) => {
    setMobileExpanded(prev => prev === key ? null : key);
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
      maxWidth: '1280px',
      margin: '0 auto',
      padding: isMobile ? '0 12px' : '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      gap: '8px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textDecoration: 'none',
      flexShrink: 0,
      maxWidth: isMobile ? '220px' : '320px',
      minWidth: 0,
    },
    logoIcon: {
      width: isMobile ? '36px' : '44px',
      height: isMobile ? '36px' : '44px',
      borderRadius: '8px',
      flexShrink: 0,
    },
    logoText: { display: 'flex', flexDirection: 'column' },
    logoTitle: {
      fontSize: isMobile ? '11px' : logoTitleSize,
      fontWeight: '700',
      color: '#8B0000',
      lineHeight: 1.25,
      letterSpacing: '0.01em',
    },
    logoSub: {
      fontSize: isMobile ? '8px' : logoSubSize,
      color: '#666',
      lineHeight: 1.3,
      fontWeight: '500',
      display: isMobile ? 'none' : 'block',
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: isCompactLang ? '0px' : '1px',
      flex: 1,
      justifyContent: 'center',
      flexWrap: 'nowrap',
    },
    navItem: { position: 'relative' },
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
      gap: isMobile ? '4px' : '8px',
      flexShrink: 0,
    },
    iconBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isMobile ? '40px' : '36px',
      height: isMobile ? '40px' : '36px',
      borderRadius: '50%',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: '#555',
      transition: 'background 0.2s, color 0.2s',
      padding: 0,
      margin: 0,
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
      margin: 0,
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
      margin: 0,
    },
    hamburger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: '#333',
      flexShrink: 0,
      padding: 0,
      margin: 0,
    },
    searchOverlay: {
      position: 'fixed',
      top: 'calc(var(--topbar-height, 40px) + 80px)',
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
      padding: '16px 0',
      zIndex: 99999,
      borderTop: '1px solid #f0f0f0',
      borderBottom: '3px solid #8B0000',
    },
    searchInput: {
      flex: 1,
      border: 'none',
      fontSize: '18px',
      color: '#333',
      outline: 'none',
      fontFamily: 'inherit',
      background: 'transparent',
      minWidth: 0,
    },
    searchSubmitBtn: {
      backgroundColor: '#8B0000',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background 0.2s',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },
  };

  return (
    <>
      <nav style={s.nav}>
        <div style={s.container}>
          {/* Logo */}
          <NavLink to="/" style={s.logo} onClick={() => setMobileOpen(false)}>
            <img src={logo} alt="CMA Logo" style={{ ...s.logoIcon, objectFit: 'contain' }} />
            <div style={s.logoText}>
              <span style={s.logoTitle}>
                {t('nav.orgName', 'Condominium Management Authority')}
              </span>
              <span style={s.logoSub}>
                {t('nav.ministry', 'Ministry of Transport, Highways and Urban Development')}
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          {!isMobile && (
            <div style={s.navLinks}>
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
          )}

          {/* Actions */}
          <div style={s.actions}>
            {/* Search */}
            <button
              ref={searchBtnRef}
              style={s.iconBtn}
              onClick={() => setSearchOpen(prev => !prev)}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Language Switcher â€” desktop only */}
            {!isMobile && (
              <div style={{ position: 'relative' }} ref={langRef}>
                <button style={s.langBtn} onClick={() => setLangOpen(!langOpen)} aria-label="Change Language">
                  <Globe size={14} />
                  <span>{currentLang.label}</span>
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
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bungalow Booking Button â€” desktop only */}
            {!isMobile && (
              <NavLink
                to="/booking/kataragama"
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
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#8B0000'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#8B0000'; e.currentTarget.style.color = '#fff'; }}
              >
                <Building2 size={13} />
                <span>{t('nav.bookingBtn', 'Bungalow Booking')}</span>
              </NavLink>
            )}

            {/* Hamburger â€” mobile only */}
            {isMobile && (
              <button
                style={s.hamburger}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            style={s.searchOverlay}
            ref={searchRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '0 16px' }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                <Search size={22} color="#8B0000" style={{ flexShrink: 0 }} />
                <input
                  style={s.searchInput}
                  type="text"
                  placeholder={t('nav.searchPlaceholder', 'Search CMA Sri Lanka...')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" style={s.searchSubmitBtn}>
                  {t('nav.searchBtn', 'Search')}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              top: '80px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 997,
              backdropFilter: 'blur(2px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '80px',
              left: 0,
              bottom: 0,
              width: 'min(320px, 88vw)',
              backgroundColor: '#fff',
              zIndex: 998,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
            }}
          >
            {/* Nav Items */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {NAV_ITEMS.map(item => (
                <React.Fragment key={item.key}>
                  {item.children ? (
                    <>
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleMobileExpanded(item.key)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '14px 20px',
                          fontSize: '15px',
                          fontWeight: '700',
                          color: '#1a1a1a',
                          borderBottom: '1px solid #f0f0f0',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid #f0f0f0',
                          fontFamily: 'inherit',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <span>{t(item.key, item.default)}</span>
                        <ChevronDown
                          size={18}
                          style={{
                            transition: 'transform 0.25s',
                            transform: mobileExpanded === item.key ? 'rotate(180deg)' : 'rotate(0)',
                            color: '#8B0000',
                            flexShrink: 0,
                          }}
                        />
                      </button>
                      {/* Accordion Body */}
                      <AnimatePresence>
                        {mobileExpanded === item.key && (
                          <motion.div
                            key={item.key + '-children'}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                            style={{ overflow: 'hidden', background: '#fafafa' }}
                          >
                            {item.children.map(child => (
                              <NavLink
                                key={child.key}
                                to={child.path}
                                style={({ isActive }) => ({
                                  display: 'block',
                                  padding: '11px 20px 11px 36px',
                                  fontSize: '13.5px',
                                  fontWeight: '500',
                                  color: isActive ? '#8B0000' : '#555',
                                  borderBottom: '1px solid #f0f0f0',
                                  textDecoration: 'none',
                                  backgroundColor: isActive ? '#fff5f5' : 'transparent',
                                })}
                                onClick={() => setMobileOpen(false)}
                              >
                                {t(child.key, child.default)}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <NavLink
                      to={item.path}
                      style={({ isActive }) => ({
                        display: 'block',
                        padding: '14px 20px',
                        fontSize: '15px',
                        fontWeight: '700',
                        color: isActive ? '#8B0000' : '#1a1a1a',
                        borderBottom: '1px solid #f0f0f0',
                        textDecoration: 'none',
                        backgroundColor: isActive ? '#fff5f5' : 'transparent',
                      })}
                      onClick={() => setMobileOpen(false)}
                      end={item.path === '/'}
                    >
                      {t(item.key, item.default)}
                    </NavLink>
                  )}
                </React.Fragment>
              ))}

              {/* Bungalow Booking CTA */}
              <NavLink
                to="/booking/kataragama"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  margin: '16px',
                  padding: '14px 20px',
                  background: '#8B0000',
                  color: '#fff',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '14px',
                }}
              >
                <Building2 size={18} />
                {t('nav.bookingBtn', 'Kataragama Bungalow Booking')}
              </NavLink>
            </div>

            {/* Footer: Login + Language */}
            <div style={{ borderTop: '2px solid #f0f0f0', padding: '16px' }}>
              <NavLink
                to="/cma/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#8B0000',
                  textDecoration: 'none',
                  border: '1.5px solid #8B0000',
                  borderRadius: '10px',
                  marginBottom: '12px',
                }}
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={16} />
                {t('nav.login', 'Admin Login')}
              </NavLink>

              {/* Language Switcher */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { changeLang(lang.code); setMobileOpen(false); }}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: `2px solid ${i18n.language === lang.code ? '#8B0000' : '#ddd'}`,
                      borderRadius: '8px',
                      background: i18n.language === lang.code ? '#fff0f0' : 'transparent',
                      color: i18n.language === lang.code ? '#8B0000' : '#555',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontFamily: 'inherit',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .desktop-nav a:hover, .desktop-nav button:hover {
          background-color: #fff0f0 !important;
          color: #8B0000 !important;
        }
      `}</style>
    </>
  );
}

