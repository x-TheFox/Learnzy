const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const User = require('../models/User');

// GET /api/quizzes
const getQuizzes = async (req, res) => {
  try {
    const { subject, gradeLevel, difficulty } = req.query;
    const filter = { isPublic: true };
    if (subject) filter.subject = subject;
    if (gradeLevel) filter.gradeLevel = gradeLevel;

    const quizzes = await Quiz.find(filter)
      .select('-questions')
      .populate('createdBy', 'displayName')
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/quizzes/:id
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'displayName');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/quizzes
const createQuiz = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const quiz = await Quiz.create({
      ...req.body,
      createdBy: user._id,
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/quizzes/:id/submit
const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { answers, timeSpentSeconds } = req.body;
    let score = 0;
    const gradedAnswers = [];

    quiz.questions.forEach((question) => {
      const userAnswer = answers.find(
        (a) => a.questionId === question._id.toString()
      );
      const isCorrect =
        userAnswer && userAnswer.selectedAnswer === question.correctAnswer;
      if (isCorrect) score++;
      gradedAnswers.push({
        questionId: question._id,
        selectedAnswer: userAnswer ? userAnswer.selectedAnswer : null,
        isCorrect: !!isCorrect,
        timeTakenSeconds: userAnswer ? userAnswer.timeTakenSeconds : 0,
      });
    });

    const maxScore = quiz.questions.length;
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    const user = await User.findOne({ firebaseUid: req.user.uid });
    const progress = await Progress.create({
      user: user._id,
      quiz: quiz._id,
      activityType: 'quiz',
      score,
      maxScore,
      percentage,
      timeSpentSeconds,
      answers: gradedAnswers,
    });

    await User.findByIdAndUpdate(user._id, {
      $inc: { 'progress.totalQuizzesCompleted': 1 },
      $set: { 'progress.lastActiveDate': new Date() },
    });

    res.json({ score, maxScore, percentage, progress });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getQuizzes, getQuizById, createQuiz, submitQuiz };
