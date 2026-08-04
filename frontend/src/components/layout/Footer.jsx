import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Building2,
  Globe,
  MessageCircle,
  Play,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from 'lucide-react';

function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(() => window.innerWidth <= bp);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth <= bp);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, [bp]);
  return mobile;
}

const FacebookSvg = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const TwitterSvg = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const YoutubeSvg = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';

const s = {
  footer: {
    backgroundColor: '#1a0000',
    color: '#ffffff',
  },
  topSection: (cols) => ({
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '48px 24px 36px',
    display: 'grid',
    gridTemplateColumns: cols,
    gap: '32px',
  }),
  logoBlock: {},
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    backgroundColor: '#8B0000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#C9A227',
    flexShrink: 0,
  },
  orgName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 1.3,
  },
  ministry: {
    fontSize: '10.5px',
    color: 'rgba(255,255,255,0.55)',
    marginTop: '2px',
  },
  tagline: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 1.7,
    marginBottom: '20px',
  },
  socialRow: {
    display: 'flex',
    gap: '10px',
  },
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
    transition: 'background-color 0.2s, color 0.2s',
    cursor: 'pointer',
    border: 'none',
  },
  colTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#C9A227',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  linkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'rgba(255,255,255,0.65)',
    textDecoration: 'none',
    fontSize: '13.5px',
    padding: '4px 0',
    transition: 'color 0.2s',
    marginBottom: '2px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '12px',
  },
  contactIcon: {
    color: '#C9A227',
    marginTop: '2px',
    flexShrink: 0,
  },
  contactText: {
    fontSize: '13.5px',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.5,
  },
  contactLink: {
    color: 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
    fontSize: '13.5px',
    transition: 'color 0.2s',
  },
  divider: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
    margin: '0',
  },
  bottomBar: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  copyright: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.45)',
  },
  bottomLinks: {
    display: 'flex',
    gap: '20px',
  },
  bottomLink: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.45)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  chevron: {
    color: '#C9A227',
    flexShrink: 0,
  },
};

const QUICK_LINKS = [
  { key: 'footer.home', default: 'Home', path: '/' },
  { key: 'footer.about', default: 'About Us', path: '/about' },
  { key: 'footer.laws', default: 'Laws & Plans', path: '/laws' },
  { key: 'footer.applications', default: 'Applications', path: '/applications' },
  { key: 'footer.news', default: 'News & Events', path: '/news' },
  { key: 'footer.contact', default: 'Contact Us', path: '/contact' },
];

const LEGAL_LINKS = [
  { key: 'footer.condoLaws', default: 'Condominium Laws', path: '/laws/condominium' },
  { key: 'footer.certProc', default: 'Certificate Procedure', path: '/laws/certificate-procedure' },
  { key: 'footer.documents', default: 'Documents', path: '/publications/documents' },
];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const isMobile = useIsMobile(600);
  const isTablet = useIsMobile(900);
  const cols = isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1.4fr 1fr 1fr 1.2fr';

  return (
    <footer style={s.footer}>
      <div style={s.topSection(cols)}>
        {/* Logo & Tagline */}
        <div style={s.logoBlock}>
          <div style={s.logoRow}>
            <div style={{ ...s.logoIcon, background: 'transparent' }}>
              <img src={logo} alt="CMA Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={s.orgName}>
                {t('footer.orgName', 'Condominium Management Authority')}
              </div>
              <div style={s.ministry}>
                {t('footer.ministry', 'Ministry of Transport, Highways and Urban Development')}
              </div>
            </div>
          </div>
          <p style={s.tagline}>
            {t('footer.tagline', 'Empowering communities through transparent and effective condominium management across Sri Lanka.')}
          </p>
          <div style={s.socialRow}>
            <a
              href="https://www.facebook.com/p/Condominium-Management-Authority-100095347216878/"
              target="_blank"
              rel="noopener noreferrer"
              style={s.socialBtn}
              aria-label="Facebook"
            >
              <FacebookSvg />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={s.socialBtn}
              aria-label="Twitter"
            >
              <TwitterSvg />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              style={s.socialBtn}
              aria-label="YouTube"
            >
              <YoutubeSvg />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div style={s.colTitle}>{t('footer.quickLinks', 'Quick Links')}</div>
          {QUICK_LINKS.map(link => (
            <NavLink key={link.key} to={link.path} style={s.linkItem}>
              <ChevronRight size={14} style={s.chevron} />
              {t(link.key, link.default)}
            </NavLink>
          ))}
        </div>

        {/* Legal */}
        <div>
          <div style={s.colTitle}>{t('footer.legal', 'Legal')}</div>
          {LEGAL_LINKS.map(link => (
            <NavLink key={link.key} to={link.path} style={s.linkItem}>
              <ChevronRight size={14} style={s.chevron} />
              {t(link.key, link.default)}
            </NavLink>
          ))}
        </div>

        {/* Contact */}
        <div>
          <div style={s.colTitle}>{t('footer.contactUs', 'Contact Us')}</div>
          <div style={s.contactItem}>
            <MapPin size={16} style={s.contactIcon} />
            <span style={s.contactText}>
              {t('footer.address', '1st Floor, National Housing Department Building, Sir Chittampalam A Gardiner Mawatha, Colombo 02.')}
            </span>
          </div>
          <div style={s.contactItem}>
            <Phone size={16} style={s.contactIcon} />
            <a href="tel:0112447432" style={s.contactLink}>
              {t('footer.phone', '0112447432')}
            </a>
          </div>
          <div style={s.contactItem}>
            <Mail size={16} style={s.contactIcon} />
            <a href="mailto:info@condominium.lk" style={s.contactLink}>
              {t('footer.email', 'info@condominium.lk')}
            </a>
          </div>
        </div>
      </div>

      <div style={s.divider} />

      <div style={s.bottomBar}>
        <p style={s.copyright}>
          &copy; {year} {t('footer.copyright', 'Condominium Management Authority, Sri Lanka. All rights reserved.')}
        </p>
        <div style={s.bottomLinks}>
          <NavLink to="/privacy" style={s.bottomLink}>
            {t('footer.privacy', 'Privacy Policy')}
          </NavLink>
          <NavLink to="/terms" style={s.bottomLink}>
            {t('footer.terms', 'Terms of Use')}
          </NavLink>
          <NavLink to="/sitemap" style={s.bottomLink}>
            {t('footer.sitemap', 'Sitemap')}
          </NavLink>
        </div>
      </div>

      <style>{`
        footer a:hover { color: #C9A227 !important; }
        footer .social-btn:hover { background-color: rgba(201,162,39,0.2) !important; color: #C9A227 !important; }
        @media (max-width: 600px) {
          footer > div:nth-child(3) { flex-direction: column; text-align: center; align-items: center; }
        }
        @media (max-width: 480px) {
          footer > div:first-child { padding: 32px 16px 24px; gap: 24px; }
          footer > div:last-child { padding: 14px 16px; flex-direction: column; align-items: center; text-align: center; gap: 8px; }
          footer > div:last-child > div { gap: 12px; justify-content: center; }
        }
      `}</style>
    </footer>
  );
}
