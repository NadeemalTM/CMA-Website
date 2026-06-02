import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Mail, Phone, User, ChevronRight, Loader } from 'lucide-react';
import api, { getLeaders } from '../services/api';
import './LeadershipPage.css';

const PageHeroFallback = ({ title, subtitle }) => (
  <div className="page-hero">
    <div className="container">
      <div className="breadcrumb">
        <a href="/">Home</a> <span>/</span> <a href="/about">About</a> <span>/</span>{' '}
        <span>{title}</span>
      </div>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
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
        {leader.email && (
          <a href={`mailto:${leader.email}`} className="leader-contact">
            <Mail size={14} /> {leader.email}
          </a>
        )}
        {leader.phone && (
          <a href={`tel:${leader.phone}`} className="leader-contact">
            <Phone size={14} /> {leader.phone}
          </a>
        )}
        {leader.slug && (
          <Link to={`/about/leadership/${leader.slug}`} className="btn btn-outline btn-sm leader-btn">
            View Profile <ChevronRight size={14} />
          </Link>
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

  return (
    <div className="leadership-page">
      <PageHeroFallback
        title={t('leadership.title', 'Our Leadership')}
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
              <div className="text-center" style={{ marginBottom: '3rem' }}>
                <span className="section-label">Leadership</span>
                <h2 className="section-title">Board of Directors &amp; Officers</h2>
                <p className="section-subtitle" style={{ margin: '0 auto' }}>
                  Our experienced leadership team is committed to advancing condominium governance
                  across Sri Lanka.
                </p>
              </div>
              <div className="leadership-grid">
                {leaders.map((leader, i) => (
                  <LeaderCard key={leader.id || i} leader={leader} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
