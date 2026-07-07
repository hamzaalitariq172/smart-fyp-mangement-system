const colorMap = {
  red: 'bg-rose-500',
  yellow: 'bg-amber-500',
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  primary: 'bg-primary-500',
};

const getColor = (v) => {
  if (v < 25) return colorMap.red;
  if (v < 50) return colorMap.yellow;
  if (v < 75) return colorMap.blue;
  return colorMap.green;
};

const ProgressBar = ({ value = 0, size = 'md', showLabel = true, color }) => {
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };
  const pct = Math.min(Math.max(value, 0), 100);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`${color || getColor(pct)} ${heights[size] || heights.md} rounded-full transition-all duration-700 ease-out relative`}
          style={{ width: `${pct}%` }}
        >
          {size === 'lg' && pct > 30 && (
            <span className="absolute inset-0 flex items-center justify-end pr-2 text-[10px] font-bold text-white">
              {pct}%
            </span>
          )}
        </div>
      </div>
      {showLabel && size !== 'lg' && (
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 min-w-[2.5rem] text-right tabular-nums">
          {pct}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
