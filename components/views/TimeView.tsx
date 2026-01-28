import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Calendar, Clock, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { UserState, ScheduleEvent } from '../../types';

const POMODORO_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60;

interface TimeViewProps {
  data: UserState;
  updateData: (newData: Partial<UserState>) => void;
}

export const TimeView: React.FC<TimeViewProps> = ({ data, updateData }) => {
  const [section, setSection] = useState<'focus' | 'schedule'>('focus');
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Schedule State
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('09:00');
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // --- Timer Logic ---
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? POMODORO_TIME : SHORT_BREAK);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? POMODORO_TIME : SHORT_BREAK);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = mode === 'focus' 
    ? ((POMODORO_TIME - timeLeft) / POMODORO_TIME) * 100 
    : ((SHORT_BREAK - timeLeft) / SHORT_BREAK) * 100;


  // --- Schedule Logic ---
  const handleAddEvent = () => {
    if (!newEventTitle.trim()) return;

    const [hours, mins] = newEventTime.split(':').map(Number);
    const start = new Date(currentDate);
    start.setHours(hours, mins, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour duration

    const newEvent: ScheduleEvent = {
      id: Date.now().toString(),
      title: newEventTitle,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      type: 'Study'
    };

    updateData({ schedule: [...data.schedule, newEvent] });
    setNewEventTitle('');
    setIsAddingEvent(false);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getEventsForDay = (date: Date) => {
    return data.schedule.filter(e => {
      const eDate = new Date(e.startTime);
      return eDate.getDate() === date.getDate() && 
             eDate.getMonth() === date.getMonth() && 
             eDate.getFullYear() === date.getFullYear();
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  // --- Renderers ---

  const renderTimer = () => (
    <div className="flex flex-col items-center justify-center py-10">
       <div className="flex bg-gray-100 p-1 rounded-full mb-12">
        <button 
          onClick={() => switchMode('focus')}
          className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'focus' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
          }`}
        >
          Focus
        </button>
        <button 
          onClick={() => switchMode('break')}
          className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'break' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
          }`}
        >
          Break
        </button>
      </div>

      <div className="relative w-72 h-72 flex items-center justify-center mb-12">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
          <circle
            cx="144" cy="144" r="130"
            stroke="currentColor" strokeWidth="8" fill="transparent"
            strokeDasharray={2 * Math.PI * 130}
            strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
            className={`transition-all duration-1000 ease-linear ${mode === 'focus' ? 'text-indigo-500' : 'text-green-500'}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-7xl font-light text-gray-800 tracking-tighter">{formatTime(timeLeft)}</span>
          <span className="text-gray-400 text-sm mt-3 font-medium tracking-wide uppercase">{isActive ? 'Running' : 'Paused'}</span>
        </div>
      </div>

      <div className="flex gap-6">
        <button 
          onClick={toggleTimer}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-transform hover:scale-105 active:scale-95 ${
            mode === 'focus' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        <button 
          onClick={resetTimer}
          className="w-20 h-20 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <RotateCcw size={28} />
        </button>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="w-full max-w-4xl mx-auto">
      {/* Schedule Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex bg-gray-100 p-1 rounded-lg self-start">
          <button onClick={() => setViewMode('day')} className={`px-4 py-1.5 text-sm rounded-md transition-all ${viewMode === 'day' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`}>Day</button>
          <button onClick={() => setViewMode('week')} className={`px-4 py-1.5 text-sm rounded-md transition-all ${viewMode === 'week' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`}>Week</button>
          <button onClick={() => setViewMode('month')} className={`px-4 py-1.5 text-sm rounded-md transition-all ${viewMode === 'month' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`}>Month</button>
        </div>
        
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <button onClick={() => navigateDate('prev')} className="text-gray-400 hover:text-indigo-600"><ChevronLeft size={20} /></button>
          <span className="font-medium text-gray-800 w-32 text-center text-sm">
            {viewMode === 'day' && currentDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            {viewMode === 'week' && `Week of ${currentDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
            {viewMode === 'month' && currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => navigateDate('next')} className="text-gray-400 hover:text-indigo-600"><ChevronRight size={20} /></button>
        </div>

        <button onClick={() => setIsAddingEvent(!isAddingEvent)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 self-start md:self-auto">
          <Plus size={16} /> Add Event
        </button>
      </div>

      {isAddingEvent && (
        <div className="mb-6 bg-indigo-50 p-4 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-2">
          <h4 className="text-sm font-semibold text-indigo-900 mb-3">Add to {currentDate.toLocaleDateString()}</h4>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Event title..." 
              value={newEventTitle}
              onChange={e => setNewEventTitle(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <input 
              type="time" 
              value={newEventTime}
              onChange={e => setNewEventTime(e.target.value)}
              className="px-3 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button onClick={handleAddEvent} className="bg-indigo-600 text-white px-4 rounded-lg text-sm font-medium">Save</button>
          </div>
        </div>
      )}

      {/* Views */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {/* Day View */}
        {viewMode === 'day' && (
          <div className="divide-y divide-gray-100">
             {getEventsForDay(currentDate).length === 0 ? (
               <div className="p-10 text-center text-gray-400">No events scheduled for this day.</div>
             ) : (
               getEventsForDay(currentDate).map(event => (
                 <div key={event.id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                   <div className="text-sm font-medium text-gray-500 w-16 pt-0.5">
                     {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                   <div className="flex-1">
                     <h4 className="text-gray-900 font-medium">{event.title}</h4>
                     <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] uppercase tracking-wide font-bold rounded">
                       {event.type}
                     </span>
                   </div>
                 </div>
               ))
             )}
          </div>
        )}

        {/* Week View (Simplified) */}
        {viewMode === 'week' && (
           <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-gray-100 h-full">
             {Array.from({ length: 7 }).map((_, i) => {
               const day = new Date(currentDate);
               const currentDay = day.getDay(); // 0 is Sunday
               const diff = day.getDate() - currentDay + (currentDay === 0 ? -6 : 1) + i; // adjust when day is sunday
               day.setDate(diff); // Now 'day' is correct for the column
               
               const isToday = day.toDateString() === new Date().toDateString();
               const events = getEventsForDay(day);

               return (
                 <div key={i} className="min-h-[100px] md:min-h-[400px] p-2">
                    <div className={`text-center mb-3 p-2 rounded-lg ${isToday ? 'bg-indigo-600 text-white' : ''}`}>
                      <div className={`text-xs uppercase font-bold ${isToday ? 'text-indigo-200' : 'text-gray-400'}`}>{day.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                      <div className={`text-lg font-bold ${isToday ? 'text-white' : 'text-gray-800'}`}>{day.getDate()}</div>
                    </div>
                    <div className="space-y-2">
                      {events.map(e => (
                        <div key={e.id} className="bg-indigo-50 border border-indigo-100 p-2 rounded-md text-xs">
                          <div className="font-medium text-indigo-900 truncate">{e.title}</div>
                          <div className="text-indigo-500">{new Date(e.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                      ))}
                    </div>
                 </div>
               );
             })}
           </div>
        )}

        {/* Month View (Simple Grid) */}
        {viewMode === 'month' && (
          <div className="p-4">
             <div className="grid grid-cols-7 mb-2 text-center">
               {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                 <div key={d} className="text-xs font-bold text-gray-400 uppercase py-2">{d}</div>
               ))}
             </div>
             <div className="grid grid-cols-7 gap-1">
               {/* Padding for start of month */}
               {Array.from({ length: (new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() + 6) % 7 }).map((_, i) => (
                 <div key={`empty-${i}`} className="aspect-square bg-gray-50/50 rounded-lg"></div>
               ))}
               
               {/* Days */}
               {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                 const dayNum = i + 1;
                 const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
                 const events = getEventsForDay(dayDate);
                 const isToday = dayDate.toDateString() === new Date().toDateString();

                 return (
                   <div 
                    key={dayNum} 
                    onClick={() => { setCurrentDate(dayDate); setViewMode('day'); }}
                    className={`aspect-square border rounded-xl p-1 md:p-2 cursor-pointer transition-colors relative hover:border-indigo-300 ${isToday ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 bg-white'}`}
                   >
                     <span className={`text-xs font-medium ${isToday ? 'text-indigo-700' : 'text-gray-700'}`}>{dayNum}</span>
                     <div className="flex gap-0.5 mt-1 flex-wrap content-start">
                        {events.slice(0, 4).map(e => (
                          <div key={e.id} className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                        ))}
                        {events.length > 4 && <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>}
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="pb-24 pt-6 px-6 max-w-7xl mx-auto min-h-screen">
       <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Time</h1>
          <p className="text-gray-500">Manage your focus and schedule</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setSection('focus')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${section === 'focus' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            <Clock size={16} /> Focus
          </button>
          <button 
             onClick={() => setSection('schedule')}
             className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${section === 'schedule' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            <Calendar size={16} /> Schedule
          </button>
        </div>
      </header>

      {section === 'focus' ? renderTimer() : renderSchedule()}
    </div>
  );
};
