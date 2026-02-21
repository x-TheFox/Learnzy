'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, User, Palette, Type, Accessibility, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';

type FontSize = 'small' | 'medium' | 'large' | 'x-large';
type FontFamily = 'default' | 'opendyslexic' | 'arial' | 'comic-sans';
type ColorTheme = 'default' | 'high-contrast' | 'cream' | 'blue';

export default function ProfilePage() {
  const { firebaseUser, dbUser, loading } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [adhd, setAdhd] = useState(false);
  const [dyslexia, setDyslexia] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [fontFamily, setFontFamily] = useState<FontFamily>('default');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('default');
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (!loading && !firebaseUser) router.push('/login');
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    if (dbUser) {
      setDisplayName(dbUser.displayName || '');
      setGradeLevel(dbUser.profile?.gradeLevel || '');
      setAdhd(dbUser.profile?.conditions?.adhd ?? false);
      setDyslexia(dbUser.profile?.conditions?.dyslexia ?? false);
      setFontSize((dbUser.profile?.learningPreferences?.fontSize as FontSize) || 'medium');
      setFontFamily((dbUser.profile?.learningPreferences?.fontFamily as FontFamily) || 'default');
      setColorTheme((dbUser.profile?.learningPreferences?.colorTheme as ColorTheme) || 'default');
      setTextToSpeech(dbUser.profile?.learningPreferences?.textToSpeech ?? false);
      setHighContrast(dbUser.profile?.learningPreferences?.highContrast ?? false);
    }
  }, [dbUser]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/users/me', {
        displayName,
        'profile.gradeLevel': gradeLevel,
        'profile.conditions.adhd': adhd,
        'profile.conditions.dyslexia': dyslexia,
        'profile.learningPreferences.fontSize': fontSize,
        'profile.learningPreferences.fontFamily': fontFamily,
        'profile.learningPreferences.colorTheme': colorTheme,
        'profile.learningPreferences.textToSpeech': textToSpeech,
        'profile.learningPreferences.highContrast': highContrast,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // error handled silently
    } finally {
      setSaving(false);
    }
  };

  if (loading || !firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-7 h-7 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">Profile &amp; Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-indigo-500" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Level
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select grade</option>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
                <option value="college">College</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={firebaseUser.email || ''}
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Learning Needs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Accessibility className="w-5 h-5 text-purple-500" />
            Learning Needs
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={adhd}
                onChange={(e) => setAdhd(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">I have ADHD</p>
                <p className="text-xs text-gray-400">
                  Enables focus timers, shorter sessions, and minimal distractions
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dyslexia}
                onChange={(e) => setDyslexia(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">I have dyslexia</p>
                <p className="text-xs text-gray-400">
                  Enables dyslexia-friendly fonts, text spacing, and color overlays
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Display Preferences */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Type className="w-5 h-5 text-blue-500" />
            Reading &amp; Display
          </h2>
          <div className="space-y-5">
            {/* Font size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
              <div className="flex gap-2">
                {(['small', 'medium', 'large', 'x-large'] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                      fontSize === size
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Font family */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: 'default', label: 'Default' },
                  { value: 'opendyslexic', label: 'OpenDyslexic' },
                  { value: 'arial', label: 'Arial' },
                  { value: 'comic-sans', label: 'Comic Sans' },
                ] as { value: FontFamily; label: string }[]).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setFontFamily(value)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      fontFamily === value
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color Theme
              </label>
              <div className="flex gap-2">
                {([
                  { value: 'default', label: 'Default', preview: 'bg-white border-gray-200' },
                  { value: 'cream', label: 'Cream', preview: 'bg-amber-50 border-amber-200' },
                  { value: 'blue', label: 'Blue', preview: 'bg-blue-50 border-blue-200' },
                  { value: 'high-contrast', label: 'High Contrast', preview: 'bg-black border-gray-700' },
                ] as { value: ColorTheme; label: string; preview: string }[]).map(
                  ({ value, label, preview }) => (
                    <button
                      key={value}
                      onClick={() => setColorTheme(value)}
                      title={label}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${preview} ${
                        colorTheme === value ? 'border-indigo-600 scale-110' : ''
                      }`}
                    />
                  )
                )}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-700">
                  Enable Text-to-Speech by default
                </span>
                <div
                  onClick={() => setTextToSpeech(!textToSpeech)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    textToSpeech ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      textToSpeech ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-700">High Contrast Mode</span>
                <div
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    highContrast ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      highContrast ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-colors ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60'
            }`}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
