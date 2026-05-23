
import './globals.css'
import type { Metadata } from 'next';
import AuthSessionProvider from '@/components/session-provider';

export const metadata: Metadata = {
  title: 'School of AI Algeria - Quiz Game',
  description: 'Challenge yourself with our interactive quiz about Algeria. Join the Bejaia School of AI Club and test your knowledge today!',
  keywords: ['Algeria Quiz', 'School of AI', 'Bejaia School of AI Club', 'Algerian Culture'],
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
    title: 'School of AI Algeria - Quiz Game',
    description: 'Challenge yourself with our interactive quiz about Algeria. Join the Bejaia School of AI Club and test your knowledge today!',
    url: 'https://school-of-ai.estin.pro',
    siteName: 'School of AI Quiz Game',
    images: [
      {
        url: 'https://school-of-ai.estin.pro/logo.svg',
        width: 1200,
        height: 630,
        alt: 'School of AI Algeria Quiz Game',
      },
    ],
    locale: 'en_DZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School of AI Algeria - Quiz Game',
    description: 'Challenge yourself with our interactive quiz about Algeria. Join the Bejaia School of AI Club and test your knowledge today!',
    images: ['https://school-of-ai.estin.pro/logo.svg'],
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
        <AuthSessionProvider>
          <main className="relative z-10">
            {children}
          </main>
        </AuthSessionProvider>
      </body>
    </html>
  );
}