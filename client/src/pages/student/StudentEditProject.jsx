import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

const StudentEditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', technologies: [] });
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    projectAPI.getById(id)
      .then(({ data }) => setForm({ title: data.title, description: data.description, technologies: data.technologies || [] }))
      .catch(() => toast.error('Failed to load project'))
      .finally(() => setLoading(false));
  }, [id]);

  const addTech = () => {
    if (techInput && !form.technologies.includes(techInput)) {
      setForm({ ...form, technologies: [...form.technologies, techInput] });
      setTechInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return toast.error('Title and description are required');
    setSaving(true);
    try {
      await projectAPI.update(id, { title: form.title, description: form.description, technologies: form.technologies });
      toast.success('Project updated');
      navigate('/student/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;

  return (
    <div>
      <PageHeader title="Edit Project" subtitle="Update your project details" />
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Project Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[120px] resize-y" rows={5} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Technologies</label>
            <div className="flex gap-2">
              <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} className="input-field flex-1"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())} />
              <button type="button" onClick={addTech} className="btn-secondary">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.technologies.map((t, i) => (
                <span key={i} className="badge badge-info flex items-center gap-1">
                  {t}
                  <button type="button" onClick={() => setForm({ ...form, technologies: form.technologies.filter((x) => x !== t) })} className="hover:text-red-500 text-xs">✕</button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-outline flex items-center gap-2"><FiArrowLeft className="w-4 h-4" /> Back</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentEditProject;
