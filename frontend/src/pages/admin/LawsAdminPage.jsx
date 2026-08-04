import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Edit2, Trash2, FileText, Upload, BookOpen, X } from 'lucide-react';
import api, { getStorageURL } from '../../services/api';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--dark-gray)' }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)' }}>
          <X size={24} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default function LawsAdminPage() {
  const { t } = useTranslation();
  const [laws, setLaws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', description: '', order: 0, is_active: true });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchLaws = async () => {
    try {
      const res = await api.get('/admin/laws');
      setLaws(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaws();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description || '');
    fd.append('order', formData.order || 0);
    fd.append('is_active', formData.is_active ? 1 : 0);
    if (file) {
      fd.append('file', file);
    }

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (formData.id) {
        await api.post(`/admin/laws/${formData.id}`, fd, config);
      } else {
        await api.post('/admin/laws', fd, config);
      }
      setShowModal(false);
      setFile(null);
      fetchLaws();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Error saving law.';
      const errors = err.response?.data?.errors;
      if (errors) {
        alert(msg + '\n' + Object.values(errors).flat().join('\n'));
      } else {
        alert(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this law?')) return;
    try {
      await api.delete(`/admin/laws/${id}`);
      fetchLaws();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (law = null) => {
    if (law) {
      setFormData({ ...law, is_active: law.is_active == 1 });
    } else {
      setFormData({ id: null, title: '', description: '', order: 0, is_active: true });
    }
    setFile(null);
    setShowModal(true);
  };

  const filteredLaws = laws.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={24} style={{ color: 'var(--crimson)' }} />
            Condominium Laws Management
          </h1>
          <p style={{ margin: 0, color: 'var(--gray)', fontSize: '0.95rem' }}>
            Manage the laws and acts displayed on the public site, and attach their PDF documents.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add New Law
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
          <input
            id="laws-search"
            name="laws_search"
            aria-label="Search"
            type="text"
            className="form-control"
            placeholder="Search laws..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '35px' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" />
        </div>
      ) : (
        <div className="card" style={{ overflow: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--off-white)', textAlign: 'left', borderBottom: '1px solid var(--light-gray)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Order</th>
                <th style={{ padding: '0.85rem 1rem' }}>Title & Description</th>
                <th style={{ padding: '0.85rem 1rem' }}>PDF File</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLaws.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray)' }}>No laws found.</td>
                </tr>
              ) : (
                filteredLaws.map((law) => (
                  <tr key={law.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--gray)' }}>{law.order}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--dark-gray)', marginBottom: '0.25rem' }}>{law.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>{law.description}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {law.file_path ? (
                        <a href={getStorageURL(law.file_path)} target="_blank" rel="noreferrer" className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                          <FileText size={12} /> View PDF
                        </a>
                      ) : (
                        <span className="badge" style={{ background: 'var(--light-gray)', color: 'var(--gray)' }}>No File</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge badge-${law.is_active ? 'success' : 'warning'}`}>
                        {law.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openModal(law)} title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-sm" style={{ color: 'var(--error)', border: '1px solid var(--error)' }} onClick={() => handleDelete(law.id)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <SimpleModal isOpen={showModal} onClose={() => setShowModal(false)} title={formData.id ? 'Edit Law' : 'Add New Law'}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Law Title *</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>Display Order</label>
              <input
                type="number"
                className="form-control"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: e.target.value})}
              />
            </div>
            
            <div className="form-group" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1.5rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--crimson)' }}
                />
                Active (Visible to Public)
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Upload PDF Document</label>
            <div style={{ padding: '1.5rem', border: '2px dashed var(--mid-gray)', borderRadius: '8px', textAlign: 'center', background: 'var(--off-white)' }}>
              <Upload size={32} style={{ color: 'var(--gray)', marginBottom: '0.5rem' }} />
              <div style={{ marginBottom: '0.5rem' }}>
                <label htmlFor="laws_pdf_upload" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                  Choose PDF File
                  <input id="laws_pdf_upload" name="laws_pdf_upload" type="file" style={{ display: 'none' }} accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
                </label>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray)', margin: 0 }}>Max file size: 20MB</p>
              
              {file && (
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'var(--success)', fontWeight: 600 }}>
                  Selected: {file.name}
                </p>
              )}
              {formData.file_path && !file && (
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Current file exists. Uploading a new one will replace it.
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Law'}
            </button>
          </div>
        </form>
      </SimpleModal>
    </div>
  );
}
