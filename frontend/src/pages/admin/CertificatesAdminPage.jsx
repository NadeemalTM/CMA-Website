import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Plus, Edit, Trash2, X, FileText, Upload, DollarSign, List, Shield, Download, FileCheck, CheckCircle } from 'lucide-react';
import { 
  adminCertificateTypes, 
  adminCertificateDocuments, 
  adminGetCertificatePayments,
  uploadFile
} from '../../services/api';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1f2937' }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

export default function CertificatesAdminPage() {
  const { t } = useTranslation();
  
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

  // Main Loader
  const loadAll = async () => {
    setLoading(true);
    await loadTypes();
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
    } catch (e) {
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
      const res = await uploadFile(file);
      setDocForm(prev => ({
        ...prev,
        file_path: res.data.path,
        file_name: file.name,
        file_type: file.name.split('.').pop().toUpperCase()
      }));
    } catch (err) {
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
    } catch (e) {
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

      {/* Tabs Selector */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
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
                    <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
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
                      <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{t.order}</td>
                        <td style={{ padding: '0.75rem 1rem' }}><code style={{ background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px', color: 'var(--crimson)' }}>{t.code}</code></td>
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
                    style={{ padding: '0.4rem 1rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none' }}
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
                      <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Order</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Document Title (English)</th>
                        <th style={{ padding: '0.85rem 1rem' }}>File Details</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docs.map(d => (
                        <tr key={d.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{d.order}</td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{d.title_en}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <FileText size={16} color="var(--crimson)" />
                              <a href={`/storage/${d.file_path}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: '#1d4ed8', fontWeight: 500 }}>
                                {d.file_name}
                              </a>
                              <span style={{ fontSize: '0.7rem', color: '#64748b', background: '#f1f5f9', padding: '0.1rem 0.3rem', borderRadius: '4px', textTransform: 'uppercase' }}>
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
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#1f2937' }}>Citizen Purchase Log</h3>
              
              <div className="card" style={{ overflow: 'auto' }}>
                {payments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748b' }}>
                    No document payment history found.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '0.85rem 1rem' }}>Reference No</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Certificate Type</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Citizen Name &amp; Email</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Amount</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Paid At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--crimson)' }}>{p.reference_no}</td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{p.certificate}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ fontWeight: 600, color: '#1f2937' }}>{p.citizen_name}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.citizen_email}</div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#15803d' }}>
                            LKR {Number(p.amount).toLocaleString()}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span className="badge badge-success" style={{ textTransform: 'uppercase' }}>
                              {p.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                            {p.paid_at ? new Date(p.paid_at).toLocaleString() : '—'}
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
            <label className="form-label">Unique Code (PPC, provisional, semi, final)</label>
            <input 
              className="form-control" 
              value={typeForm.code} 
              onChange={e => setTypeForm({ ...typeForm, code: e.target.value.toLowerCase().replace(/\s+/g, '') })}
              disabled={!!editingType}
              placeholder="e.g. ppc" 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Sort Order</label>
            <input 
              type="number" 
              className="form-control" 
              value={typeForm.order} 
              onChange={e => setTypeForm({ ...typeForm, order: parseInt(e.target.value) || 1 })} 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Title ({langTab.toUpperCase()})</label>
          <input 
            className="form-control" 
            value={typeForm[`title_${langTab}`] || ''} 
            onChange={e => setTypeForm({ ...typeForm, [`title_${langTab}`]: e.target.value })} 
            placeholder={`Enter title in ${langTab === 'en' ? 'English' : langTab === 'si' ? 'Sinhala' : 'Tamil'}`}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Instructions ({langTab.toUpperCase()})</label>
          <textarea 
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
            <label className="form-label">Document Access Fee (LKR)</label>
            <input 
              type="number" 
              className="form-control" 
              value={typeForm.document_fee} 
              onChange={e => setTypeForm({ ...typeForm, document_fee: parseFloat(e.target.value) || 0 })} 
            />
          </div>
          <div className="form-group" style={{ paddingBottom: '0.8rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
              <input 
                type="checkbox" 
                checked={typeForm.is_active} 
                onChange={e => setTypeForm({ ...typeForm, is_active: e.target.checked })} 
              />
              <span>Is Active / Visible</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
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
          <label className="form-label">Associated Certificate Category</label>
          <select 
            value={docForm.certificate_type_id} 
            onChange={e => setDocForm({ ...docForm, certificate_type_id: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}
          >
            {types.map(t => (
              <option key={t.id} value={t.id}>{t.title_en}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Document Title ({langTab.toUpperCase()})</label>
          <input 
            className="form-control" 
            value={docForm[`title_${langTab}`] || ''} 
            onChange={e => setDocForm({ ...docForm, [`title_${langTab}`]: e.target.value })} 
            placeholder="e.g. PPC Guidebook Part 1"
          />
        </div>

        {/* File Upload Selector */}
        <div className="form-group" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1.5px dashed #cbd5e1', marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', cursor: 'pointer' }}>
            <Upload size={18} color="var(--crimson)" />
            <span>Upload Document File (PDF, DOCX, etc.)</span>
          </label>
          <input 
            type="file" 
            onChange={handleFileUpload} 
            disabled={uploading} 
            style={{ marginTop: '0.5rem' }} 
          />
          {uploading && <div style={{ fontSize: '0.8rem', color: 'var(--crimson)', marginTop: '0.5rem', fontWeight: 600 }}>Uploading file...</div>}
          
          {docForm.file_path && (
            <div style={{ marginTop: '1rem', background: '#fff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} color="#22c55e" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {docForm.file_name}
                </span>
                <span style={{ fontSize: '0.7rem', background: '#f1f5f9', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                  {docForm.file_type}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>Uploaded</span>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group">
            <label className="form-label">Sort Order</label>
            <input 
              type="number" 
              className="form-control" 
              value={docForm.order} 
              onChange={e => setDocForm({ ...docForm, order: parseInt(e.target.value) || 1 })} 
            />
          </div>
          <div className="form-group" style={{ paddingBottom: '0.8rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
              <input 
                type="checkbox" 
                checked={docForm.is_active} 
                onChange={e => setDocForm({ ...docForm, is_active: e.target.checked })} 
              />
              <span>Is Active / Downloadable</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
          <button className="btn btn-outline" onClick={() => setDocModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveDoc} disabled={saving || uploading}>
            {saving ? 'Saving...' : 'Save Document'}
          </button>
        </div>
      </SimpleModal>

    </div>
  );
}
