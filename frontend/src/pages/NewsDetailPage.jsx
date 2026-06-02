import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { getNewsItem } from '../services/api';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsItem(slug)
      .then(r => setArticle(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  if (!article) return <div className="flex-center" style={{ minHeight: '60vh' }}><h2>{t('common.no_results')}</h2></div>;

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <Link to="/news">{t('news.title')}</Link> <span>/</span> <span>{article.title}</span>
          </div>
          <h1>{article.title}</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem', opacity: 0.8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={16} /> {article.published_at}</span>
            <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>{article.category}</span>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          {article.image && (
            <img src={article.image} alt={article.title} style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }} />
          )}
          <div
            className="article-content"
            style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-body)' }}
            dangerouslySetInnerHTML={{ __html: article.body || '<p>Full article content will be displayed here.</p>' }}
          />
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--mid-gray)', paddingTop: '2rem' }}>
            <Link to="/news" className="btn btn-outline"><ArrowLeft size={16} /> {t('common.back')} to {t('news.title')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
