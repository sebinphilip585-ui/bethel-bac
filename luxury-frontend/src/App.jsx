import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';
import LoadingScreen from './components/LoadingScreen';

const Home = lazy(() => import('./pages/Home'));
const RoomDetail = lazy(() => import('./pages/RoomDetail'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const GuestPortal = lazy(() => import('./pages/GuestPortal'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

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
      <Routes>
        {/* Admin route - no navbar/footer */}
        <Route path="/admin/*" element={
          <Suspense fallback={<LoadingScreen />}>
            <AdminDashboard />
          </Suspense>
        } />
        
        {/* Public routes with navbar/footer */}
        <Route path="*" element={
          <>
            <Navbar />
            <Suspense fallback={
              <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>Loading...</div>
              </div>
            }>
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
    </Router>
  );
}

export default App;
