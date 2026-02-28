import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'PORTOFOLIX | Show, Connect, Inspire',
  description: 'Show, Connect, Inspire. Showcase your creative portfolio to the world.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-white">
        <FirebaseClientProvider>
          <Suspense fallback={<div className="h-16 border-b bg-white" />}>
            <Header />
          </Suspense>
          <main className="flex-grow">
            <Suspense fallback={
              <div className="flex justify-center items-center py-20">
                <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
            }>
              {children}
            </Suspense>
          </main>
          <Footer />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
