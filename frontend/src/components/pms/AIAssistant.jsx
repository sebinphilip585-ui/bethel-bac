import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Bot, Send, User, Sparkles, MessageSquare, Briefcase, Calendar, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAssistant() {
  const { bookings, rooms, expenses } = useData();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Operations Assistant. Ask me anything about the hotel, such as "Who arrives today?", "Show available rooms", or "What is our occupancy rate?"' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    setTimeout(() => {
      const response = processQuery(input.toLowerCase());
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800);

    setInput('');
  };

  const processQuery = (query) => {
    const q = query.toLowerCase();
    const formatList = (arr) => arr.length > 0 ? arr.join(', ') : 'none';
    const todayStr = new Date().toISOString().split('T')[0];
    
    const arrivalsToday = bookings.filter(b => b.check_in && b.check_in.toString().startsWith(todayStr) && b.status === 'confirmed');
    const arrivalNames = arrivalsToday.map(b => `${b.guest?.name || 'Guest'} (Room ${b.room?.room_number || 'N/A'})`);

    const departuresToday = bookings.filter(b => b.check_out && b.check_out.toString().startsWith(todayStr) && b.status === 'checked_in');
    const departureNames = departuresToday.map(b => `${b.guest?.name || 'Guest'} (Room ${b.room?.room_number || 'N/A'})`);

    const occRooms = rooms.filter(r => r.status === 'occupied').map(r => r.room_number);
    const vacantRooms = rooms.filter(r => r.status === 'available').map(r => r.room_number);
    const cleaningRooms = rooms.filter(r => r.status === 'cleaning').map(r => r.room_number);

    const totalRev = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
    const totalExp = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const netProfit = totalRev - totalExp;

    if (/(arrive|arrival|coming|check in|today)/.test(q) && /(guest|people|booking)/.test(q)) {
      return `For today's arrivals, we have ${arrivalsToday.length} pending guest check-in(s): ${formatList(arrivalNames)}.`;
    }
    if (/(leave|depart|check out|going)/.test(q)) {
      return `For today's departures, we have ${departuresToday.length} guest(s) scheduled to check out: ${formatList(departureNames)}.`;
    }
    if (/(free|available|vacant|empty|ready)/.test(q) && /(room)/.test(q)) {
      return `We currently have ${vacantRooms.length} vacant room(s) available for check-in: Room(s) ${formatList(vacantRooms)}.`;
    }
    if (/(clean|dirty|housekeeping|mess)/.test(q)) {
      return `Housekeeping has ${cleaningRooms.length} room(s) currently being cleaned: Room(s) ${formatList(cleaningRooms)}.`;
    }
    if (/(occupancy|full|busy)/.test(q)) {
      const rate = rooms.length > 0 ? Math.round((occRooms.length / rooms.length) * 100) : 0;
      return `Our current real-time occupancy is ${rate}% with Room(s) ${formatList(occRooms)} occupied.`;
    }
    if (/(revenue|money|cash|earn|profit|expense|financial|finance|health|balance)/.test(q)) {
      return `Financial Summary:\\n- Total Booking Revenue: ₹${totalRev.toLocaleString()}\\n- Total Property Expenses: ₹${totalExp.toLocaleString()}\\n- Net Profit: ₹${netProfit.toLocaleString()}\\n\\nWe logged ${expenses.length} expense entries so far.`;
    }
    if (/(email|draft|write|message)/.test(q)) {
      return `Here is a drafted email for your guests:\\n\\n"Dear [Guest Name],\\n\\nWe look forward to welcoming you to Bethel Meadows Hotel & Suites. Your room is reserved and we are preparing everything for your comfortable stay. Please let us know if you have any special requests.\\n\\nWarm regards,\\nFront Desk"`;
    }

    const activeCheckedIn = bookings.filter(b => b.status === 'checked_in').map(b => `${b.guest?.name || 'Guest'} (Room ${b.room?.room_number || 'N/A'})`);
    const rate = rooms.length > 0 ? Math.round((occRooms.length / rooms.length) * 100) : 0;

    return `Here is the exact operational situation for Bethel Meadows:\\n\\n` +
           `1. **Occupancy**: ${rate}% (${occRooms.length}/${rooms.length} occupied). Occupied by: ${formatList(activeCheckedIn)}.\\n` +
           `2. **Today's Activity**: ${arrivalsToday.length} pending arrivals (${formatList(arrivalNames)}) and ${departuresToday.length} pending departures (${formatList(departureNames)}).\\n` +
           `3. **Rooms State**: ${vacantRooms.length} vacant rooms available (${formatList(vacantRooms)}) and ${cleaningRooms.length} rooms in cleaning (${formatList(cleaningRooms)}).\\n` +
           `4. **Financial Health**: Total revenue is ₹${totalRev.toLocaleString()} and expenses are ₹${totalExp.toLocaleString()} (Net Profit: ₹${netProfit.toLocaleString()}).`;
  };

  const MessageBubble = ({ role, content }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexDirection: role === 'user' ? 'row-reverse' : 'row' }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
        background: role === 'user' ? 'var(--bg-primary)' : 'var(--brand-secondary)',
        color: role === 'user' ? 'var(--text-primary)' : 'white',
        border: role === 'user' ? '1px solid var(--border-primary)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
      </div>
      <div style={{
        background: role === 'user' ? 'var(--brand-primary)' : 'var(--bg-primary)',
        color: role === 'user' ? 'var(--bg-primary)' : 'var(--text-primary)',
        border: role === 'user' ? 'none' : '1px solid var(--border-primary)',
        padding: '16px', borderRadius: '16px', borderTopLeftRadius: role === 'assistant' ? 0 : '16px',
        borderTopRightRadius: role === 'user' ? 0 : '16px',
        maxWidth: '80%', fontSize: '14px', lineHeight: 1.6,
        boxShadow: 'var(--shadow-sm)',
        whiteSpace: 'pre-wrap'
      }}>
        {content}
      </div>
    </motion.div>
  );

  return (
    <div className="animate-fade-in-up" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', height: 'calc(100vh - 120px)' }}>
      {/* Chat Area */}
      <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--brand-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Bot size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Bethel AI Operations</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Online • Connected to live database</p>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--bg-secondary)' }}>
          {messages.map((m, i) => <MessageBubble key={i} role={m.role} content={m.content} />)}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--brand-secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} />
              </div>
              <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '16px', borderTopLeftRadius: 0, border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--text-tertiary)', borderRadius: '50%', animation: 'bounce 1s infinite 0.1s' }} />
                <span className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--text-tertiary)', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }} />
                <span className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--text-tertiary)', borderRadius: '50%', animation: 'bounce 1s infinite 0.3s' }} />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}>
          <div style={{ display: 'flex', gap: '12px', background: 'var(--bg-secondary)', padding: '8px', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about occupancy, revenue, arrivals..." 
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', padding: '0 12px', fontSize: '14px', color: 'var(--text-primary)' }}
            />
            <button onClick={handleSend} className="saas-btn" style={{ padding: '10px' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Actions Panel */}
      <div className="saas-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--brand-secondary)" /> Suggested Queries
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { icon: MessageSquare, text: 'What is the exact situation?' },
            { icon: Briefcase, text: 'Show financial health and revenue' },
            { icon: Calendar, text: 'Who is arriving today?' },
            { icon: Bot, text: 'Draft a welcome email' }
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => setInput(item.text)}
              className="saas-btn-outline" 
              style={{ justifyContent: 'flex-start', padding: '12px', textAlign: 'left', height: 'auto', border: '1px solid var(--border-secondary)', background: 'var(--bg-secondary)' }}
            >
              <item.icon size={16} style={{ color: 'var(--brand-secondary)' }} />
              <span style={{ flex: 1, fontSize: '13px' }}>{item.text}</span>
              <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
            </button>
          ))}
        </div>
        
        <div style={{ marginTop: '32px', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>System Context</h4>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
            AI Assistant is connected to the live PostgreSQL/SQLite database via DataContext. All queries regarding bookings, rooms, and expenses reflect real-time operational state.
          </p>
        </div>
      </div>
      <style>
        {`
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        `}
      </style>
    </div>
  );
}
