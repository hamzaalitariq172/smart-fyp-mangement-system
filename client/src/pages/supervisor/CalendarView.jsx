import { useState, useEffect } from 'react';
import { calendarAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import { FiCalendar, FiCheckSquare, FiFlag, FiClock } from 'react-icons/fi';

const typeConfig = {
  meeting: { color: 'border-l-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20', icon: FiCalendar, label: 'Meeting' },
  task: { color: 'border-l-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: FiCheckSquare, label: 'Task' },
  milestone: { color: 'border-l-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: FiFlag, label: 'Milestone' },
};

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    try {
      const { data } = await calendarAPI.getEvents();
      setEvents(data);
    } catch {} finally { setLoading(false); }
  };

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (m, y) => new Date(y, m, 1).getDay();

  const eventsForDay = (d) => {
    return events.filter((e) => {
      if (!e.date) return false;
      const ed = new Date(e.date);
      return ed.getDate() === d && ed.getMonth() === month && ed.getFullYear() === year;
    });
  };

  const today = new Date();
  const days = [];
  const totalDays = getDaysInMonth(month, year);
  const firstDay = getFirstDay(month, year);

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Calendar" subtitle="View meetings, tasks, and milestones" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="btn-secondary py-1 px-3 text-sm">&larr;</button>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{months[month]} {year}</h3>
            <button onClick={nextMonth} className="btn-secondary py-1 px-3 text-sm">&rarr;</button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">{d}</div>
            ))}
            {days.map((d, i) => {
              const dayEvents = d ? eventsForDay(d) : [];
              const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSelected = d === selectedDay;
              return (
                <button key={i} onClick={() => d && setSelectedDay(d)}
                  className={`relative min-h-[60px] p-1 rounded-lg text-sm transition-all ${
                    isSelected ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500' :
                    isToday ? 'bg-primary-50 dark:bg-primary-900/20 font-bold' :
                    'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  } ${!d ? 'invisible' : ''}`}>
                  <span className={`text-xs ${isToday ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300'}`}>{d}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 justify-center mt-1">
                      {dayEvents.slice(0, 3).map((e, j) => {
                        const cfg = typeConfig[e.type] || typeConfig.task;
                        return <div key={j} className={`w-1.5 h-1.5 rounded-full ${cfg.bg.replace('bg-', 'bg-').replace('/20', '/40')}`} />;
                      })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card space-y-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {selectedDay ? `${months[month]} ${selectedDay}, ${year}` : 'Select a day'}
          </h3>
          {selectedDay ? (
            eventsForDay(selectedDay).length === 0 ? (
              <p className="text-sm text-gray-400">No events on this day</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {eventsForDay(selectedDay).map((e) => {
                  const cfg = typeConfig[e.type] || typeConfig.task;
                  const Icon = cfg.icon;
                  return (
                    <div key={e._id} className={`p-3 rounded-xl ${cfg.bg} border-l-4 ${cfg.color}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-500 uppercase">{cfg.label}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{e.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{e.project}</p>
                      {e.date && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><FiClock className="w-3 h-3" /> {new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                      <span className={`badge mt-1.5 text-[10px] ${
                        e.status === 'completed' || e.status === 'approved' ? 'badge-success' :
                        e.status === 'cancelled' || e.status === 'overdue' ? 'badge-danger' :
                        'badge-warning'
                      }`}>{e.status}</span>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <p className="text-sm text-gray-400">Click a day to view events</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
