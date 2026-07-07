import { useState, useEffect } from 'react';
import { projectAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ProgressBar from '../../components/ui/ProgressBar';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiMessageSquare, FiEye } from 'react-icons/fi';
import { formatDate, getStatusColor, getStatusLabel, truncateText } from '../../utils/helpers';

const SupervisorProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const { data } = await projectAPI.getAll();
      setProjects(data.projects || []);
    } catch {} finally { setLoading(false); }
  };

  const handleApprove = async (id, status) => {
    try {
      await projectAPI.approve(id, { status });
      toast.success(`Project ${status}`);
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleAddFeedback = async () => {
    if (!feedback.trim()) return toast.error('Enter feedback');
    try {
      await projectAPI.addFeedback(selected._id, { comment: feedback });
      toast.success('Feedback added');
      setFeedback('');
      const { data } = await projectAPI.getById(selected._id);
      setSelected(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleView = async (id) => {
    try {
      const { data } = await projectAPI.getById(id);
      setSelected(data);
      setShowModal(true);
    } catch {}
  };

  const columns = [
    { header: 'Title', render: (row) => <span className="font-medium">{truncateText(row.title, 30)}</span> },
    { header: 'Students', render: (row) => (row.teamMembers?.filter(Boolean).map((m) => m.name) || []).join(', ') || '-' },
    { header: 'Status', render: (row) => <span className={`badge ${getStatusColor(row.status)}`}>{getStatusLabel(row.status)}</span> },
    { header: 'Progress', render: (row) => <ProgressBar value={row.progress} size="sm" /> },
    { header: 'Created', render: (row) => formatDate(row.createdAt) },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleView(row._id)} className="btn-secondary py-1 px-3 text-xs"><FiEye /></button>
          {row.status === 'pending' && (
            <>
              <button onClick={() => handleApprove(row._id, 'approved')} className="btn-primary py-1 px-3 text-xs"><FiCheckCircle /></button>
              <button onClick={() => handleApprove(row._id, 'rejected')} className="btn-danger py-1 px-3 text-xs"><FiXCircle /></button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Projects" subtitle="Manage and review student projects" />
      <DataTable columns={columns} data={projects} loading={loading} searchable />

      <Modal open={showModal} onClose={() => setShowModal(false)} title={selected?.title} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`badge ${getStatusColor(selected.status)}`}>{getStatusLabel(selected.status)}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Progress</p>
                <ProgressBar value={selected.progress} />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{selected.description}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Technologies</p>
              <div className="flex flex-wrap gap-2">
                {selected.technologies?.map((t, i) => <span key={i} className="badge badge-info">{t}</span>)}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Add Feedback</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Enter feedback..."
                />
                <button onClick={handleAddFeedback} className="btn-primary"><FiMessageSquare className="w-4 h-4" /></button>
              </div>
            </div>

            {selected.feedbacks?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Feedback History</p>
                {selected.feedbacks.map((f, i) => (
                  <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-2">
                    <p className="text-sm">{f.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">- {f.by?.name} on {formatDate(f.date)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupervisorProjects;
