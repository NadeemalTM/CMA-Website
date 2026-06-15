import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import logo from './assets/logo.png';
import './i18n/index.js';
import './index.css';
import './App.css';

// Public Layout & Pages
const Layout = lazy(() => import('./components/layout/Layout'));
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const LeadershipPage = lazy(() => import('./pages/LeadershipPage'));
const LawsPage = lazy(() => import('./pages/LawsPage'));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage'));
const ManagementCorpsPage = lazy(() => import('./pages/ManagementCorpsPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const PublicationsPage = lazy(() => import('./pages/PublicationsPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CondominiumsPage = lazy(() => import('./pages/CondominiumsPage'));
const KataragamaBookingPage = lazy(() => import('./pages/KataragamaBookingPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));


// Dropdown Subpages
const RoleOfCma = lazy(() => import('./pages/subpages/RoleOfCma'));
const Objectives = lazy(() => import('./pages/subpages/Objectives'));
const PowersOfCma = lazy(() => import('./pages/subpages/PowersOfCma'));
const StaffMembers = lazy(() => import('./pages/subpages/StaffMembers'));
const VisionMission = lazy(() => import('./pages/subpages/VisionMission'));
const CondoLaws = lazy(() => import('./pages/subpages/CondoLaws'));
const CondoPlan = lazy(() => import('./pages/subpages/CondoPlan'));
const CertificateProcedure = lazy(() => import('./pages/subpages/CertificateProcedure'));
const Consequence = lazy(() => import('./pages/subpages/Consequence'));
const ApplicationGuide = lazy(() => import('./pages/subpages/ApplicationGuide'));
const RegistrationFees = lazy(() => import('./pages/subpages/RegistrationFees'));
const DownloadApplications = lazy(() => import('./pages/subpages/DownloadApplications'));
const ManagementCorporation = lazy(() => import('./pages/subpages/ManagementCorporation'));
const StructureMC = lazy(() => import('./pages/subpages/StructureMC'));
const ResponsibilityMC = lazy(() => import('./pages/subpages/ResponsibilityMC'));
const PowersMC = lazy(() => import('./pages/subpages/PowersMC'));
const AdministrationFundsMC = lazy(() => import('./pages/subpages/AdministrationFundsMC'));
const UnitOwnersResponsibilityMC = lazy(() => import('./pages/subpages/UnitOwnersResponsibilityMC'));
const LivingHabitsMC = lazy(() => import('./pages/subpages/LivingHabitsMC'));
const RegistrationFeeMC = lazy(() => import('./pages/subpages/RegistrationFeeMC'));
const AboutCertificate = lazy(() => import('./pages/subpages/AboutCertificate'));

// Citizen Services & Auth Pages
const CitizenAuthPage = lazy(() => import('./pages/CitizenAuthPage'));
const PropertyServicePage = lazy(() => import('./pages/services/PropertyServicePage'));
const DevFeePage = lazy(() => import('./pages/services/DevFeePage'));
const RenovationPage = lazy(() => import('./pages/services/RenovationPage'));
const PayFinesPage = lazy(() => import('./pages/services/PayFinesPage'));
const MoreServicesPage = lazy(() => import('./pages/services/MoreServicesPage'));
const CertificatePage = lazy(() => import('./pages/services/CertificatePage'));
const CertificateDownloadPage = lazy(() => import('./pages/services/CertificateDownloadPage'));



// Admin Layout & Pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminRegisterPage = lazy(() => import('./pages/admin/AdminRegisterPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const LeadersAdminPage = lazy(() => import('./pages/admin/LeadersAdminPage'));
const HeroSlidesAdminPage = lazy(() => import('./pages/admin/HeroSlidesAdminPage'));
const NewsAdminPage = lazy(() => import('./pages/admin/NewsAdminPage'));
const AnnouncementsAdminPage = lazy(() => import('./pages/admin/AnnouncementsAdminPage'));
const VacanciesAdminPage = lazy(() => import('./pages/admin/VacanciesAdminPage'));
const DocumentsAdminPage = lazy(() => import('./pages/admin/DocumentsAdminPage'));
const ApplicationTariffsAdminPage = lazy(() => import('./pages/admin/ApplicationTariffsAdminPage'));
const ProjectsAdminPage = lazy(() => import('./pages/admin/ProjectsAdminPage'));
const CondominiumsAdminPage = lazy(() => import('./pages/admin/CondominiumsAdminPage'));
const ApplicationsAdminPage = lazy(() => import('./pages/admin/ApplicationsAdminPage'));
const ComplaintsAdminPage = lazy(() => import('./pages/admin/ComplaintsAdminPage'));
const FeedbacksAdminPage = lazy(() => import('./pages/admin/FeedbacksAdminPage'));
const CitizenSubmissionsAdminPage = lazy(() => import('./pages/admin/CitizenSubmissionsAdminPage'));
const BookingsAdminPage = lazy(() => import('./pages/admin/BookingsAdminPage'));
const BungalowRoomsAdminPage = lazy(() => import('./pages/admin/BungalowRoomsAdminPage'));
const StaffAdminPage = lazy(() => import('./pages/admin/StaffAdminPage'));
const CertificatesAdminPage = lazy(() => import('./pages/admin/CertificatesAdminPage'));
const McFeesAdminPage = lazy(() => import('./pages/admin/McFeesAdminPage'));
const JobApplicationsAdminPage = lazy(() => import('./pages/admin/JobApplicationsAdminPage'));
const ApplicationFormsAdminPage = lazy(() => import('./pages/admin/ApplicationFormsAdminPage'));


/* ─────────────────────────────────────────────
   Branded CMA Splash Screen v2
   Modern minimal style: fade-up logo + name,
   shimmer progress bar, auto-dismisses in 2.5s
───────────────────────────────────────────── */
function AppSplash({ children }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading]   = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true),  2000);
    const t2 = setTimeout(() => setVisible(false), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      {children}
      {visible && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: '#0d0000',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: fading ? 'none' : 'all',
          overflow: 'hidden',
        }}>

          {/* Subtle dark-red vignette layer */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 40%, #3a0000 0%, #0d0000 70%)',
            pointerEvents: 'none',
          }} />

          {/* ── Center content ── */}
          <div style={{
            position: 'relative',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '28px',
            animation: 'sl-rise 0.8s cubic-bezier(0.22,1,0.36,1) both',
          }}>

            {/* Logo with gold ring */}
            <div style={{ position: 'relative', width: 108, height: 108 }}>
              {/* outer gold ring */}
              <div style={{
                position: 'absolute', inset: -4,
                borderRadius: '50%',
                border: '1.5px solid rgba(201,162,39,0.5)',
              }} />
              {/* inner white ring */}
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 6px rgba(201,162,39,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src={logo} alt="CMA Logo"
                  style={{ width: 76, height: 76, objectFit: 'contain' }} />
              </div>
            </div>

            {/* Text block */}
            <div style={{ textAlign: 'center', lineHeight: 1 }}>
              <div style={{
                fontSize: '11px', fontWeight: 700, letterSpacing: '5px',
                color: '#C9A227', textTransform: 'uppercase',
                marginBottom: '10px', opacity: 0.9,
              }}>
                Sri Lanka
              </div>
              <div style={{
                fontSize: '26px', fontWeight: 800, letterSpacing: '1px',
                color: '#ffffff', marginBottom: '10px',
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              }}>
                Condominium
              </div>
              <div style={{
                fontSize: '26px', fontWeight: 800, letterSpacing: '1px',
                color: '#ffffff', marginBottom: '14px',
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              }}>
                Management Authority
              </div>
              {/* Gold separator line */}
              <div style={{
                width: '48px', height: '2px',
                background: 'linear-gradient(90deg, transparent, #C9A227, transparent)',
                margin: '0 auto',
              }} />
            </div>
          </div>

          {/* ── Progress bar ── */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '3px',
            background: 'rgba(255,255,255,0.06)',
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #8B0000, #C9A227, #8B0000)',
              backgroundSize: '200% 100%',
              animation: 'sl-bar 2s ease-in-out forwards, sl-shimmer 1.2s linear infinite',
            }} />
          </div>

          {/* ── Bottom label ── */}
          <div style={{
            position: 'absolute', bottom: '18px',
            fontSize: '9.5px', letterSpacing: '2.5px',
            color: 'rgba(255,255,255,0.22)', fontWeight: 500,
            textTransform: 'uppercase',
            animation: 'sl-rise 1s 0.3s both',
          }}>
            Ministry of Transport, Highways and Urban Development
          </div>

          <style>{`
            @keyframes sl-rise {
              from { opacity: 0; transform: translateY(18px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes sl-bar {
              from { width: 0%; }
              to   { width: 100%; }
            }
            @keyframes sl-shimmer {
              0%   { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppSplash>
          <Suspense fallback={null}>
            <Routes>
            {/* ── Public Site ──────────────────────────────── */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="about/leadership" element={<LeadershipPage />} />
              <Route path="laws" element={<LawsPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="management-corps" element={<ManagementCorpsPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="news/:slug" element={<NewsDetailPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="publications" element={<PublicationsPage />} />
              <Route path="careers" element={<CareersPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="condominiums" element={<CondominiumsPage />} />
              <Route path="search" element={<SearchPage />} />

              {/* Dropdown subpages */}
              <Route path="about/role" element={<RoleOfCma />} />
              <Route path="about/objectives" element={<Objectives />} />
              <Route path="about/powers" element={<PowersOfCma />} />
              <Route path="about/staff" element={<StaffMembers />} />
              <Route path="about/vision-mission" element={<VisionMission />} />
              <Route path="about/history" element={<HistoryPage />} />
              
              <Route path="laws/condominium-laws" element={<CondoLaws />} />
              <Route path="laws/condominium-plan" element={<CondoPlan />} />
              <Route path="laws/certificate-procedure" element={<CertificateProcedure />} />
              <Route path="laws/consequence" element={<Consequence />} />
              
              <Route path="applications/guide" element={<ApplicationGuide />} />
              <Route path="applications/fees" element={<RegistrationFees />} />
              <Route path="applications/downloads" element={<DownloadApplications />} />
              
              <Route path="management-corps/setup" element={<ManagementCorporation />} />
              <Route path="management-corps/structure" element={<StructureMC />} />
              <Route path="management-corps/responsibility" element={<ResponsibilityMC />} />
              <Route path="management-corps/powers" element={<PowersMC />} />
              <Route path="management-corps/administration-funds" element={<AdministrationFundsMC />} />
              <Route path="management-corps/unit-owners-responsibility" element={<UnitOwnersResponsibilityMC />} />
              <Route path="management-corps/living-habits" element={<LivingHabitsMC />} />
              <Route path="management-corps/registration-fees" element={<RegistrationFeeMC />} />
              
              {/* Citizen Auth & E-Service routes */}
              <Route path="login" element={<CitizenAuthPage />} />
              <Route path="services/property" element={<PropertyServicePage />} />
              <Route path="services/dev-fee" element={<DevFeePage />} />
              <Route path="services/renovation" element={<RenovationPage />} />
              <Route path="services/pay-fines" element={<PayFinesPage />} />
              <Route path="services/more" element={<MoreServicesPage />} />
              <Route path="services/certificate" element={<CertificatePage />} />
              <Route path="services/certificate/downloads/:id" element={<CertificateDownloadPage />} />
              <Route path="about-certificate" element={<AboutCertificate />} />
              <Route path="booking/kataragama" element={<KataragamaBookingPage />} />
            </Route>


            {/* ── Admin ────────────────────────────────────── */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="leadership" element={<LeadersAdminPage />} />
              <Route path="staff" element={<StaffAdminPage />} />
              <Route path="hero-slides" element={<HeroSlidesAdminPage />} />
              <Route path="news" element={<NewsAdminPage />} />
              <Route path="announcements" element={<AnnouncementsAdminPage />} />
              <Route path="vacancies" element={<VacanciesAdminPage />} />
              <Route path="job-applications" element={<JobApplicationsAdminPage />} />
              <Route path="documents" element={<DocumentsAdminPage />} />
              <Route path="application-tariffs" element={<ApplicationTariffsAdminPage />} />
              <Route path="projects" element={<ProjectsAdminPage />} />
              <Route path="condominiums" element={<CondominiumsAdminPage />} />
              <Route path="applications" element={<ApplicationsAdminPage />} />
              <Route path="complaints" element={<ComplaintsAdminPage />} />
              <Route path="feedbacks" element={<FeedbacksAdminPage />} />
              <Route path="citizen-submissions" element={<CitizenSubmissionsAdminPage />} />
              <Route path="bookings" element={<BookingsAdminPage />} />
              <Route path="bungalow-rooms" element={<BungalowRoomsAdminPage />} />
              <Route path="certificates" element={<CertificatesAdminPage />} />
              <Route path="mc-fees" element={<McFeesAdminPage />} />
              <Route path="application-forms" element={<ApplicationFormsAdminPage />} />
            </Route>


            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </AppSplash>
      </BrowserRouter>
    </AuthProvider>

  );
}

