import { useEffect, useState } from 'react';
import T from '../../components/ui/T';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle, ChevronRight, FileText, FileCheck, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { getDocuments } from '../../services/api';

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
        <Link to="/applications" style={{ color:'rgba(255,255,255,0.7)', textDecoration:'none', pointerEvents:'none' }}>
          Applications
        </Link>
        <ChevronRight size={14} />
        <span style={{ color:'#fff' }}>{label}</span>
      </div>

      <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem',
        background:'rgba(201,162,39,0.15)', border:'1px solid rgba(201,162,39,0.35)',
        borderRadius:'999px', padding:'0.3rem 1rem', marginBottom:'1rem' }}>
        <ClipboardList size={13} color="#C9A227" />
        <span style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'1.5px',
          textTransform:'uppercase', color:'#C9A227' }}><T>Application Procedure</T></span>
      </div>

      <motion.h1
        initial={{ opacity:0, y:24 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.6 }}
        style={{ fontSize:'clamp(1.6rem,3.5vw,2.4rem)', fontWeight:900, color:'#fff',
          lineHeight:1.2, margin:'0 0 1rem', maxWidth:'800px' }}
      >
        {title}
      </motion.h1>
    </div>
  </div>
);

const INSTRUCTIONS = [
  "Applicant is required to familiarize with the provisions in the Apartment Ownership Law No 11 of 1973, Apartment Ownership (Amendment) Act 45 of 1982, Apartment Ownership (Special Provisions) Act No 11 of 1999 and Apartment Ownership (Amendment) Act 39 of 2003. In order to Familiarize with the arrangement to be made to control, manage, maintain and administer the common elements it is also instructed to study the Common Amenities Board (Amendment) Act no 24 of 2003.",
  "Application should be signed by the Owner / Owners of the premises or the Applicant who is authorized to sign on behalf of the owner.",
  "The certificates will be issued in the owner of the  land.",
  "Please quote previous reference if the certificate is required for Amendment, Additions / Alterations and Re-division of / amalgamation of Plan.",
  {
    title: "Management proposal should be based on the provisions of the Apartment Ownership Law No 11 of 1973 read its with amendments and should include among others the following:",
    subItems: [
      "Arrangements made for the management and maintenance of common amenities and common elements",
      "Collection of maintenance fees from owners.",
      "Establishment of a Management Fund",
      "Establishment of a Sinking Fund",
      "Details of policies of Insurance",
      "A time schedule prepared by the Owner for the inspection of common equipment such as elevators, escalators, air conditioning plants, generators, sump equipment and the systems for central facilities mentioned in the application.",
      "Documentary evidence to justify M.O.U. Between Management Corporation & unit Owners."
    ]
  },
  "Check List of the relevant Drawings should be duly completed and certified by a qualified person as specified in the Apartment Ownership Law No 11 of 1973 read with its Amendments.",
  "You shall be advised to forward some important structural drawings too justify structural design standards.",
  "It is the responsibility of the Owner / Applicant / Licensed Surveyor to produce any additional information which may be found necessary",
  "The processing fee should be paid at the time of submission of the application form.",
  "The processing of the application will commence only after the receipt of payment of the processing fee is shown to the receiving counter.",
  "If any information provided by the Owner / Applicant / Licensed Surveyor is found to be false or incorrect by the Condominium Management Authority, the applicant will be rejected and the certificate issued if any with regard to the Condominium Plan. Provisional Condominium Plan and Semi Condominium Plan will be revoked.",
  "Condominium management Authority is not responsible for any payment made by the owner / applicant other than the official payment made to the Authority for which is issued."
];

