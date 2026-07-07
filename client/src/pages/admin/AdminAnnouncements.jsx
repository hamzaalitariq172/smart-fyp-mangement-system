import { useState, useEffect } from 'react';
import { announcementAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiBell } from 'react-icons/fi';
import { formatDate, getInitials } from '../../utils/helpers';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', targetRole: 'all' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const { data } = await announcementAPI.getAll();
      setAnnouncements(data);
    } catch {} finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', content: '', targetRole: 'all' });
    setShowModal(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({ title: a.title, content: a.content, targetRole: a.targetRole });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return toast.error('Fill all fields');
    try {
      if (editing) {
        await announcementAPI.update(editing._id, form);
        toast.success('Announcement updated');
      } else {
        await announcementAPI.create(form);
        toast.success('Announcement created');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await announcementAPI.delete(id);
      toast.success('Announcement deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <PageHeader
        title="Announcements"
        subtitle="Create and manage system announcements"
        actions={
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> New Announcement
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
      ) : announcements.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">No announcements</div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a._id} className="card card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <FiBell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{a.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>By {a.createdBy?.name || 'Admin'}</span>
                      <span>{formatDate(a.createdAt)}</span>
                      <span className="badge badge-info">{a.targetRole}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(a)} className="btn-secondary py-1 px-2"><FiEdit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(a._id)} className="btn-danger py-1 px-2"><FiTrash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Announcement' : 'New Announcement'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Content *</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input-field" rows={4} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Target</label>
            <select value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })} className="select-field">
              <option value="all">All Users</option>
              <option value="student">Students Only</option>
              <option value="supervisor">Supervisors Only</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">{editing ? 'Update' : 'Create'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminAnnouncements;
