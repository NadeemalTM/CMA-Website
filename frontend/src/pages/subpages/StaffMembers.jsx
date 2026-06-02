import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Mail, Phone, Briefcase } from 'lucide-react';

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

const DEPARTMENTS = [
  {
    name: 'Administrative & HR Department',
    roles: [
      { name: 'Mr. Pradeep Perera', title: 'Director General', phone: '011-2338146 (Ext: 101)', email: 'dg@condominium.lk' },
      { name: 'Mrs. Sandya De Silva', title: 'Assistant Director - HR', phone: '011-2338146 (Ext: 102)', email: 'hr@condominium.lk' }
    ]
  },
  {
    name: 'Engineering & Structural Inspections',
    roles: [
      { name: 'Eng. Rohan Wijetunga', title: 'Director - Engineering Services', phone: '011-2338146 (Ext: 201)', email: 'engineering@condominium.lk' },
      { name: 'Eng. Amal Alwis', title: 'Senior Structural Engineer', phone: '011-2338146 (Ext: 202)', email: 'inspections@condominium.lk' }
    ]
  },
  {
    name: 'Legal & Dispute Resolution Department',
    roles: [
      { name: 'Mrs. Kanchana Jayasekara', title: 'Director - Legal Affairs / Attorney-at-Law', phone: '011-2338146 (Ext: 301)', email: 'legal@condominium.lk' },
      { name: 'Ms. Nelum Fernando', title: 'Legal Officer / Attorney-at-Law', phone: '011-2338146 (Ext: 302)', email: 'disputes@condominium.lk' }
    ]
  },
  {
    name: 'Finance & Accounts Division',
    roles: [
      { name: 'Mr. Nimal Herath', title: 'Director - Finance', phone: '011-2338146 (Ext: 401)', email: 'finance@condominium.lk' },
      { name: 'Mrs. Inoka Jayasinghe', title: 'Chief Accountant', phone: '011-2338146 (Ext: 402)', email: 'accounts@condominium.lk' }
    ]
  }
];

export default function StaffMembers() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Staff Directory – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="CMA Staff Members" />

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
                Organizational Directory
              </h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: '#666' }}>
                Contact details and roles of various divisions of the Condominium Management Authority.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {DEPARTMENTS.map((dept, idx) => (
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Phone size={12} color="#94a3b8" />
                          <span>{staff.phone}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Mail size={12} color="#94a3b8" />
                          <span style={{ color: 'var(--crimson)', fontWeight: 500 }}>{staff.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
