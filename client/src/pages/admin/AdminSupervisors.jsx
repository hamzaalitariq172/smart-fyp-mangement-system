import { useState, useEffect } from 'react';
import { userAPI, projectAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { formatDate, getInitials } from '../../utils/helpers';

const AdminSupervisors = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Promise.all([loadSupervisors(), loadProjects()]).finally(() => setLoading(false));
  }, []);

  const loadSupervisors = async () => {
    try {
      const { data } = await userAPI.getAll({ role: 'supervisor', limit: 50 });
      setSupervisors(data.users);
    } catch {}
  };

  const loadProjects = async () => {
    try {
      const { data } = await projectAPI.getAll({ limit: 50 });
      setProjects(data.projects);
    } catch {}
  };

  const viewDetails = (sup) => {
    setSelected(sup);
    setShowModal(true);
  };

  const supProjects = (supId) => projects.filter((p) => p.supervisor?._id === supId || p.supervisor === supId);

  const columns = [
    { header: 'Name', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{getInitials(row.name)}</span>
        </div>
        <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>
      </div>
    )},
    { header: 'Email', render: (row) => row.email },
    { header: 'Department', render: (row) => row.department || '-' },
    { header: 'Projects', render: (row) => supProjects(row._id).length },
    { header: 'Status', render: (row) => <span className={`badge ${row.isActive ? 'badge-success' : 'badge-danger'}`}>{row.isActive ? 'Active' : 'Inactive'}</span> },
    { header: 'Joined', render: (row) => formatDate(row.createdAt) },
    { header: 'Actions', render: (row) => (
      <button onClick={() => viewDetails(row)} className="btn-secondary py-1 px-3 text-xs">View</button>
    )},
  ];

  return (
    <div>
      <PageHeader title="Supervisors" subtitle="Manage supervisors and their assignments" />
      <DataTable columns={columns} data={supervisors} loading={loading} searchable />

      <Modal open={showModal} onClose={() => setShowModal(false)} title={selected?.name}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium">{selected.email}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm font-medium">{selected.department || '-'}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Assigned Projects ({supProjects(selected._id).length})</h4>
              <div className="space-y-2">
                {supProjects(selected._id).map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{p.title}</span>
                    <span className="text-xs text-gray-400">{p.teamMembers?.length} students</span>
                  </div>
                ))}
                {supProjects(selected._id).length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No projects assigned</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminSupervisors;
