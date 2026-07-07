import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, projectAPI, announcementAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  FiUsers, FiUserCheck, FiFolder, FiBell, FiShield, FiBarChart2,
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalSupervisors: 0, totalStudents: 0, totalProjects: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, projRes] = await Promise.all([
          userAPI.getAll(),
          projectAPI.getAll(),
        ]);
        const users = Array.isArray(usersRes.data?.users) ? usersRes.data.users : (Array.isArray(usersRes.data) ? usersRes.data : []);
        const projects = Array.isArray(projRes.data?.projects) ? projRes.data.projects : (Array.isArray(projRes.data) ? projRes.data : []);

        setStats({
          totalUsers: users.length,
          totalSupervisors: users.filter((u) => u.role === 'supervisor').length,
          totalStudents: users.filter((u) => u.role === 'student').length,
          totalProjects: projects.length,
        });

        setRecentUsers(users.slice(-5).reverse());
        setRecentProjects(projects.slice(-5).reverse());
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const userColumns = [
    { header: 'Name', render: (r) => <span className="text-sm font-medium text-gray-900 dark:text-white">{r.name}</span> },
    { header: 'Role', render: (r) => (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        r.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
        r.role === 'supervisor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      }`}>{r.role}</span>
    )},
    { header: 'Email', render: (r) => <span className="text-sm text-gray-500">{r.email}</span> },
    { header: 'Joined', render: (r) => <span className="text-sm text-gray-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</span> },
  ];

  const projectColumns = [
    { header: 'Title', render: (r) => <span className="text-sm font-medium text-gray-900 dark:text-white">{r.title}</span> },
    { header: 'Student', render: (r) => <span className="text-sm text-gray-500">{r.student?.name || '—'}</span> },
    { header: 'Supervisor', render: (r) => <span className="text-sm text-gray-500">{r.supervisor?.name || '—'}</span> },
    { header: 'Status', render: (r) => (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
        r.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
        'bg-amber-100 text-amber-700'
      }`}>{r.status}</span>
    )},
  ];

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Overview of the entire FYP management system" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={FiUsers} color="primary" />
        <StatCard title="Students" value={stats.totalStudents} icon={FiUserCheck} color="green" />
        <StatCard title="Supervisors" value={stats.totalSupervisors} icon={FiShield} color="purple" />
        <StatCard title="Projects" value={stats.totalProjects} icon={FiFolder} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <DataTable title="Recent Users" columns={userColumns} data={recentUsers} pageSize={5} />
          <DataTable title="Recent Projects" columns={projectColumns} data={recentProjects} pageSize={5} />
        </div>

        <div className="card space-y-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/users" className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/30 text-center hover:shadow-md transition-all group">
              <FiUsers className="w-5 h-5 text-primary-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-primary-700 dark:text-primary-400">Manage Users</span>
            </Link>
            <Link to="/admin/projects" className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 text-center hover:shadow-md transition-all group">
              <FiFolder className="w-5 h-5 text-blue-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Projects</span>
            </Link>
            <Link to="/admin/supervisors" className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 text-center hover:shadow-md transition-all group">
              <FiShield className="w-5 h-5 text-purple-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Supervisors</span>
            </Link>
            <Link to="/admin/announcements" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 text-center hover:shadow-md transition-all group">
              <FiBell className="w-5 h-5 text-amber-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Announce</span>
            </Link>
          </div>

          <div className="pt-2">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white">
              <div className="flex items-center justify-between mb-2">
                <FiBarChart2 className="w-6 h-6 opacity-80" />
              </div>
              <p className="text-lg font-bold">{stats.totalUsers}</p>
              <p className="text-xs opacity-80">Total system users</p>
              <div className="flex gap-4 mt-3 text-xs">
                <span>{stats.totalStudents} students</span>
                <span>{stats.totalSupervisors} supervisors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
