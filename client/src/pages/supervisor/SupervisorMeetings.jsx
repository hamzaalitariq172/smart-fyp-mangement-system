import { useState, useEffect } from 'react';
import { meetingAPI, projectAPI, userAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';

const SupervisorMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', duration: '30', notes: '', link: '', project: '', attendees: [] });

  useEffect(() => {
    Promise.all([loadMeetings(), loadProjects()]).finally(() => setLoading(false));
  }, []);

  const loadMeetings = async () => {
    try {
      const { data } = await meetingAPI.getAll();
      setMeetings(data);
    } catch {}
  };

  const loadProjects = async () => {
    try {
      const { data } = await projectAPI.getAll();
      setProjects(data.projects);
    } catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.project) {
      return toast.error('Fill required fields');
    }
    try {
      const project = projects.find((p) => p._id === form.project);
      const attendees = project?.teamMembers?.map((m) => m._id) || [];
      await meetingAPI.create({ ...form, attendees });
      toast.success('Meeting scheduled');
      setShowModal(false);
      setForm({ title: '', date: '', duration: '30', notes: '', link: '', project: '', attendees: [] });
      loadMeetings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <PageHeader
        title="Meetings"
        subtitle="Schedule and manage meetings with students"
        actions={
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> Schedule Meeting
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : meetings.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">No meetings scheduled</div>
      ) : (
        <div className="grid gap-4">
          {meetings.map((m) => (
            <div key={m._id} className="card card-hover flex flex-col sm:flex-row items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{m.date ? new Date(m.date).getDate() : '-'}</span>
                <span className="text-[10px] text-primary-500 font-medium">{m.date ? new Date(m.date).toLocaleString('default', { month: 'short' }) : ''}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white">{m.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{m.project?.title} | {(m.attendees?.filter(Boolean).map((a) => a.name) || []).join(', ')}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><FiCalendar /> {formatDate(m.date)}</span>
                  <span className="flex items-center gap-1"><FiClock /> {m.duration} min</span>
                  {m.link && <span className="flex items-center gap-1"><FiMapPin /> Online</span>}
                </div>
                {m.notes && <p className="text-sm text-gray-500 mt-2">{m.notes}</p>}
              </div>
              <span className={`badge ${getStatusColor(m.status)}`}>{getStatusLabel(m.status)}</span>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Schedule Meeting">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Project *</label>
            <select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="select-field" required>
              <option value="">Select project</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Date & Time *</label>
              <input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Duration (min)</label>
              <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Meeting Link</label>
            <input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="input-field" placeholder="https://meet.google.com/..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" rows={3} />
          </div>
          <button type="submit" className="btn-primary w-full">Schedule</button>
        </form>
      </Modal>
    </div>
  );
};

export default SupervisorMeetings;
