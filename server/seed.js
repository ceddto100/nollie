require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Post = require('./models/Post');
const Project = require('./models/Project');
const Resume = require('./models/Resume');
const Service = require('./models/Service');

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nollie';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      Post.deleteMany({}),
      Project.deleteMany({}),
      Resume.deleteMany({}),
      Service.deleteMany({}),
    ]);
    console.log('Cleared existing data.');

    // Seed Posts
    await Post.insertMany([
      {
        title: 'Getting Started with Node.js and Express',
        slug: 'getting-started-with-nodejs-and-express',
        excerpt: 'A beginner-friendly guide to building REST APIs with Node.js and Express.',
        body: '## Introduction\n\nNode.js is a JavaScript runtime built on Chrome\'s V8 engine. Combined with Express, it makes building web servers straightforward.\n\n## Setting Up\n\n```bash\nnpm init -y\nnpm install express\n```\n\n## Your First Server\n\n```javascript\nconst express = require(\'express\');\nconst app = express();\n\napp.get(\'/\', (req, res) => {\n  res.json({ message: \'Hello World\' });\n});\n\napp.listen(3000);\n```\n\nThis creates a minimal API server on port 3000.',
        tags: ['Node.js', 'Express', 'Backend', 'Tutorial'],
        coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
        published: true,
      },
      {
        title: 'Understanding MongoDB Schemas with Mongoose',
        slug: 'understanding-mongodb-schemas-with-mongoose',
        excerpt: 'Learn how to define and validate data models using Mongoose ODM.',
        body: '## Why Mongoose?\n\nMongoDB is schema-less by default, but Mongoose gives us structure and validation.\n\n## Defining a Schema\n\n```javascript\nconst mongoose = require(\'mongoose\');\n\nconst userSchema = new mongoose.Schema({\n  name: { type: String, required: true },\n  email: { type: String, unique: true },\n  age: { type: Number, min: 0 }\n});\n\nmodule.exports = mongoose.model(\'User\', userSchema);\n```\n\n## Validation\n\nMongoose validates data before saving, catching errors early.',
        tags: ['MongoDB', 'Mongoose', 'Database', 'Tutorial'],
        coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
        published: true,
      },
      {
        title: 'JWT Authentication in Full-Stack Apps',
        slug: 'jwt-authentication-in-fullstack-apps',
        excerpt: 'Implement secure JWT-based authentication from backend to frontend.',
        body: '## What is JWT?\n\nJSON Web Tokens are a compact way to securely transmit information between parties.\n\n## How It Works\n\n1. User sends credentials\n2. Server verifies and returns a signed token\n3. Client stores the token\n4. Client sends token with each request\n5. Server verifies token on protected routes\n\n## Implementation\n\n```javascript\nconst jwt = require(\'jsonwebtoken\');\n\nconst token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {\n  expiresIn: \'7d\'\n});\n```\n\nAlways store secrets in environment variables.',
        tags: ['Authentication', 'JWT', 'Security', 'Full-Stack'],
        coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
        published: false,
      },
    ]);
    console.log('Seeded 3 posts.');

    // Seed Projects
    await Project.insertMany([
      {
        name: 'Task Manager API',
        description: 'A RESTful API for managing tasks and projects with user authentication, built with Node.js, Express, and MongoDB.',
        techStack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
        liveUrl: 'https://example.com/task-manager',
        repoUrl: 'https://github.com/example/task-manager',
        coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
        status: 'active',
      },
      {
        name: 'Weather Dashboard',
        description: 'A real-time weather dashboard that fetches data from multiple APIs and displays forecasts with interactive charts.',
        techStack: ['React', 'Tailwind CSS', 'Chart.js', 'OpenWeather API'],
        liveUrl: 'https://example.com/weather',
        repoUrl: 'https://github.com/example/weather-dashboard',
        coverImage: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800',
        status: 'active',
      },
      {
        name: 'E-Commerce Platform',
        description: 'A full-featured e-commerce platform with cart, checkout, payment integration, and admin panel.',
        techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
        liveUrl: '',
        repoUrl: 'https://github.com/example/ecommerce',
        coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        status: 'in-progress',
      },
    ]);
    console.log('Seeded 3 projects.');

    // Seed Resume
    await Resume.create({
      summary: 'Full-stack developer with 5+ years of experience building web applications using modern JavaScript technologies. Passionate about clean code, performance optimization, and developer experience.',
      experience: [
        {
          company: 'Tech Solutions Inc.',
          role: 'Senior Full-Stack Developer',
          startDate: '2022-01',
          endDate: '',
          current: true,
          bullets: [
            'Lead development of microservices architecture serving 50k+ daily users',
            'Reduced API response times by 40% through query optimization',
            'Mentored team of 4 junior developers',
          ],
        },
        {
          company: 'StartupXYZ',
          role: 'Full-Stack Developer',
          startDate: '2019-06',
          endDate: '2021-12',
          current: false,
          bullets: [
            'Built and shipped 3 production React applications from scratch',
            'Implemented CI/CD pipelines reducing deployment time by 60%',
            'Designed RESTful APIs consumed by web and mobile clients',
          ],
        },
      ],
      education: [
        {
          school: 'State University',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          year: '2019',
        },
      ],
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Git', 'Docker', 'AWS', 'Tailwind CSS', 'REST APIs'],
      certifications: [
        { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2023', url: '' },
        { name: 'MongoDB Associate Developer', issuer: 'MongoDB', year: '2022', url: '' },
      ],
      pdfUrl: '',
    });
    console.log('Seeded resume.');

    // Seed Services
    await Service.insertMany([
      {
        title: 'Full-Stack Web Development',
        description: 'End-to-end web application development using React, Node.js, and MongoDB. From planning to deployment.',
        price: 'Starting at $2,500',
        features: ['Custom React frontend', 'Node.js/Express API', 'MongoDB database design', 'Authentication & authorization', 'Deployment & hosting setup'],
        ctaText: 'Request a Quote',
        ctaLink: 'mailto:hello@example.com?subject=Web Development Inquiry',
        order: 1,
      },
      {
        title: 'API Development & Integration',
        description: 'Custom REST API development, third-party API integration, and backend architecture consulting.',
        price: 'Starting at $1,500',
        features: ['RESTful API design', 'Database modeling', 'Third-party integrations', 'API documentation', 'Performance optimization'],
        ctaText: 'Get Started',
        ctaLink: 'mailto:hello@example.com?subject=API Development Inquiry',
        order: 2,
      },
      {
        title: 'Technical Consulting',
        description: 'Architecture reviews, code audits, and technical strategy sessions for your development team.',
        price: '$150/hr',
        features: ['Architecture review', 'Code audit & best practices', 'Tech stack selection', 'Team mentoring', 'Performance profiling'],
        ctaText: 'Book a Session',
        ctaLink: 'mailto:hello@example.com?subject=Consulting Inquiry',
        order: 3,
      },
    ]);
    console.log('Seeded 3 services.');

    console.log('\nSeeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
