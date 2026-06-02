import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, User, ShieldCheck } from 'lucide-react';

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

const COUNCILS = [
  { role: 'Chairman', desc: 'The principal executive officer. Presides over council meetings, ensures by-laws are enforced, and coordinates administrative tasks.' },
  { role: 'Secretary', desc: 'Maintains MC registers, updates council member records, files structural and financial certifications to the CMA, and documents meeting minutes.' },
  { role: 'Treasurer', desc: 'Oversees financial portfolios. Manages the maintenance levy collections, sinking funds, and publishes audited accounts prior to the AGM.' }
];

export default function StructureMC() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'MC Structure & Members – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="Management Council Structure & Members" />

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
              <Users size={22} />
              <span>The Executive Council</span>
            </h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              The daily administration of the Management Corporation is carried out by the **Management Council** (the Executive Committee). Elected annually during the AGM, the council must contain at least three primary office bearers:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {COUNCILS.map((c, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  border: '1px solid #edf2f7',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '6px', background: 'rgba(139,0,0,0.06)', color: 'var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={16} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#1f2937' }}>
                    {c.role}
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.45 }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
