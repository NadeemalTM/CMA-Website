import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Landmark, Plus, Edit, Trash2, X, Search, Filter, Settings } from 'lucide-react';
import { adminMcFees, updateMcFeeSettings } from '../../services/api';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 700, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

export default function McFeesAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  // Tax settings state
  const [settings, setSettings] = useState({
    tax1_name: 'NBT',
    tax1_rate: 2.00,
    tax2_name: 'VAT',
    tax2_rate: 12.00
  });
  const [settingsModal, setSettingsModal] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    tax1_name: 'NBT',
    tax1_rate: '2.00',
    tax2_name: 'VAT',
    tax2_rate: '12.00'
  });
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [form, setForm] = useState({
    description_en: '',
    description_si: '',
    description_ta: '',
    category: 'registration',
    fee: '0.00',
    nbt: '0.00',
    vat: '0.00',
    order: 1,
    is_active: true
  });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminMcFees.list()
      .then(r => {
        setItems(r.data.data || []);
        if (r.data.settings) {
          setSettings(r.data.settings);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  
  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm({
      description_en: '',
      description_si: '',
      description_ta: '',
      category: 'registration',
      fee: '0.00',
      nbt: '0.00',
      vat: '0.00',
      order: items.length + 1,
      is_active: true
    });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      description_en: item.description_en || '',
      description_si: item.description_si || '',
      description_ta: item.description_ta || '',
      category: item.category || 'registration',
      fee: String(item.fee),
      nbt: String(item.nbt),
      vat: String(item.vat),
      order: item.order || 1,
      is_active: item.is_active ?? true
    });
    setModal(true);
  };

  const openSettings = () => {
    setSettingsForm({
      tax1_name: settings.tax1_name || 'NBT',
      tax1_rate: String(settings.tax1_rate || '2.00'),
      tax2_name: settings.tax2_name || 'VAT',
      tax2_rate: String(settings.tax2_rate || '12.00')
    });
    setSettingsModal(true);
  };

  const handleSaveSettings = async () => {
    if (!settingsForm.tax1_name.trim() || !settingsForm.tax2_name.trim()) {
      alert('Tax names are required.');
      return;
    }

    setSavingSettings(true);
    try {
      const response = await updateMcFeeSettings({
        tax1_name: settingsForm.tax1_name,
        tax1_rate: parseFloat(settingsForm.tax1_rate) || 0,
        tax2_name: settingsForm.tax2_name,
        tax2_rate: parseFloat(settingsForm.tax2_rate) || 0
      });
      if (response.data.status === 'success') {
        setSettings(response.data.settings);
        setSettingsModal(false);
        alert(response.data.message || 'Tax configurations saved successfully.');
        load();
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Error saving tax configurations.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSave = async () => {
    if (!form.description_en.trim()) {
      alert('Description (English) is required.');
      return;
    }

    setSaving(true);
    try {
      const data = {
        ...form,
        fee: parseFloat(form.fee) || 0,
        nbt: parseFloat(form.nbt) || 0,
        vat: parseFloat(form.vat) || 0,
        order: parseInt(form.order) || 1,
        is_active: !!form.is_active
      };

      if (editing) {
        await adminMcFees.update(editing.id, data);
      } else {
        await adminMcFees.create(data);
      }
      setModal(false);
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Error saving data.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirm_delete') || 'Are you sure you want to delete this item?')) return;
    try {
      await adminMcFees.remove(id);
      load();
    } catch (e) {
      alert('Error deleting');
    }
  };

  // Helper calculation for display
  const calculatedTotal = (
    (parseFloat(form.fee) || 0) + 
    (parseFloat(form.nbt) || 0) + 
    (parseFloat(form.vat) || 0)
  ).toFixed(2);

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      (item.description_en || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description_si || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description_ta || '').toLowerCase().includes(search.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '2rem' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Landmark size={24} style={{ color: 'var(--crimson)' }} />
            {t('admin.mc_fees') || 'MC Registration Fees'}
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage statutory fees and dynamic tax configurations for Management Corporations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" onClick={openSettings} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Settings size={16} /> Tax Settings
          </button>
          <button className="btn btn-primary" onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Plus size={16} /> {t('admin.add') || 'Add New'}
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-control"
            style={{ paddingLeft: '2.25rem' }}
            placeholder="Search fees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-control"
            style={{ width: '200px' }}
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="application">Application Form Fee</option>
            <option value="registration">Registration Fee Tiers</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex-center" style={{ padding: '4rem' }}>
          <div className="spinner" />
        </div>
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--off-white)', textAlign: 'left' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Description</th>
                <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Fee (LKR)</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>{settings.tax1_name} ({parseFloat(settings.tax1_rate)}%)</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>{settings.tax2_name} ({parseFloat(settings.tax2_rate)}%)</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Total (LKR)</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Order</th>
                <th style={{ padding: '0.85rem 1rem' }}>Active</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 600 }}>{item.description_en}</div>
                      {item.description_si && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.description_si}</div>}
                      {item.description_ta && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.description_ta}</div>}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge badge-${item.category === 'application' ? 'info' : 'secondary'}`}>
                        {item.category === 'application' ? 'Application Form' : 'Registration Tier'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 500 }}>
                      {parseFloat(item.fee).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-muted)' }}>
                      {parseFloat(item.nbt).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-muted)' }}>
                      {parseFloat(item.vat).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--crimson)' }}>
                      {parseFloat(item.total).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{item.order}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge badge-${item.is_active ? 'success' : 'warning'}`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)} title="Edit">
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-sm" style={{ color: 'var(--error)', border: '1px solid var(--error)' }} onClick={() => handleDelete(item.id)} title="Delete">
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

      {/* Edit / Add Modal */}
      <SimpleModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Fee Item' : 'Add Fee Item'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Description Fields */}
          <div className="form-group">
            <label className="form-label">Description (English) *</label>
            <input
              className="form-control"
              value={form.description_en}
              onChange={e => setForm({ ...form, description_en: e.target.value })}
              placeholder="e.g., 10 Parcels"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (Sinhala)</label>
            <input
              className="form-control"
              value={form.description_si}
              onChange={e => setForm({ ...form, description_si: e.target.value })}
              placeholder="e.g., කොටස් 10"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (Tamil)</label>
            <input
              className="form-control"
              value={form.description_ta}
              onChange={e => setForm({ ...form, description_ta: e.target.value })}
              placeholder="e.g., 10 அலகுகள்"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Category selection */}
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-control"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                <option value="application">Application Form Fee</option>
                <option value="registration">Registration Fee Tier</option>
              </select>
            </div>

            {/* Display Order */}
            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input
                className="form-control"
                type="number"
                value={form.order}
                onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Fee / Tax Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Base Fee (LKR) *</label>
              <input
                className="form-control"
                type="number"
                step="0.01"
                min="0"
                value={form.fee}
                onChange={e => {
                  const val = e.target.value;
                  const feeFloat = parseFloat(val) || 0;
                  setForm({
                    ...form,
                    fee: val,
                    nbt: (feeFloat * (parseFloat(settings.tax1_rate) / 100)).toFixed(2),
                    vat: (feeFloat * (parseFloat(settings.tax2_rate) / 100)).toFixed(2)
                  });
                }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{settings.tax1_name} ({settings.tax1_rate}%)</label>
              <input
                className="form-control"
                type="number"
                step="0.01"
                min="0"
                value={form.nbt}
                onChange={e => setForm({ ...form, nbt: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{settings.tax2_name} ({settings.tax2_rate}%)</label>
              <input
                className="form-control"
                type="number"
                step="0.01"
                min="0"
                value={form.vat}
                onChange={e => setForm({ ...form, vat: e.target.value })}
              />
            </div>
          </div>

          {/* calculated total preview */}
          <div style={{
            background: 'var(--off-white)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--mid-gray)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 600 }}>Computed Total (LKR):</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--crimson)' }}>
              {calculatedTotal}
            </span>
          </div>

          {/* active toggle */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={e => setForm({ ...form, is_active: e.target.checked })}
            />
            <label htmlFor="is_active" style={{ margin: 0, fontWeight: 500, cursor: 'pointer' }}>
              Active (Visible on public website)
            </label>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button className="btn btn-outline" onClick={() => setModal(false)}>
              {t('admin.cancel') || 'Cancel'}
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : (t('admin.save') || 'Save')}
            </button>
          </div>
        </div>
      </SimpleModal>

      {/* Tax Settings Configuration Modal */}
      <SimpleModal isOpen={settingsModal} onClose={() => setSettingsModal(false)} title="Configure Tax Settings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Updating tax configurations will automatically recalculate NBT, VAT, and Totals for all registered condominium fees in the database.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderBottom: '1px solid var(--light-gray)', paddingBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Tax 1 Name *</label>
              <input
                className="form-control"
                value={settingsForm.tax1_name}
                onChange={e => setSettingsForm({ ...settingsForm, tax1_name: e.target.value })}
                placeholder="e.g. NBT"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tax 1 Percentage (%) *</label>
              <input
                className="form-control"
                type="number"
                step="0.01"
                min="0"
                value={settingsForm.tax1_rate}
                onChange={e => setSettingsForm({ ...settingsForm, tax1_rate: e.target.value })}
                placeholder="e.g. 2.00"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Tax 2 Name *</label>
              <input
                className="form-control"
                value={settingsForm.tax2_name}
                onChange={e => setSettingsForm({ ...settingsForm, tax2_name: e.target.value })}
                placeholder="e.g. VAT"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tax 2 Percentage (%) *</label>
              <input
                className="form-control"
                type="number"
                step="0.01"
                min="0"
                value={settingsForm.tax2_rate}
                onChange={e => setSettingsForm({ ...settingsForm, tax2_rate: e.target.value })}
                placeholder="e.g. 12.00"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button className="btn btn-outline" onClick={() => setSettingsModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveSettings} disabled={savingSettings}>
              {savingSettings ? 'Recalculating...' : 'Update & Recalculate'}
            </button>
          </div>
        </div>
      </SimpleModal>
    </div>
  );
}
