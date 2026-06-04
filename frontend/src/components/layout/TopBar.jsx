import React, { useState } from 'react';
import { MapPin, Phone, Mail, X, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';

const MAP_URL = 'https://maps.app.goo.gl/5YC1ea1LY2bT6t5B6';
// Google Maps embed with search query — shows a red pin marker on CMA HQ
const MAP_EMBED_SRC =
  'https://maps.google.com/maps?q=Condominium+Management+Authority,+No.+20+Sir+Chittampalam+A+Gardiner+Mawatha,+Colombo+02&z=17&output=embed';

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
  addressBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'rgba(255,255,255,0.85)',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'inherit',
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

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.99H7.898v-2.888h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.888h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

/* ── Google Maps Modal ── */
function MapModal({ onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 99998,
          animation: 'fadeInBackdrop 0.2s ease',
        }}
      />

      {/* Modal box */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 99999,
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
          overflow: 'hidden',
          width: 'min(680px, 95vw)',
          animation: 'popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: '#1a0000',
            color: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(201,162,39,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={16} color="#C9A227" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>CMA Headquarters</div>
              <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.65)' }}>
                No. 20, Sir Chittampalam A Gardiner Mawatha, Colombo 02
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#C9A227',
                color: '#1a0000',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              <ExternalLink size={12} />
              Open in Maps
            </a>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
              }}
              aria-label="Close map"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Map iframe */}
        <div style={{ position: 'relative', width: '100%', height: '420px' }}>
          <iframe
            title="CMA Location"
            src={MAP_EMBED_SRC}
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            background: '#fafafa',
            borderTop: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#666',
          }}
        >
          <MapPin size={13} color="#C9A227" />
          <span>Condominium Management Authority · Ministry of Transport, Highways and Urban Development, Sri Lanka</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeInBackdrop { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.94); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
}

export default function TopBar() {
  const { t } = useTranslation();
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <>
      <div style={styles.topbar}>
        <div style={styles.container}>
          <div style={styles.leftGroup}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '6px' }}>
              <img src={logo} alt="CMA Emblem" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
              <span style={{ fontWeight: 800, fontSize: '10.5px', color: '#C9A227', letterSpacing: '0.5px', lineHeight: 1 }}>CMA</span>
            </div>
            <div style={styles.divider} />

            {/* ── Clickable Address ── */}
            <button
              id="topbar-address-btn"
              style={styles.addressBtn}
              onClick={() => setMapOpen(true)}
              title="Click to view on Google Maps"
            >
              <MapPin size={13} style={styles.icon} />
              <span style={{ borderBottom: '1px dashed rgba(255,255,255,0.4)', paddingBottom: '1px' }}>
                {t('topbar.address', 'No. 20, Sir Chittampalam A Gardiner Mawatha, Colombo 02')}
              </span>
            </button>

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
              <FacebookIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Map Modal */}
      {mapOpen && <MapModal onClose={() => setMapOpen(false)} />}
    </>
  );
}
