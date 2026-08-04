import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import T from '../../components/ui/T';
import PageHero from '../../components/ui/PageHero';

const POWERS = [
  { letter: 'A', text: 'Acquire by way of acquisition, vesting, grant or purchasing, or to receive by way of gift or otherwise any immovable or movable property and to hold, manage, sell, surrender, exchange, lease or otherwise dispose of such property.' },
  { letter: 'B', text: 'Receive donations and bequests from any source whether local or foreign.' },
  { letter: 'C', text: 'Borrow moneys required by it for the discharge of the functions.' },
  { letter: 'D', text: 'Charge rent for any land parcel or buildings or Condominium Property let by the Authority.' },
  { letter: 'E', text: 'Levy fees or charges, for any services rendered by the Authority under this Law or any other written law.' },
  { letter: 'F', text: 'Recover any premia from owners in proportion to their interests in the condominium parcels.' },
  { letter: 'G', text: 'Recover from any person including an owner, expenses incurred in making good any damage caused by him to the common amenities or common elements of the condominium parcels.' },
  { letter: 'H', text: 'Provide to any condominium parcel, any services including its refurbishment, repair, and maintenance at the request of the management corporation or owner or occupier of the condominium parcel and levy charges therefor.' },
  { letter: 'I', text: 'Undertake construction work.' },
  { letter: 'J', text: 'Enter, either by itself or by its duly authorized agents, at all reasonable times, any condominium parcel for the purpose of inspecting, repairing, or renewing pipes, wires, cables and ducts which also serve other condominium parcels or the common elements of the condominium parcels or for the purpose of maintaining, renewing, refurbishing, or repairing the condominium parcel or the common amenities or the common elements, of the Condominium Property or for the purpose of removing or demolishing unauthorized constructions of the Condominium Property or Semi Condominium Property or for the purpose of ensuring that any relevant statutory requirements are being complied with, or in the exercise of any of the powers, referred to in this section.' },
  { letter: 'K', text: 'Enter either by itself or by its duly authorized agents at all reasonable times, any land parcel of the Provisional Condominium Property for the purpose of inspecting and reviewing the progress of the construction of the building shown in the registered provisional condominium plan.' }
];

export default function PowersOfCma() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Powers of the Authority – Condominium Management Authority';
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '100vh' }}>
      <PageHero
        title="Powers of the CMA"
        subtitle="For the proper carrying out of its objects the Authority shall exercise statutory powers and enforcement authorities."
        breadcrumbs={[{ label: 'Powers of the Authority' }]}
      />

      <section className="section" style={{ padding: '5rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: 64, 
              height: 64, 
              borderRadius: '50%', 
              background: 'rgba(201, 162, 39, 0.15)', 
              color: 'var(--gold)',
              marginBottom: '1.5rem'
            }}>
              <ShieldAlert size={32} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 1rem 0' }}>
              <T>Statutory Powers & Enforcement</T>
            </h2>
            <p style={{ color: 'var(--text-body)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
              <T>To ensure compliance and protect the investments of condominium buyers, the legislature has vested the Condominium Management Authority with robust regulatory and administrative powers:</T>
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {POWERS.map((pow) => (
              <motion.div 
                key={pow.letter}
                variants={itemVariants}
                style={{ 
                  background: '#fff', 
                  borderRadius: '16px', 
                  padding: '2rem', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                  border: '1px solid rgba(0,0,0,0.04)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
              >
                <div style={{
                  flexShrink: 0,
                  marginTop: '4px',
                  color: 'var(--gold)'
                }}>
                  <ShieldAlert size={20} />
                </div>
                <div style={{ color: 'var(--text-body)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  <T>{pow.text}</T>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>
    </div>
  );
}
