const Content = require('../models/Content');
const Progress = require('../models/Progress');
const User = require('../models/User');

// GET /api/content
const getContent = async (req, res) => {
  try {
    const { subject, gradeLevel, readingLevel } = req.query;
    const filter = { isPublic: true };
    if (subject) filter.subject = subject;
    if (gradeLevel) filter.gradeLevel = gradeLevel;
    if (readingLevel) filter.readingLevel = readingLevel;

    const content = await Content.find(filter)
      .populate('createdBy', 'displayName')
      .sort({ createdAt: -1 });

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/content/:id
const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate(
      'createdBy',
      'displayName'
    );
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/content
const createContent = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const content = await Content.create({
      ...req.body,
      createdBy: user._id,
    });
    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/content/:id/complete
const markContentComplete = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const { timeSpentSeconds } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });

    const progress = await Progress.create({
      user: user._id,
      content: content._id,
      activityType: 'reading',
      timeSpentSeconds,
    });

    await User.findByIdAndUpdate(user._id, {
      $inc: { 'progress.totalReadingSessionsCompleted': 1 },
      $set: { 'progress.lastActiveDate': new Date() },
    });

    res.json({ message: 'Reading session recorded', progress });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getContent, getContentById, createContent, markContentComplete };
