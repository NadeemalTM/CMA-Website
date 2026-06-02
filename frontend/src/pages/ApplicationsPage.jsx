import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FileText,
  ClipboardList,
  PenLine,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';
import api, { submitApplication } from '../services/api';
import './ApplicationsPage.css';

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

const APP_TYPES = [
  {
    icon: FileText,
    key: 'plan_registration',
    label: 'Plan Registration',
    steps: ['Submit survey plan', 'Pay prescribed fee', 'CMA review & approval', 'Certificate issued'],
    fee: 'Rs. 5,000 – Rs. 50,000 (based on unit count)',
  },
  {
    icon: ClipboardList,
    key: 'mc_registration',
    label: 'MC Registration',
    steps: ['AGM resolution', 'Submit constitution', 'Pay registration fee', 'CMA registration'],
    fee: 'Rs. 2,000 – Rs. 10,000',
  },
  {
    icon: PenLine,
    key: 'amendment',
    label: 'Amendment',
    steps: ['Identify changes required', 'Prepare amendment plan', 'Submit with fee', 'CMA endorsement'],
    fee: 'Rs. 1,000 – Rs. 15,000',
  },
  {
    icon: MoreHorizontal,
    key: 'other',
    label: 'Other Services',
    steps: ['Complaint lodging', 'Dispute resolution', 'Document certification', 'General inquiries'],
    fee: 'Varies by service',
  },
];

const INITIAL_FORM = {
  full_name: '',
  email: '',
  phone: '',
  application_type: '',
  notes: '',
};

export default function ApplicationsPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    document.title = 'Applications – CMA Sri Lanka';
  }, []);

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'A valid email is required';
    if (!form.phone.trim() || !/^\+?[\d\s\-]{7,15}$/.test(form.phone))
      e.phone = 'A valid phone number is required';
    if (!form.application_type) e.application_type = 'Please select an application type';
    return e;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await submitApplication(form);
      const ref = res.data?.reference || res.data?.id || 'REF-' + Date.now();
      setSuccess(ref);
      setForm(INITIAL_FORM);
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Submission failed. Please try again later.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="applications-page">
      <PageHeroFallback
        title={t('applications.title', 'Applications')}
        subtitle={t('applications.desc', 'Submit your applications online or visit our office')}
      />

      <section className="section">
        <div className="container">
          <div className="applications-layout">
            {/* Left: Info Cards */}
            <div className="applications-info">
              <span className="section-label">Application Types</span>
              <h2 className="section-title" style={{ fontSize: '1.8rem' }}>
                What Can You Apply For?
              </h2>
              <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
                CMA handles a range of applications related to condominium registration,
                management, and compliance.
              </p>

              <div className="app-types-list">
                {APP_TYPES.map((type, i) => {
                  const Icon = type.icon;
                  return (
                    <motion.div
                      key={type.key}
                      className="app-type-card"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeUp}
                      custom={i}
                    >
                      <div className="app-type-header">
                        <div className="app-type-icon">
                          <Icon size={20} strokeWidth={1.5} />
                        </div>
                        <h3>{type.label}</h3>
                      </div>
                      <ul className="app-type-steps">
                        {type.steps.map((step, j) => (
                          <li key={j}>
                            <CheckCircle size={13} />
                            {step}
                          </li>
                        ))}
                      </ul>
                      <div className="app-type-fee">
                        <span>Fee:</span> {type.fee}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right: Form */}
            <motion.div
              className="applications-form-wrapper"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="applications-form-card">
                <div className="form-card-header">
                  <h3>Submit an Application</h3>
                  <p>Fill in the details below and our team will contact you shortly.</p>
                </div>

                {success ? (
                  <div className="app-success">
                    <CheckCircle size={48} />
                    <h3>Application Submitted!</h3>
                    <p>Your application has been received. Reference number:</p>
                    <div className="app-ref">{success}</div>
                    <p className="app-success-note">
                      Please keep this reference number for future correspondence. Our team will
                      contact you within 3–5 working days.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setSuccess(null)}
                    >
                      Submit Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="app-form" noValidate>
                    {serverError && (
                      <div className="app-error-banner">
                        <AlertCircle size={16} /> {serverError}
                      </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        name="full_name"
                        type="text"
                        className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                        placeholder="Your full name"
                        value={form.full_name}
                        onChange={handleChange}
                      />
                      {errors.full_name && (
                        <span className="field-error">{errors.full_name}</span>
                      )}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                          name="email"
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={handleChange}
                        />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Phone Number *</label>
                        <input
                          name="phone"
                          type="tel"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          placeholder="+94 11 000 0000"
                          value={form.phone}
                          onChange={handleChange}
                        />
                        {errors.phone && <span className="field-error">{errors.phone}</span>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Application Type *</label>
                      <select
                        name="application_type"
                        className={`form-control ${errors.application_type ? 'is-invalid' : ''}`}
                        value={form.application_type}
                        onChange={handleChange}
                      >
                        <option value="">Select application type...</option>
                        {APP_TYPES.map((t) => (
                          <option key={t.key} value={t.key}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      {errors.application_type && (
                        <span className="field-error">{errors.application_type}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Additional Notes</label>
                      <textarea
                        name="notes"
                        className="form-control"
                        placeholder="Any additional information or special requirements..."
                        value={form.notes}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader size={16} className="spin-icon" /> Submitting...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
