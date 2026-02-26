import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-card mt-12">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <span className="font-bold font-headline text-lg text-primary">PORTOFOLIX</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">About</Link>
            <Link href="#" className="hover:text-primary">Careers</Link>
            <Link href="#" className="hover:text-primary">Press</Link>
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
          </nav>
          <p className="text-sm text-muted-foreground">&copy; {currentYear} PORTOFOLIX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
