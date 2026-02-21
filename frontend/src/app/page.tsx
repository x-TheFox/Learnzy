import Link from 'next/link';
import { Brain, BookOpen, Zap, Star, Users, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Adaptation',
    description:
      'Our AI engine adapts quiz difficulty and reading complexity in real time based on your focus and performance.',
  },
  {
    icon: BookOpen,
    title: 'Dyslexia-Friendly Reading',
    description:
      'Customizable fonts, color overlays, text-to-speech, and simplified text options make reading accessible for everyone.',
  },
  {
    icon: Zap,
    title: 'ADHD-Aware Design',
    description:
      'Short, engaging sessions with focus timers, clear progress indicators, and minimal distractions keep you in the zone.',
  },
  {
    icon: Star,
    title: 'Gamified Progress',
    description:
      'Earn streaks, track milestones, and celebrate achievements to stay motivated throughout your learning journey.',
  },
  {
    icon: Users,
    title: 'Personalized Profiles',
    description:
      'Set your learning preferences once — font size, color theme, and accessibility tools — and Learnzy remembers.',
  },
  {
    icon: CheckCircle,
    title: 'Adaptive Quizzes',
    description:
      'Quizzes get harder or easier based on how you perform, ensuring you are always challenged at just the right level.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Learnzy</h1>
          </div>
          <p className="text-xl text-indigo-100 mb-4">
            Adaptive Learning for Every Mind
          </p>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto mb-10">
            An AI-powered education platform built specifically for students with
            ADHD and dyslexia. Learn at your pace, your way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold text-lg hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Start Learning Free
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Designed with you in mind
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Every feature of Learnzy is built to support the unique learning needs
            of students with ADHD and dyslexia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-indigo-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to learn differently?</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Join thousands of students discovering the joy of learning with tools
            built for the way their brain works.
          </p>
          <Link
            href="/register"
            className="bg-white text-indigo-700 px-10 py-4 rounded-full font-semibold text-lg hover:bg-indigo-50 transition-colors shadow-lg inline-block"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
