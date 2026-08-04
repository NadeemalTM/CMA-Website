import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownContent } from './HelpContent';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HelpPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#fff', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        
        <button 
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--crimson, #8B0000)', border: 'none', color: '#fff', cursor: 'pointer', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '6px' }}
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <div className="markdown-body" style={{ lineHeight: '1.6', color: '#334155' }}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({node, ...props}) => <img style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', margin: '1.5rem 0', border: '1px solid var(--mid-gray)' }} {...props} />,
              h1: ({node, ...props}) => <h1 style={{ color: '#8B0000', borderBottom: '2px solid var(--mid-gray)', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '2.5rem' }} {...props} />,
              h2: ({node, ...props}) => <h2 style={{ color: '#1f2937', marginTop: '2.5rem', fontSize: '1.8rem' }} {...props} />,
              h3: ({node, ...props}) => <h3 style={{ color: '#374151', marginTop: '2rem', fontSize: '1.4rem' }} {...props} />,
              blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '4px solid #C9A227', background: '#fffbeb', padding: '1rem', margin: '1.5rem 0', borderRadius: '0 8px 8px 0', color: '#92400e' }} {...props} />,
              p: ({node, ...props}) => <p style={{ marginBottom: '1rem' }} {...props} />,
              ul: ({node, ...props}) => <ul style={{ paddingLeft: '2rem', marginBottom: '1rem' }} {...props} />,
              li: ({node, ...props}) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
