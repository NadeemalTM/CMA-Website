import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { getNews } from '../services/api';

export default function NewsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getNews({ category: category || undefined, page })
      .then(r => {
        setNews(r.data.data || []);
        setTotalPages(r.data.last_page || 1);
      })
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, [category, page]);

  const categories = [
    { value: '', label: t('news.categories.all') },
    { value: 'news', label: t('news.categories.news') },
    { value: 'event', label: t('news.categories.event') },
    { value: 'announcement', label: t('news.categories.announcement') },
  ];

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>{t('news.title')}</span></div>
          <h1>{t('news.title')}</h1>
          <p>{t('news.label')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button
                key={c.value}
                className={`btn btn-sm ${category === c.value ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => { setCategory(c.value); setPage(1); }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div>
          ) : news.length === 0 ? (
            <div className="empty-state">
              <h3>{t('common.no_results')}</h3>
            </div>
          ) : (
            <>
              <div className="grid-3">
                {news.map((item, i) => (
                  <motion.div
                    key={item.id || i}
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ height: 200, background: 'linear-gradient(135deg, var(--crimson-soft), var(--gold-soft))', position: 'relative', overflow: 'hidden' }}>
                      {item.image && <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      <span className="tag" style={{ position: 'absolute', top: 12, left: 12 }}>{item.category}</span>
                    </div>
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {item.published_at}</span>
                      </div>
                      <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1 }}>{item.excerpt}</p>
                      <Link to={`/news/${item.slug}`} className="btn btn-outline btn-sm" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>
                        {t('news.read_more')} <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
