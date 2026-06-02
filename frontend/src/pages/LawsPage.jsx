import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FileText, Download, CheckCircle, Scale } from 'lucide-react';
import api, { getDocuments } from '../services/api';
import './LawsPage.css';

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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const STATIC_ACTS = [
  {
    id: 'act1',
    title: 'Condominium Property Act',
    no: 'No. 12 of 1973',
    year: '1973',
    desc: 'The principal legislation governing condominium property ownership and management in Sri Lanka. Establishes the framework for management corporations and unit ownership.',
    url: '#',
  },
  {
    id: 'act2',
    title: 'Apartment Ownership Law',
    no: 'No. 11 of 1973',
    year: '1973',
    desc: 'Governs the legal aspects of apartment ownership, establishing rights and obligations of apartment owners and facilitating strata title registration.',
    url: '#',
  },
  {
    id: 'act3',
    title: 'Common Amenities Board Act',
    no: 'No. 24 of 2003',
    year: '2003',
    desc: 'Establishes the Common Amenities Board and outlines regulations for the provision and maintenance of common amenities in residential properties.',
    url: '#',
  },
  {
    id: 'act4',
    title: 'Condominium Property (Amendment) Act',
    no: 'No. 45 of 1982',
    year: '1982',
    desc: 'Amendments to the principal Act addressing additional regulatory requirements for condominium property registration and management corporation formation.',
    url: '#',
  },
  {
    id: 'act5',
    title: 'Urban Development Authority Law',
    no: 'No. 41 of 1978',
    year: '1978',
    desc: 'Establishes the Urban Development Authority and outlines powers related to urban development, including the regulation of high-rise and condominium developments.',
    url: '#',
  },
  {
    id: 'act6',
    title: 'Condominium Property (Amendment) Act',
    no: 'No. 39 of 2003',
    year: '2003',
    desc: 'Further amendments addressing modernisation of management corporation governance, financial reporting requirements, and dispute resolution mechanisms.',
    url: '#',
  },
];

const REGISTRATION_STEPS = [
  {
    step: 1,
    title: 'Obtain Approval from Local Authority',
    desc: 'Submit building plans to the relevant Municipal Council, Urban Council, or Pradeshiya Sabha for approval before construction begins.',
  },
  {
    step: 2,
    title: 'Survey & Prepare Condominium Plan',
    desc: 'Engage a licensed surveyor to prepare the condominium plan as per prescribed standards under the Condominium Property Act.',
  },
  {
    step: 3,
    title: 'Submit Application to CMA',
    desc: 'Submit the completed application form along with the surveyed plan, title deeds, construction completion certificate, and prescribed fee.',
  },
  {
    step: 4,
    title: 'Examination & Approval',
    desc: 'CMA examines the submitted documents, may conduct a site inspection, and communicates approval or requests additional information.',
  },
  {
    step: 5,
    title: 'Registration & Certification',
    desc: 'Upon approval, the condominium plan is registered and a Certificate of Registration is issued, enabling individual unit titles to be created.',
  },
];

export default function LawsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('acts');
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Laws & Legislation – CMA Sri Lanka';
    getDocuments({ type: 'law' })
      .then((res) => setDocs(res.data?.data || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allActs = docs.length > 0 ? docs : STATIC_ACTS;

  return (
    <div className="laws-page">
      <PageHeroFallback
        title={t('laws.title', 'Laws & Legislation')}
        subtitle={t('laws.desc', 'Legal framework governing condominium properties in Sri Lanka')}
      />

      <section className="section">
        <div className="container">
          {/* Tabs */}
          <div className="laws-tabs">
            <button
              className={`laws-tab ${activeTab === 'acts' ? 'active' : ''}`}
              onClick={() => setActiveTab('acts')}
            >
              <Scale size={18} /> Acts &amp; Legislation
            </button>
            <button
              className={`laws-tab ${activeTab === 'plans' ? 'active' : ''}`}
              onClick={() => setActiveTab('plans')}
            >
              <FileText size={18} /> Condominium Plans
            </button>
          </div>

          {/* Acts Tab */}
          {activeTab === 'acts' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              {loading ? (
                <div className="flex-center" style={{ padding: '4rem 0' }}>
                  <div className="spinner" />
                </div>
              ) : (
                <div className="laws-acts-grid">
                  {allActs.map((act, i) => (
                    <motion.div
                      key={act.id || i}
                      className="act-card"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeUp}
                      custom={i}
                    >
                      <div className="act-card-top">
                        <div className="act-icon">
                          <Scale size={24} strokeWidth={1.5} />
                        </div>
                        <span className="act-year-badge">{act.year}</span>
                      </div>
                      <h3 className="act-title">{act.title || act.name}</h3>
                      {act.no && <p className="act-no">{act.no}</p>}
                      <p className="act-desc">{act.desc || act.description}</p>
                      <a
                        href={act.url || act.file_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm act-download"
                      >
                        <Download size={14} /> Download PDF
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="plans-intro">
                <span className="section-label">Condominium Plans</span>
                <h2 className="section-title">How to Register a Condominium Plan</h2>
                <p className="section-subtitle">
                  Follow these steps to register your condominium plan with the Condominium
                  Management Authority. All plans must comply with the Condominium Property Act No.
                  12 of 1973.
                </p>
              </div>

              <div className="plans-steps">
                {REGISTRATION_STEPS.map((step, i) => (
                  <motion.div
                    key={step.step}
                    className="plan-step"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i}
                  >
                    <div className="plan-step-number">{step.step}</div>
                    <div className="plan-step-content">
                      <h3>{step.title}</h3>
                      <p>{step.desc}</p>
                    </div>
                    <div className="plan-step-icon">
                      <CheckCircle size={20} />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="plans-cta">
                <p>
                  Ready to submit your condominium plan?{' '}
                  <Link to="/applications" className="text-crimson font-bold">
                    Apply Online
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
