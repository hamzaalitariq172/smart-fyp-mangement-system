import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';
import { FiSave, FiShield, FiMail, FiClock } from 'react-icons/fi';

const AdminSettings = () => {
  const [form, setForm] = useState({
    semester: 'Spring 2024',
    reportDeadline: '',
    maxTeamSize: '3',
    enableEmailNotifs: true,
    enableAutoApproval: false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      toast.success('Settings saved');
      setSaving(false);
    }, 1000);
  };

  return (
    <div>
      <PageHeader title="System Settings" subtitle="Configure system parameters and preferences" />

      <div className="max-w-2xl space-y-6">
        <form onSubmit={handleSave} className="card space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <FiClock className="w-4 h-4" /> Academic Settings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Current Semester</label>
                <input type="text" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Max Team Size</label>
                <input type="number" value={form.maxTeamSize} onChange={(e) => setForm({ ...form, maxTeamSize: e.target.value })} className="input-field" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Report Submission Deadline</label>
            <input type="date" value={form.reportDeadline} onChange={(e) => setForm({ ...form, reportDeadline: e.target.value })} className="input-field" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <FiMail className="w-4 h-4" /> Notification Settings
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                <input type="checkbox" checked={form.enableEmailNotifs} onChange={(e) => setForm({ ...form, enableEmailNotifs: e.target.checked })} className="rounded text-primary-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Enable email notifications</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                <input type="checkbox" checked={form.enableAutoApproval} onChange={(e) => setForm({ ...form, enableAutoApproval: e.target.checked })} className="rounded text-primary-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Auto-approve project proposals</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <FiShield className="w-4 h-4" /> Security
            </h3>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Security settings including password policies and session management are configured in the server environment variables.
              </p>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
