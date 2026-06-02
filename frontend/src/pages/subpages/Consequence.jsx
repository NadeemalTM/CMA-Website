import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Scale, BookOpen, AlertCircle } from 'lucide-react';

const PageHeroFallback = ({ title }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '3.5rem 1rem', color: '#fff' }}>
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a> <span>/</span> <span style={{ color: '#fff' }}>Laws & Plans</span> <span>/</span> <span>{title}</span>
      </div>
      <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#C9A227' }}>{title}</h1>
    </div>
  </div>
);

const CONSEQUENCES = [
  { title: 'Separate Property Units', desc: 'Upon registration, each condominium unit constitutes an independent parcel of property. The unit owner acquires absolute freehold title, separate from other units.' },
  { title: 'Co-Ownership of Common Areas', desc: 'The land on which the high-rise is built, structural walls, corridors, generators, water reservoirs, and staircases become shared property. Dwellers own undivided share percentages.' },
  { title: 'Automatic MC Corporation Creation', desc: 'The registration of the plan automatically creates a corporate legal entity: the Management Corporation. It holds statutory power to maintain the building and collect levies.' }
];

export default function Consequence() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Main Consequence & Legal Status – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="Main Consequence & Legal Status of Registration" />

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
              <span>Legal Consequences & Separation of Title</span>
            </h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Under the Apartment Ownership Law, the registration of a Condominium Plan with the Registrar General has vital legal consequences, transforming the physical building into distinct registered entities.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {CONSEQUENCES.map((con, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--crimson)' }}>
                  {con.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#4a5568', lineHeight: 1.5 }}>
                  {con.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
