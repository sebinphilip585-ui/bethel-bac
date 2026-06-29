import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Plus, Trash2, IndianRupee, FileText, Calendar, 
  Building2, Paperclip, CheckCircle, Clock 
} from 'lucide-react';

export default function Expenses() {
  const { expenses, addExpense, deleteExpense } = useData();
  const [category, setCategory] = useState('housekeeping');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0 || !date) return;

    setIsSubmitting(true);
    await addExpense({
      category,
      amount: parseFloat(amount),
      description,
      vendor_name: vendorName,
      payment_status: paymentStatus,
      attachment_url: attachmentUrl,
      date
    });

    setAmount('');
    setDescription('');
    setVendorName('');
    setAttachmentUrl('');
    setIsFormOpen(false);
    setIsSubmitting(false);
  };

  const summary = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const chartData = Object.keys(summary).map(key => ({
    name: key,
    value: summary[key]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

  return (
    <div className="animate-fade-in-up" style={{ paddingBottom: '40px' }}>
      <div className="pms-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="pms-header-title theme-text-primary">Property Expenses</h1>
          <p className="theme-text-secondary" style={{ fontSize: '14px', marginTop: '4px' }}>
            Track vendors, receipts, and operational costs.
          </p>
        </div>
        <button onClick={() => setIsFormOpen(!isFormOpen)} className="saas-btn">
          <Plus size={16} /> Log Expense
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isFormOpen ? '1fr 2fr' : '1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Form Panel */}
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="saas-card" style={{ padding: '24px' }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>New Expense Record</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Category</label>
                <select className="saas-input" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="housekeeping">Housekeeping Supplies</option>
                  <option value="maintenance">Maintenance & Repairs</option>
                  <option value="utilities">Utilities</option>
                  <option value="salaries">Salaries</option>
                  <option value="marketing">Marketing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Amount (₹)</label>
                <input type="number" className="saas-input" placeholder="e.g. 1500" value={amount} onChange={e => setAmount(e.target.value)} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Vendor / Supplier Name</label>
                <input type="text" className="saas-input" placeholder="e.g. Metro Wholesale" value={vendorName} onChange={e => setVendorName(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Date</label>
                  <input type="date" className="saas-input" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Status</label>
                  <select className="saas-input" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Receipt URL (Optional)</label>
                <input type="url" className="saas-input" placeholder="https://..." value={attachmentUrl} onChange={e => setAttachmentUrl(e.target.value)} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: 'var(--text-secondary)' }}>Description</label>
                <textarea className="saas-input" rows="2" placeholder="Details..." value={description} onChange={e => setDescription(e.target.value)} />
              </div>

                <button type="button" className="saas-btn saas-btn-outline" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button type="submit" className="saas-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Expense'}
                </button>
            </form>
          </motion.div>
        )}

        {/* Dashboard & Ledger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div className="saas-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Expenses</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444', marginTop: '8px' }}>₹{totalExpenses.toLocaleString()}</div>
            </div>
            
            {/* Chart Card */}
            <div className="saas-card" style={{ gridColumn: 'span 2', padding: '20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '120px', height: '120px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {chartData.map((data, idx) => (
                  <div key={data.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[idx % COLORS.length] }} />
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{data.name}</div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>₹{data.value.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="saas-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-primary)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Ledger</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Vendor</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                    <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Amount</th>
                    <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>No expenses recorded.</td>
                    </tr>
                  ) : (
                    expenses.map(exp => (
                      <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                        <td style={{ padding: '16px 20px', fontSize: '14px' }}>{format(new Date(exp.date), 'dd MMM yyyy')}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ 
                            background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                            padding: '4px 8px', borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 
                          }}>
                            {exp.category}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '14px' }}>
                          <div style={{ fontWeight: 500 }}>{exp.vendor_name || '-'}</div>
                          {exp.description && <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{exp.description}</div>}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px',
                            color: exp.payment_status === 'paid' ? '#10b981' : exp.payment_status === 'overdue' ? '#ef4444' : '#f59e0b'
                          }}>
                            {exp.payment_status === 'paid' ? <CheckCircle size={14}/> : <Clock size={14}/>}
                            <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{exp.payment_status || 'Paid'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', fontWeight: 600 }}>
                          ₹{exp.amount.toLocaleString()}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            {exp.attachment_url && (
                              <a href={exp.attachment_url} target="_blank" rel="noreferrer" className="btn-icon" style={{ color: 'var(--brand-secondary)' }}>
                                <Paperclip size={16} />
                              </a>
                            )}
                            <button onClick={() => deleteExpense(exp.id)} className="btn-icon" style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
