import { useState, useEffect } from 'react';
import { reportAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { FiDownload, FiEye, FiFile } from 'react-icons/fi';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(1)} ${units[i]}`;
};

const SupervisorReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [downloading, setDownloading] = useState(null);

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
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
      toast.success('Download started');
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

  const handleReview = async (id, status) => {
    if (!feedback.trim()) return toast.error('Please provide feedback');
    try {
      await reportAPI.review(id, { status, feedback });
      toast.success(`Report ${status}`);
      setFeedback('');
      setShowModal(false);
      loadReports();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const columns = [
    { header: 'Title', render: (row) => <span className="font-medium">{row.title}</span> },
    { header: 'Type', render: (row) => <span className="badge badge-purple">{row.type}</span> },
    { header: 'Project', render: (row) => row.project?.title || '-' },
    { header: 'Student', render: (row) => row.project?.teamMembers?.[0]?.name || '-' },
    { header: 'File', render: (row) => row.origFileName ? (
      <span className="text-xs text-gray-500 dark:text-gray-400 truncate block max-w-[150px]" title={row.origFileName}>
        <FiFile className="inline w-3 h-3 mr-1" />{row.origFileName}
      </span>
    ) : <span className="text-xs text-gray-400">-</span> },
    { header: 'Submitted', render: (row) => formatDate(row.submissionDate) },
    { header: 'Status', render: (row) => <span className={`badge ${getStatusColor(row.status)}`}>{getStatusLabel(row.status)}</span> },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.fileUrl && (
            <>
              <button onClick={() => handlePreview(row)} className="btn-secondary py-1 px-2 text-xs" title="Preview">
                <FiEye className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDownload(row)} disabled={downloading === row._id} className="btn-secondary py-1 px-2 text-xs" title="Download">
                <FiDownload className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {row.status === 'submitted' ? (
            <button onClick={() => { setSelected(row); setShowModal(true); }} className="btn-primary py-1 px-3 text-xs">Review</button>
          ) : (
            <span className="text-xs text-gray-400">Done</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Reports" subtitle="Review student report submissions" />
      <DataTable columns={columns} data={reports} loading={loading} searchable />

      <Modal open={showModal} onClose={() => setShowModal(false)} title={`Review: ${selected?.title}`}>
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">{selected?.project?.title}</p>
            <p className="text-xs text-gray-400">Type: {selected?.type} | Submitted: {formatDate(selected?.submissionDate)}</p>
            {selected?.origFileName && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate" title={selected.origFileName}>
                    <FiFile className="inline w-3.5 h-3.5 mr-1 flex-shrink-0" />
                    {selected.origFileName}
                  </p>
                  {selected.fileSize > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">Size: {formatFileSize(selected.fileSize)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <button onClick={() => handlePreview(selected)} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5">
                    <FiEye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button onClick={() => handleDownload(selected)} disabled={downloading === selected._id} className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5">
                    <FiDownload className="w-3.5 h-3.5" /> {downloading === selected._id ? '...' : 'Download'}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Feedback *</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="input-field"
              rows={4}
              placeholder="Provide your review comments..."
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleReview(selected._id, 'approved')} className="btn-primary flex-1">Approve</button>
            <button onClick={() => handleReview(selected._id, 'rejected')} className="btn-danger flex-1">Reject</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SupervisorReports;
