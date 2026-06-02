import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Mail, Phone, Briefcase } from 'lucide-react';
import { getStaff } from '../../services/api';

const PageHeroFallback = ({ title }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '3.5rem 1rem', color: '#fff' }}>
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a> <span>/</span> <span style={{ color: '#fff' }}>About Us</span> <span>/</span> <span>{title}</span>
      </div>
      <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#C9A227' }}>{title}</h1>
    </div>
  </div>
);

export default function StaffMembers() {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Staff Directory – Condominium Management Authority';

    getStaff()
      .then(res => {
        const staffList = res.data?.data || res.data || [];
        
        // Group staff dynamically by localized department name
        const groups = {};
        staffList.forEach(member => {
          const dept = member.department || t('staff.other_dept', 'Other Divisions');
          if (!groups[dept]) {
            groups[dept] = [];
          }
          groups[dept].push(member);
        });

        const formattedDepts = Object.entries(groups).map(([name, roles]) => ({
          name,
          roles: roles.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        }));

        setDepartments(formattedDepts);
      })
      .catch(() => {
        setError(t('staff.load_failed', 'Failed to load organizational directory. Please try again later.'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [t]);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title={t('nav.staff', 'CMA Staff Members')} />

      <section className="section" style={{ padding: '4rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{
            background: '#fff',
            border: '1.5px solid var(--mid-gray)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ width: 50, height: 50, borderRadius: '10px', background: 'rgba(139,0,0,0.06)', color: 'var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--crimson)', margin: 0 }}>
                {t('staff.dir_title', 'Organizational Directory')}
              </h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: '#666' }}>
                {t('staff.dir_desc', 'Contact details and roles of various divisions of the Condominium Management Authority.')}
              </p>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div className="spinner" />
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{t('common.loading', 'Loading Directory...')}</p>
            </div>
          ) : error ? (
            <div style={{ background: '#fff5f5', border: '1.5px solid #fed7d7', color: '#c53030', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
              {error}
            </div>
          ) : departments.length === 0 ? (
            <div style={{ background: '#fff', border: '1.5px solid var(--mid-gray)', padding: '3rem', borderRadius: '16px', textAlign: 'center', color: '#666' }}>
              {t('staff.empty', 'No staff members currently registered in the directory.')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {departments.map((dept, idx) => (
                <div key={idx}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1f2937', borderLeft: '4px solid var(--gold)', paddingLeft: '0.75rem', marginBottom: '1.25rem' }}>
                    {dept.name}
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {dept.roles.map((staff, sIdx) => (
                      <div
                        key={sIdx}
                        style={{
                          background: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '1.25rem',
                          boxShadow: 'var(--shadow-sm)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '0.75rem'
                        }}
                      >
                        <div>
                          <h4 style={{ margin: '0 0 0.15rem', fontSize: '0.98rem', fontWeight: 700, color: 'var(--crimson)' }}>
                            {staff.name}
                          </h4>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                            <Briefcase size={12} />
                            <span>{staff.title}</span>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                          {staff.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Phone size={12} color="#94a3b8" />
                              <span>{staff.phone}</span>
                            </div>
                          )}
                          {staff.email && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Mail size={12} color="#94a3b8" />
                              <span style={{ color: 'var(--crimson)', fontWeight: 500 }}>{staff.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
