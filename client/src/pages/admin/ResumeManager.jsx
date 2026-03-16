import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import Button from '../../components/Button';
import { apiRequest } from '../../hooks/useApi';
import { getApiUrl } from '../../utils/api';

const ResumeManager = () => {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return; }
    const fetchResume = async () => {
      try {
        const res = await fetch(getApiUrl('/resume'));
        const json = await res.json();
        setResume(json.data);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchResume();
  }, [token, navigate]);

  const saveSection = async (section, value) => {
    setSaving(true);
    setError('');
    try {
      const result = await apiRequest(`/resume/${section}`, 'PUT', { value });
      setResume(result.data);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const tabs = ['summary', 'experience', 'education', 'skills', 'certifications', 'pdfUrl'];

  if (loading) return <PageLayout><div className="max-w-4xl mx-auto px-4 py-section text-center"><p className="text-gray-400">Loading...</p></div></PageLayout>;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-section-sm md:py-section">
        <Button to="/admin/dashboard" variant="ghost" size="sm" className="mb-4">&larr; Dashboard</Button>
        <h1 className="text-2xl font-bold text-white mb-6">Resume Manager</h1>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-brand-primary text-white' : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="backdrop-blur-sm bg-gray-900/80 rounded-xl border border-gray-800 p-6">
          {/* Summary */}
          {activeTab === 'summary' && (
            <SummaryEditor value={resume?.summary || ''} onSave={(v) => saveSection('summary', v)} saving={saving} />
          )}

          {/* Experience */}
          {activeTab === 'experience' && (
            <ArrayEditor items={resume?.experience || []} fields={['company', 'role', 'startDate', 'endDate']} bulletField="bullets" boolField="current" onSave={(v) => saveSection('experience', v)} saving={saving} />
          )}

          {/* Education */}
          {activeTab === 'education' && (
            <ArrayEditor items={resume?.education || []} fields={['school', 'degree', 'field', 'year']} onSave={(v) => saveSection('education', v)} saving={saving} />
          )}

          {/* Skills */}
          {activeTab === 'skills' && (
            <TagEditor tags={resume?.skills || []} onSave={(v) => saveSection('skills', v)} saving={saving} />
          )}

          {/* Certifications */}
          {activeTab === 'certifications' && (
            <ArrayEditor items={resume?.certifications || []} fields={['name', 'issuer', 'year', 'url']} onSave={(v) => saveSection('certifications', v)} saving={saving} />
          )}

          {/* PDF URL */}
          {activeTab === 'pdfUrl' && (
            <SummaryEditor value={resume?.pdfUrl || ''} onSave={(v) => saveSection('pdfUrl', v)} saving={saving} label="PDF URL" rows={1} />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

// Sub-components

const SummaryEditor = ({ value, onSave, saving, label = 'Summary', rows = 4 }) => {
  const [text, setText] = useState(value);
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={rows} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" />
      <Button onClick={() => onSave(text)} disabled={saving} size="sm">{saving ? 'Saving...' : 'Save'}</Button>
    </div>
  );
};

const TagEditor = ({ tags, onSave, saving }) => {
  const [items, setItems] = useState(tags);
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag.trim() && !items.includes(newTag.trim())) {
      setItems([...items, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag) => setItems(items.filter(t => t !== tag));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {items.map((tag) => (
          <span key={tag} className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {tag}
            <button onClick={() => removeTag(tag)} className="text-red-400 hover:text-red-300">&times;</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Add a skill..." />
        <Button onClick={addTag} size="sm" variant="ghost">Add</Button>
      </div>
      <Button onClick={() => onSave(items)} disabled={saving} size="sm">{saving ? 'Saving...' : 'Save All'}</Button>
    </div>
  );
};

const ArrayEditor = ({ items: initial, fields, bulletField, boolField, onSave, saving }) => {
  const [items, setItems] = useState(initial);

  const addItem = () => {
    const newItem = {};
    fields.forEach(f => { newItem[f] = ''; });
    if (bulletField) newItem[bulletField] = [];
    if (boolField) newItem[boolField] = false;
    setItems([...items, newItem]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addBullet = (index) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [bulletField]: [...(updated[index][bulletField] || []), ''] };
    setItems(updated);
  };

  const updateBullet = (itemIndex, bulletIndex, value) => {
    const updated = [...items];
    const bullets = [...updated[itemIndex][bulletField]];
    bullets[bulletIndex] = value;
    updated[itemIndex] = { ...updated[itemIndex], [bulletField]: bullets };
    setItems(updated);
  };

  const removeBullet = (itemIndex, bulletIndex) => {
    const updated = [...items];
    updated[itemIndex] = { ...updated[itemIndex], [bulletField]: updated[itemIndex][bulletField].filter((_, i) => i !== bulletIndex) };
    setItems(updated);
  };

  return (
    <div className="space-y-6">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-700 rounded-lg p-4 space-y-3 relative">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-sm">Remove</button>
          <div className="grid grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field}>
                <label className="block text-xs text-gray-400 mb-1">{field}</label>
                <input value={item[field] || ''} onChange={(e) => updateItem(i, field, e.target.value)} className="w-full px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
            ))}
          </div>
          {boolField && (
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={item[boolField] || false} onChange={(e) => updateItem(i, boolField, e.target.checked)} className="w-4 h-4 rounded" />
              {boolField}
            </label>
          )}
          {bulletField && (
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Bullets</label>
              {(item[bulletField] || []).map((bullet, j) => (
                <div key={j} className="flex gap-2">
                  <input value={bullet} onChange={(e) => updateBullet(i, j, e.target.value)} className="flex-1 px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                  <button onClick={() => removeBullet(i, j)} className="text-red-400 hover:text-red-300 text-sm px-2">&times;</button>
                </div>
              ))}
              <button onClick={() => addBullet(i)} className="text-cyan-400 hover:underline text-sm">+ Add Bullet</button>
            </div>
          )}
        </div>
      ))}
      <div className="flex gap-3">
        <Button onClick={addItem} size="sm" variant="ghost">+ Add Entry</Button>
        <Button onClick={() => onSave(items)} disabled={saving} size="sm">{saving ? 'Saving...' : 'Save All'}</Button>
      </div>
    </div>
  );
};

export default ResumeManager;
