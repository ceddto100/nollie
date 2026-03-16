import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import { CardSkeletonGrid } from '../components/Skeleton';
import Button from '../components/Button';
import { getApiUrl } from '../utils/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(getApiUrl('/projects'));
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        setProjects(json.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const statuses = ['all', ...new Set(projects.map((p) => p.status))];
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.status === filter);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-section-sm md:py-section">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-down">
          Projects
        </h1>
        <p className="text-gray-400 text-lg mb-8 animate-fade-in-up">
          A collection of things I&apos;ve built.
        </p>

        {/* Filter tabs */}
        {!loading && projects.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === status
                    ? 'bg-brand-primary text-white shadow-glow'
                    : 'bg-gray-800/60 text-gray-300 hover:text-white hover:bg-gray-700/80'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        )}

        {loading && <CardSkeletonGrid count={3} />}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400">Failed to load projects: {error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project) => (
              <div
                key={project._id}
                className="clickable-card backdrop-blur-sm bg-gray-900/80 rounded-xl shadow-md overflow-hidden border border-gray-800 hover:border-cyan-500/30 transition-all flex flex-col"
              >
                {project.coverImage && (
                  <img
                    src={project.coverImage}
                    alt={project.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-white">{project.name}</h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'active' ? 'bg-green-500/10 text-green-400' :
                      project.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 flex-1">{project.description}</p>

                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 mt-auto">
                    {project.liveUrl && (
                      <Button href={project.liveUrl} size="sm" variant="primary">Live</Button>
                    )}
                    {project.repoUrl && (
                      <Button href={project.repoUrl} size="sm" variant="ghost">Code</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Projects;
