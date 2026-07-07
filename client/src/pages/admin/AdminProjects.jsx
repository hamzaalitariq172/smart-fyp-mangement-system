import { useState, useEffect } from 'react';
import { projectAPI, userAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ProgressBar from '../../components/ui/ProgressBar';
import toast from 'react-hot-toast';
import { FiEye, FiUserCheck, FiTrash2, FiSearch } from 'react-icons/fi';
import { formatDate, getStatusColor, getStatusLabel, truncateText, getInitials } from '../../utils/helpers';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningProjectId, setAssigningProjectId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([loadProjects(), loadSupervisors()]).finally(() => setLoading(false));
  }, []);

  const loadProjects = async () => {
    try {
      const { data } = await projectAPI.getAll({ limit: 50 });
      setProjects(data.projects || []);
    } catch {}
  };

  const loadSupervisors = async () => {
    try {
      const { data } = await userAPI.getSupervisors();
      setSupervisors(data);
    } catch {}
  };

  const handleView = async (id) => {
    try {
      const { data } = await projectAPI.getById(id);
      setSelected(data);
      setShowModal(true);
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all associated tasks?')) return;
    try {
      await projectAPI.delete(id);
      toast.success('Project deleted');
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const openAssignModal = (projectId) => {
    setAssigningProjectId(projectId);
    setSearch('');
    setShowAssignModal(true);
  };

  const handleAssignSupervisor = async (supervisorId) => {
    if (!assigningProjectId) return;
    try {
      await projectAPI.assignSupervisor(assigningProjectId, { supervisorId });
      toast.success('Supervisor assigned to project');
      setShowAssignModal(false);
      setAssigningProjectId(null);
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign supervisor');
    }
  };

  const filteredSupervisors = supervisors.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: 'Title', render: (row) => <span className="font-medium text-gray-900 dark:text-white">{truncateText(row.title, 30)}</span> },
    { header: 'Students', render: (row) => (row.teamMembers?.filter(Boolean).map((m) => m.name) || []).join(', ') || '-' },
    { header: 'Supervisor', render: (row) => row.supervisor?.name || <span className="text-gray-400">Unassigned</span> },
    { header: 'Status', render: (row) => <span className={`badge ${getStatusColor(row.status)}`}>{getStatusLabel(row.status)}</span> },
    { header: 'Progress', render: (row) => <ProgressBar value={row.progress} size="sm" /> },
    { header: 'Created', render: (row) => formatDate(row.createdAt) },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleView(row._id)} className="btn-secondary py-1 px-3 text-xs"><FiEye /></button>
          {!row.supervisor && (
            <button onClick={() => openAssignModal(row._id)} className="btn-primary py-1 px-3 text-xs flex items-center gap-1">
              <FiUserCheck className="w-3.5 h-3.5" /> Assign
            </button>
          )}
          <button onClick={() => handleDelete(row._id)} className="btn-danger py-1 px-3 text-xs"><FiTrash2 /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="All Projects" subtitle="Manage all FYP projects" />
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
              <div>
                <p className="text-xs text-gray-500">Supervisor</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{selected.supervisor?.name || 'Not assigned'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Team</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{(selected.teamMembers?.filter(Boolean).map((m) => m.name) || []).join(', ')}</p>
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
          </div>
        )}
      </Modal>

      <Modal open={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign Supervisor to Project" size="md">
        <div className="space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm"
              placeholder="Search by name, email, or department..."
            />
          </div>
          <div className="max-h-72 overflow-y-auto space-y-2">
            {filteredSupervisors.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No supervisors found</p>
            ) : (
              filteredSupervisors.map((s) => (
                <button
                  key={s._id}
                  onClick={() => handleAssignSupervisor(s._id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {getInitials(s.name)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.email} · {s.department || 'No department'}</p>
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

export default AdminProjects;
