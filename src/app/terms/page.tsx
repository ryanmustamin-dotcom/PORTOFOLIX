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
              Ketentuan Penggunaan
            </h2>
          </div>

          <div className="space-y-10">
            <p className="font-subheadline text-lg md:text-xl leading-relaxed text-foreground/80">
              Dengan mengakses situs web SMK-IT As-Syifa Boarding School, Anda menyetujui ketentuan berikut:
            </p>

            <div className="grid grid-cols-1 gap-8">
              <div className="bg-muted/30 p-6 rounded-2xl border-l-4 border-primary">
                <h3 className="font-headline text-sm font-black text-primary mb-3 uppercase tracking-tighter">Hak Kekayaan Intelektual</h3>
                <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                  Seluruh konten visual (desain, foto, video) dan kode program di situs ini adalah milik SMK-IT As-Syifa atau pihak ketiga yang memberikan lisensi. Penggunaan tanpa izin untuk tujuan komersial sangat dilarang.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-2xl border-l-4 border-accent">
                <h3 className="font-headline text-sm font-black text-accent mb-3 uppercase tracking-tighter">Penggunaan Situs</h3>
                <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                  Pengguna dilarang menggunakan situs ini untuk tindakan yang melanggar hukum atau merusak infrastruktur digital sekolah.
                </p>
              </div>

              <div className="bg-muted/30 p-6 rounded-2xl border-l-4 border-foreground">
                <h3 className="font-headline text-sm font-black text-foreground mb-3 uppercase tracking-tighter">Batasan Tanggung Jawab</h3>
                <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                  Kami berupaya menyediakan informasi yang akurat, namun tidak bertanggung jawab atas kerugian yang timbul akibat kesalahan teknis pada perangkat pengguna saat mengakses situs.
                </p>
              </div>
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
