import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../../services/api';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';
import { FiSend, FiX } from 'react-icons/fi';

const NewProject = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', tech: '' });
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(false);

  const addTech = () => {
    if (form.tech && !technologies.includes(form.tech)) {
      setTechnologies([...technologies, form.tech]);
      setForm({ ...form, tech: '' });
    }
  };

  const removeTech = (t) => setTechnologies(technologies.filter((x) => x !== t));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      return toast.error('Title and description are required');
    }
    setLoading(true);
    try {
      await projectAPI.create({ title: form.title, description: form.description, technologies });
      toast.success('Project proposal submitted!');
      navigate('/student/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="New Project Proposal" subtitle="Submit your FYP idea for approval" />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Project Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field"
              placeholder="Enter your FYP project title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field min-h-[120px] resize-y"
              placeholder="Describe your project idea, objectives, and scope"
              rows={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Technologies</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.tech}
                onChange={(e) => setForm({ ...form, tech: e.target.value })}
                className="input-field flex-1"
                placeholder="e.g. React, Python, MongoDB"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              />
              <button type="button" onClick={addTech} className="btn-secondary">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {technologies.map((t, i) => (
                <span key={i} className="badge badge-info flex items-center gap-1">
                  {t}
                  <button type="button" onClick={() => removeTech(t)} className="hover:text-red-500">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <FiSend className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject;
