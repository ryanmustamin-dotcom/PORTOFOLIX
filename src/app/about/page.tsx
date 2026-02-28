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
            src="https://picsum.photos/seed/dkv-school/1200/600"
            alt="DKV SMK-IT As-Syifa"
            fill
            className="object-cover"
            data-ai-hint="creative classroom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <p className="font-headline text-white text-xl font-bold tracking-widest uppercase">
              DKV SMK-IT As-Syifa Boarding School
            </p>
          </div>
        </div>
        <CardContent className="p-8 md:p-12">
          <div className="space-y-6">
            <p className="font-subheadline text-lg md:text-xl leading-relaxed text-foreground/80 first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left">
              Selamat datang di etalase kreatif Jurusan DKV SMK-IT As-Syifa Boarding School. Di bawah bimbingan tenaga pendidik yang berdedikasi, kami mengombinasikan ketajaman teknologi Multimedia dengan nilai-nilai adab.
            </p>
            <p className="font-subheadline text-lg md:text-xl leading-relaxed text-foreground/80">
              Sebagai guru pengampu jurusan DKV, misi kami adalah mencetak kreator muda yang tidak hanya mahir secara teknis dalam desain, video, dan fotografi, tetapi juga memiliki integritas tinggi.
            </p>
            <p className="font-subheadline text-lg md:text-xl leading-relaxed text-foreground/80">
              Di SMK-IT As-Syifa, kami percaya bahwa karya visual adalah media dakwah dan komunikasi yang sangat kuat di era digital.
            </p>
          </div>
          
          <div className="mt-12 pt-8 border-t border-muted flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="font-headline text-xs font-black text-primary tracking-widest uppercase mb-1">Lokasi</p>
              <p className="font-subheadline font-bold uppercase text-sm">Subang, Jawa Barat</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-headline text-xs font-black text-primary tracking-widest uppercase mb-1">Visi</p>
              <p className="font-subheadline font-bold uppercase text-sm">Kreativitas Berlandaskan Adab</p>
            </div>
            <div className="text-center md:text-left">
              <p className="font-headline text-xs font-black text-primary tracking-widest uppercase mb-1">Kontak</p>
              <p className="font-subheadline font-bold uppercase text-sm">info@assyifa-boardingschool.id</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
