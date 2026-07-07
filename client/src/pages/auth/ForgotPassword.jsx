import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Enter your email');
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forgot password?</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        {sent ? 'Check your email for the reset link' : "No worries, we'll send you reset instructions"}
      </p>

      {sent ? (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            If an account exists with that email, you'll receive a password reset link shortly.
          </p>
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="you@university.edu"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      )}

      <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600">
        <FiArrowLeft className="w-4 h-4" /> Back to login
      </Link>
    </div>
  );
};

export default ForgotPassword;
