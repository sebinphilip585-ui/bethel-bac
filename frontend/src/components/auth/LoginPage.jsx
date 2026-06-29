import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Hotel, Mail, Lock, Eye, EyeOff, AlertCircle, AlertTriangle } from 'lucide-react';
import { api } from '../../lib/api';

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

  useEffect(() => {
    fetch('https://bethel-bac-production.up.railway.app/api/auth/stats')
      .then(res => res.json())
      .then(data => setPendingCount(data.pendingBookings || 0))
      .catch(console.error);

    // Listen to public stream for live updates
    const source = new EventSource('https://bethel-bac-production.up.railway.app/api/notifications/stream');
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
        setError(loginError.message);
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
      const { error: signupError } = await signup(name, email, password, 'admin'); // default admin for new signup
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
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)',
      padding: 'var(--space-6)',
      position: 'relative'
    }}>
      {/* Unacknowledged Booking Banner */}
      {pendingCount > 0 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: '#dc2626',
          color: 'white',
          padding: '12px 24px',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '14px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          animation: 'pulse 1.5s infinite',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <AlertTriangle size={18} />
          <span>CRITICAL: {pendingCount} NEW DIRECT BOOKING(S) RECEIVED! SIGN IN IMMEDIATELY TO ACKNOWLEDGE!</span>
        </div>
      )}
      <div style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-10)',
        width: '100%',
        maxWidth: '420px',
        boxShadow: 'var(--shadow-2xl)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'var(--color-gold)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-4)'
          }}>
            <Hotel size={32} color="var(--color-navy)" />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            color: 'var(--color-navy)',
            marginBottom: 'var(--space-1)'
          }}>
            Bethel Meadows
          </h1>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-gray-500)'
          }}>
            {isLogin ? 'Staff Portal — Sign in to continue' : 'Staff Portal — Create an account'}
          </p>
        </div>

        {/* Demo credentials */}
        {isLogin && (
          <div style={{
            background: 'var(--color-info-bg)',
            border: '1px solid #bfdbfe',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
            fontSize: 'var(--text-xs)',
            color: '#1e40af'
          }}>
            <strong>Demo Credentials:</strong><br />
            Admin: admin@bethelmeadows.com<br />
            Manager: manager@bethelmeadows.com<br />
            Reception: reception@bethelmeadows.com<br />
            Password: <code style={{ background: '#dbeafe', padding: '1px 4px', borderRadius: '3px' }}>password</code>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            background: 'var(--color-error-bg)',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-4)',
            fontSize: 'var(--text-sm)',
            color: '#dc2626'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--color-gray-400)'
              }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--color-gray-400)'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--color-gray-400)', background: 'none', border: 'none', cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: 'var(--space-4)' }}
          >
            {loading ? (isLogin ? 'Signing in...' : 'Signing up...') : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{
              background: 'none', border: 'none', color: 'var(--color-gold)',
              cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'underline'
            }}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
