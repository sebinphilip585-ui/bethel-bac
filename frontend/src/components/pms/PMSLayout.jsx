import React, { Suspense, useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import NotificationBell from '../ui/NotificationBell';
import GlobalSearch from './GlobalSearch';
import ErrorBoundary from '../ui/ErrorBoundary';
import {
  LayoutDashboard, Calendar, CalendarCheck, BedDouble, Users, UserCircle,
  BarChart3, DollarSign, LogOut, Globe, Hotel, Shield,
  ClipboardList, GitCommit, TrendingUp, FileText, Wifi, MessageSquare,
  Sun, Moon, ChevronRight, Menu, X
} from 'lucide-react';
import NewBookingModal from './NewBookingModal';

export default function PMSLayout() {
  const { profile, logout } = useAuth();
  const { rooms } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const dirtyRoomsCount = rooms ? rooms.filter(r => r.status === 'cleaning').length : 0;
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  const isAdmin = profile?.role === 'admin';
  const isManager = profile?.role === 'manager' || isAdmin;

  const NavItem = ({ to, icon: Icon, label, badge }) => (
    <NavLink 
      to={to} 
      end={to === '/admin'}
      className={({ isActive }) => `enterprise-nav-item ${isActive ? 'active' : ''}`}
    >
      <Icon size={16} className="enterprise-nav-icon" />
      <span className="enterprise-nav-label">{label}</span>
      {badge > 0 && <span className="enterprise-nav-badge">{badge}</span>}
    </NavLink>
  );

  return (
    <div className="enterprise-layout">
      <NewBookingModal />
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className="enterprise-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`enterprise-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="enterprise-sidebar-header">
          <div className="enterprise-logo">
            <div className="enterprise-logo-icon">BM</div>
            <div className="enterprise-logo-text">
              <div className="enterprise-logo-title">Bethel Meadows</div>
              <div className="enterprise-logo-subtitle">ENTERPRISE PMS</div>
            </div>
          </div>
        </div>

        <nav className="enterprise-sidebar-nav">
          <div className="enterprise-nav-section">
            <div className="enterprise-nav-section-title">Overview</div>
            <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/admin/analytics" icon={BarChart3} label="Analytics" />
          </div>

          <div className="enterprise-nav-section">
            <div className="enterprise-nav-section-title">Operations</div>
            <NavItem to="/admin/reservations" icon={CalendarCheck} label="Reservations" />
            <NavItem to="/admin/calendar" icon={Calendar} label="Calendar" />
            <NavItem to="/admin/queue" icon={GitCommit} label="Digital Queue" />
            <NavItem to="/admin/rooms" icon={BedDouble} label="Room Status" />
            <NavItem to="/admin/housekeeping" icon={ClipboardList} label="Housekeeping" badge={dirtyRoomsCount} />
            <NavItem to="/admin/guests" icon={Users} label="Guests" />
          </div>

          {isManager && (
            <div className="enterprise-nav-section">
              <div className="enterprise-nav-section-title">Financials</div>
              <NavItem to="/admin/expenses" icon={DollarSign} label="Expenses" />
              <NavItem to="/admin/revenue" icon={TrendingUp} label="Revenue Reports" />
            </div>
          )}

          <div className="enterprise-nav-section">
            <div className="enterprise-nav-section-title">Intelligence</div>
            <NavItem to="/admin/ai-assistant" icon={MessageSquare} label="AI Assistant" />
          </div>

          {isAdmin && (
            <div className="enterprise-nav-section">
              <div className="enterprise-nav-section-title">Settings</div>
              <NavItem to="/admin/admin/rooms" icon={Hotel} label="Properties" />
              <NavItem to="/admin/admin/pricing" icon={DollarSign} label="Pricing & Yield" />
              <NavItem to="/admin/admin/users" icon={Shield} label="Access Control" />
            </div>
          )}
        </nav>

        <div className="enterprise-sidebar-footer">
          <div className="enterprise-user-profile">
            <div className="enterprise-user-avatar">{profile?.name?.[0] || 'U'}</div>
            <div className="enterprise-user-info">
              <div className="enterprise-user-name">{profile?.name || 'User'}</div>
              <div className="enterprise-user-role">{profile?.role || 'Staff'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="enterprise-logout-btn">
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="enterprise-main">
        {/* Top Header */}
        <header className="enterprise-header">
          <div className="enterprise-header-left">
            <button className="enterprise-mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="enterprise-connection-status">
              <Wifi size={12} className="enterprise-status-icon" />
              <span>Connected to Supabase</span>
            </div>
          </div>

          <div className="enterprise-header-center">
            <GlobalSearch />
          </div>

          <div className="enterprise-header-right">
            <button onClick={toggleTheme} className="enterprise-icon-btn">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <NotificationBell />
          </div>
        </header>

        {/* Page Content Container */}
        <div className="enterprise-content-scroll">
          <div className="enterprise-content-container">
            <ErrorBoundary>
              <Suspense fallback={
                <div className="enterprise-loader-container">
                  <div className="enterprise-spinner"></div>
                  <div className="enterprise-loader-text">Loading application module...</div>
                </div>
              }>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
}
