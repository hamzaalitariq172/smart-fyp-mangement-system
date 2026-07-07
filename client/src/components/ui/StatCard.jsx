import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const colorMap = {
  primary: 'from-primary-500 to-primary-600',
  green: 'from-emerald-500 to-emerald-600',
  yellow: 'from-amber-500 to-amber-600',
  red: 'from-rose-500 to-rose-600',
  purple: 'from-violet-500 to-violet-600',
  blue: 'from-blue-500 to-blue-600',
  indigo: 'from-indigo-500 to-indigo-600',
  cyan: 'from-cyan-500 to-cyan-600',
};

const iconBgMap = {
  primary: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
  green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  yellow: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  red: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  purple: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
};

const StatCard = ({ title, value, icon: Icon, color = 'primary', change, subtitle, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-5 bg-gradient-to-br ${colorMap[color] || colorMap.primary}`} />
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">{value ?? '—'}</p>
          {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {change >= 0 ? (
                <FiArrowUp className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <FiArrowDown className="w-3.5 h-3.5 text-rose-500" />
              )}
              <span className={`text-xs font-semibold ${change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl ${iconBgMap[color] || iconBgMap.primary} flex items-center justify-center flex-shrink-0 ml-3`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
