import { ShieldX } from 'lucide-react';

export default function AdminAccessDeniedPage() {
  return (
    <div style={{ minHeight: '55vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 520, textAlign: 'center', background: '#fff', border: '1px solid #fee2e2', borderRadius: 16, padding: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
        <ShieldX size={52} color="#8B0000" style={{ marginBottom: '1rem' }} />
        <h2 style={{ margin: '0 0 0.75rem', color: '#7f1d1d' }}>No admin modules assigned</h2>
        <p style={{ margin: 0, color: '#6b7280', lineHeight: 1.7 }}>
          Your account is active, but the super administrator has not granted access to any admin-panel tabs. Please contact the super administrator.
        </p>
      </div>
    </div>
  );
}
