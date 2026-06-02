import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Calendar, CheckSquare, X, Check, Trash2, ArrowUpRight, Search } from 'lucide-react';
import { adminGetBookings, adminUpdateBookingStatus } from '../../services/api';

const statusColors = {
  Pending: '#d97706',
  Confirmed: '#1e40af',
  Done: '#1a7f5a',
  Cancelled: '#dc2626',
};

export default function BookingsAdminPage() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, done: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [roomFilter, setRoomFilter] = useState('All Rooms');
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState({ text: '', type: '' }); // success, danger

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All Status') params.status = statusFilter;
      if (roomFilter !== 'All Rooms') params.room = roomFilter;

      const res = await adminGetBookings(params);
      if (res.data && res.data.status === 'success') {
        setBookings(res.data.data || []);
        setStats(res.data.stats || { total: 0, confirmed: 0, pending: 0, done: 0, cancelled: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter, roomFilter]);

  const handleAction = async (id, targetStatus) => {
    setAlert({ text: '', type: '' });
    try {
      const res = await adminUpdateBookingStatus(id, targetStatus);
      if (res.data && res.data.status === 'success') {
        setAlert({
          text: `Booking KTG-2026-${String(id).padStart(4, '0')} status successfully updated to ${targetStatus}!`,
          type: 'success',
        });
        load();
      }
    } catch (err) {
      setAlert({
        text: err?.response?.data?.message || 'Failed to update booking status. Please try again.',
        type: 'danger',
      });
    }
  };

  const pendingQueue = bookings.filter((b) => b.status === 'Pending');

  // Filter bookings locally by search query as well
  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.guest_name.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.nic.toLowerCase().includes(q) ||
      String(b.id).includes(q)
    );
  });

  return (
    <div style={{ fontFamily: 'inherit' }}>
      
      {/* Alert block */}
      {alert.text && (
        <div
          className={`booking-alert show ${alert.type}`}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: 600,
            background: alert.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${alert.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            color: alert.type === 'success' ? '#15803d' : '#b91c1c',
          }}
        >
          {alert.text}
        </div>
      )}

      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
        <div>
          <span className="section-label" style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--crimson)', fontWeight: 700 }}>
            RESERVATION DATABASE
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '6px 0 0', color: 'var(--text-dark)' }}>
            Kataragama Booking Admin
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Process guest booking requests, verify employee IDs, and manage status lifecycles.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline btn-sm" onClick={() => window.open('/booking/kataragama', '_blank')}>
            Open Public Booking <ArrowUpRight size={14} />
          </button>
          <button className="btn btn-primary btn-sm" onClick={load}>
            Refresh Sync
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Total Reservations</p>
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', color: 'var(--text-dark)', fontWeight: 800 }}>{stats.total}</h3>
        </div>
        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Confirmed / Approved</p>
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', color: '#1e40af', fontWeight: 800 }}>{stats.confirmed}</h3>
        </div>
        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Pending Requests</p>
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', color: '#d97706', fontWeight: 800 }}>{stats.pending}</h3>
        </div>
        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #eee', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Completed / Done</p>
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', color: '#1a7f5a', fontWeight: 800 }}>{stats.done}</h3>
        </div>
      </div>

      {/* Main Grid: Queue and Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '28px' }}>
        
        {/* Pending Queue Section */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardList size={18} style={{ color: 'var(--crimson)' }} />
              Approval Queue ({pendingQueue.length})
            </h4>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Action required</span>
          </div>

          {pendingQueue.length === 0 ? (
            <div style={{ padding: '36px', textAlignment: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✅</div>
              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>No Pending Booking Requests</h5>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px' }}>All current circuit bungalow reservations have been processed.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {pendingQueue.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#fcfbf9',
                    border: '1.5px solid rgba(139,0,0,0.12)',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13.5px', color: 'var(--text-dark)' }}>{item.guest_name}</strong>
                      <span style={{ fontSize: '11px', background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>Pending</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      <div>🏠 <strong>{item.unit_number}</strong></div>
                      <div>📅 In: {item.check_in?.substring(0, 10)} · Out: {item.check_out?.substring(0, 10)}</div>
                      <div>📞 {item.phone} | ✉ {item.email}</div>
                      <div>🪪 NIC: {item.nic}</div>
                      <div>🏠 Address: {item.permanent_address}</div>
                      <div>💼 Occupation: {item.occupation} {item.is_cma_employee ? <span style={{ color: '#16a34a', fontWeight: 'bold' }}>(CMA/Ministry Staff)</span> : ''}</div>
                      {item.gov_letter && (
                        <div style={{ margin: '3px 0' }}>
                          📄 Letter: <a href={`/storage/${item.gov_letter}`} target="_blank" rel="noreferrer" style={{ color: 'var(--crimson)', fontWeight: 'bold', textDecoration: 'underline' }}>Download Official Letter</a>
                        </div>
                      )}
                      {item.employee_id && <div style={{ color: 'var(--crimson)', fontWeight: 600 }}>🪪 Employee ID: {item.employee_id}</div>}
                      
                      {/* Dynamic accompanying family members list */}
                      {item.family_members && item.family_members.length > 0 && (
                        <div style={{ marginTop: '8px', borderTop: '1px dashed #ddd', paddingTop: '6px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '11px', color: 'var(--text-dark)' }}>Accompanying Members ({item.family_count}):</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px', fontSize: '11px', marginTop: '4px' }}>
                            {item.family_members.map((m, idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>• {m.name}</span>
                                <span style={{ color: 'var(--text-muted)' }}>NIC: {m.nic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.notes && <div style={{ background: '#f3f4f6', padding: '6px', borderRadius: '4px', marginTop: '6px', fontStyle: 'italic' }}>"{item.notes}"</div>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', marginTop: '14px', flexWrap: 'wrap' }}>
                    <button
                      className="admin-action-btn approve"
                      style={{ background: '#1a7f5a', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      onClick={() => handleAction(item.id, 'Confirmed')}
                    >
                      <Check size={12} /> Approve
                    </button>
                    <button
                      className="admin-action-btn done"
                      style={{ background: '#1e40af', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      onClick={() => handleAction(item.id, 'Done')}
                    >
                      <CheckSquare size={12} /> Complete
                    </button>
                    <button
                      className="admin-action-btn cancel"
                      style={{ background: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      onClick={() => handleAction(item.id, 'Cancelled')}
                    >
                      <X size={12} /> Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Primary All Bookings Table */}
        <div className="admin-table-card">
          <div className="admin-table-head">
            <h3 style={{ margin: 0 }}>All Kataragama Reservations</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search guest or NIC..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '6px 10px 6px 28px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--mid-gray)',
                    fontSize: '12.5px',
                    outline: 'none',
                    width: '200px',
                  }}
                />
              </div>
              <select
                className="admin-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All Status">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Done">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select
                className="admin-filter-select"
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
              >
                <option value="All Rooms">All Rooms</option>
                <option value="Room A – Deluxe">Room A – Deluxe</option>
                <option value="Room B – Standard">Room B – Standard</option>
                <option value="Room C – Suite">Room C – Suite</option>
                <option value="Room D – Budget">Room D – Budget</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="bookings-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Guest Info</th>
                  <th>Unit</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '24px', textAlignment: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No matching reservations found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 700, color: 'var(--crimson)' }}>
                        KTG-2026-{String(item.id).padStart(4, '0')}
                      </td>
                      <td>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-dark)', display: 'block' }}>{item.guest_name}</strong>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>NIC: {item.nic} | Phone: {item.phone}</span>
                      </td>
                      <td>
                        <span className="badge badge-crimson" style={{ fontSize: '11.5px', background: 'rgba(139,0,0,.06)', color: 'var(--crimson)', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>{item.unit_number}</span>
                      </td>
                      <td>{item.check_in?.substring(0, 10)}</td>
                      <td>{item.check_out?.substring(0, 10)}</td>
                      <td style={{ fontWeight: 700 }}>
                        Rs. {Number(item.amount).toLocaleString()}
                      </td>
                      <td>
                        <span
                          className="bk-status"
                          style={{
                            background: `${statusColors[item.status]}15`,
                            color: statusColors[item.status],
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '11.5px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                          {item.status === 'Done' ? 'Completed' : item.status}
                        </span>
                      </td>
                      <td className="action-cell" style={{ justifyContent: 'center' }}>
                        <button
                          className="btn btn-outline btn-xs"
                          style={{ padding: '4px 8px', fontSize: '11px', color: '#1a7f5a', borderColor: '#1a7f5a' }}
                          disabled={item.status === 'Confirmed'}
                          onClick={() => handleAction(item.id, 'Confirmed')}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-outline btn-xs"
                          style={{ padding: '4px 8px', fontSize: '11px', color: '#1e40af', borderColor: '#1e40af' }}
                          disabled={item.status === 'Done'}
                          onClick={() => handleAction(item.id, 'Done')}
                        >
                          Complete
                        </button>
                        <button
                          className="btn btn-outline btn-xs"
                          style={{ padding: '4px 8px', fontSize: '11px', color: '#dc2626', borderColor: '#dc2626' }}
                          disabled={item.status === 'Cancelled'}
                          onClick={() => handleAction(item.id, 'Cancelled')}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
