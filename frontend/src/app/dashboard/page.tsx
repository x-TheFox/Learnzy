'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, BookOpen, BarChart3, Flame, Clock, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Progress, Quiz, Content } from '@/types';

interface DashboardData {
  totalQuizzesCompleted: number;
  totalReadingSessionsCompleted: number;
  streakDays: number;
  recentActivity: Progress[];
}

export default function DashboardPage() {
  const { firebaseUser, dbUser, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [recentQuizzes, setRecentQuizzes] = useState<Quiz[]>([]);
  const [recentContent, setRecentContent] = useState<Content[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    if (!firebaseUser) return;
    const fetchData = async () => {
      try {
        const [progressRes, quizzesRes, contentRes] = await Promise.all([
          api.get('/api/progress'),
          api.get('/api/quizzes'),
          api.get('/api/content'),
        ]);
        setData(progressRes.data);
        setRecentQuizzes(quizzesRes.data.slice(0, 3));
        setRecentContent(contentRes.data.slice(0, 3));
      } catch {
        // silently fail — user may not have data yet
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [firebaseUser]);

  if (loading || !firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Quizzes Done',
      value: data?.totalQuizzesCompleted ?? 0,
      icon: Brain,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      label: 'Reading Sessions',
      value: data?.totalReadingSessionsCompleted ?? 0,
      icon: BookOpen,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Day Streak',
      value: data?.streakDays ?? 0,
      icon: Flame,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Hello, {dbUser?.displayName || firebaseUser.displayName || 'Learner'}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Ready to continue your learning journey?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quizzes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              Available Quizzes
            </h2>
            <Link href="/quiz" className="text-sm text-indigo-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {loadingData ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse h-16" />
              ))
            ) : recentQuizzes.length > 0 ? (
              recentQuizzes.map((quiz) => (
                <Link
                  key={quiz._id}
                  href={`/quiz/${quiz._id}`}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow group"
                >
                  <div>
                    <p className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {quiz.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {quiz.subject} · {quiz.questions?.length ?? 0} questions
                    </p>
                  </div>
                  <Star className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                </Link>
              ))
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500 text-sm">
                No quizzes available yet.{' '}
                <Link href="/quiz" className="text-indigo-600 hover:underline">
                  Browse quizzes
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reading */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              Reading Materials
            </h2>
            <Link href="/reading" className="text-sm text-indigo-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {loadingData ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse h-16" />
              ))
            ) : recentContent.length > 0 ? (
              recentContent.map((item) => (
                <Link
                  key={item._id}
                  href={`/reading/${item._id}`}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow group"
                >
                  <div>
                    <p className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.subject} · {item.readingLevel}
                    </p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-300 group-hover:text-green-400 transition-colors" />
                </Link>
              ))
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500 text-sm">
                No reading materials yet.{' '}
                <Link href="/reading" className="text-indigo-600 hover:underline">
                  Browse content
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {data?.recentActivity && data.recentActivity.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Recent Activity
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Activity</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Score</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentActivity.slice(0, 5).map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {p.quiz?.title || p.content?.title || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{p.activityType}</td>
                    <td className="px-4 py-3">
                      {p.percentage != null ? (
                        <span
                          className={`font-semibold ${
                            p.percentage >= 70 ? 'text-green-600' : 'text-orange-600'
                          }`}
                        >
                          {p.percentage}%
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(p.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
