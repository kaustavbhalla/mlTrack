import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Weekly Learning Tracker',
  description: 'A minimal two-person accountability tool for ML/DL/AI/Agents learning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${jakarta.variable} font-body bg-surface text-on-surface min-h-screen`}>
        <nav className="border-b border-outline-variant bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-xl font-semibold text-on-surface">
                  Weekly Learning Tracker
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="/goals"
                  className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Set Goals
                </a>
                <a
                  href="/calendar"
                  className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Calendar
                </a>
                <a
                  href="/review"
                  className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Review
                </a>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
