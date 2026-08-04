import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminHeroSlides, uploadFile, getStorageURL } from '../../services/api';

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

const EMPTY_FORM = {
  title_en:'', title_si:'', title_ta:'',
  subtitle_en:'', subtitle_si:'', subtitle_ta:'',
  description_en:'', description_si:'', description_ta:'',
  button_text_en:'', button_text_si:'', button_text_ta:'',
  button_link:'',
  image:'',
  order:0,
  is_active:true,
};

export default function HeroSlidesAdminPage() {
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
    adminHeroSlides.list().then(r=>setItems(r.data?.data||r.data||[])).catch(()=>showToast('Failed to load slides','error')).finally(()=>setLoading(false));
  };

  useEffect(()=>{ load(); },[]);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setActiveLang('en'); setModalOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title_en: item.title_en||'',
      title_si: item.title_si||'',
      title_ta: item.title_ta||'',
      subtitle_en: item.subtitle_en||'',
      subtitle_si: item.subtitle_si||'',
      subtitle_ta: item.subtitle_ta||'',
      description_en: item.description_en||'',
      description_si: item.description_si||'',
      description_ta: item.description_ta||'',
      button_text_en: item.button_text_en||'',
      button_text_si: item.button_text_si||'',
      button_text_ta: item.button_text_ta||'',
      button_link: item.button_link||'',
      image: item.image||'',
      order: item.order??0,
      is_active: item.is_active??true,
    });
    setActiveLang('en');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slide?')) return;
    try { await adminHeroSlides.remove(id); showToast('Slide deleted'); load(); }
    catch(e){ showToast(e?.response?.data?.message||'Delete failed','error'); }
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await adminHeroSlides.update(editing.id, form);
      else await adminHeroSlides.create(form);
      showToast(editing?'Slide updated':'Slide created');
      setModalOpen(false); load();
    } catch(e){ showToast(e?.response?.data?.message||'Save failed','error'); }
    finally { setSaving(false); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadFile(file, 'hero_slides');
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
          <h2 style={{margin:0,fontSize:'1.4rem',fontWeight:700,color:'#111'}}>Hero Slides</h2>
          <p style={{margin:'0.25rem 0 0',color:'#6b7280',fontSize:'0.875rem'}}>{items.length} slides</p>
        </div>
        <button onClick={openAdd} style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.6rem 1.1rem',background:'#8B0000',color:'#fff',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',fontSize:'0.875rem'}}>
          <Plus size={16}/> Add Slide
        </button>
      </div>

      <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 8px rgba(0,0,0,0.08)',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#f9fafb',borderBottom:'1px solid #e5e7eb'}}>
              {['Preview','Title','Order','Active','Actions'].map(h=>(
                <th key={h} style={{padding:'0.75rem 1rem',textAlign:'left',fontSize:'0.8rem',fontWeight:600,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{padding:'3rem',textAlign:'center',color:'#9ca3af'}}>Loading…</td></tr>
            ) : items.length===0 ? (
              <tr><td colSpan={5} style={{padding:'3rem',textAlign:'center',color:'#9ca3af'}}>No slides.</td></tr>
            ) : items.map((item,i)=>(
              <tr key={item.id} style={{borderBottom:'1px solid #f3f4f6',background:i%2===0?'#fff':'#fafafa'}}>
                <td style={{padding:'0.75rem 1rem'}}>
                  {item.image
                    ? <img src={item.image.startsWith('http') ? item.image : getStorageURL(item.image)} alt="" style={{width:80,height:48,objectFit:'cover',borderRadius:6,border:'1px solid #e5e7eb'}}/>
                    : <div style={{width:80,height:48,background:'#f3f4f6',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',color:'#9ca3af'}}>No image</div>
                  }
                </td>
                <td style={{padding:'0.75rem 1rem',fontWeight:600,color:'#111'}}>{item.title_en||'—'}</td>
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

      <SimpleModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title={editing?'Edit Slide':'Add Slide'}>
        <form onSubmit={handleSave}>
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
              <input style={inputStyle} value={form['title_' + l] || ''} onChange={e=>setLangField('title',l,e.target.value)} placeholder="Slide title"/>
              <label style={labelStyle}>Subtitle ({LANG_LABELS[l]})</label>
              <input style={inputStyle} value={form['subtitle_' + l] || ''} onChange={e=>setLangField('subtitle',l,e.target.value)} placeholder="Subtitle"/>
              <label style={labelStyle}>Description ({LANG_LABELS[l]})</label>
              <textarea style={{...inputStyle,minHeight:80,resize:'vertical'}} value={form['description_' + l] || ''} onChange={e=>setLangField('description',l,e.target.value)} placeholder="Description…"/>
              <label style={labelStyle}>Button Text ({LANG_LABELS[l]})</label>
              <input style={inputStyle} value={form['button_text_' + l] || ''} onChange={e=>setLangField('button_text',l,e.target.value)} placeholder="e.g. Learn More"/>
            </div>
          ))}

          <label style={labelStyle} htmlFor="button_link" htmlFor="button_link">Button Link</label><input id="button_link" name="button_link" style={inputStyle} value={form.button_link || ''} onChange={e=>setForm(f=>({...f,button_link:e.target.value}))} placeholder="/page or https://…"/>
          
          <label style={labelStyle}>Image File</label>
          <input type="file" accept="image/*" onChange={handleUpload} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>Or Image Path:</div>
          <input id="image" name="image" style={inputStyle} value={form.image || ''} onChange={e=>setForm(f=>({...f,image:e.target.value}))} placeholder="uploads/filename.png"/>
          {form.image && <img src={form.image.startsWith('http') ? form.image : getStorageURL(form.image)} alt="" style={{width:'100%',height:120,objectFit:'cover',borderRadius:8,marginTop:'0.5rem',border:'1px solid #e5e7eb'}} onError={e=>e.target.style.display='none'}/>}

          <label style={labelStyle} htmlFor="order" htmlFor="order">Display Order</label><input id="order" name="order" type="number" style={inputStyle} value={form.order ?? 0} onChange={e=>setForm(f=>({...f,order:parseInt(e.target.value)||0}))}/>

          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.75rem'}}>
            <input type="checkbox" id="ha" checked={form.is_active} onChange={e=>setForm(f=>({...f,is_active:e.target.checked}))} style={{width:16,height:16}}/>
            <label htmlFor="ha" style={{fontSize:'0.875rem',fontWeight:600,color:'#374151'}}>Active</label>
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



