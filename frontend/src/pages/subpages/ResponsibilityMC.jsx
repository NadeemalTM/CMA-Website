import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Settings, 
  Wrench, 
  Sparkles, 
  ShieldCheck, 
  Building, 
  AlertTriangle, 
  DollarSign, 
  ShieldAlert, 
  Users,
  Info,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import mcResponsibilitiesImg from '../../assets/mc_responsibilities.png';
import PageHero from '../../components/ui/PageHero';

export default function ResponsibilityMC() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    document.title = `${t('mc_responsibilities.title') || 'Responsibility of the MC'} – Condominium Management Authority`;
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 14 } }
  };

  const responsibilities = [
    { 
      key: 'p01', 
      category: 'maint', 
      icon: <Settings size={22} />, 
      color: '#C9A227', 
      bgColor: 'rgba(201,162,39,0.06)' 
    },
    { 
      key: 'p02', 
      category: 'maint', 
      icon: <Wrench size={22} />, 
      color: '#C9A227', 
      bgColor: 'rgba(201,162,39,0.06)' 
    },
    { 
      key: 'p03', 
      category: 'maint', 
      icon: <Sparkles size={22} />, 
      color: '#C9A227', 
      bgColor: 'rgba(201,162,39,0.06)' 
    },
    { 
      key: 'p04', 
      category: 'finance', 
      icon: <ShieldCheck size={22} />, 
      color: '#2e7d32', 
      bgColor: 'rgba(46,125,50,0.06)' 
    },
    { 
      key: 'p05', 
      category: 'finance', 
      icon: <Building size={22} />, 
      color: '#2e7d32', 
      bgColor: 'rgba(46,125,50,0.06)' 
    },
    { 
      key: 'p06', 
      category: 'safety', 
      icon: <AlertTriangle size={22} />, 
      color: '#3182ce', 
      bgColor: 'rgba(49,130,206,0.06)' 
    },
    { 
      key: 'p07', 
      category: 'finance', 
      icon: <DollarSign size={22} />, 
      color: '#2e7d32', 
      bgColor: 'rgba(46,125,50,0.06)' 
    },
    { 
      key: 'p08', 
      category: 'safety', 
      icon: <ShieldAlert size={22} />, 
      color: '#3182ce', 
      bgColor: 'rgba(49,130,206,0.06)' 
    },
    { 
      key: 'p09', 
      category: 'safety', 
      icon: <Users size={22} />, 
      color: '#3182ce', 
      bgColor: 'rgba(49,130,206,0.06)' 
    }
  ];

  const filterButtons = [
    { id: 'all', labelKey: 'mc_responsibilities.filter_all', color: 'var(--crimson)', count: 9 },
    { id: 'maint', labelKey: 'mc_responsibilities.filter_maint', color: '#C9A227', count: 3 },
    { id: 'finance', labelKey: 'mc_responsibilities.filter_finance', color: '#2e7d32', count: 3 },
    { id: 'safety', labelKey: 'mc_responsibilities.filter_safety', color: '#3182ce', count: 3 }
  ];

  const filteredDuties = activeFilter === 'all' 
    ? responsibilities 
    : responsibilities.filter(d => d.category === activeFilter);

  return (
    <div style={{ background: '#fdfdfc', minHeight: '80vh', paddingBottom: '5rem' }}>
      <PageHero 
        title={t('mc_responsibilities.title') || 'Responsibility of the Management Corporation'} 
        subtitle={t('mc_responsibilities.subtitle') || 'Statutory Duties and Mandates under the Condominium Property Act'} 
        breadcrumbs={[
          { label: t('mc.title') || 'Management Corporations', path: '/management-corps' },
          { label: t('mc_responsibilities.title') || 'Responsibility of the MC' }
        ]}
      />

      <section className="section" style={{ padding: '4.5rem 1.5rem' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', gap: '3rem', flexDirection: 'row', flexWrap: 'wrap' }}>
            
            {/* Left Column: Visual & Filters Sidebar */}
            <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Illustration Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -6 }}
                style={{
                  background: '#fff',
                  border: '1px solid #edf2f7',
                  borderRadius: '24px',
                  padding: '1.5rem',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ overflow: 'hidden', borderRadius: '16px', height: '280px', marginBottom: '1.5rem' }}>
                  <img 
                    src={mcResponsibilitiesImg} 
                    alt="MC Responsibilities" 
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '16px'
                    }} 
                  />
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#1a0000', fontFamily: "'Outfit', sans-serif" }}>
                  {t('mc_responsibilities.tool_badge')}
                </h4>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, textAlign: 'justify' }}>
                  {t('mc_responsibilities.intro')}
                </p>
              </motion.div>

              {/* Interactive Explorer / Filter widget */}
              <div style={{
                background: '#fff',
                border: '1px solid #edf2f7',
                borderRadius: '24px',
                padding: '2rem 1.5rem',
                boxShadow: '0 12px 30px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <ListFilter size={18} color="var(--crimson)" />
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1a0000', fontFamily: "'Outfit', sans-serif" }}>
                    {t('mc_responsibilities.tool_title')}
                  </h4>
                </div>
                <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                  {t('mc_responsibilities.tool_desc')}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {filterButtons.map((btn) => {
                    const isActive = activeFilter === btn.id;
                    return (
                      <button
                        key={btn.id}
                        onClick={() => setActiveFilter(btn.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'between',
                          width: '100%',
                          padding: '0.9rem 1.25rem',
                          borderRadius: '12px',
                          border: isActive ? `1.5px solid ${btn.color}` : '1.5px solid #edf2f7',
                          background: isActive ? `rgba(${btn.id === 'all' ? '139,0,0' : btn.id === 'maint' ? '201,162,39' : btn.id === 'finance' ? '46,125,50' : '49,130,206'}, 0.05)` : '#fff',
                          color: isActive ? btn.color : '#4a5568',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          borderLeft: `5px solid ${btn.color}`
                        }}
                      >
                        <span style={{ flexGrow: 1 }}>{t(btn.labelKey)}</span>
                        <span style={{
                          background: isActive ? btn.color : '#edf2f7',
                          color: isActive ? '#fff' : '#718096',
                          borderRadius: '30px',
                          padding: '0.1rem 0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          minWidth: '22px',
                          textAlign: 'center'
                        }}>
                          {btn.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Regulatory Oversight Notice */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(139,0,0,0.03) 0%, rgba(201,162,39,0.03) 100%)',
                  border: '1.5px dashed rgba(201,162,39,0.35)',
                  borderRadius: '20px',
                  padding: '2rem'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    background: 'rgba(201,162,39,0.15)',
                    padding: '0.5rem',
                    borderRadius: '12px',
                    color: '#C9A227',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Info size={20} />
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 0.35rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#1a0000', fontFamily: "'Outfit', sans-serif" }}>
                      {t('mc_responsibilities.enforcement_title')}
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#4a5568', lineHeight: 1.6, textAlign: 'justify' }}>
                      {t('mc_responsibilities.enforcement_desc')}
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Right Column: Dynamic filtered list of duties */}
            <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'true', borderBottom: '1px solid #edf2f7', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('mc_responsibilities.tool_badge')}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '0.82rem', fontWeight: 600, color: 'var(--crimson)', background: 'rgba(139,0,0,0.06)', padding: '0.2rem 0.6rem', borderRadius: '30px' }}>
                  {filteredDuties.length} {filteredDuties.length === 1 ? 'Duty Found' : 'Duties Found'}
                </span>
              </div>

              <motion.div
                key={activeFilter}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                <AnimatePresence mode="popLayout">
                  {filteredDuties.map((duty) => (
                    <motion.div
                      key={duty.key}
                      variants={itemVariants}
                      layout
                      whileHover={{ x: 6, boxShadow: '0 8px 20px rgba(0,0,0,0.02)' }}
                      style={{
                        background: '#fff',
                        border: '1px solid #edf2f7',
                        borderRadius: '16px',
                        padding: '1.75rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.005)',
                        display: 'flex',
                        gap: '1.5rem',
                        alignItems: 'flex-start',
                        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                        borderLeft: `5px solid ${duty.color}`
                      }}
                    >
                      {/* Icon container */}
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        background: duty.bgColor,
                        color: duty.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                      }}>
                        {duty.icon}
                      </div>

                      {/* Content details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                        <h4 style={{
                          margin: 0,
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          color: '#1a0000',
                          fontFamily: "'Outfit', sans-serif",
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          {t(`mc_responsibilities.${duty.key}_title`)}
                          <CheckCircle2 size={16} color="#2e7d32" style={{ opacity: 0.85 }} />
                        </h4>
                        <p style={{
                          margin: 0,
                          fontSize: '0.92rem',
                          color: '#4a5568',
                          lineHeight: 1.65,
                          textAlign: 'justify'
                        }}>
                          {t(`mc_responsibilities.${duty.key}`)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
}

