import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Eye, ShieldAlert } from 'lucide-react';
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

export default function VisionMissionPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Vision & Mission – Condominium Management Authority';
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '100vh', overflow: 'hidden' }}>
      <PageHeroFallback 
        title="Vision & Mission" 
        subtitle="Guiding the development and management of condominium settlements across the country." 
      />

      <section className="section" style={{ padding: '6rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}
          >
            
            {/* Vision */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0,191,255,0.25)' }}
              style={{
                background: '#fff',
                borderRadius: '24px',
                padding: '4rem 3rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                border: '1px solid #e0f2fe',
                borderTop: '6px solid #0ea5e9', // Light Blue as per screenshot theme
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                zIndex: 1,
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-40px',
                left: '-40px',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)',
                zIndex: -1
              }} />

              <div style={{ 
                width: 80, height: 80, borderRadius: '24px', 
                background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', 
                color: '#0ea5e9', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                marginBottom: '2rem',
                boxShadow: '0 10px 25px rgba(14,165,233,0.2)'
              }}>
                <Eye size={40} strokeWidth={1.5} />
              </div>
              
              <h2 style={{ fontSize: '3rem', fontWeight: 300, color: '#0ea5e9', margin: '0 0 1.5rem', fontFamily: 'Georgia, serif', letterSpacing: '1px' }}>
                {t('vision_mission.vision_title', 'Vision')}
              </h2>
              
              <p style={{ color: '#334155', fontSize: '1.25rem', lineHeight: 1.8, margin: 0, maxWidth: '800px', fontWeight: 500 }}>
                {t('vision_mission.vision_desc', 'Assisting in the creation of condominium settlements as a solution to the housing requirement of the country')}
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(14,165,233,0.25)' }}
              style={{
                background: '#fff',
                borderRadius: '24px',
                padding: '4rem 3rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                border: '1px solid #e0f2fe',
                borderTop: '6px solid #0ea5e9', // Match color theme
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                zIndex: 1,
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                bottom: '-40px',
                right: '-40px',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)',
                zIndex: -1
              }} />

              <div style={{ 
                width: 80, height: 80, borderRadius: '24px', 
                background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', 
                color: '#0ea5e9', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                marginBottom: '2rem',
                boxShadow: '0 10px 25px rgba(14,165,233,0.2)'
              }}>
                <ShieldAlert size={40} strokeWidth={1.5} />
              </div>
              
              <h2 style={{ fontSize: '3rem', fontWeight: 300, color: '#0ea5e9', margin: '0 0 1.5rem', fontFamily: 'Georgia, serif', letterSpacing: '1px' }}>
                {t('vision_mission.mission_title', 'Mission')}
              </h2>
              
              <p style={{ color: '#334155', fontSize: '1.25rem', lineHeight: 1.8, margin: 0, maxWidth: '800px', fontWeight: 500 }}>
                {t('vision_mission.mission_desc', 'Constructing condominium property to be apposite with the benefit and welfare of residents and establishing management corporations for the systematic administration and management of such property and regulating their maintenance activities')}
              </p>
            </motion.div>

          </motion.div>

        </div>
      </section>
    </div>
  );
}
