import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const s = {
  container: {
    position: 'fixed',
    bottom: '90px',
    right: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 990,
  },
  phoneBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    backgroundColor: '#25a244',
    color: '#ffffff',
    textDecoration: 'none',
    boxShadow: '0 4px 16px rgba(37,162,68,0.45)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  chatBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    backgroundColor: '#8B0000',
    color: '#ffffff',
    textDecoration: 'none',
    boxShadow: '0 4px 16px rgba(139,0,0,0.4)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  tooltip: {
    position: 'absolute',
    right: '64px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    padding: '5px 10px',
    borderRadius: '6px',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  btnWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
};

const buttonVariants = {
  hidden: { opacity: 0, x: 60, scale: 0.5 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      delay: i * 0.15,
    },
  }),
};

const hoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.12 },
  tap: { scale: 0.95 },
};

export default function FloatingButtons() {
  return (
    <div style={s.container}>
      {/* Phone Button */}
      <motion.div
        style={s.btnWrap}
        custom={1}
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.a
          href="tel:0112338146"
          style={s.phoneBtn}
          variants={hoverVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          aria-label="Call us"
          title="Call: 011 233 8146"
        >
          <Phone size={22} />
        </motion.a>
      </motion.div>

      {/* WhatsApp/Chat Button */}
      <motion.div
        style={s.btnWrap}
        custom={2}
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.a
          href="https://wa.me/94112338146"
          target="_blank"
          rel="noopener noreferrer"
          style={s.chatBtn}
          variants={hoverVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          aria-label="Chat on WhatsApp"
          title="WhatsApp Chat"
        >
          <MessageCircle size={22} />
        </motion.a>
      </motion.div>

      <style>{`
        @keyframes pulse-phone {
          0% { box-shadow: 0 0 0 0 rgba(37,162,68,0.5); }
          70% { box-shadow: 0 0 0 10px rgba(37,162,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,162,68,0); }
        }
        @keyframes pulse-chat {
          0% { box-shadow: 0 0 0 0 rgba(139,0,0,0.45); }
          70% { box-shadow: 0 0 0 10px rgba(139,0,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(139,0,0,0); }
        }
      `}</style>
    </div>
  );
}
