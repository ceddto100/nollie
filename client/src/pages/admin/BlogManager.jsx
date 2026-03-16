import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import Button from '../../components/Button';
import { apiRequest } from '../../hooks/useApi';
import { getApiUrl } from '../../utils/api';

const emptyPost = { title: '', slug: '', excerpt: '', body: '', tags: '', coverImage: '', published: false };

const BlogManager = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list, 'new' = create, id = edit
  const [form, setForm] = useState(emptyPost);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('admin_token');

  const fetchPosts = useCallback(async () => {
    if (!token) { navigate('/admin/login'); return; }
    try {
      const res = await fetch(getApiUrl('/posts/all'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate('/admin/login'); return; }
      const json = await res.json();
      setPosts(json.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
      };

      if (editing === 'new') {
        await apiRequest('/posts', 'POST', payload);
      } else {
        await apiRequest(`/posts/${editing}`, 'PUT', payload);
      }

      setEditing(null);
      setForm(emptyPost);
      await fetchPosts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post) => {
    setEditing(post._id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      body: post.body,
      tags: (post.tags || []).join(', '),
      coverImage: post.coverImage || '',
      published: post.published,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await apiRequest(`/posts/${id}`, 'DELETE');
      await fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePublished = async (post) => {
    try {
      await apiRequest(`/posts/${post._id}`, 'PUT', { published: !post.published });
      await fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const autoSlug = () => {
    if (form.title && (!form.slug || editing === 'new')) {
      setForm(prev => ({
        ...prev,
        slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));
    }
  };

  // Form view
  if (editing !== null) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto px-4 py-section-sm md:py-section">
          <button onClick={() => { setEditing(null); setForm(emptyPost); setError(''); }} className="text-cyan-400 hover:underline text-sm mb-6 inline-block">
            &larr; Back to Posts
          </button>
          <h1 className="text-2xl font-bold text-white mb-6">
            {editing === 'new' ? 'Create New Post' : 'Edit Post'}
          </h1>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input name="title" value={form.title} onChange={handleChange} onBlur={autoSlug} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt</label>
              <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Body (Markdown)</label>
              <textarea name="body" value={form.body} onChange={handleChange} rows={12} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image URL</label>
              <input name="coverImage" value={form.coverImage} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="published" checked={form.published} onChange={handleChange} id="published" className="w-4 h-4 rounded" />
              <label htmlFor="published" className="text-gray-300 text-sm">Published</label>
            </div>
            <Button type="submit" disabled={saving} fullWidth>
              {saving ? 'Saving...' : editing === 'new' ? 'Create Post' : 'Update Post'}
            </Button>
          </form>
        </div>
      </PageLayout>
    );
  }

  // List view
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 py-section-sm md:py-section">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button to="/admin/dashboard" variant="ghost" size="sm" className="mb-4">&larr; Dashboard</Button>
            <h1 className="text-2xl font-bold text-white">Blog Manager</h1>
          </div>
          <Button onClick={() => { setEditing('new'); setForm(emptyPost); }} size="sm">+ New Post</Button>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No posts yet. Create your first one!</p>
        ) : (
          <div className="backdrop-blur-sm bg-gray-900/80 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Title</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 hidden md:table-cell">Date</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{post.title}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublished(post)}
                        className={`text-xs px-3 py-1 rounded-full cursor-pointer transition-colors ${
                          post.published
                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(post)} className="text-cyan-400 hover:text-cyan-300 text-sm">Edit</button>
                      <button onClick={() => handleDelete(post._id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
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

export default BlogManager;
