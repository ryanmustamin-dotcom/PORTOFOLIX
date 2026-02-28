'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container py-12 px-4 md:px-8 max-w-4xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">
          TENTANG <span className="text-primary">KAMI</span>
        </h1>
        <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
      </section>

      <Card className="border-none shadow-2xl overflow-hidden rounded-3xl bg-white">
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src="https://picsum.photos/seed/dkv-school-2/1200/600"
            alt="DKV SMK-IT As-Syifa"
            fill
            className="object-cover"
            data-ai-hint="modern school"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <p className="font-headline text-white text-xl font-bold tracking-widest uppercase">
              SMK-IT As-Syifa Boarding School
            </p>
          </div>
        </div>
        <CardContent className="p-8 md:p-12">
          <div className="space-y-8">
            <p className="font-subheadline text-lg md:text-xl leading-relaxed text-foreground/80">
              SMK-IT As-Syifa Boarding School adalah institusi pendidikan kejuruan berbasis teknologi informasi yang mengintegrasikan nilai-nilai Islam dengan kurikulum industri modern. Kami berfokus pada pengembangan talenta digital melalui dua program keahlian utama:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="bg-muted/30 p-6 rounded-2xl border-l-4 border-primary">
                <h3 className="font-headline text-sm font-black text-primary mb-3 uppercase tracking-tighter">1. Desain Komunikasi Visual (DKV)</h3>
                <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                  Menitikberatkan pada penguasaan media kreatif, desain grafis, fotografi, videografi, dan multimedia interaktif, dll.
                </p>
              </div>
              <div className="bg-muted/30 p-6 rounded-2xl border-l-4 border-accent">
                <h3 className="font-headline text-sm font-black text-accent mb-3 uppercase tracking-tighter">2. Rekayasa Perangkat Lunak (RPL)</h3>
                <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                  Berfokus pada pengembangan perangkat lunak, pemrograman web, aplikasi mobile, dan manajemen basis data, dll.
                </p>
              </div>
            </div>

            <p className="font-subheadline text-lg md:text-xl leading-relaxed text-foreground/80 pt-4">
              Sebagai bagian dari tenaga pendidik Multimedia di jurusan DKV, kami berkomitmen untuk mencetak lulusan yang kompeten secara teknis dan memiliki karakter kepemimpinan yang kuat di era digital.
            </p>
          </div>
          
          <div className="mt-12 pt-8 border-t border-muted flex flex-col items-center">
            <div className="text-center">
              <p className="font-headline text-xs font-black text-primary tracking-widest uppercase mb-1">Lokasi</p>
              <p className="font-subheadline font-bold uppercase text-sm">Subang, Jawa Barat</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
