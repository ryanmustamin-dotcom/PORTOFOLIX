'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="font-headline text-6xl md:text-9xl font-black text-primary tracking-tighter mb-4">404</h1>
      <h2 className="font-headline text-xl md:text-2xl font-bold uppercase mb-6">Halaman Tidak Ditemukan</h2>
      <p className="font-subheadline text-muted-foreground max-w-md mb-8">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan ke lokasi lain.
      </p>
      <Link href="/">
        <Button className="rounded-full px-8 py-6 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
          Kembali ke Beranda
        </Button>
      </Link>
    </div>
  );
}
