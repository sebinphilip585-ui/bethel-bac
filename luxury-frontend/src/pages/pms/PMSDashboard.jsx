import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData, parseLocalDate } from '../../contexts/DataContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  CalendarCheck, BedDouble, Users, DoorOpen, DoorClosed,
  TrendingUp, FileText, Settings, Activity, AlertCircle, XCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PMSDashboard() {
  const { bookings, rooms, getRevenueStats } = useData();

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const stats = getRevenueStats();

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = format(tomorrowDate, 'yyyy-MM-dd');

  const sevenDaysDate = new Date();
  sevenDaysDate.setDate(sevenDaysDate.getDate() + 7);
  const sevenDaysStr = format(sevenDaysDate, 'yyyy-MM-dd');

  const todayArrivals = bookings.filter(b => format(parseLocalDate(b.check_in), 'yyyy-MM-dd') === todayStr && (b.status === 'confirmed' || b.status === 'pending'));
  const tomorrowArrivals = bookings.filter(b => format(parseLocalDate(b.check_in), 'yyyy-MM-dd') === tomorrowStr && (b.status === 'confirmed' || b.status === 'pending'));
  const upcomingArrivals = bookings.filter(b => {
    const ci = format(parseLocalDate(b.check_in), 'yyyy-MM-dd');
    return ci > tomorrowStr && ci <= sevenDaysStr && (b.status === 'confirmed' || b.status === 'pending');
  });

  const todayDepartures = bookings.filter(b => format(parseLocalDate(b.check_out), 'yyyy-MM-dd') === todayStr && b.status === 'checked_in');
  const activeGuests = bookings.filter(b => b.status === 'checked_in').reduce((sum, b) => sum + (b.guests_count || 1), 0);
  
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const cleaningRooms = rooms.filter(r => r.status === 'cleaning').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;
  const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;
  
  const pendingConfirmations = bookings.filter(b => b.status === 'pending').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const upcomingCheckins = bookings.filter(b => b.status === 'confirmed' && format(parseLocalDate(b.check_in), 'yyyy-MM-dd') > todayStr).length;
  const upcomingCheckouts = bookings.filter(b => b.status === 'checked_in' && format(parseLocalDate(b.check_out), 'yyyy-MM-dd') > todayStr).length;

  const exportAuditReport = () => {
    // Audit report logic (omitted for brevity but functional if needed)
    alert("Audit Report exported (simulation)");
  };

  const StatCard = ({ title, value, icon: Icon, color, delay, to }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link 
        to={to}
        className="pms-stat-card"
        style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', height: '100%' }}
      >
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `rgba(${color}, 0.1)`, color: `rgb(${color})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={24} />
        </div>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{value}</div>
        </div>
      </Link>
    </motion.div>
  );

  // Mock revenue data for chart
  const revenueData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            {format(today, 'EEEE, MMMM dd, yyyy')} — Live Property Status
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportAuditReport} className="pms-btn pms-btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <FileText size={16} /> Audit Report
          </button>
          <Link to="/admin/reservations" className="pms-btn pms-btn-primary" style={{ textDecoration: 'none' }}>
            <CalendarCheck size={16} /> New Booking
          </Link>
        </div>
      </div>

      {/* Main KPI Grid - 5 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <StatCard title="Today's Arrivals" value={todayArrivals.length} icon={DoorOpen} color="59, 130, 246" delay={0.05} to="/admin/reservations" />
        <StatCard title="Tomorrow's Arrivals" value={tomorrowArrivals.length} icon={CalendarCheck} color="139, 92, 246" delay={0.1} to="/admin/reservations" />
        <StatCard title="Upcoming (7 Days)" value={upcomingArrivals.length} icon={Activity} color="245, 158, 11" delay={0.15} to="/admin/reservations" />
        <StatCard title="Current Guests" value={activeGuests} icon={Users} color="16, 185, 129" delay={0.2} to="/admin/reservations" />
        <StatCard title="Today's Departures" value={todayDepartures.length} icon={DoorClosed} color="239, 68, 68" delay={0.25} to="/admin/reservations" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Today's Revenue" value={`₹${stats.todayRevenue.toLocaleString()}`} icon={TrendingUp} color="16, 185, 129" delay={0.3} to="/admin/revenue" />
        <StatCard title="Occupancy Rate" value={`${occupancyRate}%`} icon={Activity} color="59, 130, 246" delay={0.35} to="/admin/rooms" />
        <StatCard title="Occupied Rooms" value={occupiedRooms} icon={BedDouble} color="239, 68, 68" delay={0.4} to="/admin/rooms" />
        <StatCard title="Rooms (Cleaning)" value={cleaningRooms} icon={Settings} color="245, 158, 11" delay={0.45} to="/admin/rooms" />
        <StatCard title="Available Rooms" value={availableRooms} icon={BedDouble} color="16, 185, 129" delay={0.5} to="/admin/rooms" />
      </div>

      {/* Deep Dive Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="pms-card" style={{ padding: '24px' }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>Revenue Overview (Last 7 Days)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Action Items List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="pms-card" style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>Booking Pipeline</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CalendarCheck size={18} color="var(--text-secondary)" />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Total Bookings</span>
              </div>
              <span style={{ fontWeight: 700 }}>{bookings.length}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlertCircle size={18} color="#f59e0b" />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Pending Confirmations</span>
              </div>
              <span style={{ fontWeight: 700, color: '#f59e0b' }}>{pendingConfirmations}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <DoorOpen size={18} color="#3b82f6" />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Upcoming Check-ins</span>
              </div>
              <span style={{ fontWeight: 700 }}>{upcomingCheckins}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <DoorClosed size={18} color="#8b5cf6" />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Upcoming Check-outs</span>
              </div>
              <span style={{ fontWeight: 700 }}>{upcomingCheckouts}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <XCircle size={18} color="#ef4444" />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Cancelled Bookings</span>
              </div>
              <span style={{ fontWeight: 700, color: '#ef4444' }}>{cancelledBookings}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
