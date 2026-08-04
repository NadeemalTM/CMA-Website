import { useEffect } from 'react';
import T from '../../components/ui/T';
import { useTranslation } from 'react-i18next';
import { FileText, ClipboardCheck, ArrowRight, ShieldCheck } from 'lucide-react';

const PageHeroFallback = ({ title }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '3.5rem 1rem', color: '#fff' }}>
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a> <span>/</span> <span style={{ color: '#fff' }}><T>Laws & Plans</T></span> <span>/</span> <span>{title}</span>
      </div>
      <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#C9A227' }}>{title}</h1>
    </div>
  </div>
);

const PROCEDURES = [
  { step: '1. Filing of Application', desc: 'Developer submits a structural certificate request along with preliminary plans, local council conformity clearances, and structural drawings & all MEP drawings.' },
  { step: '2. Site Engineering Inspection', desc: 'CMA engineering department schedules and executes a physical site inspection. Fire safety, structural stability, and common boundary grids are audited and also all maintance services ware audited.' },
  { step: '3. Common Amenities Verification', desc: 'Audit of common amenities (water tanks, generators, elevators, parking grids) to ensure compliance with Act guidelines.' },
  { step: '4. Issuance of Certificate', desc: 'Upon successful checks, the CMA issues the common amenities common element certificate . This permits the developer to execute deed transactions.' }
];

export default function CertificateProcedure() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Certificate Procedure – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '80vh' }}>
      <PageHeroFallback title="Certificate Issuance Procedure" />

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
              <ClipboardCheck size={22} />
              <span><T>Structural & Completion Certification</T></span>
            </h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}><T>
              Prior to registering a condominium property or executing sales, developers must obtain an common amenities common element certificate from the CMA. This procedure guarantees vertical high-rise constructions meet national safety guidelines.
            </T></p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {PROCEDURES.map((p, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  border: '1px solid var(--mid-gray)',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative'
                }}
              >
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--crimson)' }}>
                  {p.step}
                </h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
