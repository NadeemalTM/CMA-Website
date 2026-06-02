import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
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
const SetupMC = lazy(() => import('./pages/subpages/SetupMC'));
const StructureMC = lazy(() => import('./pages/subpages/StructureMC'));
const ResponsibilityMC = lazy(() => import('./pages/subpages/ResponsibilityMC'));
const PowersMC = lazy(() => import('./pages/subpages/PowersMC'));

// Citizen Services & Auth Pages
const CitizenAuthPage = lazy(() => import('./pages/CitizenAuthPage'));
const PropertyServicePage = lazy(() => import('./pages/services/PropertyServicePage'));
const DevFeePage = lazy(() => import('./pages/services/DevFeePage'));
const RenovationPage = lazy(() => import('./pages/services/RenovationPage'));
const PayFinesPage = lazy(() => import('./pages/services/PayFinesPage'));
const MoreServicesPage = lazy(() => import('./pages/services/MoreServicesPage'));

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
const ProjectsAdminPage = lazy(() => import('./pages/admin/ProjectsAdminPage'));
const CondominiumsAdminPage = lazy(() => import('./pages/admin/CondominiumsAdminPage'));
const ApplicationsAdminPage = lazy(() => import('./pages/admin/ApplicationsAdminPage'));
const ComplaintsAdminPage = lazy(() => import('./pages/admin/ComplaintsAdminPage'));
const FeedbacksAdminPage = lazy(() => import('./pages/admin/FeedbacksAdminPage'));
const CitizenSubmissionsAdminPage = lazy(() => import('./pages/admin/CitizenSubmissionsAdminPage'));
const BookingsAdminPage = lazy(() => import('./pages/admin/BookingsAdminPage'));
const BungalowRoomsAdminPage = lazy(() => import('./pages/admin/BungalowRoomsAdminPage'));


function LoadingFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
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
              
              <Route path="laws/condominium-laws" element={<CondoLaws />} />
              <Route path="laws/condominium-plan" element={<CondoPlan />} />
              <Route path="laws/certificate-procedure" element={<CertificateProcedure />} />
              <Route path="laws/consequence" element={<Consequence />} />
              
              <Route path="applications/guide" element={<ApplicationGuide />} />
              <Route path="applications/fees" element={<RegistrationFees />} />
              <Route path="applications/downloads" element={<DownloadApplications />} />
              
              <Route path="management-corps/setup" element={<SetupMC />} />
              <Route path="management-corps/structure" element={<StructureMC />} />
              <Route path="management-corps/responsibility" element={<ResponsibilityMC />} />
              <Route path="management-corps/powers" element={<PowersMC />} />
              
              {/* Citizen Auth & E-Service routes */}
              <Route path="login" element={<CitizenAuthPage />} />
              <Route path="services/property" element={<PropertyServicePage />} />
              <Route path="services/dev-fee" element={<DevFeePage />} />
              <Route path="services/renovation" element={<RenovationPage />} />
              <Route path="services/pay-fines" element={<PayFinesPage />} />
              <Route path="services/more" element={<MoreServicesPage />} />
              <Route path="booking/kataragama" element={<KataragamaBookingPage />} />
            </Route>

            {/* ── Admin ────────────────────────────────────── */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/register" element={<AdminRegisterPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="leadership" element={<LeadersAdminPage />} />
              <Route path="hero-slides" element={<HeroSlidesAdminPage />} />
              <Route path="news" element={<NewsAdminPage />} />
              <Route path="announcements" element={<AnnouncementsAdminPage />} />
              <Route path="vacancies" element={<VacanciesAdminPage />} />
              <Route path="documents" element={<DocumentsAdminPage />} />
              <Route path="projects" element={<ProjectsAdminPage />} />
              <Route path="condominiums" element={<CondominiumsAdminPage />} />
              <Route path="applications" element={<ApplicationsAdminPage />} />
              <Route path="complaints" element={<ComplaintsAdminPage />} />
              <Route path="feedbacks" element={<FeedbacksAdminPage />} />
              <Route path="citizen-submissions" element={<CitizenSubmissionsAdminPage />} />
              <Route path="bookings" element={<BookingsAdminPage />} />
              <Route path="bungalow-rooms" element={<BungalowRoomsAdminPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

