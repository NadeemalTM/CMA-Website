import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, Users, Download, X, Upload } from 'lucide-react';
import { getVacancies, submitVacancyApplication } from '../services/api';

export default function CareersPage() {
  const { t, i18n } = useTranslation();
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Application Modal State
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', cv: null });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getVacancies().then(r => setVacancies(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openApplyModal = (vacancy) => {
    setSelectedVacancy(vacancy);
    setForm({ name: '', email: '', phone: '', message: '', cv: null });
    setSuccess(false);
    setErrorMsg('');
  };

  const closeApplyModal = () => setSelectedVacancy(null);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.cv) {
      setErrorMsg('Please fill in all required fields and upload your CV.');
      return;
    }
    
    setSubmitting(true);
    setErrorMsg('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      if (form.phone) fd.append('phone', form.phone);
      if (form.message) fd.append('message', form.message);
      fd.append('cv', form.cv);

      await submitVacancyApplication(selectedVacancy.id, fd);
      setSuccess(true);
      setTimeout(() => closeApplyModal(), 3000);
    } catch (e) {
      setErrorMsg(e.response?.data?.message || 'An error occurred while submitting your application.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentLang = i18n.language || 'en';

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>{t('careers.title', 'Careers')}</span></div>
          <h1>{t('careers.title', 'Careers')}</h1>
          <p>{t('careers.desc', 'Join our team and help shape the future of condominium living.')}</p>
        </div>
      </div>
      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          {loading ? (
            <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div>
          ) : vacancies.length === 0 ? (
            <div className="empty-state" style={{ padding: '5rem 2rem' }}>
              <Briefcase size={48} style={{ color: 'var(--mid-gray)', marginBottom: '1rem' }} />
              <h3>{t('careers.no_vacancies', 'No vacancies available at the moment.')}</h3>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                <Users size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {vacancies.length} {vacancies.length === 1 ? 'position' : 'positions'} available
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {vacancies.map((v, i) => {
                  return (
                    <motion.div
                      key={v.id || i}
                      className="card"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      style={{ padding: '2rem' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                            <Briefcase size={18} style={{ verticalAlign: 'middle', color: 'var(--crimson)', marginRight: 8 }} />
                            {v.title}
                          </h3>
                          {v.deadline && (
                            <p style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--crimson)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>
                              <Calendar size={14} /> {t('careers.deadline', 'Deadline')}: {v.deadline}
                            </p>
                          )}
                          {v.description && (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }} dangerouslySetInnerHTML={{ __html: v.description }} />
                          )}
                          
                          {v.document_path && (
                            <a 
                              href={`http://localhost:8000/storage/${v.document_path}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="btn btn-outline btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                            >
                              <Download size={14} /> Download Details
                            </a>
                          )}
                        </div>
                        <button 
                          onClick={() => openApplyModal(v)} 
                          className="btn btn-primary" 
                          style={{ flexShrink: 0 }}
                        >
                          {t('careers.apply', 'Apply Now')}
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {selectedVacancy && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} 
              onClick={closeApplyModal} 
            />
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
              style={{ position: 'relative', background: '#fff', borderRadius: 12, padding: '2rem', maxWidth: 500, width: '90%', maxHeight: '90vh', overflow: 'auto', zIndex: 1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Apply for {selectedVacancy.title}</h3>
                <button onClick={closeApplyModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              {success ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--success)' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Briefcase size={32} />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Application Submitted!</h4>
                  <p style={{ color: 'var(--text-muted)' }}>Thank you for your interest. We will be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {errorMsg && <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#b91c1c', borderRadius: 6, fontSize: '0.9rem' }}>{errorMsg}</div>}
                  
                  <div className="form-group">
                    <label className="form-label">Full Name <span style={{color: 'red'}}>*</span></label>
                    <input type="text" className="form-control" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Email <span style={{color: 'red'}}>*</span></label>
                      <input type="email" className="form-control" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input type="text" className="form-control" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+94 77 123 4567" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message / Cover Letter</label>
                    <textarea className="form-control" rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Why are you a good fit?" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Upload CV <span style={{color: 'red'}}>*</span></label>
                    <div style={{ border: '2px dashed var(--light-gray)', padding: '1.5rem', borderRadius: 8, textAlign: 'center', background: '#f8fafc' }}>
                      <Upload size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        {form.cv ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>{form.cv.name}</span> : <span>Select a PDF or Word document</span>}
                      </div>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        required 
                        onChange={e => setForm({...form, cv: e.target.files[0]})} 
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
