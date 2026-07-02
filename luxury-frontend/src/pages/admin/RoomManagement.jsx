import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Edit, Trash2, Search, BedDouble, X } from 'lucide-react';

export default function RoomManagement() {
  const { rooms, roomTypes, addRoom, deleteRoom, updateRoomStatus } = useData();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Add Room Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    roomNumber: '',
    roomTypeId: 'rt-1',
    floor: '1',
    status: 'available'
  });

  const filtered = rooms.filter(r => {
    const matchesSearch = r.room_number.includes(search);
    const matchesType = typeFilter === 'all' || r.room_type_id === typeFilter;
    return matchesSearch && matchesType;
  });

  function handleOpenAdd() {
    setNewRoomData({
      roomNumber: '',
      roomTypeId: roomTypes[0]?.id || 'rt-1',
      floor: '1',
      status: 'available'
    });
    setIsAddOpen(true);
  }

  function handleAddSubmit(e) {
    e.preventDefault();
    if (!newRoomData.roomNumber) return;
    // Check if room number already exists
    if (rooms.some(r => r.room_number === newRoomData.roomNumber)) {
      alert(`Room number ${newRoomData.roomNumber} already exists!`);
      return;
    }
    addRoom({
      roomNumber: newRoomData.roomNumber,
      roomTypeId: newRoomData.roomTypeId,
      floor: parseInt(newRoomData.floor) || 1,
      status: newRoomData.status
    });
    setIsAddOpen(false);
  }

  return (
    <div>
      <div className="pms-header">
        <div>
          <h1 className="pms-header-title">Room Management</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
            {rooms.length} rooms configured in the system across {roomTypes.length} categories
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Room
        </button>
      </div>

      {/* Room Types Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {roomTypes.map(rt => {
          const roomCount = rooms.filter(r => r.room_type_id === rt.id).length;
          return (
            <div key={rt.id} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="stat-card-label" style={{ marginTop: 0 }}>{rt.name}</div>
                  <div className="stat-card-value" style={{ fontSize: 'var(--text-2xl)' }}>{roomCount}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>
                    Base: ₹{rt.base_price.toLocaleString()}/night
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
          <input className="form-input" style={{ paddingLeft: '36px' }} placeholder="Search room number..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: '200px' }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
        </select>
      </div>

      <div className="table-container animate-fade-in">
        <table className="table">
          <thead>
            <tr>
              <th>Room No.</th>
              <th>Type</th>
              <th>Floor</th>
              <th>Bed Type</th>
              <th>Base Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{r.room_number}</td>
                <td>{r.room_type?.name || 'Deluxe Room'}</td>
                <td>Floor {r.floor}</td>
                <td>{r.room_type?.bed_type || 'King'}</td>
                <td>₹{r.room_type?.base_price.toLocaleString()}</td>
                <td>
                  <span className={`badge ${
                    r.status === 'available' ? 'badge-success' :
                    r.status === 'reserved' ? 'badge-info' :
                    r.status === 'occupied' ? 'badge-error' :
                    r.status === 'cleaning' ? 'badge-warning' : 'badge-navy'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <select
                      className="form-select"
                      style={{ width: '120px', padding: '2px 6px', fontSize: '12px', height: 'auto' }}
                      value={r.status}
                      onChange={e => updateRoomStatus(r.id, e.target.value)}
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="occupied">Occupied</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                    <button className="btn btn-icon btn-ghost" style={{ color: 'var(--color-error)' }} onClick={() => deleteRoom(r.id)} title="Delete Room">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Room Modal Overlay */}
      {isAddOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.5)', backdropFilter: 'blur(4px)',
          zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="animate-fade-in-up" style={{
            background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '400px',
            boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--color-gray-200)', overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 24px', borderBottom: '1px solid var(--color-gray-200)', background: 'var(--color-gray-50)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-navy)' }}>
                ➕ Configure New Room
              </h3>
              <button onClick={() => setIsAddOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-500)' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Room Number *</label>
                  <input
                    className="form-input"
                    value={newRoomData.roomNumber}
                    onChange={e => setNewRoomData(prev => ({ ...prev, roomNumber: e.target.value }))}
                    placeholder="e.g. 109"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Room Type *</label>
                  <select
                    className="form-select"
                    value={newRoomData.roomTypeId}
                    onChange={e => setNewRoomData(prev => ({ ...prev, roomTypeId: e.target.value }))}
                  >
                    {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Floor *</label>
                  <select
                    className="form-select"
                    value={newRoomData.floor}
                    onChange={e => setNewRoomData(prev => ({ ...prev, floor: e.target.value }))}
                  >
                    <option value="1">Floor 1</option>
                    <option value="2">Floor 2</option>
                    <option value="3">Floor 3</option>
                    <option value="4">Floor 4</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Status</label>
                  <select
                    className="form-select"
                    value={newRoomData.status}
                    onChange={e => setNewRoomData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="available">Available</option>
                    <option value="cleaning">Cleaning (Dirty)</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div style={{
                display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px',
                paddingTop: '16px', borderTop: '1px solid var(--color-gray-200)'
              }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Configure Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
