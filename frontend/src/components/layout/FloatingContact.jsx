import { useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '16px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        alignItems: 'flex-end'
      }}>
        <a 
          href="https://wa.me/918281122009" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            background: '#25D366',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
            fontWeight: 600,
            fontSize: '14px'
          }}
        >
          <MessageCircle size={20} />
          WhatsApp Us
        </a>
        <a 
          href="tel:+918281122009" 
          style={{
            background: 'var(--color-navy)',
            color: 'var(--color-gold)',
            padding: '12px 20px',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontWeight: 600,
            fontSize: '14px',
            border: '1px solid var(--color-gold)'
          }}
        >
          <Phone size={20} />
          Call Now
        </a>
      </div>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--color-gold)',
          color: 'var(--color-navy)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(197, 164, 109, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <MessageCircle size={28} style={{ 
          transform: isOpen ? 'rotate(90deg) scale(0)' : 'rotate(0) scale(1)', 
          position: 'absolute',
          transition: 'transform 0.3s'
        }} />
        <span style={{ 
          transform: isOpen ? 'rotate(0) scale(1)' : 'rotate(-90deg) scale(0)', 
          position: 'absolute',
          transition: 'transform 0.3s',
          fontSize: '24px',
          lineHeight: 1
        }}>✕</span>
      </button>
    </div>
  );
}
