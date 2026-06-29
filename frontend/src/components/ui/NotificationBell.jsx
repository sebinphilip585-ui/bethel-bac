import { useState, useRef, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function NotificationBell() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications, deleteNotification } = useData();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close on click outside
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Audio ping on new notification
  useEffect(() => {
    if (unreadCount > 0 && notifications[0] && !notifications[0].read) {
      try {
        // Use Web Audio API for a notification sound
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.value = 0.1;
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.frequency.value = 1000;
          osc2.type = 'sine';
          gain2.gain.value = 0.1;
          osc2.start();
          osc2.stop(ctx.currentTime + 0.15);
        }, 160);
      } catch (_) { /* ignore audio errors */ }
    }
  }, [notifications.length]);

  const PRIORITY_COLORS = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e'
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-gray-500)',
          padding: '8px'
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '2px', right: '2px',
            width: '18px', height: '18px',
            background: '#ef4444',
            borderRadius: '50%',
            color: 'white',
            fontSize: '10px',
            fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'pulse 1.5s ease infinite'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '380px',
          maxHeight: '480px',
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          border: '1px solid var(--color-gray-200)',
          zIndex: 9999,
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid var(--color-gray-200)',
            background: 'var(--color-gray-50)'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>
              Notifications {unreadCount > 0 && <span className="badge badge-error" style={{ marginLeft: '4px' }}>{unreadCount}</span>}
            </h4>
            {notifications.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => { markAllNotificationsRead(); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--color-blue-500)', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Check size={14}/> Mark all read
                </button>
                <button
                  onClick={() => { clearNotifications(); setOpen(false); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--color-red-500)', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14}/> Clear
                </button>
              </div>
            )}
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--color-gray-400)', fontSize: '14px' }}>
                <Bell size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--color-gray-100)',
                    background: n.read ? 'transparent' : 'rgba(201,169,110,0.05)',
                    transition: 'background 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-gray-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(201,169,110,0.05)'}
                >
                  <div style={{
                    width: '8px', height: '8px',
                    borderRadius: '50%',
                    background: PRIORITY_COLORS[n.priority] || '#c9a96e',
                    flexShrink: 0,
                    marginTop: '6px'
                  }} />
                  <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => markNotificationRead(n.id)}>
                    <div style={{
                      fontSize: '13px', fontWeight: n.read ? 400 : 600,
                      color: 'var(--color-navy)', marginBottom: '2px'
                    }}>
                      {n.title}
                    </div>
                    <div style={{
                      fontSize: '12px', color: 'var(--color-gray-500)',
                      lineHeight: '1.4'
                    }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: '4px' }}>
                      {n.created_at ? format(new Date(n.created_at), 'MMM d, h:mm a') : (n.timestamp ? format(new Date(n.timestamp), 'h:mm a') : '')}
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteNotification(n.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)', padding: '4px' }}
                    title="Delete"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
