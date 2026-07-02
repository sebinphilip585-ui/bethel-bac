import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useData } from '../../contexts/DataContext';
import { Plus, X, Calendar as CalendarIcon, Clock, Users, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView() {
  const { calendarEvents, bookings, rooms, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent, addToast } = useData();
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    start_time: '',
    end_time: '',
    type: 'meeting',
    description: '',
    color: '#3b82f6'
  });

  // Combine bookings and custom calendar events
  const events = useMemo(() => {
    const bookingEvents = bookings
      .filter(b => b.status !== 'cancelled')
      .map(b => ({
        id: b.id,
        title: `${b.guest?.name} (Room ${b.room?.room_number || 'TBD'})`,
        start: new Date(b.check_in),
        end: new Date(b.check_out),
        type: 'booking',
        color: b.status === 'checked_in' ? '#22c55e' : '#3b82f6',
        resource: b
      }));

    const customEvents = calendarEvents.map(e => ({
      id: e.id,
      title: e.title,
      start: new Date(e.start_time),
      end: new Date(e.end_time),
      type: e.type,
      color: e.color || '#8b5cf6',
      description: e.description,
      resource: e
    }));

    return [...bookingEvents, ...customEvents];
  }, [bookings, calendarEvents]);

  const handleSelectSlot = ({ start, end }) => {
    setFormData({
      title: '',
      start_time: format(start, "yyyy-MM-dd'T'HH:mm"),
      end_time: format(end, "yyyy-MM-dd'T'HH:mm"),
      type: 'meeting',
      description: '',
      color: '#8b5cf6'
    });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    if (event.type === 'booking') {
      addToast(`Booking for ${event.resource.guest?.name}. Go to Reservations to edit.`, 'info');
      return;
    }
    
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      start_time: format(event.start, "yyyy-MM-dd'T'HH:mm"),
      end_time: format(event.end, "yyyy-MM-dd'T'HH:mm"),
      type: event.type,
      description: event.description,
      color: event.color
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.start_time || !formData.end_time) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    if (selectedEvent) {
      await updateCalendarEvent(selectedEvent.id, formData);
    } else {
      await addCalendarEvent(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (selectedEvent && window.confirm('Delete this event?')) {
      await deleteCalendarEvent(selectedEvent.id);
      setIsModalOpen(false);
    }
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '6px',
        opacity: 0.9,
        color: '#fff',
        border: '0px',
        display: 'block',
        boxShadow: 'var(--shadow-sm)'
      }
    };
  };

  return (
    <div className="animate-fade-in-up" style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <div className="pms-page-header" style={{ marginBottom: 'var(--space-4)', flexShrink: 0 }}>
        <div>
          <h1 className="pms-page-title theme-text-primary">Master Calendar</h1>
          <p className="theme-text-secondary" style={{ fontSize: '14px' }}>Drag and drop events, site visits, and team meetings.</p>
        </div>
        <button className="pms-btn-primary" onClick={() => handleSelectSlot({ start: new Date(), end: new Date(Date.now() + 3600000) })}>
          <Plus size={16} /> New Event
        </button>
      </div>

      <div className="pms-card" style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <style>
          {`
            .rbc-calendar { font-family: var(--font-body); }
            .rbc-toolbar button { color: var(--text-primary); border-color: var(--border-primary); }
            .rbc-toolbar button.rbc-active { background-color: var(--brand-secondary); color: white; border-color: var(--brand-secondary); }
            .rbc-month-view, .rbc-time-view, .rbc-agenda-view { border-color: var(--border-primary); background: var(--bg-primary); }
            .rbc-header { border-color: var(--border-primary); padding: 8px; font-weight: 600; }
            .rbc-day-bg { border-color: var(--border-primary); }
            .rbc-today { background-color: var(--bg-tertiary); }
            .rbc-event { padding: 4px 8px; font-size: 12px; font-weight: 500; }
            .rbc-time-content { border-color: var(--border-primary); }
            .rbc-timeslot-group { border-color: var(--border-primary); }
          `}
        </style>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ flex: 1 }}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          view={view}
          date={date}
          onView={setView}
          onNavigate={setDate}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          popup
        />
      </div>

      {/* Event Modal */}
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
              className="pms-card" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{selectedEvent ? 'Edit Event' : 'New Event'}</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={20}/></button>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Event Title</label>
                  <input className="pms-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Site Visit with Mr. John" />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Start Time</label>
                    <input type="datetime-local" className="pms-input" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>End Time</label>
                    <input type="datetime-local" className="pms-input" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Type</label>
                    <select className="pms-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="meeting">Meeting</option>
                      <option value="visit">Site Visit</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Color Label</label>
                    <input type="color" className="pms-input" style={{ padding: '4px', height: '40px' }} value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Description</label>
                  <textarea className="pms-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                {selectedEvent && (
                  <button className="pms-btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={handleDelete}>Delete</button>
                )}
                <button className="pms-btn-primary" onClick={handleSave}>Save Event</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
