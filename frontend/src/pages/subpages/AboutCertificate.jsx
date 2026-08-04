import { useEffect } from 'react';
import T from '../../components/ui/T';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Construction, 
  Building, 
  CheckCircle, 
  Info,
  ArrowRight,
  FileClock,
  FileSignature,
  FileCheck
} from 'lucide-react';

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
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a> <span>/</span> <span style={{ color: '#fff' }}><T>Services</T></span> <span>/</span> <span>{title}</span>
      </div>
        <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 5vw, 3rem)', fontWeight: 800, color: '#C9A227', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>{title}</h1>
      {subtitle && <p style={{ margin: '1rem 0 0', fontSize: '1.15rem', color: 'var(--mid-gray)', maxWidth: '700px', lineHeight: 1.6 }}>{subtitle}</p>}
    </motion.div>
    
    {/* Decorative background circles */}
    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0) 70%)' }} />
    <div style={{ position: 'absolute', bottom: '-100px', left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)' }} />
  </div>
);



export default function AboutCertificate() {
  const { t } = useTranslation();

  // Certificate Stages Data
  const STAGES = [
    {
      id: 'provisional',
      title: t('about_cert.stages.provisional.title', 'Provisional Condominium Certificate'),
      titleSi: t('about_cert.stages.provisional.titleSi', 'තාත්කාලික සහාධිපත්‍ය සහතිකය'),
      color: '#eab308', // Yellow
      bgLight: '#fefce8',
      image: '/About Certificate/provisional.jpg',
      icon: FileClock,
      description: t('about_cert.stages.provisional.description', 'Issued at the initial stages of construction. This certificate enables developers to obtain bank loans and facilitates loan facilities for buyers purchasing units in the property.'),
    },
    {
      id: 'semi',
      title: t('about_cert.stages.semi.title', 'Semi Condominium Certificate'),
      titleSi: t('about_cert.stages.semi.titleSi', 'අර්ධ සහාධිපත්‍ය සහතිකය'),
      color: '#f97316', // Orange
      bgLight: '#fff7ed',
      image: '/About Certificate/semi.jpg', // Using semi.jpg
      icon: FileSignature,
      description: t('about_cert.stages.semi.description', 'Obtained when a specific portion or phase of the condominium property is completed while the rest is under development. It can be used for completed towers or a set of units.'),
    },
    {
      id: 'full',
      title: t('about_cert.stages.full.title', 'Fully Condominium Certificate'),
      titleSi: t('about_cert.stages.full.titleSi', 'පූර්ණ සහාධිපත්‍ය සහතිකය'),
      color: '#22c55e', // Green
      bgLight: '#f0fdf4',
      image: '/About Certificate/full certi.jpg',
      icon: FileCheck,
      description: t('about_cert.stages.full.description', 'Issued after the complete construction of the building in accordance with the approved building plan, ensuring there are no unauthorized constructions. A mandatory certificate for complete legal compliance.'),
    }
  ];

  useEffect(() => {
    document.title = 'About Certificate – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '100vh', overflow: 'hidden' }}>
      <PageHeroFallback 
        title={t('about_cert.title', 'Condominium Certification Stages')} 
        subtitle={t('about_cert.subtitle', 'Understanding the three main stages of official property certification issued by the CMA.')} 
      />

      {/* Responsive styles */}
      <style>{`
        .cert-stage-card { flex-direction: row !important; }
        @media (max-width: 768px) {
          .cert-stage-card { flex-direction: column !important; gap: 2rem !important; padding: 2rem 1.25rem !important; }
          .cert-stage-card > div:first-child { flex: unset !important; width: 100% !important; }
          .cert-stage-card > div:last-child { flex: unset !important; width: 100% !important; }
        }
        @media (max-width: 480px) {
          .cert-stage-card { padding: 1.5rem 1rem !important; border-radius: 16px !important; }
          .cert-cta-box { padding: 2rem 1.25rem !important; border-radius: 16px !important; }
          .cert-cta-box h3 { font-size: 1.35rem !important; }
        }
      `}</style>

      <section className="section" style={{ padding: '5rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            {STAGES.map((stage, index) => {
              const isEven = index % 2 === 0;
              const Icon = stage.icon;
              
              return (
                <motion.div 
                  key={stage.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="cert-stage-card"
                  style={{ 
                    display: 'flex', 
                    flexDirection: isEven ? 'row' : 'row-reverse',
                    gap: '4rem',
                    alignItems: 'center',
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '3rem',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
                    border: `1px solid ${stage.color}20`,
                    position: 'relative',
                    overflow: 'visible',
                    flexWrap: 'wrap'
                  }}
                >
                  {/* Background graphic glow */}
                  <div style={{ 
                    position: 'absolute', 
                    top: isEven ? '-50px' : 'auto', 
                    bottom: isEven ? 'auto' : '-50px',
                    left: isEven ? '-50px' : 'auto', 
                    right: isEven ? 'auto' : '-50px',
                    width: '300px', 
                    height: '300px', 
                    borderRadius: '50%', 
                    background: stage.color, 
                    filter: 'blur(100px)', 
                    opacity: 0.15,
                    zIndex: 0
                  }} />

                  {/* Left/Right Visual side */}
                  <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                    <motion.div 
                      whileHover={{ scale: 1.02, rotate: isEven ? 1 : -1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      style={{
                        width: '100%',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: `0 25px 50px -12px ${stage.color}40`,
                        position: 'relative',
                        border: `4px solid #fff`
                      }}
                    >
                      <img 
                        src={stage.image} 
                        alt={stage.title} 
                        style={{ 
                          width: '100%', 
                          height: 'auto', 
                          display: 'block', 
                          objectFit: 'cover',
                          aspectRatio: '4/3'
                        }} 
                      />
                      <div style={{ 
                        position: 'absolute', 
                        bottom: '1.5rem', 
                        left: '1.5rem', 
                        background: 'rgba(255,255,255,0.95)', 
                        padding: '0.5rem 1.25rem', 
                        borderRadius: '30px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        fontWeight: 800,
                        color: stage.color,
                        letterSpacing: '1px',
                        fontSize: '0.85rem'
                      }}>
                        STAGE 0{index + 1}
                      </div>
                    </motion.div>
                  </div>

                  {/* Right/Left Text side */}
                  <div style={{ flex: '1 1 400px', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{ 
                        width: 48, height: 48, borderRadius: '12px', 
                        background: stage.bgLight, color: stage.color, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center' 
                      }}>
                        <Icon size={24} />
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: stage.color, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {t('about_cert.certificate_level', 'Certificate Level')} {index + 1}
                      </span>
                    </div>
                    
                    <h2 style={{ fontSize: '2rem', fontWeight: 850, color: '#1e293b', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                      {stage.title}
                    </h2>
                    {/* Secondary Title (only visually shown in English to match the Sinhala design, or just remove if we don't need double titles when language changes. We'll leave it as an accent with titleSi key) */}
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: stage.color, marginBottom: '1.5rem' }}>
                      {stage.titleSi}
                    </h3>
                    
                    <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                      {stage.description}
                    </p>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}
                    >
                      <CheckCircle size={18} color={stage.color} />
                      {t('about_cert.official_verification', 'Official CMA Verification Process')}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="cert-cta-box"
            style={{ 
              marginTop: '5rem', 
              background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', 
              padding: '3rem', 
              borderRadius: '24px', 
              textAlign: 'center',
              color: '#fff',
              boxShadow: '0 20px 40px rgba(74,0,0,0.2)'
            }}
          >
            <Info size={40} color="var(--gold)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.75rem', fontWeight: 800, color: '#C9A227' }}>
              {t('about_cert.ready_title', 'Ready to request a certificate?')}
            </h3>
            <p style={{ margin: '0 auto 2rem', color: 'var(--mid-gray)', fontSize: '1.05rem', maxWidth: '600px', lineHeight: 1.6 }}>
              {t('about_cert.ready_desc', 'You can apply and download your official condominium certificates directly through our secure online portal. Log in to your citizen account to begin.')}
            </p>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/services/certificate" 
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                background: 'var(--gold)', color: '#1a0000', textDecoration: 'none',
                padding: '1rem 2.5rem', borderRadius: '30px', fontWeight: 800,
                fontSize: '1.05rem', boxShadow: '0 10px 20px rgba(201,162,39,0.3)', 
                transition: 'all 0.2s'
              }}
            >
              <span>{t('citizen.nav.certificate', 'Get Your Certificate')}</span>
              <ArrowRight size={18} />
            </motion.a>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
