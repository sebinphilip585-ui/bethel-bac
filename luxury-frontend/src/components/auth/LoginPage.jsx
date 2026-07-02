import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Hotel, Mail, Lock, Eye, EyeOff, AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [pendingCount, setPendingCount] = useState(0);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/auth/stats`)
      .then(res => res.json())
      .then(data => setPendingCount(data.pendingBookings || 0))
      .catch(console.error);

    // Listen to public stream for live updates
    const source = new EventSource(`${API_BASE_URL}/api/notifications/stream`);
    source.onmessage = (event) => {
      try {
        const notif = JSON.parse(event.data);
        if (notif.type === 'booking') {
          setPendingCount(prev => prev + 1);
        }
      } catch (e) { }
    };
    return () => source.close();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const { error: loginError } = await login(email, password);
      if (loginError) {
        // Handle network errors gracefully
        if (loginError.message.includes('404')) {
          setError('Backend API is unreachable. Please verify server connection.');
        } else {
          setError(loginError.message);
        }
        setLoading(false);
      } else {
        navigate('/admin');
      }
    } else {
      if (!name) {
        setError('Name is required');
        setLoading(false);
        return;
      }
      const { error: signupError } = await signup(name, email, password, 'manager');
      if (signupError) {
        setError(signupError.message);
        setLoading(false);
      } else {
        navigate('/admin');
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'url("https://images.unsplash.com/photo-1542314831-c53cd4b85d00?q=80&w=2000&auto=format&fit=crop") center/cover no-repeat',
      position: 'relative'
    }}>
      {/* Dark Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
        backdropFilter: 'blur(8px)',
        zIndex: 0
      }} />

      {/* Unacknowledged Booking Banner */}
      {pendingCount > 0 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(220, 38, 38, 0.9)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          padding: '12px 24px',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '14px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          animation: 'pulse 2s infinite',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <AlertTriangle size={18} />
          <span>ATTENTION: {pendingCount} NEW DIRECT BOOKING(S) PENDING! PLEASE LOG IN TO MANAGE.</span>
        </div>
      )}

      <div style={{
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        color: 'white'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '72px', height: '72px',
            background: 'linear-gradient(135deg, var(--color-gold) 0%, #D4AF37 100%)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.4)'
          }}>
            <Hotel size={36} color="var(--color-navy)" />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: '1px',
            marginBottom: '8px',
            color: 'white'
          }}>
            BETHEL MEADOWS
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.7)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={16} color="var(--color-gold)" />
            {isLogin ? 'Enterprise PMS Portal' : 'Create Staff Account'}
          </p>
        </div>

        {/* Demo credentials */}
        {isLogin && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#93c5fd',
            lineHeight: 1.5
          }}>
            <strong>Demo Access:</strong><br />
            admin@bethelmeadows.com / manager@... / reception@...<br />
            Password: <code style={{ color: 'white', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>password</code>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '14px',
            color: '#fca5a5'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
              <input
                type="text"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '14px 16px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.2s'
                }}
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required={!isLogin}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              <input
                type="email"
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '14px 16px 14px 48px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.2s'
                }}
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '14px 48px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.2s'
                }}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: 0
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', marginTop: '12px', padding: '16px',
              background: 'linear-gradient(135deg, var(--color-gold) 0%, #D4AF37 100%)',
              color: 'var(--color-navy)', fontSize: '16px', fontWeight: 700,
              border: 'none', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
              textTransform: 'uppercase', letterSpacing: '1px'
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'none')}
          >
            {loading ? (isLogin ? 'Authenticating...' : 'Creating Account...') : (isLogin ? 'Access System' : 'Register Admin')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer', fontSize: '14px', transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
          >
            {isLogin ? "Need staff access? Request Account" : 'Return to Login'}
          </button>
        </div>
      </div>
      
      {/* Footer Text */}
      <div style={{
        position: 'absolute', bottom: '24px', width: '100%', textAlign: 'center',
        color: 'rgba(255,255,255,0.4)', fontSize: '12px', zIndex: 10
      }}>
        &copy; {new Date().getFullYear()} Bethel Meadows Property Management System. All rights reserved.
      </div>
    </div>
  );
}
