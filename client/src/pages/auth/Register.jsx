import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FiUser, FiMail, FiLock, FiBook, FiBriefcase,
  FiEye, FiEyeOff, FiUserCheck,
} from 'react-icons/fi';

const Register = () => {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    regNo: '', department: '', designation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return toast.error('Please fill all required fields');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (role === 'student' && !form.regNo) {
      return toast.error('Registration number is required');
    }

    setLoading(true);
    try {
      const user = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        department: form.department,
        regNo: role === 'student' ? form.regNo : undefined,
        designation: role === 'supervisor' ? form.designation : undefined,
      });
      toast.success('Registration successful! Welcome aboard.');
      const redirect = user.role === 'supervisor' ? '/supervisor/dashboard' : '/student/dashboard';
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Join the Smart FYP Management System</p>
      </div>

      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6">
        <button
          type="button"
          onClick={() => setRole('student')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            role === 'student'
              ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <FiUserCheck className="inline w-4 h-4 mr-1.5" />
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole('supervisor')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            role === 'supervisor'
              ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <FiBriefcase className="inline w-4 h-4 mr-1.5" />
          Supervisor
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                className="input-field pl-10"
                placeholder={role === 'student' ? 'John Doe' : 'Dr. John Doe'}
              />
            </div>
          </div>

          {role === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Registration No. <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={form.regNo}
                  onChange={handleChange('regNo')}
                  className="input-field pl-10"
                  placeholder="CS-2024-001"
                />
              </div>
            </div>
          )}

          {role === 'supervisor' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Designation</label>
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={form.designation}
                  onChange={handleChange('designation')}
                  className="input-field pl-10 appearance-none"
                >
                  <option value="">Select designation</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Professor">Professor</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Department</label>
            <select value={form.department} onChange={handleChange('department')} className="select-field">
              <option value="">Select department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Business Administration">Business Administration</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              className="input-field pl-10"
              placeholder="you@university.edu"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                className="input-field pl-10 pr-10"
                placeholder="Min 6 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                className="input-field pl-10"
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
