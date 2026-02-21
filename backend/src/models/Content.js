const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    subject: { type: String, required: true },
    gradeLevel: String,
    readingLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    tags: [String],
    imageUrl: String,
    audioUrl: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isPublic: { type: Boolean, default: true },
    accessibility: {
      hasAudio: { type: Boolean, default: false },
      hasSimplifiedVersion: { type: Boolean, default: false },
      simplifiedBody: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Content', contentSchema);