const CERTIFIED_LETTERS = [
  "Condominium Plan is in compliance with approved building plan and accordance with the completed existing building equal to the existing building as certified by Chartered Architect / Chartered Structural Engineer / Chartered Civil Engineer.",
  "Entire Civil & Structural Construction work was carried out as per standards and design requirements as certified by Chartered Structural Engineer / Chartered Civil Engineer (*soil investigation report for).",
  "Water systems designs and installations and other ancillary services were completed satisfactory as per standards / design requirements as certified by Chartered Mechanical Engineer / Chartered Civil Engineer.",
  "Waste water system designs and installations and other ancillary services were completed satisfactory as per standards / design requirements as certified by Chartered Mechanical Engineer / Chartered Civil Engineer.",
  "Sewerage system design and other ancillary services were completed satisfactory as per standards / design requirements as certified by Chartered Mechanical Engineer / Chartered Civil Engineer.",
  "Storm water system design and installations and other ancillary services were completed satisfactory as per standards / design requirements as certified by Chartered Mechanical Engineer / Chartered Civil Engineer.",
  "Solid waste management systems designs and installations and other ancillary services were completed satisfactory as per standards / design requirements as certified by Chartered Mechanical Engineer / Chartered Civil Engineer.",
  "Electrical system designs and installations and other ancillary services were completed satisfactory as per standards / design requirements as certified by Chartered Civil Engineer.",
  "Telephone system design and installations and other ancillary services were completed satisfactory as per standards / design requirements as certified by Chartered Civil Engineer.",
  "Elevator system designs and installations and other ancillary services were completed satisfactory as per standards / design requirements as certified by Chartered Mechanical Engineer.",
  "Fire System standard requirement Certified by Fire Department.",
  "LP Gas / Central Gas system-Piping system are designs and installations and other ancillary services were completed satisfactory as per standards / design requirements as certified by Chartered Mechanical / Gas Engineer.",
  "Lighting Protectors Certified by Chartered Electrical Engineer.",
  "Insurance for 01 Year."
];

const WARRANTIES = [
  { name: "Generator", duration: "1 year" },
  { name: "Lift", duration: "1 year" },
  { name: "Water proofing System", duration: "10 years" },
  { name: "Main pump", duration: "1 year" },
  { name: "Spare pumps", duration: "1 year" },
  { name: "Lightning Prtection System", duration: "5 years" },
  { name: "Gas system", duration: "1 year" },
  { name: "Central A/C system", duration: "1 year" },
  { name: "Access control system / CCTV", duration: "1 year" },
  { name: "Machanical car parking system", duration: "1 year" },
  { name: "Fire Maintanance", duration: "1 year" },
  { name: "Treatment Plant", duration: "1 year" }
];

