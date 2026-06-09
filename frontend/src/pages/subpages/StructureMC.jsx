import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, BookOpen, DollarSign,
  ChevronRight, Vote, Calendar, Shield,
  CheckCircle2, Info, ArrowRight,
} from 'lucide-react';

/* ─── tiny PageHero ─────────────────────────────────────────────────── */
const PageHero = ({ title, subtitle, label }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0d0000 0%, #3a0000 45%, #7a1a00 100%)',
    padding: '4rem 1rem 5rem',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* decorative rings */}
    <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'400px', height:'400px',
      borderRadius:'50%', border:'1px solid rgba(201,162,39,0.12)', pointerEvents:'none' }} />
    <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'280px', height:'280px',
      borderRadius:'50%', border:'1px solid rgba(201,162,39,0.18)', pointerEvents:'none' }} />
    <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'300px', height:'300px',
      borderRadius:'50%', border:'1px solid rgba(255,255,255,0.05)', pointerEvents:'none' }} />

    <div className="container" style={{ maxWidth:'1200px', margin:'0 auto', position:'relative', zIndex:1 }}>
      {/* breadcrumb */}
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

      {/* label badge */}
      <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem',
        background:'rgba(201,162,39,0.15)', border:'1px solid rgba(201,162,39,0.35)',
        borderRadius:'999px', padding:'0.3rem 1rem', marginBottom:'1rem' }}>
        <Users size={13} color="#C9A227" />
        <span style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'1.5px',
          textTransform:'uppercase', color:'#C9A227' }}>Management Corps</span>
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
  { members: '3', quorum: '2' },
  { members: '4 – 5', quorum: '2' },
  { members: '6 – 7', quorum: '3' },
  { members: '8 – 9', quorum: '4' },
  { members: '10 – 11', quorum: '5' },
  { members: '12', quorum: '6' },
  { members: '13 – 14', quorum: '7' },
];

