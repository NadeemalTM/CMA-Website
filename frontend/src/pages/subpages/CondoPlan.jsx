import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Map, Layers, CheckSquare } from 'lucide-react';

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

const STEPS = [
  { id: 1, title: 'Drafting by a Licensed Surveyor', desc: 'A licensed land surveyor must draft a comprehensive three-dimensional plan showing individual unit boundaries, wall divisions, and common elements.' },
  { id: 2, title: 'Submission of Preliminary Plans', desc: 'Pre-allocate boundaries and outline basic shared parameters. Submit structural safety certifications signed by a chartered engineer.' },
  { id: 3, title: 'Valuation & Boundary Verification', desc: 'CMA officers inspect the high-rise structure to ensure physical unit layouts match the paper blueprint exactly.' },
  { id: 4, title: 'Final Registration Certificate', desc: 'Upon verification, CMA issues the plan registration certificate, enabling the Registrar General to register the deeds.' }
];

export default function CondoPlanPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Condominium Plan – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="Condominium Plan Registration" />

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
              <Map size={22} />
              <span>Three-Dimensional Blueprints</span>
            </h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              A Condominium Plan is a highly detailed, 3D blueprint drafted by a licensed surveyor that defines the vertical and horizontal boundaries of individual units, accessory units (car parks, gardens), and the common elements of the property.
            </p>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1f2937', marginBottom: '1.25rem' }}>
            Plan Registration Procedure
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e6edf3', borderRadius: 12, padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0 }}>What is a Plan of Condominium?</h3>
              <p style={{ color: '#334155', lineHeight: 1.6 }}>
                A plan of condominium is a method of dividing property so that an individual holds title to a portion of a building or a "unit", as well as a share of the rest of the property that is common to all unit owners. The term applies to residential, commercial or industrial properties and may be used for new or existing buildings.
              </p>

              <h4 style={{ marginTop: '1rem' }}>Key statutory requirements</h4>
              <ul style={{ color: '#475569', lineHeight: 1.8 }}>
                <li>The condominium plan must be prepared by a licensed surveyor and delineate external surface boundaries and the position of each subdivided building.</li>
                <li>It must include vertical sections showing floors and ceilings, heights of storeys, and descriptions with dimensions for condominium parcels.</li>
                <li>Each parcel must be identified, share values entered, and endorsements from registered professionals must be attached as required by the Act.</li>
                <li>Accessory parcels and common elements must be defined and detailed in accordance with prescribed requirements.</li>
              </ul>

              <p style={{ color: '#475569' }}>For the full statutory text and downloadable PDF, see the original CMA publication.</p>
            </div>

            {STEPS.map((step) => (
              <div key={step.id} style={{ background: '#fff', border: '1px solid #e6edf3', borderRadius: 12, padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ 
                  background: '#f8f9fa', 
                  color: 'var(--crimson)', 
                  fontWeight: 800, 
                  width: 40, height: 40, 
                  borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  flexShrink: 0 
                }}>
                  {step.id}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', color: '#1f2937' }}>{step.title}</h4>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
