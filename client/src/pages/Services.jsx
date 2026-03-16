import React, { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import { CardSkeletonGrid } from '../components/Skeleton';
import { getApiUrl } from '../utils/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(getApiUrl('/services'));
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        setServices(json.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-section-sm md:py-section">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-down">
          Services
        </h1>
        <p className="text-gray-400 text-lg mb-12 animate-fade-in-up">
          Professional services to help bring your ideas to life.
        </p>

        {loading && <CardSkeletonGrid count={3} />}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400">Failed to load services: {error}</p>
          </div>
        )}

        {!loading && !error && services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No services listed yet.</p>
          </div>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="backdrop-blur-sm bg-gray-900/80 rounded-xl shadow-md overflow-hidden border border-gray-800 hover:border-cyan-500/30 transition-all flex flex-col p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-2">{service.title}</h2>
                {service.price && (
                  <p className="text-cyan-400 font-medium text-lg mb-3">{service.price}</p>
                )}
                <p className="text-gray-400 text-sm mb-4">{service.description}</p>

                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 mb-6 flex-1">
                    {service.features.map((feature, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <svg className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {service.ctaLink && (
                  <Button href={service.ctaLink} variant="primary" fullWidth>
                    {service.ctaText || 'Get Started'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Services;
