import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

const PageHeroFallback = ({ title }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '3.5rem 1rem', color: '#fff' }}>
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a> <span>/</span> <span style={{ color: '#fff' }}>Applications</span> <span>/</span> <span>{title}</span>
      </div>
      <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#C9A227' }}>{title}</h1>
    </div>
  </div>
);

const FORMS = [
  { form: 'Form A - Application for Registration of Condominium Plan', type: 'PDF', size: '1.2 MB' },
  { form: 'Form B - Application for Amendment of a Registered Condominium Plan', type: 'PDF', size: '840 KB' },
  { form: 'Form C - Management Corporation (MC) Establishment & Registration Form', type: 'PDF', size: '1.5 MB' },
  { form: 'Form D - Application for Certificate of Structural Stability', type: 'PDF', size: '650 KB' },
  { form: 'Form E - Complaint/Dispute Submission to the CMA Mediation Board', type: 'PDF', size: '920 KB' }
];

export default function DownloadApplications() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Download Applications – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="Download Application Forms" />

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
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={22} />
              <span>Official Forms & Document Templates</span>
            </h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Download official PDF forms required for physical submission of plans, MC registrations, structural stability audits, and complaint filings:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {FORMS.map((f, index) => (
              <div
                key={index}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1, minWidth: '260px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '6px', background: 'rgba(139,0,0,0.06)', color: 'var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.15rem', fontSize: '0.92rem', fontWeight: 700, color: '#1f2937' }}>
                      {f.form}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Format: {f.type} · Size: {f.size}</span>
                  </div>
                </div>
                
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
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
                    transition: 'all 0.2s'
                  }}
                >
                  <Download size={13} />
                  <span>Download Form</span>
                </a>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
