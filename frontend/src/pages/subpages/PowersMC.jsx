import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Scale, 
  FileText, 
  ShieldAlert, 
  ShoppingBag, 
  DollarSign, 
  Coins, 
  PowerOff, 
  TrendingUp, 
  Building, 
  AlertTriangle, 
  Landmark, 
  Gavel, 
  Award, 
  ArrowRight,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import mcPowersImg from '../../assets/mc_powers.png';
import PageHero from '../../components/ui/PageHero';

export default function PowersMC() {
  const { t } = useTranslation();
  const [selectedScenario, setSelectedScenario] = useState(0);

  useEffect(() => {
    document.title = `${t('mc_powers.title') || 'Powers of the MC'} – Condominium Management Authority`;
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

  const powersData = [
    { key: 'p01', icon: <FileText size={22} />, color: '#8B0000', bgColor: 'rgba(139,0,0,0.04)' },
    { key: 'p02', icon: <ShieldAlert size={22} />, color: '#d32f2f', bgColor: 'rgba(211,47,47,0.04)' },
    { key: 'p03', icon: <ShoppingBag size={22} />, color: '#2e7d32', bgColor: 'rgba(46,125,50,0.04)' },
    { key: 'p04', icon: <DollarSign size={22} />, color: '#C9A227', bgColor: 'rgba(201,162,39,0.04)' },
    { key: 'p05', icon: <Coins size={22} />, color: '#2e7d32', bgColor: 'rgba(46,125,50,0.04)' },
    { key: 'p06', icon: <PowerOff size={22} />, color: '#d32f2f', bgColor: 'rgba(211,47,47,0.04)' },
    { key: 'p07', icon: <TrendingUp size={22} />, color: '#3182ce', bgColor: 'rgba(49,130,206,0.04)' },
    { key: 'p08', icon: <Scale size={22} />, color: '#8B0000', bgColor: 'rgba(139,0,0,0.04)' },
    { key: 'p09', icon: <Building size={22} />, color: '#1a0000', bgColor: 'rgba(26,0,0,0.04)' },
    { key: 'p10', icon: <AlertTriangle size={22} />, color: '#C9A227', bgColor: 'rgba(201,162,39,0.04)' },
    { key: 'p11', icon: <Landmark size={22} />, color: '#3182ce', bgColor: 'rgba(49,130,206,0.04)' },
    { key: 'p12', icon: <Gavel size={22} />, color: '#8B0000', bgColor: 'rgba(139,0,0,0.04)' }
  ];

  const scenarios = [
    {
      title: t('mc_powers.scenario1_title', '1. Owner Defaults on Maintenance Fees'),
      powersAffected: [5, 6], // p05, p06
      tip: t('mc_powers.scenario1_tip', 'The MC can levy monthly contributions proportionally (Power 5). If a parcel owner defaults, the MC has the legal authority to discontinue supplied services and utilities such as electricity or water (Power 6).')
    },
    {
      title: t('mc_powers.scenario2_title', '2. Unauthorized Balcony Extension Built'),
      powersAffected: [9], // p09
      tip: t('mc_powers.scenario2_tip', 'The MC is legally empowered to take actions for the removal of all unauthorized constructions that violate the certified building plan, or formally request a statutory body to carry out the demolition (Power 9).')
    },
    {
      title: t('mc_powers.scenario3_title', '3. Need to Replace Building Elevator'),
      powersAffected: [7], // p07
      tip: t('mc_powers.scenario3_tip', 'For major capital expenditures exceeding normal reserves, the MC has the power to borrow capital funds, provided they obtain majority consent from the parcel owners during a General Meeting (Power 7).')
    },
    {
      title: t('mc_powers.scenario4_title', '4. Utility Arrears on Shared Complex Bills'),
      powersAffected: [2], // p02
      tip: t('mc_powers.scenario4_tip', 'To prevent utility provider termination (NWSDB / CEB), the MC has the power to disconnect individual connections of defaulting owners and keep them suspended until arrears are cleared (Power 2).')
    }
  ];

  return (
    <div style={{ background: '#fdfdfc', minHeight: '80vh', paddingBottom: '5rem' }}>
      <PageHero 
        title={t('mc_powers.title') || 'Powers of the Management Corporation'} 
        subtitle={t('mc_powers.subtitle') || 'Statutory Legal Rights and Authorities Granted to the Management Corporation'} 
        breadcrumbs={[
          { label: t('mc.title') || 'Management Corporations', path: '/management-corps' },
          { label: t('mc_powers.title') || 'Powers of the MC' }
        ]}
      />

      <section className="section" style={{ padding: '4.5rem 1.5rem' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', gap: '3rem', flexDirection: 'row', flexWrap: 'wrap' }}>
            
            {/* Left Column: Visual Illustration & Statutory Badge */}
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
                    src={mcPowersImg} 
                    alt="Management Corporation Powers" 
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '16px'
                    }} 
                  />
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#1a0000', fontFamily: "'Outfit', sans-serif" }}>
                  {t('mc_powers.badge_title', 'Statutory Authority')}
                </h4>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, padding: '0 0.5rem', textAlign: 'justify' }}>
                  {t('mc_powers.intro') || 'Under the Condominium Property Act, every registered Management Corporation is vested with several corporate and executive legal powers to enforce by-laws and successfully manage common property amenities.'}
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
                    <Award size={22} />
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#1a0000', fontFamily: "'Outfit', sans-serif" }}>
                      Regulatory Oversight
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, textAlign: 'justify' }}>
                      All corporate and executive powers are granted in accordance with the Apartment Ownership (Amendment) Act No. 45 of 1982. The CMA provides regulatory oversight to ensure powers are exercised in the public interest.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: 12 Powers Grid */}
            <div style={{ flex: '2 2 600px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div style={{ borderBottom: '2px solid var(--mid-gray)', paddingBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: 'var(--crimson)', fontFamily: "'Outfit', sans-serif" }}>
                  {t('mc_powers.title', 'Powers of the Management Corporation')}
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.88rem', color: '#64748b' }}>
                  Statutory executive authority granted to the MC for condominium management
                </p>
              </div>

              <motion.div 
                className="powers-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {powersData.map((p, idx) => (
                  <motion.div
                    key={p.key}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.015, boxShadow: '0 12px 25px rgba(0,0,0,0.03)' }}
                    style={{
                      background: '#fff',
                      border: '1px solid var(--mid-gray)',
                      borderRadius: '20px',
                      padding: '1.5rem 1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      position: 'relative',
                      transition: 'all 0.25s ease',
                      borderLeft: `5px solid ${p.color}`,
                      cursor: 'default'
                    }}
                  >
                    {/* Top row with custom icon and index number */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ 
                        width: '38px', 
                        height: '38px', 
                        borderRadius: '8px', 
                        background: p.bgColor, 
                        color: p.color, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center'
                      }}>
                        {p.icon}
                      </div>
                      <span style={{
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: '#a0aec0',
                        background: '#f7fafc',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px'
                      }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div>
                      <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.05rem', fontWeight: 800, color: '#1a0000', fontFamily: "'Outfit', sans-serif", lineHeight: 1.3 }}>
                        {t(`mc_powers.${p.key}_title`)}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.55, textAlign: 'justify' }}>
                        {t(`mc_powers.${p.key}`)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

          </div>

          {/* New Section: Interactive Statutory Powers Scenario Assistant */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              marginTop: '5rem',
              background: '#fff',
              border: '1px solid var(--mid-gray)',
              borderRadius: '24px',
              padding: '3.5rem 2.25rem',
              boxShadow: '0 15px 35px rgba(0,0,0,0.015)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{
                color: '#C9A227',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                background: 'rgba(201,162,39,0.08)',
                padding: '0.35rem 0.9rem',
                borderRadius: '50px',
                display: 'inline-block',
                marginBottom: '0.75rem'
              }}>
                {t('mc_powers.tool_badge', 'Interactive Assistant')}
              </span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1a0000', margin: '0 0 0.5rem 0', fontFamily: "'Outfit', sans-serif" }}>
                {t('mc_powers.tool_title', 'Statutory Powers Scenario Assistant')}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.94rem', maxWidth: '650px', margin: '0 auto' }}>
                {t('mc_powers.tool_desc', 'Select a common condominium management challenge below to see which legal powers the MC can utilize.')}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
              
              {/* Left Column: Interactive Scenario Selector Buttons */}
              <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {scenarios.map((s, idx) => {
                  const isSelected = selectedScenario === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedScenario(idx)}
                      style={{
                        background: isSelected ? 'rgba(139,0,0,0.02)' : '#fff',
                        border: `1.5px solid ${isSelected ? '#8B0000' : 'var(--mid-gray)'}`,
                        borderRadius: '16px',
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        outline: 'none',
                        boxShadow: isSelected ? '0 6px 15px rgba(139,0,0,0.04)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#C9A227';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = 'var(--mid-gray)';
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: isSelected ? '#8B0000' : 'var(--mid-gray)',
                          transition: 'all 0.2s ease'
                        }} />
                        <span style={{
                          fontSize: '0.92rem',
                          color: isSelected ? '#1a0000' : '#475569',
                          fontWeight: isSelected ? 700 : 500,
                          transition: 'all 0.2s ease'
                        }}>
                          {s.title}
                        </span>
                      </div>
                      <ArrowRight size={16} style={{ 
                        color: isSelected ? '#8B0000' : '#a0aec0',
                        transform: isSelected ? 'translateX(3px)' : 'none',
                        transition: 'all 0.2s ease'
                      }} />
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Active Scenario Answer Detail Box */}
              <div style={{ flex: '1.2 1.2 400px' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedScenario}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(253,253,252,0.9) 100%)',
                      border: '1.5px solid rgba(139,0,0,0.1)',
                      borderLeft: '6px solid #8B0000',
                      borderRadius: '20px',
                      padding: '2.5rem 2rem',
                      height: '100%',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.01)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <div style={{ color: '#C9A227', background: 'rgba(201,162,39,0.1)', padding: '0.4rem', borderRadius: '8px' }}>
                          <HelpCircle size={20} />
                        </div>
                        <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#1a0000', fontFamily: "'Outfit', sans-serif" }}>
                          Legal Resolution & Strategy
                        </h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.94rem', color: '#475569', lineHeight: 1.65, textAlign: 'justify' }}>
                        {scenarios[selectedScenario].tip}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--mid-gray)', paddingTop: '1.25rem', marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'center' }}>
                        Applicable Powers:
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {scenarios[selectedScenario].powersAffected.map((powerNum) => (
                          <span
                            key={powerNum}
                            style={{
                              background: 'rgba(139,0,0,0.06)',
                              color: '#8B0000',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              padding: '0.3rem 0.75rem',
                              borderRadius: '50px',
                              border: '1px solid rgba(139,0,0,0.1)'
                            }}
                          >
                            Power {powerNum}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

          </motion.div>

        </div>
      </section>
    </div>
  );
}
