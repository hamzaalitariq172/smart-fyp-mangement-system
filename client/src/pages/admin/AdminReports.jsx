import { useState, useEffect } from 'react';
import { reportAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import toast from 'react-hot-toast';
import { FiDownload, FiEye, FiRefreshCw, FiFile } from 'react-icons/fi';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const { data } = await reportAPI.getAll();
      setReports(data);
    } catch {} finally { setLoading(false); }
  };

  const handleDownload = async (report) => {
    if (!report.fileUrl) return toast.error('No file attached');
    setDownloading(report._id);
    try {
      const { data } = await reportAPI.download(report._id);
      const blobUrl = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = report.origFileName || `${report.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Download failed');
    } finally { setDownloading(null); }
  };

  const handlePreview = async (report) => {
    if (!report.fileUrl) return toast.error('No file attached');
    try {
      const { data } = await reportAPI.download(report._id);
      const blobUrl = URL.createObjectURL(data);
      window.open(blobUrl, '_blank');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Preview failed');
    }
  };

  const columns = [
    { header: 'Title', render: (r) => <span className="font-medium text-gray-900 dark:text-white">{r.title}</span> },
    { header: 'Project', render: (r) => r.project?.title || '—' },
    { header: 'File', render: (r) => r.origFileName ? (
      <span className="text-xs text-gray-500 truncate block max-w-[160px]" title={r.origFileName}>
        <FiFile className="inline w-3 h-3 mr-1" />{r.origFileName}
      </span>
    ) : <span className="text-gray-400 text-xs">—</span> },
    { header: 'Type', render: (r) => <span className="badge badge-purple">{r.type}</span> },
    { header: 'Submitted', render: (r) => <span className="text-sm text-gray-400">{formatDate(r.submissionDate)}</span> },
    { header: 'Status', render: (r) => <span className={`badge ${getStatusColor(r.status)}`}>{getStatusLabel(r.status)}</span> },
    {
      header: 'Actions',
      render: (r) => r.fileUrl ? (
        <div className="flex items-center gap-2">
          <button onClick={() => handlePreview(r)} className="btn-secondary py-1 px-2 text-xs" title="Preview">
            <FiEye className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleDownload(r)} disabled={downloading === r._id} className="btn-secondary py-1 px-2 text-xs" title="Download">
            <FiDownload className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : <span className="text-gray-400 text-xs">No file</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="All Reports"
        subtitle="View and manage all submitted reports"
        actions={
          <button onClick={loadReports} className="btn-secondary flex items-center gap-2">
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        }
      />
      <DataTable columns={columns} data={reports} loading={loading} searchable />
    </div>
  );
};

export default AdminReports;
