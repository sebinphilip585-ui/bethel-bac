import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { RefreshCw, CheckCircle, AlertTriangle, Wrench, Sparkles, BedDouble, Clock } from 'lucide-react';

export default function HousekeepingBoard() {
  const { rooms, markRoomClean, markRoomMaintenance, updateRoomStatus } = useData();
  const [filter, setFilter] = useState('all');

  const cleaningRooms = rooms.filter(r => r.status === 'cleaning');
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance');
  const occupiedRooms = rooms.filter(r => r.status === 'occupied');
  const availableRooms = rooms.filter(r => r.status === 'available');

  const filteredRooms = filter === 'all' ? rooms : rooms.filter(r => r.status === filter);

  return (
    <div>
      <div className="pms-header">
        <div>
          <h1 className="pms-header-title">Housekeeping</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
            Manage room cleaning and maintenance
          </p>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-card-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
            <Sparkles size={24} />
          </div>
          <div className="stat-card-value">{cleaningRooms.length}</div>
          <div className="stat-card-label">Needs Cleaning</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #6b7280' }}>
          <div className="stat-card-icon" style={{ background: '#f3f4f6', color: '#6b7280' }}>
            <Wrench size={24} />
          </div>
          <div className="stat-card-value">{maintenanceRooms.length}</div>
          <div className="stat-card-label">Maintenance</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="stat-card-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <BedDouble size={24} />
          </div>
          <div className="stat-card-value">{occupiedRooms.length}</div>
          <div className="stat-card-label">Occupied</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #22c55e' }}>
          <div className="stat-card-icon" style={{ background: '#f0fdf4', color: '#22c55e' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-card-value">{availableRooms.length}</div>
          <div className="stat-card-label">Clean & Ready</div>
        </div>
      </div>

      {/* Priority Section: Rooms needing action */}
      {cleaningRooms.length > 0 && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-5)',
          marginBottom: 'var(--space-6)'
        }}>
          <h3 style={{
            fontSize: 'var(--text-sm)', fontWeight: 600, color: '#92400e',
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)'
          }}>
            <AlertTriangle size={16} /> Rooms Requiring Immediate Cleaning
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            {cleaningRooms.map(room => (
              <div key={room.id} style={{
                background: 'white', borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>Room {room.room_number}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{room.room_type.name}</div>
                </div>
                <button
                  onClick={() => markRoomClean(room.id)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: 'var(--text-xs)' }}
                >
                  <CheckCircle size={14} /> Mark Clean
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {[
          { val: 'all', label: `All (${rooms.length})` },
          { val: 'cleaning', label: `Cleaning (${cleaningRooms.length})` },
          { val: 'maintenance', label: `Maintenance (${maintenanceRooms.length})` },
          { val: 'occupied', label: `Occupied (${occupiedRooms.length})` },
          { val: 'available', label: `Available (${availableRooms.length})` },
        ].map(f => (
          <button
            key={f.val}
            onClick={() => setFilter(f.val)}
            className={`btn btn-sm ${filter === f.val ? 'btn-secondary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* All Rooms Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Type</th>
              <th>Floor</th>
              <th>Current Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map(room => (
              <tr key={room.id}>
                <td style={{ fontWeight: 600 }}>{room.room_number}</td>
                <td>{room.room_type.name}</td>
                <td>Floor {room.floor}</td>
                <td>
                  <span className={`badge ${
                    room.status === 'available' ? 'badge-success' :
                    room.status === 'cleaning' ? 'badge-warning' :
                    room.status === 'occupied' ? 'badge-error' :
                    room.status === 'maintenance' ? 'badge-navy' :
                    'badge-info'
                  }`}>
                    {room.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {room.status === 'cleaning' && (
                      <button onClick={() => markRoomClean(room.id)} className="btn btn-primary btn-sm" style={{ fontSize: '11px' }}>
                        <CheckCircle size={12} /> Clean
                      </button>
                    )}
                    {room.status === 'available' && (
                      <button onClick={() => updateRoomStatus(room.id, 'cleaning')} className="btn btn-ghost btn-sm" style={{ fontSize: '11px' }}>
                        <Sparkles size={12} /> Request Clean
                      </button>
                    )}
                    {(room.status === 'available' || room.status === 'cleaning') && (
                      <button onClick={() => markRoomMaintenance(room.id)} className="btn btn-ghost btn-sm" style={{ fontSize: '11px', color: '#6b7280' }}>
                        <Wrench size={12} /> Maintenance
                      </button>
                    )}
                    {room.status === 'maintenance' && (
                      <button onClick={() => markRoomClean(room.id)} className="btn btn-ghost btn-sm" style={{ fontSize: '11px', color: '#22c55e' }}>
                        <CheckCircle size={12} /> Resolve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
