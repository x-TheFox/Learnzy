'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Brain,
  LayoutDashboard,
  LogOut,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/quiz', label: 'Quizzes', icon: Brain },
  { href: '/reading', label: 'Reading', icon: BookOpen },
  { href: '/profile', label: 'Settings', icon: Settings },
];

export default function Navbar() {
  const { firebaseUser, dbUser, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Brain className="w-6 h-6" />
            Learnzy
          </Link>

          {/* Desktop Nav */}
          {firebaseUser && (
            <div className="hidden md:flex items-center gap-6">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1 text-sm hover:text-indigo-200 transition-colors ${
                    pathname === href ? 'text-white font-semibold' : 'text-indigo-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-indigo-100 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}

          {!firebaseUser && (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm hover:text-indigo-200">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-white text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-50 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-700 px-4 pb-4">
          {firebaseUser ? (
            <>
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 py-2 text-indigo-100 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 py-2 text-indigo-100 hover:text-white w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block py-2 text-indigo-100"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="block py-2 text-indigo-100"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
