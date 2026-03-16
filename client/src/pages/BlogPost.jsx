import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import PageLayout from '../components/PageLayout';
import { Skeleton } from '../components/Skeleton';
import { getApiUrl } from '../utils/api';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(getApiUrl(`/posts/${slug}`));
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        setPost(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 py-section-sm md:py-section">
        {loading && (
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Failed to load post: {error}</p>
            <Link to="/blog" className="text-cyan-400 hover:underline">Back to Blog</Link>
          </div>
        )}

        {!loading && !error && post && (
          <article>
            <Link to="/blog" className="text-cyan-400 hover:underline text-sm mb-6 inline-block">
              &larr; Back to Blog
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-400 text-sm mb-8">
              <span>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full rounded-xl mb-8 border border-gray-800"
              />
            )}

            <div className="prose prose-invert prose-cyan max-w-none prose-headings:text-white prose-a:text-cyan-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800">
              <ReactMarkdown>{post.body}</ReactMarkdown>
            </div>
          </article>
        )}
      </div>
    </PageLayout>
  );
};

export default BlogPost;
