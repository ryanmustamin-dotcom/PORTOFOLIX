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
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const firestore = useFirestore();
  const { user: currentUser, userProfile: currentUserProfile, loading: loadingCurrentUser } = useUser();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
    return firestoreUserProjects;
  }, [user, firestoreUserProjects]);

  const isLoadingProjects = user?.uid.startsWith('sample-') ? false : loadingProjects;

  const isOwnProfile = !loadingCurrentUser && currentUser?.uid === user?.uid && !user?.uid.startsWith('sample-');

  const isFollowing = useMemo(() => {
    return currentUserProfile?.following?.includes(user?.uid ?? '') ?? false;
  }, [currentUserProfile, user]);

  const handleFollow = async () => {
    if (!currentUser || !user) {
      toast({ variant: 'destructive', title: 'Please log in to follow users.' });
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
        toast({ title: `Unfollowed ${user.name}` });
      } else {
        // Follow
        await updateDoc(currentUserRef, { following: arrayUnion(user.uid) });
        await updateDoc(targetUserRef, { followers: arrayUnion(currentUser.uid) });
        toast({ title: `Followed ${user.name}` });
      }
    } catch (error) {
      console.error('Error following user:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not complete action.' });
    }
  };

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin inline-block mb-4" />
          <p className="text-lg text-muted-foreground">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  
  const SocialLink = ({ href, icon, children }: { href?: string, icon: React.ReactNode, children: React.ReactNode }) => {
    if (!href) return null;
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-primary">
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
      <Card className="mb-8 overflow-hidden">
        <div className="h-48 md:h-64 bg-muted-foreground/20 relative">
          <Image src={user.headerUrl || "https://picsum.photos/seed/headerbg/1200/400"} alt="Profile banner" fill style={{objectFit:"cover"}} data-ai-hint="abstract background" />
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-20 relative z-10">
            <Avatar className="h-32 w-32 border-4 border-background shrink-0">
              <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name ?? ''} />
              <AvatarFallback>{user.name?.slice(0, 2).toUpperCase() ?? '??'}</AvatarFallback>
            </Avatar>
            <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
              <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
              <p className="text-lg text-muted-foreground">@{user.username}</p>
              {user.status && <p className="text-md font-semibold text-primary mt-1">{user.status}</p>}
              <div className="flex items-center space-x-4 text-muted-foreground mt-2">
                {user.location && (
                    <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                    </div>
                )}
                 <div className="flex items-center space-x-1">
                    <span><span className="font-bold text-foreground">{user.following?.length || 0}</span> Following</span>
                </div>
                 <div className="flex items-center space-x-1">
                    <span><span className="font-bold text-foreground">{user.followers?.length || 0}</span> Followers</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0 self-start md:self-end shrink-0">
              {isOwnProfile ? (
                <Button onClick={() => setIsEditDialogOpen(true)}>Edit Profile</Button>
              ) : (
                <>
                  <Button onClick={handleFollow} variant={isFollowing ? 'secondary' : 'default'}>
                    {isFollowing ? (
                        <>
                            <Check className="h-4 w-4 mr-2" />
                            Following
                        </>
                    ) : (
                        <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Follow
                        </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="work" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="work">Work</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="work">
          {isLoadingProjects && (
            <div className="flex justify-center items-center py-16">
                 <Loader2 className="h-8 w-8 animate-spin" />
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
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold text-muted-foreground">No projects yet</h3>
                <p className="text-muted-foreground mt-2">This user hasn't uploaded any projects.</p>
              </div>
            )
          )}
        </TabsContent>
        <TabsContent value="about">
          <Card>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="font-headline text-xl font-semibold mb-4">About Me</h2>
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{user.bio || 'This user has not written a bio yet.'}</p>
                </div>
                <div>
                     <h2 className="font-headline text-xl font-semibold mb-4">On the web</h2>
                     <div className="space-y-3 text-muted-foreground">
                        <SocialLink href={user.socialLinks?.twitter} icon={<Twitter className="h-5 w-5" />}>Twitter</SocialLink>
                        <SocialLink href={user.socialLinks?.instagram} icon={<Instagram className="h-5 w-5" />}>Instagram</SocialLink>
                        <SocialLink href={user.socialLinks?.github} icon={<Github className="h-5 w-5" />}>GitHub</SocialLink>
                     </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
