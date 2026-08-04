import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import T from '../../components/ui/T';
import PageHero from '../../components/ui/PageHero';

const OBJECTIVES = [
  { letter: 'A', text: 'Control, manage, maintain and administer the condominium parcels, the common elements and the common amenities of the Condominium Property or Semi Condominium Property.' },
  { letter: 'B', text: 'Ensure that the common elements and the Common Amenities of the Condominium Property or Semi Condominium Property are properly maintained in good order and that periodic repairs are being carried out in order to maintain such property in good and serviceable order, and to assist the management corporation or the owner or owners or occupiers to carry out such activities or to be directly involved with such activities in the event of the management corporation or owner or owners or occupiers failing to carry out such activities.' },
  { letter: 'C', text: 'Ensure that all buildings comprising such condominium parcels are insured against risk of fire, civil commotion and riot or to insure or keep insured, if so requested by the management corporation or by the owners, and to recover such premium or charges from the management corporation or the owners as the case may be.' },
  { letter: 'D', text: 'Remove all such unauthorized constructions erected or carried out by the respective owners or occupiers of such condominium parcels or by any person, contrary to the registered condominium plan of the Condominium Property or the registered Semi Condominium Plan of the Semi Condominium Property.' },
  { letter: 'E', text: 'Ensure that the management corporation of the condominium property or Semi Condominium Property are properly functioning and to manage and administer the activities of such management corporation.' },
  { letter: 'F', text: 'Assist the management corporation or the owner or owners or occupiers of the condominium parcels, of the Condominium Property or Semi Condominium Property in providing the services such as water, sewerage, drainage, gas, electricity, garbage disposal, air conditioning, telephone, radio and redifusion services to the owner or owners or occupiers of the condominium parcels of such condominium Property or Semi Condominium Property.' },
  { letter: 'G', text: 'Assist the management corporation to establish and maintain for use by owners or occupiers of such condominium parcels, facilities such as roads, accessways, lawns, gardens, parks, playgrounds and other open spaces, or to be directly involved with such activities, in the event of the management corporation failing to establish and maintain such facilities.' },
  { letter: 'H', text: 'Transfer to the local authority the maintenance of roads, accessways, lawns, gardens, parks, playgrounds and other open spaces for the use by owners or occupiers of the condominium parcels of the Condominium Property or Semi Condominium Property.' },
  { letter: 'I', text: 'Provide maintenance and repair services to such condominium parcels of the Condominium Property or Semi Condominium Property at the request of the management corporation or owners or occupiers thereof.' },
  { letter: 'J', text: 'Monitor the progress of the construction of the registered Provisional condominium Property in order to ensure that the interests of the stakeholders are protected and to intervene wherever necessary to protect such interests.' },
  { letter: 'K', text: 'Formulate and submit condominium re-development programmes including capital investment plans to the Minister for approval by the Government.' },
  { letter: 'L', text: 'Call upon the National Housing Development Authority or the Urban Development Authority or any local authority or any government agency or any private sector developer, to undertake the implementation of such condominium re-development projects, or to undertake the execution of the condominium re-development projects, of such programme as may be approved by the Government.' },
  { letter: 'M', text: 'Undertake the completion of any condominium building shown in the registered Semi Condominium Plan or Provisional Condominium Plan, in the event of any owner failing to complete such project.' },
  { letter: 'N', text: 'Develop or re-develop land for carrying out of any of the objects of the Authority.' },
  { letter: 'O', text: 'Do all such other acts as may be necessary or conducive to the attainment of any or all of the above objects.' }
];

export default function Objectives() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Objectives of the Authority – Condominium Management Authority';
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
        title="Objectives of the Authority"
        subtitle="The statutory mandate of the CMA is guided by several primary objectives intended to secure order, quality, and co-habitation harmony."
        breadcrumbs={[{ label: 'Objectives' }]}
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
              <Target size={32} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--crimson)', margin: '0 0 1rem 0' }}>
              <T>Core Statutory Objectives</T>
            </h2>
            <p style={{ color: 'var(--text-body)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
              <T>The following points outline the legal framework and functional objectives of the Condominium Management Authority under its establishing Acts.</T>
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {OBJECTIVES.map((obj, i) => (
              <motion.div 
                key={obj.letter}
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
                  color: 'var(--crimson)'
                }}>
                  <Target size={20} />
                </div>
                <div style={{ color: 'var(--text-body)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  <T>{obj.text}</T>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>
    </div>
  );
}
