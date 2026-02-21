'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Type,
  Palette,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Content } from '@/types';

type FontSize = 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl';
type ColorTheme = 'bg-white text-gray-800' | 'bg-amber-50 text-gray-800' | 'bg-blue-50 text-blue-900' | 'bg-black text-white';

const fontSizes: { label: string; cls: FontSize }[] = [
  { label: 'S', cls: 'text-sm' },
  { label: 'M', cls: 'text-base' },
  { label: 'L', cls: 'text-lg' },
  { label: 'XL', cls: 'text-xl' },
  { label: '2XL', cls: 'text-2xl' },
];

const colorThemes: { label: string; cls: ColorTheme }[] = [
  { label: 'White', cls: 'bg-white text-gray-800' },
  { label: 'Cream', cls: 'bg-amber-50 text-gray-800' },
  { label: 'Blue', cls: 'bg-blue-50 text-blue-900' },
  { label: 'Dark', cls: 'bg-black text-white' },
];

export default function ReadingArticlePage() {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [content, setContent] = useState<Content | null>(null);
  const [simplified, setSimplified] = useState('');
  const [showSimplified, setShowSimplified] = useState(false);
  const [loadingSimplify, setLoadingSimplify] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('text-base');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('bg-white text-gray-800');
  const [speaking, setSpeaking] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!loading && !firebaseUser) router.push('/login');
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    if (!firebaseUser || !id) return;
    api.get(`/api/content/${id}`).then((res) => setContent(res.data));
  }, [firebaseUser, id]);

  const handleSimplify = async () => {
    if (!content) return;
    setLoadingSimplify(true);
    try {
      const res = await api.post('/api/ai/simplify', {
        text: content.body,
        readingLevel: 'beginner',
      });
      setSimplified(res.data.simplified);
      setShowSimplified(true);
    } catch {
      setSimplified('Sorry, simplification is not available right now.');
      setShowSimplified(true);
    } finally {
      setLoadingSimplify(false);
    }
  };

  const handleTextToSpeech = () => {
    if (!content) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = showSimplified && simplified ? simplified : content.body;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const handleComplete = async () => {
    if (!content || completed) return;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    try {
      await api.post(`/api/content/${id}/complete`, {
        timeSpentSeconds: timeSpent,
      });
      setCompleted(true);
    } catch {
      setCompleted(true);
    }
  };

  if (loading || !firebaseUser || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  const bodyText = showSimplified && simplified ? simplified : content.body;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Controls toolbar */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-6 flex flex-wrap items-center gap-4">
        {/* Font size */}
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-gray-400" />
          <div className="flex gap-1">
            {fontSizes.map(({ label, cls }) => (
              <button
                key={label}
                onClick={() => setFontSize(cls)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                  fontSize === cls
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Color theme */}
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-gray-400" />
          <div className="flex gap-1">
            {colorThemes.map(({ label, cls }) => (
              <button
                key={label}
                onClick={() => setColorTheme(cls)}
                title={label}
                className={`w-7 h-7 rounded border-2 text-xs transition-all ${
                  colorTheme === cls ? 'border-indigo-600 scale-110' : 'border-gray-200'
                } ${cls}`}
              >
                A
              </button>
            ))}
          </div>
        </div>

        {/* TTS */}
        <button
          onClick={handleTextToSpeech}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            speaking
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {speaking ? 'Stop' : 'Read Aloud'}
        </button>

        {/* Simplify */}
        <button
          onClick={handleSimplify}
          disabled={loadingSimplify}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors disabled:opacity-60"
        >
          <Sparkles className="w-4 h-4" />
          {loadingSimplify
            ? 'Simplifying…'
            : showSimplified
            ? 'Show Original'
            : 'Simplify Text'}
        </button>

        {showSimplified && (
          <button
            onClick={() => setShowSimplified(false)}
            className="text-xs text-gray-400 underline"
          >
            Back to original
          </button>
        )}
      </div>

      {/* Article */}
      <article className={`rounded-2xl p-8 shadow-sm border border-gray-100 ${colorTheme}`}>
        <div className="mb-6">
          <div className="flex gap-2 mb-3">
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
              {content.subject}
            </span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
              {content.readingLevel}
            </span>
            {showSimplified && (
              <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Simplified
              </span>
            )}
          </div>
          <h1 className={`font-bold mb-2 ${fontSize === 'text-sm' ? 'text-xl' : 'text-3xl'}`}>
            {content.title}
          </h1>
          {content.createdBy && (
            <p className="text-sm opacity-60">By {content.createdBy.displayName}</p>
          )}
        </div>

        <div
          className={`leading-loose whitespace-pre-wrap ${fontSize}`}
          style={{ fontFamily: 'inherit', lineHeight: '1.9' }}
        >
          {bodyText}
        </div>
      </article>

      {/* Mark complete */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleComplete}
          disabled={completed}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-colors ${
            completed
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          {completed ? 'Reading Completed! ✓' : 'Mark as Complete'}
        </button>
      </div>
    </div>
  );
}
