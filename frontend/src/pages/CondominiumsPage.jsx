import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Building2, MapPin } from 'lucide-react';
import { getCondominiums } from '../services/api';

export default function CondominiumsPage() {
  const { t } = useTranslation();
  const [condos, setCondos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getCondominiums({ search: search || undefined, page })
      .then(r => {
        setCondos(r.data.data || []);
        setTotal(r.data.total || 0);
        setTotalPages(r.data.last_page || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Condominiums</span></div>
          <h1>Registered Condominiums</h1>
          <p>Search and browse all registered condominium properties in Sri Lanka</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', maxWidth: 600 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-control"
                style={{ paddingLeft: 42 }}
                placeholder="Search by name, registration number, or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>

          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <Building2 size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {total} registered condominiums
          </p>

          {loading ? (
            <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div>
          ) : condos.length === 0 ? (
            <div className="empty-state"><h3>{t('common.no_results')}</h3></div>
          ) : (
            <>
              <div className="card" style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--crimson)', color: 'white', textAlign: 'left' }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Reg. No.</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Name</th>
                      <th style={{ padding: '0.85rem 1rem' }}>District</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Units</th>
                      <th style={{ padding: '0.85rem 1rem' }}>MC Name</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {condos.map((c, i) => (
                      <motion.tr
                        key={c.id || i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        style={{ borderBottom: '1px solid var(--light-gray)' }}
                      >
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--crimson)' }}>{c.registration_no}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{c.name}</td>
                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{c.district || '—'}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{c.unit_count || '—'}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{c.mc_name || '—'}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span className={`badge badge-${c.status === 'registered' ? 'success' : c.status === 'pending' ? 'warning' : 'crimson'}`}>
                            {c.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i + 1} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`} onClick={() => setPage(i + 1)}>
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
