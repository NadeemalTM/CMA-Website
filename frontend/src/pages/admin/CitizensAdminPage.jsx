import { useState, useEffect } from 'react';
import { getCitizens, deleteCitizen, resetCitizenPassword } from '../../services/api';
import { Loader2, Users, Key, Trash2 } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';

const SimpleModal = ({ isOpen, onClose, title, children }) => !isOpen ? null : (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />
    <div style={{ position: 'relative', background: 'white', borderRadius: 12, padding: '2rem', maxWidth: 400, width: '90%', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
      <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.2rem', color: '#111' }}>{title}</h2>
      {children}
    </div>
  </div>
);

export default function CitizensAdminPage() {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Password Reset State
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCitizens();
  }, []);

  const fetchCitizens = async () => {
    try {
      const { data } = await getCitizens();
      setCitizens(data.data);
    } catch (error) {
      console.error('Error fetching citizens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to completely remove user ${row.name}? This action cannot be undone.`)) return;
    
    try {
      await deleteCitizen(row.id);
      fetchCitizens();
      alert('User removed successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete user.');
    }
  };

  const openResetModal = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setResetModalOpen(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await resetCitizenPassword(selectedUser.id, { password: newPassword });
      setResetModalOpen(false);
      alert('Password reset successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: (val) => val || 'N/A' },
    { key: 'nic', label: 'NIC', render: (val) => val || 'N/A' },
    { key: 'created_at', label: 'Registered', render: (val) => new Date(val).toLocaleDateString() },
    { 
      key: 'actions', 
      label: 'Security', 
      render: (_, row) => (
        <button
          onClick={() => openResetModal(row)}
          title="Reset Password"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.35rem 0.7rem', borderRadius: 6,
            background: 'rgba(234, 179, 8, 0.1)', color: '#ca8a04',
            border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
          }}
        >
          <Key size={14} /> Reset
        </button>
      )
    }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Users size={32} color="var(--crimson)" />
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--crimson)' }}>
          Registered Citizens
        </h1>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Loader2 className="spinner" size={32} />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={citizens}
            onDelete={handleDelete}
            emptyMessage="No registered citizens found."
          />
        )}
      </div>

      <SimpleModal 
        isOpen={resetModalOpen} 
        onClose={() => setResetModalOpen(false)} 
        title={`Reset Password for ${selectedUser?.name}`}
      >
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
              New Password
            </label>
            <input
              type="text"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              style={{
                width: '100%', padding: '0.6rem 0.75rem', border: '1.5px solid #e5e7eb',
                borderRadius: 8, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box'
              }}
            />
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
              Password must be at least 6 characters long.
            </p>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setResetModalOpen(false)}
              style={{ padding: '0.5rem 1rem', background: '#f3f4f6', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, color: '#374151' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ padding: '0.5rem 1rem', background: '#ca8a04', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {isSubmitting ? <Loader2 size={16} className="spinner" /> : <Key size={16} />}
              Confirm Reset
            </button>
          </div>
        </form>
      </SimpleModal>
    </div>
  );
}
