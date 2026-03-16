import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { CardSkeletonGrid } from '../components/Skeleton';
import { getApiUrl } from '../utils/api';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(getApiUrl('/posts'));
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        setPosts(json.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-section-sm md:py-section">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-down">
          Blog
        </h1>
        <p className="text-gray-400 text-lg mb-12 animate-fade-in-up">
          Tutorials, guides, and thoughts on full-stack development.
        </p>

        {loading && <CardSkeletonGrid count={3} />}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400">Failed to load posts: {error}</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet. Check back soon!</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post.slug}`}
                className="clickable-card backdrop-blur-sm bg-gray-900/80 rounded-xl shadow-md overflow-hidden border border-gray-800 hover:border-cyan-500/30 transition-all"
              >
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <p className="text-xs text-cyan-400 mb-2">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                  <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Blog;
