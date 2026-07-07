import { useState, useEffect } from 'react';
import { deadlineAPI } from '../../services/api';
import { FiAlertTriangle, FiClock, FiX } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';

const DeadlineAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data } = await deadlineAPI.check();
        const items = [];
        if (data.overdue?.length) items.push(...data.overdue.map((t) => ({ ...t, alertType: 'overdue', label: `${t.title} is overdue!` })));
        if (data.dueWithin24h?.length) items.push(...data.dueWithin24h.map((t) => ({ ...t, alertType: 'dueSoon', label: `${t.title} due in <24h` })));
        if (data.overdueMilestones?.length) items.push(...data.overdueMilestones.map((m) => ({ ...m, alertType: 'overdue', label: `Milestone "${m.title}" is overdue!` })));
        if (data.milestonesDue24h?.length) items.push(...data.milestonesDue24h.map((m) => ({ ...m, alertType: 'dueSoon', label: `Milestone "${m.title}" due in <24h` })));
        setAlerts(items.slice(0, 5));
      } catch {}
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 120000);
    return () => clearInterval(interval);
  }, []);

  const visible = alerts.filter((a) => !dismissed.has(a._id));
  if (visible.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm sm:max-w-sm max-[480px]:right-2 max-[480px]:left-2 max-[480px]:max-w-none">
      {visible.map((a) => (
        <div key={a._id}
          className={`flex items-start gap-3 p-3 rounded-xl shadow-lg border animate-slide-up ${
            a.alertType === 'overdue' ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800' :
            'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
          }`}>
          {a.alertType === 'overdue' ? (
            <FiAlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          ) : (
            <FiClock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold ${a.alertType === 'overdue' ? 'text-rose-800 dark:text-rose-300' : 'text-amber-800 dark:text-amber-300'}`}>
              {a.alertType === 'overdue' ? 'Overdue' : 'Due Soon'}
            </p>
            <p className={`text-sm mt-0.5 ${a.alertType === 'overdue' ? 'text-rose-700 dark:text-rose-200' : 'text-amber-700 dark:text-amber-200'}`}>{a.label}</p>
            {a.dueDate && <p className="text-[10px] mt-0.5 opacity-70">Due: {formatDate(a.dueDate)}</p>}
          </div>
          <button onClick={() => setDismissed((prev) => new Set(prev).add(a._id))}
            className="flex-shrink-0 p-1 rounded hover:bg-black/10">
            <FiX className="w-4 h-4 opacity-60" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default DeadlineAlerts;
