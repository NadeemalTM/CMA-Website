import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, ShieldCheck, Landmark } from 'lucide-react';
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

export default function RoleOfCma() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Role of the CMA – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="Role of the CMA" />

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '8px', background: 'rgba(139,0,0,0.06)', color: 'var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Landmark size={22} />
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--crimson)', margin: 0 }}>
                <T>Regulatory Authority & Establishment</T>
              </h2>
            </div>
            
            <p style={{ color: '#334155', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              <T>The Condominium Management Authority (CMA) of Sri Lanka was established under the Condominium Property Act No. 12 of 1973 (as amended by Act No. 39 of 2003). As the apex regulatory body, the Authority is empowered to regulate, supervise, and control all matters relating to the management and maintenance of condominium properties throughout the country.</T>
            </p>
            <p style={{ color: '#334155', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              <T>Operating under the purview of the Ministry of Urban Development & Housing, the CMA acts as a vital bridge between property developers, management corporations, and unit owners, ensuring high rise living cultures meet international standards of safety, financial transparency, and co-habitation harmony.</T>
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--crimson)', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scale size={18} />
                <span><T>Legal Supervisor</T></span>
              </h3>
              <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                <T>Responsible for enforcing strict compliance with the Apartment Ownership Law, checking condominium plans prior to registration, and certifying Management Corporation constitutions.</T>
              </p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--crimson)', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} />
                <span><T>Dweller Protection</T></span>
              </h3>
              <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                <T>Safeguards the financial contributions, sinking funds, and common property rights of residents, preventing developer neglect and ensuring fair management practices.</T>
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
