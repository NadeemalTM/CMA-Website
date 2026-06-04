import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { submitComplaint } from '../services/api';

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) { setError('Please fill all required fields.'); return; }
    setLoading(true); setError('');
    try {
      await submitComplaint(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    } finally { setLoading(false); }
  };

  const contactInfo = [
    { icon: MapPin, title: 'Address', text: '1st Floor, National Housing Department Building, Sir Chittampalam A Gardiner Mawatha, Colombo 02.', color: 'var(--crimson)' },
    { icon: Phone, title: 'Phone', text: '+94-11-2447432, +94-11-2447429', href: 'tel:+94112447432', color: 'var(--success)' },
    { icon: Mail, title: 'Email', text: 'info@condominium.lk', href: 'mailto:info@condominium.lk', color: 'var(--gold)' },
    { icon: Clock, title: 'Office', text: 'Office hours by appointment', color: 'var(--info)' },
  ];

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>{t('contact.title')}</span></div>
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.label')}</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '3rem' }}>
            {/* Left - Contact Info */}
            <div>
              <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>{t('contact.address_title')}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {contactInfo.map((info, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="card"
                    style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: `${info.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <info.icon size={20} style={{ color: info.color }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 2 }}>{info.title}</p>
                      {info.href ? (
                        <a href={info.href} style={{ color: 'var(--crimson)', fontWeight: 500 }}>{info.text}</a>
                      ) : (
                        <p style={{ lineHeight: 1.5 }}>{info.text}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Google Maps Embed */}
              <div style={{ marginTop: '2rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--mid-gray)' }}>
                <iframe
                  title="CMA Sri Lanka Office Location"
                  src="https://maps.google.com/maps?q=Condominium+Management+Authority,+National+Housing+Department+Building,+Sir+Chittampalam+A+Gardiner+Mawatha,+Colombo+02&output=embed&z=16"
                  width="100%"
                  height="280"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href="https://maps.app.goo.gl/RdBD7HT1BfAzc8E4A"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem 1rem',
                    background: '#fff',
                    borderTop: '1px solid var(--mid-gray)',
                    color: 'var(--crimson)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--crimson-soft)'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <MapPin size={14} />
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Right - Contact Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>{t('contact.form_title')}</h2>

              {success ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
                  <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--text-muted)' }}>{t('contact.success')}</p>
                  <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setSuccess(false)}>Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
                  {error && <div style={{ background: 'var(--error)', color: 'white', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                  <div className="form-group">
                    <label className="form-label">{t('contact.name')} *</label>
                    <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="grid-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">{t('contact.email_f')} *</label>
                      <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('contact.phone_f')}</label>
                      <input className="form-control" type="tel" name="phone" value={form.phone} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('contact.subject')} *</label>
                    <input className="form-control" name="subject" value={form.subject} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('contact.message')} *</label>
                    <textarea className="form-control" name="message" value={form.message} onChange={handleChange} rows={5} required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                    {loading ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Sending...</> : <><Send size={16} /> {t('contact.send')}</>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
