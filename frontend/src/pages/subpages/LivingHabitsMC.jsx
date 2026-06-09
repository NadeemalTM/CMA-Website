import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Activity, Wind, Flame, ShieldAlert, Trash2, Smile, Users, HeartHandshake, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import communityHarmonyImg from '../../assets/community_harmony.png';

const PageHeroFallback = ({ title, subtitle }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '4.5rem 1rem', color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, background: 'radial-gradient(circle, #C9A227 10%, transparent 11%)', backgroundSize: '20px 20px' }}></div>
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none', fontWeight: 500 }}>Home</a> 
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span> 
        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Management Corps</span> 
        <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span> 
        <span style={{ color: '#fff' }}>{title}</span>
      </div>
      <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: '#C9A227', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{title}</h1>
      {subtitle && <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.5 }}>{subtitle}</p>}
    </div>
  </div>
);

export default function LivingHabitsMC() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('mc_living_habits.title') || 'Condominium Living Habits'} – Condominium Management Authority`;
  }, [t]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
  };

  const categories = [
    {
      title: 'Health & Hygiene',
      subtitle: t('mc_living_habits.health_group_desc', 'Ensuring a disease-free, clean environment'),
      color: '#2e7d32',
      bgColor: 'rgba(46, 125, 50, 0.05)',
      items: [
        { key: 'p01', label: 'Epidemic Disease Prevention', icon: <Heart size={18} /> },
        { key: 'p02', label: 'Air Pollution Awareness', icon: <Wind size={18} /> },
        { key: 'p05', label: 'Insect Breeding Prevention', icon: <Activity size={18} /> },
        { key: 'p08', label: 'No Betel Spitting', icon: <ShieldAlert size={18} /> }
      ]
    },
    {
      title: 'Safety & Constructions',
      subtitle: t('mc_living_habits.safety_group_desc', 'Ensuring clear fire paths and safety codes'),
      color: '#d32f2f',
      bgColor: 'rgba(211, 47, 47, 0.05)',
      items: [
        { key: 'p03', label: 'Fire Safety Pathways', icon: <Flame size={18} /> },
        { key: 'p04', label: 'Proper Ventilation', icon: <Wind size={18} /> }
      ]
    },
    {
      title: 'Waste & Cleanliness',
      subtitle: t('mc_living_habits.waste_group_desc', 'Handling domestic refuse and odor control'),
      color: '#c9a227',
      bgColor: 'rgba(201, 162, 39, 0.05)',
      items: [
        { key: 'p06', label: 'Foul Odor Prevention', icon: <ShieldAlert size={18} /> },
        { key: 'p07', label: 'Garbage Disposal', icon: <Trash2 size={18} /> }
      ]
    },
    {
      title: 'Civic Duties & Social Harmony',
      subtitle: t('mc_living_habits.social_group_desc', 'Fostering cordial relationships and co-existence'),
      color: '#8b0000',
      bgColor: 'rgba(139, 0, 0, 0.05)',
      items: [
        { key: 'p09', label: 'Non-Disturbance of Neighbors', icon: <Smile size={18} /> },
        { key: 'p10', label: 'Sensitivity to Needs', icon: <Users size={18} /> },
        { key: 'p11', label: 'Neighborly Friendship', icon: <HeartHandshake size={18} /> },
        { key: 'p12', label: 'Public Participation', icon: <Users size={18} /> },
        { key: 'p13', label: 'Compromise for Common Good', icon: <HeartHandshake size={18} /> }
      ]
    }
  ];

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh', paddingBottom: '5rem' }}>
      <PageHeroFallback 
        title={t('mc_living_habits.title') || 'Condominium Living Habits'} 
        subtitle={t('mc_living_habits.subtitle') || 'Code of Conduct and Best Practices Expected from Unit Owners'} 
      />

      <section className="section" style={{ padding: '4.5rem 1.5rem' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', gap: '3rem', flexDirection: 'row', flexWrap: 'wrap' }}>
            
            {/* Left Column: Visual Illustration and Philosophy */}
            <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                  background: '#fff',
                  border: '1.5px solid #edf2f7',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.02)',
                  textAlign: 'center'
                }}
              >
                <img 
                  src={communityHarmonyImg} 
                  alt="Community Harmony" 
                  style={{ 
                    width: '100%', 
                    borderRadius: '12px', 
                    boxShadow: '0 8px 25px rgba(0,0,0,0.03)',
                    marginBottom: '1.5rem',
                    objectFit: 'cover',
                    height: '280px'
                  }} 
                />
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 800, color: '#1a202c' }}>
                  {t('mc_living_habits.card_title', 'Civic Etiquette & Harmony')}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, padding: '0 0.5rem' }}>
                  {t('mc_living_habits.intro') || 'Living in a condominium demands mutual respect, cooperation, and good civic habits. Adhering to these neighborly etiquettes maintains peace, avoids disputes, and makes the condominium a pleasant home for everyone.'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(139,0,0,0.02) 0%, rgba(201,162,39,0.02) 100%)',
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: '16px',
                  padding: '2rem'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ color: '#C9A227', marginTop: '2px' }}>
                    <Eye size={24} />
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', fontWeight: 700, color: '#1a202c' }}>
                      CMA Public Directive
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
                      These guidelines are actively endorsed by the Condominium Management Authority to promote hygiene, fire safety, structural preservation, and mutual coexistence in vertical residential zones.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Dynamic Category Lists */}
            <div style={{ flex: '2 2 600px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {categories.map((category, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ borderBottom: '2px solid #edf2f7', paddingBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: category.color }}>
                      {category.title}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                      {category.subtitle}
                    </p>
                  </div>

                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                  >
                    {category.items.map((item) => (
                      <motion.div
                        key={item.key}
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                        style={{
                          background: '#fff',
                          border: '1px solid #edf2f7',
                          borderRadius: '12px',
                          padding: '1.25rem 1.5rem',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.005)',
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'flex-start',
                          transition: 'transform 0.2s ease',
                          borderLeft: `4px solid ${category.color}`
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: category.bgColor,
                          color: category.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {item.icon}
                        </div>
                        <p style={{
                          margin: 0,
                          fontSize: '0.9rem',
                          color: '#334155',
                          lineHeight: 1.5,
                          textAlign: 'justify'
                        }}>
                          {t(`mc_living_habits.${item.key}`)}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
