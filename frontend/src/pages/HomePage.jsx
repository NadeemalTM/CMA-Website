import { useState, useEffect, useRef } from 'react';
import T from '../components/ui/T';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Phone, Mail, Home, Building2, ClipboardList, Newspaper, Scale, Eye, ShieldAlert, Award } from 'lucide-react';
import { getHeroSlides, getLeaders, getNews, getProjects, getVacancies } from '../services/api';
import './HomePage.css';
import slowOfficeGif from '../assets/slow_office.gif';


// Hero Slider
function HeroSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 6000);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  if (!slides.length) return null;
  const slide = slides[current] || slides[0];
  if (!slide) return null;

  return (
    <div className="hero-slider">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="hero-slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {slide.image ? (
            <img src={slide.image} alt={slide.title} className="hero-bg-img" />
          ) : (
            <div className="hero-bg-gradient" />
          )}
          <div className="hero-overlay" />
          <div className="container hero-content">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {slide.title}
            </motion.h1>
            {slide.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {slide.description}
              </motion.p>
            )}
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/about" className="btn btn-ghost">Learn More</Link>
              <Link to="/contact" className="btn btn-gold">Contact Us</Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button className="hero-arrow hero-arrow-prev" onClick={prev}><ChevronLeft /></button>
      <button className="hero-arrow hero-arrow-next" onClick={next}><ChevronRight /></button>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button key={i} className={`hero-dot${i === current ? ' active' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>

      {/* Quick Links overlay */}
      <QuickLinks />
    </div>
  );
}

function QuickLinks() {
  const { t } = useTranslation();
  const links = [
    { key: 'buying',   to: '/before-buying-condo',    Icon: Home },
    { key: 'managing', to: '/management-corps', Icon: Building2 },
    { key: 'news',     to: '/news',            Icon: Newspaper },
    { key: 'laws',     to: '/laws',            Icon: Scale },
    { key: 'contact',  to: '/contact',         Icon: Phone },
  ];
  return (
    <div className="quick-links-bar">
      <div className="container">
        <div className="quick-links-grid">
          {links.map(({ key, to, Icon }) => (
            <Link key={key} to={to} className="quick-link-item">
              <span className="quick-link-icon"><Icon size={26} strokeWidth={1.6} /></span>
              <span>{t(`home.quick_links.${key}`)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Animated Counter
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// News Card
function NewsCard({ item }) {
  const { t } = useTranslation();
  return (
    <motion.div className="news-card card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <div className="news-card-img">
        {item.image
          ? <img src={item.image} alt={item.title} />
          : <div className="news-card-img-placeholder" />}
        <span className={`tag tag-${item.category === 'event' ? 'gold' : ''}`}>{item.category}</span>
      </div>
      <div className="news-card-body">
        <p className="news-card-date text-muted">{item.published_at}</p>
        <h3>{item.title}</h3>
        <p className="text-muted">{item.excerpt}</p>
        <Link to={`/news/${item.slug}`} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
          {t('news.read_more')} →
        </Link>
      </div>
    </motion.div>
  );
}

// Leader Card
function LeaderCard({ leader }) {
  const { t } = useTranslation();
  return (
    <div className="leader-card card">
      <div className="leader-card-header">
        <div className="leader-avatar">
          {leader.photo
            ? <img src={leader.photo} alt={leader.name} />
            : <div className="leader-avatar-placeholder">{leader.name[0]}</div>}
        </div>
      </div>
      <div className="leader-card-body">
        <h4>{leader.name}</h4>
        <p className="text-crimson" style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {leader.position}
        </p>
      </div>

    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const [slides, setSlides] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [news, setNews] = useState([]);
  const [projects, setProjects] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [activeTab, setActiveTab] = useState('vision');

  useEffect(() => {
    getHeroSlides().then(r => setSlides(r.data.data)).catch(() => setSlides([{
      title: "Building Sri Lanka's Urban Future Together",
      subtitle: 'Condominium Management Authority · Sri Lanka',
      description: "Sri Lanka's premier regulatory body overseeing condominium properties.",
    }]));
    getLeaders().then(r => setLeaders((r.data.data || []).filter((leader) => leader.section_type !== 'board'))).catch(() => {});
    getNews({ limit: 3 }).then(r => setNews(r.data.data || [])).catch(() => {});
    getProjects().then(r => setProjects(r.data.data?.slice(0, 3) || [])).catch(() => {});
    getVacancies().then(r => setVacancies(r.data.data?.slice(0, 3) || [])).catch(() => {});
  }, []);

  return (
    <div className="homepage">
      {/* Hero */}
      <HeroSlider slides={slides} />

      {/* About Section */}
      <section className="section about-section">
        <div className="container">
          <div className="about-grid">
            <motion.div
              className="about-content"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-label">{t('home.about_label')}</span>
              <h2 className="section-title">
                {t('home.about_title')}{' '}
                <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{t('home.about_title_em')}</em>
                {' '}{t('home.about_title_end')}
              </h2>
              <p className="section-subtitle" style={{ marginBottom: '2rem' }}>{t('home.about_desc')}</p>

              <div className="about-services">
                {['resident', 'maintenance', 'transparency', 'governance'].map((key) => (
                  <div key={key} className="about-service-item">
                    <div className="service-icon-dot" />
                    <div>
                      <strong>{t(`about.services.${key}`)}</strong>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                        {t(`about.services.${key}_desc`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <Link to="/about" className="btn btn-primary">{t('home.about_btn')}</Link>
                <Link to="/about/history" className="btn btn-gold">{t('home.history_btn', 'CMA History')}</Link>
                <Link to="/contact" className="btn btn-outline">
                  <Phone size={16} /> {t('home.cta_call')}
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="about-images"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="about-img-grid">
                <div className="about-img about-img-1">
                  <div className="about-img-overlay">
                    <span className="about-img-badge"><T>🏙️ Urban Communities</T></span>
                  </div>
                </div>
                <div className="about-img about-img-2">
                  <div className="about-img-badge-bottom">🏢 Sri Lanka's Premier Property Authority</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { value: 3200, suffix: '+', label: t('home.stats.condominiums') },
              { value: 1102, suffix: '+', label: t('home.stats.mcs') },
              { value: 23, suffix: '+', label: t('home.stats.years') },
              { value: 25, suffix: '', label: t('home.stats.districts') },
            ].map(({ value, suffix, label }) => (
              <motion.div
                key={label}
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="stat-number">
                  <Counter target={value} suffix={suffix} />
                </div>
                <div className="stat-label">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission & Quality Policy Showcase */}
      <section className="section vision-mission-section" style={{ background: '#f8fafc', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            
            {/* Left Column: Premium Image Showcase */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ position: 'relative' }}
            >
              <div style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.8)',
                aspectRatio: '4/3',
                position: 'relative'
              }}>
                <img 
                  src={slowOfficeGif} 
                  alt="Office Time Lapse" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)'
                }} />
                
                {/* Floating Gold Badge Removed */}
              </div>
            </motion.div>

            {/* Right Column: Interactive Content with Tabs */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'left' }}
            >
              <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <span className="section-label" style={{ letterSpacing: '2px' }}>{t('home.vision_mission_label', 'OUR PURPOSE')}</span>
                <h2 className="section-title" style={{ fontSize: '2.25rem', marginBottom: '1rem', color: '#1e293b', textAlign: 'left' }}>
                  {t('home.vision_mission_title', 'Guiding Principles')}
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                  {t('home.vision_mission_desc', 'Our commitment to systematic condominium administration, regulation, and national housing development.')}
                </p>
              </div>

              {/* Tab Navigation */}
              <div style={{ 
                display: 'flex', 
                gap: '0.35rem', 
                background: '#f1f5f9', 
                padding: '0.35rem', 
                borderRadius: '14px', 
                marginBottom: '2rem',
                border: '1px solid #e2e8f0'
              }}>
                {[
                  { id: 'vision', label: t('vision_mission.vision_title', 'Vision'), color: 'var(--gold, #C9A227)' },
                  { id: 'mission', label: t('vision_mission.mission_title', 'Mission'), color: 'var(--crimson, #8b0000)' },
                  { id: 'policy', label: t('home.quality_policy_title_tab', 'Quality Policy'), color: 'var(--gold, #C9A227)' }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        flex: 1,
                        padding: '0.75rem 0.5rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: isActive ? '#fff' : 'transparent',
                        color: isActive ? tab.color : '#64748b',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: isActive ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {tab.id === 'vision' && <Eye size={16} />}
                      {tab.id === 'mission' && <ShieldAlert size={16} />}
                      {tab.id === 'policy' && <Award size={16} />}
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Display */}
              <div style={{ minHeight: '180px', position: 'relative' }}>
                <AnimatePresence mode="wait">
                  {activeTab === 'vision' && (
                    <motion.div
                      key="vision"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
                        border: '1px solid #e2e8f0',
                        borderLeft: '5px solid var(--gold, #C9A227)',
                        textAlign: 'left'
                      }}
                    >
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold, #C9A227)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem' }}>
                        <Eye size={20} /> {t('vision_mission.vision_title', 'Vision')}
                      </h4>
                      <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                        {t('vision_mission.vision_desc', 'Assisting in the creation of condominium settlements as a solution to the housing requirement of the country')}
                      </p>
                    </motion.div>
                  )}

                  {activeTab === 'mission' && (
                    <motion.div
                      key="mission"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
                        border: '1px solid #e2e8f0',
                        borderLeft: '5px solid var(--crimson, #8b0000)',
                        textAlign: 'left'
                      }}
                    >
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--crimson, #8b0000)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem' }}>
                        <ShieldAlert size={20} /> {t('vision_mission.mission_title', 'Mission')}
                      </h4>
                      <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                        {t('vision_mission.mission_desc', 'Constructing condominium property to be apposite with the benefit and welfare of residents and establishing management corporations for the systematic administration and management of such property and regulating their maintenance activities')}
                      </p>
                    </motion.div>
                  )}

                  {activeTab === 'policy' && (
                    <motion.div
                      key="policy"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
                        border: '1px solid #e2e8f0',
                        borderLeft: '5px solid var(--gold, #C9A227)',
                        textAlign: 'left'
                      }}
                    >
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold, #C9A227)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem' }}>
                        <Award size={20} /> {t('home.quality_policy_title', 'Our Quality Policy')}
                      </h4>
                      <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                        {t('home.quality_policy_desc', 'To endeavor to enhance the positive approach of the stakeholders to ensure the development of the condominium industry sector efficiently and productively as a service management organization to satisfy our clients.')}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* News */}
      {news.length > 0 && (
        <section className="section news-section" style={{ background: 'var(--off-white)' }}>
          <div className="container">
            <div className="flex-between" style={{ marginBottom: '3rem' }}>
              <div>
                <span className="section-label">{t('home.news_label')}</span>
                <h2 className="section-title">{t('home.news_title')}</h2>
              </div>
              <Link to="/news" className="btn btn-outline">{t('home.news_more')}</Link>
            </div>
            <div className="grid-3">
              {news.slice(0, 3).map((item) => <NewsCard key={item.id} item={item} />)}
            </div>
          </div>
        </section>
      )}



      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>{t('home.cta_title')}</h2>
              <p>{t('home.cta_desc')}</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
                <Link to="/applications" className="btn btn-gold btn-lg">{t('home.cta_btn')}</Link>
                <a href="tel:0112338146" className="btn btn-ghost btn-lg">
                  <Phone size={18} /> {t('home.cta_call')}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
