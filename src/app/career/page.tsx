'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Palette, Code, Handshake, Phone } from 'lucide-react';

export default function CareerPage() {
  return (
    <div className="container py-12 px-4 md:px-8 max-w-4xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">
          PELUANG <span className="text-primary">KARIR</span>
        </h1>
        <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
      </section>

      <div className="space-y-8">
        <p className="font-subheadline text-lg md:text-xl text-center leading-relaxed text-foreground/80 mb-12">
          Halaman ini didedikasikan untuk menjembatani talenta muda SMK-IT As-Syifa dengan dunia industri. Kami menyiapkan lulusan untuk menempati posisi strategis seperti:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8">
              <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-headline text-lg font-black text-primary mb-4 uppercase tracking-tighter">Creative Division</h3>
              <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                Graphic Designer, UI/UX Designer, Video Editor, & Creative Content Creator, dll.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-8">
              <div className="bg-accent/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <Code className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-headline text-lg font-black text-accent mb-4 uppercase tracking-tighter">Technical Division</h3>
              <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                Web Developer, Full-stack Programmer, & Software Quality Assurance, dll.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="bg-muted w-16 h-16 rounded-2xl flex items-center justify-center shrink-0">
                <Handshake className="h-8 w-8 text-foreground" />
              </div>
              <div>
                <h3 className="font-headline text-lg font-black text-foreground mb-4 uppercase tracking-tighter">Kemitraan Industri</h3>
                <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                  Kami membuka peluang kolaborasi bagi perusahaan untuk program Praktik Kerja Lapangan (PKL), kunjungan industri, serta rekrutmen lulusan (Bursa Kerja Khusus).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 p-10 bg-primary rounded-3xl text-white shadow-2xl shadow-primary/30 flex flex-col items-center text-center">
          <Phone className="h-10 w-10 mb-6" />
          <h2 className="font-headline text-2xl font-black mb-2 uppercase tracking-tighter">Hubungi Kami</h2>
          <p className="font-subheadline text-3xl font-black tracking-tighter mb-4">081386410422</p>
          <p className="font-subheadline text-sm opacity-80 uppercase tracking-widest font-bold">Informasi Lebih Lanjut & Kolaborasi</p>
        </div>
      </div>
    </div>
  );
}
