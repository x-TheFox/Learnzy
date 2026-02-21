const Progress = require('../models/Progress');
const User = require('../models/User');

// GET /api/progress
const getMyProgress = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const progress = await Progress.find({ user: user._id })
      .populate('quiz', 'title subject')
      .populate('content', 'title subject')
      .sort({ completedAt: -1 })
      .limit(50);

    const summary = {
      totalQuizzesCompleted: user.progress.totalQuizzesCompleted,
      totalReadingSessionsCompleted: user.progress.totalReadingSessionsCompleted,
      streakDays: user.progress.streakDays,
      lastActiveDate: user.progress.lastActiveDate,
      recentActivity: progress,
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/progress/stats
const getStats = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const quizProgress = await Progress.find({
      user: user._id,
      activityType: 'quiz',
    });

    const averageScore =
      quizProgress.length > 0
        ? Math.round(
            quizProgress.reduce((sum, p) => sum + (p.percentage || 0), 0) /
              quizProgress.length
          )
        : 0;

    const subjectBreakdown = {};
    for (const p of quizProgress) {
      if (p.quiz) {
        await p.populate('quiz', 'subject');
        const subject = p.quiz?.subject || 'Unknown';
        if (!subjectBreakdown[subject]) {
          subjectBreakdown[subject] = { count: 0, totalScore: 0 };
        }
        subjectBreakdown[subject].count++;
        subjectBreakdown[subject].totalScore += p.percentage || 0;
      }
    }

    res.json({
      averageScore,
      totalSessions: quizProgress.length,
      subjectBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMyProgress, getStats };
