import { useEffect, useMemo, useState } from 'react';
import { Check, Edit3, KeyRound, Loader2, Plus, ShieldCheck, ShieldOff, UserCog, Users } from 'lucide-react';
import Modal from '../../components/admin/Modal';
import { createAdminUser, getAdminUsers, updateAdminUser, updateAdminUserStatus } from '../../services/api';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  permissions: [],
  is_active: true,
};

const fieldStyle = {
  width: '100%',
  padding: '0.72rem 0.85rem',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  fontSize: '0.9rem',
  boxSizing: 'border-box',
  outline: 'none',
};

function apiError(error) {
  const errors = error.response?.data?.errors;
  if (errors) return Object.values(errors).flat().join(' ');
  return error.response?.data?.message || 'Something went wrong. Please try again.';
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [permissionOptions, setPermissionOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState(null);
  const [formError, setFormError] = useState('');

  const permissionLabels = useMemo(
    () => Object.fromEntries(permissionOptions.map((item) => [item.key, item.label])),
    [permissionOptions],
  );

  const load = async () => {
    setLoading(true);
    try {
      const response = await getAdminUsers();
      setUsers(response.data?.data || []);
      setPermissionOptions(response.data?.permissions || []);
    } catch (error) {
      setMessage({ type: 'error', text: apiError(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    getAdminUsers()
      .then((response) => {
        if (cancelled) return;
        setUsers(response.data?.data || []);
        setPermissionOptions(response.data?.permissions || []);
      })
      .catch((error) => {
        if (!cancelled) setMessage({ type: 'error', text: apiError(error) });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, permissions: permissionOptions.map((item) => item.key) });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      password_confirmation: '',
      permissions: user.permissions || [],
      is_active: !!user.is_active,
    });
    setFormError('');
    setModalOpen(true);
  };

  const togglePermission = (key) => {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(key)
        ? current.permissions.filter((permission) => permission !== key)
        : [...current.permissions, key],
    }));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError('');

    try {
      const payload = { ...form };
      const response = editing
        ? await updateAdminUser(editing.id, payload)
        : await createAdminUser(payload);

      setMessage({ type: 'success', text: response.data?.message || 'Administrator saved.' });
      setModalOpen(false);
      await load();
    } catch (error) {
      setFormError(apiError(error));
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (user) => {
    const nextStatus = !user.is_active;
    const action = nextStatus ? 'restore' : 'revoke';
    if (!window.confirm(`Are you sure you want to ${action} access for ${user.name}?`)) return;

    setStatusUpdating(user.id);
    try {
      const response = await updateAdminUserStatus(user.id, nextStatus);
      setMessage({ type: 'success', text: response.data?.message });
      setUsers((current) => current.map((item) => (
        item.id === user.id ? response.data.data : item
      )));
    } catch (error) {
      setMessage({ type: 'error', text: apiError(error) });
    } finally {
      setStatusUpdating(null);
    }
  };

  return (
    <div style={{ padding: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <UserCog size={28} color="#8B0000" />
            <h2 style={{ margin: 0, fontSize: '1.45rem', color: '#1f2937' }}>Admin Users & Access</h2>
          </div>
          <p style={{ margin: '0.55rem 0 0', color: '#6b7280', maxWidth: 700, lineHeight: 1.6 }}>
            Create administrator accounts, choose which admin-panel tabs each person can use, and revoke access immediately when required.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={17} /> Create Admin User
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <SummaryCard icon={Users} label="Admin accounts" value={users.length} color="#8B0000" />
        <SummaryCard icon={ShieldCheck} label="Active accounts" value={users.filter((user) => user.is_active).length} color="#15803d" />
        <SummaryCard icon={ShieldOff} label="Access revoked" value={users.filter((user) => !user.is_active).length} color="#b91c1c" />
      </div>

      {message && (
        <div style={{ marginBottom: '1rem', padding: '0.8rem 1rem', borderRadius: 8, background: message.type === 'error' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`, color: message.type === 'error' ? '#b91c1c' : '#166534' }}>
          {message.text}
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 3px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ minHeight: 240, display: 'grid', placeItems: 'center', color: '#8B0000' }}>
            <Loader2 size={30} className="spin" />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {['Administrator', 'Account type', 'Allowed tabs', 'Status', 'Actions'].map((heading) => (
                    <th key={heading} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#4b5563', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: '#1f2937' }}>{user.name}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: 3 }}>{user.email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0.3rem 0.55rem', borderRadius: 999, background: user.is_super_admin ? '#fff7ed' : '#f3f4f6', color: user.is_super_admin ? '#9a3412' : '#374151', fontSize: '0.78rem', fontWeight: 700 }}>
                        {user.is_super_admin && <ShieldCheck size={14} />}
                        {user.is_super_admin ? 'Super Administrator' : 'Administrator'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', maxWidth: 380 }}>
                      {user.is_super_admin ? (
                        <span style={{ color: '#166534', fontWeight: 600, fontSize: '0.84rem' }}>All admin tabs</span>
                      ) : user.permissions?.length ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {user.permissions.slice(0, 4).map((permission) => (
                            <span key={permission} style={{ padding: '0.2rem 0.45rem', borderRadius: 5, background: '#fef2f2', color: '#991b1b', fontSize: '0.72rem' }}>
                              {permissionLabels[permission] || permission}
                            </span>
                          ))}
                          {user.permissions.length > 4 && <span style={{ color: '#6b7280', fontSize: '0.75rem', padding: '0.2rem' }}>+{user.permissions.length - 4} more</span>}
                        </div>
                      ) : (
                        <span style={{ color: '#b91c1c', fontSize: '0.82rem' }}>No tabs assigned</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.28rem 0.55rem', borderRadius: 999, background: user.is_active ? '#dcfce7' : '#fee2e2', color: user.is_active ? '#166534' : '#991b1b', fontSize: '0.78rem', fontWeight: 700 }}>
                        {user.is_active ? 'Active' : 'Revoked'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {user.is_super_admin ? (
                        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Protected account</span>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.45rem' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(user)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            className={`btn btn-sm ${user.is_active ? 'btn-danger' : 'btn-primary'}`}
                            disabled={statusUpdating === user.id}
                            onClick={() => changeStatus(user)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                          >
                            {statusUpdating === user.id ? <Loader2 size={14} className="spin" /> : user.is_active ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                            {user.is_active ? 'Revoke' : 'Restore'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {!users.length && (
                  <tr><td colSpan="5" style={{ padding: '2.5rem', textAlign: 'center', color: '#6b7280' }}>No administrator accounts found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => !saving && setModalOpen(false)} title={editing ? 'Edit Admin User' : 'Create Admin User'} size="lg">
        <form onSubmit={save} style={{ padding: '1.25rem' }}>
          {formError && <div style={{ padding: '0.75rem 0.9rem', marginBottom: '1rem', borderRadius: 8, background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>{formError}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
            <FormField label="Full name">
              <input style={fieldStyle} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </FormField>
            <FormField label="Email address">
              <input style={fieldStyle} type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </FormField>
            <FormField label={editing ? 'New password (optional)' : 'Password'}>
              <input style={fieldStyle} type="password" minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required={!editing} autoComplete="new-password" />
            </FormField>
            <FormField label="Confirm password">
              <input style={fieldStyle} type="password" minLength="8" value={form.password_confirmation} onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })} required={!editing || !!form.password} autoComplete="new-password" />
            </FormField>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1.15rem', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#1f2937' }}>Allowed admin tabs</h3>
                <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.82rem' }}>Only selected tabs and their APIs will be available.</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setForm({ ...form, permissions: permissionOptions.map((item) => item.key) })}>Select all</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setForm({ ...form, permissions: [] })}>Clear all</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.6rem' }}>
              {permissionOptions.map((permission) => {
                const checked = form.permissions.includes(permission.key);
                return (
                  <label key={permission.key} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.7rem', border: `1px solid ${checked ? '#fecaca' : '#e5e7eb'}`, borderRadius: 8, background: checked ? '#fff7f7' : '#fff', cursor: 'pointer', color: '#374151', fontSize: '0.84rem' }}>
                    <span style={{ width: 19, height: 19, borderRadius: 5, display: 'grid', placeItems: 'center', background: checked ? '#8B0000' : '#fff', border: `1px solid ${checked ? '#8B0000' : '#9ca3af'}`, color: '#fff', flexShrink: 0 }}>
                      {checked && <Check size={13} strokeWidth={3} />}
                    </span>
                    <input type="checkbox" checked={checked} onChange={() => togglePermission(permission.key)} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />
                    {permission.label}
                  </label>
                );
              })}
            </div>
          </div>

          <label style={{ marginTop: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#374151', fontWeight: 600, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
            Account is active and can sign in
          </label>

          <div style={{ marginTop: '1.35rem', display: 'flex', justifyContent: 'flex-end', gap: '0.7rem' }}>
            <button type="button" className="btn btn-outline" disabled={saving} onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {saving ? <Loader2 size={16} className="spin" /> : <KeyRound size={16} />}
              {editing ? 'Save Access' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
      <span style={{ width: 42, height: 42, borderRadius: 10, display: 'grid', placeItems: 'center', background: `${color}12`, color }}><Icon size={21} /></span>
      <div><div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{label}</div><div style={{ color: '#111827', fontSize: '1.35rem', fontWeight: 800 }}>{value}</div></div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', marginBottom: '0.35rem', color: '#374151', fontSize: '0.82rem', fontWeight: 700 }}>{label}</span>
      {children}
    </label>
  );
}
