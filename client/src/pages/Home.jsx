import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import { Skeleton, CardSkeleton } from '../components/Skeleton';
import { getApiUrl } from '../utils/api';

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [resume, setResume] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress((scrollTop / docHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const fetchData = async () => {
      try {
        const [postsRes, projectsRes, resumeRes, servicesRes] = await Promise.all([
          fetch(getApiUrl('/posts?limit=3')),
          fetch(getApiUrl('/projects')),
          fetch(getApiUrl('/resume')),
          fetch(getApiUrl('/services')),
        ]);

        const [postsJson, projectsJson, resumeJson, servicesJson] = await Promise.all([
          postsRes.json(),
          projectsRes.json(),
          resumeRes.json(),
          servicesRes.json(),
        ]);

        setPosts(postsJson.data || []);
        setProjects(projectsJson.data || []);
        setResume(resumeJson.data || null);
        setServices(servicesJson.data || []);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <PageLayout>
      {/* Scroll Progress Bar */}
      <div className="fixed top-16 left-0 w-full h-1 z-40">
        <div
          className="h-full bg-cyan-500 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Hero Section */}
        <section className="mb-20 relative animate-fade-in-down rounded-2xl overflow-hidden border border-cyan-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 backdrop-blur-sm" />
          <div className="relative z-10 p-10 md:p-16 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Full-Stack Developer
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Building modern web applications with clean code and thoughtful architecture.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button to="/projects" variant="primary" size="lg">View Projects</Button>
              <Button to="/blog" variant="ghost" size="lg">Read the Blog</Button>
            </div>
          </div>
        </section>

        {/* Latest Blog Posts */}
        <section className="mb-section">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="relative pb-3">
              <h2 className="text-3xl font-bold text-white">Latest from the Blog</h2>
              <div className="absolute bottom-0 left-0 w-24 h-1 bg-cyan-500 rounded-full" />
            </div>
            <Button to="/blog" variant="primary" size="sm">View All Posts</Button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-gray-500 backdrop-blur-sm bg-gray-900/80 p-6 rounded-xl border border-gray-800">No blog posts yet. Check back soon!</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug}`}
                  className="clickable-card backdrop-blur-sm bg-gray-900/80 rounded-xl shadow-md overflow-hidden border border-gray-800 hover:border-cyan-500/30 transition-all"
                >
                  {post.coverImage && (
                    <div className="h-44 overflow-hidden">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-xs text-cyan-400 mb-2">{formatDate(post.createdAt)}</p>
                    <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Featured Projects */}
        <section className="mb-section">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="relative pb-3">
              <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
              <div className="absolute bottom-0 left-0 w-24 h-1 bg-brand-primary rounded-full" />
            </div>
            <Button to="/projects" variant="primary" size="sm">View All Projects</Button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map(i => <CardSkeleton key={i} />)}
            </div>
          ) : projects.length === 0 ? (
            <p className="text-gray-500 backdrop-blur-sm bg-gray-900/80 p-6 rounded-xl border border-gray-800">No projects yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {projects.slice(0, 2).map((project) => (
                <div
                  key={project._id}
                  className="clickable-card backdrop-blur-sm bg-gray-900/80 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:border-cyan-500/30 transition-all group"
                >
                  {project.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'active' ? 'bg-green-500/10 text-green-400' :
                        project.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>{project.status}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.map((tech) => (
                          <span key={tech} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">{tech}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      {project.liveUrl && <Button href={project.liveUrl} size="sm" variant="primary">Live</Button>}
                      {project.repoUrl && <Button href={project.repoUrl} size="sm" variant="ghost">Code</Button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Resume Teaser */}
        <section className="mb-section">
          <div
            onClick={() => navigate('/resume')}
            className="clickable-card backdrop-blur-sm bg-gray-900/80 p-8 rounded-xl shadow-lg hover:shadow-xl hover:shadow-cyan-900/20 transition-all border border-gray-800 hover:border-cyan-500/30 relative overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10 gap-4">
              <div className="relative pb-3">
                <h2 className="text-3xl font-bold text-white">Resume at a Glance</h2>
                <div className="absolute bottom-0 left-0 w-24 h-1 bg-brand-primary rounded-full" />
              </div>
              <Button to="/resume" variant="primary" size="sm">View Full Resume</Button>
            </div>

            {loading ? (
              <div className="space-y-3 relative z-10">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-7 w-20 rounded-full" />)}
                </div>
              </div>
            ) : resume ? (
              <div className="relative z-10">
                {resume.experience && resume.experience.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
                      {resume.experience[0].role}
                    </h3>
                    <p className="text-gray-300">
                      {resume.experience[0].company} | {resume.experience[0].startDate} &mdash; {resume.experience[0].current ? 'Present' : resume.experience[0].endDate}
                    </p>
                  </div>
                )}
                {resume.skills && resume.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {resume.skills.slice(0, 8).map((skill) => (
                      <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900/70 text-indigo-300 border border-indigo-700">
                        {skill}
                      </span>
                    ))}
                    {resume.skills.length > 8 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800/70 text-gray-400 border border-gray-700">
                        +{resume.skills.length - 8} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 relative z-10">Resume data unavailable.</p>
            )}
          </div>
        </section>

        {/* Services */}
        <section className="mb-section">
          <div className="backdrop-blur-sm bg-gray-900/80 p-8 rounded-xl shadow-lg border border-gray-800 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 gap-4">
              <div className="relative pb-3">
                <h2 className="text-3xl font-bold text-white">Services</h2>
                <div className="absolute bottom-0 left-0 w-24 h-1 bg-cyan-500 rounded-full" />
              </div>
              <Button to="/services" variant="primary" size="sm">View All Services</Button>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
              </div>
            ) : services.length === 0 ? (
              <p className="text-gray-500 relative z-10">No services listed yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="clickable-card relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50 p-6 hover:border-cyan-500/30 transition-all group"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                    {service.price && (
                      <p className="text-cyan-400 font-medium text-sm mb-3">{service.price}</p>
                    )}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-1 mb-4">
                        {service.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="text-gray-300 text-xs flex items-start gap-1.5">
                            <svg className="w-3.5 h-3.5 text-cyan-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                        {service.features.length > 3 && (
                          <li className="text-gray-500 text-xs pl-5">+{service.features.length - 3} more</li>
                        )}
                      </ul>
                    )}
                    {service.ctaLink && (
                      <a
                        href={service.ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {service.ctaText || 'Get Started'}
                        <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </PageLayout>
  );
};

export default Home;
