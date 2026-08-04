import { useState, useEffect } from 'react';
import T from '../../components/ui/T';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Layers, Home, Box, PieChart, Info, ChevronDown, FileCheck, HardHat, FileSignature, CheckCircle2 } from 'lucide-react';

const PageHeroFallback = ({ title }) => (
  <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 100%)', padding: '4rem 1.5rem', color: '#fff', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05, transform: 'rotate(-15deg)' }}>
      <Map size={400} />
    </div>
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
      <div className="breadcrumb" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <a href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>Home</a> <span>/</span> <span style={{ color: '#fff' }}><T>Laws & Plans</T></span> <span>/</span> <span style={{ color: '#C9A227' }}>{title}</span>
      </div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ margin: 0, fontSize: '2.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}
      >
        {title}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: '600px', marginTop: '1rem', lineHeight: 1.6 }}
      ><T>
        A highly specialized survey plan used to legally divide a multi-story building into individual properties that can be bought, sold, and owned separately.
      </T></motion.p>
    </div>
  </div>
);

const AccordionItem = ({ title, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div style={{ border: '1px solid var(--mid-gray)', borderRadius: '12px', marginBottom: '1rem', background: '#fff', overflow: 'hidden' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '100%', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isOpen ? 'var(--off-white)' : '#fff', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }}
      >
        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{title}</span>
        <ChevronDown size={20} style={{ color: '#64748b', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
              <hr style={{ border: 0, borderTop: '1px solid var(--mid-gray)', margin: '0 0 1.25rem 0' }} />
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CondoPlanPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Condominium Plan – Condominium Management Authority';
  }, []);

  const components = [
    { icon: Home, title: 'Individual Units (Condominium Parcels)', desc: 'The precise horizontal and vertical boundaries (floors, walls, and ceilings) of your actual apartment or commercial space.', color: '#3b82f6', bg: '#eff6ff' },
    { icon: Box, title: 'Accessory Parcels', desc: 'Private spaces located outside your main unit but reserved exclusively for your use, such as a designated parking slot or a specific rooftop terrace area.', color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: Layers, title: 'Common Elements', desc: 'Shared infrastructure that belongs jointly to all unit owners, like the foundations, structural pillars, hallways, elevators, security systems, plumbing lines, and recreational areas.', color: '#10b981', bg: '#ecfdf5' },
    { icon: PieChart, title: 'Share Values', desc: 'A whole number assigned to each unit indicating its proportion of ownership relative to the entire building. This number dictates your voting power in the Management Corporation and how much you must contribute to the monthly maintenance fees.', color: '#f59e0b', bg: '#fffbeb' },
  ];

  const stages = [
    { icon: FileSignature, title: 'Provisional Condominium Plan', desc: 'A blueprint drawn up before construction starts, mapping out a building that is "proposed to be erected." It allows developers to legally market and enter into sales agreements with buyers early on.' },
    { icon: HardHat, title: 'Semi-Condominium Plan', desc: 'A plan registered when the building is only partially completed, but has at least a few units finished and fit for human habitation.' },
    { icon: FileCheck, title: 'Condominium Plan (Final)', desc: 'The final, definitive document drawn up once the entire project is completed. It must perfectly match the building as it exists on the ground and be endorsed with certifications from a registered architect or structural engineer.' },
  ];

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <PageHeroFallback title="Understanding the Condominium Plan" />

      <div className="container" style={{ maxWidth: '1100px', margin: '-3rem auto 0', position: 'relative', zIndex: 20 }}>
        
        {/* Intro Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', marginBottom: '3rem' }}
        >
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '12px', color: 'var(--crimson)', flexShrink: 0 }}>
              <Info size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1rem' }}><T>What is a Condominium Plan?</T></h2>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1rem' }}><T>
                Under Sri Lankan law (governed by the Apartment Ownership Law), a standard plot of land only allows for vertical ownership—meaning whoever owns the land generally owns everything built on it.
              </T></p>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
                A registered <strong><T>Condominium Plan</T></strong> legally breaks this rule, transforming single rooms or floors into individual pieces of "immovable property" (real estate) complete with their own separate deeds.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Why it matters */}
        <div style={{ background: 'var(--crimson)', color: '#fff', padding: '2rem', borderRadius: '12px', marginBottom: '4rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%' }}>
            <CheckCircle2 size={32} color="#C9A227" />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: '#C9A227' }}><T>Why it matters to you</T></h3>
            <p style={{ margin: 0, lineHeight: 1.6, opacity: 0.9 }}>
              A property developer <strong><T>cannot issue a final, clean deed to a buyer</T></strong> until this final Condominium Plan has been officially certified by the Condominium Management Authority (CMA) and registered at the Land Registry.
            </p>
          </div>
        </div>

        {/* What it contains */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: '2.5rem' }}><T>What a Condominium Plan Contains</T></h2>
          <p style={{ textAlign: 'center', color: '#64748b', maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.05rem' }}><T>
            Prepared by a licensed surveyor, a formal condominium plan maps out exactly who owns what. It clearly defines:
          </T></p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {components.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid var(--light-gray)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ background: item.bg, color: item.color, width: 50, height: 50, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Icon size={24} />
                  </div>
                  <h4 style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', color: '#1e293b' }}>{item.title}</h4>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 3 Stages */}
        <div style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: '2.5rem' }}><T>The 3 Stages of Condominium Plans</T></h2>
          <p style={{ textAlign: 'center', color: '#64748b', maxWidth: '700px', margin: '0 auto 3rem', fontSize: '1.05rem' }}><T>
            Depending on how far along the construction is, developers work with three distinct types of plans:
          </T></p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {stages.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (0.1 * i) }} style={{ display: 'flex', background: '#fff', borderRadius: '12px', border: '1px solid var(--mid-gray)', overflow: 'hidden' }}>
                  <div style={{ background: i === 2 ? 'var(--crimson)' : 'var(--off-white)', width: '6px' }} />
                  <div style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flex: 1 }}>
                    <div style={{ background: i === 2 ? '#fff1f2' : 'var(--light-gray)', color: i === 2 ? 'var(--crimson)' : '#64748b', padding: '1rem', borderRadius: '50%' }}>
                      <Icon size={28} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', color: '#0f172a' }}>{stage.title}</h4>
                      <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>{stage.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Technical Definitions Accordion */}
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem', textAlign: 'center' }}><T>Statutory Requirements & Definitions</T></h2>
          
          <AccordionItem title="01. Condominium Plan (Final)">
            <p><strong><T>The Condominium Plan shall comprise of a survey plan or plans which shall be prepared and drawn by a licensed surveyor or by or under the authority of the Surveyor-General and shall –</T></strong></p>
            <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} type="a">
              <li><T>delineate the external surface boundaries and boundary marks of the Condominium Property and the position of each subdivided building thereon fixed in relation to the surface boundaries;</T></li>
              <li><T>specify the division, volume and folio in which the land parcel is registered and the surveyed area thereof;</T></li>
              <li>include a vertical section of each subdivided building showing— <br/>(i) the floors and ceilings of each storey; and <br/>(ii) the height of each storey;</li>
              <li><T>include a description, as well as the vertical section and dimensions, of each building erected within the Condominium Property as a completed subdivided building, in accordance with building plans and subdivision plans approved by the authority for the time being responsible for the approval of such plans;</T></li>
              <li><T>delineate, subject to the provisions of subsections (2) and (3), each condominium parcel and define the boundaries thereof by reference to floors and walls showing the horizontal dimensions, without it being necessary to show any bearing;</T></li>
              <li><T>identify the condominium parcels into which each building is divided and distinguish such parcels by assessment numbers, numbers or other symbols;</T></li>
              <li><T>distinguish each storey by an index letter in relation to the land parcel number of the Condominium Property and specify the condominium parcels in each storey in relation to the number of such storey;</T></li>
              <li><T>specify the approximate floor area of each condominium parcel;</T></li>
              <li><T>delineate the external boundaries and show the horizontal dimensions without it being necessary to show any bearing of each building erected within the Condominium Property as a completed subdivided building in accordance with building plans any subdivided plans approved by the authority for the time being responsible for the approval of such plans;</T></li>
              <li><T>define the common elements of the Condominium Property;</T></li>
              <li><T>bear an endorsement by the person preparing it to the effect that the building shown in the condominium plan is within the external horizontal boundaries of the Condominium Property;</T></li>
              <li><T>to it a certificate from a registered architect or a registered professional civil or structural engineer to the effect that the condominium parcels shown therein are the same as those existing on the Condominium Property;</T></li>
              <li><T>enter the share value of each condominium parcel in the plan in compliance with the provisions of section 20A; and</T></li>
              <li><T>bear an endorsement with a certificate of a licensed surveyor that all buildings and all Condominium parcels shown in the Condominium Plan in relation to the external surface boundaries of the Condominium Property are within the Condominium Property and are in compliance with the building plan, and the subdivision plans issued by the authority for the time being responsible for the approval of such plans.</T></li>
              <li><T>show the share values in whole numbers of each condominium parcel and number equal to the aggregate share value entitlement of all the condominium parcels;</T></li>
              <li><T>have endorsed upon it the address at which documents may be served on the management corporation in accordance with section 20N; and</T></li>
              <li><T>contain such other particulars as may be prescribed.</T></li>
            </ol>
            <div style={{ marginTop: '1.5rem' }}>
              <p><T>(2) Where an accessory parcel consists of a building and is bounded by external walls, floors and ceilings, the dimensions and boundaries of such accessory parcel shall be shown in the Condominium Plan in accordance with the requirements of subsection (1).</T></p>
              <p><T>(3) Where an accessory parcel does not consist of a building-</T></p>
              <ol style={{ paddingLeft: '1.5rem' }} type="a">
                <li><T>the external boundaries of the accessory parcel shall be ascertained from the building plans and subdivision plans approved by the authority for the time being responsible for the approval of such plans and the accessory parcel shall be unlimited in its vertical dimension except to the extent of any projection above, or encroachment below ground level by another part of the condominium property; and</T></li>
                <li><T>the Condominium Plan shall show a diagram of the accessory parcel with similar dimensions as those shown on the approved plans referred to in paragraph (a).</T></li>
              </ol>
              <p><T>(4) Unless otherwise stipulated in the Condominium Plan, the common boundary on any condominium parcel with another condominium parcel or with the common elements shall be the centre of the floor, wall or ceiling as the case may be.</T></p>
            </div>
          </AccordionItem>

          <AccordionItem title="02. Provisional Condominium Plan">
            <p><strong><T>The Provisional Condominium Plan shall be prepared and drawn by a licensed surveyor or by or under the authority of the Surveyor General and shall :-</T></strong></p>
            <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} type="a">
              <li><T>delineate the external surface boundaries and boundary marks of the proposed Condominium Property and position of each subdivided building proposed to be erected thereon in relation to the surface boundaries;</T></li>
              <li><T>specify the division, volume and folio in which the land parcel is registered and the surveyed area thereof;</T></li>
              <li>include a vertical section of each subdivided building proposed to be erected showing- <br/>(i) the floors and ceiling of each storey; and <br/>(ii) the height of each storey;</li>
              <li><T>include a description, as well as the vertical section and dimensions, of each building proposed to be erected within the land parcel in accordance with building plan approved by the authority for the time being responsible for the approval of such plans;</T></li>
              <li><T>delineate, subject to the provisions of subsections (2) and (3) of section 5, each proposed condominium parcel and define the boundaries thereof by reference to floors and walls showing the horizontal dimensions, without it being necessary to show any bearing;</T></li>
              <li><T>identify the proposed condominium parcels into which each proposed building is to be divided and distinguish such parcels by assessment numbers, numbers or other symbols;</T></li>
              <li><T>distinguish each proposed storey by an index letter in relation to the land parcel number of the cadastral map and specify the proposed condominium parcels in each storey in relation to number of such storey;</T></li>
              <li><T>specify the approximate floor area of each proposed parcel;</T></li>
              <li><T>delineate the external boundaries and show the horizontal dimensions without it being necessary to show any bearing of each building proposed to be erected within the land parcel in accordance with the building plan approved by the authority for the time being responsible for the approval of such plan;</T></li>
              <li><T>define the provisional common elements of the provisional condominium property;</T></li>
              <li><T>show the provisional share values in whole numbers of each proposed condominium parcel and a number equal to the aggregate provisional share value entitlement of all the proposed condominium parcels;</T></li>
              <li><T>bear an endorsement by the person preparing such plan to the effect that the building proposed to be erected shown in the Provisional Condominium Plan is in accordance with the building plan approved by the authority for the time being responsible for the approval of such plan.</T></li>
            </ol>
          </AccordionItem>

          <AccordionItem title="03. Semi Condominium Plan">
            <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} type="a">
              <li><T>delineate the external surface boundaries and boundary marks, of the Semi Condominium Property and the position of each partly completed subdivided building thereon fixed in relation to the surface boundaries and the position of the balance portion of the building yet to be completed in accordance with the building plan approved by the authority for the time being thereon in relation to the surface boundaries;</T></li>
              <li><T>specify the division, volume and folio in which the land parcel is registered and the surveyed area thereof;</T></li>
              <li>include a vertical section of each partly completed subdivided building showing- <br/>(i) the floors and ceiling of each storey; and <br/>(ii) the height of each storey;</li>
              <li><T>include a description, separately the vertical section and dimensions of partly completed building erected, and vertical section and dimensions of balance portion of the building yet to be completed within the land parcel in accordance with building plan approved by the authority for the time being responsible for the approval of such plans;</T></li>
              <li><T>delineate, subject to the provisions of subsections (2) and (3) of section 5, each condominium parcels of the partly completed building, and define the boundaries thereof by reference to floors and walls showing the horizontal dimensions, without it being necessary to show any bearing;</T></li>
              <li><T>identify the condominium parcels of the partly completed building, into which each building is to be divided and distinguish such parcels by assessment numbers, numbers or other symbols;</T></li>
              <li><T>distinguish each storey by an index letter in relation to the land parcel number of the cadastral map and specify the condominium parcels of the partly completed building in each storey in relation to the number of such storey;</T></li>
              <li><T>specify the approximate floor area of each parcel;</T></li>
              <li><T>delineate the external boundaries and show the horizontal dimensions without it being necessary to show any bearing of each partly completed building erected within the land parcel in accordance with the building plan approved by the authority for the time being responsible for the approval of such plan;</T></li>
              <li><T>define the common elements of the Semi Condominium Property;</T></li>
              <li><T>show the share values in whole numbers of each condominium parcel of the partly completed building and each provisional condominium parcel of the balance portion of the building yet to be completed and a number equal to the aggregate share value entitlement of all such condominium parcels and ail such provisional condominium parcels;</T></li>
              <li><T>bear an endorsement by the person preparing such plan to the effect that the partly completed building and each provisional condominium parcel of the balance portion of the completed building erected show in the Semi Condominium Plan is in accordance with the building plan approved by the authority for the time being responsible for the approval of such plan.</T></li>
            </ol>
          </AccordionItem>
        </div>

      </div>
    </div>
  );
}
