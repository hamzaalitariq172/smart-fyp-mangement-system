import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI, taskAPI, meetingAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import ProgressBar from '../../components/ui/ProgressBar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  FiFolder, FiCheckCircle, FiClock, FiCalendar, FiArrowRight,
  FiMessageCircle, FiPlus,
} from 'react-icons/fi';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes, meetRes] = await Promise.all([
          projectAPI.getMyProjects(),
          taskAPI.getMyTasks(),
          meetingAPI.getMyMeetings(),
        ]);
        setProjects(projRes.data?.projects || []);
        setTasks(taskRes.data?.tasks || []);
        setMeetings(Array.isArray(meetRes.data) ? meetRes.data : []);
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalProjects = projects.length;
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeMeetings = Array.isArray(meetings) ? meetings : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const completedTasks = safeTasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = safeTasks.filter((t) => t.status === 'pending').length;
  const today = new Date().toDateString();
  const todayMeetings = safeMeetings.filter((m) => m.date && new Date(m.date).toDateString() === today);
  const progress = totalProjects
    ? Math.round(safeProjects.reduce((s, p) => s + (p.progress || 0), 0) / totalProjects)
    : 0;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`Welcome back! You have ${pendingTasks} pending tasks`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="My Projects" value={totalProjects} icon={FiFolder} color="primary" />
        <StatCard title="Completed Tasks" value={completedTasks} icon={FiCheckCircle} color="green" />
        <StatCard title="Pending Tasks" value={pendingTasks} icon={FiClock} color="yellow" />
        <StatCard title="Today's Meetings" value={todayMeetings.length} icon={FiCalendar} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">My Projects</h3>
            <Link to="/student/projects" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View all <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <FiFolder className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No projects yet. Create your first project!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 5).map((p) => (
                <Link key={p._id} to={`/student/projects/${p._id}`} className="block p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all border border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full ${p.status === 'approved' ? 'bg-emerald-500' : p.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.title}</p>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      p.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      p.status === 'rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>{p.status}</span>
                  </div>
                  <ProgressBar value={p.progress || 0} size="sm" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/student/new-project" className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/30 text-center hover:shadow-md transition-all group">
              <FiPlus className="w-5 h-5 text-primary-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-primary-700 dark:text-primary-400">New Project</span>
            </Link>
            <Link to="/student/tasks" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 text-center hover:shadow-md transition-all group">
              <FiCheckCircle className="w-5 h-5 text-amber-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">My Tasks</span>
            </Link>
            <Link to="/student/meetings" className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-900/30 text-center hover:shadow-md transition-all group">
              <FiCalendar className="w-5 h-5 text-violet-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-violet-700 dark:text-violet-400">Meetings</span>
            </Link>
            <Link to="/student/chat" className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-center hover:shadow-md transition-all group">
              <FiMessageCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Chat</span>
            </Link>
          </div>

          {meetings.length > 0 && (
            <>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white pt-2">Upcoming Meetings</h3>
              <div className="space-y-2">
                {meetings.slice(0, 3).map((m) => (
                  <div key={m._id} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                    <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <FiCalendar className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{m.title}</p>
                      <p className="text-[10px] text-gray-400">{m.date ? new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center">
            <p className="text-xs font-medium opacity-90">Overall Progress</p>
            <p className="text-2xl font-bold mt-1">{progress}%</p>
            <ProgressBar value={progress} size="sm" color="bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