/* ─── main page ─────────────────────────────────────────────────────── */
export default function StructureMC() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('mc_composition.title', 'Composition of the MC Official and Council')} – Condominium Management Authority`;
  }, [t]);

  const stats = [
    { label: t('mc_composition.stat1_label', 'Min. Members'), value: 3, suffix: '', icon: Users, color: '#C9A227' },
    { label: t('mc_composition.stat2_label', 'Max. Members'), value: 14, suffix: '', icon: Users, color: '#2563eb' },
    { label: t('mc_composition.stat3_label', 'Quorum'), value: null, display: t('mc_composition.stat3_value', '½ Total'), icon: Vote, color: '#16a34a' },
    { label: t('mc_composition.stat4_label', 'Voting'), value: null, display: t('mc_composition.stat4_value', 'Majority'), icon: CheckCircle2, color: '#9333ea' },
  ];

  const roles = [
    {
      Icon: UserCheck,
      color: '#C9A227',
      bg: 'rgba(201,162,39,0.08)',
      title: t('mc_composition.role_chair_title', 'Chairperson'),
      desc: t('mc_composition.role_chair_desc', 'The principal executive officer. Presides over all council meetings, ensures by-laws are enforced, and coordinates all administrative tasks on behalf of the Management Corporation.'),
    },
    {
      Icon: BookOpen,
      color: '#2563eb',
      bg: 'rgba(37,99,235,0.08)',
      title: t('mc_composition.role_sec_title', 'Secretary'),
      desc: t('mc_composition.role_sec_desc', 'Maintains MC registers, updates council member records, files structural and financial certifications to the CMA, documents meeting minutes and handles all correspondence.'),
    },
    {
      Icon: DollarSign,
      color: '#16a34a',
      bg: 'rgba(22,163,74,0.08)',
      title: t('mc_composition.role_treas_title', 'Treasurer'),
      desc: t('mc_composition.role_treas_desc', 'Oversees financial portfolios. Manages maintenance levy collections, sinking funds, and publishes audited accounts prior to the AGM.'),
    },
  ];

  const infoCards = [
    {
      Icon: Calendar,
      color: '#C9A227',
      bg: '#fffbeb',
      border: '#fde68a',
      title: t('mc_composition.election_title', 'Election Process'),
      desc: t('mc_composition.election_desc', 'The committee is elected unanimously or by majority agreement of the condominium unit owners at the Annual General Meeting.'),
    },
    {
      Icon: Shield,
      color: '#2563eb',
      bg: '#eff6ff',
      border: '#bfdbfe',
      title: t('mc_composition.term_title', 'Term of Office'),
      desc: t('mc_composition.term_desc', 'The term of the committee elected at each General Meeting shall expire at the next General Meeting.'),
    },
    {
      Icon: Vote,
      color: '#16a34a',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      title: t('mc_composition.voting_title', 'Voting & Decisions'),
      desc: t('mc_composition.voting_desc', 'Decisions at committee meetings may be made by a simple majority vote.'),
    },
  ];

  const cardAnim = { hidden: { opacity:0, y:28 }, show: { opacity:1, y:0 } };
  const listAnim = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

  return (
    <div style={{ background:'#f7f6f4', minHeight:'80vh' }}>
      <PageHero
        title={t('mc_composition.title', 'Composition of the MC Official and Council')}
        subtitle={t('mc_composition.subtitle', 'Governance, Election & Quorum of the Executive Committee')}
        label={t('mc_composition.hero_label', 'Management Corps')}
      />

      {/* ── intro strip ───────────────────────────────────────────── */}
      <section style={{ background:'#fff', borderBottom:'1px solid #e5e7eb' }}>
        <div className="container" style={{ maxWidth:'980px', margin:'0 auto', padding:'2.5rem 1rem' }}>
          <motion.p
            initial={{ opacity:0, y:12 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            style={{ fontSize:'1.05rem', color:'#374151', lineHeight:1.8, marginBottom:'1rem' }}
          >
            {t('mc_composition.intro')}
          </motion.p>
          <motion.p
            initial={{ opacity:0, y:12 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ delay:0.1 }}
            style={{ fontSize:'0.95rem', color:'#6b7280', lineHeight:1.75, borderLeft:'3px solid #C9A227',
              paddingLeft:'1rem', fontStyle:'italic' }}
          >
            {t('mc_composition.intro2')}
          </motion.p>
        </div>
      </section>

      {/* ── stat bar ──────────────────────────────────────────────── */}
      <section style={{ background:'linear-gradient(135deg,#3a0000 0%,#7a1a00 100%)', padding:'2.5rem 1rem' }}>
        <div className="container" style={{ maxWidth:'980px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1.5rem' }}>
            {stats.map(({ label, value, display, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity:0, y:20 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay: i * 0.1 }}
                style={{ textAlign:'center' }}
              >
                <div style={{ width:48, height:48, borderRadius:'12px', background:'rgba(255,255,255,0.1)',
                  display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.75rem', border:`1px solid ${color}44` }}>
                  <Icon size={22} color={color} />
                </div>
                <div style={{ fontSize:'2rem', fontWeight:900, color, lineHeight:1 }}>
                  {value !== null ? <AnimCounter value={value} /> : display}
                </div>
                <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.7)', marginTop:'0.3rem',
                  fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase' }}>
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── two-column: size + quorum table ───────────────────────── */}
      <section style={{ padding:'4rem 1rem' }}>
        <div className="container" style={{ maxWidth:'980px', margin:'0 auto',
          display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'2rem', alignItems:'start' }}>


          {/* size card */}
          <motion.div
            initial={{ opacity:0, x:-30 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }}
            style={{ background:'#fff', borderRadius:'16px', padding:'2rem',
              boxShadow:'0 4px 24px rgba(0,0,0,0.06)', border:'1px solid #e5e7eb' }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem' }}>
              <div style={{ width:40, height:40, borderRadius:'10px', background:'rgba(201,162,39,0.1)',
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Users size={20} color="#C9A227" />
              </div>
              <h2 style={{ margin:0, fontSize:'1.15rem', fontWeight:800, color:'#1f2937' }}>
                {t('mc_composition.size_title', 'Committee Size')}
              </h2>
            </div>
            <p style={{ color:'#4b5563', fontSize:'0.88rem', lineHeight:1.75, margin:0 }}>
              {t('mc_composition.size_desc')}
            </p>

            {/* min/max visual */}
            <div style={{ display:'flex', gap:'1rem', marginTop:'1.5rem' }}>
              {[
                { n:3, label:t('mc_composition.min_label','Minimum'), c:'#C9A227', bg:'#fffbeb' },
                { n:14, label:t('mc_composition.max_label','Maximum'), c:'#2563eb', bg:'#eff6ff' },
              ].map(({ n, label, c, bg }) => (
                <div key={n} style={{ flex:1, background:bg, borderRadius:'12px', padding:'1.25rem',
                  textAlign:'center', border:`1px solid ${c}33` }}>
                  <div style={{ fontSize:'2.2rem', fontWeight:900, color:c }}>{n}</div>
                  <div style={{ fontSize:'0.72rem', color:c, fontWeight:700,
                    textTransform:'uppercase', letterSpacing:'0.5px', marginTop:'0.25rem' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* quorum table */}
          <motion.div
            initial={{ opacity:0, x:30 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true }}
            style={{ background:'#fff', borderRadius:'16px', padding:'2rem',
              boxShadow:'0 4px 24px rgba(0,0,0,0.06)', border:'1px solid #e5e7eb' }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem' }}>
              <div style={{ width:40, height:40, borderRadius:'10px', background:'rgba(22,163,74,0.08)',
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Vote size={20} color="#16a34a" />
              </div>
              <h2 style={{ margin:0, fontSize:'1.15rem', fontWeight:800, color:'#1f2937' }}>
                {t('mc_composition.quorum_table_title', 'Quorum Reference Table')}
              </h2>
            </div>

            <div style={{ borderRadius:'10px', overflow:'hidden', border:'1px solid #e5e7eb' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
                <thead>
                  <tr style={{ background:'linear-gradient(135deg,#3a0000,#7a1a00)', color:'#fff' }}>
                    <th style={{ padding:'0.6rem 1rem', textAlign:'left', fontWeight:700 }}>
                      {t('mc_composition.quorum_table_members', 'Committee Members')}
                    </th>
                    <th style={{ padding:'0.6rem 1rem', textAlign:'center', fontWeight:700 }}>
                      {t('mc_composition.quorum_table_quorum', 'Quorum Required')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {QUORUM_ROWS.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb',
                      borderBottom:'1px solid #f3f4f6' }}>
                      <td style={{ padding:'0.55rem 1rem', color:'#374151', fontWeight:600 }}>{row.members}</td>
                      <td style={{ padding:'0.55rem 1rem', textAlign:'center' }}>
                        <span style={{ background:'rgba(22,163,74,0.1)', color:'#16a34a',
                          borderRadius:'999px', padding:'0.15rem 0.75rem', fontWeight:700, fontSize:'0.82rem' }}>
                          {row.quorum}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display:'flex', alignItems:'flex-start', gap:'0.5rem', marginTop:'1rem',
              background:'#f0fdf4', borderRadius:'8px', padding:'0.75rem', border:'1px solid #bbf7d0' }}>
              <Info size={14} color="#16a34a" style={{ flexShrink:0, marginTop:'2px' }} />
              <p style={{ margin:0, fontSize:'0.78rem', color:'#166534', lineHeight:1.5 }}>
                {t('mc_composition.quorum_desc')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── office bearers ────────────────────────────────────────── */}
      <section style={{ background:'#fff', padding:'4rem 1rem' }}>
        <div className="container" style={{ maxWidth:'980px', margin:'0 auto' }}>
          <motion.div
            initial={{ opacity:0, y:16 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            style={{ textAlign:'center', marginBottom:'2.5rem' }}
          >
            <span style={{ display:'inline-block', background:'rgba(139,0,0,0.06)', color:'var(--crimson,#8b0000)',
              borderRadius:'999px', padding:'0.3rem 1.1rem', fontSize:'0.72rem', fontWeight:800,
              letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'0.75rem' }}>
              Key Roles
            </span>
            <h2 style={{ fontSize:'1.75rem', fontWeight:900, color:'#1f2937', margin:0 }}>
              {t('mc_composition.roles_title', 'Key Office Bearers')}
            </h2>
          </motion.div>

          <motion.div
            variants={listAnim}
            initial="hidden"
            whileInView="show"
            viewport={{ once:true }}
            style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'1.5rem' }}
          >
            {roles.map(({ Icon, color, bg, title, desc }, i) => (
              <motion.div
                key={i}
                variants={cardAnim}
                whileHover={{ y:-4, boxShadow:'0 12px 32px rgba(0,0,0,0.1)' }}
                style={{ background:'#fff', borderRadius:'16px', padding:'1.75rem',
                  boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid #e5e7eb',
                  display:'flex', flexDirection:'column', gap:'0.75rem', transition:'all 0.2s' }}
              >
                <div style={{ width:48, height:48, borderRadius:'12px', background:bg,
                  display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ margin:0, fontSize:'1.05rem', fontWeight:800, color:'#1f2937' }}>{title}</h3>
                <p style={{ margin:0, fontSize:'0.84rem', color:'#4b5563', lineHeight:1.65 }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── info cards: election, term, voting ────────────────────── */}
      <section style={{ padding:'4rem 1rem' }}>
        <div className="container" style={{ maxWidth:'980px', margin:'0 auto',
          display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'1.5rem' }}>
          {infoCards.map(({ Icon, color, bg, border, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay: i * 0.1 }}
              style={{ background:bg, borderRadius:'14px', padding:'1.5rem',
                border:`1px solid ${border}` }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.75rem' }}>
                <Icon size={18} color={color} />
                <h3 style={{ margin:0, fontSize:'0.95rem', fontWeight:800, color:'#1f2937' }}>{title}</h3>
              </div>
              <p style={{ margin:0, fontSize:'0.83rem', color:'#374151', lineHeight:1.65 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── accountability banner ─────────────────────────────────── */}
      <section style={{ background:'linear-gradient(135deg,#0d0000,#3a0000)', padding:'3.5rem 1rem' }}>
        <div className="container" style={{ maxWidth:'820px', margin:'0 auto', textAlign:'center' }}>
          <motion.div
            initial={{ opacity:0, y:16 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
          >
            <div style={{ width:56, height:56, borderRadius:'14px', background:'rgba(201,162,39,0.15)',
              border:'1px solid rgba(201,162,39,0.35)', display:'flex', alignItems:'center',
              justifyContent:'center', margin:'0 auto 1.25rem' }}>
              <Shield size={26} color="#C9A227" />
            </div>
            <h2 style={{ fontSize:'1.5rem', fontWeight:900, color:'#fff', margin:'0 0 1rem' }}>
              {t('mc_composition.enforcement_title', 'How the Council is Held Accountable')}
            </h2>
            <p style={{ color:'rgba(255,255,255,0.75)', lineHeight:1.75, fontSize:'0.95rem', margin:'0 0 2rem' }}>
              {t('mc_composition.enforcement_desc')}
            </p>
            <Link
              to="/management-corps"
              style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem',
                background:'#C9A227', color:'#fff', borderRadius:'8px', padding:'0.75rem 1.75rem',
                fontWeight:700, textDecoration:'none', fontSize:'0.9rem',
                transition:'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='#b8911f'}
              onMouseLeave={e => e.currentTarget.style.background='#C9A227'}
            >
              Back to Management Corps <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
