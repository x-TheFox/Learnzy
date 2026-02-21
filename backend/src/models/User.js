const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student',
    },
    profile: {
      avatarUrl: String,
      gradeLevel: String,
      learningPreferences: {
        fontSize: { type: String, default: 'medium' },
        fontFamily: { type: String, default: 'default' },
        colorTheme: { type: String, default: 'default' },
        textToSpeech: { type: Boolean, default: false },
        highContrast: { type: Boolean, default: false },
      },
      conditions: {
        adhd: { type: Boolean, default: false },
        dyslexia: { type: Boolean, default: false },
      },
    },
    progress: {
      totalQuizzesCompleted: { type: Number, default: 0 },
      totalReadingSessionsCompleted: { type: Number, default: 0 },
      streakDays: { type: Number, default: 0 },
      lastActiveDate: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
