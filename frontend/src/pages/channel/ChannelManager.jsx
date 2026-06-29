import { Globe, Link, RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

const OTAS = [
  { name: 'Booking.com', logo: '🏨', status: 'not_connected', rooms_synced: 0, bookings: 0 },
  { name: 'Agoda', logo: '🌐', status: 'not_connected', rooms_synced: 0, bookings: 0 },
  { name: 'MakeMyTrip', logo: '✈️', status: 'not_connected', rooms_synced: 0, bookings: 0 },
  { name: 'Goibibo', logo: '🏝️', status: 'not_connected', rooms_synced: 0, bookings: 0 },
  { name: 'Expedia', logo: '🌍', status: 'not_connected', rooms_synced: 0, bookings: 0 },
];

export default function ChannelManager() {
  return (
    <div>
      <div className="pms-header">
        <div>
          <h1 className="pms-header-title">Channel Manager</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>
            Manage OTA connections and inventory sync
          </p>
        </div>
        <button className="btn btn-ghost btn-sm" disabled>
          <RefreshCw size={16} /> Sync All
        </button>
      </div>

      {/* Coming Soon Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-10)',
        textAlign: 'center',
        marginBottom: 'var(--space-8)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-30px', right: '-30px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(201,169,110,0.1)'
        }} />
        <Globe size={48} color="var(--color-gold)" style={{ marginBottom: 'var(--space-4)' }} />
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)',
          color: 'var(--color-white)', marginBottom: 'var(--space-3)'
        }}>
          Coming Soon
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto', fontSize: 'var(--text-sm)' }}>
          The Channel Manager module will enable seamless integration with major OTA platforms. 
          Manage inventory, rates, and bookings from a single dashboard.
        </p>
        <div style={{
          display: 'inline-block', marginTop: 'var(--space-4)',
          padding: 'var(--space-2) var(--space-6)',
          background: 'rgba(201,169,110,0.2)',
          borderRadius: 'var(--radius-full)',
          color: 'var(--color-gold)',
          fontSize: 'var(--text-sm)', fontWeight: 600
        }}>
          Module Under Development
        </div>
      </div>

      {/* OTA Cards */}
      <h3 style={{
        fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)',
        color: 'var(--color-navy)', marginBottom: 'var(--space-4)'
      }}>
        Supported Platforms
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {OTAS.map(ota => (
          <div key={ota.name} style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-gray-200)',
            padding: 'var(--space-6)',
            opacity: 0.7
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-3xl)' }}>{ota.logo}</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{ota.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>OTA Platform</div>
                </div>
              </div>
              <span className="badge badge-navy">
                <XCircle size={10} /> Not Connected
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div style={{ padding: 'var(--space-2)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-gray-300)' }}>0</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>Rooms Synced</div>
              </div>
              <div style={{ padding: 'var(--space-2)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-gray-300)' }}>0</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>Bookings</div>
              </div>
            </div>

            <button className="btn btn-outline btn-sm" style={{ width: '100%' }} disabled>
              <Link size={14} /> Connect
            </button>
          </div>
        ))}
      </div>

      {/* OTA Bookings Table */}
      <div style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-gray-200)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: 'var(--space-4) var(--space-5)',
          borderBottom: '1px solid var(--color-gray-200)',
          background: 'var(--color-gray-50)'
        }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-navy)' }}>
            OTA Bookings
          </h3>
        </div>
        <div style={{ padding: 'var(--space-16)', textAlign: 'center' }}>
          <Globe size={48} color="var(--color-gray-300)" style={{ marginBottom: 'var(--space-4)' }} />
          <p style={{ color: 'var(--color-gray-400)', fontSize: 'var(--text-sm)' }}>
            No OTA bookings yet. Connect your channels to start receiving bookings.
          </p>
        </div>
      </div>
    </div>
  );
}
