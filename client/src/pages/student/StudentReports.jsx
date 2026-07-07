import { useState, useEffect } from 'react';
import { reportAPI, projectAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import DataTable from '../../components/ui/DataTable';
import toast from 'react-hot-toast';
import { FiUpload } from 'react-icons/fi';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';

const StudentReports = () => {
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ project: '', title: '', type: 'progress' });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([loadReports(), loadProjects()]).finally(() => setLoading(false));
  }, []);

  const loadReports = async () => {
    try {
      const { data } = await reportAPI.getAll();
      setReports(data);
    } catch {}
  };

  const loadProjects = async () => {
    try {
      const { data } = await projectAPI.getAll();
      setProjects(data.projects);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.project || !form.title || !file) {
      return toast.error('Fill all fields and select a file');
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('project', form.project);
      fd.append('title', form.title);
      fd.append('type', form.type);
      fd.append('file', file);
      await reportAPI.submit(fd);
      toast.success('Report submitted');
      setShowModal(false);
      setForm({ project: '', title: '', type: 'progress' });
      setFile(null);
      loadReports();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { header: 'Title', render: (row) => <span className="font-medium">{row.title}</span> },
    { header: 'Type', render: (row) => <span className="badge badge-purple">{row.type}</span> },
    { header: 'Project', render: (row) => row.project?.title || '-' },
    { header: 'Submitted', render: (row) => formatDate(row.submissionDate) },
    { header: 'Status', render: (row) => <span className={`badge ${getStatusColor(row.status)}`}>{getStatusLabel(row.status)}</span> },
    { header: 'Feedback', render: (row) => row.feedback || <span className="text-gray-400">-</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Submit and track your project reports"
        actions={
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <FiUpload className="w-4 h-4" /> Submit Report
          </button>
        }
      />
      <DataTable columns={columns} data={reports} loading={loading} searchable />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Submit Report">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Project</label>
            <select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="select-field" required>
              <option value="">Select project</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="select-field">
              <option value="progress">Progress</option>
              <option value="final">Final</option>
              <option value="evaluation">Evaluation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">File</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="input-field" required />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default StudentReports;
