import { useEffect, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  History,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { adminGetActivityLogs } from '../../services/api';

const EMPTY_FILTERS = {
  search: '',
  module: '',
  action: '',
  actor_type: '',
  user_id: '',
  result: '',
  date_from: '',
  date_to: '',
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.58rem 0.7rem',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  background: '#fff',
  color: '#111827',
  fontSize: '0.82rem',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.3rem',
  color: '#4b5563',
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const humanize = (value) => (value || '—')
  .replaceAll('_', ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export default function HistoryAdminPage() {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });
  const [options, setOptions] = useState({ modules: [], actions: [], actor_types: [], actors: [] });
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = Object.fromEntries(
        Object.entries({ ...filters, page }).filter(([, value]) => value !== '' && value !== null)
      );
      const response = await adminGetActivityLogs(params);
      setLogs(response.data?.data || []);
      setMeta(response.data?.meta || { current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });
      setOptions(response.data?.filters || { modules: [], actions: [], actor_types: [], actors: [] });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to load history records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters, page]);

  const applyFilters = (event) => {
    event.preventDefault();
    setPage(1);
    setFilters({ ...draft });
  };

  const resetFilters = () => {
    setDraft(EMPTY_FILTERS);
    setPage(1);
    setFilters(EMPTY_FILTERS);
  };

  const setField = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  return (
    <div className="admin-page-content" style={{ padding: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ color: '#8B0000', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>System Accountability</span>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', margin: '0.3rem 0 0', color: '#111827', fontSize: '1.45rem' }}>
            <History size={23} color="#8B0000" /> Activity History
          </h2>
          <p style={{ margin: '0.3rem 0 0', color: '#6b7280', fontSize: '0.84rem' }}>
            Search and review website, citizen and administrator actions. Audit records are read-only.
          </p>
        </div>
        <button type="button" onClick={load} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.58rem 0.9rem', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff', color: '#374151', cursor: 'pointer', fontWeight: 650 }}>
          <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      <form onSubmit={applyFilters} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem', color: '#374151', fontWeight: 750, fontSize: '0.88rem' }}>
          <Filter size={16} color="#8B0000" /> Search & Filters
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '0.75rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle} htmlFor="history-search">Search</label>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: '#9ca3af' }} />
              <input id="history-search" style={{ ...inputStyle, paddingLeft: '2rem' }} value={draft.search} onChange={(event) => setField('search', event.target.value)} placeholder="Actor, email, action, reference, IP…" />
            </div>
          </div>

          <div>
            <label style={labelStyle} htmlFor="history-module">Module</label>
            <select id="history-module" style={inputStyle} value={draft.module} onChange={(event) => setField('module', event.target.value)}>
              <option value="">All modules</option>
              {options.modules.map((module) => <option key={module} value={module}>{humanize(module)}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle} htmlFor="history-action">Action</label>
            <select id="history-action" style={inputStyle} value={draft.action} onChange={(event) => setField('action', event.target.value)}>
              <option value="">All actions</option>
              {options.actions.map((action) => <option key={action} value={action}>{humanize(action)}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle} htmlFor="history-actor">Account</label>
            <select id="history-actor" style={inputStyle} value={draft.user_id} onChange={(event) => setField('user_id', event.target.value)}>
              <option value="">All accounts</option>
              {options.actors.map((actor) => (
                <option key={`${actor.user_id}-${actor.actor_email}`} value={actor.user_id}>
                  {actor.actor_name || actor.actor_email} ({actor.actor_email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle} htmlFor="history-actor-type">Actor Type</label>
            <select id="history-actor-type" style={inputStyle} value={draft.actor_type} onChange={(event) => setField('actor_type', event.target.value)}>
              <option value="">All actor types</option>
              {options.actor_types.map((type) => <option key={type} value={type}>{humanize(type)}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle} htmlFor="history-result">Result</label>
            <select id="history-result" style={inputStyle} value={draft.result} onChange={(event) => setField('result', event.target.value)}>
              <option value="">All results</option>
              <option value="success">Successful</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label style={labelStyle} htmlFor="history-from">From Date</label>
            <input id="history-from" type="date" style={inputStyle} value={draft.date_from} onChange={(event) => setField('date_from', event.target.value)} />
          </div>

          <div>
            <label style={labelStyle} htmlFor="history-to">To Date</label>
            <input id="history-to" type="date" style={inputStyle} value={draft.date_to} min={draft.date_from || undefined} onChange={(event) => setField('date_to', event.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.55rem', marginTop: '0.9rem' }}>
          <button type="button" onClick={resetFilters} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.55rem 0.85rem', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff', color: '#4b5563', cursor: 'pointer', fontWeight: 650 }}>
            <RotateCcw size={14} /> Reset
          </button>
          <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.55rem 1rem', border: 'none', borderRadius: 8, background: '#8B0000', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
            <Search size={14} /> Apply Filters
          </button>
        </div>
      </form>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', color: '#6b7280', fontSize: '0.78rem' }}>
          <span>{meta.total ? `Showing ${meta.from}–${meta.to} of ${meta.total} records` : 'No records'}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><ShieldCheck size={14} color="#16803d" /> Sensitive credentials are excluded</span>
        </div>

        {error ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#b91c1c' }}>{error}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 1050, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {['Date & Time', 'Actor', 'Action', 'Module', 'Activity', 'Result', 'IP Address', 'Details'].map((heading) => (
                    <th key={heading} style={{ padding: '0.72rem 0.8rem', textAlign: 'left', color: '#6b7280', fontSize: '0.7rem', fontWeight: 750, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>Loading history…</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>No activity matches the selected filters.</td></tr>
                ) : logs.map((log, index) => {
                  const success = Number(log.status_code) < 400;
                  return (
                    <tr key={log.id} style={{ borderBottom: '1px solid #f3f4f6', background: index % 2 ? '#fcfcfc' : '#fff', verticalAlign: 'top' }}>
                      <td style={{ padding: '0.8rem', color: '#4b5563', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}><CalendarDays size={13} /> {formatDate(log.created_at)}</span>
                      </td>
                      <td style={{ padding: '0.8rem', fontSize: '0.76rem', minWidth: 155 }}>
                        <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'flex-start' }}>
                          <UserRound size={14} color="#6b7280" style={{ marginTop: 2, flexShrink: 0 }} />
                          <div>
                            <div style={{ color: '#111827', fontWeight: 700 }}>{log.actor_name || humanize(log.actor_type)}</div>
                            <div style={{ color: '#6b7280', marginTop: 2 }}>{log.actor_email || 'No authenticated account'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.8rem' }}>
                        <span style={{ display: 'inline-block', padding: '0.22rem 0.55rem', borderRadius: 999, background: '#eef2ff', color: '#3730a3', fontSize: '0.7rem', fontWeight: 750, whiteSpace: 'nowrap' }}>{humanize(log.action)}</span>
                      </td>
                      <td style={{ padding: '0.8rem', color: '#374151', fontSize: '0.76rem', fontWeight: 650, whiteSpace: 'nowrap' }}>{humanize(log.module)}</td>
                      <td style={{ padding: '0.8rem', color: '#374151', fontSize: '0.76rem', minWidth: 200 }}>
                        <div>{log.description}</div>
                        <div style={{ marginTop: 3, color: '#9ca3af', fontFamily: 'monospace', fontSize: '0.68rem' }}>{log.method} /{log.path}</div>
                      </td>
                      <td style={{ padding: '0.8rem' }}>
                        <span style={{ display: 'inline-block', padding: '0.22rem 0.52rem', borderRadius: 999, background: success ? '#dcfce7' : '#fee2e2', color: success ? '#166534' : '#991b1b', fontSize: '0.7rem', fontWeight: 750, whiteSpace: 'nowrap' }}>
                          {success ? 'Success' : 'Failed'} · {log.status_code}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem', color: '#6b7280', fontFamily: 'monospace', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{log.ip_address || '—'}</td>
                      <td style={{ padding: '0.8rem', fontSize: '0.74rem' }}>
                        {log.metadata && Object.keys(log.metadata).length ? (
                          <details>
                            <summary style={{ cursor: 'pointer', color: '#8B0000', fontWeight: 700, whiteSpace: 'nowrap' }}>View details</summary>
                            <pre style={{ width: 280, maxHeight: 180, overflow: 'auto', margin: '0.5rem 0 0', padding: '0.65rem', borderRadius: 7, background: '#111827', color: '#e5e7eb', fontSize: '0.66rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(log.metadata, null, 2)}</pre>
                          </details>
                        ) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.78rem' }}>
          <span>Page {meta.current_page || 1} of {meta.last_page || 1}</span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button type="button" disabled={loading || page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.45rem 0.65rem', border: '1px solid #d1d5db', borderRadius: 7, background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}><ChevronLeft size={14} /> Previous</button>
            <button type="button" disabled={loading || page >= meta.last_page} onClick={() => setPage((current) => Math.min(meta.last_page, current + 1))} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.45rem 0.65rem', border: '1px solid #d1d5db', borderRadius: 7, background: '#fff', cursor: page >= meta.last_page ? 'not-allowed' : 'pointer', opacity: page >= meta.last_page ? 0.5 : 1 }}>Next <ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
