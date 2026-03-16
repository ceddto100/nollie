import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Public Pages
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Projects from './pages/Projects';
import Resume from './pages/Resume';
import Services from './pages/Services';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import BlogManager from './pages/admin/BlogManager';
import ProjectManager from './pages/admin/ProjectManager';
import ResumeManager from './pages/admin/ResumeManager';
import ServicesManager from './pages/admin/ServicesManager';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/services" element={<Services />} />

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/blog" element={<BlogManager />} />
          <Route path="/admin/projects" element={<ProjectManager />} />
          <Route path="/admin/resume" element={<ResumeManager />} />
          <Route path="/admin/services" element={<ServicesManager />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
