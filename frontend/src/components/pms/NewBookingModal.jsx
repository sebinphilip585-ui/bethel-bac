import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function NewBookingModal() {
  const { unacknowledgedBookings, setBookings } = useData();

  if (unacknowledgedBookings.length === 0) return null;

  const handleAcknowledgeAll = () => {
    window.dispatchEvent(new CustomEvent('bm_acknowledge_all'));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999 // Ensure it covers everything
    }}>
      <div className="glass-panel" style={{
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        boxShadow: 'var(--shadow-2xl)',
        animation: 'slideUp 0.3s ease-out',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <button 
            onClick={handleAcknowledgeAll}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
          >
            ✕
          </button>
        </div>

        <div style={{
          width: '80px',
          height: '80px',
          background: '#fee2e2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-6)',
          animation: 'pulse 2s infinite'
        }}>
          <AlertTriangle size={40} color="#dc2626" />
        </div>
        
        <h2 style={{
          fontSize: 'var(--text-3xl)',
          color: '#1e293b',
          marginBottom: 'var(--space-2)',
          fontFamily: 'var(--font-heading)'
        }}>
          Attention Required
        </h2>
        
        <p style={{
          fontSize: 'var(--text-lg)',
          color: '#475569',
          marginBottom: 'var(--space-4)'
        }}>
          You have <strong style={{ color: '#dc2626', fontSize: 'var(--text-xl)' }}>{unacknowledgedBookings.length}</strong> new direct booking(s) pending your review.
        </p>

        <div style={{ marginBottom: 'var(--space-8)', textAlign: 'left', background: '#f8fafc', padding: '12px', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto' }}>
          {unacknowledgedBookings.map((notif, idx) => (
            <div key={idx} style={{ marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', fontSize: '14px' }}>
              <strong>{notif.title}</strong><br/>
              {notif.message}
            </div>
          ))}
        </div>

        <button 
          onClick={handleAcknowledgeAll}
          style={{
            background: 'var(--color-primary, #0f172a)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            fontSize: '18px',
            fontWeight: 600,
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            transition: 'all 0.2s'
          }}
        >
          <CheckCircle2 size={24} />
          OK, I Acknowledge
        </button>
      </div>
    </div>
  );
}
