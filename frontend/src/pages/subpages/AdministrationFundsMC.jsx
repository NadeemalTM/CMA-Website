import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Landmark, ShieldAlert, CheckCircle, Wallet, FileSpreadsheet } from 'lucide-react';
import T from '../../components/ui/T';

const PageHeroFallback = ({ title }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '3.5rem 1rem', color: '#fff' }}>
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}><T>Home</T></a> <span>/</span> <span style={{ color: '#fff' }}><T>Management Corps</T></span> <span>/</span> <span>{title}</span>
      </div>
      <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#C9A227' }}>{title}</h1>
    </div>
  </div>
);

export default function AdministrationFundsMC() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Administration & Funds – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title={<T>Administration & Funds</T>} />

      <section className="section" style={{ padding: '4rem 1rem' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{
            background: '#fff',
            border: '1.5px solid var(--mid-gray)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '2.5rem'
          }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Landmark size={22} />
              <span><T>Administration of the Management Corporation</T></span>
            </h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              <T>Under the Condominium Property Act, every Management Corporation (MC) has a statutory duty to establish administrative procedures and manage designated financial accounts. This ensures transparency, operational sustainability, and long-term asset value protection for all unit owners.</T>
            </p>
          </div>

          {/* Core Funds Section */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1f2937', marginBottom: '1rem' }}><T>Mandatory Funds to be Established</T></h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ background: '#fff', border: '1px solid #edf2f7', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--crimson)' }}>
                <Wallet size={20} />
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}><T>Management Fund (Maintenance Fund)</T></h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                <T>Established to meet regular, recurrent operational expenses of the condominium. Contributions are determined by the share value of each unit and collected monthly.</T>
              </p>
              <ul style={{ margin: '0.75rem 0 0 1.25rem', padding: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.6 }}>
                <li><T>Payment of utility bills for common areas</T></li>
                <li><T>Salaries of security guards, cleaners, and operators</T></li>
                <li><T>Routine servicing of lifts, pumps, and generators</T></li>
                <li><T>Premium payments for fire and hazard insurance</T></li>
              </ul>
            </div>

            <div style={{ background: '#fff', border: '1px solid #edf2f7', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#C9A227' }}>
                <ShieldAlert size={20} />
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}><T>Sinking Fund</T></h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                <T>Established to build capital reserves for future major repairs and asset renewals. It prevents sudden financial shocks on unit owners for capital improvement projects.</T>
              </p>
              <ul style={{ margin: '0.75rem 0 0 1.25rem', padding: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.6 }}>
                <li><T>Repainting of the condominium exterior walls</T></li>
                <li><T>Complete modernization or replacement of elevators</T></li>
                <li><T>Major structural repair or waterproofing works</T></li>
                <li><T>Upgrading fire combat systems and structural renovations</T></li>
              </ul>
            </div>
          </div>

          {/* Bookkeeping & Auditing */}
          <div style={{ background: '#fff', border: '1px solid #edf2f7', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(139,0,0,0.06)', color: 'var(--crimson)', display: 'flex', alignItems: 'center', justifycontent: 'center', flexShrink: 0, paddingLeft: '9px', paddingTop: '9px' }}>
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 700, color: '#1f2937' }}>
                <T>Accounting, Record Keeping & Annual Audit</T>
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                <T>The Council of the Management Corporation must maintain proper books of accounts, issue receipt books, and record all expenses. At the end of every financial year, accounts must be audited by a certified auditor and presented to the general body at the AGM, with copies submitted to the Condominium Management Authority (CMA).</T>
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
