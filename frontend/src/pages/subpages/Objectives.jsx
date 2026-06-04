import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, CheckCircle2 } from 'lucide-react';
import T from '../../components/ui/T';

const PageHeroFallback = ({ title }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '3.5rem 1rem', color: '#fff' }}>
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a> <span>/</span> <span style={{ color: '#fff' }}><T>About Us</T></span> <span>/</span> <span><T>{title}</T></span>
      </div>
      <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#C9A227' }}><T>{title}</T></h1>
    </div>
  </div>
);

const OBJECTIVES = [
  { id: 1, text: 'To control, manage, maintain and administer condominium parcels, common elements and common amenities of condominium properties.' },
  { id: 2, text: 'To ensure common elements and common amenities of condominium properties are properly maintained and periodic repairs are carried out.' },
  { id: 3, text: 'To ensure buildings comprising condominium parcels are insured against fire and other risks and assist management corporations where necessary.' },
  { id: 4, text: 'To remove unauthorized constructions or intervene where registered plans are not complied with, protecting stakeholder interests.' },
  { id: 5, text: 'To assist management corporations to establish and maintain open spaces, roads, gardens and play areas and transfer maintenance responsibilities where appropriate.' },
  { id: 6, text: 'To monitor construction progress of registered condominium plans and intervene to protect stakeholder interests when required.' },
  { id: 7, text: 'To undertake redevelopment programmes and capital investment plans for approval by the Minister and coordinate implementation with relevant agencies.' }
];

export default function Objectives() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Objectives of the Authority – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="Objectives of the Authority" />

      <section className="section" style={{ padding: '4rem 1rem' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{
            background: '#fff',
            border: '1.5px solid var(--mid-gray)',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '8px', background: 'rgba(139,0,0,0.06)', color: 'var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={22} />
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--crimson)', margin: 0 }}>
                <T>Core Statutory Objectives</T>
              </h2>
            </div>
            
            <p style={{ color: '#334155', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              <T>The statutory mandate of the CMA is guided by several primary objectives intended to secure order, quality, and co-habitation harmony across all vertical housing properties in the Democratic Socialist Republic of Sri Lanka:</T>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {OBJECTIVES.map((obj) => (
                <div key={obj.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    <T>{obj.text}</T>
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
