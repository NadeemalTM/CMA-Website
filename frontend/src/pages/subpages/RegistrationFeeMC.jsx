import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Banknote, Info, Landmark, ChevronRight, Calculator, FileText, ArrowRight } from 'lucide-react';
import { getMcFees } from '../../services/api';
import registrationImg from '../../assets/mc_registration_fees_illustration.png';

/* ─── Page Hero ─────────────────────────────────────────────────────── */
const PageHero = ({ title, label }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0d0000 0%, #3a0000 45%, #7a1a00 100%)',
    padding: '4rem 1rem 5rem',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'400px', height:'400px',
      borderRadius:'50%', border:'1px solid rgba(201,162,39,0.12)', pointerEvents:'none' }} />
    <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'280px', height:'280px',
      borderRadius:'50%', border:'1px solid rgba(201,162,39,0.18)', pointerEvents:'none' }} />
    <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'300px', height:'300px',
      borderRadius:'50%', border:'1px solid rgba(255,255,255,0.05)', pointerEvents:'none' }} />

    <div className="container" style={{ maxWidth:'1200px', margin:'0 auto', position:'relative', zIndex:1 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.82rem',
        color:'rgba(255,255,255,0.6)', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        <Link to="/" style={{ color:'#C9A227', textDecoration:'none' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/management-corps" style={{ color:'rgba(255,255,255,0.7)', textDecoration:'none' }}>
          Management Corps
        </Link>
        <ChevronRight size={14} />
        <span style={{ color:'#fff' }}>{label}</span>
      </div>

      <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem',
        background:'rgba(201,162,39,0.15)', border:'1px solid rgba(201,162,39,0.35)',
        borderRadius:'999px', padding:'0.3rem 1rem', marginBottom:'1rem' }}>
        <Banknote size={13} color="#C9A227" />
        <span style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'1.5px',
          textTransform:'uppercase', color:'#C9A227' }}>Financial Requirements</span>
      </div>

      <motion.h1
        initial={{ opacity:0, y:24 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.6 }}
        style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, color:'#fff',
          lineHeight:1.15, margin:'0 0 1rem', maxWidth:'700px' }}
      >
        {title}
      </motion.h1>
    </div>
  </div>
);

