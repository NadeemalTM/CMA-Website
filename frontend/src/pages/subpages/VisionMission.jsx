import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, ShieldAlert, Award } from 'lucide-react';
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

export default function VisionMissionPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Vision & Mission – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="Vision, Mission & Quality Policy" />

      <section className="section" style={{ padding: '4rem 1rem' }}>
        <div className="container" style={{ maxWidth: '950px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Vision */}
            <div style={{
              background: '#fff',
              border: '1.5px solid var(--mid-gray)',
              borderRadius: '16px',
              padding: '2.5rem 2rem',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(139,0,0,0.06)', color: 'var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Eye size={28} />
              </div>
              <div style={{ flex: 1, minWidth: '260px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 0.5rem' }}>
                  <T>Our Vision</T>
                </h3>
                <p style={{ color: '#334155', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
                  <T>"To be the premier regulatory authority that nurtures a culture of orderly, harmonious, and sustainable condominium living in Sri Lanka."</T>
                </p>
              </div>
            </div>

            {/* Mission */}
            <div style={{
              background: '#fff',
              border: '1.5px solid var(--mid-gray)',
              borderRadius: '16px',
              padding: '2.5rem 2rem',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(201,162,39,0.08)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldAlert size={28} />
              </div>
              <div style={{ flex: 1, minWidth: '260px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#C9A227', margin: '0 0 0.5rem' }}>
                  <T>Our Mission</T>
                </h3>
                <p style={{ color: '#334155', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
                  <T>"To regulate, facilitate and promote the efficient management of condominium properties by providing comprehensive services that protect the rights and interests of all stakeholders."</T>
                </p>
              </div>
            </div>

            {/* Quality Policy */}
            <div style={{
              background: '#fff',
              border: '1.5px solid var(--mid-gray)',
              borderRadius: '16px',
              padding: '2.5rem 2rem',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(139,0,0,0.06)', color: 'var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award size={28} />
              </div>
              <div style={{ flex: 1, minWidth: '260px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 0.5rem' }}>
                  <T>Our Quality Policy</T>
                </h3>
                <p style={{ color: '#334155', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
                  <T>"We are committed to delivering high-quality regulatory and administrative services that exceed the expectations of our stakeholders through a focus on legal compliance, automated operations, continuous staff training, and structural security auditing of condominium properties."</T>
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
