import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './ManagementCorpsPage.css';

const PageHeroFallback = ({ title, subtitle }) => (
  <div className="page-hero">
    <div className="container">
      <div className="breadcrumb">
        <a href="/">Home</a> <span>/</span> <span>{title}</span>
      </div>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  </div>
);

const getAccordionSections = (t) => [
  {
    id: 'setup',
    title: t('mc_corporation.title', 'Management Corporation'),
    content: (
      <div className="mc-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h4 style={{ color: 'var(--crimson)', margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 700 }}>
            {t('mc_corporation.para1_title', 'Legal Status and Membership')}
          </h4>
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5, color: '#475569' }}>
            {t('mc_corporation.para1')}
          </p>
        </div>
        <div>
          <h4 style={{ color: 'var(--crimson)', margin: '1rem 0 0.25rem 0', fontSize: '1rem', fontWeight: 700 }}>
            {t('mc_corporation.para2_title', 'Permanence and Continuity')}
          </h4>
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5, color: '#475569' }}>
            {t('mc_corporation.para2')}
          </p>
        </div>
        <div>
          <h4 style={{ color: 'var(--crimson)', margin: '1rem 0 0.25rem 0', fontSize: '1rem', fontWeight: 700 }}>
            {t('mc_corporation.para3_title', 'Lifespan and Governance')}
          </h4>
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5, color: '#475569' }}>
            {t('mc_corporation.para3')}
          </p>
        </div>
        <div>
          <h4 style={{ color: 'var(--crimson)', margin: '1rem 0 0.25rem 0', fontSize: '1rem', fontWeight: 700 }}>
            {t('mc_corporation.para4_title', 'Active Maintenance & Challenges')}
          </h4>
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5, color: '#475569' }}>
            {t('mc_corporation.para4')}
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'structure',
    title: t('mgmt.structure_title', 'Composition of the MC Official and Council'),
    content: (
      <div className="mc-content">
        <p>
          At a Annual General Meeting of the Management Corporation, an executive committee must be elected
          to carry out Administration, Maintenance &amp; Management on behalf of all members. This executive
          body is referred to as the Committee (Board).
        </p>
        <h4>Committee Size:</h4>
        <ul>
          <li><strong>Minimum:</strong> 3 condominium unit owners</li>
          <li><strong>Maximum:</strong> 14 condominium unit owners</li>
          <li><strong>Term:</strong> Expires at the next Annual General Meeting</li>
          <li><strong>Quorum:</strong> One-half of the total number of committee members</li>
          <li><strong>Voting:</strong> Simple majority vote at committee meetings</li>
        </ul>
        <h4>Key Office Bearers:</h4>
        <ul>
          <li><strong>Chairperson:</strong> Presides over all council meetings, ensures by-laws are enforced.</li>
          <li><strong>Secretary:</strong> Maintains MC registers, documents meetings, files certifications to CMA.</li>
          <li><strong>Treasurer:</strong> Manages maintenance levy collections, sinking funds, and audited accounts.</li>
        </ul>
      </div>
    ),
  },

  {
    id: 'responsibility',
    title: t('mc_responsibilities.title', 'Responsibility of the Management Corporation'),
    content: (
      <div className="mc-content">
        <p style={{ marginBottom: '1rem', fontWeight: 600, color: '#4a5568', fontSize: '0.9rem' }}>
          {t('mc_responsibilities.intro')}
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingLeft: '1.25rem', listStyleType: 'disc' }}>
          {['p01', 'p02', 'p03', 'p04', 'p05', 'p06', 'p07', 'p08', 'p09'].map((key) => (
            <li key={key} style={{ fontSize: '0.88rem', lineHeight: 1.55, color: '#475569', textAlign: 'justify' }}>
              <strong>{t(`mc_responsibilities.${key}_title`)}:</strong> {t(`mc_responsibilities.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'powers',
    title: 'Powers of the Management Corporation',
    content: (
      <div className="mc-content">
        <p>The MC is vested with significant powers to carry out its responsibilities effectively:</p>
        <ul>
          <li>Sue and be sued in its corporate name.</li>
          <li>Enter into contracts for the supply of goods and services.</li>
          <li>Levy and collect maintenance contributions and special levies from unit owners.</li>
          <li>Recover unpaid levies through legal proceedings, including obtaining a lien on the defaulting unit.</li>
          <li>Set and amend by-laws subject to approval at a General Meeting.</li>
          <li>Appoint and dismiss professional managing agents or property managers.</li>
          <li>Grant licenses for the use of common property.</li>
          <li>Borrow funds for major capital works with approval from a General Meeting.</li>
          <li>Invest surplus funds in approved financial instruments.</li>
          <li>Take disciplinary action against unit owners violating by-laws.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'admin',
    title: 'Administration & Funds',
    content: (
      <div className="mc-content">
        <h4>Administrative Fund</h4>
        <p>
          The Administrative Fund covers day-to-day operational expenses of the condominium,
          including cleaning, security, utilities for common areas, insurance premiums, and routine
          maintenance. All unit owners contribute to this fund based on their unit entitlement (share
          of common property).
        </p>

        <h4>Sinking Fund</h4>
        <p>
          The Sinking Fund is a long-term reserve for major capital expenditure such as lift
          replacement, roof repairs, external repainting, and major structural works. Under the
          Condominium Property Act, the MC is required to establish and maintain a Sinking Fund,
          with contributions from each unit owner.
        </p>

        <h4>Financial Reporting</h4>
        <ul>
          <li>Annual accounts must be audited by a qualified auditor.</li>
          <li>Financial statements are presented at the AGM for approval.</li>
          <li>Copies of audited accounts must be submitted to CMA.</li>
          <li>Unit owners have the right to inspect financial records at any time.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'unit_owners',
    title: t('mc_unit_owner.title', "Unit Owners' Responsibilities"),
    content: (
      <div className="mc-content">
        <p style={{ marginBottom: '1rem', fontWeight: 600, color: '#4a5568', fontSize: '0.9rem' }}>
          {t('mc_unit_owner.intro')}
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingLeft: '1.25rem', listStyleType: 'disc' }}>
          {['p01', 'p02', 'p03', 'p04', 'p05', 'p06', 'p07', 'p08', 'p09', 'p10', 'p11', 'p12'].map((key) => (
            <li key={key} style={{ fontSize: '0.88rem', lineHeight: 1.55, color: '#475569', textAlign: 'justify' }}>
              <strong>{t(`mc_unit_owner.${key}_title`)}:</strong> {t(`mc_unit_owner.${key}`)}
              {key === 'p07' && (
                <ul style={{ listStyleType: 'circle', paddingLeft: '1.25rem', marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {['sub1', 'sub2', 'sub3', 'sub4'].map((sub) => (
                    <li key={sub} style={{ fontSize: '0.82rem', color: '#556172' }}>
                      {t(`mc_unit_owner.p07_${sub}`)}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'habits',
    title: t('mc_living_habits.title', 'Condominium Living Habits'),
    content: (
      <div className="mc-content">
        <p style={{ marginBottom: '1rem', fontWeight: 600, color: '#4a5568', fontSize: '0.9rem' }}>
          {t('mc_living_habits.intro')}
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.25rem', listStyleType: 'disc' }}>
          {['p01', 'p02', 'p03', 'p04', 'p05', 'p06', 'p07', 'p08', 'p09', 'p10', 'p11', 'p12', 'p13'].map((key) => (
            <li key={key} style={{ fontSize: '0.88rem', lineHeight: 1.5, color: '#475569', textAlign: 'justify' }}>
              {t(`mc_living_habits.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'fees',
    title: 'Registration Fees of Management Corporations',
    content: (
      <div className="mc-content">
        <p>
          The following fee schedule applies for the registration of Management Corporations with
          the Condominium Management Authority:
        </p>
        <div className="fee-table-wrapper">
          <table className="fee-table">
            <thead>
              <tr>
                <th>Number of Units</th>
                <th>Registration Fee (Rs.)</th>
                <th>Annual Return Fee (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 – 10 Units</td>
                <td>2,000</td>
                <td>1,000</td>
              </tr>
              <tr>
                <td>11 – 20 Units</td>
                <td>4,000</td>
                <td>2,000</td>
              </tr>
              <tr>
                <td>21 – 50 Units</td>
                <td>7,500</td>
                <td>3,500</td>
              </tr>
              <tr>
                <td>51 – 100 Units</td>
                <td>12,000</td>
                <td>6,000</td>
              </tr>
              <tr>
                <td>101 – 200 Units</td>
                <td>20,000</td>
                <td>10,000</td>
              </tr>
              <tr>
                <td>201 Units and above</td>
                <td>35,000</td>
                <td>15,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="fee-note">
          * All fees are subject to revision by the Minister. Please contact CMA for the latest fee
          schedule before making payment.
        </p>
        <Link to="/applications" className="btn btn-primary btn-sm" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Apply for MC Registration
        </Link>
      </div>
    ),
  },
];

export default function ManagementCorpsPage() {
  const { t } = useTranslation();
  const ACCORDION_SECTIONS = getAccordionSections(t);
  const [openId, setOpenId] = useState('setup');

  useEffect(() => {
    document.title = 'Management Corporations – CMA Sri Lanka';
  }, []);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="mc-page">
      <PageHeroFallback
        title={t('mc.title', 'Management Corporations')}
        subtitle={t('mc.desc', 'Everything you need to know about forming and running a Management Corporation')}
      />

      <section className="section">
        <div className="container">
          <div className="mc-layout">
            {/* Sidebar TOC */}
            <div className="mc-sidebar">
              <div className="mc-toc">
                <h3>Quick Navigation</h3>
                <ul>
                  {ACCORDION_SECTIONS.map((s) => (
                    <li key={s.id}>
                      <button
                        className={`mc-toc-item ${openId === s.id ? 'active' : ''}`}
                        onClick={() => {
                          toggle(s.id);
                          document.getElementById(`mc-${s.id}`)?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                          });
                        }}
                      >
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Accordion */}
            <div className="mc-accordion">
              {ACCORDION_SECTIONS.map((sec, i) => (
                <motion.div
                  key={sec.id}
                  id={`mc-${sec.id}`}
                  className={`mc-panel ${openId === sec.id ? 'open' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <button className="mc-panel-trigger" onClick={() => toggle(sec.id)}>
                    <span>{sec.title}</span>
                    <motion.div
                      animate={{ rotate: openId === sec.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openId === sec.id && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="mc-panel-body-wrapper"
                      >
                        <div className="mc-panel-body">{sec.content}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
