import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Scale, 
  ShieldCheck, 
  Hourglass, 
  AlertTriangle, 
  Building, 
  BookOpen, 
  Landmark, 
  HelpCircle,
  Users,
  CheckCircle2,
  ArrowRight,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import boardMeetingImg from '../../assets/board_meeting.png';
import PageHero from '../../components/ui/PageHero';

export default function ManagementCorporation() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [checklist, setChecklist] = useState([
    { id: 1, labelKey: 'mc_setup.chk1', labelDefault: 'Obtain Certificate of Conformity (CoC) from Local Municipal Council / Pradeshiya Sabha' },
    { id: 2, labelKey: 'mc_setup.chk2', labelDefault: 'Obtain Certified Condominium Plan (Form B) from a Registered Licensed Surveyor' },
    { id: 3, labelKey: 'mc_setup.chk3', labelDefault: 'Prepare and sign the Deed of Declaration with developers & first unit owners' },
    { id: 4, labelKey: 'mc_setup.chk4', labelDefault: 'Define unit allocation shares and common amenities schedules' },
    { id: 5, labelKey: 'mc_setup.chk5', labelDefault: 'Submit registration documents and pay the CMA statutory fee' },
  ]);

  useEffect(() => {
    document.title = `${t('mc_corporation.title') || 'Management Corporation'} – Condominium Management Authority`;
  }, [t]);

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const checkedCount = checklist.filter(c => c.checked).length;
  const progressPercent = Math.round((checkedCount / checklist.length) * 100);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 14 } }
  };

  const pillars = [
    {
      title: t('mc_corporation.para1_title') || 'Legal Status and Membership',
      text: t('mc_corporation.para1'),
      icon: <Scale size={24} />,
      color: '#8B0000',
      bgColor: 'rgba(139, 0, 0, 0.04)',
      badge: 'Act No. 45 of 1982'
    },
    {
      title: t('mc_corporation.para2_title') || 'Permanence and Continuity',
      text: t('mc_corporation.para2'),
      icon: <ShieldCheck size={24} />,
      color: '#C9A227',
      bgColor: 'rgba(201, 162, 39, 0.04)',
      badge: 'Act No. 11 of 1973'
    },
    {
      title: t('mc_corporation.para3_title') || 'Lifespan and Governance',
      text: t('mc_corporation.para3'),
      icon: <Hourglass size={24} />,
      color: '#2e7d32',
      bgColor: 'rgba(46, 125, 50, 0.04)',
      badge: 'Operational Lifespan'
    },
    {
      title: t('mc_corporation.para4_title') || 'Active Maintenance & Challenges',
      text: t('mc_corporation.para4'),
      icon: <AlertTriangle size={24} />,
      color: '#d32f2f',
      bgColor: 'rgba(211, 47, 47, 0.04)',
      badge: 'Private vs Public Sector'
    }
  ];

  const setupSteps = [
    {
      step: "01",
      title: t('mc_corporation.step1_title') || '1. Building Conformity',
      desc: t('mc_corporation.step1_desc') || 'Obtain the Certificate of Conformity (CoC) from the local authority once construction is complete.',
      icon: <Building size={22} />,
      color: '#8B0000',
      bgColor: 'rgba(139,0,0,0.05)',
      detail: 'Once construction is complete, the developer must apply to the local authority (Municipal Council, Urban Council, or Pradeshiya Sabha) to inspect the structure and issue a Certificate of Conformity. This certifies that the building has been built according to approved plans and safety standards.'
    },
    {
      step: "02",
      title: t('mc_corporation.step2_title') || '2. Condominium Plan',
      desc: t('mc_corporation.step2_desc') || 'Draft the certified Condominium Plan (Form B) showing unit boundaries and common elements.',
      icon: <BookOpen size={22} />,
      color: '#C9A227',
      bgColor: 'rgba(201,162,39,0.05)',
      detail: 'A registered licensed surveyor must prepare the Condominium Plan (Form B). This plan delineates the boundary of each unit, common elements (corridors, lifts, parking), and allocates the share value/entitlement for each unit owner, which determines their voting weight and maintenance contribution ratio.'
    },
    {
      step: "03",
      title: t('mc_corporation.step3_title') || '3. Registration of Deed',
      desc: t('mc_corporation.step3_desc') || 'Submit the plan to the Registrar General and register the first Deed of Transfer. The MC is automatically incorporated.',
      icon: <Scale size={22} />,
      color: '#2e7d32',
      bgColor: 'rgba(46,125,50,0.05)',
      detail: 'The certified Condominium Plan is registered with the Registrar General of Deeds. Upon registration of the first Deed of Transfer from the developer to a unit purchaser, the Management Corporation is automatically incorporated by operation of law. No separate registration is required to create the legal corporate body.'
    },
    {
      step: "04",
      title: t('mc_corporation.step4_title') || '4. Inaugural Council AGM',
      desc: t('mc_corporation.step4_desc') || 'Convene the First Annual General Meeting within 3 months to elect the Management Council.',
      icon: <Users size={22} />,
      color: '#1a0000',
      bgColor: 'rgba(26,0,0,0.05)',
      detail: 'Within 3 months of incorporation, the developer must convene the First Annual General Meeting of unit owners. During this inaugural meeting, owners elect the Management Council (comprising a Chairperson, Secretary, Treasurer, and council members), establish by-laws, and set up the Administrative and Sinking Funds.'
    }
  ];

  return (
    <div style={{ background: '#fdfdfc', minHeight: '80vh', paddingBottom: '5rem' }}>
      <PageHero 
        title={t('mc_corporation.title') || 'Management Corporation'} 
        subtitle={t('mc_corporation.subtitle') || 'Understanding the Legal Status, Permanence, and Role of the MC'} 
        breadcrumbs={[
          { label: t('mc.title') || 'Management Corporations', path: '/management-corps' },
          { label: t('mc_corporation.title') || 'Management Corporation' }
        ]}
      />

      <section className="section" style={{ padding: 'clamp(2rem, 5vw, 4.5rem) clamp(1rem, 3vw, 1.5rem)' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', gap: '3rem', flexDirection: 'row', flexWrap: 'wrap' }}>
            
            {/* Left Column: Visual Illustration, Did you know, and Call to action */}
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              {/* Board Meeting Image Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 50 }}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(139,0,0,0.06)' }}
                style={{
                  background: '#fff',
                  border: '1px solid var(--mid-gray)',
                  borderRadius: '24px',
                  padding: '1.5rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                  position: 'relative',
                  transition: 'box-shadow 0.3s ease'
                }}
              >
                <div style={{ overflow: 'hidden', borderRadius: '16px', position: 'relative', height: 'clamp(180px, 30vw, 290px)', marginBottom: '1.25rem' }}>
                  <motion.img 
                    src={boardMeetingImg} 
                    alt="Management Council Board Meeting" 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'rgba(26,0,0,0.85)',
                    color: '#C9A227',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '50px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    border: '1px solid rgba(201,162,39,0.3)',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {t('mc_setup.governance_badge', 'Corporate Body')}
                  </div>
                </div>
                <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.2rem', fontWeight: 800, color: '#1a0000', fontFamily: "'Outfit', sans-serif" }}>
                  {t('mc_setup.board_meeting_title', 'Management Council')}
                </h4>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, textAlign: 'justify' }}>
                  {t('mc_setup.board_meeting_desc', 'The elected Executive Council convenes regularly to coordinate property maintenance, administer funds, and enforce community by-laws for harmonious living.')}
                </p>
              </motion.div>

              {/* Did you know card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                whileHover={{ scale: 1.01 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(201,162,39,0.04) 0%, rgba(139,0,0,0.04) 100%)',
                  border: '1.5px dashed rgba(201,162,39,0.35)',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.01)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, repeatDelay: 2 }}
                    style={{ 
                      color: '#C9A227', 
                      background: 'rgba(201, 162, 39, 0.1)', 
                      padding: '0.6rem', 
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <HelpCircle size={24} />
                  </motion.div>
                  <div>
                    <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#1a0000', fontFamily: "'Outfit', sans-serif" }}>
                      {t('mc_setup.did_you_know', 'Did You Know?')}
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.65, textAlign: 'justify' }}>
                      {t('mc_setup.did_you_know_text', 'Under the Apartment Ownership Law, every unit owner automatically becomes an executive voting member of the Management Corporation from the date they register their deed of transfer. Membership is mandatory and cannot be resigned.')}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* CMA Support Action Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                whileHover={{ y: -4, boxShadow: '0 15px 35px rgba(26,0,0,0.2)' }}
                style={{
                  background: 'linear-gradient(135deg, #1a0000 0%, #3d0000 100%)',
                  borderRadius: '20px',
                  padding: '2.25rem',
                  color: '#fff',
                  border: '1px solid rgba(201, 162, 39, 0.25)',
                  boxShadow: '0 10px 25px rgba(26,0,0,0.15)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', opacity: 0.05, color: '#C9A227' }}>
                  <Landmark size={180} />
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ color: '#C9A227', background: 'rgba(255,255,255,0.08)', padding: '0.6rem', borderRadius: '12px', flexShrink: 0 }}>
                    <Landmark size={24} />
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 0.35rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#C9A227', fontFamily: "'Outfit', sans-serif" }}>
                      {t('mc_setup.registry_title', 'CMA Corporate Registry')}
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.86rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                      {t('mc_setup.registry_text', 'The Condominium Management Authority oversees the formal registration, auditing, and compliance support of Management Corporations across all districts in Sri Lanka.')}
                    </p>
                  </div>
                </div>
                <a 
                  href="/contact" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: '#C9A227',
                    color: '#1a0000',
                    textAlign: 'center',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(201,162,39,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e8c13a';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#C9A227';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  {t('mc_setup.contact_registry', 'Contact Registry Department')}
                  <ArrowRight size={16} />
                </a>
              </motion.div>

            </div>

            {/* Right Column: Concept Overview & Pillars list */}
            <div style={{ flex: '2 2 600px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              {/* Introduction Concept Overview */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: '#fff',
                  border: '1.5px solid var(--mid-gray)',
                  borderRadius: '24px',
                  padding: '2rem 2.25rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.01)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px', background: 'linear-gradient(to bottom, #8B0000, #C9A227)' }}></div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                  <div style={{
                    background: 'rgba(139,0,0,0.06)',
                    color: '#8B0000',
                    padding: '0.8rem',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Building size={26} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.6rem 0', fontSize: '1.4rem', fontWeight: 800, color: '#1a0000', fontFamily: "'Outfit', sans-serif" }}>
                      {t('mgmt.title', 'Management Corporations')}
                    </h3>
                    <p style={{ margin: 0, color: '#4a5568', fontSize: '0.94rem', lineHeight: 1.7, textAlign: 'justify' }}>
                      {t('mgmt.desc', 'A Management Corporation (MC) is a legally constituted corporate body established collectively by unit owners. Operating under the Apartment Ownership Acts of Sri Lanka, it acts as the central governing authority responsible for the upkeep, financial planning, safety, and community welfare of shared spaces.')}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Pillars with Staggered Entrance Animations */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                {pillars.map((pillar, idx) => (
                  <motion.div
                    key={idx}
                    variants={cardVariants}
                    whileHover={{ scale: 1.015, x: 8, boxShadow: '0 12px 25px rgba(0,0,0,0.03)' }}
                    style={{
                      background: '#fff',
                      border: '1px solid var(--mid-gray)',
                      borderRadius: '20px',
                      padding: '2rem',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.005)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                      borderLeft: `6px solid ${pillar.color}`,
                      position: 'relative'
                    }}
                  >
                    {/* Badge Pill */}
                    <span style={{
                      position: 'absolute',
                      top: '2rem',
                      right: '2rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: pillar.color,
                      background: pillar.bgColor,
                      padding: '0.3rem 0.75rem',
                      borderRadius: '50px',
                      letterSpacing: '0.02em',
                      border: `1px solid rgba(0,0,0,0.02)`
                    }}>
                      {pillar.badge}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '46px', 
                        height: '46px', 
                        borderRadius: '10px', 
                        background: pillar.bgColor, 
                        color: pillar.color, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {pillar.icon}
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1a0000', fontFamily: "'Outfit', sans-serif", paddingRight: '6rem', minWidth: 0 }}>
                        {pillar.title}
                      </h4>
                    </div>
                    
                    <p style={{ 
                      margin: 0, 
                      fontSize: '0.9rem', 
                      color: '#475569', 
                      lineHeight: 1.65,
                      textAlign: 'justify'
                    }}>
                      {pillar.text}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

          </div>

          {/* New Section: Interactive MC setup timeline */}
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
              padding: '3rem 2rem',
              boxShadow: '0 15px 35px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{
                color: '#C9A227',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                background: 'rgba(201,162,39,0.08)',
                padding: '0.35rem 0.9rem',
                borderRadius: '50px',
                display: 'inline-block',
                marginBottom: '0.75rem'
              }}>
                {t('mc_setup.timeline_badge', 'Workflow')}
              </span>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: '#1a0000', margin: '0 0 0.5rem 0', fontFamily: "'Outfit', sans-serif" }}>
                {t('mc_corporation.lifecycle_title', 'Management Corporation Setup Lifecycle')}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto' }}>
                {t('mc_corporation.lifecycle_subtitle', 'The four key stages of establishing and operating an MC under Sri Lankan law')}
              </p>
            </div>

            {/* Stepper Header (Desktop view / connected line) */}
            <div className="stepper-container" style={{ position: 'relative', marginBottom: '3rem' }}>
              
              {/* Connector line behind */}
              <div style={{
                position: 'absolute',
                top: '25px',
                left: '60px',
                right: '60px',
                height: '4px',
                background: 'var(--mid-gray)',
                zIndex: 1
              }}>
                {/* Active progress color indicator */}
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: `${(activeStep / (setupSteps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.4 }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(to right, #8B0000, #C9A227, #2e7d32)'
                  }}
                />
              </div>

              {/* Steps buttons grid */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 2,
                flexWrap: 'wrap',
                gap: '1.5rem'
              }}>
                {setupSteps.map((s, idx) => {
                  const isActive = activeStep === idx;
                  const isPast = idx < activeStep;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: '1 1 120px',
                        padding: 0
                      }}
                    >
                      {/* Step Circle Icon */}
                      <motion.div
                        animate={{
                          scale: isActive ? 1.15 : 1,
                          boxShadow: isActive 
                            ? `0 0 20px ${s.color}40`
                            : '0 4px 10px rgba(0,0,0,0.05)'
                        }}
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '50%',
                          background: isActive ? s.color : isPast ? '#2e7d32' : '#fff',
                          border: `2px solid ${isActive ? '#fff' : isPast ? '#2e7d32' : 'var(--mid-gray)'}`,
                          color: isActive ? '#fff' : isPast ? '#fff' : '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                          position: 'relative'
                        }}
                      >
                        {isPast ? <CheckCircle2 size={22} /> : s.icon}

                        {/* Number tag */}
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#C9A227',
                          color: '#1a0000',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid #fff'
                        }}>
                          {s.step}
                        </div>
                      </motion.div>

                      {/* Step Title Label */}
                      <span style={{
                        marginTop: '0.85rem',
                        fontSize: '0.86rem',
                        fontWeight: isActive ? 800 : 600,
                        color: isActive ? s.color : '#475569',
                        textAlign: 'center',
                        maxWidth: '130px',
                        transition: 'color 0.3s ease'
                      }}>
                        {s.title}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Stepper Active Detail Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(253,253,252,0.9) 100%)',
                  border: `1.5px solid ${setupSteps[activeStep].color}20`,
                  borderLeft: `6px solid ${setupSteps[activeStep].color}`,
                  borderRadius: '18px',
                  padding: '2.25rem',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.015)'
                }}
              >
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{
                    background: setupSteps[activeStep].bgColor,
                    color: setupSteps[activeStep].color,
                    padding: '0.75rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {setupSteps[activeStep].icon}
                  </div>
                  <div style={{ flex: '1 1 300px' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#1a0000', fontFamily: "'Outfit', sans-serif" }}>
                      {setupSteps[activeStep].title}
                    </h4>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.94rem', color: '#475569', fontWeight: 500, lineHeight: 1.6 }}>
                      {setupSteps[activeStep].desc}
                    </p>
                    <div style={{ borderTop: '1px solid var(--mid-gray)', paddingTop: '1rem', marginTop: '1rem' }}>
                      <h5 style={{ margin: '0 0 0.4rem 0', fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {t('mc_setup.legal_requirement', 'Legal Implementation detail')}
                      </h5>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, textAlign: 'justify' }}>
                        {setupSteps[activeStep].detail}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

          </motion.div>

          {/* New Section: Interactive MC Setup Readiness Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              marginTop: '4rem',
              background: 'linear-gradient(135deg, #fff 0%, #fdfdfc 100%)',
              border: '1.5px solid var(--mid-gray)',
              borderRadius: '24px',
              padding: '3rem 2.25rem',
              boxShadow: '0 12px 30px rgba(0,0,0,0.015)'
            }}
          >
            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              
              {/* Checklist Info Box */}
              <div style={{ flex: '1 1 350px' }}>
                <span style={{
                  color: '#2e7d32',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  background: 'rgba(46,125,50,0.08)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '50px',
                  display: 'inline-block',
                  marginBottom: '0.75rem'
                }}>
                  {t('mc_setup.checklist_badge', 'Interactive Tool')}
                </span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a0000', margin: '0 0 0.5rem 0', fontFamily: "'Outfit', sans-serif" }}>
                  {t('mc_setup.checklist_title', 'MC Setup Readiness Checklist')}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                  {t('mc_setup.checklist_desc', 'Use this interactive checklist to verify that your condominium community meets all statutory criteria to complete the setup process and register with the CMA registry.')}
                </p>

                {/* Dynamic Progress indicator */}
                <div style={{ background: 'var(--light-gray)', borderRadius: '10px', padding: '1.25rem', border: '1px solid var(--mid-gray)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                      {t('mc_setup.progress', 'Readiness Progress')}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: progressPercent === 100 ? '#2e7d32' : '#C9A227' }}>
                      {progressPercent}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--mid-gray)', borderRadius: '50px', overflow: 'hidden' }}>
                    <motion.div 
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.3 }}
                      style={{ 
                        height: '100%', 
                        background: progressPercent === 100 
                          ? 'linear-gradient(to right, #2e7d32, #4caf50)' 
                          : 'linear-gradient(to right, #8B0000, #C9A227)',
                        borderRadius: '50px' 
                      }} 
                    />
                  </div>
                </div>
              </div>

              {/* Checklist items list */}
              <div style={{ flex: '1.2 1.2 400px', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    style={{
                      background: item.checked ? 'rgba(46,125,50,0.02)' : '#fff',
                      border: `1.5px solid ${item.checked ? '#2e7d32' : 'var(--mid-gray)'}`,
                      borderRadius: '14px',
                      padding: '1.1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      outline: 'none',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.003)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!item.checked) e.currentTarget.style.borderColor = '#C9A227';
                    }}
                    onMouseLeave={(e) => {
                      if (!item.checked) e.currentTarget.style.borderColor = 'var(--mid-gray)';
                    }}
                  >
                    {/* Animated checkbox circle */}
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      border: `2px solid ${item.checked ? '#2e7d32' : 'var(--mid-gray)'}`,
                      background: item.checked ? '#2e7d32' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      flexShrink: 0,
                      marginTop: '1px',
                      transition: 'all 0.2s ease'
                    }}>
                      {item.checked && <CheckCircle2 size={14} style={{ strokeWidth: 3 }} />}
                    </div>

                    <span style={{
                      fontSize: '0.88rem',
                      color: item.checked ? '#1e293b' : '#475569',
                      fontWeight: item.checked ? 600 : 500,
                      lineHeight: 1.5,
                      textDecoration: item.checked ? 'line-through opacity 0.5' : 'none',
                      transition: 'all 0.2s ease'
                    }}>
                      {t(item.labelKey, item.labelDefault)}
                    </span>
                  </button>
                ))}
              </div>

            </div>

            {/* Success Celebration Alert Box */}
            <AnimatePresence>
              {progressPercent === 100 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '2.5rem' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(46,125,50,0.06) 0%, rgba(76,175,80,0.06) 100%)',
                    border: '1.5px solid #2e7d32',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ color: '#2e7d32', background: 'rgba(46,125,50,0.1)', padding: '0.5rem', borderRadius: '50%' }}>
                      <CheckCircle2 size={28} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#1b4332', fontFamily: "'Outfit', sans-serif" }}>
                        {t('mc_setup.checklist_ready_title', 'Ready for Registration!')}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: '#2d6a4f', fontWeight: 500 }}>
                        {t('mc_setup.checklist_ready_desc', 'You have completed all prerequisite steps. You can now submit your application to the CMA Registry.')}
                      </p>
                    </div>
                  </div>
                  <a
                    href="/applications"
                    style={{
                      background: '#2e7d32',
                      color: '#fff',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '8px',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 4px 10px rgba(46,125,50,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#1b4332'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#2e7d32'}
                  >
                    {t('mc_setup.apply_now', 'Apply Online Now')}
                    <ArrowRight size={16} />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

        </div>
      </section>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .stepper-container {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .stepper-container { display: none !important; }
        }
      `}</style>

    </div>
  );
}
