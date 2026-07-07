import { useState, useEffect } from 'react';
import { projectAPI, milestoneAPI, weeklyReportAPI, taskAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import ProgressBar from '../../components/ui/ProgressBar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { FaChartLine, FaFlag, FaFileAlt, FaTasks } from 'react-icons/fa';
import { FiPlus, FiCheckCircle, FiClock, FiCalendar } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';

const StudentProgress = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [weeklyReports, setWeeklyReports] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const [mForm, setMForm] = useState({ title: '', description: '', dueDate: '', order: 0 });
  const [wForm, setWForm] = useState({ weekNumber: 1, startDate: '', endDate: '', workDone: '', workPlanned: '', challenges: '', hoursSpent: 0 });

  useEffect(() => {
    projectAPI.getMyProjects()
      .then(({ data }) => {
        const projectsData = data.projects || data || [];
        setProjects(projectsData);
        if (projectsData.length > 0) {
          setSelectedProject(projectsData[0]._id);
          loadProjectData(projectsData[0]._id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadProjectData = async (projectId) => {
    try {
      const [milRes, weekRes, taskRes] = await Promise.all([
        milestoneAPI.getAll({ project: projectId }),
        weeklyReportAPI.getAll({ project: projectId }),
        taskAPI.getAll({ project: projectId }),
      ]);
      setMilestones(milRes.data || []);
      setWeeklyReports(weekRes.data || []);
      setTasks(taskRes.data.tasks || taskRes.data || []);
    } catch {}
  };

  const handleProjectChange = (id) => {
    setSelectedProject(id);
    loadProjectData(id);
  };

  const createMilestone = async (e) => {
    e.preventDefault();
    if (!mForm.title) return toast.error('Title is required');
    try {
      await milestoneAPI.create({ ...mForm, project: selectedProject });
      toast.success('Milestone created');
      setShowMilestoneModal(false);
      setMForm({ title: '', description: '', dueDate: '', order: 0 });
      loadProjectData(selectedProject);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const createWeeklyReport = async (e) => {
    e.preventDefault();
    if (!wForm.workDone) return toast.error('Describe work done');
    try {
      await weeklyReportAPI.create({ ...wForm, project: selectedProject });
      toast.success('Weekly report submitted');
      setShowWeeklyModal(false);
      setWForm({ weekNumber: weeklyReports.length + 1, startDate: '', endDate: '', workDone: '', workPlanned: '', challenges: '', hoursSpent: 0 });
      loadProjectData(selectedProject);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const toggleMilestone = async (milestone) => {
    try {
      const status = milestone.status === 'completed' ? 'pending' : 'completed';
      await milestoneAPI.update(milestone._id, { status, completedAt: status === 'completed' ? new Date() : null });
      toast.success(status === 'completed' ? 'Milestone completed!' : 'Milestone reopened');
      loadProjectData(selectedProject);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  const safeMilestones = Array.isArray(milestones) ? milestones : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const completedMilestones = safeMilestones.filter((m) => m.status === 'completed').length;
  const totalMilestones = safeMilestones.length;
  const milestoneProgress = totalMilestones ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  const completedTasks = safeTasks.filter((t) => t.status === 'completed').length;
  const totalTasks = safeTasks.length;
  const taskProgress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const currentProject = projects.find((p) => p._id === selectedProject);

  return (
    <div>
      <PageHeader title="Progress Tracking" subtitle="Track your project milestones, weekly reports, and task progress" />

      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project:</label>
        <select value={selectedProject || ''} onChange={(e) => handleProjectChange(e.target.value)}
          className="select-field w-auto min-w-[200px]">
          {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Project Progress" value={`${currentProject?.progress || 0}%`} icon={FaChartLine} color="primary" />
        <StatCard title="Milestones" value={`${completedMilestones}/${totalMilestones}`} icon={FaFlag} color="green" />
        <StatCard title="Weekly Reports" value={weeklyReports.length} icon={FaFileAlt} color="purple" />
        <StatCard title="Tasks Done" value={`${completedTasks}/${totalTasks}`} icon={FaTasks} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold flex items-center gap-2"><FaFlag className="text-emerald-500" /> Milestones</h3>
            <button onClick={() => setShowMilestoneModal(true)} className="btn-secondary py-1 px-3 text-xs flex items-center gap-1">
              <FiPlus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="mb-3"><ProgressBar value={milestoneProgress} size="sm" /></div>
          {milestones.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No milestones yet</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {safeMilestones.slice().sort((a, b) => a.order - b.order).map((m) => (
                <div key={m._id}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${
                    m.status === 'completed' ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10' :
                    m.status === 'overdue' ? 'border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-900/10' :
                    'border-gray-100 dark:border-gray-700'
                  }`}>
                  <button onClick={() => toggleMilestone(m)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      m.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' :
                      m.status === 'overdue' ? 'border-rose-400' :
                      'border-gray-300 dark:border-gray-500 hover:border-primary-500'
                    }`}>
                    {m.status === 'completed' && <FiCheckCircle className="w-3 h-3" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${m.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{m.title}</p>
                    {m.description && <p className="text-xs text-gray-400 mt-0.5">{m.description}</p>}
                    <div className="flex items-center gap-3 mt-1">
                      {m.dueDate && <span className="text-[10px] text-gray-400 flex items-center gap-1"><FiCalendar className="w-3 h-3" /> {formatDate(m.dueDate)}</span>}
                      <span className={`badge text-[10px] ${
                        m.status === 'completed' ? 'badge-success' :
                        m.status === 'overdue' ? 'badge-danger' :
                        'badge-warning'
                      }`}>{m.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold flex items-center gap-2"><FaFileAlt className="text-purple-500" /> Weekly Reports</h3>
            <button onClick={() => setShowWeeklyModal(true)} className="btn-secondary py-1 px-3 text-xs flex items-center gap-1">
              <FiPlus className="w-3 h-3" /> New
            </button>
          </div>
          {weeklyReports.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No weekly reports yet</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {weeklyReports.slice().reverse().map((r) => (
                <div key={r._id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Week {r.weekNumber}</span>
                    <span className={`badge text-[10px] ${r.status === 'submitted' ? 'badge-info' : r.status === 'reviewed' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span>
                  </div>
                  {r.workDone && <p className="text-xs text-gray-500 mt-1"><span className="font-medium">Done:</span> {r.workDone}</p>}
                  {r.workPlanned && <p className="text-xs text-gray-500 mt-0.5"><span className="font-medium">Planned:</span> {r.workPlanned}</p>}
                  {r.challenges && <p className="text-xs text-gray-500 mt-0.5"><span className="font-medium">Challenges:</span> {r.challenges}</p>}
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                    {r.hoursSpent > 0 && <span>{r.hoursSpent}h spent</span>}
                    {r.startDate && <span>{formatDate(r.startDate)} - {formatDate(r.endDate)}</span>}
                  </div>
                  {r.feedback && <p className="text-xs text-primary-600 mt-1"><span className="font-medium">Feedback:</span> {r.feedback}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2"><FaTasks className="text-blue-500" /> Task Progress</h3>
        <ProgressBar value={taskProgress} size="lg" />
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <p className="text-2xl font-bold text-amber-600">{safeTasks.filter((t) => t.status === 'pending').length}</p>
            <p className="text-xs text-amber-600">Pending</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <p className="text-2xl font-bold text-blue-600">{safeTasks.filter((t) => t.status === 'in_progress').length}</p>
            <p className="text-xs text-blue-600">In Progress</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
            <p className="text-2xl font-bold text-emerald-600">{completedTasks}</p>
            <p className="text-xs text-emerald-600">Completed</p>
          </div>
        </div>
      </div>

      <Modal open={showMilestoneModal} onClose={() => setShowMilestoneModal(false)} title="Add Milestone">
        <form onSubmit={createMilestone} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Title *</label><input type="text" value={mForm.title} onChange={(e) => setMForm({ ...mForm, title: e.target.value })} className="input-field" required /></div>
          <div><label className="block text-sm font-medium mb-1.5">Description</label><textarea value={mForm.description} onChange={(e) => setMForm({ ...mForm, description: e.target.value })} className="input-field" rows={2} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Due Date</label><input type="date" value={mForm.dueDate} onChange={(e) => setMForm({ ...mForm, dueDate: e.target.value })} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Order</label><input type="number" value={mForm.order} onChange={(e) => setMForm({ ...mForm, order: parseInt(e.target.value) || 0 })} className="input-field" /></div>
          </div>
          <button type="submit" className="btn-primary w-full">Create Milestone</button>
        </form>
      </Modal>

      <Modal open={showWeeklyModal} onClose={() => setShowWeeklyModal(false)} title="Submit Weekly Report">
        <form onSubmit={createWeeklyReport} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Week #</label><input type="number" value={wForm.weekNumber} onChange={(e) => setWForm({ ...wForm, weekNumber: parseInt(e.target.value) || 1 })} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Start</label><input type="date" value={wForm.startDate} onChange={(e) => setWForm({ ...wForm, startDate: e.target.value })} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1.5">End</label><input type="date" value={wForm.endDate} onChange={(e) => setWForm({ ...wForm, endDate: e.target.value })} className="input-field" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1.5">Work Done *</label><textarea value={wForm.workDone} onChange={(e) => setWForm({ ...wForm, workDone: e.target.value })} className="input-field" rows={2} required /></div>
          <div><label className="block text-sm font-medium mb-1.5">Work Planned</label><textarea value={wForm.workPlanned} onChange={(e) => setWForm({ ...wForm, workPlanned: e.target.value })} className="input-field" rows={2} /></div>
          <div><label className="block text-sm font-medium mb-1.5">Challenges</label><textarea value={wForm.challenges} onChange={(e) => setWForm({ ...wForm, challenges: e.target.value })} className="input-field" rows={2} /></div>
          <div><label className="block text-sm font-medium mb-1.5">Hours Spent</label><input type="number" value={wForm.hoursSpent} onChange={(e) => setWForm({ ...wForm, hoursSpent: parseInt(e.target.value) || 0 })} className="input-field" /></div>
          <button type="submit" className="btn-primary w-full">Submit Report</button>
        </form>
      </Modal>
    </div>
  );
};

export default StudentProgress;
