import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';

const TICKER_ANIMATION_ID = 'cma-ticker-keyframes';

function injectTickerKeyframes() {
  if (!document.getElementById(TICKER_ANIMATION_ID)) {
    const style = document.createElement('style');
    style.id = TICKER_ANIMATION_ID;
    style.textContent = `
      @keyframes cma-ticker-scroll {
        0%   { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      .cma-ticker-track {
        display: inline-flex;
        align-items: center;
        gap: 40px;
        animation: cma-ticker-scroll 30s linear infinite;
        white-space: nowrap;
        will-change: transform;
      }
      .cma-ticker-track:hover {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(style);
  }
}

const s = {
  wrapper: {
    backgroundColor: 'var(--crimson, #8B0000)',
    color: '#ffffff',
    overflow: 'hidden',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    zIndex: 998,
  },
  badge: {
    flexShrink: 0,
    backgroundColor: '#C9A227',
    color: '#1a0000',
    fontWeight: '800',
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '4px 14px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    zIndex: 2,
  },
  fadeLeft: {
    position: 'absolute',
    left: '80px',
    top: 0,
    bottom: 0,
    width: '40px',
    background: 'linear-gradient(to right, var(--crimson, #8B0000), transparent)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  tickerViewport: {
    flex: 1,
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
  },
  item: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    lineHeight: 1,
    padding: '0 20px',
    borderRight: '1px solid rgba(255,255,255,0.25)',
  },
  itemLink: {
    color: '#C9A227',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    marginLeft: '6px',
    fontWeight: '600',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#C9A227',
    flexShrink: 0,
  },
  loading: {
    fontSize: '13px',
    padding: '0 20px',
    color: 'rgba(255,255,255,0.7)',
  },
};

export default function NoticeTicker() {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    injectTickerKeyframes();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/v1/announcements')
      .then(r => {
        if (!r.ok) throw new Error('Network error');
        return r.json();
      })
      .then(data => {
        if (!cancelled) {
          const items = Array.isArray(data)
            ? data
            : Array.isArray(data?.results)
            ? data.results
            : Array.isArray(data?.data)
            ? data.data
            : [];
          setAnnouncements(items.slice(0, 20));
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Fallback notices for demo / API not ready
  const fallbackNotices = [
    { id: 1, text: t('notice.fallback1', 'Welcome to Condominium Management Authority Sri Lanka'), link: null },
    { id: 2, text: t('notice.fallback2', 'New amendments to the Apartment Ownership Law are now in effect'), link: '/laws' },
    { id: 3, text: t('notice.fallback3', 'Online applications for Management Corporation registration are now available'), link: '/applications' },
  ];

  const items = (!loading && !error && announcements.length > 0)
    ? announcements
    : fallbackNotices;

  // Duration scales with number of items for consistent speed
  const duration = Math.max(20, items.length * 8);

  return (
    <div style={s.wrapper} role="marquee" aria-label={t('notice', 'Notices')}>
      <div style={s.badge}>{t('notice', 'NOTICE')}</div>

      <div style={s.tickerViewport}>
        <div
          className="cma-ticker-track"
          style={{ animationDuration: `${duration}s` }}
        >
          {loading ? (
            <span style={s.loading}>{t('notice.loading', 'Loading notices...')}</span>
          ) : (
            items.map((item, idx) => (
              <span key={item.id || idx} style={s.item}>
                <span style={s.dot} />
                <span>{item.text || item.title || item.message || item.announcement}</span>
                {item.link && (
                  <a
                    href={item.link}
                    style={s.itemLink}
                    target={item.link.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                  >
                    {t('notice.readMore', 'Read More')}
                    <ExternalLink size={11} />
                  </a>
                )}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
