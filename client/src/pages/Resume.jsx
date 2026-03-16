import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import { Skeleton } from '../components/Skeleton';
import { getApiUrl } from '../utils/api';

const Resume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch(getApiUrl('/resume'));
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        setResume(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto px-4 py-section-sm md:py-section space-y-8">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto px-4 py-section text-center">
          <p className="text-red-400">Failed to load resume: {error}</p>
        </div>
      </PageLayout>
    );
  }

  if (!resume) return null;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-section-sm md:py-section">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white animate-fade-in-down">
            Resume
          </h1>
          {resume.pdfUrl && (
            <Button href={resume.pdfUrl} size="sm" variant="primary">
              Download PDF
            </Button>
          )}
        </div>

        {/* Summary */}
        {resume.summary && (
          <section className="mb-12 animate-fade-in-up">
            <div className="backdrop-blur-sm bg-gray-900/80 rounded-xl p-6 border border-gray-800">
              <p className="text-gray-300 text-improved">{resume.summary}</p>
            </div>
          </section>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-cyan-500"></span>
              Experience
            </h2>
            <div className="space-y-6">
              {resume.experience.map((job, i) => (
                <div key={i} className="backdrop-blur-sm bg-gray-900/80 rounded-xl p-6 border border-gray-800">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{job.role}</h3>
                    <span className="text-sm text-cyan-400">
                      {job.startDate} &mdash; {job.current ? 'Present' : job.endDate}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-3">{job.company}</p>
                  {job.bullets && job.bullets.length > 0 && (
                    <ul className="space-y-2">
                      {job.bullets.map((bullet, j) => (
                        <li key={j} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-cyan-500 mt-1">&#8226;</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-cyan-500"></span>
              Education
            </h2>
            <div className="space-y-4">
              {resume.education.map((edu, i) => (
                <div key={i} className="backdrop-blur-sm bg-gray-900/80 rounded-xl p-6 border border-gray-800">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                      <p className="text-gray-400">{edu.school}{edu.field ? ` — ${edu.field}` : ''}</p>
                    </div>
                    {edu.year && <span className="text-sm text-cyan-400">{edu.year}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-cyan-500"></span>
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {resume.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-cyan-500"></span>
              Certifications
            </h2>
            <div className="space-y-4">
              {resume.certifications.map((cert, i) => (
                <div key={i} className="backdrop-blur-sm bg-gray-900/80 rounded-xl p-6 border border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {cert.url ? (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                          {cert.name}
                        </a>
                      ) : cert.name}
                    </h3>
                    {cert.issuer && <p className="text-gray-400 text-sm">{cert.issuer}</p>}
                  </div>
                  {cert.year && <span className="text-sm text-cyan-400">{cert.year}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
};

export default Resume;
