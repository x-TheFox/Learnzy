const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
    default: 'multiple-choice',
  },
  options: [String],
  correctAnswer: { type: String, required: true },
  explanation: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  tags: [String],
  imageUrl: String,
  audioUrl: String,
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    subject: { type: String, required: true },
    gradeLevel: String,
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isPublic: { type: Boolean, default: true },
    adaptiveSettings: {
      enabled: { type: Boolean, default: true },
      adjustDifficulty: { type: Boolean, default: true },
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
