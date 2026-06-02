import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Users } from 'lucide-react';
import { getVacancies } from '../services/api';

export default function CareersPage() {
  const { t } = useTranslation();
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVacancies().then(r => setVacancies(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>{t('careers.title')}</span></div>
          <h1>{t('careers.title')}</h1>
          <p>{t('careers.desc')}</p>
        </div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          {loading ? (
            <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div>
          ) : vacancies.length === 0 ? (
            <div className="empty-state" style={{ padding: '5rem 2rem' }}>
              <Briefcase size={48} style={{ color: 'var(--mid-gray)', marginBottom: '1rem' }} />
              <h3>{t('careers.no_vacancies')}</h3>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                <Users size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {vacancies.length} {vacancies.length === 1 ? 'position' : 'positions'} available
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {vacancies.map((v, i) => (
                  <motion.div
                    key={v.id || i}
                    className="card"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{ padding: '2rem' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                          <Briefcase size={18} style={{ verticalAlign: 'middle', color: 'var(--crimson)', marginRight: 8 }} />
                          {v.title}
                        </h3>
                        {v.deadline && (
                          <p style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--crimson)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>
                            <Calendar size={14} /> {t('careers.deadline')}: {v.deadline}
                          </p>
                        )}
                        {v.description && (
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: v.description }} />
                        )}
                      </div>
                      <a href={`mailto:info@condominium.lk?subject=Application for ${v.title}`} className="btn btn-primary" style={{ flexShrink: 0 }}>
                        {t('careers.apply')}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
