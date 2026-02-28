'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Search, Upload, LogOut, Settings, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setSearchValue(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-md mx-8">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input 
        placeholder="Cari karya, kreator..." 
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="flex h-10 w-full rounded-full border border-input bg-muted/40 px-3 py-2 text-sm pl-10 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-primary/20 font-subheadline" 
      />
    </form>
  );
}

function MobileSearchInput({ onSearchComplete }: { onSearchComplete: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setSearchValue(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push('/');
    }
    onSearchComplete();
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input 
        placeholder="Cari karya, kreator..." 
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="flex h-12 w-full rounded-full border border-input bg-muted/40 px-4 py-2 text-sm pl-11 focus:bg-white outline-none font-subheadline" 
      />
    </form>
  );
}

export default function Header() {
  const { user, userProfile, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const isLoggedIn = !loading && user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center">
            <span className="font-black font-headline text-xl md:text-2xl tracking-tighter text-primary">PORTOFOLIX</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-bold uppercase tracking-wider">
            <Link href="/" className="transition-colors hover:text-primary text-foreground/70">Jelajahi</Link>
            <Link href="/about" className="transition-colors hover:text-primary text-foreground/70">Tentang</Link>
          </nav>
        </div>

        <Suspense fallback={<div className="hidden md:block flex-1 max-w-md mx-8 h-10 bg-muted/20 rounded-full" />}>
          <SearchInput />
        </Suspense>

        <div className="flex items-center space-x-2 md:space-x-3">
          {isLoggedIn && userProfile ? (
            <>
              <Link href="/upload" className="hidden sm:block">
                <Button className="rounded-full px-6 shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-xs h-10 font-subheadline">
                  <Upload className="mr-2 h-4 w-4" />
                  Unggah
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-primary/10 p-0 overflow-hidden hover:border-primary/40 transition-colors">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={userProfile.avatarUrl ?? ''} alt={userProfile.name ?? 'User avatar'} />
                      <AvatarFallback className="bg-primary/5 text-primary font-bold">{userProfile.name?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 rounded-2xl p-2 shadow-xl border-none font-subheadline" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{userProfile.name}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        @{userProfile.username}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-muted/50" />
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5 font-bold uppercase text-[10px] tracking-widest">
                    <Link href={`/profile/${userProfile.username}`} className="w-full flex items-center">
                      <User className="mr-2 h-4 w-4 text-primary" />
                      Profil Saya
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5 font-bold uppercase text-[10px] tracking-widest">
                    <Link href="/settings" className="w-full flex items-center">
                      <Settings className="mr-2 h-4 w-4 text-primary" />
                      Pengaturan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-muted/50" />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/5 rounded-xl cursor-pointer py-2.5 font-bold uppercase text-[10px] tracking-widest">
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            !loading && (
              <Link href="/auth">
                <Button variant="outline" className="rounded-full px-6 md:px-8 border-primary/30 hover:bg-primary/5 font-bold transition-all uppercase tracking-widest text-xs h-10 font-subheadline">Masuk</Button>
              </Link>
            )
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white p-4 space-y-4 animate-in slide-in-from-top duration-300 font-subheadline shadow-xl">
          <Suspense fallback={<div className="h-12 w-full bg-muted/20 rounded-full" />}>
            <MobileSearchInput onSearchComplete={() => setIsMobileMenuOpen(false)} />
          </Suspense>
          <nav className="flex flex-col space-y-1 font-bold uppercase text-xs tracking-widest">
            <Link href="/" className="p-4 hover:bg-muted/50 rounded-2xl flex items-center transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Jelajahi
            </Link>
            <Link href="/about" className="p-4 hover:bg-muted/50 rounded-2xl flex items-center transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Tentang Kami
            </Link>
            {isLoggedIn && (
               <Link href="/upload" className="p-4 hover:bg-muted/50 rounded-2xl flex items-center text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                 <Upload className="mr-3 h-4 w-4" />
                 Unggah Karya
               </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
