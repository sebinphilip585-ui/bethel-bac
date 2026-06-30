import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Users, CheckCircle, Clock, AlertCircle, Plus, 
  Volume2, X, FileText, ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReceptionQueue() {
  const { digitalQueue, addQueueItem, updateQueueItem, deleteQueueItem, startAlarmSound } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    guest_name: '',
    purpose: 'check_in',
    priority: 'normal',
    notes: ''
  });

  const waiting = digitalQueue.filter(q => q.status === 'waiting');
  const called = digitalQueue.filter(q => q.status === 'called');
  const completed = digitalQueue.filter(q => q.status === 'completed' && new Date(q.completed_at).toDateString() === new Date().toDateString());

  const handleCreate = async () => {
    if (!formData.guest_name) return;
    
    // Generate token number (e.g., A-101) sequentially based on today's items
    const prefix = formData.purpose === 'check_in' ? 'I' : formData.purpose === 'check_out' ? 'O' : 'Q';
    const todaysItems = digitalQueue.filter(q => new Date(q.joined_at || q.created_at || Date.now()).toDateString() === new Date().toDateString());
    const count = todaysItems.length;
    const number = 100 + count + 1;
    const token = `${prefix}-${number}`;

    await addQueueItem({
      ...formData,
      token_number: token
    });
    
    setIsModalOpen(false);
    setFormData({ guest_name: '', purpose: 'check_in', priority: 'normal', notes: '' });
  };

  const handleCall = async (id) => {
    await updateQueueItem(id, { status: 'called' });
    startAlarmSound(); // Siren or chime to notify
  };

  const handleComplete = async (id) => {
    await updateQueueItem(id, { 
      status: 'completed', 
      completed_at: new Date().toISOString() 
    });
  };

  const QueueCard = ({ item }) => {
    const priorityColors = {
      urgent: '#ef4444', high: '#f59e0b', normal: '#3b82f6', low: '#9ca3af'
    };

    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="saas-card glass-panel" style={{ padding: '16px', marginBottom: '12px', borderLeft: `4px solid ${priorityColors[item.priority] || '#3b82f6'}` }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace', letterSpacing: '2px' }}>
              {item.token_number}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '4px' }}>
              {item.guest_name || item.guest_name_db || 'Walk-in Guest'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ textTransform: 'capitalize' }}>{item.purpose.replace('_', ' ')}</span>
              <span>•</span>
              <span title={format(new Date(item.joined_at), 'PPpp')}>
                Waited {formatDistanceToNow(new Date(item.joined_at))}
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {item.status === 'waiting' && (
              <button className="saas-btn" style={{ background: 'var(--brand-secondary)' }} onClick={() => handleCall(item.id)}>
                <Volume2 size={14} /> Call
              </button>
            )}
            {item.status === 'called' && (
              <button className="saas-btn" style={{ background: '#10b981' }} onClick={() => handleComplete(item.id)}>
                <CheckCircle size={14} /> Complete
              </button>
            )}
            <button className="saas-btn-outline" style={{ padding: '6px', fontSize: '12px' }} onClick={() => deleteQueueItem(item.id)}>
              <X size={14} />
            </button>
          </div>
        </div>
        {item.notes && (
          <div style={{ marginTop: '12px', fontSize: '12px', background: 'var(--bg-tertiary)', padding: '8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
            <FileText size={12} style={{ display: 'inline', marginRight: '4px' }}/> {item.notes}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="animate-fade-in-up">
      <div className="pms-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="pms-header-title theme-text-primary">Digital Reception Queue</h1>
          <p className="theme-text-secondary" style={{ fontSize: '14px' }}>Manage walk-ins and guest requests efficiently.</p>
        </div>
        <button className="saas-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Generate Token
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {/* Waiting Column */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '16px', height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} /> Waiting
            </h3>
            <span style={{ background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>{waiting.length}</span>
          </div>
          <AnimatePresence>
            {waiting.map(item => <QueueCard key={item.id} item={item} />)}
            {waiting.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '12px', marginTop: '32px' }}>Queue is empty</p>}
          </AnimatePresence>
        </div>

        {/* Called Column */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '16px', height: 'calc(100vh - 200px)', overflowY: 'auto', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--brand-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={16} /> Serving Now
            </h3>
            <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--brand-secondary)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>{called.length}</span>
          </div>
          <AnimatePresence>
            {called.map(item => <QueueCard key={item.id} item={item} />)}
            {called.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '12px', marginTop: '32px' }}>No guests currently called</p>}
          </AnimatePresence>
        </div>

        {/* Completed Column */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '16px', height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} /> Completed Today
            </h3>
            <span style={{ background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>{completed.length}</span>
          </div>
          <AnimatePresence>
            {completed.map(item => <QueueCard key={item.id} item={item} />)}
            {completed.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '12px', marginTop: '32px' }}>No completed tasks today</p>}
          </AnimatePresence>
        </div>
      </div>

      {/* Generate Token Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="saas-card" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Issue New Token</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={20}/></button>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Guest Name / Ref</label>
                  <input className="saas-input" value={formData.guest_name} onChange={e => setFormData({...formData, guest_name: e.target.value})} placeholder="e.g. Smith Family" />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Purpose</label>
                  <select className="saas-input" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}>
                    <option value="check_in">Check-in</option>
                    <option value="check_out">Check-out</option>
                    <option value="inquiry">Inquiry</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Priority</label>
                  <select className="saas-input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Notes (Optional)</label>
                  <textarea className="saas-input" rows="2" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="e.g. VIP guest, needs wheelchair"></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button className="saas-btn" onClick={handleCreate} disabled={!formData.guest_name}>
                  Generate Token
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
