/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Award, Plus, Edit, Trash2, X, FileText, Upload, DollarSign, List, CheckCircle, Save, Image } from 'lucide-react';
import { 
  adminCertificateTypes, 
  adminCertificateDocuments, 
  adminGetCertificatePayments,
  adminUpdateCertificatePaymentStatus,
  adminGetCertificateSettings,
  adminUpdateCertificateSettings,
  uploadFile,
  getStorageURL
} from '../../services/api';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--light-gray)', paddingBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1f2937' }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

export default function CertificatesAdminPage() {
  // Tabs: 'types' | 'documents' | 'payments'
  const [activeTab, setActiveTab] = useState('types');
  const [langTab, setLangTab] = useState('en');

  // Core Data
  const [types, setTypes] = useState([]);
  const [docs, setDocs] = useState([]);
  const [payments, setPayments] = useState([]);
  
  // Loading & Action States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({ reference_banner: '', reference_banner_alt: '', payment_guideline_pdf: '', payment_guideline_title: '' });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);

  const loadSettings = async () => {
    try {
      const res = await adminGetCertificateSettings();
      if (res.data?.data) setSettings(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    try {
      const res = await adminUpdateCertificateSettings(settings);
      setSettings(res.data.data);
      alert(res.data.message || 'Settings saved successfully.');
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleBannerUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBannerUploading(true);
    try {
      const res = await uploadFile(file, 'certificates');
      setSettings((prev) => ({ ...prev, reference_banner: res.data.path }));
    } catch (e) {
      alert('Banner upload failed.');
    } finally {
      setBannerUploading(false);
    }
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPdfUploading(true);
    try {
      const res = await uploadFile(file, 'certificates');
      setSettings((prev) => ({ ...prev, payment_guideline_pdf: res.data.path }));
    } catch (e) {
      alert('PDF upload failed.');
    } finally {
      setPdfUploading(false);
    }
  };

  // Selected Type filter for Documents Tab
  const [selectedTypeId, setSelectedTypeId] = useState('');

  // Modals
  const [typeModal, setTypeModal] = useState(false);
  const [docModal, setDocModal] = useState(false);
  
  // Edit forms
  const [editingType, setEditingType] = useState(null);
  const [typeForm, setTypeForm] = useState({
    code: '',
    title_en: '',
    title_si: '',
    title_ta: '',
    instructions_en: '',
    instructions_si: '',
    instructions_ta: '',
    document_fee: 0,
    order: 1,
    is_active: true
  });

  const [editingDoc, setEditingDoc] = useState(null);
  const [docForm, setDocForm] = useState({
    certificate_type_id: '',
    title_en: '',
    title_si: '',
    title_ta: '',
    file_path: '',
    file_name: '',
    file_type: '',
    order: 1,
    is_active: true
  });

  // Load Certificate Types
  const loadTypes = async () => {
    try {
      const res = await adminCertificateTypes.list();
      setTypes(res.data.data || []);
      if (res.data.data && res.data.data.length > 0 && !selectedTypeId) {
        setSelectedTypeId(res.data.data[0].id.toString());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Load Documents based on selection
  const loadDocs = async (typeId = selectedTypeId) => {
    if (!typeId) return;
    try {
      const res = await adminCertificateDocuments.list({ certificate_type_id: typeId });
      setDocs(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  // Load Payments
  const loadPayments = async () => {
    try {
      const res = await adminGetCertificatePayments();
      setPayments(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const reviewPayment = async (payment, status) => {
    const promptText = status === 'paid'
      ? `Mark ${payment.reference_no} as paid and release its documents?`
      : `Reject payment request ${payment.reference_no}?`;
    if (!window.confirm(promptText)) return;

    try {
      await adminUpdateCertificatePaymentStatus(payment.id, status);
      await loadPayments();
    } catch (error) {
      alert(error?.response?.data?.message || 'Unable to update the payment review.');
    }
  };

  // Main Loader
  const loadAll = async () => {
    setLoading(true);
    await loadTypes();
    await loadSettings();
    if (activeTab === 'documents') {
      await loadDocs();
    } else if (activeTab === 'payments') {
      await loadPayments();
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'documents' && selectedTypeId) {
      loadDocs(selectedTypeId);
    }
  }, [selectedTypeId]);

  // Certificate Type Actions
  const openNewType = () => {
    setEditingType(null);
    setTypeForm({
      code: '',
      title_en: '',
      title_si: '',
      title_ta: '',
      instructions_en: '',
      instructions_si: '',
      instructions_ta: '',
      document_fee: 0,
      order: types.length + 1,
      is_active: true
    });
    setLangTab('en');
    setTypeModal(true);
  };

  const openEditType = (type) => {
    setEditingType(type);
    setTypeForm({
      code: type.code || '',
      title_en: type.title_en || '',
      title_si: type.title_si || '',
      title_ta: type.title_ta || '',
      instructions_en: type.instructions_en || '',
      instructions_si: type.instructions_si || '',
      instructions_ta: type.instructions_ta || '',
      document_fee: type.document_fee || 0,
      order: type.order || 1,
      is_active: type.is_active ?? true
    });
    setLangTab('en');
    setTypeModal(true);
  };

  const handleSaveType = async () => {
    setSaving(true);
    try {
      if (editingType) {
        await adminCertificateTypes.update(editingType.id, typeForm);
      } else {
        await adminCertificateTypes.create(typeForm);
      }
      setTypeModal(false);
      loadTypes();
    } catch (e) {
      alert(e.response?.data?.message || 'Error saving certificate type.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteType = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate type? This will delete all attached documents.')) return;
    try {
      await adminCertificateTypes.remove(id);
      loadTypes();
    } catch {
      alert('Error deleting certificate type.');
    }
  };

  // Certificate Document Actions
  const openNewDoc = () => {
    setEditingDoc(null);
    setDocForm({
      certificate_type_id: selectedTypeId,
      title_en: '',
      title_si: '',
      title_ta: '',
      file_path: '',
      file_name: '',
      file_type: '',
      order: docs.length + 1,
      is_active: true
    });
    setLangTab('en');
    setDocModal(true);
  };

  const openEditDoc = (doc) => {
    setEditingDoc(doc);
    setDocForm({
      certificate_type_id: doc.certificate_type_id || selectedTypeId,
      title_en: doc.title_en || '',
      title_si: doc.title_si || '',
      title_ta: doc.title_ta || '',
      file_path: doc.file_path || '',
      file_name: doc.file_name || '',
      file_type: doc.file_type || '',
      order: doc.order || 1,
      is_active: doc.is_active ?? true
    });
    setLangTab('en');
    setDocModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file, 'certificates');
      setDocForm(prev => ({
        ...prev,
        file_path: res.data.path,
        file_name: file.name,
        file_type: file.name.split('.').pop().toUpperCase()
      }));
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDoc = async () => {
    if (!docForm.file_path) {
      alert('Please upload a document file.');
      return;
    }
    setSaving(true);
    try {
      if (editingDoc) {
        await adminCertificateDocuments.update(editingDoc.id, docForm);
      } else {
        await adminCertificateDocuments.create(docForm);
      }
      setDocModal(false);
      loadDocs(selectedTypeId);
    } catch (e) {
      alert(e.response?.data?.message || 'Error saving document.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await adminCertificateDocuments.remove(id);
      loadDocs(selectedTypeId);
    } catch {
      alert('Error deleting document.');
    }
  };

  const languages = [
    { key: 'en', label: 'English' },
    { key: 'si', label: 'සිංහල' },
    { key: 'ta', label: 'தமிழ்' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={28} color="var(--crimson)" />
            <span>Condominium Certificate Management</span>
          </h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Manage the application process, fees, guide files, and monitor payments.
          </p>
        </div>
      </div>

      {/* Certificate Settings Box */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Image size={18} color="var(--crimson)" /> Public Certificate Settings
            </h3>
            <p style={{ margin: '5px 0 0', fontSize: '12.5px', color: '#64748b' }}>
              Control the upper section banner and payment guidelines PDF displayed to citizens on Certificate Applications.
            </p>
          </div>
          <button className="btn btn-primary btn-sm" type="button" disabled={settingsSaving} onClick={handleSaveSettings} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Save size={14} /> {settingsSaving ? 'Saving...' : 'Save Certificate Settings'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) minmax(260px, 1.2fr)', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Banner Description</label>
            <input type="text" className="form-control" value={settings.reference_banner_alt || ''} onChange={event => setSettings({ ...settings, reference_banner_alt: event.target.value })} placeholder="Accessible image description" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Reference Banner Image (Upper Section)</label>
            <label htmlFor="cert_banner_upload" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', minHeight: '38px' }}>
              <Upload size={14} /> {bannerUploading ? 'Uploading...' : 'Choose Banner Image'}
            </label>
            <input id="cert_banner_upload" type="file" accept="image/*" onChange={handleBannerUpload} disabled={bannerUploading} style={{ display: 'none' }} />
          </div>
        </div>

        {settings.reference_banner && (
          <div style={{ marginTop: '16px', position: 'relative' }}>
            <img src={getStorageURL(settings.reference_banner)} alt={settings.reference_banner_alt || 'Certificate banner'} style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #eee' }} />
            <button type="button" onClick={() => setSettings({ ...settings, reference_banner: '' })} style={{ position: 'absolute', right: '10px', top: '10px', border: 0, borderRadius: '6px', padding: '6px 9px', background: '#fff', color: '#b91c1c', cursor: 'pointer', fontWeight: 700 }}>Remove Banner</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) minmax(260px, 1.2fr)', gap: '16px', alignItems: 'end', marginTop: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Payment Guideline Title</label>
            <input type="text" className="form-control" value={settings.payment_guideline_title || ''} onChange={event => setSettings({ ...settings, payment_guideline_title: event.target.value })} placeholder="e.g. Certificate Payment Guidelines & Instructions" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Payment Guideline PDF</label>
            <label htmlFor="cert_pdf_upload" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', minHeight: '38px' }}>
              <FileText size={14} /> {pdfUploading ? 'Uploading...' : 'Choose PDF Document'}
            </label>
            <input id="cert_pdf_upload" type="file" accept=".pdf,application/pdf" onChange={handlePdfUpload} disabled={pdfUploading} style={{ display: 'none' }} />
          </div>
        </div>

        {settings.payment_guideline_pdf && (
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <a href={getStorageURL(settings.payment_guideline_pdf)} target="_blank" rel="noreferrer" style={{ color: 'var(--crimson)', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'underline' }}>
              <FileText size={16} /> View Current Guideline PDF
            </a>
            <button type="button" onClick={() => setSettings({ ...settings, payment_guideline_pdf: '' })} style={{ border: 0, borderRadius: '4px', padding: '4px 8px', background: '#fee2e2', color: '#991b1b', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>Remove PDF</button>
          </div>
        )}
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--mid-gray)', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('types')}
          style={{
            padding: '0.5rem 1rem', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: 700, 
            color: activeTab === 'types' ? 'var(--crimson)' : '#64748b',
            borderBottom: activeTab === 'types' ? '3px solid var(--crimson)' : 'none',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}
        >
          <List size={16} />
          <span>Certificate Types</span>
        </button>
        <button 
          onClick={() => setActiveTab('documents')}
          style={{
            padding: '0.5rem 1rem', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: 700, 
            color: activeTab === 'documents' ? 'var(--crimson)' : '#64748b',
            borderBottom: activeTab === 'documents' ? '3px solid var(--crimson)' : 'none',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}
        >
          <FileText size={16} />
          <span>Attached Documents</span>
        </button>
        <button 
          onClick={() => setActiveTab('payments')}
          style={{
            padding: '0.5rem 1rem', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: 700, 
            color: activeTab === 'payments' ? 'var(--crimson)' : '#64748b',
            borderBottom: activeTab === 'payments' ? '3px solid var(--crimson)' : 'none',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}
        >
          <DollarSign size={16} />
          <span>Citizen Payments</span>
        </button>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
          <div className="spinner" />
        </div>
      ) : (
        <div>
          
          {/* TAB 1: Certificate Types */}
          {activeTab === 'types' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1f2937' }}>All Certificate Categories</h3>
                <button className="btn btn-primary" onClick={openNewType}>
                  <Plus size={16} /> Add Certificate Type
                </button>
              </div>

              <div className="card" style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--off-white)', textAlign: 'left', borderBottom: '2px solid var(--mid-gray)' }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Order</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Code</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Title (English)</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Document Access Fee</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {types.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--mid-gray)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{t.order}</td>
                        <td style={{ padding: '0.75rem 1rem' }}><code style={{ background: 'var(--light-gray)', padding: '0.2rem 0.4rem', borderRadius: '4px', color: 'var(--crimson)' }}>{t.code}</code></td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{t.title_en}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--gold)' }}>
                          LKR {Number(t.document_fee).toLocaleString()}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span className={`badge badge-${t.is_active ? 'success' : 'warning'}`}>
                            {t.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-outline btn-sm" onClick={() => openEditType(t)}><Edit size={14} /></button>
                            <button className="btn btn-sm" style={{ color: 'var(--error)', border: '1px solid var(--error)' }} onClick={() => handleDeleteType(t.id)}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Certificate Documents */}
          {activeTab === 'documents' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Filter Type:</label>
                  <select 
                    value={selectedTypeId} 
                    onChange={e => setSelectedTypeId(e.target.value)}
                    style={{ padding: '0.4rem 1rem', borderRadius: '8px', border: '1.5px solid var(--mid-gray)', outline: 'none' }}
                  >
                    {types.map(t => (
                      <option key={t.id} value={t.id}>{t.title_en}</option>
                    ))}
                  </select>
                </div>
                <button className="btn btn-primary" onClick={openNewDoc} disabled={!selectedTypeId}>
                  <Plus size={16} /> Attach Document
                </button>
              </div>

              <div className="card" style={{ overflow: 'auto' }}>
                {docs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748b' }}>
                    No downloadable documents attached to this certificate type yet.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--off-white)', textAlign: 'left', borderBottom: '2px solid var(--mid-gray)' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Order</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Document Title (English)</th>
                        <th style={{ padding: '0.85rem 1rem' }}>File Details</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docs.map(d => (
                        <tr key={d.id} style={{ borderBottom: '1px solid var(--mid-gray)' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{d.order}</td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{d.title_en}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <FileText size={16} color="var(--crimson)" />
                              <a href={getStorageURL(d.file_path)} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: '#1d4ed8', fontWeight: 500 }}>
                                {d.file_name}
                              </a>
                              <span style={{ fontSize: '0.7rem', color: '#64748b', background: 'var(--light-gray)', padding: '0.1rem 0.3rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                                {d.file_type}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span className={`badge badge-${d.is_active ? 'success' : 'warning'}`}>
                              {d.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button className="btn btn-outline btn-sm" onClick={() => openEditDoc(d)}><Edit size={14} /></button>
                              <button className="btn btn-sm" style={{ color: 'var(--error)', border: '1px solid var(--error)' }} onClick={() => handleDeleteDoc(d.id)}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Certificate Payments */}
          {activeTab === 'payments' && (
            <div>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#1f2937' }}>Certificate Payment Review Queue</h3>
              
              <div className="card" style={{ overflow: 'auto' }}>
                {payments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748b' }}>
                    No document payment history found.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--off-white)', textAlign: 'left', borderBottom: '2px solid var(--mid-gray)' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Reference No</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Certificate Type</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Applicant Details</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Amount</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Paid At</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Review Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--mid-gray)' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--crimson)' }}>{p.reference_no}</td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{p.certificate}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ fontWeight: 600, color: '#1f2937' }}>{p.application_data?.applicant_name || p.citizen_name}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.application_data?.email || p.citizen_email}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>NIC/Passport: {p.application_data?.nic_or_passport || '—'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Phone: {p.application_data?.phone || '—'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Address: {p.application_data?.address || '—'}</div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#15803d' }}>
                            LKR {Number(p.amount).toLocaleString()}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span className={`badge ${p.status === 'completed' ? 'badge-success' : p.status === 'failed' ? 'badge-danger' : 'badge-warning'}`} style={{ textTransform: 'uppercase' }}>
                              {p.status === 'completed' ? 'PAID' : p.status === 'failed' ? 'REJECTED' : 'PENDING'}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                            {p.paid_at ? new Date(p.paid_at).toLocaleString() : '—'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              <button className="btn btn-primary btn-xs" disabled={p.status === 'completed'} onClick={() => reviewPayment(p, 'paid')}>Mark Paid</button>
                              <button className="btn btn-outline btn-xs" disabled={p.status === 'failed'} onClick={() => reviewPayment(p, 'rejected')} style={{ color: '#b91c1c', borderColor: '#b91c1c' }}>Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ── MODAL: ADD/EDIT CERTIFICATE TYPE ── */}
      <SimpleModal isOpen={typeModal} onClose={() => setTypeModal(false)} title={editingType ? 'Edit Certificate Type' : 'Add Certificate Type'}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {languages.map(l => (
            <button 
              key={l.key} 
              className={`btn btn-sm ${langTab === l.key ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setLangTab(l.key)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="type_code" className="form-label" htmlFor="type_code" htmlFor="type_code">Unique Code (PPC, provisional, semi, final)</label><input 
              id="type_code"
              name="type_code"
              className="form-control" 
              value={typeForm.code} 
              onChange={e => setTypeForm({ ...typeForm, code: e.target.value.toLowerCase().replace(/\s+/g, '') })}
              disabled={!!editingType}
              placeholder="e.g. ppc" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="type_order" className="form-label" htmlFor="type_order" htmlFor="type_order">Sort Order</label><input 
              id="type_order"
              name="type_order"
              type="number" 
              className="form-control" 
              value={typeForm.order} 
              onChange={e => setTypeForm({ ...typeForm, order: parseInt(e.target.value) || 1 })} 
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor={`type_title_${langTab}`} className="form-label">Title ({langTab.toUpperCase()})</label>
          <input 
            id={`type_title_${langTab}`}
            name={`type_title_${langTab}`}
            className="form-control" 
            value={typeForm[`title_${langTab}`] || ''} 
            onChange={e => setTypeForm({ ...typeForm, [`title_${langTab}`]: e.target.value })} 
            placeholder={`Enter title in ${langTab === 'en' ? 'English' : langTab === 'si' ? 'Sinhala' : 'Tamil'}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor={`type_instructions_${langTab}`} className="form-label">Instructions ({langTab.toUpperCase()})</label>
          <textarea 
            id={`type_instructions_${langTab}`}
            name={`type_instructions_${langTab}`}
            className="form-control" 
            rows={8}
            value={typeForm[`instructions_${langTab}`] || ''} 
            onChange={e => setTypeForm({ ...typeForm, [`instructions_${langTab}`]: e.target.value })} 
            placeholder={`Type guidelines simply. HTML is supported but not required.

Formatting Guide:
# For main title headings (e.g., # Requirements)
- Or * for bullet points (e.g., - Item 1)
1. For numbered points (e.g., 1. Item 1)

Double press 'Enter' to separate paragraphs with a blank line.`}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group">
            <label htmlFor="type_document_fee" className="form-label" htmlFor="type_document_fee" htmlFor="type_document_fee">Document Access Fee (LKR)</label><input 
              id="type_document_fee"
              name="type_document_fee"
              type="number" 
              className="form-control" 
              value={typeForm.document_fee} 
              onChange={e => setTypeForm({ ...typeForm, document_fee: parseFloat(e.target.value) || 0 })} 
            />
          </div>
          <div className="form-group" style={{ paddingBottom: '0.8rem' }}>
            <label htmlFor="type_is_active" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
              <input 
                id="type_is_active"
                name="type_is_active"
                type="checkbox" 
                checked={typeForm.is_active} 
                onChange={e => setTypeForm({ ...typeForm, is_active: e.target.checked })} 
              />
              <span>Is Active / Visible</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--light-gray)', paddingTop: '1rem' }}>
          <button className="btn btn-outline" onClick={() => setTypeModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveType} disabled={saving}>
            {saving ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </SimpleModal>

      {/* ── MODAL: ATTACH DOCUMENT ── */}
      <SimpleModal isOpen={docModal} onClose={() => setDocModal(false)} title={editingDoc ? 'Edit Attached Document' : 'Attach New Document'}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {languages.map(l => (
            <button 
              key={l.key} 
              className={`btn btn-sm ${langTab === l.key ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setLangTab(l.key)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="certificate_type_id" className="form-label" htmlFor="certificate_type_id" htmlFor="certificate_type_id">Associated Certificate Category</label><select 
            id="certificate_type_id"
            name="certificate_type_id"
            value={docForm.certificate_type_id} 
            onChange={e => setDocForm({ ...docForm, certificate_type_id: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1.5px solid var(--mid-gray)' }}
          >
            {types.map(t => (
              <option key={t.id} value={t.id}>{t.title_en}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor={`doc_title_${langTab}`} className="form-label">Document Title ({langTab.toUpperCase()})</label>
          <input 
            id={`doc_title_${langTab}`}
            name={`doc_title_${langTab}`}
            className="form-control" 
            value={docForm[`title_${langTab}`] || ''} 
            onChange={e => setDocForm({ ...docForm, [`title_${langTab}`]: e.target.value })} 
            placeholder="e.g. PPC Guidebook Part 1"
          />
        </div>

        {/* File Upload Selector */}
        <div className="form-group" style={{ background: 'var(--off-white)', padding: '1.5rem', borderRadius: '12px', border: '1.5px dashed var(--mid-gray)', marginBottom: '1.5rem' }}>
          <label htmlFor="upload_cert_doc" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', cursor: 'pointer' }}>
            <Upload size={18} color="var(--crimson)" />
            <span>Upload Document File (PDF, DOCX, etc.)</span>
          </label>
          <input 
            id="upload_cert_doc"
            name="upload_cert_doc"
            type="file" 
            onChange={handleFileUpload} 
            disabled={uploading} 
            style={{ marginTop: '0.5rem' }} 
          />
          {uploading && <div style={{ fontSize: '0.8rem', color: 'var(--crimson)', marginTop: '0.5rem', fontWeight: 600 }}>Uploading file...</div>}
          
          {docForm.file_path && (
            <div style={{ marginTop: '1rem', background: '#fff', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--mid-gray)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#22c55e" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {docForm.file_name}
                </span>
                <span style={{ fontSize: '0.7rem', background: 'var(--light-gray)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                  {docForm.file_type}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>Uploaded</span>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group">
            <label htmlFor="doc_order" className="form-label" htmlFor="doc_order" htmlFor="doc_order">Sort Order</label><input 
              id="doc_order"
              name="doc_order"
              type="number" 
              className="form-control" 
              value={docForm.order} 
              onChange={e => setDocForm({ ...docForm, order: parseInt(e.target.value) || 1 })} 
            />
          </div>
          <div className="form-group" style={{ paddingBottom: '0.8rem' }}>
            <label htmlFor="doc_is_active" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
              <input 
                id="doc_is_active"
                name="doc_is_active"
                type="checkbox" 
                checked={docForm.is_active} 
                onChange={e => setDocForm({ ...docForm, is_active: e.target.checked })} 
              />
              <span>Is Active / Downloadable</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--light-gray)', paddingTop: '1rem' }}>
          <button className="btn btn-outline" onClick={() => setDocModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveDoc} disabled={saving || uploading}>
            {saving ? 'Saving...' : 'Save Document'}
          </button>
        </div>
      </SimpleModal>

    </div>
  );
}


