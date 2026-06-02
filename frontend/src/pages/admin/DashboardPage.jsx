import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Image, Users, Newspaper, Briefcase, Building2,
  ClipboardList, MessageSquare, Plus, LayoutDashboard, Star,
} from 'lucide-react';
import { getDashboardStats } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// ── Fallback AdminLayout ──────────────────────────────────────────────────────
let AdminLayout;
try {
  AdminLayout = require('../../components/admin/AdminLayout').default;
} catch {
  AdminLayout = ({ children, title }) => (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: '#8B0000', color: '#fff', padding: '1rem 2rem', fontWeight: 700, fontSize: '1.25rem' }}>
        CMA Admin — {title}
      </div>
      <div style={{ padding: '2rem' }}>{children}</div>
    </div>
  );
}

// ── Fallback AdminCard ────────────────────────────────────────────────────────
let AdminCard;
try {
  AdminCard = require('../../components/admin/AdminCard').default;
} catch {
  AdminCard = ({ children, style }) => (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1.5rem', ...style }}>
      {children}
    </div>
  );
}

const STAT_CARDS = [
  { key: 'hero_slides',         label: 'Hero Slides',           Icon: Image,         color: '#6366f1' },
  { key: 'leaders',             label: 'Leaders',               Icon: Users,         color: '#0ea5e9' },
  { key: 'published_news',      label: 'Published News',        Icon: Newspaper,     color: '#10b981' },
  { key: 'active_vacancies',    label: 'Active Vacancies',      Icon: Briefcase,     color: '#f59e0b' },
  { key: 'condominiums',        label: 'Condominiums',          Icon: Building2,     color: '#8b5cf6' },
  { key: 'pending_applications',label: 'Pending Applications',  Icon: ClipboardList, color: '#f97316' },
  { key: 'new_complaints',      label: 'New Complaints',        Icon: MessageSquare, color: '#ef4444' },
  { key: 'feedbacks',           label: 'User Feedbacks',        Icon: Star,          color: '#ec4899' },
  { key: 'staff',               label: 'Staff Members',         Icon: Users,         color: '#14b8a6' },
];

const QUICK_ACTIONS = [
  { label: 'Add News',          to: '/admin/news',         color: '#10b981' },
  { label: 'Add Leader',        to: '/admin/leaders',      color: '#0ea5e9' },
  { label: 'Add Vacancy',       to: '/admin/vacancies',    color: '#f59e0b' },
  { label: 'View Applications', to: '/admin/applications', color: '#8B0000' },
];

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        const d = res.data?.data || res.data || {};
        setStats({
          hero_slides: d.hero_slides,
          leaders: d.leaders,
          published_news: d.news,
          active_vacancies: d.vacancies,
          condominiums: d.condominiums,
          pending_applications: d.applications?.pending ?? 0,
          new_complaints: d.complaints?.new ?? 0,
          feedbacks: d.feedbacks ?? 0,
          staff: d.staff ?? 0,
        });
      })
      .catch(() => setError('Failed to load dashboard statistics.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome */}
      <div
        style={{
          background: 'linear-gradient(135deg, #8B0000, #a50000)',
          borderRadius: 14,
          padding: '1.75rem 2rem',
          color: '#fff',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <LayoutDashboard size={36} style={{ opacity: 0.85 }} />
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </h2>
          <p style={{ margin: '0.25rem 0 0', opacity: 0.85, fontSize: '0.9rem' }}>
            Here's what's happening at CMA Sri Lanka today.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 8, padding: '0.75rem 1rem', color: '#c53030', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {STAT_CARDS.map(({ key, label, Icon, color }) => (
          <AdminCard key={key}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>{label}</p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '2rem', fontWeight: 700, color: '#111827', lineHeight: 1 }}>
                  {loading ? '—' : (stats[key] ?? 0)}
                </p>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${color}1a`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={24} color={color} />
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* Quick Actions */}
      <AdminCard>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, color: '#374151' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {QUICK_ACTIONS.map(({ label, to, color }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1.2rem',
                background: color,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              {label}
            </button>
          ))}
        </div>
      </AdminCard>
    </AdminLayout>
  );
}
