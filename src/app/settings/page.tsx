'use client';

import { useUser } from '@/firebase';
import EditProfileForm from '@/components/edit-profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { user, userProfile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);

  if (loading || !userProfile) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-12">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold">Pengaturan Akun</h1>
        <p className="text-muted-foreground mt-2">Kelola informasi profil dan tampilan publik Anda.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil Publik</CardTitle>
          <CardDescription>Informasi ini akan ditampilkan kepada pengguna lain di platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditProfileForm 
            userProfile={userProfile} 
            onFinished={() => router.push(`/profile/${userProfile.username}`)} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
