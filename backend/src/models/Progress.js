const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
    },
    activityType: {
      type: String,
      enum: ['quiz', 'reading', 'ai-session'],
      required: true,
    },
    score: Number,
    maxScore: Number,
    percentage: Number,
    timeSpentSeconds: Number,
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedAnswer: String,
        isCorrect: Boolean,
        timeTakenSeconds: Number,
      },
    ],
    adaptiveData: {
      startDifficulty: String,
      endDifficulty: String,
      focusScore: Number,
      recommendedNextTopic: String,
    },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
