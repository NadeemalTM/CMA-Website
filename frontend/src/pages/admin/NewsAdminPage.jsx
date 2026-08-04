import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminNews, uploadFile, getStorageURL } from '../../services/api';

let AdminLayout;
try { AdminLayout = require('../../components/admin/AdminLayout').default; }
catch { AdminLayout = ({ children, title }) => <div style={{minHeight:'100vh',background:'#f8fafc'}}><div style={{background:'#8B0000',color:'#fff',padding:'1rem 2rem',fontWeight:700,fontSize:'1.25rem'}}>CMA Admin — {title}</div><div style={{padding:'2rem'}}>{children}</div></div>; }

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{position:'fixed',inset:0,zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.5)'}} onClick={onClose}/>
    <div style={{position:'relative',background:'white',borderRadius:12,padding:'2rem',maxWidth:750,width:'90%',maxHeight:'92vh',overflow:'auto',boxShadow:'0 25px 60px rgba(0,0,0,0.25)'}}>
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

const inputStyle = {width:'100%',padding:'0.6rem 0.75rem',border:'1.5px solid #e5e7eb',borderRadius:8,fontSize:'0.9rem',boxSizing:'border-box',outline:'none'};
const labelStyle = {display:'block',fontSize:'0.8rem',fontWeight:600,color:'#374151',marginBottom:'0.3rem',marginTop:'0.75rem'};

const LANGS = ['en','si','ta'];
const LANG_LABELS = {en:'English',si:'සිංහල',ta:'தமிழ்'};
const CATEGORIES = ['news','event','announcement'];
const CAT_COLORS = {news:'#3b82f6',event:'#8b5cf6',announcement:'#f59e0b'};

const EMPTY_FORM = {
  title_en:'', title_si:'', title_ta:'',
  body_en:'', body_si:'', body_ta:'',
  excerpt_en:'', excerpt_si:'', excerpt_ta:'',
  category:'news',
  is_published:false,
  published_at:'',
  image: '',
};

