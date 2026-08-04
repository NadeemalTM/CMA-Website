import { useState, useEffect } from 'react';
import { ClipboardList, CheckSquare, X, Check, ArrowUpRight, Search, Plus, Image, Save, Upload, FileText } from 'lucide-react';
import { adminGetBookings, adminUpdateBookingStatus, adminUpdateBookingPaymentStatus, adminCreateBooking, adminGetBookingSettings, adminUpdateBookingSettings, getBungalowRooms, uploadFile, getStorageURL } from '../../services/api';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#666', lineHeight: 1 }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const statusColors = {
  Pending: '#d97706',
  Confirmed: '#1e40af',
  Done: '#1a7f5a',
  Cancelled: '#dc2626',
};

export default function BookingsAdminPage() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, done: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [roomFilter, setRoomFilter] = useState('All Rooms');
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState({ text: '', type: '' }); // success, danger
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [settings, setSettings] = useState({ tax_rate: 18, reference_banner: '', reference_banner_alt: 'Kataragama booking information' });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [form, setForm] = useState({
    guest_name: '',
    email: 'admin@condominium.lk',
    phone: '0112338146',
    nic: 'BLOCK-0000',
    room_ids: [],
    check_in: '',
    check_out: '',
    adults: 0,
    children: 0,
    amount: 0,
    is_cma_employee: false,
    employee_id: '',
    permanent_address: 'Colombo, Sri Lanka',
    occupation: 'Official / Admin Block',
    status: 'Confirmed',
    notes: ''
  });

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All Status') params.status = statusFilter;
      if (roomFilter !== 'All Rooms') params.room = roomFilter;

      const res = await adminGetBookings(params);
      if (res.data && res.data.status === 'success') {
        setBookings(res.data.data || []);
        setStats(res.data.stats || { total: 0, confirmed: 0, pending: 0, done: 0, cancelled: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter, roomFilter]);

  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        const [roomsResponse, settingsResponse] = await Promise.all([
          getBungalowRooms(),
          adminGetBookingSettings(),
        ]);
        setRooms(roomsResponse.data?.data || []);
        setSettings(settingsResponse.data?.data || settings);
      } catch (error) {
        console.error('Failed to load booking configuration:', error);
      }
    };
    loadConfiguration();
  }, []);

  const handleBannerUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBannerUploading(true);
    try {
      const response = await uploadFile(file, 'bookings');
      setSettings(current => ({ ...current, reference_banner: response.data.path }));
      setAlert({ text: 'Banner uploaded. Click Save Booking Settings to publish it.', type: 'success' });
    } catch (error) {
      setAlert({ text: error?.response?.data?.message || 'Banner upload failed.', type: 'danger' });
    } finally {
      setBannerUploading(false);
    }
  };

  const [pdfUploading, setPdfUploading] = useState(false);
  const handlePdfUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPdfUploading(true);
    try {
      const response = await uploadFile(file, 'bungalow_settings');
      setSettings(current => ({ ...current, payment_guideline_pdf: response.data.path }));
      setAlert({ text: 'Payment Guideline PDF uploaded. Click Save Booking Settings to publish.', type: 'success' });
    } catch (error) {
      setAlert({ text: error?.response?.data?.message || 'PDF upload failed.', type: 'danger' });
    } finally {
      setPdfUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    try {
      const response = await adminUpdateBookingSettings({
        ...settings,
        tax_rate: Number(settings.tax_rate || 0),
      });
      setSettings(response.data.data);
      setAlert({ text: response.data.message || 'Booking settings saved.', type: 'success' });
    } catch (error) {
      setAlert({ text: error?.response?.data?.message || 'Booking settings could not be saved.', type: 'danger' });
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!form.guest_name || !form.check_in || !form.check_out || form.room_ids.length === 0) {
      setAlert({ text: 'Please fill in all required fields.', type: 'danger' });
      return;
    }
    if (new Date(form.check_out) < new Date(form.check_in)) {
      setAlert({ text: 'Check-out date cannot be before check-in date.', type: 'danger' });
      return;
    }
    setSaving(true);
    setAlert({ text: '', type: '' });
    try {
      const payload = {
        ...form,
        email: form.email || 'admin@condominium.lk',
        phone: form.phone || '0112338146',
        nic: form.nic || 'BLOCK-0000',
        permanent_address: form.permanent_address || 'Colombo, Sri Lanka',
        occupation: form.occupation || 'Official / Admin Block',
        adults: Number(form.adults ?? 0),
        children: Number(form.children ?? 0),
        amount: Number(form.amount ?? 0),
        is_cma_employee: Boolean(form.is_cma_employee),
        check_in: `${form.check_in}T13:00`,
        check_out: `${form.check_out}T10:00`
      };
      const res = await adminCreateBooking(payload);
      if (res.data && res.data.status === 'success') {
        setAlert({ text: 'Manual booking / date block successfully registered!', type: 'success' });
        setModalOpen(false);
        setForm({
          guest_name: '',
          email: 'admin@condominium.lk',
          phone: '0112338146',
          nic: 'BLOCK-0000',
          room_ids: [],
          check_in: '',
          check_out: '',
          adults: 0,
          children: 0,
          amount: 0,
          is_cma_employee: false,
          employee_id: '',
          permanent_address: 'Colombo, Sri Lanka',
          occupation: 'Official / Admin Block',
          status: 'Confirmed',
          notes: ''
        });
        load();
      }
    } catch (err) {
      const backendErrors = err?.response?.data?.errors;
      let errorMsg = 'Failed to create manual booking. Overlapping reservation may exist.';
      if (backendErrors && typeof backendErrors === 'object') {
        errorMsg = Object.values(backendErrors).flat().join(' ');
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setAlert({
        text: errorMsg,
        type: 'danger'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAction = async (id, targetStatus) => {
    setAlert({ text: '', type: '' });
    try {
      const res = await adminUpdateBookingStatus(id, targetStatus);
      if (res.data && res.data.status === 'success') {
        setAlert({
          text: `Booking ${res.data.data.reference_no} status successfully updated to ${targetStatus}!`,
          type: 'success',
        });
        load();
      }
    } catch (err) {
      setAlert({
        text: err?.response?.data?.message || 'Failed to update booking status. Please try again.',
        type: 'danger',
      });
    }
  };

  const handlePaymentAction = async (id, paymentStatus) => {
    setAlert({ text: '', type: '' });
    try {
      const res = await adminUpdateBookingPaymentStatus(id, paymentStatus);
      setAlert({
        text: `Payment status for ${res.data.data.reference_no} updated to ${paymentStatus}.`,
        type: 'success',
      });
      load();
    } catch (err) {
      setAlert({ text: err?.response?.data?.message || 'Failed to update payment status.', type: 'danger' });
    }
  };

  const pendingQueue = bookings.filter((b) => b.status === 'Pending');

  // Filter bookings locally by search query as well
  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.guest_name.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.nic.toLowerCase().includes(q) ||
      (b.reference_no || '').toLowerCase().includes(q) ||
      String(b.id).includes(q)
    );
  });

  return (
    <div style={{ fontFamily: 'inherit' }}>
      
      {/* Alert block */}
      {alert.text && (
        <div
          className={`booking-alert show ${alert.type}`}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: 600,
            background: alert.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${alert.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            color: alert.type === 'success' ? '#15803d' : '#b91c1c',
          }}
        >
          {alert.text}
        </div>
      )}

      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
        <div>
          <span className="section-label" style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--crimson)', fontWeight: 700 }}>
            RESERVATION DATABASE
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '6px 0 0', color: 'var(--text-dark)' }}>
            Kataragama Booking Admin
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Process guest booking requests, verify employee IDs, and manage status lifecycles.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Add Reservation / Block
          </button>
          <button className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => window.open('/booking/kataragama', '_blank')}>
            Open Public Booking <ArrowUpRight size={14} />
          </button>
          <button className="btn btn-outline btn-sm" onClick={load}>
            Refresh Sync
          </button>
        </div>
      </div>

      {/* Public booking price and reference banner controls */}
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Image size={18} color="var(--crimson)" /> Public Booking Settings</h3>
            <p style={{ margin: '5px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>Control the banner displayed above a guest's booking reference. Room taxes (SST & VAT) are configured under Bungalow Rooms.</p>
          </div>
          <button className="btn btn-primary btn-sm" type="button" disabled={settingsSaving} onClick={handleSaveSettings} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Save size={14} /> {settingsSaving ? 'Saving...' : 'Save Booking Settings'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) minmax(260px, 1.2fr)', gap: '16px', alignItems: 'end' }}>
          <div>
            <label htmlFor="reference_banner_alt" style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Banner Description</label>
            <input id="reference_banner_alt" type="text" className="form-control" value={settings.reference_banner_alt || ''} onChange={event => setSettings({ ...settings, reference_banner_alt: event.target.value })} placeholder="Accessible image description" />
          </div>
          <div>
            <label htmlFor="reference_banner_upload" style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Reference Number Banner (Upper Section Image)</label>
            <label htmlFor="reference_banner_upload" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', minHeight: '38px' }}>
              <Upload size={14} /> {bannerUploading ? 'Uploading...' : 'Choose Banner Image'}
            </label>
            <input id="reference_banner_upload" type="file" accept="image/*" onChange={handleBannerUpload} disabled={bannerUploading} style={{ display: 'none' }} />
          </div>
        </div>

        {settings.reference_banner && (
          <div style={{ marginTop: '16px', position: 'relative' }}>
            <img src={getStorageURL(settings.reference_banner)} alt={settings.reference_banner_alt || 'Booking reference banner preview'} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #eee' }} />
            <button type="button" onClick={() => setSettings({ ...settings, reference_banner: '' })} style={{ position: 'absolute', right: '10px', top: '10px', border: 0, borderRadius: '6px', padding: '6px 9px', background: '#fff', color: '#b91c1c', cursor: 'pointer', fontWeight: 700 }}>Remove Banner</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) minmax(260px, 1.2fr)', gap: '16px', alignItems: 'end', marginTop: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '16px' }}>
          <div>
            <label htmlFor="payment_guideline_title" style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Payment Guideline Title</label>
            <input id="payment_guideline_title" type="text" className="form-control" value={settings.payment_guideline_title || ''} onChange={event => setSettings({ ...settings, payment_guideline_title: event.target.value })} placeholder="e.g. Payment Guidelines & Bank Instructions" />
          </div>
          <div>
            <label htmlFor="payment_guideline_upload" style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Payment Guideline PDF</label>
            <label htmlFor="payment_guideline_upload" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', minHeight: '38px' }}>
              <FileText size={14} /> {pdfUploading ? 'Uploading...' : 'Choose PDF Document'}
            </label>
            <input id="payment_guideline_upload" type="file" accept=".pdf,application/pdf" onChange={handlePdfUpload} disabled={pdfUploading} style={{ display: 'none' }} />
          </div>
        </div>

        {settings.payment_guideline_pdf && (
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <a href={getStorageURL(settings.payment_guideline_pdf)} target="_blank" rel="noreferrer" style={{ color: 'var(--crimson)', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'underline' }}>
              <FileText size={16} /> View Current Payment Guideline PDF
            </a>
            <button type="button" onClick={() => setSettings({ ...settings, payment_guideline_pdf: '' })} style={{ border: 0, borderRadius: '4px', padding: '4px 8px', background: '#fee2e2', color: '#991b1b', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>Remove PDF</button>
          </div>
        )}
      </div>

      {/* Stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Total Reservations</p>
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', color: 'var(--text-dark)', fontWeight: 800 }}>{stats.total}</h3>
        </div>
        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Confirmed / Approved</p>
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', color: '#1e40af', fontWeight: 800 }}>{stats.confirmed}</h3>
        </div>
        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Pending Requests</p>
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', color: '#d97706', fontWeight: 800 }}>{stats.pending}</h3>
        </div>
        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Completed / Done</p>
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', color: '#1a7f5a', fontWeight: 800 }}>{stats.done}</h3>
        </div>
      </div>

      {/* Main Grid: Queue and Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '28px' }}>
        
        {/* Pending Queue Section */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardList size={18} style={{ color: 'var(--crimson)' }} />
              Approval Queue ({pendingQueue.length})
            </h4>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Action required</span>
          </div>

          {pendingQueue.length === 0 ? (
            <div style={{ padding: '36px', textAlignment: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✅</div>
              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>No Pending Booking Requests</h5>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px' }}>All current circuit bungalow reservations have been processed.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {pendingQueue.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--off-white)',
                    border: '1.5px solid rgba(139,0,0,0.12)',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-dark)', display: 'block' }}>{item.guest_name}</strong>
                        <span style={{ fontSize: '11px', color: 'var(--crimson)', fontWeight: 800 }}>{item.reference_no}</span>
                      </div>
                      <span style={{ fontSize: '11px', background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>Pending</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      <div>🏠 <strong>{item.unit_number}</strong></div>
                      <div>📅 In: {item.check_in?.substring(0, 10)} · Out: {item.check_out?.substring(0, 10)}</div>
                      <div>📞 {item.phone} | ✉ {item.email}</div>
                      <div>🪪 NIC: {item.nic}</div>
                      <div>🏠 Address: {item.permanent_address}</div>
                      <div>💼 Occupation: {item.occupation} {item.is_cma_employee ? <span style={{ color: '#16a34a', fontWeight: 'bold' }}>(CMA/Ministry Staff)</span> : ''}</div>
                      <div>💰 Price: Rs. {Number(item.subtotal ?? item.amount).toLocaleString()} + Tax Rs. {Number(item.tax_amount ?? 0).toLocaleString()} = <strong>Rs. {Number(item.amount).toLocaleString()}</strong></div>
                      <div>💳 Payment: <strong style={{ color: item.payment_status === 'Paid' ? '#15803d' : '#b45309' }}>{item.payment_status || 'Pending'}</strong></div>
                      {item.gov_letter && (
                        <div style={{ margin: '3px 0' }}>
                          📄 Letter: <a href={getStorageURL(item.gov_letter)} target="_blank" rel="noreferrer" style={{ color: 'var(--crimson)', fontWeight: 'bold', textDecoration: 'underline' }}>Download Official Letter</a>
                        </div>
                      )}
                      {item.employee_id && <div style={{ color: 'var(--crimson)', fontWeight: 600 }}>🪪 Employee ID: {item.employee_id}</div>}
                      
                      {/* Dynamic accompanying family members list */}
                      {item.family_members && item.family_members.length > 0 && (
                        <div style={{ marginTop: '8px', borderTop: '1px dashed #ddd', paddingTop: '6px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '11px', color: 'var(--text-dark)' }}>Accompanying Members ({item.family_count}):</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', background: 'var(--off-white)', border: '1px solid var(--mid-gray)', borderRadius: '6px', padding: '6px', fontSize: '11px', marginTop: '4px' }}>
                            {item.family_members.map((m, idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>• {m.name}</span>
                                <span style={{ color: 'var(--text-muted)' }}>NIC: {m.nic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.notes && <div style={{ background: '#f3f4f6', padding: '6px', borderRadius: '4px', marginTop: '6px', fontStyle: 'italic' }}>"{item.notes}"</div>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', marginTop: '14px', flexWrap: 'wrap' }}>
                    <button
                      className="admin-action-btn approve"
                      style={{ background: '#1a7f5a', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      onClick={() => handleAction(item.id, 'Confirmed')}
                    >
                      <Check size={12} /> Approve
                    </button>
                    <button
                      className="admin-action-btn done"
                      style={{ background: '#1e40af', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      onClick={() => handleAction(item.id, 'Done')}
                    >
                      <CheckSquare size={12} /> Complete
                    </button>
                    <button
                      className="admin-action-btn cancel"
                      style={{ background: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      onClick={() => handleAction(item.id, 'Cancelled')}
                    >
                      <X size={12} /> Cancel
                    </button>
                    {item.payment_status !== 'Paid' && (
                      <button
                        style={{ background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        onClick={() => handlePaymentAction(item.id, 'Paid')}
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Primary All Bookings Table */}
        <div className="admin-table-card">
          <div className="admin-table-head">
            <h3 style={{ margin: 0 }}>All Kataragama Reservations</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                <input
                  id="bookings-search"
                  name="bookings_search"
                  aria-label="Search"
                  type="text"
                  placeholder="Search guest or NIC..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '6px 10px 6px 28px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--mid-gray)',
                    fontSize: '12.5px',
                    outline: 'none',
                    width: '200px',
                  }}
                />
              </div>
              <select
                id="statusFilter"
                name="statusFilter"
                aria-label="Filter by Status"
                className="admin-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All Status">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Done">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select
                id="roomFilter"
                name="roomFilter"
                aria-label="Filter by Room"
                className="admin-filter-select"
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
              >
                <option value="All Rooms">All Rooms</option>
                {rooms.map(room => <option key={room.id} value={room.name}>{room.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="bookings-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Guest Info</th>
                  <th>Unit</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading reservations...</td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '24px', textAlignment: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No matching reservations found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 700, color: 'var(--crimson)' }}>
                        {item.reference_no}
                      </td>
                      <td>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-dark)', display: 'block' }}>{item.guest_name}</strong>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>NIC: {item.nic} | Phone: {item.phone}</span>
                      </td>
                      <td>
                        <span className="badge badge-crimson" style={{ fontSize: '11.5px', background: 'rgba(139,0,0,.06)', color: 'var(--crimson)', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>{item.unit_number}</span>
                      </td>
                      <td>{item.check_in?.substring(0, 10)}</td>
                      <td>{item.check_out?.substring(0, 10)}</td>
                      <td style={{ fontWeight: 700 }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>Price: Rs. {Number(item.subtotal ?? item.amount).toLocaleString()}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>Tax: Rs. {Number(item.tax_amount ?? 0).toLocaleString()}</div>
                        <div style={{ color: 'var(--crimson)' }}>Final: Rs. {Number(item.amount).toLocaleString()}</div>
                      </td>
                      <td>
                        <select
                          value={item.payment_status || 'Pending'}
                          onChange={(event) => handlePaymentAction(item.id, event.target.value)}
                          style={{ padding: '4px 6px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '11.5px', fontWeight: 700 }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Waived">Waived</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </td>
                      <td>
                        <span
                          className="bk-status"
                          style={{
                            background: `${statusColors[item.status]}15`,
                            color: statusColors[item.status],
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '11.5px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                          {item.status === 'Done' ? 'Completed' : item.status}
                        </span>
                      </td>
                      <td className="action-cell" style={{ justifyContent: 'center' }}>
                        <button
                          className="btn btn-outline btn-xs"
                          style={{ padding: '4px 8px', fontSize: '11px', color: '#1a7f5a', borderColor: '#1a7f5a' }}
                          disabled={item.status === 'Confirmed'}
                          onClick={() => handleAction(item.id, 'Confirmed')}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-outline btn-xs"
                          style={{ padding: '4px 8px', fontSize: '11px', color: '#1e40af', borderColor: '#1e40af' }}
                          disabled={item.status === 'Done'}
                          onClick={() => handleAction(item.id, 'Done')}
                        >
                          Complete
                        </button>
                        <button
                          className="btn btn-outline btn-xs"
                          style={{ padding: '4px 8px', fontSize: '11px', color: '#dc2626', borderColor: '#dc2626' }}
                          disabled={item.status === 'Cancelled'}
                          onClick={() => handleAction(item.id, 'Cancelled')}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* SimpleModal for manual booking/blocking */}
      <SimpleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Reservation / Block Dates">
        <form onSubmit={handleCreateBooking}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }} htmlFor="guest_name">Guest Name / Purpose *</label><input id="guest_name" name="guest_name" className="form-control" type="text" placeholder="e.g. Blocked for maintenance / John Doe" value={form.guest_name} onChange={e => setForm({ ...form, guest_name: e.target.value })} required />
            </div>
            <div className="form-group">
              <span className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>Room(s) * — select one or more</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '8px' }}>
                {rooms.map(room => {
                  const selected = form.room_ids.includes(room.id);
                  return (
                    <label key={room.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: `1px solid ${selected ? 'var(--crimson)' : '#ddd'}`, background: selected ? 'rgba(139,0,0,.05)' : '#fff', padding: '9px', borderRadius: '7px', cursor: 'pointer', fontSize: '12.5px' }}>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => setForm({ ...form, room_ids: selected ? form.room_ids.filter(id => id !== room.id) : [...form.room_ids, room.id] })}
                      />
                      <span><strong>{room.name}</strong><br /><small style={{ color: 'var(--text-muted)' }}>Public Rs. {Number(room.price).toLocaleString()}</small></span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }} htmlFor="check_in">Check-In Date *</label><input id="check_in" name="check_in" className="form-control" type="date" value={form.check_in} onChange={e => setForm({ ...form, check_in: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }} htmlFor="check_out">Check-Out Date *</label><input id="check_out" name="check_out" className="form-control" type="date" value={form.check_out} onChange={e => setForm({ ...form, check_out: e.target.value })} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }} htmlFor="email">Email</label><input id="email" name="email" className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }} htmlFor="phone">Phone</label><input id="phone" name="phone" className="form-control" type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }} htmlFor="nic">NIC / Ref</label><input id="nic" name="nic" className="form-control" type="text" value={form.nic} onChange={e => setForm({ ...form, nic: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }} htmlFor="adults">Adults</label><input id="adults" name="adults" className="form-control" type="number" min="0" value={form.adults} onChange={e => setForm({ ...form, adults: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }} htmlFor="children">Children</label><input id="children" name="children" className="form-control" type="number" min="0" value={form.children} onChange={e => setForm({ ...form, children: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }} htmlFor="amount">Booking Price before Tax (LKR)</label><input id="amount" name="amount" className="form-control" type="number" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} />
              <small style={{ display: 'block', marginTop: '5px', color: 'var(--text-muted)' }}>Room taxes (SST 2.25% & VAT 18%) and additional charges will be calculated on save based on room settings.</small>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }} htmlFor="occupation">Occupation / Category</label><input id="occupation" name="occupation" className="form-control" type="text" value={form.occupation} onChange={e => setForm({ ...form, occupation: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }} htmlFor="status">Status</label><select id="status" name="status" aria-label="Select Status" className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="Confirmed">Confirmed (Approved)</option>
                <option value="Pending">Pending Approval</option>
                <option value="Done">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }} htmlFor="permanent_address">Permanent Address</label><input id="permanent_address" name="permanent_address" className="form-control" type="text" value={form.permanent_address} onChange={e => setForm({ ...form, permanent_address: e.target.value })} />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center', height: '100%', paddingTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                <input id="is_cma_employee" name="is_cma_employee" type="checkbox" checked={form.is_cma_employee} onChange={e => setForm({ ...form, is_cma_employee: e.target.checked })} style={{ width: 18, height: 18 }} />
                <span>CMA / Ministry Employee</span>
              </label>
              {form.is_cma_employee && (
                <input id="employee_id" name="employee_id" className="form-control" type="text" placeholder="Employee ID" value={form.employee_id || ''} onChange={e => setForm({ ...form, employee_id: e.target.value })} />
              )}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }} htmlFor="notes">Notes / Block Reason</label><textarea id="notes" name="notes" className="form-control" rows="3" placeholder="e.g. Blocked for renovation work..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Register Reservation'}</button>
          </div>
        </form>
      </SimpleModal>

    </div>
  );
}
