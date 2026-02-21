# Learnzy

**Adaptive Learning for Every Mind** — An AI-powered education platform built specifically for students with ADHD and dyslexia.

## Overview

Learnzy is a full-stack web application that adapts learning content and assessments in real time based on each student's performance, focus level, and accessibility needs.

### Key Features

- 🧠 **AI-Powered Adaptive Quizzes** — Difficulty adjusts dynamically based on performance
- 📖 **Dyslexia-Friendly Reading** — Customizable fonts, color overlays, and text simplification via AI
- 🔊 **Text-to-Speech** — Browser-native read-aloud support for all reading content
- ✨ **AI Text Simplification** — Groq-powered simplification of complex text
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
| AI | Groq (Llama 3.3 70B) |
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
- Groq API key (free tier available at [console.groq.com](https://console.groq.com))

### Groq API Key Setup

Learnzy uses [Groq](https://groq.com) as its AI provider for fast, low-latency inference. Groq runs open-source large language models (LLMs) on custom LPU™ hardware, offering a generous free tier with no credit card required.

**Steps to get your Groq API key:**

1. Visit [console.groq.com](https://console.groq.com) and sign up for a free account.
2. Once logged in, navigate to **API Keys** in the left sidebar.
3. Click **Create API Key**, give it a name (e.g., `learnzy-dev`), and click **Submit**.
4. Copy the generated key — it starts with `gsk_...`. **Store it securely; you won't be able to view it again.**
5. Paste the key as the value of `GROQ_API_KEY` in your `backend/.env` file.

**Model used:** `llama-3.3-70b-versatile`

This is Meta's Llama 3.3 70B model hosted on Groq's infrastructure. It is fast, instruction-tuned, and well-suited for educational tasks such as text simplification, hint generation, and focus analysis. The free tier allows up to **14,400 requests per day** and **6,000 tokens per minute** (as of the current Groq limits — check the [Groq rate limits page](https://console.groq.com/docs/rate-limits) for the latest).

**Why Groq?**

| Feature | Groq |
|---------|------|
| Speed | Extremely fast inference (often <1s for short prompts) |
| Cost | Generous free tier, no credit card required to start |
| Models | Llama 3.3, Mixtral, Gemma, and more |
| Compatibility | OpenAI-compatible SDK interface |
| Privacy | Data not used for training by default |

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
GROQ_API_KEY=your-groq-api-key
```

> **Tip:** Get your `GROQ_API_KEY` from [console.groq.com/keys](https://console.groq.com/keys). The key starts with `gsk_`.

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
- **Groq** powers text simplification, hints, and focus analysis features using the `llama-3.3-70b-versatile` model via the official `groq-sdk` Node.js package

## Deployment

- **Frontend**: Deploy to [Vercel](https://vercel.com) — connect the `frontend/` directory
- **Backend**: Deploy to [Render](https://render.com) — point to `backend/` directory with `npm start`

> **Important:** When deploying the backend, add `GROQ_API_KEY` as an environment variable in your hosting provider's dashboard (e.g., Render → Environment → Add Environment Variable).
