import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import T from '../../components/ui/T';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { getApplicationForms } from '../../services/api';

const PageHeroFallback = ({ title }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '3.5rem 1rem', color: '#fff' }}>
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a> <span>/</span> <span style={{ color: '#fff' }}><T>Applications</T></span> <span>/</span> <span>{title}</span>
      </div>
      <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#C9A227' }}>{title}</h1>
    </div>
  </div>
);

export default function DownloadApplications() {
  const { t } = useTranslation();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Download Applications â€“ Condominium Management Authority';
    
    // Fetch forms dynamically from API
    getApplicationForms().then(res => {
      setForms(res.data.data || []);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '80vh' }}>
      <PageHeroFallback title="Download Application Forms" />

      {/* Responsive styles */}
      <style>{`
        .dl-item { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        @media (max-width: 560px) {
          .dl-item { flex-direction: column; align-items: stretch; }
          .dl-item > div { flex: unset !important; min-width: unset !important; }
          .dl-btn { width: 100%; justify-content: center !important; text-align: center; }
        }
      `}</style>

      <section className="section" style={{ padding: '4rem 1rem' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{
            background: '#fff',
            border: '1.5px solid var(--mid-gray)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Download size={22} />
              <span><T>Official Forms &amp; Document Templates</T></span>
            </h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}><T>
              Download official PDF forms required for physical submission of plans, MC registrations, structural stability audits, and complaint filings:
            </T></p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div className="spinner"></div>
              </div>
            ) : forms.map((f, index) => (
              <div
                key={f.id || index}
                className="dl-item"
                style={{
                  background: '#fff',
                  border: '1px solid var(--mid-gray)',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1, minWidth: '200px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '6px', background: 'rgba(139,0,0,0.06)', color: 'var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.15rem', fontSize: '0.92rem', fontWeight: 700, color: '#1f2937' }}>
                      {f.form}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Format: {f.type} Â· Size: {f.size}</span>
                  </div>
                </div>
                
                <a
                  href={f.file_path}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="dl-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 1rem',
                    borderRadius: '6px',
                    border: '1.5px solid var(--crimson)',
                    background: 'transparent',
                    color: 'var(--crimson)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    justifyContent: 'center',
                  }}
                >
                  <Download size={13} />
                  <span><T>Download Form</T></span>
                </a>
              </div>
            ))}
            
            {!loading && forms.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                No application forms available to download at this moment.
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}