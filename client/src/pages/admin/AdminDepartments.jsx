import { useState, useEffect } from 'react';
import { departmentAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', description: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const { data } = await departmentAPI.getAll();
      setDepartments(data);
    } catch {} finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', code: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, code: item.code, description: item.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.code) return toast.error('Name and code are required');
    try {
      if (editItem) {
        await departmentAPI.update(editItem._id, form);
        toast.success('Department updated');
      } else {
        await departmentAPI.create(form);
        toast.success('Department created');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await departmentAPI.delete(id);
      toast.success('Department deleted');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const columns = [
    { header: 'Name', render: (r) => <span className="font-medium text-gray-900 dark:text-white">{r.name}</span> },
    { header: 'Code', render: (r) => <span className="text-sm text-gray-500">{r.code}</span> },
    { header: 'Description', render: (r) => <span className="text-sm text-gray-400">{r.description || '—'}</span> },
    { header: 'Active', render: (r) => <span className={`badge ${r.isActive ? 'badge-success' : 'badge-danger'}`}>{r.isActive ? 'Yes' : 'No'}</span> },
    { header: 'Created', render: (r) => <span className="text-sm text-gray-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</span> },
    {
      header: 'Actions', render: (r) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(r)} className="btn-secondary py-1 px-2"><FiEdit2 className="w-4 h-4" /></button>
          <button onClick={() => handleDelete(r._id)} className="btn-danger py-1 px-2"><FiTrash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle="Manage academic departments"
        actions={<button onClick={openCreate} className="btn-primary flex items-center gap-2"><FiPlus className="w-4 h-4" /> Add Department</button>}
      />
      <DataTable columns={columns} data={departments} loading={loading} searchable />

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Department' : 'Add Department'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Department Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Code *</label>
            <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field" required placeholder="e.g. CS, EE, ME" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} />
          </div>
          <button type="submit" className="btn-primary w-full">{editItem ? 'Update' : 'Create'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDepartments;
