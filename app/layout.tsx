
import './globals.css'
import AuthSessionProvider from '@/components/session-provider';

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