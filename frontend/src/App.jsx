import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PMSLayout from './components/pms/PMSLayout';

// Guest Pages
import HomePage from './pages/guest/HomePage';
import RoomsPage from './pages/guest/RoomsPage';
import RoomDetailPage from './pages/guest/RoomDetailPage';
import GalleryPage from './pages/guest/GalleryPage';
import AmenitiesPage from './pages/guest/AmenitiesPage';
import AboutPage from './pages/guest/AboutPage';
import ContactPage from './pages/guest/ContactPage';
import OffersPage from './pages/guest/OffersPage';
import GuestPanel from './pages/guest/GuestPanel';

// Booking
import BookingPage from './pages/booking/BookingPage';
import BookingConfirmation from './pages/booking/BookingConfirmation';

// Auth
import LoginPage from './components/auth/LoginPage';

import React, { useEffect, Suspense } from 'react';

// PMS (Lazy Loaded)
const PMSDashboard = React.lazy(() => import('./pages/pms/PMSDashboard'));
const ReservationList = React.lazy(() => import('./pages/pms/ReservationList'));
const RoomStatusBoard = React.lazy(() => import('./pages/pms/RoomStatusBoard'));
const GuestList = React.lazy(() => import('./pages/pms/GuestList'));
const HousekeepingBoard = React.lazy(() => import('./pages/pms/HousekeepingBoard'));
const ReceptionQueue = React.lazy(() => import('./pages/pms/ReceptionQueue'));
const Analytics = React.lazy(() => import('./pages/pms/Analytics'));
const AIAssistant = React.lazy(() => import('./components/pms/AIAssistant'));
const CalendarView = React.lazy(() => import('./pages/pms/CalendarView'));
const Expenses = React.lazy(() => import('./pages/pms/Expenses'));
import ToastContainer from './components/ui/ToastContainer';

// Admin (Lazy Loaded)
const RoomManagement = React.lazy(() => import('./pages/admin/RoomManagement'));
const PricingManagement = React.lazy(() => import('./pages/admin/PricingManagement'));
const UserManagement = React.lazy(() => import('./pages/admin/UserManagement'));
const Reports = React.lazy(() => import('./pages/admin/Reports'));

// Revenue (Lazy Loaded)
const RevenueDashboard = React.lazy(() => import('./pages/revenue/RevenueDashboard'));

// Channel (Lazy Loaded)
const ChannelManager = React.lazy(() => import('./pages/channel/ChannelManager'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function GuestLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AuthProvider>
          <ScrollToTop />
          <ToastContainer />
          <Routes>
          {/* Guest Routes */}
          <Route path="/" element={<GuestLayout><HomePage /></GuestLayout>} />
          <Route path="/rooms" element={<GuestLayout><RoomsPage /></GuestLayout>} />
          <Route path="/rooms/:slug" element={<GuestLayout><RoomDetailPage /></GuestLayout>} />
          <Route path="/gallery" element={<GuestLayout><GalleryPage /></GuestLayout>} />
          <Route path="/amenities" element={<GuestLayout><AmenitiesPage /></GuestLayout>} />
          <Route path="/about" element={<GuestLayout><AboutPage /></GuestLayout>} />
          <Route path="/contact" element={<GuestLayout><ContactPage /></GuestLayout>} />
          <Route path="/offers" element={<GuestLayout><OffersPage /></GuestLayout>} />
          
          {/* Booking Routes */}
          <Route path="/booking" element={<GuestLayout><BookingPage /></GuestLayout>} />
          <Route path="/booking/confirmation" element={<GuestLayout><BookingConfirmation /></GuestLayout>} />
          <Route path="/guest-panel" element={<GuestLayout><GuestPanel /></GuestLayout>} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin', 'manager', 'receptionist']}>
                <PMSLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PMSDashboard />} />
            <Route path="queue" element={<ReceptionQueue />} />
            <Route path="reservations" element={<ReservationList />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="rooms" element={<RoomStatusBoard />} />
            <Route path="guests" element={<GuestList />} />
            <Route path="housekeeping" element={<HousekeepingBoard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="expenses" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Expenses />
              </ProtectedRoute>
            } />
            <Route path="revenue" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <RevenueDashboard />
              </ProtectedRoute>
            } />
            <Route path="admin/rooms" element={
              <ProtectedRoute roles={['admin']}>
                <RoomManagement />
              </ProtectedRoute>
            } />
            <Route path="admin/pricing" element={
              <ProtectedRoute roles={['admin']}>
                <PricingManagement />
              </ProtectedRoute>
            } />
            <Route path="admin/users" element={
              <ProtectedRoute roles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="admin/reports" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="channel-manager" element={
              <ProtectedRoute roles={['admin']}>
                <ChannelManager />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
        </AuthProvider>
      </DataProvider>
    </BrowserRouter>
  );
}
