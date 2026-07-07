import { useState, useEffect } from 'react';
import { projectAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import ProgressBar from '../../components/ui/ProgressBar';
import { formatDate, getStatusColor, getStatusLabel, getInitials } from '../../utils/helpers';

const SupervisorStudents = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectAPI.getAll()
      .then(({ data }) => setProjects(data.projects || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const students = [];
  (projects || []).forEach((p) => {
    p.teamMembers?.forEach((s) => {
      students.push({ ...s, project: p.title, projectId: p._id, progress: p.progress, status: p.status });
    });
  });

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
    { header: 'Project', render: (row) => row.project || '-' },
    { header: 'Progress', render: (row) => <ProgressBar value={row.progress} size="sm" /> },
    { header: 'Status', render: (row) => <span className={`badge ${getStatusColor(row.status)}`}>{getStatusLabel(row.status)}</span> },
    { header: 'Joined', render: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div>
      <PageHeader title="My Students" subtitle="View and monitor your assigned students" />
      <DataTable columns={columns} data={students} loading={loading} searchable />
    </div>
  );
};

export default SupervisorStudents;
