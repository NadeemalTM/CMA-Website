import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, User } from 'lucide-react';
import { adminLeaders, uploadFile, getStorageURL } from '../../services/api';

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
  name:'', email:'', phone:'', photo:'', section_type:'leadership', order:0, is_active:true,
  position_en:'', position_si:'', position_ta:'',
  bio_en:'', bio_si:'', bio_ta:''
};

export default function LeadersAdminPage() {
  const { t } = useTranslation();
  const [leaders, setLeaders] = useState([]);
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
    adminLeaders.list().then(r => setLeaders(r.data?.data || r.data || [])).catch(()=>showToast('Failed to load leaders','error')).finally(()=>setLoading(false));
  };

  useEffect(()=>{ load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setActiveLang('en'); setModalOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name||'',
      email: item.email||'',
      phone: item.phone||'',
      photo: item.photo||'',
      section_type: item.section_type||'leadership',
      order: item.order??0,
      is_active: item.is_active??true,
      position_en: item.position_en||'',
      position_si: item.position_si||'',
      position_ta: item.position_ta||'',
      bio_en: item.bio_en||'',
      bio_si: item.bio_si||'',
      bio_ta: item.bio_ta||'',
    });
    setActiveLang('en');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this leader?')) return;
    try { await adminLeaders.remove(id); showToast('Leader deleted'); load(); }
    catch(e){ showToast(e?.response?.data?.message||'Delete failed','error'); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await adminLeaders.update(editing.id, form);
      else await adminLeaders.create(form);
      showToast(editing?'Leader updated':'Leader created');
      setModalOpen(false);
      load();
    } catch(e){ showToast(e?.response?.data?.message||'Save failed','error'); }
    finally { setSaving(false); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadFile(file, 'leadership');
      setForm(f => ({ ...f, photo: res.data.path }));
      showToast('Photo uploaded successfully');
    } catch(e) {
      showToast('Photo upload failed', 'error');
    }
  };

  const setLangField = (field, lang, val) => setForm(f => ({...f,[field + '_' + lang]:val}));

  const filtered = leaders.filter(l => l.name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-page-content" style={{ padding: "0.5rem" }}>
      <Toast msg={toast.msg} type={toast.type}/>

      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'0.75rem'}}>
        <div>
          <h2 style={{margin:0,fontSize:'1.4rem',fontWeight:700,color:'#111'}}>Leadership & Board Members</h2>
          <p style={{margin:'0.25rem 0 0',color:'#6b7280',fontSize:'0.875rem'}}>{leaders.length} members</p>
        </div>
        <div style={{display:'flex',gap:'0.75rem',alignItems:'center',flexWrap:'wrap'}}>
          <input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{padding:'0.55rem 0.85rem',border:'1.5px solid #e5e7eb',borderRadius:8,fontSize:'0.875rem',outline:'none',width:200}}/>
          <button onClick={openAdd} style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.6rem 1.1rem',background:'#8B0000',color:'#fff',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',fontSize:'0.875rem'}}>
            <Plus size={16}/> Add Member
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 8px rgba(0,0,0,0.08)',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#f9fafb',borderBottom:'1px solid #e5e7eb'}}>
              {['Photo','Name','Section','Position','Order','Active','Actions'].map(h=>(
                <th key={h} style={{padding:'0.75rem 1rem',textAlign:'left',fontSize:'0.8rem',fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{padding:'3rem',textAlign:'center',color:'#9ca3af'}}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{padding:'3rem',textAlign:'center',color:'#9ca3af'}}>No members found.</td></tr>
            ) : filtered.map((item,i)=>(
              <tr key={item.id} style={{borderBottom:'1px solid #f3f4f6',background:i%2===0?'#fff':'#fafafa'}}>
                <td style={{padding:'0.75rem 1rem'}}>
                  {item.photo
                    ? <img src={item.photo.startsWith('http') ? item.photo : getStorageURL(item.photo)} alt={item.name} style={{width:40,height:40,borderRadius:'50%',objectFit:'cover',border:'2px solid #e5e7eb'}}/>
                    : <div style={{width:40,height:40,borderRadius:'50%',background:'#f3f4f6',display:'flex',alignItems:'center',justifyContent:'center'}}><User size={20} color="#9ca3af"/></div>
                  }
                </td>
                <td style={{padding:'0.75rem 1rem',fontWeight:600,color:'#111'}}>{item.name}</td>
                <td style={{padding:'0.75rem 1rem'}}>
                  <span style={{padding:'0.2rem 0.6rem',borderRadius:20,fontSize:'0.75rem',fontWeight:600,background:item.section_type==='board'?'#fef3c7':'#e0e7ff',color:item.section_type==='board'?'#92400e':'#3730a3'}}>
                    {item.section_type==='board'?'Board Member':'Leadership'}
                  </span>
                </td>
                <td style={{padding:'0.75rem 1rem',color:'#6b7280',fontSize:'0.875rem'}}>{item.position_en||'—'}</td>
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
      <SimpleModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title={editing?'Edit Member':'Add Member'}>
        <form onSubmit={handleSave}>
          <label style={labelStyle} htmlFor="section_type">Website Section</label>
          <select id="section_type" style={inputStyle} value={form.section_type} onChange={e=>setForm(f=>({...f,section_type:e.target.value}))} required>
            <option value="leadership">Leadership Team</option>
            <option value="board">Board Members</option>
          </select>
          <label style={labelStyle} htmlFor="name">Full Name</label><input id="name" name="name" style={inputStyle} value={form.name || ''} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required placeholder="Full Name"/>

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
              <label style={labelStyle}>Position ({LANG_LABELS[l]})</label>
              <input style={inputStyle} value={form['position_' + l] || ''} onChange={e=>setLangField('position',l,e.target.value)} placeholder={`Position in ${LANG_LABELS[l]}`}/>
              <label style={labelStyle}>Bio ({LANG_LABELS[l]})</label>
              <textarea style={{...inputStyle,minHeight:90,resize:'vertical'}} value={form['bio_' + l] || ''} onChange={e=>setLangField('bio',l,e.target.value)} placeholder={`Bio in ${LANG_LABELS[l]}`}/>
            </div>
          ))}

          <label style={labelStyle}>Photo File</label>
          <input type="file" accept="image/*" onChange={handleUpload} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>Or Photo Path:</div>
          <input id="photo" name="photo" style={inputStyle} value={form.photo || ''} onChange={e=>setForm(f=>({...f,photo:e.target.value}))} placeholder="uploads/filename.png"/>
          {form.photo && <img src={form.photo.startsWith('http') ? form.photo : getStorageURL(form.photo)} alt="" style={{width:100,height:100,borderRadius:'50%',objectFit:'cover',marginTop:'0.5rem',border:'1px solid #e5e7eb'}} onError={e=>e.target.style.display='none'}/>}

          <label style={labelStyle} htmlFor="email">Email</label><input id="email" name="email" style={inputStyle} type="email" value={form.email || ''} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="leader@cma.gov.lk"/>
          <label style={labelStyle} htmlFor="phone">Phone</label><input id="phone" name="phone" style={inputStyle} value={form.phone || ''} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+94 11 …"/>
          <label style={labelStyle} htmlFor="order">Display Order</label><input id="order" name="order" style={inputStyle} type="number" value={form.order ?? 0} onChange={e=>setForm(f=>({...f,order:parseInt(e.target.value)||0}))}/>

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



