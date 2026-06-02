import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, ClipboardList, CheckCircle } from 'lucide-react';

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

const REQS = [
  { item: 'Duly completed Application Form (Form A or B depending on plan type)' },
  { item: 'Three (3) copies of structural engineering stability certificates signed by a chartered engineer' },
  { item: 'Verified 3D condominium plans prepared and certified by a licensed land surveyor' },
  { item: 'Local municipal council occupancy certificates (Certificate of Conformity - COC)' },
  { item: 'Payment transaction receipt indicating fee settlement' }
];

export default function ApplicationGuide() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Application Guide – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="Application Guide & Guidelines" />

      <section className="section" style={{ padding: '4rem 1rem' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{
            background: '#fff',
            border: '1.5px solid var(--mid-gray)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2.5rem'
          }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={22} />
              <span>Application Checklist & Preparation Guidelines</span>
            </h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Preparing your application document pack properly accelerates structural review and boundary verification. Review the statutory requirements below before submitting files online or physically to the CMA head office:
            </p>
          </div>

          <div style={{ background: '#fff', border: '1px solid #edf2f7', borderRadius: '12px', padding: '1.5rem 2rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1f2937', marginBottom: '1.25rem' }}>
              Mandatory Document Requirements
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {REQS.map((req, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={16} color="var(--gold)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.4 }}>
                    {req.item}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
