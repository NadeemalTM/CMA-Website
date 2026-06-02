import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Building2, Shield, FileText, Users, ChevronRight, Scale } from 'lucide-react';
import T from '../components/ui/T';
import './AboutPage.css';

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
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const KEY_SERVICES = [
  {
    icon: Users,
    key: 'resident',
    title: 'Resident Services',
    desc: 'Facilitating smooth communication between unit owners, management corporations, and the Authority for efficient dispute resolution and guidance.',
  },
  {
    icon: Building2,
    key: 'maintenance',
    title: 'Property Maintenance',
    desc: 'Ensuring condominium properties are maintained to the highest standard by overseeing compliance with maintenance obligations and building codes.',
  },
  {
    icon: FileText,
    key: 'financial',
    title: 'Financial Transparency',
    desc: 'Promoting accountability in management corporation finances through audited accounts, contribution levy oversight, and sinking fund management.',
  },
  {
    icon: Shield,
    key: 'governance',
    title: 'Governance & Compliance',
    desc: 'Enforcing the Condominium Property Act to ensure all parties adhere to statutory obligations and operate within the legal framework.',
  },
];

const VMQ = [
  {
    key: 'vision',
    title: 'Our Vision',
    text: 'To be the premier regulatory authority that nurtures a culture of orderly, harmonious and sustainable condominium living in Sri Lanka.',
  },
  {
    key: 'mission',
    title: 'Our Mission',
    text: 'To regulate, facilitate and promote the efficient management of condominium properties by providing comprehensive services that protect the rights and interests of all stakeholders.',
  },
  {
    key: 'quality',
    title: 'Quality Policy',
    text: 'We are committed to delivering high-quality services that meet the needs of our clients through continuous improvement, innovation, and a dedicated team of professionals.',
  },
];

export default function AboutPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'About CMA – Condominium Management Authority';
  }, []);

  return (
    <div className="about-page">
      <PageHeroFallback
        title={t('about.title', 'About CMA')}
        subtitle={t('about.desc', 'Learn about the Condominium Management Authority of Sri Lanka')}
      />

      {/* Role of CMA */}
      <section className="section">
        <div className="container">
          <motion.div
            className="about-role-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div className="about-role-icon">
              <Scale size={48} strokeWidth={1.5} />
            </div>
            <div>
              <span className="section-label"><T>Established by Law</T></span>
              <h2 className="section-title"><T>Role of the Condominium Management Authority</T></h2>
              <p className="about-role-text">
                <T>The Condominium Management Authority (CMA) was established under the</T>{' '}
                <strong><T>Condominium Property Act No. 12 of 1973</T></strong>, <T>as amended. The Authority serves as the central regulatory body responsible for supervising and regulating all matters relating to the management of condominium properties in Sri Lanka.</T>
              </p>
              <p className="about-role-text">
                <T>CMA oversees the registration of management corporations, approval of condominium plans, resolution of disputes between unit owners and management corporations, and ensures compliance with statutory requirements. The Authority operates under the purview of the Ministry of Urban Development and Housing, safeguarding the interests of all condominium dwellers and property owners across the island.</T>
              </p>
              <p className="about-role-text">
                <T>With a growing urban population and the rapid expansion of high-rise developments, the CMA plays an increasingly vital role in ensuring that condominium living meets international standards of governance, transparency, and resident well-being.</T>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision / Mission / Quality Policy */}
      <section className="section about-vmq-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="section-label"><T>Our Values</T></span>
            <h2 className="section-title"><T>Vision, Mission & Quality Policy</T></h2>
          </div>
          <div className="grid-3">
            {VMQ.map((item, i) => (
              <motion.div
                key={item.key}
                className="vmq-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="vmq-card-header">
                  <h3><T>{item.title}</T></h3>
                </div>
                <div className="vmq-card-body">
                  <p><T>{item.text}</T></p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Services */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="section-label"><T>What We Do</T></span>
            <h2 className="section-title"><T>Key Services</T></h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              <T>The CMA provides a wide range of services to support condominium living and management throughout Sri Lanka.</T>
            </p>
          </div>
          <div className="grid-4">
            {KEY_SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.key}
                  className="card about-service-card"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                >
                  <div className="about-service-icon">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="about-service-title"><T>{svc.title}</T></h3>
                  <p className="about-service-desc"><T>{svc.desc}</T></p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Link to Leadership */}
      <section className="section about-leadership-cta">
        <div className="container">
          <motion.div
            className="about-cta-box"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <div>
              <h3><T>Meet Our Leadership</T></h3>
              <p>
                <T>Our experienced team of directors and officers guide the Authority towards achieving its mandate.</T>
              </p>
            </div>
            <Link to="/about/leadership" className="btn btn-primary">
              <T>View Leadership Team</T> <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
