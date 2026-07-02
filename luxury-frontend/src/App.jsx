import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// New Luxury Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';
import LoadingScreen from './components/LoadingScreen';

// Contexts & Auth for PMS
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './components/auth/LoginPage';
import ToastContainer from './components/ui/ToastContainer';

// Old PMS Layout
import PMSLayout from './components/pms/PMSLayout';

// Luxury Pages
const Home = lazy(() => import('./pages/Home'));
const RoomDetail = lazy(() => import('./pages/RoomDetail'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const GuestPortal = lazy(() => import('./pages/GuestPortal'));

// PMS Pages
const PMSDashboard = lazy(() => import('./pages/pms/PMSDashboard'));
const ReservationList = lazy(() => import('./pages/pms/ReservationList'));
const RoomStatusBoard = lazy(() => import('./pages/pms/RoomStatusBoard'));
const GuestList = lazy(() => import('./pages/pms/GuestList'));
const HousekeepingBoard = lazy(() => import('./pages/pms/HousekeepingBoard'));
const ReceptionQueue = lazy(() => import('./pages/pms/ReceptionQueue'));
const Analytics = lazy(() => import('./pages/pms/Analytics'));
const AIAssistant = lazy(() => import('./components/pms/AIAssistant'));
const CalendarView = lazy(() => import('./pages/pms/CalendarView'));
const Expenses = lazy(() => import('./pages/pms/Expenses'));
const RoomManagement = lazy(() => import('./pages/admin/RoomManagement'));
const PricingManagement = lazy(() => import('./pages/admin/PricingManagement'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const RevenueDashboard = lazy(() => import('./pages/revenue/RevenueDashboard'));
const ChannelManager = lazy(() => import('./pages/channel/ChannelManager'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <DataProvider>
        <AuthProvider>
          <ScrollToTop />
          <ToastContainer />
          <Routes>
            {/* Admin Login */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Protected Admin Routes (Old PMS) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin', 'manager', 'receptionist']}>
                  <Suspense fallback={<LoadingScreen />}>
                    <PMSLayout />
                  </Suspense>
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
              <Route path="rooms-manage" element={
                <ProtectedRoute roles={['admin']}>
                  <RoomManagement />
                </ProtectedRoute>
              } />
              <Route path="pricing" element={
                <ProtectedRoute roles={['admin']}>
                  <PricingManagement />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute roles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="reports" element={
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
            
            {/* Public routes with luxury navbar/footer */}
            <Route path="*" element={
              <>
                <Navbar />
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/rooms/:id" element={<RoomDetail />} />
                    <Route path="/booking" element={<BookingPage />} />
                    <Route path="/guest-portal" element={<GuestPortal />} />
                  </Routes>
                </Suspense>
                <Footer />
                <FloatingContact />
              </>
            } />
          </Routes>
        </AuthProvider>
      </DataProvider>
    </Router>
  );
}

export default App;