export default function NewsAdminPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeLang, setActiveLang] = useState('en');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg:'', type:'' });

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast({msg:'',type:''}),3000); };

  const load = () => {
    setLoading(true);
    adminNews.list().then(r=>setItems(r.data?.data||r.data||[])).catch(()=>showToast('Failed to load news','error')).finally(()=>setLoading(false));
  };

  useEffect(()=>{ load(); },[]);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setActiveLang('en'); setModalOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title_en: item.title_en||'',
      title_si: item.title_si||'',
      title_ta: item.title_ta||'',
      body_en: item.body_en||'',
      body_si: item.body_si||'',
      body_ta: item.body_ta||'',
      excerpt_en: item.excerpt_en||'',
      excerpt_si: item.excerpt_si||'',
      excerpt_ta: item.excerpt_ta||'',
      category: item.category||'news',
      is_published: item.is_published??false,
      published_at: item.published_at?.split('T')[0]||'',
      image: item.image||'',
    });
    setActiveLang('en');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this news item?')) return;
    try { await adminNews.remove(id); showToast('Deleted'); load(); }
    catch(e){ showToast(e?.response?.data?.message||'Delete failed','error'); }
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await adminNews.update(editing.id, form);
      else await adminNews.create(form);
      showToast(editing?'Updated':'Created');
      setModalOpen(false); load();
    } catch(e){ showToast(e?.response?.data?.message||'Save failed','error'); }
    finally { setSaving(false); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadFile(file, 'news');
      setForm(f => ({ ...f, image: res.data.path }));
      showToast('Image uploaded successfully');
    } catch(e) {
      showToast('Image upload failed', 'error');
    }
  };

  const setLangField = (field, lang, val) => setForm(f=>({...f,[field + '_' + lang]:val}));

  return (
    <div className="admin-page-content" style={{ padding: "0.5rem" }}>
      <Toast msg={toast.msg} type={toast.type}/>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'0.75rem'}}>
        <div>
          <h2 style={{margin:0,fontSize:'1.4rem',fontWeight:700,color:'#111'}}>News & Events</h2>
          <p style={{margin:'0.25rem 0 0',color:'#6b7280',fontSize:'0.875rem'}}>{items.length} items</p>
        </div>
        <button onClick={openAdd} style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.6rem 1.1rem',background:'#8B0000',color:'#fff',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',fontSize:'0.875rem'}}>
          <Plus size={16}/> Add News
        </button>
      </div>

      <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 8px rgba(0,0,0,0.08)',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#f9fafb',borderBottom:'1px solid #e5e7eb'}}>
              {['Title','Category','Published','Date','Actions'].map(h=>(
                <th key={h} style={{padding:'0.75rem 1rem',textAlign:'left',fontSize:'0.8rem',fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{padding:'3rem',textAlign:'center',color:'#9ca3af'}}>Loading…</td></tr>
            ) : items.length===0 ? (
              <tr><td colSpan={5} style={{padding:'3rem',textAlign:'center',color:'#9ca3af'}}>No news items.</td></tr>
            ) : items.map((item,i)=>(
              <tr key={item.id} style={{borderBottom:'1px solid #f3f4f6',background:i%2===0?'#fff':'#fafafa'}}>
                <td style={{padding:'0.75rem 1rem',fontWeight:600,color:'#111',maxWidth:280}}>
                  <span style={{display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {item.title_en||'—'}
                  </span>
                </td>
                <td style={{padding:'0.75rem 1rem'}}>
                  <span style={{padding:'0.2rem 0.65rem',borderRadius:20,fontSize:'0.75rem',fontWeight:600,background:`${CAT_COLORS[item.category]||'#6b7280'}1a`,color:CAT_COLORS[item.category]||'#6b7280',textTransform:'capitalize'}}>
                    {item.category||'—'}
                  </span>
                </td>
                <td style={{padding:'0.75rem 1rem'}}>
                  <span style={{padding:'0.2rem 0.6rem',borderRadius:20,fontSize:'0.75rem',fontWeight:600,background:item.is_published?'#d1fae5':'#f3f4f6',color:item.is_published?'#065f46':'#6b7280'}}>
                    {item.is_published?'Published':'Draft'}
                  </span>
                </td>
                <td style={{padding:'0.75rem 1rem',color:'#6b7280',fontSize:'0.875rem'}}>
                  {item.published_at?new Date(item.published_at).toLocaleDateString():'—'}
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

      <SimpleModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title={editing?'Edit News':'Add News'}>
        <form onSubmit={handleSave}>
          {/* Lang Tabs */}
          <div style={{display:'flex',gap:'0.5rem',marginBottom:'0.5rem'}}>
            {LANGS.map(l=>(
              <button type="button" key={l} onClick={()=>setActiveLang(l)}
                style={{padding:'0.4rem 0.9rem',border:'none',borderRadius:20,cursor:'pointer',fontWeight:activeLang===l?700:400,background:activeLang===l?'#8B0000':'#f3f4f6',color:activeLang===l?'#fff':'#374151',fontSize:'0.8rem'}}>
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>

          {LANGS.map(l=>(
            <div key={l} style={{display:activeLang===l?'block':'none'}}>
              <label style={labelStyle}>Title ({LANG_LABELS[l]})</label>
              <input style={inputStyle} value={form['title_' + l] || ''} onChange={e=>setLangField('title',l,e.target.value)} placeholder={`Title in ${LANG_LABELS[l]}`}/>
              <label style={labelStyle}>Excerpt ({LANG_LABELS[l]})</label>
              <textarea style={{...inputStyle,minHeight:70,resize:'vertical'}} value={form['excerpt_' + l] || ''} onChange={e=>setLangField('excerpt',l,e.target.value)} placeholder="Short excerpt…"/>
              <label style={labelStyle}>Body ({LANG_LABELS[l]})</label>
              <textarea style={{...inputStyle,minHeight:140,resize:'vertical'}} value={form['body_' + l] || ''} onChange={e=>setLangField('body',l,e.target.value)} placeholder="Full article body…"/>
            </div>
          ))}

          <label style={labelStyle} htmlFor="category" htmlFor="category">Category</label><select id="category" name="category" style={inputStyle} value={form.category || 'news'} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
            {CATEGORIES.map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
          </select>

          <label style={labelStyle}>Image File</label>
          <input type="file" accept="image/*" onChange={handleUpload} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>Or Image Path:</div>
          <input id="image" name="image" style={inputStyle} value={form.image || ''} onChange={e=>setForm(f=>({...f,image:e.target.value}))} placeholder="uploads/filename.png"/>
          {form.image && <img src={form.image.startsWith('http') ? form.image : getStorageURL(form.image)} alt="" style={{width:'100%',height:120,objectFit:'cover',borderRadius:8,marginTop:'0.5rem',border:'1px solid #e5e7eb'}} onError={e=>e.target.style.display='none'}/>}

          <label style={labelStyle} htmlFor="published_at" htmlFor="published_at">Published At</label><input id="published_at" name="published_at" type="date" style={inputStyle} value={form.published_at || ''} onChange={e=>setForm(f=>({...f,published_at:e.target.value}))}/>

          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.75rem'}}>
            <input type="checkbox" id="np" checked={form.is_published} onChange={e=>setForm(f=>({...f,is_published:e.target.checked}))} style={{width:16,height:16}}/>
            <label htmlFor="np" style={{fontSize:'0.875rem',fontWeight:600,color:'#374151'}}>Published</label>
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



