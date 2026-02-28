'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, BookOpen, Mail, MessageSquare, Clock } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="container py-12 px-4 md:px-8 max-w-4xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">
          HALAMAN <span className="text-primary">BANTUAN</span>
        </h1>
        <p className="font-subheadline text-muted-foreground uppercase tracking-widest font-bold text-xs">Help Center</p>
        <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mt-4" />
      </section>

      <div className="space-y-12">
        {/* FAQ Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="font-headline text-xl font-black tracking-tighter uppercase">FAQ (Frequently Asked Questions)</h2>
          </div>
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-6 md:p-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b-muted">
                  <AccordionTrigger className="font-subheadline font-bold text-left hover:text-primary transition-colors py-4">
                    1. Apa saja jurusan yang tersedia di SMK-IT As-Syifa?
                  </AccordionTrigger>
                  <AccordionContent className="font-subheadline text-foreground/70 leading-relaxed pb-4">
                    Kami memiliki dua program keahlian unggulan: Desain Komunikasi Visual (DKV) yang berfokus pada media kreatif dan multimedia, serta Rekayasa Perangkat Lunak (RPL) yang berfokus pada pengembangan software dan pemrograman.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-b-muted">
                  <AccordionTrigger className="font-subheadline font-bold text-left hover:text-primary transition-colors py-4">
                    2. Bagaimana sistem pendidikan Boarding School di sini?
                  </AccordionTrigger>
                  <AccordionContent className="font-subheadline text-foreground/70 leading-relaxed pb-4">
                    Siswa tinggal di asrama dengan integrasi kurikulum sekolah menengah kejuruan dan pendidikan karakter berbasis Islam (pesantren) untuk mencetak tenaga profesional yang beradab.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-b-muted">
                  <AccordionTrigger className="font-subheadline font-bold text-left hover:text-primary transition-colors py-4">
                    3. Apakah lulusan bisa langsung bekerja?
                  </AccordionTrigger>
                  <AccordionContent className="font-subheadline text-foreground/70 leading-relaxed pb-4">
                    Ya. Kurikulum kami diselaraskan dengan kebutuhan industri kreatif, membekali siswa dengan portofolio nyata di dunia Desain Komunikasi Visual dan Rekayasa Perangkat Lunak.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-none">
                  <AccordionTrigger className="font-subheadline font-bold text-left hover:text-primary transition-colors py-4">
                    4. Bagaimana cara mengajukan kerja sama industri atau magang?
                  </AccordionTrigger>
                  <AccordionContent className="font-subheadline text-foreground/70 leading-relaxed pb-4">
                    Perusahaan dapat menghubungi kami melalui menu Contact Us atau mengirimkan proposal kerja sama ke email resmi sekolah.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Service Guide Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-accent" />
            <h2 className="font-headline text-xl font-black tracking-tighter uppercase">Panduan Layanan (Service Guide)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg rounded-3xl bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <h3 className="font-headline text-sm font-black text-primary mb-3 uppercase tracking-tighter">Penerimaan Siswa Baru</h3>
                <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                  Informasi alur pendaftaran, tes seleksi, dan persyaratan administrasi.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg rounded-3xl bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <h3 className="font-headline text-sm font-black text-accent mb-3 uppercase tracking-tighter">Akses Portofolio</h3>
                <p className="font-subheadline text-sm leading-relaxed text-foreground/70">
                  Panduan cara melihat dan mengunduh aset karya siswa untuk keperluan referensi atau rekrutmen.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-primary rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-primary/20">
          <h2 className="font-headline text-2xl font-black mb-6 tracking-tighter uppercase text-center">Hubungi Kami</h2>
          <p className="font-subheadline text-center mb-10 opacity-90">Jika pertanyaan Anda tidak terjawab di FAQ, silakan hubungi pusat bantuan kami di:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/10 p-3 rounded-2xl mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <p className="font-subheadline text-[10px] uppercase tracking-widest font-bold opacity-70 mb-1">Email</p>
              <p className="font-subheadline font-bold text-sm">assyifasmkit@gmail.com</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/10 p-3 rounded-2xl mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <p className="font-subheadline text-[10px] uppercase tracking-widest font-bold opacity-70 mb-1">WhatsApp</p>
              <p className="font-subheadline font-bold text-sm">+6281122223934</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/10 p-3 rounded-2xl mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <p className="font-subheadline text-[10px] uppercase tracking-widest font-bold opacity-70 mb-1">Jam Operasional</p>
              <p className="font-subheadline font-bold text-sm">Senin - Sabtu<br/>(08.00 - 15.00 WIB)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
