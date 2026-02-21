'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CheckCircle, XCircle, Lightbulb, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Quiz, Question } from '@/types';

interface Answer {
  questionId: string;
  selectedAnswer: string;
  timeTakenSeconds: number;
}

interface Result {
  score: number;
  maxScore: number;
  percentage: number;
}

export default function QuizPage() {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hint, setHint] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [quizStart] = useState(Date.now());
  const [loadingQuiz, setLoadingQuiz] = useState(true);

  useEffect(() => {
    if (!loading && !firebaseUser) router.push('/login');
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    if (!firebaseUser || !id) return;
    api
      .get(`/api/quizzes/${id}`)
      .then((res) => setQuiz(res.data))
      .finally(() => setLoadingQuiz(false));
  }, [firebaseUser, id]);

  const currentQuestion: Question | undefined = quiz?.questions[current];

  const handleSelect = (option: string) => {
    if (selected !== null) return;
    setSelected(option);
  };

  const handleNext = useCallback(() => {
    if (!currentQuestion || selected === null) return;
    const timeTaken = Math.round((Date.now() - questionStart) / 1000);
    const newAnswers = [
      ...answers,
      {
        questionId: currentQuestion._id,
        selectedAnswer: selected,
        timeTakenSeconds: timeTaken,
      },
    ];
    setAnswers(newAnswers);

    if (current + 1 < (quiz?.questions.length ?? 0)) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setHint('');
      setQuestionStart(Date.now());
    } else {
      // Submit quiz
      const totalTime = Math.round((Date.now() - quizStart) / 1000);
      api
        .post(`/api/quizzes/${id}/submit`, {
          answers: newAnswers,
          timeSpentSeconds: totalTime,
        })
        .then((res) => setResult(res.data));
    }
  }, [answers, current, currentQuestion, id, quiz, questionStart, quizStart, selected]);

  const handleHint = async () => {
    if (!currentQuestion) return;
    setLoadingHint(true);
    try {
      const res = await api.post('/api/ai/quiz-hint', {
        question: currentQuestion.questionText,
        subject: quiz?.subject,
      });
      setHint(res.data.hint);
    } catch {
      setHint('Sorry, could not load a hint right now.');
    } finally {
      setLoadingHint(false);
    }
  };

  if (loading || !firebaseUser || loadingQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Quiz not found.
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              result.percentage >= 70 ? 'bg-green-100' : 'bg-orange-100'
            }`}
          >
            {result.percentage >= 70 ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-orange-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {result.percentage >= 70 ? 'Great work!' : 'Keep practising!'}
          </h2>
          <p className="text-gray-500 mb-6">
            You scored{' '}
            <span className="font-semibold text-gray-800">
              {result.score}/{result.maxScore}
            </span>{' '}
            ({result.percentage}%)
          </p>
          <div className="w-full bg-gray-100 rounded-full h-4 mb-8">
            <div
              className={`h-4 rounded-full transition-all ${
                result.percentage >= 70 ? 'bg-green-500' : 'bg-orange-400'
              }`}
              style={{ width: `${result.percentage}%` }}
            />
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/quiz')}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Try Another Quiz
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const progress = ((current) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">{quiz.title}</h1>
            <p className="text-sm text-gray-400">{quiz.subject}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {current + 1} / {totalQuestions}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-lg font-medium text-gray-900 mb-6 leading-relaxed">
            {currentQuestion?.questionText}
          </p>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion?.options.map((option, i) => {
              let style =
                'border border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50';
              if (selected !== null) {
                if (option === currentQuestion.correctAnswer) {
                  style = 'border-2 border-green-500 bg-green-50 text-green-700';
                } else if (option === selected && option !== currentQuestion.correctAnswer) {
                  style = 'border-2 border-red-400 bg-red-50 text-red-700';
                } else {
                  style = 'border border-gray-100 text-gray-400';
                }
              } else if (selected === option) {
                style = 'border-2 border-indigo-600 bg-indigo-50 text-indigo-700';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(option)}
                  disabled={selected !== null}
                  className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all ${style}`}
                >
                  <span className="inline-block w-5 h-5 rounded-full border border-current mr-3 text-center text-xs leading-5 font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {selected !== null && currentQuestion?.explanation && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 text-sm text-blue-800">
              <strong>Explanation:</strong> {currentQuestion.explanation}
            </div>
          )}

          {/* Hint */}
          {hint && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-4 text-sm text-yellow-800 flex gap-2">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{hint}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            {selected === null && (
              <button
                onClick={handleHint}
                disabled={loadingHint}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
              >
                <Lightbulb className="w-4 h-4" />
                {loadingHint ? 'Loading hint…' : 'Get a hint'}
              </button>
            )}
            {selected !== null && (
              <button
                onClick={handleNext}
                className="ml-auto flex items-center gap-1 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                {current + 1 < totalQuestions ? 'Next Question' : 'See Results'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
