import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SIZE_MAP = {
  sm: 420,
  md: 600,
  lg: 820,
};

/**
 * Modal — animated overlay dialog
 *
 * Props:
 *   isOpen   {boolean}
 *   onClose  {() => void}
 *   title    {string}
 *   children {ReactNode}
 *   size     {'sm'|'md'|'lg'}
 */
export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const maxWidth = SIZE_MAP[size] ?? SIZE_MAP.md;

  // Close on Escape key
  const handleKey = useCallback(
    (e) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKey]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(10,0,0,0.55)',
              backdropFilter: 'blur(3px)',
              zIndex: 2000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem',
            }}
          >
            {/* Dialog panel — stop propagation so clicking inside doesn't close */}
            <motion.div
              key="modal-panel"
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                width: '100%',
                maxWidth,
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center',
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--mid-gray)',
                flexShrink: 0,
              }}>
                <h2 style={{
                  flex: 1,
                  fontSize: '1.05rem', fontWeight: 700,
                  color: 'var(--text-dark)',
                  margin: 0,
                }}>
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 32, height: 32, borderRadius: 8,
                    color: 'var(--text-muted)',
                    background: 'transparent',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--light-gray)';
                    e.currentTarget.style.color = 'var(--text-dark)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.25rem',
              }}>
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
