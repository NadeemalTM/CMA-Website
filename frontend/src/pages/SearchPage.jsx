import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Newspaper,
  FileText,
  Briefcase,
  FolderOpen,
  ArrowRight,
  Loader2,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { getNews, getDocuments, getProjects, getVacancies } from '../services/api';

/* ─────────────────────────────────────────────── helpers */
function highlight(text = '', query = '') {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark style="background:#fff3cd;border-radius:2px;padding:0 2px;">$1</mark>');
}

function matchesQuery(fields, q) {
  const lower = q.toLowerCase();
  return fields.some(f => f && f.toLowerCase().includes(lower));
}

const CATEGORIES = [
  { key: 'all',          label: 'All Results',  icon: Search },
  { key: 'news',         label: 'News & Events', icon: Newspaper },
  { key: 'documents',    label: 'Documents',     icon: FileText },
  { key: 'projects',     label: 'Projects',      icon: FolderOpen },
  { key: 'vacancies',    label: 'Vacancies',     icon: Briefcase },
];

/* ─────────────────────────────────────────────── result cards */
function NewsCard({ item, query }) {
  return (
    <Link to={`/news/${item.slug}`} style={{ textDecoration: 'none' }}>
      <div style={card}>
        <span style={badge('#8B0000')}>News</span>
        <h3
          style={cardTitle}
          dangerouslySetInnerHTML={{ __html: highlight(item.title, query) }}
        />
        {item.excerpt && (
          <p
            style={cardDesc}
            dangerouslySetInnerHTML={{ __html: highlight(item.excerpt?.substring(0, 160), query) }}
          />
        )}
        <span style={readMore}>Read More <ArrowRight size={13} /></span>
      </div>
    </Link>
  );
}

function DocCard({ item, query }) {
  return (
    <a href={item.file_url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div style={card}>
        <span style={badge('#C9A227')}>Document · {item.type}</span>
        <h3
          style={cardTitle}
          dangerouslySetInnerHTML={{ __html: highlight(item.title, query) }}
        />
        {item.description && (
          <p style={cardDesc} dangerouslySetInnerHTML={{ __html: highlight(item.description?.substring(0, 140), query) }} />
        )}
        <span style={readMore}>Download <ArrowRight size={13} /></span>
      </div>
    </a>
  );
}

function ProjectCard({ item, query }) {
  return (
    <div style={{ ...card, cursor: 'default' }}>
      <span style={badge('#1e40af')}>Project</span>
      <h3
        style={cardTitle}
        dangerouslySetInnerHTML={{ __html: highlight(item.title, query) }}
      />
      {item.description && (
        <p style={cardDesc} dangerouslySetInnerHTML={{ __html: highlight(item.description?.substring(0, 160), query) }} />
      )}
      {item.status && <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Status: {item.status}</span>}
    </div>
  );
}

function VacancyCard({ item, query }) {
  return (
    <a
      href={`mailto:info@condominium.lk?subject=Application for ${item.title}`}
      style={{ textDecoration: 'none' }}
    >
      <div style={card}>
        <span style={badge('#166534')}>Vacancy</span>
        <h3
          style={cardTitle}
          dangerouslySetInnerHTML={{ __html: highlight(item.title, query) }}
        />
        {item.description && (
          <p
            style={cardDesc}
            dangerouslySetInnerHTML={{ __html: highlight(item.description?.replace(/<[^>]*>/g, '')?.substring(0, 140), query) }}
          />
        )}
        {item.deadline && <span style={{ fontSize: '0.78rem', color: '#8B0000', fontWeight: 600 }}>Deadline: {item.deadline}</span>}
        <span style={readMore}>Apply Now <ArrowRight size={13} /></span>
      </div>
    </a>
  );
}

/* ─────────────────────────────────────────────── inline styles */
const card = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '1.25rem 1.5rem',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  transition: 'box-shadow 0.2s, border-color 0.2s',
  cursor: 'pointer',
};

const cardTitle = {
  fontSize: '1rem',
  fontWeight: 700,
  color: '#1e293b',
  margin: 0,
  lineHeight: 1.4,
};

const cardDesc = {
  fontSize: '0.875rem',
  color: '#64748b',
  margin: 0,
  lineHeight: 1.6,
};

const readMore = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.82rem',
  fontWeight: 700,
  color: '#8B0000',
  marginTop: '0.25rem',
};

function badge(bg) {
  return {
    display: 'inline-block',
    padding: '0.2rem 0.65rem',
    borderRadius: '999px',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    background: bg + '18',
    color: bg,
    width: 'fit-content',
  };
}

