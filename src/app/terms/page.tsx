'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="container py-12 px-4 md:px-8 max-w-4xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">
          SYARAT & <span className="text-primary">KETENTUAN</span>
        </h1>
        <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
      </section>

      <Card className="border-none shadow-2xl overflow-hidden rounded-3xl bg-white">
        <CardContent className="p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-muted">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-headline text-xl font-black tracking-tighter uppercase">
              Aturan penggunaan aset di web
            </h2>
          </div>

          <div className="space-y-6">
            <p className="font-subheadline text-lg md:text-xl font-bold text-primary tracking-tight uppercase">
              Penting untuk DKV:
            </p>
            <p className="font-subheadline text-lg md:text-xl leading-relaxed text-foreground/80">
              Seluruh konten berupa desain, video, dan kode program yang ditampilkan di situs ini adalah hak kekayaan intelektual dari siswa dan pengajar SMK-IT As-Syifa Boarding School.
            </p>
            <p className="font-subheadline text-lg md:text-xl leading-relaxed text-foreground/80">
              Penggunaan karya untuk referensi pendidikan sangat diizinkan dengan mencantumkan sumber. Namun, dilarang keras menyalin atau mendistribusikan karya untuk kepentingan komersial tanpa izin tertulis dari pihak sekolah.
            </p>
          </div>
          
          <div className="mt-12 pt-8 border-t border-muted flex flex-col items-center">
            <p className="font-subheadline text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Update Terakhir: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
