import { useState, useEffect } from 'react';
import { taskAPI, projectAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';

const SupervisorTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'medium', project: '' });

  useEffect(() => {
    Promise.all([loadTasks(), loadProjects()]).finally(() => setLoading(false));
  }, []);

  const loadTasks = async () => {
    try {
      const { data } = await taskAPI.getAll();
      setTasks(data.tasks);
    } catch {}
  };

  const loadProjects = async () => {
    try {
      const { data } = await projectAPI.getAll();
      setProjects(data.projects);
    } catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.assignedTo || !form.project) {
      return toast.error('Fill required fields');
    }
    try {
      await taskAPI.create(form);
      toast.success('Task created');
      setShowModal(false);
      setForm({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'medium', project: '' });
      loadTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const columns = [
    { header: 'Task', render: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.title}</span> },
    { header: 'Project', render: (row) => row.project?.title || '-' },
    { header: 'Assigned To', render: (row) => row.assignedTo?.name || '-' },
    { header: 'Priority', render: (row) => <span className={`badge ${row.priority === 'high' ? 'badge-danger' : row.priority === 'medium' ? 'badge-warning' : 'badge-info'}`}>{row.priority}</span> },
    { header: 'Due', render: (row) => formatDate(row.dueDate) || '-' },
    { header: 'Status', render: (row) => <span className={`badge ${getStatusColor(row.status)}`}>{getStatusLabel(row.status)}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Create and manage tasks for students"
        actions={
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> New Task
          </button>
        }
      />
      <DataTable columns={columns} data={tasks} loading={loading} searchable />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create Task">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Project *</label>
            <select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="select-field" required>
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Assign To *</label>
            <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="select-field" required>
              <option value="">Select student</option>
              {projects.find((p) => p._id === form.project)?.teamMembers?.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="select-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">Create Task</button>
        </form>
      </Modal>
    </div>
  );
};

export default SupervisorTasks;
