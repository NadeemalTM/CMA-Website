import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, ShieldCheck, ChevronRight } from 'lucide-react';

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

const POWERS = [
  { power: 'Recover Outstanding Levies', desc: 'The MC Council has legal powers to recover unpaid maintenance or sinking fund levies from defaulting unit owners through legal action or administrative warnings.' },
  { power: 'Enforce Building By-Laws', desc: 'Enforce by-laws related to common areas, pet control, garbage grids, external property paints, and co-habitation noise limits.' },
  { power: 'Execute Structural Inspections', desc: 'Can enter private units (upon reasonable notice or immediately in emergencies) to inspect and repair plumbing, leaks, or common property elements.' },
  { power: 'Appoint Facility Agents', desc: 'Vested with corporate authority to hire and contract commercial property management agencies, lift engineers, security firms, or cleaners.' }
];

export default function PowersMC() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Power of the MC – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="Power of the Management Corporation" />

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
              <Scale size={22} />
              <span>Corporate Power & Authority</span>
            </h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              To enforce by-laws and successfully maintain high-rise structures, the Condominium Property Act vests Management Corporations with several corporate and executive legal powers:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {POWERS.map((pow, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--crimson)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ChevronRight size={16} />
                  <span>{pow.power}</span>
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.45 }}>
                  {pow.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
