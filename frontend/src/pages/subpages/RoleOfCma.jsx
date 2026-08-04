import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  FileCheck, 
  Users, 
  Scale, 
  Hammer, 
  Wrench, 
  Banknote, 
  Megaphone,
  BookOpen
} from 'lucide-react';
import T from '../../components/ui/T';

const PageHeroFallback = ({ title, subtitle }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '4rem 1rem', color: '#fff', position: 'relative', overflow: 'hidden' }}>
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container" 
      style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}
    >
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a> <span>/</span> <span style={{ color: '#fff' }}><T>About Us</T></span> <span>/</span> <span><T>{title}</T></span>
      </div>
      <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: 800, color: '#C9A227', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}><T>{title}</T></h1>
      {subtitle && <p style={{ margin: '1rem 0 0', fontSize: '1.15rem', color: 'var(--mid-gray)', maxWidth: '700px', lineHeight: 1.6 }}><T>{subtitle}</T></p>}
    </motion.div>
    
    {/* Decorative background circles */}
    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0) 70%)' }} />
    <div style={{ position: 'absolute', bottom: '-100px', left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)' }} />
  </div>
);

const ROLES = [
  {
    id: 1,
    title: 'Issuing Certificates',
    desc: 'Issuing certificates for common elements and common amenities to the effect that building is fit for occupation or use to enable the owner or Developer to register the condominium Plan in respect of condominium properties.',
    act: 'Apartment Ownership (amendment) Act No. 39 of 2003',
    icon: FileCheck,
    color: '#0ea5e9', // Light Blue
  },
  {
    id: 2,
    title: 'Management Corporations',
    desc: 'To assist the units owners to form the management corporation in order to manage and administer the common elements in a proper manner.',
    act: 'Apartment Ownership (amendment) Act No. 45 of 1982',
    icon: Users,
    color: '#8b5cf6', // Purple
  },
  {
    id: 3,
    title: 'Resolving Disputes',
    desc: 'To resolve disputes arising between an owner and occupier or owner and the owner or purchaser and the developer of any such condominium parcels in respect of the use or occupation or the enjoyment of the common amenities.',
    act: 'Common Amenities Board (amendment) Act No. 24 of 2003',
    icon: Scale,
    color: '#f59e0b', // Amber
  },
  {
    id: 4,
    title: 'Unauthorized Constructions',
    desc: 'Removal of unauthorized constructions.',
    act: 'Common Amenities Board (amendment) Act No. 24 of 2003',
    icon: Hammer,
    color: '#ef4444', // Red
  },
  {
    id: 5,
    title: 'Management Intervention',
    desc: 'Intervention in the management and the maintenance of common elements of the condominium properties as and when necessary.',
    act: 'Common Amenities Board (amendment) Act No. 24 of 2003',
    icon: Wrench,
    color: '#10b981', // Emerald
  },
  {
    id: 6,
    title: 'Maintenance Fees',
    desc: 'To encourage the defaulters to pay the maintenance fee regularly.',
    act: 'Common Amenities Board (amendment) Act No. 24 of 2003',
    icon: Banknote,
    color: '#14b8a6', // Teal
  },
  {
    id: 7,
    title: 'Awareness & Proper Maintenance',
    desc: 'To make aware the management corporations the necessity to maintain the common elements properly and attend to any needful repairs.',
    act: 'Common Amenities Board (amendment) Act No. 24 of 2003 & Apartment Ownership (amendment) Act No. 39 of 2003',
    icon: Megaphone,
    color: '#f43f5e', // Rose
  }
];

export default function RoleOfCma() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Role of the CMA – Condominium Management Authority';
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '100vh', overflow: 'hidden' }}>
      <PageHeroFallback 
        title="Role of the CMA" 
        subtitle="The Condominium Management Authority (CMA) exercises its powers and duties mandated by key legislative acts to ensure the proper administration, maintenance, and regulation of condominium properties." 
      />

      <section className="section" style={{ padding: '5rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}
          >
            {ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <motion.div 
                  key={role.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  style={{
                    background: '#fff',
                    borderRadius: '20px',
                    padding: '2.5rem 2rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                    border: '1px solid var(--light-gray)',
                    borderTop: `4px solid ${role.color}`,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1
                  }}
                >
                  {/* Decorative Number */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1.5rem',
                    fontSize: '4rem',
                    fontWeight: 900,
                    color: `${role.color}15`,
                    lineHeight: 1,
                    zIndex: -1,
                    userSelect: 'none'
                  }}>
                    {role.id}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ 
                      width: 50, height: 50, borderRadius: '14px', 
                      background: `${role.color}15`, color: role.color, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0, lineHeight: 1.3 }}>
                      <T>{role.title}</T>
                    </h2>
                  </div>
                  
                  <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, flexGrow: 1, marginBottom: '2rem' }}>
                    <T>{role.desc}</T>
                  </p>

                  <div style={{ 
                    marginTop: 'auto',
                    padding: '0.75rem 1rem', 
                    background: 'var(--off-white)', 
                    borderRadius: '10px',
                    border: '1px solid var(--mid-gray)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}>
                    <BookOpen size={16} color="#64748b" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, lineHeight: 1.4 }}>
                      <T>{role.act}</T>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </section>
    </div>
  );
}
