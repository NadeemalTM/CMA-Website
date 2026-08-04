import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, User, Briefcase } from 'lucide-react';
import { adminStaff } from '../../services/api';

// ── Fallbacks ─────────────────────────────────────────────────────────────────
let AdminLayout;
try { AdminLayout = require('../../components/admin/AdminLayout').default; }
catch { AdminLayout = ({ children, title }) => <div style={{minHeight:'100vh',background:'#f8fafc'}}><div style={{background:'#8B0000',color:'#fff',padding:'1rem 2rem',fontWeight:700,fontSize:'1.25rem'}}>CMA Admin — {title}</div><div style={{padding:'2rem'}}>{children}</div></div>; }

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{position:'fixed',inset:0,zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.5)'}} onClick={onClose}/>
    <div style={{position:'relative',background:'white',borderRadius:12,padding:'2rem',maxWidth:700,width:'90%',maxHeight:'90vh',overflow:'auto',boxShadow:'0 25px 60px rgba(0,0,0,0.25)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <h2 style={{margin:0,fontSize:'1.2rem',color:'#111'}}>{title}</h2>
        <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:'1.5rem',color:'#666',lineHeight:1}}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const Toast = ({ msg, type }) => msg ? (
  <div style={{position:'fixed',top:20,right:20,zIndex:99999,background:type==='error'?'#c53030':'#276749',color:'#fff',padding:'0.75rem 1.25rem',borderRadius:8,fontWeight:600,boxShadow:'0 4px 12px rgba(0,0,0,0.2)',fontSize:'0.9rem'}}>
    {msg}
  </div>
) : null;

const inputStyle = {width:'100%',padding:'0.6rem 0.75rem',border:'1.5px solid #e5e7eb',borderRadius:8,fontSize:'0.9rem',boxSizing:'border-box',outline:'none',marginBottom:'0.1rem'};
const labelStyle = {display:'block',fontSize:'0.8rem',fontWeight:600,color:'#374151',marginBottom:'0.3rem',marginTop:'0.75rem'};

const LANGS = ['en','si','ta'];
const LANG_LABELS = {en:'English',si:'සිංහල',ta:'தமிழ்'};

const EMPTY_FORM = {
  name:'', email:'', phone:'', order:0, is_active:true,
  title_en:'', title_si:'', title_ta:'',
  department_en:'', department_si:'', department_ta:''
};

