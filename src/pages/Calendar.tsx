import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isToday, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import api from '../utils/api'; // <-- Import your Axios instance

// Sample events data
interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  type: string;
  description?: string;
}

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('event');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(selectedDate);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    api.get('/api/events')
      .then(res => {
        setEvents(res.data.map((event: CalendarEvent) => ({
          ...event,
          date: new Date(event.date)
        })));
      })
      .catch(() => {
        // Optionally handle error
      });
  }, []);
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };
  
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };
  
  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEE';
    
    const startDate = startOfWeek(currentMonth);
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center py-2 font-medium text-sm text-gray-500">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };
  
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = events.filter(event => isSameDay(event.date, cloneDay));
        
        days.push(
          <div
            key={day.toString()}
            className={`relative min-h-[120px] border border-gray-200 p-2 ${
              !isSameMonth(day, monthStart)
                ? 'bg-gray-50 text-gray-400'
                : isToday(day)
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white'
            } ${isSameDay(day, selectedDate) ? 'border-teal-500' : ''}`}
            onClick={() => onDateClick(cloneDay)}
          >
            <div className="flex justify-between">
              <span className={`text-sm ${isToday(day) ? 'font-bold text-blue-600' : ''}`}>
                {format(day, 'd')}
              </span>
              {dayEvents.length > 0 && (
                <span className="text-xs font-medium bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-full">
                  {dayEvents.length}
                </span>
              )}
            </div>
            <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px]">
              {dayEvents.map(event => (
                <div 
                  key={event.id}
                  className={`text-xs p-1 rounded-md truncate ${
                    event.type === 'maintenance' ? 'bg-red-100 text-red-800' :
                    event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'schedule' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    
    return <div className="mb-4">{rows}</div>;
  };
  
  const handleAddEvent = () => {
    setEventDate(selectedDate);
    setShowEventModal(true);
  };
  
  const handleSaveEvent = async () => {
    if (!eventTitle || !eventDate) return;
    const fullDate = new Date(eventDate);
    if (eventTime) {
      const [hours, minutes] = eventTime.split(':');
      fullDate.setHours(Number(hours), Number(minutes), 0, 0);
    }
    const newEvent = {
      title: eventTitle,
      date: fullDate,
      type: eventType,
      description: eventDescription
    };
    try {
      const response = await api.post('/api/events', newEvent, {
        headers: { 'Content-Type': 'application/json' }
      });
      const saved = response.data;
      setEvents([...events, { ...saved, date: new Date(saved.date) }]);
      setEventTitle('');
      setEventType('event');
      setEventTime('');
      setEventDescription('');
      setShowEventModal(false);
      setEventDate(selectedDate);
    } catch {
      alert('Failed to save event');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Calendar</h1>
          <button 
            onClick={handleAddEvent}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md inline-flex items-center transition duration-200"
          >
            <CalendarIcon size={18} className="mr-1" />
            Add Event
          </button>
        </div>
        
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
      
      {/* Selected Date Events */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Events for {format(selectedDate, 'MMMM d, yyyy')}
        </h2>
        
        <div className="space-y-4">
          {events.filter(event => isSameDay(event.date, selectedDate)).map(event => (
            <div 
              key={event.id}
              className={`p-4 rounded-lg ${
                event.type === 'maintenance' ? 'bg-red-50 border-l-4 border-red-500' :
                event.type === 'meeting' ? 'bg-blue-50 border-l-4 border-blue-500' :
                event.type === 'schedule' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                'bg-green-50 border-l-4 border-green-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-gray-600">{format(event.date, 'h:mm a')}</p>
                  {event.description && (
                    <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                  )}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  event.type === 'maintenance' ? 'bg-red-100 text-red-800' :
                  event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                  event.type === 'schedule' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {event.type}
                </span>
              </div>
            </div>
          ))}
          
          {events.filter(event => isSameDay(event.date, selectedDate)).length === 0 && (
            <div className="text-center py-8">
              <CalendarIcon size={40} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No events scheduled for this day.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add Event for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <form>
              <div className="mb-4">
                <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  id="eventTitle"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="Enter event title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  id="eventType"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                >
                  <option value="event">General Event</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="meeting">Meeting</option>
                  <option value="schedule">Schedule Change</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  id="eventTime"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="eventDescription"
                  rows={3}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="Add event details"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  value={eventDate ? format(eventDate, 'yyyy-MM-dd') : ''}
                  onChange={e => setEventDate(new Date(e.target.value + 'T00:00:00'))}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEventModal(false);
                    setEventDate(selectedDate); // Reset to selectedDate or setEventDate(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEvent}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;