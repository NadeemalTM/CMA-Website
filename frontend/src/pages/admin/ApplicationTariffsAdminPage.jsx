import { useState, useEffect } from 'react';
import { adminApplicationTariffs } from '../../services/api';
import { Plus, Edit, Trash2, Banknote, X } from 'lucide-react';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 600, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

export default function ApplicationTariffsAdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ category: '', description_en: '', fee: 0, remarks: '', order: 0, is_active: true });
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); adminApplicationTariffs.list().then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm({ category: 'General Registrations', description_en: '', fee: 0, remarks: '', order: 0, is_active: true }); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ category: item.category || '', description_en: item.description_en || '', fee: item.fee || 0, remarks: item.remarks || '', order: item.order || 0, is_active: item.is_active ?? true }); setModal(true); };
  
  const handleSave = async () => { 
    setSaving(true); 
    try { 
      if (editing) await adminApplicationTariffs.update(editing.id, form); 
      else await adminApplicationTariffs.create(form); 
      setModal(false); 
      load(); 
    } catch (e) { 
      alert(e.response?.data?.message || 'Error saving tariff'); 
    } finally { 
      setSaving(false); 
    } 
  };
  
  const handleDelete = async (id) => { 
    if (!window.confirm('Are you sure you want to delete this fee?')) return; 
    try { 
      await adminApplicationTariffs.remove(id); 
      load(); 
    } catch (e) { 
      alert('Error deleting fee'); 
    } 
  };

  const categories = [...new Set(items.map(i => i.category))];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Banknote size={24} color="var(--crimson)" /> Application Fees & Tariffs
        </h1>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Fee</button>
      </div>

      {loading ? <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {categories.map(cat => (
            <div key={cat} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1rem', background: 'var(--off-white)', borderBottom: '1px solid var(--light-gray)', fontWeight: 'bold' }}>
                {cat}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', background: '#fafafa', borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Description / Extent</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Fee (LKR)</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Remarks</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Order</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Active</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.filter(i => i.category === cat).sort((a,b) => a.order - b.order).map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>{item.description_en}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: 'var(--crimson)' }}>{Number(item.fee).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#666' }}>{item.remarks || '-'}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{item.order}</td>
                      <td style={{ padding: '0.75rem 1rem' }}><span className={`badge badge-${item.is_active ? 'success' : 'warning'}`}>{item.is_active ? 'Yes' : 'No'}</span></td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}><Edit size={14} /></button>
                          <button className="btn btn-sm" style={{ color: 'var(--error)', border: '1px solid var(--error)' }} onClick={() => handleDelete(item.id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      <SimpleModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Fee' : 'Add Fee'}>
        <div className="form-group">
          <label className="form-label">Category (Table Name)</label>
          <input className="form-control" list="categories" value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Renewal Certificate charges" />
          <datalist id="categories">
            {categories.map(c => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div className="form-group">
          <label className="form-label">Description / Extent (m2)</label>
          <input className="form-control" value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})} placeholder="e.g. Up to 1,000" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Fee Amount (LKR)</label>
            <input className="form-control" type="number" step="0.01" value={form.fee} onChange={e => setForm({...form, fee: parseFloat(e.target.value) || 0})} />
          </div>
          <div className="form-group">
            <label className="form-label">Sort Order</label>
            <input className="form-control" type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Remarks (Optional)</label>
          <input className="form-control" value={form.remarks || ''} onChange={e => setForm({...form, remarks: e.target.value})} placeholder="e.g. + LKR 500 per additional unit" />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} /> Active
          </label>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Fee'}</button>
        </div>
      </SimpleModal>
    </div>
  );
}