/* ─────────────────────────────────────────────── main component */
export default function SearchPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const [inputValue, setInputValue] = useState(q);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({ news: [], documents: [], projects: [], vacancies: [] });
  const [activeTab, setActiveTab] = useState('all');

  const runSearch = useCallback(async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const [newsRes, docsRes, projRes, vacRes] = await Promise.allSettled([
        getNews({ search: query, per_page: 100 }),
        getDocuments({ search: query }),
        getProjects({ search: query }),
        getVacancies({ search: query }),
      ]);

      const news      = newsRes.status      === 'fulfilled' ? (newsRes.value.data?.data      || []) : [];
      const documents = docsRes.status      === 'fulfilled' ? (docsRes.value.data?.data      || docsRes.value.data || []) : [];
      const projects  = projRes.status      === 'fulfilled' ? (projRes.value.data?.data      || projRes.value.data || []) : [];
      const vacancies = vacRes.status       === 'fulfilled' ? (vacRes.value.data?.data       || vacRes.value.data || []) : [];

      setResults({ news, documents, projects, vacancies });
    } catch (e) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Run search when q changes (from URL)
  useEffect(() => {
    setInputValue(q);
    if (q) runSearch(q);
    document.title = q ? `Search: "${q}" – CMA Sri Lanka` : 'Search – CMA Sri Lanka';
  }, [q]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  const totalCount = results.news.length + results.documents.length + results.projects.length + results.vacancies.length;

  const tabCounts = {
    all:       totalCount,
    news:      results.news.length,
    documents: results.documents.length,
    projects:  results.projects.length,
    vacancies: results.vacancies.length,
  };

  const visibleNews      = activeTab === 'all' || activeTab === 'news'      ? results.news      : [];
  const visibleDocs      = activeTab === 'all' || activeTab === 'documents' ? results.documents : [];
  const visibleProjects  = activeTab === 'all' || activeTab === 'projects'  ? results.projects  : [];
  const visibleVacancies = activeTab === 'all' || activeTab === 'vacancies' ? results.vacancies : [];

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      {/* Hero */}
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '3rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>
            <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a>{' '}
            <span>/</span>{' '}
            <span style={{ color: '#fff' }}>Search</span>
          </div>
          <h1 style={{ color: '#C9A227', fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>
            Search CMA Sri Lanka
          </h1>


        </div>
      </div>

      {/* Results area */}
      <section className="section" style={{ padding: '2.5rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* No query state */}
          {!q && (
            <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#94a3b8' }}>
              <Search size={56} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }} />
              <h2 style={{ fontSize: '1.5rem', color: '#475569', marginBottom: '0.5rem' }}>Start typing to search</h2>
              <p style={{ fontSize: '0.9rem' }}>Search across news, documents, projects, vacancies and more.</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem', gap: '0.75rem', color: '#8B0000' }}>
              <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>Searching…</span>
              <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', color: '#9f1239', marginBottom: '2rem' }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          {/* Results */}
          {q && !loading && !error && (
            <>
              {/* Summary */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>
                  {totalCount > 0
                    ? <><strong style={{ color: '#1e293b' }}>{totalCount}</strong> result{totalCount !== 1 ? 's' : ''} for <strong style={{ color: '#8B0000' }}>"{q}"</strong></>
                    : <>No results found for <strong style={{ color: '#8B0000' }}>"{q}"</strong></>
                  }
                </p>
              </div>

              {/* Category tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {CATEGORIES.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                      border: `2px solid ${activeTab === key ? '#8B0000' : '#e2e8f0'}`,
                      background: activeTab === key ? '#8B0000' : '#fff',
                      color: activeTab === key ? '#fff' : '#64748b',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Icon size={14} />
                    {label}
                    {tabCounts[key] > 0 && (
                      <span style={{ background: activeTab === key ? 'rgba(255,255,255,0.25)' : '#f1f5f9', borderRadius: '999px', padding: '0 6px', fontSize: '0.72rem' }}>
                        {tabCounts[key]}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Empty state */}
              {totalCount === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                  <Search size={56} style={{ margin: '0 auto 1rem', display: 'block', color: '#cbd5e1' }} />
                  <h2 style={{ fontSize: '1.35rem', color: '#475569', marginBottom: '0.5rem' }}>No results found</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Try different keywords or check spelling.</p>
                </div>
              )}

              {/* Result sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {visibleNews.length > 0 && (
                  <ResultSection title="News & Events" icon={Newspaper} color="#8B0000">
                    {visibleNews.map((item, i) => (
                      <motion.div key={item.id || i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <NewsCard item={item} query={q} />
                      </motion.div>
                    ))}
                  </ResultSection>
                )}

                {visibleDocs.length > 0 && (
                  <ResultSection title="Documents & Publications" icon={FileText} color="#C9A227">
                    {visibleDocs.map((item, i) => (
                      <motion.div key={item.id || i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <DocCard item={item} query={q} />
                      </motion.div>
                    ))}
                  </ResultSection>
                )}

                {visibleProjects.length > 0 && (
                  <ResultSection title="Projects" icon={FolderOpen} color="#1e40af">
                    {visibleProjects.map((item, i) => (
                      <motion.div key={item.id || i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <ProjectCard item={item} query={q} />
                      </motion.div>
                    ))}
                  </ResultSection>
                )}

                {visibleVacancies.length > 0 && (
                  <ResultSection title="Vacancies" icon={Briefcase} color="#166534">
                    {visibleVacancies.map((item, i) => (
                      <motion.div key={item.id || i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <VacancyCard item={item} query={q} />
                      </motion.div>
                    ))}
                  </ResultSection>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function ResultSection({ title, icon: Icon, color, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid #f1f5f9' }}>
        <div style={{ width: 34, height: 34, borderRadius: '8px', background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {children}
      </div>
    </div>
  );
}
