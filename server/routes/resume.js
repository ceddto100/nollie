const express = require('express');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/resume (public) — returns the single resume document
router.get('/', async (req, res) => {
  try {
    let resume = await Resume.findOne();
    if (!resume) {
      resume = await Resume.create({});
    }
    res.json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/resume/:section (admin) — update a specific section
router.put('/:section', auth, async (req, res) => {
  try {
    const { section } = req.params;
    const validSections = ['summary', 'experience', 'education', 'skills', 'certifications', 'pdfUrl'];

    if (!validSections.includes(section)) {
      return res.status(400).json({ success: false, error: `Invalid section: ${section}` });
    }

    let resume = await Resume.findOne();
    if (!resume) {
      resume = await Resume.create({});
    }

    resume[section] = req.body.value;
    await resume.save();

    res.json({ success: true, data: resume });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
