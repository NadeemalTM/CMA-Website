import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, CheckCircle, ArrowRight } from 'lucide-react';

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

const PROCEDURES = [
  { step: '1. Registration of Condominium Plan', desc: 'The land surveyor registers the completed Condominium Plan with the Registrar General. This automatically creates the legal framework for the MC.' },
  { step: '2. Convening the First AGM', desc: 'The developer or unit owners must convene the first Annual General Meeting (AGM) within three (3) months of plan registration to elect the Council.' },
  { step: '3. Election of the Council', desc: 'During the AGM, unit owners elect a Management Council consisting of a Chairman, Secretary, Treasurer, and executive members.' },
  { step: '4. Registering the MC with the CMA', desc: 'The elected Secretary submits the formal MC constitution, registration documents, and elected council lists to the CMA for official licensing.' }
];

export default function SetupMC() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'How to Setup MC – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="How to Setup a Management Corporation" />

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
              <Layers size={22} />
              <span>Establishing the Legal Corporation</span>
            </h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Under the Condominium Property Act, every registered condominium must establish a Management Corporation (MC) to administer the common property, collect levies, and ensure standard maintenance:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {PROCEDURES.map((p, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  border: '1px solid #edf2f7',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start'
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'rgba(139,0,0,0.06)',
                    color: 'var(--crimson)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0
                  }}
                >
                  {idx + 1}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 700, color: '#1f2937' }}>
                    {p.step}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4 }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
