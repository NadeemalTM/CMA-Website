import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Landmark, Info, Banknote } from 'lucide-react';

const PageHeroFallback = ({ title }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '3.5rem 1rem', color: '#fff' }}>
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a> <span>/</span> <span style={{ color: '#fff' }}>Applications</span> <span>/</span> <span>{title}</span>
      </div>
      <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#C9A227' }}>{title}</h1>
    </div>
  </div>
);

const FEES = [
  { item: 'Condominium Plan Registration (Under 5 Units)', fee: 'LKR 15,000.00' },
  { item: 'Condominium Plan Registration (5 to 20 Units)', fee: 'LKR 25,000.00' },
  { item: 'Condominium Plan Registration (More than 20 Units)', fee: 'LKR 25,000.00 + LKR 500 per additional unit' },
  { item: 'Amendment of a Registered Condominium Plan', fee: 'LKR 20,000.00' },
  { item: 'Management Corporation (MC) Registration', fee: 'LKR 10,000.00' },
  { item: 'Structural Stability Certificate Auditing Fee', fee: 'LKR 15,000.00' }
];

export default function RegistrationFees() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Registration Fees – Condominium Management Authority';
  }, []);

  return (
    <div style={{ background: '#fcfbf9', minHeight: '80vh' }}>
      <PageHeroFallback title="Registration Fees & Tariffs" />

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
              <Banknote size={22} />
              <span>Statutory Fee Structure</span>
            </h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Fees are levied for structural audits, plan certifications, amendments, and corporate registrations under the Condominium Property Act. All payments must be settled through bank transfer or the online citizen portal:
            </p>
          </div>

          {/* Fees Table */}
          <div style={{ background: '#fff', border: '1px solid #edf2f7', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #edf2f7', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '1rem' }}>Application / Service Description</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Statutory Fee (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {FEES.map((feeItem, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '1rem', color: '#1f2937', fontWeight: 600 }}>{feeItem.item}</td>
                    <td style={{ padding: '1rem', color: 'var(--crimson)', fontWeight: 700, textAlign: 'right' }}>{feeItem.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem', fontSize: '0.82rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>Note: Registration fees are non-refundable. Verify structural plan approvals before making transactions.</span>
          </div>

        </div>
      </section>
    </div>
  );
}
