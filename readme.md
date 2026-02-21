# Learnzy

**Adaptive Learning for Every Mind** — An AI-powered education platform built specifically for students with ADHD and dyslexia.

## Overview

Learnzy is a full-stack web application that adapts learning content and assessments in real time based on each student's performance, focus level, and accessibility needs.

### Key Features

- 🧠 **AI-Powered Adaptive Quizzes** — Difficulty adjusts dynamically based on performance
- 📖 **Dyslexia-Friendly Reading** — Customizable fonts, color overlays, and text simplification via AI
- 🔊 **Text-to-Speech** — Browser-native read-aloud support for all reading content
- ✨ **AI Text Simplification** — OpenAI-powered simplification of complex text
- 💡 **Quiz Hints** — AI-generated hints that guide without giving away answers
- 🎯 **ADHD-Aware UX** — Minimal distractions, focus timers, clear progress indicators
- 📊 **Progress Tracking** — Detailed analytics on quizzes, streaks, and reading sessions
- 🔐 **Firebase Authentication** — Email/password and Google OAuth sign-in
- ♿ **Accessibility Settings** — Font size, font family, color themes, high-contrast mode

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Authentication | Firebase Auth |
| AI | OpenAI GPT-3.5 |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure

```
Learnzy/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/       # Next.js App Router pages
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── login/            # Login page
│   │   │   ├── register/         # Registration page
│   │   │   ├── dashboard/        # Student dashboard
│   │   │   ├── quiz/             # Quiz list + quiz runner
│   │   │   ├── reading/          # Reading list + reader
│   │   │   └── profile/          # Settings & profile
│   │   ├── components/           # Reusable UI components
│   │   ├── hooks/                # Custom hooks (useAuth)
│   │   ├── lib/                  # Firebase & API config
│   │   └── types/                # TypeScript types
│   └── .env.example
│
└── backend/           # Express.js API server
    ├── src/
    │   ├── config/    # Database & Firebase Admin config
    │   ├── models/    # Mongoose models (User, Quiz, Content, Progress)
    │   ├── routes/    # API routes
    │   ├── controllers/ # Route handlers
    │   └── middleware/  # Auth middleware
    └── .env.example
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Firebase project
- OpenAI API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your environment variables in .env
npm run dev
```

Backend runs on `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Fill in your Firebase config and API URL
npm run dev
```

Frontend runs on `http://localhost:3000`.

### Environment Variables

**Backend** (`backend/.env`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learnzy
CLIENT_URL=http://localhost:3000
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
OPENAI_API_KEY=your-openai-api-key
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/users/register` | Register user |
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/me` | Update profile |
| GET | `/api/quizzes` | List quizzes |
| GET | `/api/quizzes/:id` | Get quiz |
| POST | `/api/quizzes` | Create quiz |
| POST | `/api/quizzes/:id/submit` | Submit quiz answers |
| GET | `/api/content` | List reading content |
| GET | `/api/content/:id` | Get content item |
| POST | `/api/content` | Create content |
| POST | `/api/content/:id/complete` | Mark reading complete |
| GET | `/api/progress` | Get progress summary |
| GET | `/api/progress/stats` | Get progress stats |
| POST | `/api/ai/simplify` | Simplify text with AI |
| POST | `/api/ai/quiz-hint` | Get quiz hint from AI |
| POST | `/api/ai/focus-check` | Analyze focus from quiz pattern |

## Architecture

The platform uses a Service-Oriented Architecture (SOA):

- **Frontend** communicates with the backend REST API using Axios with Firebase JWT tokens
- **Backend** verifies tokens using Firebase Admin SDK before processing requests
- **MongoDB** stores user profiles, quizzes, content, and progress data
- **OpenAI** powers text simplification, hints, and focus analysis features

## Deployment

- **Frontend**: Deploy to [Vercel](https://vercel.com) — connect the `frontend/` directory
- **Backend**: Deploy to [Render](https://render.com) — point to `backend/` directory with `npm start`
