import { useState } from 'react';
import { MOCK_USERS } from '../../lib/api';
import { Plus, Edit, Shield, UserCircle, ToggleLeft, ToggleRight } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState(MOCK_USERS);

  function toggleUser(id) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  }

  const roleColors = { admin: 'badge-error', manager: 'badge-warning', receptionist: 'badge-info' };

  return (
    <div>
      <div className="pms-header">
        <div>
          <h1 className="pms-header-title">User Management</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
            Manage staff accounts and roles
          </p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={16} /> Add User</button>
      </div>

      {/* Role Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {[
          { role: 'admin', label: 'Administrators', desc: 'Full system access', icon: <Shield size={24} /> },
          { role: 'manager', label: 'Managers', desc: 'Reports & operations', icon: <UserCircle size={24} /> },
          { role: 'receptionist', label: 'Receptionists', desc: 'Bookings & front desk', icon: <UserCircle size={24} /> }
        ].map(r => (
          <div key={r.role} className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(201,169,110,0.1)', color: 'var(--color-gold)' }}>
              {r.icon}
            </div>
            <div className="stat-card-value" style={{ fontSize: 'var(--text-2xl)' }}>
              {users.filter(u => u.role === r.role).length}
            </div>
            <div className="stat-card-label">{r.label}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', marginTop: '2px' }}>{r.desc}</div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: 'var(--radius-full)',
                      background: 'var(--color-gold)', color: 'var(--color-navy)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 'var(--text-sm)'
                    }}>{u.name[0]}</div>
                    <span style={{ fontWeight: 500 }}>{u.name}</span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td><span className={`badge ${roleColors[u.role]}`}>{u.role}</span></td>
                <td>
                  <button onClick={() => toggleUser(u.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: u.active ? 'var(--color-success)' : 'var(--color-gray-400)' }}>
                    {u.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                </td>
                <td>
                  <button className="btn btn-icon btn-ghost"><Edit size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
