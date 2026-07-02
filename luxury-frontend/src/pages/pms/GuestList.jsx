import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';
import { Search, Users, Mail, Phone, Calendar, ChevronRight, ClipboardList, ShieldAlert, CheckCircle } from 'lucide-react';

export default function GuestList() {
  const { guests, bookings } = useData();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' or 'archives'
  const [selectedGuest, setSelectedGuest] = useState(null);

  const exportGuestCSV = (guest) => {
    const guestBookings = bookings.filter(b => b.guest?.email === guest.email);
    const headers = ['Booking ID', 'Check In', 'Check Out', 'Room', 'Nights', 'Status', 'Total Amount', 'Payment Status'];
    const rows = guestBookings.map(b => [
      b.id,
      format(new Date(b.check_in), 'yyyy-MM-dd'),
      format(new Date(b.check_out), 'yyyy-MM-dd'),
      b.room?.room_number || '',
      b.nights || 1,
      b.status,
      b.total_amount || 0,
      b.payment_status || 'pending'
    ]);
    
    const csvContent = [
      `Guest Name: ${guest.name}, Email: ${guest.email}, Phone: ${guest.phone}`,
      `ID Type: ${guest.id_type || 'N/A'}, ID Number: ${guest.id_number || 'N/A'}`,
      "",
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${guest.name.replace(/\\s+/g, '_')}_Profile_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter guests directory
  const filteredGuests = guests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.phone.includes(search)
  );

  // Compile check-in audit logs (all bookings with checked_in or checked_out status)
  const auditLogs = bookings.filter(b => b.status === 'checked_in' || b.status === 'checked_out');

  const filteredLogs = auditLogs.filter(b => {
    const name = b.guest?.name || '';
    const email = b.guest?.email || '';
    const phone = b.guest?.phone || '';
    const idNum = b.guest?.id_number || '';
    const roomNum = b.room?.room_number || '';
    const searchLower = search.toLowerCase();

    return name.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      phone.includes(search) ||
      idNum.toLowerCase().includes(searchLower) ||
      roomNum.includes(search);
  });

  return (
    <div>
      <div className="pms-page-header">
        <div>
          <h1 className="pms-page-title">Guest Directory & Archives</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
            Manage registered guests and lookup historic check-in liability/safety records
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{
        display: 'flex', gap: 'var(--space-2)', borderBottom: '1px solid var(--color-gray-200)',
        marginBottom: 'var(--space-6)', paddingBottom: '2px'
      }}>
        <button
          onClick={() => { setActiveTab('directory'); setSearch(''); }}
          className={`pms-btn ${activeTab === 'directory' ? 'pms-btn-primary' : 'pms-btn-outline'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, padding: '8px 16px' }}
        >
          <Users size={16} style={{ marginRight: '6px' }} />
          Guest Directory ({guests.length})
        </button>
        <button
          onClick={() => { setActiveTab('archives'); setSearch(''); }}
          className={`pms-btn ${activeTab === 'archives' ? 'pms-btn-primary' : 'pms-btn-outline'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, padding: '8px 16px' }}
        >
          <ClipboardList size={16} style={{ marginRight: '6px' }} />
          Check-in Safety Archives ({auditLogs.length})
        </button>
        <button
          onClick={() => window.print()}
          className="pms-btn-outline"
          style={{ marginLeft: 'auto', padding: '8px 16px' }}
        >
          📄 Download PDF (Print)
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', maxWidth: '400px', marginBottom: 'var(--space-6)' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
        <input
          className="pms-input"
          style={{ paddingLeft: '36px' }}
          placeholder={activeTab === 'directory' ? "Search by name, email, or phone..." : "Search by name, room, or ID number..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tab 1: Guest Cards Directory */}
      {activeTab === 'directory' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-4)' }} className="animate-fade-in">
          {filteredGuests.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-400)' }}>
              No guests found.
            </div>
          ) : (
            filteredGuests.map(guest => (
              <div 
                key={guest.id} 
                className="card card-flat" 
                style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--color-gray-200)' }}
                onClick={() => setSelectedGuest(guest)}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="card-body" style={{ padding: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <div style={{
                      width: '44px', height: '44px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-gold)',
                      color: 'var(--color-navy)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 'var(--text-lg)', fontFamily: 'var(--font-heading)'
                    }}>
                      {guest.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 'var(--text-base)' }}>{guest.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
                        {guest.total_stays || 0} stay{guest.total_stays > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-gray-500)' }}>
                      <Mail size={14} /> {guest.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-gray-500)' }}>
                      <Phone size={14} /> {guest.phone}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-gray-500)' }}>
                      <Calendar size={14} /> Last stay: {guest.last_stay ? format(new Date(guest.last_stay), 'MMM dd, yyyy') : 'No stays yet'}
                    </div>
                  </div>

                  {/* ID Info */}
                  <div style={{
                    marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)',
                    borderTop: '1px solid var(--color-gray-100)',
                    fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)'
                  }}>
                    {guest.id_type || 'Aadhaar'}: {guest.id_number || 'Not provided'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Guest Check-in Liability & Safety Archives */}
      {activeTab === 'archives' && (
        <div className="pms-table-container animate-fade-in">
          <table className="pms-table">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Guest Profile Details</th>
                <th>Verified Document ID</th>
                <th>Room No.</th>
                <th>Check-In & Out Duration</th>
                <th>Security Clearance Status</th>
                <th>Special Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-400)' }}>
                    No check-in archives found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', fontWeight: 600 }}>{log.id}</td>
                    <td>
                      <strong style={{ color: 'var(--color-navy)' }}>{log.guest?.name}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: '2px' }}>
                        ✉️ {log.guest?.email} <br />
                        📞 {log.guest?.phone}
                      </div>
                    </td>
                    <td>
                      <div style={{ background: 'var(--color-cream)', border: '1px solid var(--color-gold)', borderRadius: '4px', padding: '4px 8px', display: 'inline-block' }}>
                        <span style={{ fontSize: '10px', color: 'var(--color-brown)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                          {log.guest?.id_type || 'Aadhaar'}
                        </span>
                        <strong style={{ fontSize: '11px', color: 'var(--color-navy)', fontFamily: 'monospace' }}>
                          {log.guest?.id_number || 'NOT PROVIDED'}
                        </strong>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                      Room {log.room?.room_number || 'N/A'}
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 500 }}>
                        In: {format(new Date(log.check_in), 'dd MMM yyyy')} <br />
                        Out: {format(new Date(log.check_out), 'dd MMM yyyy')}
                      </div>
                    </td>
                    <td>
                      <span className={`pms-badge ${log.status === 'checked_in' ? 'pms-badge-success' : 'pms-badge-navy'}`}>
                        {log.status === 'checked_in' ? 'ACTIVE' : 'COMPLETED'}
                      </span>
                    </td>
                    <td style={{ maxWidth: '240px', fontSize: '12px', color: 'var(--color-gray-500)', lineHeight: '1.4' }}>
                      {log.special_requests && (
                        <div><strong>Req:</strong> {log.special_requests}</div>
                      )}
                      {log.notes && (
                        <div style={{ color: '#b91c1c', marginTop: '2px' }}><strong>Note:</strong> {log.notes}</div>
                      )}
                      {!log.special_requests && !log.notes && '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Guest Details Modal */}
      {selectedGuest && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card animate-fade-in-up" style={{ width: '100%', maxWidth: '600px', background: 'white' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--color-navy)' }}>
                Guest Profile: {selectedGuest.name}
              </h2>
              <button onClick={() => setSelectedGuest(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>
                ✕
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Contact Info</div>
                  <div style={{ marginTop: '8px', fontWeight: 500 }}>📧 {selectedGuest.email}</div>
                  <div style={{ marginTop: '4px', fontWeight: 500 }}>📞 {selectedGuest.phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Identification</div>
                  <div style={{ marginTop: '8px', fontWeight: 500 }}>{selectedGuest.id_type || 'ID'}: {selectedGuest.id_number || 'N/A'}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '8px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Stay History</h3>
                <button onClick={() => exportGuestCSV(selectedGuest)} className="pms-btn-outline">
                  ⬇ Download CSV
                </button>
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {bookings.filter(b => b.guest?.email === selectedGuest.email).length === 0 ? (
                  <p style={{ color: 'var(--color-gray-500)' }}>No stays found.</p>
                ) : (
                  bookings.filter(b => b.guest?.email === selectedGuest.email).map(b => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-gray-100)' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{format(new Date(b.check_in), 'MMM dd, yyyy')} - {format(new Date(b.check_out), 'MMM dd, yyyy')}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>Room {b.room?.room_number} | {b.nights || 1} Night(s)</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600 }}>₹{b.total_amount?.toLocaleString()}</div>
                        <span className={`pms-badge ${b.status === 'checked_in' ? 'pms-badge-success' : 'pms-badge-navy'}`} style={{ fontSize: '10px' }}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
