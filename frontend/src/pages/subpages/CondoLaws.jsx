import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, FileText, Download } from 'lucide-react';

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

const LAWS = [
  { title: 'Condominium Property Act No. 12 of 1973', desc: 'The foundational act that governs the subdivision of properties into units and common elements, and establishes ownership and registration criteria.' },
  { title: 'Apartment Ownership (Amendment) Act No. 39 of 2003', desc: 'A vital amendment that established the Condominium Management Authority (CMA) and expands the regulatory powers over Management Corporations.' },
  { title: 'Common Amenities Board Act No. 24 of 1973', desc: 'Legislation governing the control, administration, maintenance, and supervision of common amenities inside multi-family housing properties.' }
];

export default function CondoLawsPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Condominium Laws – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="Condominium Laws & Legislation" />

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
              <Scale size={22} />
              <span>Acts & Legal Framework</span>
            </h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              The regulatory authority of the CMA is derived from a series of legal acts and amendments passed by the Parliament of Sri Lanka. Access and download official copies of these legislations below:
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {LAWS.map((law, index) => (
              <div
                key={index}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', fontWeight: 700, color: '#1f2937' }}>
                    {law.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>
                    {law.desc}
                  </p>
                </div>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1.5px solid var(--crimson)',
                    background: 'transparent',
                    color: 'var(--crimson)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </a>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
