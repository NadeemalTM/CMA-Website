import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, CheckSquare, ShieldCheck } from 'lucide-react';

const PageHeroFallback = ({ title }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '3.5rem 1rem', color: '#fff' }}>
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a> <span>/</span> <span style={{ color: '#fff' }}>Management Corps</span> <span>/</span> <span>{title}</span>
      </div>
      <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#C9A227' }}>{title}</h1>
    </div>
  </div>
);

const RESPONSIBILITIES = [
  { item: 'To maintain, service, repair, and clean the common elements (lifts, water systems, common hallways, gardens).' },
  { item: 'To establish a structural maintenance fund and collect monthly levies from unit owners proportioned to their share percentages.' },
  { item: 'To insure the condominium building against fire, lightning, and structural hazards to its full replacement value.' },
  { item: 'To convene the Annual General Meeting (AGM) once every calendar year to present audited accounts and elect new office bearers.' }
];

export default function ResponsibilityMC() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Responsibility of the MC – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="Responsibility of the Management Corporation" />

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
              <ShieldAlert size={22} />
              <span>Statutory Duties & Mandates</span>
            </h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              The Management Corporation serves as the legal guardian of the vertical community. It is mandated by the Condominium Act to execute these core maintenance and financial duties:
            </p>
          </div>

          <div style={{ background: '#fff', border: '1px solid #edf2f7', borderRadius: '12px', padding: '1.5rem 2rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1f2937', marginBottom: '1.25rem' }}>
              Statutory Responsibilities Checklist
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {RESPONSIBILITIES.map((resp, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <ShieldCheck size={18} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.45 }}>
                    {resp.item}
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
