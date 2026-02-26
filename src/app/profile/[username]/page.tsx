'use client';

import { useEffect, useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useFirestore, useUser, useCollection } from '@/firebase';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import type { UserProfile, Project } from '@/lib/types';
import { sampleUsers, sampleProjects } from '@/lib/sample-data';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectCard from '@/components/project-card';
import { Mail, MapPin, UserPlus, Loader2, Check, Twitter, Instagram, Github } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import EditProfileDialog from '@/components/edit-profile-dialog';
import MessageDialog from '@/components/message-dialog';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const firestore = useFirestore();
  const { user: currentUser, userProfile: currentUserProfile, loading: loadingCurrentUser } = useUser();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      if (!params.username) return;
      setLoadingUser(true);
      try {
        if (firestore) {
            const usersRef = collection(firestore, 'users');
            const q = query(usersRef, where('username', '==', params.username));
            
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              setUser({...(userDoc.data() as UserProfile), uid: userDoc.id});
              setLoadingUser(false);
              return;
            }
        }
        
        const sampleUser = sampleUsers.find(u => u.username === params.username);
        if (sampleUser) {
          setUser(sampleUser);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        const sampleUser = sampleUsers.find(u => u.username === params.username);
        if (sampleUser) {
            setUser(sampleUser);
        } else {
            notFound();
        }
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [firestore, params.username]);

  const userProjectsQuery = useMemo(() => {
    if (!firestore || !user || user.uid.startsWith('sample-')) return null;
    return query(collection(firestore, 'projects'), where('creator.uid', '==', user.uid), orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: firestoreUserProjects, loading: loadingProjects } = useCollection<Project>(userProjectsQuery);

  const userProjects = useMemo(() => {
    if (user?.uid.startsWith('sample-')) {
      return sampleProjects.filter(p => p.creator.uid === user.uid);
    }
    return firestoreUserProjects || [];
  }, [user, firestoreUserProjects]);

  const isLoadingProjects = user?.uid.startsWith('sample-') ? false : loadingProjects;

  const isOwnProfile = !loadingCurrentUser && currentUser?.uid === user?.uid && !user?.uid.startsWith('sample-');

  const isFollowing = useMemo(() => {
    return currentUserProfile?.following?.includes(user?.uid ?? '') ?? false;
  }, [currentUserProfile, user]);

  const handleFollow = async () => {
    if (!currentUser || !user) {
      toast({ variant: 'destructive', title: 'Silakan masuk untuk mengikuti pengguna.' });
      return;
    }
    if (isOwnProfile) return;

    const currentUserRef = doc(firestore, 'users', currentUser.uid);
    const targetUserRef = doc(firestore, 'users', user.uid);

    try {
      if (isFollowing) {
        // Unfollow
        await updateDoc(currentUserRef, { following: arrayRemove(user.uid) });
        await updateDoc(targetUserRef, { followers: arrayRemove(currentUser.uid) });
        toast({ title: `Berhenti mengikuti ${user.name}` });
      } else {
        // Follow
        await updateDoc(currentUserRef, { following: arrayUnion(user.uid) });
        await updateDoc(targetUserRef, { followers: arrayUnion(currentUser.uid) });
        toast({ title: `Berhasil mengikuti ${user.name}` });
      }
    } catch (error) {
      console.error('Error following user:', error);
      toast({ variant: 'destructive', title: 'Gagal melakukan aksi ini.' });
    }
  };

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary inline-block mb-4" />
          <p className="font-headline text-lg text-muted-foreground uppercase tracking-widest font-black">Memuat Profil...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  
  const SocialLink = ({ href, icon, children }: { href?: string, icon: React.ReactNode, children: React.ReactNode }) => {
    if (!href) return null;
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-primary transition-colors font-subheadline text-xs tracking-widest font-bold uppercase">
        {icon}
        <span>{children}</span>
      </Link>
    )
  }

  return (
    <div className="container py-8">
      {isOwnProfile && user && (
        <EditProfileDialog 
            userProfile={user}
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
        />
      )}
      
      {user && (
        <MessageDialog 
          receiverUid={user.uid}
          receiverName={user.name || ''}
          isOpen={isMessageDialogOpen}
          onOpenChange={setIsMessageDialogOpen}
        />
      )}

      <Card className="mb-8 overflow-hidden border-none shadow-xl bg-white rounded-3xl">
        <div className="h-48 md:h-64 bg-muted relative">
          <Image 
            src={user.headerUrl || "https://picsum.photos/seed/headerbg/1200/400"} 
            alt="Profile banner" 
            fill 
            className="object-cover" 
            data-ai-hint="abstract background" 
          />
        </div>
        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="-mt-16 md:-mt-20 relative z-10 shrink-0">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-xl">
                <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name ?? ''} />
                <AvatarFallback className="text-2xl font-headline font-black">{user.name?.slice(0, 2).toUpperCase() ?? '??'}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-grow pt-4 md:pt-0">
              <h1 className="font-headline text-3xl font-black tracking-tighter uppercase">{user.name}</h1>
              <p className="font-subheadline text-lg text-muted-foreground uppercase tracking-tight font-medium">@{user.username}</p>
              {user.status && <p className="font-subheadline text-xs font-black text-primary mt-1 tracking-widest uppercase">{user.status}</p>}
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground mt-3 font-subheadline text-[10px] tracking-widest uppercase font-bold">
                {user.location && (
                    <div className="flex items-center space-x-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                    </div>
                )}
                 <div className="flex items-center space-x-1.5">
                    <span><span className="font-black text-foreground">{user.following?.length || 0}</span> Mengikuti</span>
                </div>
                 <div className="flex items-center space-x-1.5">
                    <span><span className="font-black text-foreground">{user.followers?.length || 0}</span> Pengikut</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4 md:mt-0 self-start md:self-end shrink-0 pb-1">
              {isOwnProfile ? (
                <Button onClick={() => setIsEditDialogOpen(true)} className="rounded-full px-8 py-6 font-bold tracking-widest uppercase shadow-lg shadow-primary/20">Edit Profil</Button>
              ) : (
                <>
                  <Button onClick={handleFollow} variant={isFollowing ? 'secondary' : 'default'} className="rounded-full px-8 py-6 font-bold tracking-widest uppercase shadow-lg">
                    {isFollowing ? (
                        <><Check className="h-4 w-4 mr-2" /> Mengikuti</>
                    ) : (
                        <><UserPlus className="h-4 w-4 mr-2" /> Ikuti</>
                    )}
                  </Button>
                  <Button variant="outline" className="rounded-full px-8 py-6 font-bold tracking-widest uppercase" onClick={() => setIsMessageDialogOpen(true)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Pesan
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="work" className="w-full">
        <TabsList className="mb-8 bg-muted/50 p-1 rounded-full w-fit">
          <TabsTrigger value="work" className="rounded-full px-10 py-2 font-subheadline text-xs tracking-widest uppercase font-bold">Karya</TabsTrigger>
          <TabsTrigger value="about" className="rounded-full px-10 py-2 font-subheadline text-xs tracking-widest uppercase font-bold">Tentang</TabsTrigger>
        </TabsList>
        
        <TabsContent value="work">
          {isLoadingProjects && (
            <div className="flex justify-center items-center py-16">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isLoadingProjects && userProjects && userProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {userProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            !isLoadingProjects && (
              <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-muted/5">
                <h3 className="text-xl font-black text-muted-foreground font-headline tracking-tighter uppercase">Belum ada karya</h3>
                <p className="font-subheadline text-xs tracking-widest font-bold text-muted-foreground mt-2 uppercase">Kreator ini belum mengunggah proyek apapun.</p>
              </div>
            )
          )}
        </TabsContent>
        
        <TabsContent value="about">
          <Card className="border-none shadow-lg rounded-3xl">
            <CardContent className="p-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                    <h2 className="font-subheadline text-xl font-black mb-6 text-primary tracking-tighter uppercase">Biografi</h2>
                    <p className="text-foreground/80 text-lg leading-relaxed whitespace-pre-wrap font-subheadline">{user.bio || 'Pengguna ini belum menulis biografi.'}</p>
                </div>
                <div>
                     <h2 className="font-subheadline text-xl font-black mb-6 text-primary tracking-tighter uppercase">Media Sosial</h2>
                     <div className="space-y-5 text-muted-foreground">
                        <SocialLink href={user.socialLinks?.twitter} icon={<Twitter className="h-5 w-5" />}>Twitter</SocialLink>
                        <SocialLink href={user.socialLinks?.instagram} icon={<Instagram className="h-5 w-5" />}>Instagram</SocialLink>
                        <SocialLink href={user.socialLinks?.github} icon={<Github className="h-5 w-5" />}>GitHub</SocialLink>
                        {!user.socialLinks?.twitter && !user.socialLinks?.instagram && !user.socialLinks?.github && (
                          <p className="font-subheadline text-[10px] tracking-widest uppercase font-bold text-muted-foreground/50">Tidak ada tautan tersedia.</p>
                        )}
                     </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
