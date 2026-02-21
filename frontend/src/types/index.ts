export interface UserConditions {
  adhd: boolean;
  dyslexia: boolean;
}

export interface LearningPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  fontFamily: 'default' | 'opendyslexic' | 'arial' | 'comic-sans';
  colorTheme: 'default' | 'high-contrast' | 'cream' | 'blue';
  textToSpeech: boolean;
  highContrast: boolean;
}

export interface UserProfile {
  avatarUrl?: string;
  gradeLevel?: string;
  learningPreferences: LearningPreferences;
  conditions: UserConditions;
}

export interface UserProgress {
  totalQuizzesCompleted: number;
  totalReadingSessionsCompleted: number;
  streakDays: number;
  lastActiveDate?: string;
}

export interface User {
  _id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  role: 'student' | 'teacher' | 'admin';
  profile: UserProfile;
  progress: UserProgress;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  _id: string;
  questionText: string;
  questionType: 'multiple-choice' | 'true-false' | 'short-answer';
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  imageUrl?: string;
  audioUrl?: string;
}

export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  subject: string;
  gradeLevel?: string;
  questions: Question[];
  createdBy?: { displayName: string };
  isPublic: boolean;
  tags: string[];
  createdAt: string;
}

export interface Content {
  _id: string;
  title: string;
  body: string;
  subject: string;
  gradeLevel?: string;
  readingLevel: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  imageUrl?: string;
  audioUrl?: string;
  createdBy?: { displayName: string };
  isPublic: boolean;
  accessibility: {
    hasAudio: boolean;
    hasSimplifiedVersion: boolean;
    simplifiedBody?: string;
  };
  createdAt: string;
}

export interface Progress {
  _id: string;
  activityType: 'quiz' | 'reading' | 'ai-session';
  quiz?: { title: string; subject: string };
  content?: { title: string; subject: string };
  score?: number;
  maxScore?: number;
  percentage?: number;
  timeSpentSeconds?: number;
  completedAt: string;
}
