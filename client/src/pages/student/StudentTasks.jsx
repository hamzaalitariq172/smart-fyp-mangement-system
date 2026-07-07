import { useState, useEffect } from 'react';
import { taskAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import toast from 'react-hot-toast';
import { FiCheckCircle } from 'react-icons/fi';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';

const StudentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const { data } = await taskAPI.getAll();
      setTasks(data.tasks);
    } catch {} finally { setLoading(false); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await taskAPI.update(id, { status });
      toast.success('Task status updated');
      loadTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const columns = [
    { header: 'Task', render: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.title}</span> },
    { header: 'Project', render: (row) => row.project?.title || '-' },
    { header: 'Priority', render: (row) => <span className={`badge ${row.priority === 'high' ? 'badge-danger' : row.priority === 'medium' ? 'badge-warning' : 'badge-info'}`}>{row.priority}</span> },
    { header: 'Due Date', render: (row) => formatDate(row.dueDate) || '-' },
    { header: 'Status', render: (row) => <span className={`badge ${getStatusColor(row.status)}`}>{getStatusLabel(row.status)}</span> },
    {
      header: 'Action',
      render: (row) =>
        row.status !== 'completed' ? (
          <button
            onClick={() => handleUpdateStatus(row._id, 'completed')}
            className="btn-primary py-1 px-3 text-xs flex items-center gap-1"
          >
            <FiCheckCircle className="w-3.5 h-3.5" /> Mark Done
          </button>
        ) : (
          <span className="text-green-600 text-sm flex items-center gap-1">
            <FiCheckCircle className="w-4 h-4" /> Completed
          </span>
        ),
    },
  ];

  return (
    <div>
      <PageHeader title="My Tasks" subtitle="Track and complete your assigned tasks" />
      <DataTable columns={columns} data={tasks} loading={loading} searchable />
    </div>
  );
};

export default StudentTasks;