export default function RegistrationFeeMC() {
  const { t, i18n } = useTranslation();
  const [fees, setFees] = useState([]);
  const [settings, setSettings] = useState({
    tax1_name: 'NBT',
    tax1_rate: 2.00,
    tax2_name: 'VAT',
    tax2_rate: 12.00
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Registration Fee of Management Corporations – Condominium Management Authority';
    
    getMcFees()
      .then(r => {
        setFees(r.data.data || []);
        if (r.data.settings) {
          setSettings(r.data.settings);
        }
      })
      .catch(err => {
        console.error('Error fetching MC fees:', err);
        setError('Failed to load MC registration fees. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const currentLang = i18n.language || 'en';
  
  const getDescription = (item) => {
    if (currentLang === 'si') return item.description_si || item.description_en;
    if (currentLang === 'ta') return item.description_ta || item.description_en;
    return item.description_en;
  };

  const appFees = fees.filter(f => f.category === 'application');
  const regFees = fees.filter(f => f.category === 'registration');

  const containerAnim = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemAnim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  return (
    <div style={{ background: '#f7f6f4', minHeight: '80vh' }}>
      <PageHero 
        title={t('admin.mc_fees') || 'Registration Fee of Management Corporations'} 
        label={t('admin.mc_fees') || 'Registration Fees'} 
      />

      {/* ── Intro Section with Image ──────────────────────────────── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '3.5rem 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(201,162,39,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Landmark size={20} color="#C9A227" />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#1f2937' }}>
                  {t('mc_fees_page.reg_title') || 'Registration Fees (Statutory)'}
                </h2>
              </div>
              <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 0 1.5rem' }}>
                {t('mc_fees_info', 'Every Management Corporation (MC) established under the Condominium Property Act must register formally with the Condominium Management Authority (CMA) and pay the prescribed statutory registration fees.')}
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#16a34a', fontWeight: 600, background: '#f0fdf4', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <FileText size={16} /> Transparent Pricing
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#2563eb', fontWeight: 600, background: '#eff6ff', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <Calculator size={16} /> Automated Calculation
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              style={{ display: 'none' }} // Hidden on small screens, overriden by media query style below conceptually, but inline styles don't support MQ well. Using a wrapper div.
            >
              <div className="fee-illustration-wrapper" style={{ width: '350px', height: '350px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}>
                <img src={registrationImg} alt="Registration Fees Illustration" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </motion.div>
            <style dangerouslySetInnerHTML={{__html: `
              @media (max-width: 768px) {
                .fee-illustration-wrapper { display: none !important; }
              }
            `}} />
          </div>
        </div>
      </section>

      {/* ── Fees Tables ───────────────────────────────────────────── */}
      <section style={{ padding: '4rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(201,162,39,0.3)', borderTopColor: '#C9A227', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : error ? (
            <div style={{ padding: '2rem', background: '#fee2e2', color: '#991b1b', borderRadius: '12px', border: '1px solid #fca5a5', textAlign: 'center', fontWeight: 600 }}>
              {error}
            </div>
          ) : (
            <motion.div variants={containerAnim} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              
              {/* Table 1: Application Form Fees */}
              {appFees.length > 0 && (
                <motion.div variants={itemAnim}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1f2937', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '4px', height: '24px', background: '#C9A227', borderRadius: '4px' }} />
                    {t('mc_fees_page.app_title') || 'Application Form Fee'}
                  </h3>
                  <div style={{ background: '#fff', border: '1px solid #edf2f7', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', textAlign: 'left', minWidth: '600px' }}>
                        <thead>
                          <tr style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)', borderBottom: '2px solid #e2e8f0', color: '#334155', fontWeight: 700 }}>
                            <th style={{ padding: '1.25rem' }}>{t('mc_fees_page.desc_col') || 'Description'}</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right' }}>{t('mc_fees_page.fee_col') || 'Fee (Rs.)'}</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right' }}>{settings.tax1_name} ({parseFloat(settings.tax1_rate)}%)</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right' }}>{settings.tax2_name} ({parseFloat(settings.tax2_rate)}%)</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right', color: '#0f172a' }}>{t('mc_fees_page.total_col') || 'Total (Rs.)'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appFees.map((feeItem, idx) => (
                            <motion.tr 
                              key={feeItem.id} 
                              style={{ borderBottom: idx === appFees.length - 1 ? 'none' : '1px solid #edf2f7', transition: 'background 0.2s' }}
                              whileHover={{ backgroundColor: '#f8fafc' }}
                            >
                              <td style={{ padding: '1.25rem', color: '#1e293b', fontWeight: 600 }}>
                                {getDescription(feeItem)}
                              </td>
                              <td style={{ padding: '1.25rem', color: '#475569', textAlign: 'right', fontFamily: 'monospace', fontSize: '1rem' }}>
                                {parseFloat(feeItem.fee).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: '1.25rem', color: '#64748b', textAlign: 'right', fontFamily: 'monospace', fontSize: '1rem' }}>
                                {parseFloat(feeItem.nbt).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: '1.25rem', color: '#64748b', textAlign: 'right', fontFamily: 'monospace', fontSize: '1rem' }}>
                                {parseFloat(feeItem.vat).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: '1.25rem', color: 'var(--crimson)', fontWeight: 800, textAlign: 'right', fontFamily: 'monospace', fontSize: '1.05rem', background: 'rgba(139,0,0,0.02)' }}>
                                {parseFloat(feeItem.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Table 2: Registration Fee Tiers */}
              {regFees.length > 0 && (
                <motion.div variants={itemAnim}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1f2937', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '4px', height: '24px', background: '#C9A227', borderRadius: '4px' }} />
                    {t('mc_fees_page.reg_title') || 'Registration Fees (Statutory)'}
                  </h3>
                  <div style={{ background: '#fff', border: '1px solid #edf2f7', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', textAlign: 'left', minWidth: '600px' }}>
                        <thead>
                          <tr style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)', borderBottom: '2px solid #e2e8f0', color: '#334155', fontWeight: 700 }}>
                            <th style={{ padding: '1.25rem' }}>{t('mc_fees_page.desc_col') || 'Description'}</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right' }}>{t('mc_fees_page.fee_col') || 'Fee (Rs.)'}</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right' }}>{settings.tax1_name} ({parseFloat(settings.tax1_rate)}%)</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right' }}>{settings.tax2_name} ({parseFloat(settings.tax2_rate)}%)</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right', color: '#0f172a' }}>{t('mc_fees_page.total_col') || 'Total (Rs.)'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {regFees.map((feeItem, idx) => (
                            <motion.tr 
                              key={feeItem.id} 
                              style={{ borderBottom: idx === regFees.length - 1 ? 'none' : '1px solid #edf2f7', transition: 'background 0.2s' }}
                              whileHover={{ backgroundColor: '#f8fafc' }}
                            >
                              <td style={{ padding: '1.25rem', color: '#1e293b', fontWeight: 600 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A227' }} />
                                  {getDescription(feeItem)}
                                </div>
                              </td>
                              <td style={{ padding: '1.25rem', color: '#475569', textAlign: 'right', fontFamily: 'monospace', fontSize: '1rem' }}>
                                {parseFloat(feeItem.fee).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: '1.25rem', color: '#64748b', textAlign: 'right', fontFamily: 'monospace', fontSize: '1rem' }}>
                                {parseFloat(feeItem.nbt).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: '1.25rem', color: '#64748b', textAlign: 'right', fontFamily: 'monospace', fontSize: '1rem' }}>
                                {parseFloat(feeItem.vat).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td style={{ padding: '1.25rem', color: 'var(--crimson)', fontWeight: 800, textAlign: 'right', fontFamily: 'monospace', fontSize: '1.05rem', background: 'rgba(139,0,0,0.02)' }}>
                                {parseFloat(feeItem.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}

          {/* ── Info footer ─────────────────────────────────────────── */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginTop: '3rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', boxShadow: '0 4px 12px rgba(37,99,235,0.05)' }}
          >
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Info size={20} color="#2563eb" />
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.25rem', color: '#1e3a8a', fontSize: '1rem', fontWeight: 700 }}>Important Note</h4>
              <p style={{ margin: 0, color: '#1e3a8a', fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.85 }}>
                {t('mc_fees_note', 'Fees are statutory and non-refundable. Official bank deposit slips must be attached to the registration application when submitting to the CMA.')}
              </p>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}

