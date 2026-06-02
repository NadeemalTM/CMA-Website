import React from 'react';

/**
 * SectionHeader - Reusable section heading component
 *
 * Props:
 *   label    {string}  - Small caps label above title (with gold left accent line)
 *   title    {string}  - Main section title
 *   subtitle {string}  - Optional subtitle / description text
 *   align    {string}  - 'center' (default) | 'left'
 *   light    {boolean} - If true, uses white text (for dark backgrounds)
 */
export default function SectionHeader({ label, title, subtitle, align = 'center', light = false }) {
  const isLeft = align === 'left';

  const s = {
    wrapper: {
      textAlign: isLeft ? 'left' : 'center',
      marginBottom: '40px',
    },
    labelRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      justifyContent: isLeft ? 'flex-start' : 'center',
      marginBottom: '12px',
    },
    accentLine: {
      width: '32px',
      height: '3px',
      borderRadius: '2px',
      backgroundColor: '#C9A227',
      flexShrink: 0,
    },
    label: {
      fontSize: '11.5px',
      fontWeight: '700',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#C9A227',
    },
    title: {
      fontSize: 'clamp(22px, 4vw, 36px)',
      fontWeight: '800',
      color: light ? '#ffffff' : '#1a0000',
      lineHeight: 1.25,
      marginBottom: '14px',
      letterSpacing: '-0.01em',
    },
    titleUnderline: {
      display: 'block',
      width: isLeft ? '56px' : '56px',
      height: '4px',
      backgroundColor: '#8B0000',
      borderRadius: '2px',
      margin: isLeft ? '10px 0 0' : '10px auto 0',
    },
    subtitle: {
      fontSize: '15.5px',
      color: light ? 'rgba(255,255,255,0.75)' : '#666',
      lineHeight: 1.7,
      maxWidth: '620px',
      margin: isLeft ? '0' : '0 auto',
    },
  };

  return (
    <div style={s.wrapper}>
      {label && (
        <div style={s.labelRow}>
          <span style={s.accentLine} />
          <span style={s.label}>{label}</span>
          <span style={s.accentLine} />
        </div>
      )}

      {title && (
        <>
          <h2 style={s.title}>{title}</h2>
          <span style={s.titleUnderline} />
        </>
      )}

      {subtitle && (
        <p style={{ ...s.subtitle, marginTop: '16px' }}>{subtitle}</p>
      )}
    </div>
  );
}
