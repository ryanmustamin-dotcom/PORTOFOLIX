'use client';

import Link from 'next/link';
import { Search, Upload, Palette, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, userProfile, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const isLoggedIn = !loading && user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Palette className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">PORTOFOLIX</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">Discover</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between gap-4">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <Palette className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline text-lg">PORTOFOLIX</span>
            </Link>
            <div className="relative flex-1 md:flex-none md:w-64 lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search projects, artists..." className="pl-9 w-full" />
            </div>
            <div className="flex items-center space-x-2">
            <Link href="/upload">
              <Button>
                <Upload className="mr-0 md:mr-2 h-4 w-4" />
                <span className="hidden md:inline">Upload</span>
              </Button>
            </Link>
            {isLoggedIn && userProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile.avatarUrl ?? ''} alt={userProfile.name ?? 'User avatar'} />
                      <AvatarFallback>{userProfile.name?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userProfile.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userProfile.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${userProfile.username}`} className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="outline">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
