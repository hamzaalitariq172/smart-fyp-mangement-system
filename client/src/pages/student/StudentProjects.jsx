import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI, userAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ProgressBar from '../../components/ui/ProgressBar';
import toast from 'react-hot-toast';
import { FiPlus, FiEye, FiUserCheck, FiSearch } from 'react-icons/fi';
import { formatDate, getStatusColor, getStatusLabel, truncateText, getInitials } from '../../utils/helpers';

const StudentProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSupervisorModal, setShowSupervisorModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [supervisorSearch, setSupervisorSearch] = useState('');

  useEffect(() => {
    loadProjects();
    loadSupervisors();
  }, []);

  const loadProjects = async () => {
    try {
      const { data } = await projectAPI.getAll();
      setProjects(data.projects || []);
    } catch {} finally { setLoading(false); }
  };

  const loadSupervisors = async () => {
    try {
      const { data } = await userAPI.getSupervisors();
      setSupervisors(data);
    } catch {}
  };

  const handleViewProject = async (id) => {
    try {
      const { data } = await projectAPI.getById(id);
      setSelected(data);
      setShowModal(true);
    } catch {}
  };

  const openSupervisorSelector = (projectId) => {
    setSelectedProjectId(projectId);
    setSupervisorSearch('');
    setShowSupervisorModal(true);
  };

  const handleRequestSupervisor = async (supervisorId) => {
    if (!selectedProjectId) return;
    try {
      await projectAPI.requestSupervisor(selectedProjectId, { supervisorId });
      toast.success('Supervisor request sent successfully!');
      setShowSupervisorModal(false);
      setSelectedProjectId(null);
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
  };

  const filteredSupervisors = supervisors.filter(
    (s) =>
      s.name?.toLowerCase().includes(supervisorSearch.toLowerCase()) ||
      s.email?.toLowerCase().includes(supervisorSearch.toLowerCase()) ||
      s.department?.toLowerCase().includes(supervisorSearch.toLowerCase())
  );

  const columns = [
    { header: 'Title', render: (row) => <span className="font-medium text-gray-900 dark:text-white">{truncateText(row.title, 30)}</span> },
    { header: 'Status', render: (row) => <span className={`badge ${getStatusColor(row.status)}`}>{getStatusLabel(row.status)}</span> },
    { header: 'Supervisor', render: (row) => row.supervisor?.name || <span className="text-gray-400">Not assigned</span> },
    { header: 'Progress', render: (row) => <ProgressBar value={row.progress} size="sm" /> },
    { header: 'Created', render: (row) => formatDate(row.createdAt) },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleViewProject(row._id)} className="btn-secondary py-1 px-3 text-xs">
            <FiEye className="w-3.5 h-3.5" />
          </button>
          {!row.supervisor && row.status === 'approved' && (
            <button
              onClick={() => openSupervisorSelector(row._id)}
              className="btn-primary py-1 px-3 text-xs flex items-center gap-1"
            >
              <FiUserCheck className="w-3.5 h-3.5" /> Assign
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="My Projects"
        subtitle="Manage your FYP projects"
        actions={
          <Link to="/student/new-project" className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> New Project
          </Link>
        }
      />
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
                <ProgressBar value={selected.progress} size="sm" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Supervisor</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{selected.supervisor?.name || 'Not assigned'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Team</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {(selected.teamMembers?.filter(Boolean).map((m) => m.name) || []).join(', ')}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{selected.description}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Technologies</p>
              <div className="flex flex-wrap gap-2">
                {selected.technologies?.map((t, i) => (
                  <span key={i} className="badge badge-info">{t}</span>
                ))}
              </div>
            </div>
            {selected.feedbacks?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Feedback</p>
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

      <Modal open={showSupervisorModal} onClose={() => setShowSupervisorModal(false)} title="Select Supervisor" size="md">
        <div className="space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={supervisorSearch}
              onChange={(e) => setSupervisorSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm"
              placeholder="Search supervisors by name, email, or department..."
            />
          </div>
          <div className="max-h-72 overflow-y-auto space-y-2">
            {filteredSupervisors.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No supervisors found</p>
            ) : (
              filteredSupervisors.map((s) => (
                <button
                  key={s._id}
                  onClick={() => handleRequestSupervisor(s._id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {getInitials(s.name)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.department || 'No department'} · {s.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentProjects;
