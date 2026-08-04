import { useEffect, useState } from 'react';
import T from '../../components/ui/T';
import { useTranslation } from 'react-i18next';
import { Landmark, Info, Banknote, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getApplicationTariffs } from '../../services/api';

const PageHeroFallback = ({ title }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '4rem 1rem', color: '#fff', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '150%', height: '200%', background: 'radial-gradient(circle, rgba(201,162,39,0.1) 0%, transparent 60%)', transform: 'rotate(-10deg)', pointerEvents: 'none' }} />
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a> <span>/</span> <span style={{ color: '#fff' }}><T>Applications</T></span> <span>/</span> <span>{title}</span>
      </div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: '#C9A227', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Landmark size={36} color="#fff" />
        {title}
      </motion.h1>
    </div>
  </div>
);

export default function RegistrationFees() {
  const { t } = useTranslation();
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Registration Fees & Tariffs – Condominium Management Authority';
    getApplicationTariffs()
      .then(res => setTariffs(res.data.data || []))
      .catch(err => console.error("Failed to load tariffs", err))
      .finally(() => setLoading(false));
  }, []);

  // Group by category, keeping order
  const categories = [];
  const groupedTariffs = {};
  tariffs.forEach(curr => {
    if (!groupedTariffs[curr.category]) {
      groupedTariffs[curr.category] = [];
      categories.push(curr.category);
    }
    groupedTariffs[curr.category].push(curr);
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '80vh', paddingBottom: '4rem' }}>
      <PageHeroFallback title="Registration Fees & Tariffs" />

      <section className="section" style={{ padding: '4rem 1rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: '#fff',
              border: '1px solid rgba(201,162,39,0.3)',
              borderTop: '4px solid var(--crimson)',
              borderRadius: '16px',
              padding: '2.5rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              marginBottom: '3.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
            <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.05 }}>
              <Banknote size={150} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
              <Banknote size={26} color="#C9A227" />
              <span><T>Statutory Fee Structure</T></span>
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, margin: 0, position: 'relative', zIndex: 1 }}><T>
              Fees are levied for structural audits, plan certifications, amendments, and corporate registrations under the Condominium Property Act. All payments must be settled through bank transfer or the online citizen portal:
            </T></p>
          </motion.div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: 'var(--crimson)' }}>
              <Loader2 className="spinner" size={48} />
            </div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {categories.map((category, idx) => (
                <motion.div key={idx} variants={itemVariants} style={{ background: '#fff', border: '1px solid var(--mid-gray)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
                  
                  <div style={{ background: 'linear-gradient(90deg, var(--crimson) 0%, #a81c1c 100%)', padding: '1.25rem 1.5rem', borderBottom: '2px solid var(--mid-gray)' }}>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 8, height: 24, background: 'var(--gold)', borderRadius: 4 }} />
                      {category}
                    </h3>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', textAlign: 'left', minWidth: '800px' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', color: '#1e293b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                          <th style={{ padding: '1rem 1.5rem', borderBottom: '2px solid var(--mid-gray)', width: '8%', textAlign: 'center' }}><T>Item No.</T></th>
                          <th style={{ padding: '1rem 1.5rem', borderBottom: '2px solid var(--mid-gray)', width: '37%' }}><T>Description of Fee / Regulation</T></th>
                          <th style={{ padding: '1rem 1.5rem', borderBottom: '2px solid var(--mid-gray)', width: '18%' }}><T>Category / Scale</T></th>
                          <th style={{ padding: '1rem 1.5rem', borderBottom: '2px solid var(--mid-gray)', width: '15%', textAlign: 'right' }}><T>Prescribed Fee (LKR)</T></th>
                          <th style={{ padding: '1rem 1.5rem', borderBottom: '2px solid var(--mid-gray)', width: '22%' }}><T>Remarks / Additional Conditions</T></th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedTariffs[category].map((item, itemIdx) => (
                          <motion.tr 
                            whileHover={{ backgroundColor: '#fafafa' }}
                            key={itemIdx} style={{ borderBottom: itemIdx === groupedTariffs[category].length - 1 ? 'none' : '1px solid var(--mid-gray)', transition: 'background-color 0.2s' }}>
                            <td style={{ padding: '1.25rem 1.5rem', color: '#64748b', fontWeight: 600, textAlign: 'center' }}>
                              {item.item_no || '-'}
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem', color: '#1f2937', fontWeight: 500 }}>
                              {item.description}
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem', color: '#475569' }}>
                              {item.scale || '-'}
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem', color: 'var(--crimson)', fontWeight: 800, textAlign: 'right', fontSize: '1.05rem' }}>
                              {item.fee_display ? (
                                <span>{item.fee_display}</span>
                              ) : (
                                <span>{Number(item.fee).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                              )}
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                              {item.remarks || '-'}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.25rem', fontSize: '0.85rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '3rem', boxShadow: '0 4px 12px rgba(59,130,246,0.1)' }}>
            <div style={{ background: '#dbeafe', padding: '0.5rem', borderRadius: '50%', color: '#2563eb', flexShrink: 0 }}>
              <Info size={20} />
            </div>
            <span style={{ fontWeight: 500, lineHeight: 1.5 }}><T>Note: Registration fees are non-refundable. Verify structural plan approvals and exact property extents before making transactions.</T></span>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
