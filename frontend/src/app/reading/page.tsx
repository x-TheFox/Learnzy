'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Search, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Content } from '@/types';

const levelColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

export default function ReadingListPage() {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<Content[]>([]);
  const [filtered, setFiltered] = useState<Content[]>([]);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !firebaseUser) router.push('/login');
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    if (!firebaseUser) return;
    api
      .get('/api/content')
      .then((res) => {
        setContent(res.data);
        setFiltered(res.data);
      })
      .finally(() => setLoadingData(false));
  }, [firebaseUser]);

  useEffect(() => {
    let result = content;
    if (search) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.subject.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (level) {
      result = result.filter((c) => c.readingLevel === level);
    }
    setFiltered(result);
  }, [search, level, content]);

  if (loading || !firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-7 h-7 text-green-600" />
        <h1 className="text-3xl font-bold text-gray-900">Reading</h1>
      </div>
      <p className="text-gray-500 mb-8">
        Explore dyslexia-friendly reading materials with AI simplification tools
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Content grid */}
      {loadingData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">No articles found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <Link
              key={item._id}
              href={`/reading/${item._id}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  {item.subject}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${levelColors[item.readingLevel]}`}
                >
                  {item.readingLevel}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-3">
                {item.body.slice(0, 120)}…
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                {item.accessibility.hasAudio && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded">🔊 Audio</span>
                )}
                {item.accessibility.hasSimplifiedVersion && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded">✨ Simplified</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
