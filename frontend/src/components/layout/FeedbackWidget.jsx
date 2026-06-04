import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, CheckCircle2, AlertCircle, ThumbsUp } from 'lucide-react';
import { submitFeedback } from '../../services/api';

const ratingEmojis = [
  { rating: 1, char: '😞', labelKey: 'poor', color: '#ef4444' },
  { rating: 2, char: '😐', labelKey: 'fair', color: '#f59e0b' },
  { rating: 3, char: '🙂', labelKey: 'good', color: '#eab308' },
  { rating: 4, char: '😄', labelKey: 'very_good', color: '#10b981' },
  { rating: 5, char: '😍', labelKey: 'excellent', color: '#ec4899' },
];

export default function FeedbackWidget() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5); // Default to 5-star
  const [hoverRating, setHoverRating] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const currentLang = i18n.language || 'en';

  const getLocalizedRatingLabel = (ratingVal) => {
    const labels = {
      en: { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' },
      si: { 1: 'දුර්වලයි', 2: 'සාමාන්‍යයි', 3: 'හොඳයි', 4: 'ඉතා හොඳයි', 5: 'විශිෂ්ටයි' },
      ta: { 1: 'மோசம்', 2: 'பரவாயில்லை', 3: 'நல்லது', 4: 'மிக நன்று', 5: 'அருமை' }
    };
    return labels[currentLang]?.[ratingVal] || labels['en'][ratingVal];
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSuccess(false);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError(currentLang === 'si' ? 'කරුණාකර ඔබේ අදහස ඇතුළත් කරන්න.' : currentLang === 'ta' ? 'தயவுசெய்து உங்கள் கருத்தை உள்ளிடவும்.' : 'Please enter your comments.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await submitFeedback({
        name: name.trim() || null,
        email: email.trim() || null,
        rating,
        message: message.trim(),
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      setRating(5);
    } catch (err) {
      setError(err.response?.data?.message || t('common.error') || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={toggleWidget}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#8B0000',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 20px rgba(139,0,0,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10001,
        }}
        whileHover={{ scale: 1.1, boxShadow: '0 6px 24px rgba(139,0,0,0.55)' }}
        whileTap={{ scale: 0.95 }}
        title={t('feedback.button_tooltip') || 'Provide Feedback'}
        aria-label="Toggle Feedback Widget"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', position: 'relative' }}
            >
              <ThumbsUp size={24} />
              <span className="pulse-dot" style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#f59e0b',
                boxShadow: '0 0 8px #f59e0b',
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Popover Form Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            style={{
              position: 'fixed',
              bottom: '92px',
              right: '24px',
              width: '360px',
              maxWidth: 'calc(100vw - 48px)',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 10px rgba(139,0,0,0.06)',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
              zIndex: 10000,
              fontFamily: 'inherit',
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #8B0000, #a50000)',
              color: '#ffffff',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ThumbsUp size={18} style={{ opacity: 0.9 }} />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, letterSpacing: '0.3px' }}>
                  {t('feedback.title') || 'We Value Your Feedback'}
                </h3>
              </div>
              <button
                onClick={toggleWidget}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.85)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: '1.5rem' }}>
              {success ? (
                /* Success Animated Screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    textAlign: 'center',
                    padding: '1.5rem 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    style={{ color: '#10b981', marginBottom: '1.25rem' }}
                  >
                    <CheckCircle2 size={64} strokeWidth={1.5} />
                  </motion.div>
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>
                    {t('feedback.success_title') || 'Thank You!'}
                  </h4>
                  <p style={{
                    margin: '0 0 1.5rem',
                    fontSize: '0.875rem',
                    color: '#4b5563',
                    lineHeight: 1.6,
                    padding: '0 10px',
                  }}>
                    {t('feedback.success_message') || 'Your feedback has been submitted successfully and helps us improve our services.'}
                  </p>
                  <button
                    onClick={toggleWidget}
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      padding: '0.6rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {t('feedback.close') || 'Close'}
                  </button>
                </motion.div>
              ) : (
                /* Form Block */
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Rating Selector */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.5rem',
                    }}>
                      {t('feedback.rating') || 'Your Rating'}
                    </label>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.06)',
                    }}>
                      {ratingEmojis.map((emoji) => {
                        const isSelected = rating === emoji.rating;
                        const isHovered = hoverRating === emoji.rating;
                        return (
                          <motion.button
                            key={emoji.rating}
                            type="button"
                            onClick={() => setRating(emoji.rating)}
                            onMouseEnter={() => setHoverRating(emoji.rating)}
                            onMouseLeave={() => setHoverRating(null)}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '2rem',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              opacity: isSelected || isHovered ? 1 : 0.45,
                              filter: isSelected || isHovered ? 'none' : 'grayscale(30%)',
                              transition: 'opacity 0.2s, filter 0.2s',
                            }}
                            animate={{
                              scale: isSelected ? 1.25 : isHovered ? 1.15 : 1,
                            }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                          >
                            <span>{emoji.char}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                    {/* Rating label underlay */}
                    <div style={{
                      textAlign: 'center',
                      marginTop: '0.4rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: ratingEmojis.find(e => e.rating === (hoverRating || rating))?.color || '#6b7280',
                      transition: 'color 0.2s',
                    }}>
                      {getLocalizedRatingLabel(hoverRating || rating)}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="widget-name" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>
                      {t('feedback.name') || 'Name (Optional)'}
                    </label>
                    <input
                      id="widget-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={currentLang === 'si' ? 'ඔබේ නම...' : currentLang === 'ta' ? 'உங்கள் பெயர்...' : 'Your name...'}
                      style={{
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.875rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        backgroundColor: '#ffffff',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#8B0000'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>

                  {/* Email Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="widget-email" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>
                      {t('feedback.email') || 'Email (Optional)'}
                    </label>
                    <input
                      id="widget-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.com"
                      style={{
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.875rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        backgroundColor: '#ffffff',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#8B0000'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>

                  {/* Message Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="widget-msg" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563' }}>
                      {currentLang === 'si' ? 'අදහස් සහ යෝජනා' : currentLang === 'ta' ? 'கருத்துக்கள் மற்றும் பரிந்துரைகள்' : 'Comments & Suggestions'} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      id="widget-msg"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t('feedback.message') || 'Write your feedback or comments here...'}
                      required
                      style={{
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.875rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        outline: 'none',
                        resize: 'none',
                        transition: 'border-color 0.2s',
                        backgroundColor: '#ffffff',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#8B0000'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>

                  {/* Error Notification */}
                  {error && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fee2e2',
                      borderRadius: '6px',
                      color: '#b91c1c',
                      fontSize: '0.8rem',
                    }}>
                      <AlertCircle size={16} style={{ flexShrink: 0 }} />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      marginTop: '0.25rem',
                      padding: '0.7rem',
                      backgroundColor: '#8B0000',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(139,0,0,0.25)',
                      transition: 'background-color 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => { if (!submitting) e.target.style.backgroundColor = '#a50000'; }}
                    onMouseLeave={(e) => { if (!submitting) e.target.style.backgroundColor = '#8B0000'; }}
                  >
                    {submitting ? (
                      <>
                        <div className="spinner-small" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        <span>{t('feedback.submitting') || 'Submitting...'}</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>{t('feedback.submit') || 'Submit Feedback'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .spinner-small {
          display: inline-block;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Pulse dot animation */
        @keyframes pulse-dot {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
        
        button[title="Provide Feedback"] .pulse-dot {
          animation: pulse-dot 2s infinite;
        }
      `}</style>
    </>
  );
}