export default function StaffAdminPage() {
  const { t } = useTranslation();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeLang, setActiveLang] = useState('en');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg:'', type:'' });
  const [search, setSearch] = useState('');

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast({msg:'',type:''}),3000); };

  const load = () => {
    setLoading(true);
    adminStaff.list().then(r => setStaffList(r.data?.data || r.data || [])).catch(()=>showToast('Failed to load staff members','error')).finally(()=>setLoading(false));
  };

  useEffect(()=>{ load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setActiveLang('en'); setModalOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name||'',
      email: item.email||'',
      phone: item.phone||'',
      order: item.order??0,
      is_active: item.is_active??true,
      title_en: item.title_en||'',
      title_si: item.title_si||'',
      title_ta: item.title_ta||'',
      department_en: item.department_en||'',
      department_si: item.department_si||'',
      department_ta: item.department_ta||'',
    });
    setActiveLang('en');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try { await adminStaff.remove(id); showToast('Staff member deleted'); load(); }
    catch(e){ showToast(e?.response?.data?.message||'Delete failed','error'); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await adminStaff.update(editing.id, form);
      else await adminStaff.create(form);
      showToast(editing?'Staff member updated':'Staff member created');
      setModalOpen(false);
      load();
    } catch(e){ showToast(e?.response?.data?.message||'Save failed','error'); }
    finally { setSaving(false); }
  };

  const setLangField = (field, lang, val) => setForm(f => ({...f,[field + '_' + lang]:val}));

  const filtered = staffList.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()) || s.department_en?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-page-content" style={{ padding: "0.5rem" }}>
      <Toast msg={toast.msg} type={toast.type}/>

      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'0.75rem'}}>
        <div>
          <h2 style={{margin:0,fontSize:'1.4rem',fontWeight:700,color:'#111'}}>Staff Members</h2>
          <p style={{margin:'0.25rem 0 0',color:'#6b7280',fontSize:'0.875rem'}}>{staffList.length} members</p>
        </div>
        <div style={{display:'flex',gap:'0.75rem',alignItems:'center',flexWrap:'wrap'}}>
          <input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{padding:'0.55rem 0.85rem',border:'1.5px solid #e5e7eb',borderRadius:8,fontSize:'0.875rem',outline:'none',width:200}}/>
          <button onClick={openAdd} style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.6rem 1.1rem',background:'#8B0000',color:'#fff',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',fontSize:'0.875rem'}}>
            <Plus size={16}/> Add Staff Member
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 8px rgba(0,0,0,0.08)',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#f9fafb',borderBottom:'1px solid #e5e7eb'}}>
              {['Name','Title','Department','Order','Active','Actions'].map(h=>(
                <th key={h} style={{padding:'0.75rem 1rem',textAlign:'left',fontSize:'0.8rem',fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{padding:'3rem',textAlign:'center',color:'#9ca3af'}}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{padding:'3rem',textAlign:'center',color:'#9ca3af'}}>No staff members found.</td></tr>
            ) : filtered.map((item,i)=>(
              <tr key={item.id} style={{borderBottom:'1px solid #f3f4f6',background:i%2===0?'#fff':'#fafafa'}}>
                <td style={{padding:'0.75rem 1rem',fontWeight:600,color:'#111'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                    <div style={{width:30,height:30,borderRadius:'50%',background:'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><User size={15} color="#9ca3af"/></div>
                    <div>
                      <div style={{fontWeight:600,fontSize:'0.9rem'}}>{item.name}</div>
                      <div style={{fontSize:'0.75rem',color:'#6b7280'}}>{item.email || 'No email'}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:'0.75rem 1rem',color:'#4b5563',fontSize:'0.875rem'}}>{item.title_en||'—'}</td>
                <td style={{padding:'0.75rem 1rem',color:'#6b7280',fontSize:'0.875rem'}}>{item.department_en||'—'}</td>
                <td style={{padding:'0.75rem 1rem',color:'#6b7280'}}>{item.order??'—'}</td>
                <td style={{padding:'0.75rem 1rem'}}>
                  <span style={{padding:'0.2rem 0.6rem',borderRadius:20,fontSize:'0.75rem',fontWeight:600,background:item.is_active?'#d1fae5':'#fee2e2',color:item.is_active?'#065f46':'#991b1b'}}>
                    {item.is_active?'Active':'Inactive'}
                  </span>
                </td>
                <td style={{padding:'0.75rem 1rem'}}>
                  <div style={{display:'flex',gap:'0.5rem'}}>
                    <button onClick={()=>openEdit(item)} style={{padding:'0.4rem 0.65rem',background:'#eff6ff',border:'none',borderRadius:6,cursor:'pointer',color:'#1d4ed8'}}><Pencil size={14}/></button>
                    <button onClick={()=>handleDelete(item.id)} style={{padding:'0.4rem 0.65rem',background:'#fff5f5',border:'none',borderRadius:6,cursor:'pointer',color:'#dc2626'}}><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <SimpleModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title={editing?'Edit Staff Member':'Add Staff Member'}>
        <form onSubmit={handleSave}>
          <label style={labelStyle} htmlFor="name" htmlFor="name">Full Name</label><input id="name" name="name" style={inputStyle} value={form.name || ''} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required placeholder="Full Name"/>

          {/* Lang Tabs */}
          <div style={{display:'flex',gap:'0.5rem',marginTop:'1rem',marginBottom:'0.5rem'}}>
            {LANGS.map(l=>(
              <button type="button" key={l} onClick={()=>setActiveLang(l)}
                style={{padding:'0.4rem 0.9rem',border:'none',borderRadius:20,cursor:'pointer',fontWeight:activeLang===l?700:400,background:activeLang===l?'#8B0000':'#f3f4f6',color:activeLang===l?'#fff':'#374151',fontSize:'0.8rem'}}>
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>

          {LANGS.map(l=>(
            <div key={l} style={{display:activeLang===l?'block':'none'}}>
              <label style={labelStyle}>Title/Role ({LANG_LABELS[l]})</label>
              <input style={inputStyle} value={form['title_' + l] || ''} onChange={e=>setLangField('title',l,e.target.value)} required={l==='en'} placeholder={`Title/Role in ${LANG_LABELS[l]}`}/>
              
              <label style={labelStyle}>Department Name ({LANG_LABELS[l]})</label>
              <input style={inputStyle} value={form['department_' + l] || ''} onChange={e=>setLangField('department',l,e.target.value)} required={l==='en'} placeholder={`Department in ${LANG_LABELS[l]}`}/>
            </div>
          ))}

          <label style={labelStyle} htmlFor="email" htmlFor="email">Email</label><input id="email" name="email" style={inputStyle} type="email" value={form.email || ''} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="staff@condominium.lk"/>
          
          <label style={labelStyle} htmlFor="phone" htmlFor="phone">Phone</label><input id="phone" name="phone" style={inputStyle} value={form.phone || ''} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="011-2338146 (Ext: ...)"/>
          
          <label style={labelStyle} htmlFor="order" htmlFor="order">Display Order</label><input id="order" name="order" style={inputStyle} type="number" value={form.order ?? 0} onChange={e=>setForm(f=>({...f,order:parseInt(e.target.value)||0}))}/>

          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.75rem'}}>
            <input type="checkbox" id="la" checked={form.is_active} onChange={e=>setForm(f=>({...f,is_active:e.target.checked}))} style={{width:16,height:16}}/>
            <label htmlFor="la" style={{fontSize:'0.875rem',fontWeight:600,color:'#374151'}}>Active</label>
          </div>

          <div style={{display:'flex',gap:'0.75rem',marginTop:'1.5rem',justifyContent:'flex-end'}}>
            <button type="button" onClick={()=>setModalOpen(false)} style={{padding:'0.6rem 1.2rem',border:'1.5px solid #e5e7eb',borderRadius:8,cursor:'pointer',background:'#fff',fontWeight:600,fontSize:'0.875rem'}}>Cancel</button>
            <button type="submit" disabled={saving} style={{padding:'0.6rem 1.4rem',background:'#8B0000',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:600,fontSize:'0.875rem',opacity:saving?0.6:1}}>
              {saving?'Saving…':(editing?'Update':'Create')}
            </button>
          </div>
        </form>
      </SimpleModal>
    </div>
  );
}


