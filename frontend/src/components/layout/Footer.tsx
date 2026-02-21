import Link from 'next/link';
import { Brain } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            <span className="text-white font-semibold">Learnzy</span>
            <span className="text-sm">— Adaptive Learning for Every Mind</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Learnzy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
