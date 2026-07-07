import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBookOpen } from 'react-icons/fi';

const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (user) {
    const redirect = user.role === 'admin' ? '/admin/dashboard'
      : user.role === 'supervisor' ? '/supervisor/dashboard'
      : '/student/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col justify-center items-center text-white p-12 w-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FiBookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Smart FYP</h1>
              <p className="text-primary-200">Management System</p>
            </div>
          </div>
          <div className="space-y-6 max-w-md">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Streamline Your FYP Journey</h3>
              <p className="text-primary-200 text-sm leading-relaxed">
                Manage projects, track progress, collaborate with supervisors, and submit reports all in one place.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['Project Management', 'Task Tracking', 'Document Upload', 'Real-time Chat'].map((f) => (
                <div key={f} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center text-sm text-primary-100">
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <FiBookOpen className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Smart FYP</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
