import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Snowflake, X, Image as ImageIcon, Save, Upload } from 'lucide-react';
import { adminBungalowRooms, adminGetBungalowHeroImages, adminUpdateBungalowHeroImage, uploadFile, getStorageURL } from '../../services/api';

let AdminLayout;
try {
  AdminLayout = require('../../components/admin/AdminLayout').default;
} catch {
  AdminLayout = ({ children, title }) => (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: '#8B0000', color: '#fff', padding: '1rem 2rem', fontWeight: 700, fontSize: '1.25rem' }}>
        CMA Admin — {title}
      </div>
      <div style={{ padding: '2rem' }}>{children}</div>
    </div>
  );
}

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
    <div style={{ relative: 'relative', position: 'relative', background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#111' }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#666' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

const Toast = ({ msg, type }) => msg ? (
  <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999, background: type === 'error' ? '#c53030' : '#276749', color: '#fff', padding: '0.75rem 1.25rem', borderRadius: 8, fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', fontSize: '0.9rem' }}>
    {msg}
  </div>
) : null;

const inputStyle = { width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' };
const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem', marginTop: '0.75rem' };

const EMPTY_FORM = {
  name: '',
  beds: '',
  capacity: '',
  ac: true,
  view: '',
  emoji: '🛏️',
  price: '',
  emp_price: '',
  additional_charge: '',
  additional_charge_label: '',
  sst_rate: '2.25',
  vat_rate: '18.00',
  image: '',
};

const HERO_SLOTS = [
  { slot: 'background', label: 'Hero Background', help: 'Wide background behind the hero content.' },
  { slot: 'gallery_1', label: 'Feature Image 1', help: 'First image shown at the right of the hero.' },
  { slot: 'gallery_2', label: 'Feature Image 2', help: 'Second image shown at the right of the hero.' },
  { slot: 'gallery_3', label: 'Feature Image 3', help: 'Third image shown at the right of the hero.' },
];

const emptyHeroImages = () => Object.fromEntries(
  HERO_SLOTS.map(({ slot }) => [slot, { slot, image: '', alt_text: '', is_active: true }])
);

export default function BungalowRoomsAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [heroImages, setHeroImages] = useState(emptyHeroImages);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroSaving, setHeroSaving] = useState('');
  const [heroUploading, setHeroUploading] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminBungalowRooms.list();
      setItems(res.data?.data || []);
    } catch {
      showToast('Failed to load bungalow rooms', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadHeroImages = async () => {
    setHeroLoading(true);
    try {
      const res = await adminGetBungalowHeroImages();
      const next = emptyHeroImages();
      (res.data?.data || []).forEach((image) => {
        if (next[image.slot]) next[image.slot] = image;
      });
      setHeroImages(next);
    } catch {
      showToast('Failed to load hero images', 'error');
    } finally {
      setHeroLoading(false);
    }
  };

  useEffect(() => {
    load();
    loadHeroImages();
  }, []);

  const updateHeroField = (slot, field, value) => {
    setHeroImages((current) => ({
      ...current,
      [slot]: { ...current[slot], [field]: value },
    }));
  };

  const handleHeroUpload = async (slot, event) => {
    const file = event.target.files[0];
    if (!file) return;
    setHeroUploading(slot);
    try {
      const res = await uploadFile(file, 'bungalow_rooms');
      updateHeroField(slot, 'image', res.data.path);
      showToast('Hero image uploaded. Press Save Image to publish it.');
    } catch {
      showToast('Hero image upload failed', 'error');
    } finally {
      setHeroUploading('');
    }
  };

  const saveHeroImage = async (slot) => {
    const image = heroImages[slot];
    if (!image.image) {
      showToast('Choose an image before saving', 'error');
      return;
    }
    setHeroSaving(slot);
    try {
      await adminUpdateBungalowHeroImage(slot, {
        image: image.image,
        alt_text: image.alt_text || '',
        is_active: Boolean(image.is_active),
      });
      showToast(`${HERO_SLOTS.find((item) => item.slot === slot)?.label} updated successfully`);
      loadHeroImages();
    } catch (error) {
      showToast(error?.response?.data?.message || 'Failed to save hero image', 'error');
    } finally {
      setHeroSaving('');
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || '',
      beds: item.beds || '',
      capacity: item.capacity || '',
      ac: Boolean(item.ac),
      view: item.view || '',
      emoji: item.emoji || '🛏️',
      price: item.price || '',
      emp_price: item.emp_price || '',
      additional_charge: item.additional_charge || '',
      additional_charge_label: item.additional_charge_label || '',
      sst_rate: item.sst_rate !== undefined && item.sst_rate !== null ? String(item.sst_rate) : '2.25',
      vat_rate: item.vat_rate !== undefined && item.vat_rate !== null ? String(item.vat_rate) : '18.00',
      image: item.image || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bungalow room? This will clear all details.')) return;
    try {
      await adminBungalowRooms.remove(id);
      showToast('Room successfully deleted');
      load();
    } catch (e) {
      showToast(e?.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      emp_price: Number(form.emp_price),
      additional_charge: Number(form.additional_charge || 0),
      additional_charge_label: form.additional_charge_label || null,
      sst_rate: form.sst_rate !== '' && form.sst_rate !== null && !isNaN(Number(form.sst_rate)) ? Number(form.sst_rate) : 2.25,
      vat_rate: form.vat_rate !== '' && form.vat_rate !== null && !isNaN(Number(form.vat_rate)) ? Number(form.vat_rate) : 18.00,
      ac: Boolean(form.ac),
    };

    try {
      if (editing) {
        await adminBungalowRooms.update(editing.id, payload);
        showToast('Room details updated successfully');
      } else {
        await adminBungalowRooms.create(payload);
        showToast('New bungalow room created successfully');
      }
      setModalOpen(false);
      load();
    } catch (e) {
      showToast(e?.response?.data?.message || 'Failed to save details', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadFile(file, 'bungalow_rooms');
      setForm((f) => ({ ...f, image: res.data.path }));
      showToast('Room image uploaded successfully');
    } catch (err) {
      showToast('Image upload failed', 'error');
    }
  };

  return (
    <div className="admin-page-content" style={{ padding: "0.5rem" }}>
      <Toast msg={toast.msg} type={toast.type} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <span className="section-label" style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--crimson)', fontWeight: 700 }}>
            ASSET MANAGEMENT
          </span>
          <h2 style={{ margin: '6px 0 0', fontSize: '1.4rem', fontWeight: 800, color: '#111' }}>Bungalow Rooms & Details</h2>
          <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
            Configure and update bungalow rooms, bed arrangements, views, prices, and uploadable photos.
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.1rem', background: '#8B0000', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
        >
          <Plus size={16} /> Add New Room
        </button>
      </div>

      {/* Kataragama hero image manager */}
      <section style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef2f2', color: '#8B0000' }}>
            <ImageIcon size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#111' }}>Kataragama Hero Images</h3>
            <p style={{ margin: '0.15rem 0 0', color: '#6b7280', fontSize: '0.8rem' }}>Upload and publish the background and three feature images displayed on the public booking page.</p>
          </div>
        </div>

        {heroLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Loading hero images…</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {HERO_SLOTS.map(({ slot, label, help }) => {
              const image = heroImages[slot];
              return (
                <div key={slot} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '0.85rem', background: '#fafafa' }}>
                  <div style={{ height: 130, borderRadius: 8, overflow: 'hidden', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {image.image ? (
                      <img src={getStorageURL(image.image)} alt={image.alt_text || label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ImageIcon size={28} color="#9ca3af" />
                    )}
                  </div>
                  <h4 style={{ margin: '0.75rem 0 0.1rem', color: '#111', fontSize: '0.9rem' }}>{label}</h4>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.72rem', minHeight: 32 }}>{help}</p>

                  <label style={{ ...labelStyle, marginTop: '0.65rem' }} htmlFor={`hero-${slot}`}>Image File</label>
                  <label htmlFor={`hero-${slot}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem', border: '1px dashed #9ca3af', borderRadius: 7, cursor: 'pointer', color: '#4b5563', fontSize: '0.78rem', background: '#fff' }}>
                    <Upload size={14} /> {heroUploading === slot ? 'Uploading…' : 'Choose Image'}
                  </label>
                  <input id={`hero-${slot}`} type="file" accept="image/*" disabled={heroUploading === slot} onChange={(event) => handleHeroUpload(slot, event)} style={{ display: 'none' }} />

                  <label style={labelStyle} htmlFor={`alt-${slot}`}>Alternative Text</label>
                  <input id={`alt-${slot}`} style={inputStyle} value={image.alt_text || ''} onChange={(event) => updateHeroField(slot, 'alt_text', event.target.value)} placeholder="Describe this image" />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.7rem' }}>
                    <input id={`active-${slot}`} type="checkbox" checked={Boolean(image.is_active)} onChange={(event) => updateHeroField(slot, 'is_active', event.target.checked)} />
                    <label htmlFor={`active-${slot}`} style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 600 }}>Show on website</label>
                  </div>

                  <button type="button" onClick={() => saveHeroImage(slot)} disabled={heroSaving === slot || heroUploading === slot} style={{ width: '100%', marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.55rem', border: 'none', borderRadius: 7, background: '#8B0000', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: heroSaving === slot ? 0.65 : 1 }}>
                    <Save size={14} /> {heroSaving === slot ? 'Saving…' : 'Save Image'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Datatable */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Photo Preview', 'Room Name', 'Arrangement / View', 'A/C Status', 'Rates / Night', 'Taxes (SST/VAT)', 'Additional Charge', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>Loading room data…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>No rooms configured. Seeding default setup next request...</td></tr>
            ) : items.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                
                {/* Photo / Emoji Preview */}
                <td style={{ padding: '0.75rem 1rem' }}>
                  {item.image ? (
                    <img
                      src={getStorageURL(item.image)}
                      alt={item.name}
                      style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      display: item.image ? 'none' : 'flex',
                      width: '56px', height: '42px', background: '#f3f4f6',
                      alignItems: 'center', justifyContent: 'center',
                      borderRadius: '4px', fontSize: '1.25rem',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    {item.emoji || '🛏️'}
                  </div>
                </td>

                {/* Name */}
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#111' }}>
                  {item.name}
                </td>

                {/* Meta Details */}
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#4b5563' }}>
                  <div style={{ fontWeight: 600 }}>{item.beds} ({item.capacity})</div>
                  <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>🌴 {item.view}</div>
                </td>

                {/* AC Status */}
                <td style={{ padding: '0.75rem 1rem' }}>
                  {item.ac ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: '#e0f2fe', color: '#0369a1' }}>
                      <Snowflake size={11} /> A/C
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: '#f3f4f6', color: '#6b7280' }}>
                      Non-A/C
                    </span>
                  )}
                </td>

                {/* Rates */}
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                  <div><strong>Standard:</strong> Rs. {Number(item.price).toLocaleString()}</div>
                  <div style={{ color: 'var(--crimson)', fontSize: '0.8rem' }}><strong>Staff:</strong> Rs. {Number(item.emp_price).toLocaleString()}</div>
                </td>

                {/* Taxes */}
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                  <div><strong>SST:</strong> {item.sst_rate !== undefined && item.sst_rate !== null ? item.sst_rate : 2.25}%</div>
                  <div><strong>VAT:</strong> {item.vat_rate !== undefined && item.vat_rate !== null ? item.vat_rate : 18.00}%</div>
                </td>

                {/* Additional Charge */}
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                  {Number(item.additional_charge) > 0 ? (
                    <div>
                      <div style={{ fontWeight: 600 }}>Rs. {Number(item.additional_charge).toLocaleString()}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>{item.additional_charge_label || 'Additional'}</div>
                    </div>
                  ) : (
                    <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>—</span>
                  )}
                </td>

                {/* Actions */}
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEdit(item)} style={{ padding: '0.4rem 0.65rem', background: '#eff6ff', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#1d4ed8' }}><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(item.id)} style={{ padding: '0.4rem 0.65rem', background: '#fff5f5', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#dc2626' }}><Trash2 size={14} /></button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Modal */}
      <SimpleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Room Setup' : 'Add Bungalow Room'}>
        <form onSubmit={handleSave}>
          
          <div className="bk-form-row">
            <div className="bk-form-group">
              <label style={labelStyle} htmlFor="name">Room Name *</label><input id="name" name="name" style={inputStyle} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="e.g. Room A – Deluxe" />
            </div>
            <div className="bk-form-group">
              <label style={labelStyle} htmlFor="beds">Beds Arrangement *</label><input id="beds" name="beds" style={inputStyle} value={form.beds} onChange={(e) => setForm((f) => ({ ...f, beds: e.target.value }))} required placeholder="e.g. 1 King Bed" />
            </div>
          </div>

          <div className="bk-form-row">
            <div className="bk-form-group">
              <label style={labelStyle} htmlFor="capacity">Max Capacity *</label><input id="capacity" name="capacity" style={inputStyle} value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} required placeholder="e.g. 2 Adults" />
            </div>
            <div className="bk-form-group">
              <label style={labelStyle} htmlFor="view">Room View *</label><input id="view" name="view" style={inputStyle} value={form.view} onChange={(e) => setForm((f) => ({ ...f, view: e.target.value }))} required placeholder="e.g. Garden View" />
            </div>
          </div>

          <div className="bk-form-row">
            <div className="bk-form-group">
              <label style={labelStyle} htmlFor="price">Room Price (Standard) *</label><input id="price" name="price" type="number" style={inputStyle} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required placeholder="6000" />
            </div>
            <div className="bk-form-group">
              <label style={labelStyle} htmlFor="emp_price">Staff Price (Discounted) *</label><input id="emp_price" name="emp_price" type="number" style={inputStyle} value={form.emp_price} onChange={(e) => setForm((f) => ({ ...f, emp_price: e.target.value }))} required placeholder="4800" />
            </div>
          </div>

          <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '14px', border: '1px solid #bbf7d0', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '1rem' }}>🏛️</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>Room Tax Configuration</span>
            </div>
            <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#15803d' }}>
              SST is calculated on Room Price. VAT is calculated on (Room Price + SST).
            </p>
            <div className="bk-form-row">
              <div className="bk-form-group">
                <label style={labelStyle} htmlFor="sst_rate">SST Tax Rate (%)</label>
                <input id="sst_rate" name="sst_rate" type="number" step="0.01" min="0" max="100" style={inputStyle} value={form.sst_rate} onChange={(e) => setForm((f) => ({ ...f, sst_rate: e.target.value }))} placeholder="2.25" />
              </div>
              <div className="bk-form-group">
                <label style={labelStyle} htmlFor="vat_rate">VAT Tax Rate (%)</label>
                <input id="vat_rate" name="vat_rate" type="number" step="0.01" min="0" max="100" style={inputStyle} value={form.vat_rate} onChange={(e) => setForm((f) => ({ ...f, vat_rate: e.target.value }))} placeholder="18.00" />
              </div>
            </div>
          </div>

          <div style={{ background: '#fffbeb', borderRadius: 10, padding: '14px', border: '1px solid #fde68a', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>💰</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e' }}>Additional Charge (One-time fee per stay, not subject to tax)</span>
            </div>
            <div className="bk-form-row">
              <div className="bk-form-group">
                <label style={labelStyle} htmlFor="additional_charge_label">Charge Label</label><input id="additional_charge_label" name="additional_charge_label" style={inputStyle} value={form.additional_charge_label} onChange={(e) => setForm((f) => ({ ...f, additional_charge_label: e.target.value }))} placeholder="e.g. Laundry Fee, Service Charge" />
              </div>
              <div className="bk-form-group">
                <label style={labelStyle} htmlFor="additional_charge">Charge Amount (Rs.)</label><input id="additional_charge" name="additional_charge" type="number" step="0.01" min="0" style={inputStyle} value={form.additional_charge} onChange={(e) => setForm((f) => ({ ...f, additional_charge: e.target.value }))} placeholder="0" />
              </div>
            </div>
          </div>

          <div className="bk-form-row" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
            <div className="bk-form-group">
              <label style={labelStyle} htmlFor="emoji">Room Emoji Fallback *</label><select id="emoji" name="emoji" style={inputStyle} value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))} required>
                <option value="🛋️">🛋️ Living Room Setup</option>
                <option value="🏠">🏠 Full Bungalow View</option>
                <option value="🌿">🌿 Guesthouse Garden</option>
              </select>
            </div>
            <div className="bk-form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.75rem' }}>
              <input type="checkbox" id="roomAc" checked={form.ac} onChange={(e) => setForm((f) => ({ ...f, ac: e.target.checked }))} style={{ width: 18, height: 18, marginRight: 8, cursor: 'pointer' }} />
              <label htmlFor="roomAc" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Air Conditioned (A/C)</label>
            </div>
          </div>

          <div style={{ background: '#f9f9f9', borderRadius: 10, padding: '14px', border: '1px solid #e5e7eb', marginTop: '10px' }}>
            <label style={{ ...labelStyle, marginTop: 0 }}>Room Photo File</label>
            <input type="file" accept="image/*" onChange={handleUpload} style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.8rem' }} />
            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.3rem' }}>Or File Path:</div>
            <input id="image" name="image" style={inputStyle} value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="uploads/filename.png" />
            {form.image && (
              <img
                src={getStorageURL(form.image)}
                alt="Room Preview"
                style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 8, marginTop: '10px', border: '1px solid #e5e7eb' }}
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '0.6rem 1.2rem', border: '1.5px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', background: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding: '0.6rem 1.4rem', background: '#8B0000', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving…' : (editing ? 'Update Room' : 'Create Room')}
            </button>
          </div>

        </form>
      </SimpleModal>

    </div>
  );
}



