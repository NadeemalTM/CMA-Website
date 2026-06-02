import React, { useEffect } from 'react';

const SPINNER_STYLE_ID = 'cma-spinner-styles';

function injectSpinnerStyles() {
  if (!document.getElementById(SPINNER_STYLE_ID)) {
    const style = document.createElement('style');
    style.id = SPINNER_STYLE_ID;
    style.textContent = `
      @keyframes cma-spin {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes cma-pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
      }
      .cma-spinner {
        width: 44px;
        height: 44px;
        border: 4px solid rgba(139, 0, 0, 0.15);
        border-top-color: #8B0000;
        border-radius: 50%;
        animation: cma-spin 0.8s linear infinite;
      }
      .cma-spinner--sm {
        width: 24px;
        height: 24px;
        border-width: 3px;
      }
      .cma-spinner--lg {
        width: 64px;
        height: 64px;
        border-width: 5px;
      }
      .cma-spinner-message {
        font-size: 14px;
        color: #888;
        margin-top: 14px;
        animation: cma-pulse 1.5s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * LoadingSpinner
 *
 * Props:
 *   message  {string}  - Optional text below spinner
 *   size     {string}  - 'sm' | 'md' (default) | 'lg'
 *   fullPage {boolean} - If true, takes full viewport height
 *   inline   {boolean} - If true, renders inline without centering wrapper
 */
export default function LoadingSpinner({ message, size = 'md', fullPage = false, inline = false }) {
  useEffect(() => {
    injectSpinnerStyles();
  }, []);

  const sizeClass = size === 'sm' ? 'cma-spinner--sm' : size === 'lg' ? 'cma-spinner--lg' : '';

  if (inline) {
    return <div className={`cma-spinner ${sizeClass}`} role="status" aria-label="Loading" />;
  }

  const wrapStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: fullPage ? '100vh' : '200px',
    padding: '40px',
  };

  return (
    <div style={wrapStyle}>
      <div className={`cma-spinner ${sizeClass}`} role="status" aria-label="Loading" />
      {message && (
        <p className="cma-spinner-message">{message}</p>
      )}
    </div>
  );
}
