import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import T from './T';

/**
 * PageHero - Reusable page hero banner
 *
 * Props:
 *   title       {string}   - Main page title (required)
 *   subtitle    {string}   - Optional subtitle description
 *   breadcrumbs {Array}    - Array of { label, path } objects.
 *                            The last item is the current page (no link).
 *                            Example: [{ label: 'About Us', path: '/about' }, { label: 'Leadership' }]
 *   bgImage     {string}   - Optional background image URL
 *   align       {string}   - 'center' (default) | 'left'
 */
export default function PageHero({ title, subtitle, breadcrumbs = [], bgImage, align = 'center' }) {
  const { t } = useTranslation();
  const isLeft = align === 'left';

  const s = {
    hero: {
      position: 'relative',
      backgroundColor: '#1a0000',
      backgroundImage: bgImage
        ? `url(${bgImage})`
        : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '64px 24px 56px',
      overflow: 'hidden',
      textAlign: isLeft ? 'left' : 'center',
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      background: bgImage
        ? 'linear-gradient(135deg, rgba(26,0,0,0.88) 0%, rgba(139,0,0,0.72) 100%)'
        : 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)',
    },
    // Decorative geometric pattern overlay
    pattern: {
      position: 'absolute',
      inset: 0,
      backgroundImage: `radial-gradient(circle at 20% 50%, rgba(201,162,39,0.07) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 40%),
                        repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 40px,
                          rgba(255,255,255,0.015) 40px,
                          rgba(255,255,255,0.015) 41px
                        )`,
      pointerEvents: 'none',
    },
    // Gold accent bar at top
    topAccent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(to right, #C9A227, #e8c13a, #C9A227)',
    },
    // Content container
    content: {
      position: 'relative',
      zIndex: 2,
      maxWidth: '900px',
      margin: isLeft ? '0' : '0 auto',
    },
    // Breadcrumbs
    breadcrumbBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginBottom: '20px',
      justifyContent: isLeft ? 'flex-start' : 'center',
      flexWrap: 'wrap',
    },
    breadcrumbLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: 'rgba(255,255,255,0.6)',
      textDecoration: 'none',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'color 0.2s',
    },
    breadcrumbSep: {
      color: 'rgba(255,255,255,0.3)',
      flexShrink: 0,
    },
    breadcrumbCurrent: {
      color: '#C9A227',
      fontSize: '13px',
      fontWeight: '600',
    },
    // Title
    title: {
      fontSize: 'clamp(26px, 5vw, 48px)',
      fontWeight: '800',
      color: '#ffffff',
      lineHeight: 1.2,
      marginBottom: '16px',
      letterSpacing: '-0.01em',
    },
    titleAccent: {
      color: '#C9A227',
    },
    // Gold underline
    underline: {
      display: 'block',
      width: '60px',
      height: '4px',
      backgroundColor: '#C9A227',
      borderRadius: '2px',
      margin: isLeft ? '0 0 20px' : '0 auto 20px',
    },
    // Subtitle
    subtitle: {
      fontSize: '16px',
      color: 'rgba(255,255,255,0.72)',
      lineHeight: 1.7,
      maxWidth: '640px',
      margin: isLeft ? '0' : '0 auto',
    },
  };

  return (
    <div style={s.hero} className="page-hero">
      <div style={s.overlay} />
      <div style={s.pattern} />
      <div style={s.topAccent} />

      <div style={s.content}>
        {/* Breadcrumbs */}
        <nav style={s.breadcrumbBar} aria-label="Breadcrumb">
          <NavLink to="/" style={s.breadcrumbLink}>
            <Home size={13} />
            {t('breadcrumb.home', 'Home')}
          </NavLink>

          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                <ChevronRight size={14} style={s.breadcrumbSep} />
                {isLast || !crumb.path ? (
                  <span style={s.breadcrumbCurrent}><T>{crumb.label}</T></span>
                ) : (
                  <NavLink to={crumb.path} style={s.breadcrumbLink}>
                    <T>{crumb.label}</T>
                  </NavLink>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Title */}
        <motion.h1
          style={s.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <T>{title}</T>
        </motion.h1>

        <span style={s.underline} />

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            style={s.subtitle}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          >
            <T>{subtitle}</T>
          </motion.p>
        )}
      </div>

      <style>{`
        .page-hero a:hover { color: #C9A227 !important; }
      `}</style>
    </div>
  );
}
