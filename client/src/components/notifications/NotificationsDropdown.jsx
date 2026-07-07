import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { notificationAPI } from '../../services/api';
import { FiBell, FiCheck, FiInfo, FiAlertTriangle, FiXCircle, FiCheckCircle } from 'react-icons/fi';
import { formatDateTime } from '../../utils/helpers';

const typeIcons = {
  info: FiInfo, success: FiCheckCircle, warning: FiAlertTriangle, error: FiXCircle,
};

const NotificationsDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const loadNotifications = async () => {
    try {
      const { data } = await notificationAPI.getAll();
      setNotifications(data.slice(0, 10));
      const { data: count } = await notificationAPI.getUnreadCount();
      setUnreadCount(count?.count || data.filter((n) => !n.isRead).length);
    } catch {}
  };

  const markAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 animate-slide-down max-h-[500px] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <Link to="/notifications" onClick={() => setOpen(false)}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
            ) : (
              notifications.map((n) => {
                const Icon = typeIcons[n.type] || FiInfo;
                return (
                  <div key={n._id}
                    className={`flex items-start gap-3 p-3.5 border-b border-gray-100 dark:border-gray-700/50 transition-colors ${
                      !n.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}>
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon className={`w-4 h-4 ${n.type === 'error' ? 'text-rose-500' : n.type === 'warning' ? 'text-amber-500' : n.type === 'success' ? 'text-emerald-500' : 'text-blue-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{formatDateTime(n.createdAt)}</p>
                    </div>
                    {!n.isRead && (
                      <button onClick={(e) => markAsRead(n._id, e)}
                        className="flex-shrink-0 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-600">
                        <FiCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <Link to="/notifications" onClick={() => setOpen(false)}
            className="p-3 border-t border-gray-200 dark:border-gray-700 text-center text-xs font-medium text-primary-600 hover:text-primary-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
