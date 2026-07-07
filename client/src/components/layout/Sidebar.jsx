import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import {
  FiGrid, FiUsers, FiFolder, FiCheckSquare, FiCalendar,
  FiBell, FiFileText, FiMessageSquare, FiSettings,
  FiLogOut, FiBookOpen, FiUserPlus, FiBarChart2,
  FiSend, FiX, FiLayers, FiDownload,
} from 'react-icons/fi';

const studentLinks = [
  { to: '/student/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/student/projects', icon: FiFolder, label: 'My Projects' },
  { to: '/student/new-project', icon: FiSend, label: 'New Proposal' },
  { to: '/student/progress', icon: FiBarChart2, label: 'Progress' },
  { to: '/student/tasks', icon: FiCheckSquare, label: 'My Tasks' },
  { to: '/student/meetings', icon: FiCalendar, label: 'Meetings' },
  { to: '/student/reports', icon: FiFileText, label: 'Reports' },
  { to: '/student/chat', icon: FiMessageSquare, label: 'Chat' },
  { to: '/notifications', icon: FiBell, label: 'Notifications' },
  { to: '/student/profile', icon: FiSettings, label: 'Profile' },
];

const supervisorLinks = [
  { to: '/supervisor/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/supervisor/projects', icon: FiFolder, label: 'Projects' },
  { to: '/supervisor/students', icon: FiUsers, label: 'Students' },
  { to: '/supervisor/tasks', icon: FiCheckSquare, label: 'Tasks' },
  { to: '/supervisor/meetings', icon: FiCalendar, label: 'Meetings' },
  { to: '/supervisor/reports', icon: FiFileText, label: 'Reports' },
  { to: '/supervisor/calendar', icon: FiCalendar, label: 'Calendar' },
  { to: '/supervisor/chat', icon: FiMessageSquare, label: 'Chat' },
  { to: '/notifications', icon: FiBell, label: 'Notifications' },
  { to: '/supervisor/profile', icon: FiSettings, label: 'Profile' },
];

const adminLinks = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/projects', icon: FiFolder, label: 'Projects' },
  { to: '/admin/supervisors', icon: FiUserPlus, label: 'Supervisors' },
  { to: '/admin/departments', icon: FiLayers, label: 'Departments' },
  { to: '/admin/announcements', icon: FiBell, label: 'Announcements' },
  { to: '/admin/reports', icon: FiFileText, label: 'Reports' },
  { to: '/admin/messages', icon: FiMessageSquare, label: 'Messages' },
  { to: '/admin/generate-reports', icon: FiDownload, label: 'Generate Reports' },
  { to: '/notifications', icon: FiBell, label: 'Notifications' },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
];

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();

  const links = user?.role === 'admin'
    ? adminLinks
    : user?.role === 'supervisor'
    ? supervisorLinks
    : studentLinks;

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <FiBookOpen className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">Smart FYP</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                {getInitials(user?.name)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
              }
            >
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="sidebar-link sidebar-link-inactive w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
