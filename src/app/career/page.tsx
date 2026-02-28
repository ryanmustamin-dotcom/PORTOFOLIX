'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Users, Phone } from 'lucide-react';

export default function CareerPage() {
  return (
    <div className="container py-12 px-4 md:px-8 max-w-4xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">
          PELUANG <span className="text-primary">KARIR</span>
        </h1>
        <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
      </section>

      <Card className="border-none shadow-2xl overflow-hidden rounded-3xl bg-white">
        <CardContent className="p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-muted">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-headline text-xl font-black tracking-tighter uppercase">
              Menjembatani Talenta Muda
            </h2>
          </div>

          <div className="space-y-10">
            <p className="font-subheadline text-lg md:text-xl leading-relaxed text-foreground/80">
              Halaman ini didedikasikan untuk menjembatani talenta muda SMK-IT As-Syifa dengan dunia industri. Kami menyiapkan lulusan untuk menempati posisi strategis seperti:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted/30 p-6 rounded-2xl border-l-4 border-primary">
                <h3 className="font-headline text-sm font-black text-primary mb-3 uppercase tracking-tighter">Creative Division</h3>
                <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                  Graphic Designer, UI/UX Designer, Video Editor, & Creative Content Creator, dll.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-2xl border-l-4 border-accent">
                <h3 className="font-headline text-sm font-black text-accent mb-3 uppercase tracking-tighter">Technical Division</h3>
                <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                  Web Developer, Full-stack Programmer, & Software Quality Assurance, dll.
                </p>
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl border-l-4 border-foreground">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-foreground" />
                <h3 className="font-headline text-sm font-black text-foreground uppercase tracking-tighter">Kemitraan Industri</h3>
              </div>
              <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                Kami membuka peluang kolaborasi bagi perusahaan untuk program Praktik Kerja Lapangan (PKL), kunjungan industri, serta rekrutmen lulusan (Bursa Kerja Khusus).
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-primary/5 rounded-3xl border border-primary/10">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="h-5 w-5 text-primary" />
                <p className="font-headline text-xs font-black text-primary tracking-widest uppercase">Kontak Informasi</p>
              </div>
              <p className="font-subheadline text-2xl font-black text-foreground tracking-tighter">
                081386410422
              </p>
              <p className="font-subheadline text-xs text-muted-foreground mt-2 uppercase tracking-widest font-bold">
                Hubungi kami untuk informasi lebih lanjut
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
