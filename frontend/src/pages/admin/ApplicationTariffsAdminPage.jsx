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
  const [form, setForm] = useState({ item_no: '', category: '', description_en: '', scale: '', fee: 0, fee_display: '', remarks: '', order: 0, is_active: true });
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); adminApplicationTariffs.list().then(r => setItems(r.data.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm({ item_no: '', category: 'General Registrations', description_en: '', scale: '', fee: 0, fee_display: '', remarks: '', order: 0, is_active: true }); setModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ item_no: item.item_no || '', category: item.category || '', description_en: item.description_en || '', scale: item.scale || '', fee: item.fee || 0, fee_display: item.fee_display || '', remarks: item.remarks || '', order: item.order || 0, is_active: item.is_active ?? true }); setModal(true); };
  
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
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '900px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', background: '#fafafa', borderBottom: '1px solid #eee' }}>
                      <th style={{ padding: '0.85rem 1rem', width: '8%', textAlign: 'center' }}>Item No.</th>
                      <th style={{ padding: '0.85rem 1rem', width: '37%' }}>Description of Fee / Regulation</th>
                      <th style={{ padding: '0.85rem 1rem', width: '15%' }}>Category / Scale</th>
                      <th style={{ padding: '0.85rem 1rem', width: '12%', textAlign: 'right' }}>Prescribed Fee (LKR)</th>
                      <th style={{ padding: '0.85rem 1rem', width: '15%' }}>Remarks</th>
                      <th style={{ padding: '0.85rem 1rem', width: '5%' }}>Order</th>
                      <th style={{ padding: '0.85rem 1rem', width: '8%' }}>Active</th>
                      <th style={{ padding: '0.85rem 1rem', width: '8%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.filter(i => i.category === cat).sort((a,b) => a.order - b.order).map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--light-gray)' }}>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#666' }}>{item.item_no || '-'}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{item.description_en}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#555' }}>{item.scale || '-'}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: 'var(--crimson)', textAlign: 'right' }}>
                          {item.fee_display ? item.fee_display : Number(item.fee).toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </td>
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
            </div>
          ))}
        </div>
      )}

      <SimpleModal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Fee' : 'Add Fee'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="item_no" htmlFor="item_no">Item No.</label><input id="item_no" name="item_no" className="form-control" value={form.item_no} onChange={e => setForm({...form, item_no: e.target.value})} placeholder="e.g. 1" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="category" htmlFor="category">Category Group</label><input id="category" name="category" className="form-control" list="categories" value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. 1. FEES IN RESPECT OF ISSUING CERTIFICATES" />
            <datalist id="categories">
              {categories.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="description_en" htmlFor="description_en">Description of Fee / Regulation</label><input id="description_en" name="description_en" className="form-control" value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})} placeholder="e.g. Application Fee for General Manager's Certificate" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="scale" htmlFor="scale">Category / Scale</label><input id="scale" name="scale" className="form-control" value={form.scale} onChange={e => setForm({...form, scale: e.target.value})} placeholder="e.g. All properties, Residential" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="fee" htmlFor="fee">Numeric Fee LKR (Optional)</label><input id="fee" name="fee" className="form-control" type="number" step="0.01" value={form.fee} onChange={e => setForm({...form, fee: parseFloat(e.target.value) || 0})} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="fee_display" htmlFor="fee_display">Fee Display override (e.g. 25%)</label><input id="fee_display" name="fee_display" className="form-control" value={form.fee_display} onChange={e => setForm({...form, fee_display: e.target.value})} placeholder="e.g. 25%, 50%" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="order" htmlFor="order">Sort Order</label><input id="order" name="order" className="form-control" type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="remarks" htmlFor="remarks">Remarks / Additional Conditions</label><input id="remarks" name="remarks" className="form-control" value={form.remarks || ''} onChange={e => setForm({...form, remarks: e.target.value})} placeholder="e.g. Government taxes applicable." />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input id="is_active" name="is_active" type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} /> Active
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


