import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiBell, FiCheck, FiCheckCircle, FiInfo, FiAlertTriangle, FiXCircle, FiArrowRight } from 'react-icons/fi';
import { formatDateTime } from '../../utils/helpers';

const typeConfig = {
  info: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: FiInfo, color: 'text-blue-600' },
  success: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: FiCheckCircle, color: 'text-emerald-600' },
  warning: { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: FiAlertTriangle, color: 'text-amber-600' },
  error: { bg: 'bg-rose-50 dark:bg-rose-900/20', icon: FiXCircle, color: 'text-rose-600' },
};

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      const { data } = await notificationAPI.getAll();
      setNotifications(data);
    } catch {} finally { setLoading(false); }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch {}
  };

  const unread = notifications.filter((n) => !n.isRead).length;

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread notification${unread !== 1 ? 's' : ''}`}
        actions={unread > 0 && (
          <button onClick={markAllAsRead} className="btn-secondary flex items-center gap-2 text-sm">
            <FiCheck className="w-4 h-4" /> Mark All Read
          </button>
        )}
      />

      {notifications.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <FiBell className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const cfg = typeConfig[n.type] || typeConfig.info;
            const Icon = cfg.icon;
            return (
              <div key={n._id}
                className={`card flex items-start gap-4 ${!n.isRead ? 'ring-1 ring-primary-500/20 bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{n.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">{formatDateTime(n.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    {!n.isRead && (
                      <button onClick={() => markAsRead(n._id)}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                        <FiCheck className="w-3 h-3" /> Mark read
                      </button>
                    )}
                    {n.link && (
                      <Link to={n.link}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
                        View details <FiArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
