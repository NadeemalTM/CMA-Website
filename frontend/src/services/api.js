import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// Attach lang param to every request
api.interceptors.request.use((config) => {
  const lang = localStorage.getItem('cma_lang') || 'en';
  config.params = { ...config.params, lang };
  
  const isCitizenApi = config.url.includes('/citizen/') || 
                       (config.url.includes('/bookings') && !config.url.includes('/admin/')) ||
                       (config.url.includes('/certificates') && !config.url.includes('/admin/'));
  const token = isCitizenApi
    ? localStorage.getItem('cma_citizen_token')
    : localStorage.getItem('cma_token');
    
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cma_token');
      localStorage.removeItem('cma_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Public ────────────────────────────────────────────────────────────────
export const getHeroSlides = () => api.get('/hero-slides');
export const getLeaders = () => api.get('/leaders');
export const getStaff = () => api.get('/staff');
export const getAnnouncements = () => api.get('/announcements');
export const getNews = (params) => api.get('/news', { params });
export const getNewsItem = (slug) => api.get(`/news/${slug}`);
export const getVacancies = () => api.get('/vacancies');
export const getDocuments = (params) => api.get('/documents', { params });
export const getProjects = () => api.get('/projects');
export const getCondominiums = (params) => api.get('/condominiums', { params });
export const submitApplication = (data) => api.post('/applications', data);
export const submitComplaint = (data) => api.post('/complaints', data);
export const submitFeedback = (data) => api.post('/feedbacks', data);
export const translateTextApi = (text, to) => api.post('/translate', { text, to });

// ── Admin ────────────────────────────────────────────────────────────────
export const adminRegister = (data) => api.post('/admin/register', data);
export const adminLogin = (data) => api.post('/admin/login', data);
export const adminLogout = () => api.post('/admin/logout');
export const getDashboardStats = () => api.get('/admin/dashboard');

// Generic admin CRUD factory
const adminCRUD = (resource) => ({
  list: (p) => api.get(`/admin/${resource}`, { params: p }),
  get: (id) => api.get(`/admin/${resource}/${id}`),
  create: (data) => api.post(`/admin/${resource}`, data),
  update: (id, data) => api.put(`/admin/${resource}/${id}`, data),
  remove: (id) => api.delete(`/admin/${resource}/${id}`),
});

export const adminHeroSlides = adminCRUD('hero-slides');
export const adminLeaders = adminCRUD('leaders');
export const adminStaff = adminCRUD('staff-members');
export const adminAnnouncements = adminCRUD('announcements');
export const adminNews = adminCRUD('news');
export const adminVacancies = adminCRUD('vacancies');
export const adminDocuments = adminCRUD('documents');
export const adminProjects = adminCRUD('projects');
export const adminCondominiums = adminCRUD('condominiums');
export const adminFeedbacks = adminCRUD('feedbacks');

export const uploadFile = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};

// ── Citizen E-Services ──
export const citizenRegister = (data) => api.post('/citizen/register', data);
export const citizenLogin = (data) => api.post('/citizen/login', data);
export const getCitizenSubmissions = () => api.get('/citizen/submissions');
export const submitCitizenService = (data) => api.post('/citizen/submissions', data);
export const payCitizenFine = (id) => api.post(`/citizen/submissions/${id}/pay`);

// ── Admin review for Citizen E-Services ──
export const adminGetCitizenSubmissions = () => api.get('/admin/citizen-submissions');
export const adminUpdateCitizenSubmission = (id, data) => api.patch(`/admin/citizen-submissions/${id}`, data);

// ── Kataragama Bungalow Bookings ──
export const getBookingAvailability = () => api.get('/bookings/availability');
export const submitBooking = (data) => api.post('/bookings', data);
export const getBookingHistory = () => api.get('/bookings');
export const citizenUploadFile = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post('/citizen/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const adminGetBookings = (params) => api.get('/admin/bookings', { params });
export const adminUpdateBookingStatus = (id, status) => api.patch(`/admin/bookings/${id}/status`, { status });

// ── Kataragama Bungalow Rooms ──
export const getBungalowRooms = () => api.get('/bungalow-rooms');
export const adminBungalowRooms = adminCRUD('bungalow-rooms');

// ── Certificate Services ──
export const getCertificates = () => api.get('/certificates');
export const getCertificate = (id) => api.get(`/certificates/${id}`);
export const initiateCertificatePayment = (id) => api.post(`/certificates/${id}/initiate-payment`);
export const completeCertificatePayment = (ref, data) => api.post(`/certificates/payments/${ref}/complete`, data);
export const getCertificatePaymentStatus = (ref) => api.get(`/certificates/payments/${ref}/status`);
export const getMyCertificatePayments = () => api.get('/certificates/my-payments');

// ── Certificate Admin CRUD ──
export const adminCertificateTypes = adminCRUD('certificate-types');
export const adminCertificateDocuments = adminCRUD('certificate-documents');
export const adminGetCertificatePayments = () => api.get('/admin/certificate-payments');



