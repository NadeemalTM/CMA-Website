import axios from 'axios';

const getBaseURL = () => {
  const origin = window.location.origin;
  if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('192.168.')) {
    return '/api/v1';
  }
  const protocol = origin.startsWith('https') ? 'https://' : 'http://';
  const domain = origin.replace('https://', '').replace('http://', '').replace('www.', '');
  return `${protocol}api.${domain}/api/v1`;
};

export const getStorageURL = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const origin = window.location.origin;
  if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('192.168.')) {
    return `/storage/${path}`;
  }
  const protocol = origin.startsWith('https') ? 'https://' : 'http://';
  const domain = origin.replace('https://', '').replace('http://', '').replace('www.', '');
  return `${protocol}api.${domain}/storage/${path}`;
};

const api = axios.create({
  baseURL: getBaseURL(),
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
    
  if (token) {
    const bearerToken = `Bearer ${token}`;
    // Authorization is the standard header. X-Authorization is also sent as a
    // cPanel/Apache fallback for hosts that strip Authorization before PHP.
    config.headers.Authorization = bearerToken;
    config.headers['X-Authorization'] = bearerToken;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cma_token');
      localStorage.removeItem('cma_user');
      window.location.href = '/cma/login';
    }
    if (err.response?.status === 403 && err.response?.data?.code === 'account_disabled') {
      localStorage.removeItem('cma_token');
      localStorage.removeItem('cma_user');
      window.location.href = '/cma/login';
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
export const getLaws = (params) => api.get('/laws', { params });
export const getProjects = () => api.get('/projects');
export const getCondominiums = (params) => api.get('/condominiums', { params });
export const getApplicationTariffs = () => api.get('/application-tariffs');
export const getApplicationForms = () => api.get('/application-forms');
export const getMcFees = () => api.get('/mc-fees');
export const submitApplication = (data) => api.post('/applications', data);
export const submitComplaint = (data) => api.post('/complaints', data);
export const getCitizenComplaints = () => api.get('/citizen/complaints');
export const submitCitizenComplaint = (data) => api.post('/citizen/complaints', data);
export const deleteCitizenComplaint = (id) => api.delete(`/citizen/complaints/${id}`);
export const submitFeedback = (data) => api.post('/feedbacks', data);
export const translateTextApi = (text, to) => api.post('/translate', { text, to });

// ── Admin ────────────────────────────────────────────────────────────────
export const adminRegister = (data) => api.post('/admin/register', data);
export const adminLogin = (data) => api.post('/admin/login', data);
export const adminLogout = () => api.post('/admin/logout');
export const getDashboardStats = () => api.get('/admin/dashboard');
export const adminGetActivityLogs = (params) => api.get('/admin/history', { params });
export const getAdminProfile = () => api.get('/admin/me');
export const getAdminUsers = () => api.get('/admin/admin-users');
export const createAdminUser = (data) => api.post('/admin/admin-users', data);
export const updateAdminUser = (id, data) => api.put(`/admin/admin-users/${id}`, data);
export const updateAdminUserStatus = (id, isActive) => api.patch(`/admin/admin-users/${id}/status`, { is_active: isActive });
export const getCitizens = () => api.get('/admin/citizens');
export const deleteCitizen = (id) => api.delete(`/admin/citizens/${id}`);
export const resetCitizenPassword = (id, data) => api.patch(`/admin/citizens/${id}/reset-password`, data);
export const getCitizenProfile = () => api.get('/citizen/me');
export const uploadCitizenProfilePicture = (formData) => api.post('/citizen/me/profile-picture', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

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
export const adminLaws = adminCRUD('laws');
export const adminApplicationTariffs = adminCRUD('application-tariffs');
export const adminFeedbacks = adminCRUD('feedbacks');
export const adminMcFees = adminCRUD('mc-fees');
export const getMcFeeSettings = () => api.get('/admin/mc-fees/settings');
export const updateMcFeeSettings = (data) => api.post('/admin/mc-fees/settings', data);

export const uploadFile = (file, module) => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('module', module);
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
export const getBookingSettings = () => api.get('/bookings/settings');
export const submitBooking = (data) => api.post('/bookings', data);
export const checkBookingStatus = (referenceNo, phone) => api.post('/bookings/status', { reference_no: referenceNo, phone });
export const getBookingHistory = () => api.get('/bookings');
export const citizenUploadFile = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post('/citizen/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const uploadBookingSupportingDocument = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post('/bookings/supporting-document', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const adminGetBookings = (params) => api.get('/admin/bookings', { params });
export const adminUpdateBookingStatus = (id, status) => api.patch(`/admin/bookings/${id}/status`, { status });
export const adminUpdateBookingPaymentStatus = (id, paymentStatus) => api.patch(`/admin/bookings/${id}/payment-status`, { payment_status: paymentStatus });
export const adminCreateBooking = (data) => api.post('/admin/bookings', data);
export const adminGetBookingSettings = () => api.get('/admin/bookings/settings');
export const adminUpdateBookingSettings = (data) => api.put('/admin/bookings/settings', data);

// ── Kataragama Bungalow Rooms ──
export const getBungalowRooms = () => api.get('/bungalow-rooms');
export const adminBungalowRooms = adminCRUD('bungalow-rooms');
export const getBungalowHeroImages = () => api.get('/bungalow-hero-images');
export const adminGetBungalowHeroImages = () => api.get('/admin/bungalow-hero-images');
export const adminUpdateBungalowHeroImage = (slot, data) => api.put(`/admin/bungalow-hero-images/${slot}`, data);

// ── Certificate Services ──
export const getCertificates = () => api.get('/certificates');
export const getCertificate = (id) => api.get(`/certificates/${id}`);
export const getCertificateSettings = () => api.get('/certificates/settings');
export const initiateCertificatePayment = (id, data) => api.post(`/certificates/${id}/initiate-payment`, data);
export const completeCertificatePayment = (ref, data) => api.post(`/certificates/payments/${ref}/complete`, data);
export const getCertificatePaymentStatus = (ref) => api.get(`/certificates/payments/${ref}/status`);
export const getMyCertificatePayments = () => api.get('/certificates/my-payments');
export const downloadCertificateDocument = (ref, documentId) => api.get(`/certificates/payments/${ref}/documents/${documentId}/download`, { responseType: 'blob' });

// ── Certificate Admin CRUD ──
export const adminCertificateTypes = adminCRUD('certificate-types');
export const adminCertificateDocuments = adminCRUD('certificate-documents');
export const adminGetCertificatePayments = () => api.get('/admin/certificate-payments');
export const adminUpdateCertificatePaymentStatus = (id, status, remarks = '') => api.patch(`/admin/certificate-payments/${id}/status`, { status, remarks });
export const adminGetCertificateSettings = async () => {
  try {
    return await api.get('/admin/certificate-settings');
  } catch (err) {
    if (err?.response?.status === 404) {
      return await api.get('/admin/certificates/settings');
    }
    throw err;
  }
};

export const adminUpdateCertificateSettings = async (data) => {
  try {
    return await api.post('/admin/certificate-settings', data);
  } catch (err) {
    if (err?.response?.status === 404) {
      return await api.post('/admin/certificates/settings', data);
    }
    throw err;
  }
};

// ── Job Applications & Vacancies (Form Data) ──
export const adminCreateVacancy = (data) => api.post('/admin/vacancies', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminUpdateVacancy = (id, data) => api.post(`/admin/vacancies/${id}?_method=PUT`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const submitVacancyApplication = (id, data) => api.post(`/vacancies/${id}/apply`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminJobApplications = {
  list: () => api.get('/admin/job-applications'),
  remove: (id) => api.delete(`/admin/job-applications/${id}`)
};
export const adminApplicationForms = adminCRUD('application-forms');
