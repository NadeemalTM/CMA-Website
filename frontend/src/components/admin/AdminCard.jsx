import { motion } from 'framer-motion';

const COLOR_MAP = {
  crimson: {
    bg: 'rgba(139,0,0,0.07)',
    icon: 'rgba(139,0,0,0.12)',
    text: 'var(--crimson)',
    border: 'rgba(139,0,0,0.15)',
  },
  gold: {
    bg: 'rgba(201,162,39,0.08)',
    icon: 'rgba(201,162,39,0.15)',
    text: 'var(--gold)',
    border: 'rgba(201,162,39,0.2)',
  },
  success: {
    bg: 'rgba(26,127,90,0.07)',
    icon: 'rgba(26,127,90,0.12)',
    text: 'var(--success)',
    border: 'rgba(26,127,90,0.15)',
  },
  info: {
    bg: 'rgba(30,64,175,0.07)',
    icon: 'rgba(30,64,175,0.12)',
    text: 'var(--info)',
    border: 'rgba(30,64,175,0.15)',
  },
};

/**
 * AdminCard — stat card for dashboard overview
 *
 * Props:
 *   title   {string}  – Card label
 *   value   {string|number} – Big number/value
 *   icon    {ReactElement} – lucide-react icon (already instantiated)
 *   color   {'crimson'|'gold'|'success'|'info'}
 *   change  {string}  – Optional. e.g. "+12% this month"
 */
export default function AdminCard({ title, value, icon, color = 'crimson', change }) {
  const palette = COLOR_MAP[color] ?? COLOR_MAP.crimson;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        background: '#fff',
        border: `1px solid ${palette.border}`,
        borderRadius: 'var(--radius-md)',
        padding: '1.4rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        cursor: 'default',
      }}
      whileHover={{ boxShadow: 'var(--shadow-md)', y: -2 }}
    >
      {/* Subtle tinted background layer */}
      <div style={{
        position: 'absolute', inset: 0,
        background: palette.bg,
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          {/* Title */}
          <p style={{
            fontSize: '0.78rem', fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '0.4rem',
          }}>
            {title}
          </p>

          {/* Value */}
          <p style={{
            fontSize: '2rem', fontWeight: 800,
            color: 'var(--text-dark)',
            lineHeight: 1.1,
          }}>
            {value ?? '—'}
          </p>

          {/* Change badge */}
          {change && (
            <p style={{
              marginTop: '0.5rem',
              fontSize: '0.78rem', fontWeight: 500,
              color: palette.text,
            }}>
              {change}
            </p>
          )}
        </div>

        {/* Icon circle */}
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: palette.icon,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: palette.text,
          flexShrink: 0,
          marginLeft: '1rem',
        }}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
