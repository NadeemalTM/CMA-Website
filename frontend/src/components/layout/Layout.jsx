import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Navbar from './Navbar';
import NoticeTicker from './NoticeTicker';
import CitizenNavbar from './CitizenNavbar';
import Footer from './Footer';
// Floating buttons removed to keep only the Feedback widget
import ScrollToTop from './ScrollToTop';
import FeedbackWidget from './FeedbackWidget';

const s = {
  pageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },
};

export default function Layout() {
  const [showNavbars, setShowNavbars] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbars when scrolled near the top of the page (within 80px)
      if (currentScrollY < 80) {
        setShowNavbars(true);
      } else {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down -> Hide main Navbar & secondary CitizenNavbar
          setShowNavbars(false);
        } else {
          // Scrolling up -> Show them
          setShowNavbars(true);
        }
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={s.pageWrapper}>
      <header style={s.header}>
        <TopBar />
        
        {/* Collapsible main Navbar */}
        <div
          style={{
            maxHeight: showNavbars ? '80px' : '0px',
            opacity: showNavbars ? 1 : 0,
            overflow: showNavbars ? 'visible' : 'hidden',
            transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
          }}
        >
          <Navbar />
        </div>

        {/* NoticeTicker removed per request */}

        {/* Collapsible secondary CitizenNavbar */}
        <div
          style={{
            maxHeight: showNavbars ? '150px' : '0px',
            opacity: showNavbars ? 1 : 0,
            overflow: showNavbars ? 'visible' : 'hidden',
            transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
          }}
        >
          <CitizenNavbar />
        </div>
      </header>

      <main style={s.main} id="main-content">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <FeedbackWidget />

      {/* Responsive spacer overrides to prevent content overlap and scroll layout shifting */}
      <style>{`
        #main-content {
          padding-top: 166px !important;
        }
        @media (max-width: 1024px) {
          #main-content {
            padding-top: 150px !important;
          }
        }
        @media (max-width: 768px) {
          #main-content {
            padding-top: 148px !important;
          }
        }
        @media (max-width: 480px) {
          #main-content {
            padding-top: 144px !important;
          }
        }
      `}</style>
    </div>
  );
}




