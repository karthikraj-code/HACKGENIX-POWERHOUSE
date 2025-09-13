
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';
import { TechNewsBot } from '@/components/tech-news-bot';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { GlobalErrorHandler } from '@/components/global-error-handler';

export const metadata: Metadata = {
  title: 'TechNav',
  description: 'Start smart. Learn faster.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
  <body suppressHydrationWarning={true} className={cn('font-body antialiased min-h-screen flex flex-col')}>
  <GlobalErrorHandler />
  {user && <Header session={{ user }} />}
  <main className="flex-1">{children}</main>
  <Toaster />
  {user && <TechNewsBot />}
</body>

    </html>
  );
}
