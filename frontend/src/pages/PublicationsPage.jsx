import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar } from 'lucide-react';
import { getDocuments } from '../services/api';

export default function PublicationsPage() {
  const { t } = useTranslation();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    getDocuments({ type: typeFilter || undefined })
      .then(r => setDocs(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [typeFilter]);

  const types = [
    { value: '', label: t('news.categories.all') },
    { value: 'law', label: t('publications.types.law') },
    { value: 'publication', label: t('publications.types.publication') },
    { value: 'form', label: t('publications.types.form') },
    { value: 'gazette', label: t('publications.types.gazette') },
    { value: 'annual_report', label: t('publications.types.annual_report') },
  ];

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>{t('publications.title')}</span></div>
          <h1>{t('publications.title')}</h1>
          <p>{t('publications.label')}</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {types.map(tp => (
              <button key={tp.value} className={`btn btn-sm ${typeFilter === tp.value ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTypeFilter(tp.value)}>
                {tp.label}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div>
          ) : docs.length === 0 ? (
            <div className="empty-state"><h3>{t('common.no_results')}</h3></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {docs.map((doc, i) => (
                <motion.div
                  key={doc.id || i}
                  className="card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', gap: '1rem', flexWrap: 'wrap' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--crimson-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={20} style={{ color: 'var(--crimson)' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', marginBottom: 2 }}>{doc.title}</h4>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span className="badge badge-crimson">{doc.type}</span>
                        {doc.year && <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Calendar size={12} /> {doc.year}</span>}
                        {doc.language && <span className="badge badge-gold">{doc.language.toUpperCase()}</span>}
                      </div>
                    </div>
                  </div>
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                    <Download size={14} /> {t('laws.download')}
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
