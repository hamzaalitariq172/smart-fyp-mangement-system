import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDate, getStatusColor, getStatusLabel, getInitials } from '../../utils/helpers';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', department: '', regNo: '', phone: '' });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const { data } = await userAPI.getAll({ limit: 50 });
      setUsers(data.users);
    } catch {} finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', password: '', role: 'student', department: '', regNo: '', phone: '' });
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role, department: user.department || '', regNo: user.regNo || '', phone: user.phone || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const updateData = { ...form };
        if (!updateData.password) delete updateData.password;
        await userAPI.update(editing._id, updateData);
        toast.success('User updated');
      } else {
        await userAPI.create(form);
        toast.success('User created');
      }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await userAPI.delete(id);
      toast.success('User deleted');
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

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
    { header: 'Role', render: (row) => <span className="badge badge-purple capitalize">{row.role}</span> },
    { header: 'Department', render: (row) => row.department || '-' },
    { header: 'Status', render: (row) => <span className={`badge ${row.isActive ? 'badge-success' : 'badge-danger'}`}>{row.isActive ? 'Active' : 'Inactive'}</span> },
    { header: 'Joined', render: (row) => formatDate(row.createdAt) },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="btn-secondary py-1 px-3 text-xs"><FiEdit2 /></button>
          <button onClick={() => handleDelete(row._id)} className="btn-danger py-1 px-3 text-xs"><FiTrash2 /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Manage all system users"
        actions={
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> Add User
          </button>
        }
      />
      <DataTable columns={columns} data={users} loading={loading} searchable />

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit User' : 'Create User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Reg No.</label>
              <input type="text" value={form.regNo} onChange={(e) => setForm({ ...form, regNo: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Password {editing && '(leave blank to keep)'}</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" required={!editing} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="select-field">
                <option value="student">Student</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Department</label>
              <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Phone</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
          </div>
          <button type="submit" className="btn-primary w-full">{editing ? 'Update User' : 'Create User'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
