import { useState, useEffect } from 'react';
import { meetingAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';

const StudentMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    meetingAPI.getAll()
      .then(({ data }) => setMeetings(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Meetings" subtitle="View your scheduled meetings" />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : meetings.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">No meetings scheduled</div>
      ) : (
        <div className="grid gap-4">
          {meetings.map((m) => (
            <div key={m._id} className="card card-hover flex flex-col sm:flex-row items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {m.date ? new Date(m.date).getDate() : '-'}
                </span>
                <span className="text-[10px] text-primary-500 font-medium">
                  {m.date ? new Date(m.date).toLocaleString('default', { month: 'short' }) : ''}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white">{m.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{m.project?.title}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><FiCalendar className="w-3.5 h-3.5" /> {formatDate(m.date)}</span>
                  <span className="flex items-center gap-1"><FiClock className="w-3.5 h-3.5" /> {m.duration} min</span>
                  {m.link && <span className="flex items-center gap-1"><FiMapPin className="w-3.5 h-3.5" /> Online</span>}
                </div>
                {m.notes && <p className="text-sm text-gray-500 mt-2">{m.notes}</p>}
              </div>
              <span className={`badge ${getStatusColor(m.status)}`}>{getStatusLabel(m.status)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMeetings;
