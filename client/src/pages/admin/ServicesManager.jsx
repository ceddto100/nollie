import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import Button from '../../components/Button';
import { apiRequest } from '../../hooks/useApi';
import { getApiUrl } from '../../utils/api';

const emptyService = { title: '', description: '', price: '', features: '', ctaText: '', ctaLink: '', order: 0 };

const ServicesManager = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyService);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('admin_token');

  const fetchServices = useCallback(async () => {
    if (!token) { navigate('/admin/login'); return; }
    try {
      const res = await fetch(getApiUrl('/services'));
      const json = await res.json();
      setServices(json.data || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [token, navigate]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'order' ? parseInt(value) || 0 : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        features: typeof form.features === 'string' ? form.features.split('\n').map(f => f.trim()).filter(Boolean) : form.features,
      };
      if (editing === 'new') {
        await apiRequest('/services', 'POST', payload);
      } else {
        await apiRequest(`/services/${editing}`, 'PUT', payload);
      }
      setEditing(null);
      setForm(emptyService);
      await fetchServices();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = (service) => {
    setEditing(service._id);
    setForm({
      title: service.title,
      description: service.description,
      price: service.price || '',
      features: (service.features || []).join('\n'),
      ctaText: service.ctaText || '',
      ctaLink: service.ctaLink || '',
      order: service.order || 0,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await apiRequest(`/services/${id}`, 'DELETE');
      await fetchServices();
    } catch (err) { setError(err.message); }
  };

  if (editing !== null) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 py-section-sm md:py-section">
          <button onClick={() => { setEditing(null); setForm(emptyService); setError(''); }} className="text-cyan-400 hover:underline text-sm mb-6 inline-block">&larr; Back to Services</button>
          <h1 className="text-2xl font-bold text-white mb-6">{editing === 'new' ? 'Create Service' : 'Edit Service'}</h1>
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                <input name="price" value={form.price} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
                <input name="order" type="number" value={form.order} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Features (one per line)</label>
              <textarea name="features" value={form.features} onChange={handleChange} rows={5} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">CTA Text</label>
                <input name="ctaText" value={form.ctaText} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">CTA Link</label>
                <input name="ctaLink" value={form.ctaLink} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
            </div>
            <Button type="submit" disabled={saving} fullWidth>{saving ? 'Saving...' : editing === 'new' ? 'Create Service' : 'Update Service'}</Button>
          </form>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 py-section-sm md:py-section">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button to="/admin/dashboard" variant="ghost" size="sm" className="mb-4">&larr; Dashboard</Button>
            <h1 className="text-2xl font-bold text-white">Services Manager</h1>
          </div>
          <Button onClick={() => { setEditing('new'); setForm(emptyService); }} size="sm">+ New Service</Button>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}
        {loading ? <p className="text-gray-400">Loading...</p> : services.length === 0 ? <p className="text-gray-500">No services yet.</p> : (
          <div className="backdrop-blur-sm bg-gray-900/80 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Title</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 hidden md:table-cell">Price</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {services.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{service.title}</td>
                    <td className="px-6 py-4 text-cyan-400 text-sm hidden md:table-cell">{service.price}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(service)} className="text-cyan-400 hover:text-cyan-300 text-sm">Edit</button>
                      <button onClick={() => handleDelete(service._id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ServicesManager;
