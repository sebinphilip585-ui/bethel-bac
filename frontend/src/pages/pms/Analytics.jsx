import React from 'react';
import { useData } from '../../contexts/DataContext';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Download, TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

export default function Analytics() {
  const { bookings, expenses } = useData();

  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i));
  
  const revenueData = last7Days.map(date => {
    const dayStr = format(date, 'yyyy-MM-dd');
    const dayBookings = bookings.filter(b => {
      if (!b.created_at) return false;
      try {
        const d = new Date(b.created_at);
        return !isNaN(d) && format(d, 'yyyy-MM-dd') === dayStr;
      } catch (e) {
        return false;
      }
    });
    const dayExpenses = expenses.filter(e => {
      if (!e.date) return false;
      try {
        const d = new Date(e.date);
        return !isNaN(d) && format(d, 'yyyy-MM-dd') === dayStr;
      } catch (e) {
        return false;
      }
    });
    
    const revenue = dayBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
    const cost = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      name: format(date, 'MMM dd'),
      revenue,
      expenses: cost,
      profit: revenue - cost
    };
  });

  const sourceDataRaw = bookings.reduce((acc, b) => {
    const src = b.source || 'Direct';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});
  const sourceData = Object.entries(sourceDataRaw).map(([name, value]) => ({ name, value }));
  
  const roomTypeDataRaw = bookings.reduce((acc, b) => {
    const rt = b.roomType || b.room?.room_type?.name || 'Unknown';
    acc[rt] = (acc[rt] || 0) + (b.total_amount || 0);
    return acc;
  }, {});
  const roomTypeData = Object.entries(roomTypeDataRaw).map(([name, value]) => ({ name, revenue: value }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const exportData = () => {
    const csvContent = "Date,Revenue,Expenses,Profit\\n" + 
      revenueData.map(d => `${d.name},${d.revenue},${d.expenses},${d.profit}`).join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Financial_Report_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in-up" style={{ paddingBottom: '40px' }}>
      <div className="pms-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="pms-header-title theme-text-primary">Analytics & Intelligence</h1>
          <p className="theme-text-secondary" style={{ fontSize: '14px', marginTop: '4px' }}>
            Comprehensive overview of hotel performance and financials.
          </p>
        </div>
        <button className="saas-btn" onClick={exportData}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
        
        {/* P&L Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="saas-card" style={{ gridColumn: 'span 2', padding: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <TrendingUp size={20} color="var(--brand-secondary)" />
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Profit & Loss (7 Days)</h3>
          </div>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} tickFormatter={v => `₹${v}`} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px' }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExp)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Room Type Revenue */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="saas-card" style={{ padding: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <BarChart3 size={20} color="var(--brand-secondary)" />
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Revenue by Room Type</h3>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomTypeData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-primary)" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} tickFormatter={v => `₹${v}`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} width={100} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px' }} cursor={{ fill: 'var(--bg-tertiary)' }} />
                <Bar dataKey="revenue" fill="var(--brand-secondary)" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Booking Sources */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="saas-card" style={{ padding: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <PieChartIcon size={20} color="var(--brand-secondary)" />
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Booking Sources</h3>
          </div>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
                  {sourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
