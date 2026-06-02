import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Eye, Search, AlertOctagon } from 'lucide-react';

const PageHeroFallback = ({ title }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '3.5rem 1rem', color: '#fff' }}>
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a> <span>/</span> <span style={{ color: '#fff' }}>About Us</span> <span>/</span> <span>{title}</span>
      </div>
      <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#C9A227' }}>{title}</h1>
    </div>
  </div>
);

const POWERS = [
  { icon: Search, title: 'Inspect & Access Properties', desc: 'The Authority has legal powers to enter and inspect condominium common areas and buildings to evaluate structural safety, compliance, or developer neglect.' },
  { icon: ShieldCheck, title: 'Mediate & Arbitrate Disputes', desc: 'Empowered to summon parties, hold tribunal hearings, and issue binding resolutions for structural, financial, or co-habitation grievances between dwellers.' },
  { icon: Eye, title: 'Audit Sinking & Maintenance Funds', desc: 'Can demand and audit financial reports and account registries of Management Corporations to ensure resident funds are free of embezzlement.' },
  { icon: AlertOctagon, title: 'Execute Repairs & Recover Costs', desc: 'Vested with powers to carry out emergency structural repairs on buildings that present public hazards and recover costs from negligent developers or Management Corporations.' }
];

export default function PowersOfCma() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Powers of the Authority – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="Powers of the CMA" />

      <section className="section" style={{ padding: '4rem 1rem' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{
            background: '#fff',
            border: '1.5px solid var(--mid-gray)',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 1rem' }}>
              Statutory Powers & Enforcement
            </h2>
            <p style={{ color: '#334155', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
              To ensure compliance and protect the investments of condominium buyers, the legislature has vested the Condominium Management Authority with robust regulatory and administrative powers:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {POWERS.map((pow, index) => {
              const Icon = pow.icon;
              return (
                <div key={index} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '6px', background: 'rgba(139,0,0,0.06)', color: 'var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} />
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
                      {pow.title}
                    </h3>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                    {pow.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </div>
  );
}
