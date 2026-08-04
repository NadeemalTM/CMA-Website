import { useEffect, useState } from 'react';
import T from '../../components/ui/T';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, BookOpen, DollarSign,
  ChevronRight, Vote, Calendar, Shield,
  CheckCircle2, Info, ArrowRight, FileText,
  AlertCircle, Gavel
} from 'lucide-react';

/* ─── tiny PageHero ─────────────────────────────────────────────────── */
const PageHero = ({ title, subtitle, label }) => (
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
          {label}
        </Link>
        <ChevronRight size={14} />
        <span style={{ color:'#fff' }}>{title}</span>
      </div>

      <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem',
        background:'rgba(201,162,39,0.15)', border:'1px solid rgba(201,162,39,0.35)',
        borderRadius:'999px', padding:'0.3rem 1rem', marginBottom:'1rem' }}>
        <Users size={13} color="#C9A227" />
        <span style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'1.5px',
          textTransform:'uppercase', color:'#C9A227' }}><T>Management Corps</T></span>
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

      <motion.p
        initial={{ opacity:0, y:16 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.6, delay:0.15 }}
        style={{ color:'rgba(255,255,255,0.75)', fontSize:'1rem', maxWidth:'580px', lineHeight:1.65 }}
      >
        {subtitle}
      </motion.p>
    </div>
  </div>
);

/* ─── animated counter ──────────────────────────────────────────────── */
function AnimCounter({ value }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (value === null) return;
    let n = 0;
    const step = value / 40;
    const t = setInterval(() => {
      n += step;
      if (n >= value) { setCount(value); clearInterval(t); }
      else setCount(Math.floor(n));
    }, 20);
    return () => clearInterval(t);
  }, [value]);
  return <>{count}</>;
}

/* ─── quorum table data ─────────────────────────────────────────────── */
const QUORUM_ROWS = [
  { members: 'Not more than 4', quorum: '2' },
  { members: '5 or 6', quorum: '3' },
  { members: '7 or 8', quorum: '4' },
  { members: '9 or 10', quorum: '5' },
  { members: '11 or 12', quorum: '6' },
  { members: '13 or 14', quorum: '7' },
];

