import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit, Trash2 } from 'lucide-react';

/**
 * DataTable — reusable admin table
 *
 * Props:
 *   columns      {Array<{ key: string, label: string, render?: (value, row) => ReactNode }>}
 *   data         {Array<object>}
 *   onEdit       {(row) => void}
 *   onDelete     {(row) => void}
 *   loading      {boolean}
 *   emptyMessage {string}
 */
export default function DataTable({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = 'No records found.',
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      columns.some(({ key }) => {
        const val = row[key];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, columns, query]);

  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--mid-gray)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Search bar */}
      <div style={{
        padding: '0.875rem 1rem',
        borderBottom: '1px solid var(--mid-gray)',
        display: 'flex', alignItems: 'center', gap: '0.6rem',
      }}>
        <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: '0.9rem', color: 'var(--text-body)',
            background: 'transparent',
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              fontSize: '0.75rem', color: 'var(--text-muted)',
              padding: '0.15rem 0.5rem',
              borderRadius: 4,
              background: 'var(--light-gray)',
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Table wrapper */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem',
        }}>
          <thead>
            <tr style={{ background: 'var(--light-gray)' }}>
              {columns.map(({ key, label }) => (
                <th
                  key={key}
                  style={{
                    padding: '0.65rem 1rem',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th style={{
                  padding: '0.65rem 1rem',
                  textAlign: 'right',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  whiteSpace: 'nowrap',
                }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence mode="wait">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    style={{ padding: '3rem', textAlign: 'center' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div className="spinner" />
                    </div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      Loading…
                    </p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    style={{ padding: '3.5rem 1rem', textAlign: 'center' }}
                  >
                    <div className="empty-state" style={{ padding: 0 }}>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                        {query ? `No results for "${query}"` : emptyMessage}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <motion.tr
                    key={row.id ?? i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                    style={{
                      borderBottom: '1px solid var(--light-gray)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--off-white)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {columns.map(({ key, render }) => (
                      <td key={key} style={{ padding: '0.75rem 1rem', color: 'var(--text-body)', verticalAlign: 'middle' }}>
                        {render ? render(row[key], row) : (row[key] ?? '—')}
                      </td>
                    ))}

                    {(onEdit || onDelete) && (
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              title="Edit"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.35rem 0.7rem',
                                borderRadius: 6,
                                fontSize: '0.78rem', fontWeight: 600,
                                color: 'var(--crimson)',
                                background: 'var(--crimson-soft)',
                                border: '1.5px solid rgba(139,0,0,0.2)',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = 'var(--crimson)';
                                e.currentTarget.style.color = '#fff';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = 'var(--crimson-soft)';
                                e.currentTarget.style.color = 'var(--crimson)';
                              }}
                            >
                              <Edit size={13} />
                              Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              title="Delete"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.35rem 0.7rem',
                                borderRadius: 6,
                                fontSize: '0.78rem', fontWeight: 600,
                                color: 'var(--error)',
                                background: 'transparent',
                                border: '1.5px solid rgba(220,38,38,0.4)',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(220,38,38,0.08)';
                                e.currentTarget.style.borderColor = 'var(--error)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)';
                              }}
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Footer: row count */}
      {!loading && filtered.length > 0 && (
        <div style={{
          padding: '0.6rem 1rem',
          borderTop: '1px solid var(--mid-gray)',
          fontSize: '0.78rem', color: 'var(--text-muted)',
          textAlign: 'right',
        }}>
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          {query && data.length !== filtered.length && ` of ${data.length}`}
        </div>
      )}
    </div>
  );
}
