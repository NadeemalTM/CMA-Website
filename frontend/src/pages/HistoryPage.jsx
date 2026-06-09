import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Eye, X, Clock, Compass } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import './HistoryPage.css';

export default function HistoryPage() {
  const { t } = useTranslation();
  const [activeImg, setActiveImg] = useState(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const pathRef = useRef(null);
  const [totalLength, setTotalLength] = useState(0);

  // Set window title on load
  useEffect(() => {
    document.title = `${t('history.title', 'Condominium History - Today')} | Condominium Management Authority`;
    window.scrollTo(0, 0);
  }, [t]);

  // SVG Path layout length initialization
  useEffect(() => {
    if (pathRef.current) {
      setTotalLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Window scroll handler to track timeline container progress
  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.timeline-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start counting scroll when the top of the timeline is 80% up the viewport
      const start = rect.top - windowHeight * 0.8;
      const totalHeight = rect.height;
      const progress = -start / (totalHeight + windowHeight * 0.4);

      const percent = Math.min(Math.max(progress, 0), 1);
      setScrollPercent(percent);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const timelineData = [
    {
      year: '1959',
      key: 'y1959',
      yCoord: 50,
      isLeft: true,
      hasStack: true,
      bgImage: '/History/2.jpg',
      fgImage: '/History/first act.jpg',
      caption: t('history.y1959', 'Appointment of a committee to study housing issues of Sri Lanka.'),
      blobClass: 'blob-shape-1'
    },
    {
      year: '1963',
      key: 'y1963',
      yCoord: 150,
      isLeft: false,
      image: '/History/3.jpg',
      caption: t('history.y1963', 'Launching of the first policy statement on the housing policy of Sri Lanka.'),
      blobClass: 'blob-shape-2'
    },
    {
      year: '1970',
      key: 'y1970',
      yCoord: 250,
      isLeft: true,
      image: '/History/1.jpg',
      caption: t('history.y1970', 'Introduction of legal provisions as to a condominium property by the Condominium Property Act, No. 12 of 1970.'),
      blobClass: 'blob-shape-3'
    },
    {
      year: '1973',
      key: 'y1973',
      yCoord: 350,
      isLeft: false,
      image: '/History/4.jpg',
      caption: t('history.y1973', 'Apartment Ownership Act, No. 11 of 1973 was adopted so as to confer extensive powers for the management of multistory and apartment houses under the Ceiling on Housing Property Law, No. 01 of 1973. This repealed the Act, No. 12 of 1972 and introduced provisions making it lawful for the owners of units to form themselves into associations or bodies. Similarly, the Common Amenities Board was established by Act, No. 10 of 1973 for the maintenance of such properties.'),
      blobClass: 'blob-shape-4'
    },
    {
      year: '1982',
      key: 'y1982',
      yCoord: 450,
      isLeft: true,
      image: '/History/6.jpg',
      caption: t('history.y1982', 'Apartment Ownership Act, No.45 of 1982 introduced the system of Management Corporation and it contained provisions for the reinforcement of the system of Management Corporations.'),
      blobClass: 'blob-shape-1'
    },
    {
      year: '2003',
      key: 'y2003',
      yCoord: 550,
      isLeft: false,
      image: '/History/5.jpg',
      caption: t('history.y2003', 'The Common Amenities Board Act, No.10 of 1973 was amended by Act, No. 24 of 2003, facilitating the establishment of the Condominium Management Authority with wide ranging powers including the registration of the condominium plan and the declaration after the completion of the condominium property, issuing a certificate for common elements prior to such registration, regulating all activities of the Management Corporation formed after the registration of the property, settling issues amongst various stakeholders of the condominium property, removing unauthorized structures and redeveloping the property.'),
      blobClass: 'blob-shape-2'
    },
    {
      year: '2017',
      key: 'y2017',
      yCoord: 650,
      isLeft: true,
      image: '/History/7.jpg',
      caption: t('history.y2017', 'Gazette No: 2026/25 dated 05 July 2017 was issued incorporating details on the basic requirements to be fulfilled for the issuance of condominium certificate, conformities and charging of fees.'),
      blobClass: 'blob-shape-3'
    },
    {
      year: t('history.today_title', 'Today'),
      key: 'yToday',
      yCoord: 750,
      isLeft: false,
      image: '/History/today.jpg',
      caption: t('history.yToday', 'Today, the Condominium Management Authority (CMA) continues to regulate, manage, and facilitate modern condominium living in Sri Lanka, fostering sustainable, green, and high-quality urban development.'),
      blobClass: 'blob-shape-4'
    }
  ];

  // Curve definition coordinates matching year milestones yCoord
  const curvePath = "M 50,0 Q 15,50 50,100 Q 85,150 50,200 Q 15,250 50,300 Q 85,350 50,400 Q 15,450 50,500 Q 85,550 50,600 Q 15,650 50,700 Q 85,750 50,800";

  return (
    <div className="history-page">
      <PageHero
        title={t('history.title', 'Condominium History - Today')}
        subtitle={t('history.subtitle', 'Landmarks of Condominium Housing (1959 - Present)')}
        breadcrumbs={[
          { label: t('nav.about', 'About Us'), path: '/about' },
          { label: t('nav.history', 'History') }
        ]}
      />

      {/* Floating decorative elements mimicking natural pureceylontea assets */}
      <div className="floating-leaf" style={{ top: '30%', left: '8%', width: '60px', height: '60px' }}>
        <Compass size={40} color="var(--gold)" />
      </div>
      <div className="floating-leaf" style={{ top: '65%', right: '7%', width: '80px', height: '80px', animationDelay: '-3s' }}>
        <Clock size={40} color="var(--crimson)" />
      </div>

      <div className="history-intro">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t('history.intro_title', 'Our Journey & Legal Milestones')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {t('history.intro_desc', 'Explore the evolution of condominium management and legislation in Sri Lanka, from initial policy committees in the late 1950s to the establishment of the Condominium Management Authority and modern green living regulations today.')}
        </motion.p>
      </div>

      <div className="timeline-container">
        
        {/* Winding SVG Track in Background */}
        <div className="timeline-svg-backdrop">
          <svg viewBox="0 0 100 800" preserveAspectRatio="none">
            {/* Statically visible track */}
            <path
              d={curvePath}
              fill="none"
              stroke="#f2ebd9"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Scroll animated active path */}
            <path
              ref={pathRef}
              d={curvePath}
              fill="none"
              stroke="var(--gold)"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeDasharray={totalLength || 3000}
              strokeDashoffset={totalLength ? totalLength - totalLength * scrollPercent : 3000}
              style={{ transition: 'stroke-dashoffset 0.05s ease-out' }}
            />
          </svg>
        </div>

        {/* Absolute nodes overlaying the backdrop curves on Desktop viewports */}
        {timelineData.map((item, idx) => {
          const { year, yCoord, isLeft } = item;
          // Node lights up active if scroll percent reaches its path yCoord ratio
          const isActive = scrollPercent >= (yCoord / 800);

          return (
            <div
              key={`node-${idx}`}
              className={`timeline-year-node-absolute ${isLeft ? 'node-left' : 'node-right'} ${isActive ? 'active' : ''}`}
              style={{ top: `${(yCoord / 800) * 100}%` }}
              title={year}
            >
              <span className="node-year-text">{year.length > 4 ? 'Today' : year}</span>
              <span className="node-status-dot" />
            </div>
          );
        })}

        {/* Timeline Rows containing Card Content */}
        {timelineData.map((item, idx) => {
          const { year, key, isLeft, hasStack, bgImage, fgImage, image, caption, blobClass } = item;

          return (
            <div key={idx} className={`timeline-row ${isLeft ? 'timeline-row-left' : 'timeline-row-right'}`}>
              
              {/* Timeline Card */}
              <motion.div
                className="timeline-col"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, cubicBezier: [0.215, 0.610, 0.355, 1.000] }}
              >
                <div className="timeline-card">
                  <div className="card-year-header">{year}</div>
                  <div className="card-text">{caption}</div>

                  {/* Media Content */}
                  {hasStack ? (
                    <div className="card-stacked-media">
                      <div className="stacked-bg-img" onClick={() => setActiveImg(bgImage)}>
                        <img src={bgImage} alt={`${year} History Context`} />
                        <div className="media-hover-overlay">
                          <Eye size={18} style={{ marginRight: '6px' }} /> {t('common.view', 'Zoom')}
                        </div>
                      </div>
                      <div className="stacked-fg-img" onClick={() => setActiveImg(fgImage)}>
                        <img src={fgImage} alt="National Housing Act 1956 Enactment" />
                        <div className="media-hover-overlay">
                          <BookOpen size={18} style={{ marginRight: '6px' }} /> {t('history.view_doc', 'Read Act')}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="card-media-wrapper" onClick={() => setActiveImg(image)}>
                      <div className={`card-image-blob ${blobClass}`}>
                        <img src={image} alt={`Milestone ${year}`} />
                        <div className="media-hover-overlay">
                          <Eye size={20} style={{ marginRight: '6px' }} /> {t('common.view', 'Zoom Image')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Empty Spacer Column for layout mapping */}
              <div className="timeline-spacer" />

            </div>
          );
        })}
      </div>

      {/* Fullscreen Photo Lightbox/Modal */}
      <AnimatePresence>
        {activeImg && (
          <motion.div
            className="photo-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImg(null)}
          >
            <motion.div
              className="photo-modal-content"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="photo-modal-close" onClick={() => setActiveImg(null)}>
                <X size={20} />
                <span>{t('common.close', 'Close')}</span>
              </button>
              <img src={activeImg} alt="CMA History Archive Zoomed View" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
