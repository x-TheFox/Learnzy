'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, Search, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Quiz } from '@/types';

export default function QuizListPage() {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filtered, setFiltered] = useState<Quiz[]>([]);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !firebaseUser) router.push('/login');
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    if (!firebaseUser) return;
    api
      .get('/api/quizzes')
      .then((res) => {
        setQuizzes(res.data);
        setFiltered(res.data);
      })
      .finally(() => setLoadingData(false));
  }, [firebaseUser]);

  useEffect(() => {
    let result = quizzes;
    if (search) {
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(search.toLowerCase()) ||
          q.subject.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (subject) {
      result = result.filter((q) => q.subject === subject);
    }
    setFiltered(result);
  }, [search, subject, quizzes]);

  const subjects = [...new Set(quizzes.map((q) => q.subject))];

  if (loading || !firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Brain className="w-7 h-7 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
      </div>
      <p className="text-gray-500 mb-8">Test your knowledge with adaptive quizzes</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search quizzes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quiz grid */}
      {loadingData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-36" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">No quizzes found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((quiz) => (
            <Link
              key={quiz._id}
              href={`/quiz/${quiz._id}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {quiz.subject}
                </span>
                {quiz.gradeLevel && (
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                    Grade {quiz.gradeLevel}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                {quiz.title}
              </h3>
              {quiz.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{quiz.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{quiz.questions?.length ?? 0} questions</span>
                <span className="text-indigo-500 font-medium group-hover:underline">
                  Start Quiz →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