export default function ApplicationGuide() {
  const { t } = useTranslation();
  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(true);

  useEffect(() => {
    document.title = 'Application Guide & Checklists – Condominium Management Authority';
    
    getDocuments({ type: 'form' })
      .then(res => {
        let fetchedForms = res.data.data || [];
        
        if (!fetchedForms.find(f => f.title === 'Preliminary Planning Clearance - PPC' || f.title_en === 'Preliminary Planning Clearance - PPC')) {
          fetchedForms.push({
            id: 'ppc-form',
            title: 'Preliminary Planning Clearance - PPC',
            file_url: '#'
          });
        }

        const orderMap = {
          'Preliminary Planning Clearance - PPC': 1,
          'Provisional Certificate Application': 2,
          'Semi Certificate Application': 3,
          'Final Certificate Application': 4,
        };

        fetchedForms.sort((a, b) => {
          const orderA = orderMap[a.title] || 99;
          const orderB = orderMap[b.title] || 99;
          return orderA - orderB;
        });

        setForms(fetchedForms);
      })
      .catch(err => console.error("Failed to load forms", err))
      .finally(() => setLoadingForms(false));
  }, []);

  const containerAnim = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemAnim = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  const certificateLink = (form) => {
    const title = form.title || form.title_en || '';
    const certificateIds = {
      'Preliminary Planning Clearance - PPC': 1,
      'Provisional Certificate Application': 2,
      'Semi Certificate Application': 3,
      'Final Certificate Application': 4,
    };
    const id = certificateIds[title];
    return id ? `/services/certificate?id=${id}` : '/services/certificate';
  };

  return (
    <div style={{ background: '#f7f6f4', minHeight: '80vh' }}>
      <PageHero 
        title="Instructions to Applications for Certificate for Common Elements and Common Amenities of Condominium Property" 
        label="Application Guide & Checklists" 
      />

      <section style={{ padding: '4rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* ── 1. General Instructions ─────────────────────────────── */}
          <motion.div variants={containerAnim} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(201,162,39,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={22} color="#C9A227" />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#1f2937' }}><T>
                General Instructions
              </T></h2>
            </div>
            
            <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {INSTRUCTIONS.map((instruction, index) => {
                  const isObj = typeof instruction === 'object';
                  return (
                    <motion.div key={index} variants={itemAnim} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ background: 'var(--off-white)', border: '1px solid var(--mid-gray)', color: '#64748b', fontWeight: 800, fontSize: '0.85rem', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {isObj ? (
                          <>
                            <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem' }}>{instruction.title}</div>
                            <div style={{ display: 'grid', gap: '0.5rem', paddingLeft: '0.5rem' }}>
                              {instruction.subItems.map((sub, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A227', marginTop: '8px', flexShrink: 0 }} />
                                  <span style={{ color: '#475569' }}>{sub}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          instruction
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ── 2. Certified Letters From ────────────────────────────── */}
          <motion.div variants={containerAnim} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(37,99,235,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck size={22} color="#2563eb" />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#1f2937', textTransform: 'uppercase' }}><T>
                Certified Letters From
              </T></h2>
            </div>
            
            <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {CERTIFIED_LETTERS.map((letter, index) => (
                  <motion.div key={index} variants={itemAnim} style={{ background: 'var(--off-white)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--mid-gray)', display: 'flex', gap: '1rem', alignItems: 'flex-start', transition: 'background 0.2s' }} whileHover={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
                    <div style={{ color: '#2563eb', fontWeight: 800, fontSize: '1.1rem', marginTop: '-2px' }}>
                      {String.fromCharCode(65 + index)}.
                    </div>
                    <div style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {letter}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── 3. Warranties & Guaranties ────────────────────────────── */}
          <motion.div variants={containerAnim} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(22,163,74,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} color="#16a34a" />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#1f2937', textTransform: 'uppercase' }}><T>
                Warranties and Guaranties
              </T></h2>
            </div>
            
            <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {WARRANTIES.map((warranty, index) => (
                  <motion.div key={index} variants={itemAnim} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', background: '#f0fdf4', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <CheckCircle size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                      <span style={{ color: '#166534', fontWeight: 700, fontSize: '0.95rem' }}>{warranty.name}</span>
                    </div>
                    <div style={{ color: '#15803d', fontSize: '0.85rem', paddingLeft: '1.875rem' }}>
                      Duration: <strong>{warranty.duration}</strong>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Certificate Services & Warning ──────────────────────── */}
          <motion.div variants={itemAnim} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            
            {/* Certificate Services Box */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(201,162,39,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <FileCheck size={24} color="#C9A227" />
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', fontWeight: 800, color: '#1f2937' }}><T>Official Certificate Services</T></h3>
              <p style={{ margin: '0 0 1.5rem', fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}><T>
                Select the required certificate service and submit your details online.
              </T></p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                {loadingForms ? (
                  <div style={{ padding: '1rem', color: '#64748b', fontSize: '0.9rem' }}>Loading services...</div>
                ) : forms.length > 0 ? (
                  forms.map((form) => (
                    <Link key={form.id} to={certificateLink(form)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--off-white)', borderRadius: '8px', color: '#1f2937', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, border: '1px solid var(--mid-gray)', transition: 'background 0.2s' }}>
                      <span>{form.title}</span>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', flexShrink:0, background:'#8B0000', color:'#fff', borderRadius:'999px', padding:'0.38rem 0.7rem', fontSize:'0.75rem' }}>
                        Get Now <ArrowRight size={13} />
                      </span>
                    </Link>
                  ))
                ) : (
                  <div style={{ padding: '1rem', color: '#64748b', fontSize: '0.9rem' }}>No certificate services are available at the moment.</div>
                )}
              </div>
            </div>

            {/* Warning Box */}
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <AlertTriangle size={24} color="#dc2626" />
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', fontWeight: 800, color: '#991b1b' }}><T>Important Disclaimer</T></h3>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#7f1d1d', lineHeight: 1.6 }}><T>
                If any information provided by the Owner, Applicant, or Licensed Surveyor is found to be false or incorrect by the Condominium Management Authority, the application will be rejected. Additionally, any certificates issued with regard to the Condominium Plan, Provisional Condominium Plan, or Semi Condominium Plan will be immediately revoked.
              </T></p>
            </div>

          </motion.div>

        </div>
      </section>
    </div>
  );
}
