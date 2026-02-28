'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="container py-12 px-4 md:px-8 max-w-4xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">
          KEBIJAKAN <span className="text-primary">PRIVASI</span>
        </h1>
        <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
      </section>

      <Card className="border-none shadow-2xl overflow-hidden rounded-3xl bg-white">
        <CardContent className="p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-muted">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-headline text-xl font-black tracking-tighter uppercase">
              Perlindungan Data Pengguna
            </h2>
          </div>

          <div className="space-y-10">
            <p className="font-subheadline text-lg md:text-xl leading-relaxed text-foreground/80">
              Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat mengakses situs web kami.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted/30 p-6 rounded-2xl border-l-4 border-primary">
                <h3 className="font-headline text-sm font-black text-primary mb-3 uppercase tracking-tighter">Data yang Dikumpulkan</h3>
                <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                  Kami hanya mengumpulkan informasi yang diberikan secara sukarela melalui formulir kontak atau pendaftaran program.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-2xl border-l-4 border-accent">
                <h3 className="font-headline text-sm font-black text-accent mb-3 uppercase tracking-tighter">Penggunaan Informasi</h3>
                <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                  Data digunakan untuk tujuan administrasi akademik, layanan informasi sekolah, dan peningkatan pengalaman pengguna.
                </p>
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl border-l-4 border-foreground">
              <h3 className="font-headline text-sm font-black text-foreground mb-3 uppercase tracking-tighter">Keamanan</h3>
              <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                Kami menerapkan standar keamanan digital untuk memastikan data Anda tidak disalahgunakan atau diakses oleh pihak yang tidak berwenang.
              </p>
            </div>
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
