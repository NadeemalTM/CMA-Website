import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Calendar, CheckCircle, Clock, Target } from 'lucide-react';
import { getProjects } from '../services/api';

const statusConfig = { ongoing: { color: 'var(--gold)', icon: Clock }, completed: { color: 'var(--success)', icon: CheckCircle }, planned: { color: 'var(--info)', icon: Target } };

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then(r => setProjects(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>{t('projects.title')}</span></div>
          <h1>{t('projects.title')}</h1>
          <p>{t('projects.label')}</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div>
          ) : projects.length === 0 ? (
            <div className="empty-state"><h3>{t('common.no_results')}</h3></div>
          ) : (
            <div className="grid-3">
              {projects.map((p, i) => {
                const sc = statusConfig[p.status] || statusConfig.ongoing;
                const Icon = sc.icon;
                return (
                  <motion.div key={p.id || i} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <div style={{ height: 180, background: 'linear-gradient(135deg, var(--crimson) 0%, #3d0000 100%)', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '1.25rem' }}>
                      {p.image && <img src={p.image} alt={p.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />}
                      <span className="badge" style={{ background: sc.color, color: 'white', position: 'absolute', top: 12, right: 12 }}>
                        <Icon size={12} style={{ marginRight: 4 }} /> {t(`projects.status.${p.status}`)}
                      </span>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{p.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>{p.description?.substring(0, 150)}{p.description?.length > 150 ? '...' : ''}</p>
                      {p.location && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {p.location}</p>}
                      {p.start_date && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}><Calendar size={14} /> {p.start_date}{p.end_date ? ` — ${p.end_date}` : ''}</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