/* ─── main page ─────────────────────────────────────────────────────── */
export default function StructureMC() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `Composition of the MC Official and Council – Condominium Management Authority`;
  }, []);

  const definitions = [
    { term: '"corporation"', def: 'means the management corporation in question;' },
    { term: '"council"', def: 'means the council of the corporation;' },
    { term: '"general meeting"', def: 'means a general meeting of the corporation;' },
    { term: '"owner"', def: 'means the owner of a unit who is a member of the corporation.' },
  ];

  const councilRules = [
    "Subject to the provisions and regulations, the council shall consist of not less than three and not more than fourteen owners, elected at each annual general meeting and shall cease to hold office at the next annual general meeting.",
    "Where the first annual general meeting has not yet been held, or there are not more than three owners, the council shall consist of all the owners.",
    "Except where the council consists of all owners, the corporation may at any time by resolution at an extraordinary general meeting remove any member of the council from office and appoint another owner in his place.",
    "A member of the council may resign his office at any time by writing under his hand addressed to the corporation.",
    "Where a vacancy occurs otherwise, the remaining members may appoint another owner to be a member until the next annual general meeting.",
    "Members of the council shall be eligible for re-election or re-appointment."
  ];

  return (
    <div style={{ background:'#f7f6f4', minHeight:'80vh' }}>
      <PageHero
        title="Composition of the MC Official and Council"
        subtitle="Statutory guidelines regarding the structure, meetings, and proceedings of the Management Corporation."
        label="Management Corps"
      />

      {/* ── Definitions ───────────────────────────────────────────── */}
      <section style={{ background:'#fff', borderBottom:'1px solid #e5e7eb', padding:'4rem 1rem' }}>
        <div className="container" style={{ maxWidth:'980px', margin:'0 auto' }}>
          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'2rem' }}>
              <div style={{ width:40, height:40, borderRadius:'10px', background:'rgba(201,162,39,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <BookOpen size={20} color="#C9A227" />
              </div>
              <h2 style={{ margin:0, fontSize:'1.4rem', fontWeight:800, color:'#1f2937' }}><T>
                1. Interpretations & Definitions
              </T></h2>
            </div>
            
            <p style={{ color:'#4b5563', marginBottom:'1.5rem', fontSize:'1.05rem' }}><T>
              In the application of this Schedule to any particular management corporation:
            </T></p>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'1rem' }}>
              {definitions.map((item, idx) => (
                <div key={idx} style={{ background:'#f9fafb', border:'1px solid #e5e7eb', padding:'1.5rem', borderRadius:'12px' }}>
                  <div style={{ fontWeight:800, color:'var(--crimson)', fontSize:'1.1rem', marginBottom:'0.5rem' }}>{item.term}</div>
                  <div style={{ color:'#4b5563', fontSize:'0.95rem' }}>{item.def}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Corporate Name ───────────────────────────────────────────── */}
      <section style={{ padding:'4rem 1rem' }}>
        <div className="container" style={{ maxWidth:'980px', margin:'0 auto' }}>
          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            style={{ background:'linear-gradient(135deg,#3a0000,#7a1a00)', borderRadius:'16px', padding:'3rem', color:'#fff', boxShadow:'0 10px 30px rgba(0,0,0,0.1)' }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.5rem' }}>
              <div style={{ width:40, height:40, borderRadius:'10px', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Shield size={20} color="#fff" />
              </div>
              <h2 style={{ margin:0, fontSize:'1.4rem', fontWeight:800 }}><T>2. Corporate Name</T></h2>
            </div>
            
            <p style={{ fontSize:'1.1rem', lineHeight:1.7, margin:0, color:'rgba(255,255,255,0.9)' }}>
              The corporate name of the corporation shall be <strong><T>"The Management Corporation Condominium Plan No. _______"</T></strong>, the number to be specified being the serial number of the relevant Condominium Plan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Council Membership ───────────────────────────────────────────── */}
      <section style={{ background:'#fff', padding:'4rem 1rem', borderTop:'1px solid #e5e7eb', borderBottom:'1px solid #e5e7eb' }}>
        <div className="container" style={{ maxWidth:'980px', margin:'0 auto' }}>
          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'2rem' }}>
              <div style={{ width:40, height:40, borderRadius:'10px', background:'rgba(37,99,235,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Users size={20} color="#2563eb" />
              </div>
              <h2 style={{ margin:0, fontSize:'1.4rem', fontWeight:800, color:'#1f2937' }}><T>
                3. Council Membership & Structure
              </T></h2>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {councilRules.map((rule, idx) => (
                <div key={idx} style={{ display:'flex', gap:'1rem', background:'#f8fafc', padding:'1.5rem', borderRadius:'12px', border:'1px solid #e2e8f0' }}>
                  <div style={{ flexShrink:0, width:'32px', height:'32px', background:'#2563eb', color:'#fff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.9rem' }}>
                    3.{idx+1}
                  </div>
                  <div style={{ color:'#334155', fontSize:'1rem', lineHeight:1.6, paddingTop:'0.2rem' }}>
                    {rule}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Meetings & Quorum ───────────────────────────────────────────── */}
      <section style={{ padding:'4rem 1rem' }}>
        <div className="container" style={{ maxWidth:'980px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'2rem', alignItems:'start' }}>
          
          <motion.div
            initial={{ opacity:0, x:-20 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.5rem' }}>
              <div style={{ width:40, height:40, borderRadius:'10px', background:'rgba(22,163,74,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Calendar size={20} color="#16a34a" />
              </div>
              <h2 style={{ margin:0, fontSize:'1.4rem', fontWeight:800, color:'#1f2937' }}><T>
                4. Meetings
              </T></h2>
            </div>
            <p style={{ color:'#4b5563', lineHeight:1.7, fontSize:'1.05rem', background:'#fff', padding:'1.5rem', borderRadius:'12px', border:'1px solid #e5e7eb', boxShadow:'0 2px 10px rgba(0,0,0,0.02)' }}>
              The council shall meet at such times and places and at such intervals as it thinks fit: <br/><br/>
              <strong><T>Provided that</T></strong> any member of the council may convene a meeting by appointing a date for the meeting and giving the other members not less than <strong><T>seven days’ notice</T></strong> of the date appointed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity:0, x:20 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.5rem' }}>
              <div style={{ width:40, height:40, borderRadius:'10px', background:'rgba(147,51,234,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Vote size={20} color="#9333ea" />
              </div>
              <h2 style={{ margin:0, fontSize:'1.4rem', fontWeight:800, color:'#1f2937' }}><T>
                5. Quorum & Voting
              </T></h2>
            </div>
            
            <div style={{ background:'#fff', padding:'1.5rem', borderRadius:'12px', border:'1px solid #e5e7eb', boxShadow:'0 2px 10px rgba(0,0,0,0.02)' }}>
              <p style={{ color:'#4b5563', marginTop:0, marginBottom:'1rem', fontWeight:600 }}><T>
                (1) Except where there is only one owner, a quorum at meetings of the council shall be—
              </T></p>
              <div style={{ borderRadius:'8px', overflow:'hidden', border:'1px solid #e5e7eb', marginBottom:'1.5rem' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.9rem' }}>
                  <thead>
                    <tr style={{ background:'#f9fafb', borderBottom:'1px solid #e5e7eb' }}>
                      <th style={{ padding:'0.75rem 1rem', textAlign:'left', color:'#374151' }}><T>Members</T></th>
                      <th style={{ padding:'0.75rem 1rem', textAlign:'center', color:'#374151' }}><T>Quorum</T></th>
                    </tr>
                  </thead>
                  <tbody>
                    {QUORUM_ROWS.map((row, i) => (
                      <tr key={i} style={{ borderBottom: i !== QUORUM_ROWS.length-1 ? '1px solid #f3f4f6' : 'none' }}>
                        <td style={{ padding:'0.6rem 1rem', color:'#4b5563' }}>{row.members}</td>
                        <td style={{ padding:'0.6rem 1rem', textAlign:'center', fontWeight:700, color:'#9333ea' }}>{row.quorum}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul style={{ margin:0, paddingLeft:'1.2rem', color:'#4b5563', lineHeight:1.6, display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                <li><strong><T>(2)</T></strong> Questions arising at meetings shall be decided by simple majority vote.</li>
                <li><strong><T>(3)</T></strong> Every meeting of the council shall be presided over by a Chairman, who shall be elected from among themselves by the members present and who shall have a casting as well as an original vote.</li>
                <li><strong><T>(4)</T></strong> Subject to this Paragraph, the council may regulate its own procedure at meetings.</li>
              </ul>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Delegation ───────────────────────────────────────────── */}
      <section style={{ background:'#fff', padding:'4rem 1rem', borderTop:'1px solid #e5e7eb' }}>
        <div className="container" style={{ maxWidth:'980px', margin:'0 auto' }}>
          <motion.div
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            style={{ textAlign:'center' }}
          >
            <div style={{ width:56, height:56, borderRadius:'14px', background:'rgba(201,162,39,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem' }}>
              <Gavel size={26} color="#C9A227" />
            </div>
            <h2 style={{ fontSize:'1.5rem', fontWeight:800, color:'#1f2937', marginBottom:'1.5rem' }}><T>
              6. Delegation of Powers
            </T></h2>
            <p style={{ color:'#4b5563', fontSize:'1.1rem', lineHeight:1.7, maxWidth:'700px', margin:'0 auto' }}><T>
              Subject to any restriction imposed or direction given by the corporation at a general meeting, the council may:
            </T></p>
            <div style={{ display:'flex', justifyContent:'center', gap:'1.5rem', marginTop:'2rem', flexWrap:'wrap' }}>
              <div style={{ background:'#f8fafc', padding:'1.5rem 2rem', borderRadius:'12px', border:'1px solid #e2e8f0', minWidth:'280px' }}>
                <div style={{ fontSize:'1.2rem', fontWeight:800, color:'#2563eb', marginBottom:'0.5rem' }}>(a) Delegate</div>
                <div style={{ color:'#4b5563' }}>To any one or more of its members the exercise of any of its powers or the performance of any of its duties</div>
              </div>
              <div style={{ background:'#fef2f2', padding:'1.5rem 2rem', borderRadius:'12px', border:'1px solid #fecaca', minWidth:'280px' }}>
                <div style={{ fontSize:'1.2rem', fontWeight:800, color:'var(--crimson)', marginBottom:'0.5rem' }}>(b) Revoke</div>
                <div style={{ color:'#4b5563' }}>Revoke the delegation at any time.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
