import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationsDropdown from '../notifications/NotificationsDropdown';
import { getInitials } from '../../utils/helpers';
import { FiMenu, FiMoon, FiSun, FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);

  const profilePath = user?.role === 'admin' ? '/admin/settings' : `/${user?.role}/profile`;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <h1 className="lg:hidden text-sm font-semibold text-gray-900 dark:text-white capitalize truncate max-w-[140px]">{user?.role} Dashboard</h1>

        <div className="hidden lg:flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{user?.role} Dashboard</h1>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
            {dark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>

          <NotificationsDropdown />

          <div className="relative">
            <button onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{getInitials(user?.name)}</span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name?.split(' ')[0]}</span>
            </button>

            {showProfile && (
              <>
                <div className="fixed inset-0" onClick={() => setShowProfile(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-1 animate-fade-in">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                  </div>
                  <Link to={profilePath} onClick={() => setShowProfile(false)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <FiUser className="w-4 h-4" /> Profile
                  </Link>
                  <button onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <FiLogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
