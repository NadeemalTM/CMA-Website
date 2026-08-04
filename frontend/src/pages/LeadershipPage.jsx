import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';
import { Mail, Phone, User } from 'lucide-react';
import { getLeaders } from '../services/api';
import './LeadershipPage.css';

import T from '../components/ui/T';

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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

function LeaderCard({ leader, index }) {
  const initials = leader.name
    ? leader.name
        .split(' ')
        .filter(w => w.length > 0)
        .map((w) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '??';

  return (
    <motion.div
      className="leader-card"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={index}
    >
      <div className="leader-card-header">
        {leader.photo ? (
          <img
            src={leader.photo}
            alt={leader.name}
            className="leader-photo"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="leader-avatar" style={leader.photo ? { display: 'none' } : {}}>
          {initials}
        </div>
      </div>
      <div className="leader-card-body">
        <h3 className="leader-name">{leader.name}</h3>
        <p className="leader-position">{leader.position}</p>
        {(leader.email || leader.phone) && (
          <div className="leader-contacts-wrapper">
            {leader.email && (
              <a href={`mailto:${leader.email}`} className="leader-contact">
                <Mail size={13} /> {leader.email}
              </a>
            )}
            {leader.phone && (
              <a href={`tel:${leader.phone}`} className="leader-contact">
                <Phone size={13} /> {leader.phone}
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function LeadershipPage() {
  const { t } = useTranslation();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Leadership – CMA Sri Lanka';
    getLeaders()
      .then((res) => {
        setLeaders(res.data?.data || res.data || []);
      })
      .catch((err) => {
        setError('Failed to load leadership data. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  const leadershipTeam = leaders.filter((leader) => leader.section_type !== 'board');
  const boardMembers = leaders.filter((leader) => leader.section_type === 'board');

  return (
    <div className="leadership-page" style={{ background: 'var(--off-white)', minHeight: '100vh', overflow: 'hidden' }}>
      <PageHeroFallback
        title={t('leadership.title', 'Leadership')}
        subtitle={t('leadership.desc', 'Meet the dedicated team guiding the Condominium Management Authority')}
      />

      <section className="section">
        <div className="container">
          {loading && (
            <div className="flex-center" style={{ padding: '5rem 0' }}>
              <div className="spinner" />
            </div>
          )}

          {error && !loading && (
            <div className="empty-state">
              <User size={48} />
              <h3>Unable to Load</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && leaders.length === 0 && (
            <div className="empty-state">
              <User size={48} />
              <h3>No Leaders Found</h3>
              <p>Leadership information will be available soon.</p>
            </div>
          )}

          {!loading && !error && leaders.length > 0 && (
            <>
              {leadershipTeam.length > 0 && (
                <div className="leadership-group">
                  <div className="leadership-section-heading">
                    <span><T>Our Leadership</T></span>
                    <h2><T>Leadership Team</T></h2>
                  </div>
                  <div className="leadership-grid">
                    {leadershipTeam.map((leader, i) => (
                      <LeaderCard key={leader.id || i} leader={leader} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {boardMembers.length > 0 && (
                <div className="leadership-group board-members-section">
                  <div className="leadership-section-heading">
                    <span><T>Governance</T></span>
                    <h2><T>Board Members</T></h2>
                  </div>
                  <div className="leadership-grid">
                    {boardMembers.map((leader, i) => (
                      <LeaderCard key={leader.id || i} leader={leader} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
