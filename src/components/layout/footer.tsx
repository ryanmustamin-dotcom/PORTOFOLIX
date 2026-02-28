import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-card mt-12">
      <div className="container py-8 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <span className="font-black font-headline text-lg text-primary tracking-tighter">PORTOFOLIX</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-bold font-subheadline uppercase tracking-widest">
            <Link href="/about" className="hover:text-primary transition-colors">Tentang</Link>
            <Link href="#" className="hover:text-primary transition-colors">Karir</Link>
            <Link href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
          </nav>
          <p className="text-xs font-subheadline font-bold text-muted-foreground uppercase tracking-wider">&copy; {currentYear} PORTOFOLIX. SMK-IT As-Syifa.</p>
        </div>
      </div>
    </footer>
  );
}
