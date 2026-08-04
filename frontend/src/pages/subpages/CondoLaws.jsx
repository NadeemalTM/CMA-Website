import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api, { getStorageURL } from '../../services/api';
import T from '../../components/ui/T';

const PageHeroFallback = ({ title, subtitle }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '4rem 1rem', color: '#fff', position: 'relative', overflow: 'hidden' }}>
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container" 
      style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}
    >
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a> <span>/</span> <span style={{ color: '#fff' }}><T>About Us</T></span> <span>/</span> <span><T>{title}</T></span>
      </div>
      <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: 800, color: '#C9A227', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}><T>{title}</T></h1>
      {subtitle && <p style={{ margin: '1rem 0 0', fontSize: '1.15rem', color: 'var(--mid-gray)', maxWidth: '700px', lineHeight: 1.6 }}><T>{subtitle}</T></p>}
    </motion.div>
    
    {/* Decorative background circles */}
    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0) 70%)' }} />
    <div style={{ position: 'absolute', bottom: '-100px', left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)' }} />
  </div>
);

export default function CondoLawsPage() {
  const { t } = useTranslation();
  const [laws, setLaws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Condominium Laws – Condominium Management Authority';
    
    // Fetch active laws
    api.get('/laws?public=1')
      .then(res => {
        setLaws(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch laws:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '100vh', overflow: 'hidden' }}>
      <PageHeroFallback 
        title="Condominium Laws & Legislation" 
        subtitle="The regulatory framework governing condominium properties, management corporations, and shared amenities in Sri Lanka."
      />

      <section className="section" style={{ padding: '5rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: '#fff',
              border: '1px solid var(--light-gray)',
              borderTop: '4px solid var(--crimson)',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              marginBottom: '3rem',
              position: 'relative'
            }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Scale size={24} color="#C9A227" />
              <span><T>Acts & Legal Framework</T></span>
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
              <T>The regulatory authority of the CMA is derived from a series of legal acts and amendments passed by the Parliament of Sri Lanka. Access and review official summaries of these legislations below:</T>
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0', color: 'var(--crimson)' }}>
                <Loader2 className="spinner" size={36} />
              </div>
            ) : laws.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: '#fff', borderRadius: '20px', border: '1px solid var(--light-gray)' }}>
                <T>No laws are currently published.</T>
              </div>
            ) : laws.map((law, index) => (
              <motion.div
                key={law.id}
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                style={{
                  background: '#fff',
                  border: '1px solid var(--light-gray)',
                  borderTop: '4px solid var(--crimson)',
                  borderRadius: '20px',
                  padding: '2.5rem 2rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ background: 'rgba(201,162,39,0.15)', color: '#b48a14', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                      {law.title}
                    </h4>
                  </div>
                  {law.description && (
                    <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.6, paddingLeft: '3.25rem' }}>
                      {law.description}
                    </p>
                  )}
                </div>
                
                {law.file_path && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', paddingLeft: '3.25rem' }}>
                    <a
                      href={getStorageURL(law.file_path)}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1.25rem',
                        borderRadius: '10px',
                        border: '1.5px solid var(--crimson)',
                        background: 'transparent',
                        color: 'var(--crimson)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--crimson)';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--crimson)';
                      }}
                    >
                      <Download size={16} />
                      <span><T>Download PDF</T></span>
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>
    </div>
  );
}
