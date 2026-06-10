'use client';

import { useRouter } from 'next/navigation';
import { Roboto_Mono } from 'next/font/google';

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
});

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050408] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">

        <div className="w-24 h-24 mx-auto mb-6 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.25)]">
          <span className="text-4xl">⚠</span>
        </div>

        <h1
          className={`${robotoMono.className} text-7xl font-bold text-purple-400 mb-4`}
        >
          404
        </h1>

        <h2 className="text-2xl font-bold text-white mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-400 mb-8">
          The page you are looking for does not exist or may have been moved.
        </p>

        <button
          onClick={() => router.back()}
          className="px-8 py-3 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)]"
        >
          ← Go Back
        </button>

      </div>
    </div>
  );
}