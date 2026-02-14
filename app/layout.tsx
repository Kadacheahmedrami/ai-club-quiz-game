
import './globals.css'
import type { Metadata } from 'next';
import AuthSessionProvider from '@/components/session-provider';

export const metadata: Metadata = {
  title: 'AI Club Quiz Game - Test Your AI Knowledge',
  description: 'Challenge yourself with our interactive quiz about Artificial Intelligence. Join the Bejaia School of AI Club and test your knowledge today!',
  keywords: ['AI Quiz', 'Artificial Intelligence', 'Machine Learning', 'Bejaia School of AI Club'],
  authors: [{ name: 'Bejaia School of AI Club' }],
  creator: 'Bejaia School of AI Club',
  publisher: 'Bejaia School of AI Club',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://school-of-ai.estin.pro'),
  openGraph: {
    title: 'AI Club Quiz Game - Test Your AI Knowledge',
    description: 'Challenge yourself with our interactive quiz about Artificial Intelligence. Join the Bejaia School of AI Club and test your knowledge today!',
    url: 'https://school-of-ai.estin.pro',
    siteName: 'AI Club Quiz Game',
    images: [
      {
        url: 'https://school-of-ai.estin.pro/cover.png',
        width: 1200,
        height: 630,
        alt: 'AI Club Quiz Game Cover Image',
      },
    ],
    locale: 'en_DZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School of AI QUIZ Game - Test Your AI Knowledge And Win Prizes !',
    description: 'Challenge yourself with our interactive quiz about Artificial Intelligence. Join the Bejaia School of AI Club and test your knowledge today!',
    images: ['https://school-of-ai.estin.pro/cover.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://school-of-ai.estin.pro',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white relative min-h-screen">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <img
            src="/bg.webp"
            alt="background"
            className="w-full h-full md:translate-y-0 -translate-y-1/4  object-cover"
          />
          {/* Dark overlay to improve text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <AuthSessionProvider>
          <main className="relative z-10">
            {children}
          </main>
        </AuthSessionProvider>
      </body>
    </html>
  );
}