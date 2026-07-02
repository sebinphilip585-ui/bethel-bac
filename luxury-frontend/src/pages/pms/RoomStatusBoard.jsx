import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';
import { BedDouble, RefreshCw, X, ShieldAlert, Sparkles, Wrench, Shield, CheckCircle, Eye } from 'lucide-react';
import InvoiceModal from '../../components/ui/InvoiceModal';

const STATUSES = ['available', 'reserved', 'occupied', 'cleaning', 'maintenance'];

export default function RoomStatusBoard() {
  const { rooms, bookings, updateRoomStatus, markRoomClean, markRoomMaintenance } = useData();
  const [filter, setFilter] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [invoiceBookingId, setInvoiceBookingId] = useState(null);
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  function getRoomStatus(room) {
    // Rely on room's database status
    return room.status || 'available';
  }

  function getGuestForRoom(room) {
    return bookings.find(b =>
      b.room?.id === room.id && (b.status === 'checked_in' || b.status === 'confirmed')
    );
  }

  const roomsWithStatus = rooms.map(r => ({ ...r, currentStatus: getRoomStatus(r) }));
  const filtered = filter === 'all' ? roomsWithStatus : roomsWithStatus.filter(r => r.currentStatus === filter);
  const floors = [...new Set(filtered.map(r => r.floor))].sort((a,b) => a-b);

  const statusCounts = {};
  STATUSES.forEach(s => { statusCounts[s] = roomsWithStatus.filter(r => r.currentStatus === s).length; });

  function handleRoomClick(room) {
    const guest = getGuestForRoom(room);
    setSelectedRoom({ ...room, guest });
  }

  function handleUpdateStatus(status) {
    if (!selectedRoom) return;
    if (status === 'available') {
      markRoomClean(selectedRoom.id);
    } else if (status === 'maintenance') {
      markRoomMaintenance(selectedRoom.id);
    } else {
      updateRoomStatus(selectedRoom.id, status);
    }
    // Update local modal state
    setSelectedRoom(prev => ({ ...prev, currentStatus: status }));
  }

  return (
    <div>
      <div className="pms-header">
        <div>
          <h1 className="pms-header-title">Room Status Board</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
            Real-time room status, housekeeping coordination, and maintenance tracking
          </p>
        </div>
      </div>

      {/* Status Summary Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => setFilter('all')}
          className={`btn btn-sm ${filter === 'all' ? 'btn-secondary' : 'btn-ghost'}`}
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          All ({rooms.length})
        </button>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? 'btn-secondary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: s === 'available' ? '#22c55e' : s === 'reserved' ? '#3b82f6' :
                s === 'occupied' ? '#ef4444' : s === 'cleaning' ? '#f59e0b' : '#6b7280',
              display: 'inline-block', marginRight: '6px'
            }} />
            {s.charAt(0).toUpperCase() + s.slice(1)} ({statusCounts[s]})
          </button>
        ))}
      </div>

      {/* Room Grid by Floor */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedRoom ? '1fr 340px' : '1fr', gap: 'var(--space-6)', transition: 'all var(--transition-base)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {floors.map(floor => (
            <div key={floor} style={{ marginBottom: 'var(--space-4)', background: 'var(--color-white)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-200)' }}>
              <h3 style={{
                fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-navy)',
                textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 'var(--space-4)',
                borderBottom: '1px solid var(--color-gray-100)', paddingBottom: '6px', display: 'flex', justifyContent: 'space-between'
              }}>
                <span>Floor {floor}</span>
                <span style={{ color: 'var(--color-gray-400)', textTransform: 'none', fontWeight: 500 }}>
                  {filtered.filter(r => r.floor === floor).length} rooms
                </span>
              </h3>
              <div className="room-grid">
                {filtered.filter(r => r.floor === floor).map(room => {
                  const guest = getGuestForRoom(room);
                  return (
                    <div
                      key={room.id}
                      className={`room-tile ${room.currentStatus} ${selectedRoom?.id === room.id ? 'active-tile' : ''}`}
                      onClick={() => handleRoomClick(room)}
                      style={{
                        transform: selectedRoom?.id === room.id ? 'scale(1.03)' : 'none',
                        border: selectedRoom?.id === room.id ? '2px solid var(--color-navy)' : '2px solid transparent'
                      }}
                    >
                      <div className="room-tile-number">{room.room_number}</div>
                      <div className="room-tile-type">{room.room_type.name.split(' ')[0]}</div>
                      <div className="room-tile-status">{room.currentStatus}</div>
                      {guest && (
                        <div style={{
                          fontSize: '10px', marginTop: '6px', fontWeight: 600,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          background: 'rgba(255,255,255,0.4)', borderRadius: '3px', padding: '1px 4px'
                        }}>
                          👤 {guest.guest?.name?.split(' ')[0]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Inspector Side Panel */}
        {selectedRoom && (
          <div className="animate-fade-in" style={{
            background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-200)',
            padding: '24px', alignSelf: 'start', position: 'sticky', top: '100px', boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🚪 Room {selectedRoom.room_number}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-gray-400)', marginTop: '2px' }}>
                  {selectedRoom.room_type?.name} · Floor {selectedRoom.floor}
                </p>
              </div>
              <button onClick={() => setSelectedRoom(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Room Status Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-gray-50)', border: '1px solid var(--color-gray-200)', marginBottom: '20px' }}>
              <span style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: selectedRoom.currentStatus === 'available' ? '#22c55e' : selectedRoom.currentStatus === 'reserved' ? '#3b82f6' :
                  selectedRoom.currentStatus === 'occupied' ? '#ef4444' : selectedRoom.currentStatus === 'cleaning' ? '#f59e0b' : '#6b7280'
              }} />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Status: {selectedRoom.currentStatus}
              </span>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                Quick Status Actions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedRoom.currentStatus !== 'available' && (
                  <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={() => handleUpdateStatus('available')}>
                    <Sparkles size={14} /> Mark Clean & Available
                  </button>
                )}
                {selectedRoom.currentStatus !== 'cleaning' && selectedRoom.currentStatus !== 'occupied' && (
                  <button className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={() => handleUpdateStatus('cleaning')}>
                    <Sparkles size={14} /> Send to Cleaning (Dirty)
                  </button>
                )}
                {selectedRoom.currentStatus !== 'maintenance' && (
                  <button className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-error)' }} onClick={() => handleUpdateStatus('maintenance')}>
                    <Wrench size={14} /> Place in Maintenance
                  </button>
                )}
              </div>
            </div>

            {/* Guest details if Occupied or Reserved */}
            {selectedRoom.guest ? (
              <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  Occupant Information
                </h4>
                <div style={{ padding: '12px', background: 'var(--color-cream)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gold)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 'var(--text-sm)' }}>
                    👤 {selectedRoom.guest.guest?.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-gray-500)', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span>✉️ {selectedRoom.guest.guest?.email}</span>
                    <span>📞 {selectedRoom.guest.guest?.phone}</span>
                    <span style={{ marginTop: '4px' }}>📅 Stay: <strong>{format(new Date(selectedRoom.guest.check_in), 'dd MMM')}</strong> to <strong>{format(new Date(selectedRoom.guest.check_out), 'dd MMM')}</strong></span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1, padding: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }} onClick={() => setInvoiceBookingId(selectedRoom.guest.id)}>
                      <Eye size={12} /> Invoice
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: '20px', textAlign: 'center', padding: '16px', color: 'var(--color-gray-400)', fontSize: '12px' }}>
                No active guest currently assigned or reserved for today.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invoice Modal Overlay */}
      {invoiceBookingId && (
        <InvoiceModal bookingId={invoiceBookingId} onClose={() => setInvoiceBookingId(null)} />
      )}
    </div>
  );
}
