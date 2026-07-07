const Spinner = ({ size = 'md', text }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

  const spinner = (
    <div className={`animate-spin rounded-full border-2 border-gray-200 dark:border-gray-600 border-t-primary-600 ${sizes[size] || sizes.md}`} />
  );

  if (text) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        {spinner}
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">{text}</p>
      </div>
    );
  }

  return spinner;
};

const LoadingSpinner = ({ fullScreen, text }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" text={text || 'Loading...'} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Spinner size="lg" text={text} />
    </div>
  );
};

export default LoadingSpinner;
