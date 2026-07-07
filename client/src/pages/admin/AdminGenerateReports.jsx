import { useState } from 'react';
import { reportGenAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiDownload, FiFileText, FiUsers, FiFolder, FiCheckSquare, FiCalendar, FiBarChart2 } from 'react-icons/fi';

const reportTypes = [
  { value: 'summary', label: 'System Summary', icon: FiBarChart2, desc: 'Overall counts and statistics' },
  { value: 'projects', label: 'All Projects', icon: FiFolder, desc: 'Complete project list with members' },
  { value: 'students', label: 'All Students', icon: FiUsers, desc: 'Registered student accounts' },
  { value: 'supervisors', label: 'All Supervisors', icon: FiUsers, desc: 'Registered supervisor accounts' },
  { value: 'tasks', label: 'All Tasks', icon: FiCheckSquare, desc: 'All tasks with assignments' },
  { value: 'meetings', label: 'All Meetings', icon: FiCalendar, desc: 'Scheduled meetings log' },
  { value: 'submissions', label: 'Report Submissions', icon: FiFileText, desc: 'All submitted reports' },
];

const AdminGenerateReports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [selectedType, setSelectedType] = useState('');

  const generateReport = async (type) => {
    setLoading(true);
    setSelectedType(type);
    try {
      const { data } = await reportGenAPI.generate({ type });
      setReportData(data);
      toast.success('Report generated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const downloadJSON = () => {
    if (!reportData) return;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${selectedType}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded');
  };

  return (
    <div>
      <PageHeader title="Generate Reports" subtitle="Create and download system reports" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {reportTypes.map((rt) => (
          <button key={rt.value} onClick={() => generateReport(rt.value)}
            className="card card-hover text-left flex items-start gap-4"
            disabled={loading}>
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <rt.icon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white">{rt.label}</p>
              <p className="text-xs text-gray-400 mt-1">{rt.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner text="Generating report..." />}

      {reportData && !loading && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white capitalize">{selectedType} Report</h3>
            <button onClick={downloadJSON} className="btn-secondary flex items-center gap-2">
              <FiDownload className="w-4 h-4" /> Download JSON
            </button>
          </div>
          <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-xl overflow-auto max-h-96">
            {JSON.stringify(reportData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AdminGenerateReports;
