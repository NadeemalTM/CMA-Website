import { useEffect } from 'react';
import T from '../../components/ui/T';
import { useTranslation } from 'react-i18next';
import { 
  Building, 
  Flame, 
  Trash2, 
  Smile, 
  ShieldAlert, 
  HeartHandshake, 
  Eye, 
  Landmark, 
  Settings, 
  Users, 
  BookOpen, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import unitResponsibilityImg from '../../assets/unit_responsibility.png';
import PageHero from '../../components/ui/PageHero';

export default function UnitOwnersResponsibilityMC() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('mc_unit_owner.title') || "Unit Owners' Responsibility"} – Condominium Management Authority`;
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
      title: t('mc_unit_owner.cat1_title', 'Property Care & Maintenance'),
      desc: t('mc_unit_owner.cat1_desc', 'Keeping individual units and shared infrastructure safe and operational'),
      color: '#2e7d32',
      bgColor: 'rgba(46,125,50,0.05)',
      items: [
        { key: 'p02', icon: <Flame size={18} /> },
        { key: 'p03', icon: <Trash2 size={18} /> },
        { key: 'p09', icon: <Settings size={18} /> },
        { key: 'p11', icon: <BookOpen size={18} /> }
      ]
    },
    {
      title: t('mc_unit_owner.cat2_title', 'Legal & Financial Obligations'),
      desc: t('mc_unit_owner.cat2_desc', 'Statutory compliance and administrative responsibilities of owners'),
      color: '#8B0000',
      bgColor: 'rgba(139,0,0,0.05)',
      items: [
        { key: 'p01', icon: <Building size={18} /> },
        { key: 'p06', icon: <HeartHandshake size={18} /> },
        { key: 'p08', icon: <Landmark size={18} /> },
        { key: 'p12', icon: <FileText size={18} /> }
      ]
    },
    {
      title: t('mc_unit_owner.cat3_title', 'Civic Harmony & Neighborly Conduct'),
      desc: t('mc_unit_owner.cat3_desc', 'Promoting mutual respect, peace, and shared enjoyment of common facilities'),
      color: '#C9A227',
      bgColor: 'rgba(201,162,39,0.05)',
      items: [
        { key: 'p04', icon: <Smile size={18} /> },
        { key: 'p05', icon: <ShieldAlert size={18} /> },
        { key: 'p10', icon: <Users size={18} /> }
      ]
    },
    {
      title: t('mc_unit_owner.cat4_title', 'Access & Right of Entry'),
      desc: t('mc_unit_owner.cat4_desc', 'Mandatory access provisions for maintenance and safety audits'),
      color: '#3182ce',
      bgColor: 'rgba(49,130,206,0.05)',
      items: [
        { key: 'p07', icon: <Eye size={18} />, hasSubs: true }
      ]
    }
  ];

  return (
    <div style={{ background: '#fdfdfc', minHeight: '80vh', paddingBottom: '5rem' }}>
      <PageHero 
        title={t('mc_unit_owner.title') || "Unit Owners' Responsibility"} 
        subtitle={t('mc_unit_owner.subtitle') || 'Statutory Duties and Obligations of Condominium Unit Owners'} 
        breadcrumbs={[
          { label: t('mc.title') || 'Management Corporations', path: '/management-corps' },
          { label: t('mc_unit_owner.title') || "Unit Owners' Responsibility" }
        ]}
      />

      <section className="section" style={{ padding: '4.5rem 1.5rem' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', gap: '3rem', flexDirection: 'row', flexWrap: 'wrap' }}>
            
            {/* Left Column: Visual Illustration and Directive */}
            <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -6 }}
                style={{
                  background: '#fff',
                  border: '1px solid var(--mid-gray)',
                  borderRadius: '24px',
                  padding: '1.5rem',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.02)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ overflow: 'hidden', borderRadius: '16px', height: '280px', marginBottom: '1.5rem' }}>
                  <img 
                    src={unitResponsibilityImg} 
                    alt="Unit Owner Responsibility" 
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '16px'
                    }} 
                  />
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#1a0000', fontFamily: "'Outfit', sans-serif" }}>
                  {t('mc_unit_owner.card_title') || 'Duties & Civic Responsibility'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, padding: '0 0.5rem', textAlign: 'justify' }}>
                  {t('mc_unit_owner.intro') || 'Living in a condominium involves shared foundations and mutual community living. Under the Condominium Property Act, individual unit owners carry specific legal obligations to protect the safety, hygiene, and harmony of all residents.'}
                </p>
              </motion.div>

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
                  <div style={{ color: '#C9A227', background: 'rgba(201,162,39,0.1)', padding: '0.5rem', borderRadius: '10px', marginTop: '2px' }}>
                    <ShieldAlert size={22} />
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#1a0000', fontFamily: "'Outfit', sans-serif" }}>
                      {t('mc_unit_owner.law_badge_title', 'Statutory Regulation')}
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, textAlign: 'justify' }}>
                      {t('mc_unit_owner.law_badge_desc', 'These obligations are legally binding under the Condominium Property Act No. 12 of 1973 and the Apartment Ownership (Amendment) Act No. 45 of 1982. Non-compliance is subject to formal inquiry and penalties.')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Categorized Staggered Items */}
            <div style={{ flex: '2 2 600px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {categories.map((category, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ borderBottom: '2px solid var(--mid-gray)', paddingBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: category.color, fontFamily: "'Outfit', sans-serif" }}>
                      {category.title}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.88rem', color: '#64748b' }}>
                      {category.desc}
                    </p>
                  </div>

                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                  >
                    {category.items.map((item) => (
                      <motion.div
                        key={item.key}
                        variants={itemVariants}
                        whileHover={{ x: 6, boxShadow: '0 8px 20px rgba(0,0,0,0.02)' }}
                        style={{
                          background: '#fff',
                          border: '1px solid var(--mid-gray)',
                          borderRadius: '16px',
                          padding: '1.5rem 1.75rem',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.005)',
                          display: 'flex',
                          gap: '1.25rem',
                          alignItems: 'flex-start',
                          transition: 'all 0.25s ease',
                          borderLeft: `5px solid ${category.color}`
                        }}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1a0000', fontFamily: "'Outfit', sans-serif" }}>
                            {t(`mc_unit_owner.${item.key}_title`)}
                          </h4>
                          <p style={{
                            margin: 0,
                            fontSize: '0.9rem',
                            color: '#475569',
                            lineHeight: 1.6,
                            textAlign: 'justify'
                          }}>
                            {t(`mc_unit_owner.${item.key}`)}
                          </p>

                          {/* Render Sub-list for Right of Entry (p07) */}
                          {item.hasSubs && (
                            <ul style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.75rem',
                              padding: '1rem 0 0 0.5rem',
                              margin: 0,
                              listStyleType: 'none'
                            }}>
                              {['sub1', 'sub2', 'sub3', 'sub4'].map((subKey) => (
                                <li key={subKey} style={{
                                  display: 'flex',
                                  gap: '0.75rem',
                                  alignItems: 'flex-start',
                                  fontSize: '0.88rem',
                                  color: '#526071',
                                  lineHeight: 1.55
                                }}>
                                  <CheckCircle2 size={16} style={{ color: category.color, flexShrink: 0, marginTop: '2px' }} />
                                  <span>{t(`mc_unit_owner.p07_${subKey}`)}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
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
