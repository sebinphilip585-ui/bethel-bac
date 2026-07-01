import { useData } from '../../contexts/DataContext';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />
};

const COLORS = {
  success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#166534' },
  warning: { bg: '#fffbeb', border: '#fde68a', color: '#92400e' },
  error: { bg: '#fef2f2', border: '#fecaca', color: '#dc2626' },
  info: { bg: '#eff6ff', border: '#bfdbfe', color: '#1e40af' }
};

export default function ToastContainer() {
  const { toasts, removeToast } = useData();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '400px'
    }}>
      {toasts.map(toast => {
        const style = COLORS[toast.type] || COLORS.info;
        return (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '12px 16px',
              background: style.bg,
              border: `1px solid ${style.border}`,
              borderRadius: '8px',
              color: style.color,
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              animation: 'slideInRight 0.3s ease',
              lineHeight: '1.4'
            }}
          >
            <span style={{ flexShrink: 0, marginTop: '1px' }}>{ICONS[toast.type] || ICONS.info}</span>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: style.color, opacity: 0.6, flexShrink: 0, padding: 0
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
