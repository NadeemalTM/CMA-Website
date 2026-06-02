import React from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';

const styles = {
  topbar: {
    backgroundColor: '#1a0000',
    color: '#ffffff',
    fontSize: '12px',
    padding: '6px 0',
    width: '100%',
    zIndex: 1000,
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  leftGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  icon: {
    color: '#C9A227',
    flexShrink: 0,
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#ffffff',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  },
  divider: {
    width: '1px',
    height: '16px',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
};

const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function TopBar() {
  const { t } = useTranslation();

  return (
    <div style={styles.topbar}>
      <div style={styles.container}>
        <div style={styles.leftGroup}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '6px' }}>
            <img src={logo} alt="CMA Emblem" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '10.5px', color: '#C9A227', letterSpacing: '0.5px', lineHeight: 1 }}>CMA</span>
          </div>
          <div style={styles.divider} />
          <span style={styles.item}>
            <MapPin size={13} style={styles.icon} />
            <span>{t('topbar.address', 'No. 9, Rotunda Gardens, Colombo 03')}</span>
          </span>
          <div style={styles.divider} />
          <a href="tel:0112338146" style={styles.item}>
            <Phone size={13} style={styles.icon} />
            <span>{t('topbar.phone', '011 233 8146')}</span>
          </a>
          <div style={styles.divider} />
          <a href="mailto:info@condominium.lk" style={styles.item}>
            <Mail size={13} style={styles.icon} />
            <span>{t('topbar.email', 'info@condominium.lk')}</span>
          </a>
        </div>

        <div style={styles.rightGroup}>
          <a
            href="https://wa.me/94112338146"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...styles.socialLink, color: '#25D366' }}
            aria-label="WhatsApp"
          >
            <WhatsAppIcon />
          </a>
          <a
            href="https://www.facebook.com/p/Condominium-Management-Authority-100095347216878/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...styles.socialLink, color: '#1877F2' }}
            aria-label="Facebook"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
