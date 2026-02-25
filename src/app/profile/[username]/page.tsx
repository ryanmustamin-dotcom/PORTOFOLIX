'use client';

import { useEffect, useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useFirestore, useUser, useCollection } from '@/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { UserProfile, Project } from '@/lib/types';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectCard from '@/components/project-card';
import { Mail, MapPin, UserPlus, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import EditProfileDialog from '@/components/edit-profile-dialog';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const firestore = useFirestore();
  const { user: currentUser, loading: loadingCurrentUser } = useUser();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!firestore || !params.username) return;
      setLoadingUser(true);
      try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('username', '==', params.username));
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          notFound();
          return;
        }
        
        const userDoc = querySnapshot.docs[0];
        setUser({...(userDoc.data() as UserProfile), uid: userDoc.id});
      } catch (error) {
        console.error("Error fetching user:", error);
        notFound();
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [firestore, params.username]);

  const userProjectsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'projects'), where('creator.uid', '==', user.uid), orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: userProjects, loading: loadingProjects } = useCollection<Project>(userProjectsQuery);

  const isOwnProfile = !loadingCurrentUser && currentUser?.uid === user?.uid;

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

  return (
    <div className="container py-8">
      {isOwnProfile && (
        <EditProfileDialog 
            userProfile={user}
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
        />
      )}
      <Card className="mb-8 overflow-hidden">
        <div className="h-48 bg-muted-foreground/20 relative">
          <Image src="https://picsum.photos/seed/headerbg/1200/300" alt="Profile banner" fill style={{objectFit:"cover"}} data-ai-hint="abstract background" />
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-20 relative z-10">
            <Avatar className="h-32 w-32 border-4 border-background shrink-0">
              <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name ?? ''} />
              <AvatarFallback>{user.name?.slice(0, 2).toUpperCase() ?? '??'}</AvatarFallback>
            </Avatar>
            <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
              <h1 className="font-headline text-3xl font-bold">{user.name}</h1>
              <div className="flex items-center space-x-4 text-muted-foreground mt-1">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location || 'Location not set'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0 self-start md:self-end shrink-0">
              {isOwnProfile ? (
                <Button onClick={() => setIsEditDialogOpen(true)}>Edit Profile</Button>
              ) : (
                <>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
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
          {loadingProjects && (
            <div className="flex justify-center items-center py-16">
                 <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          {!loadingProjects && userProjects && userProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {userProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            !loadingProjects && (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold text-muted-foreground">No projects yet</h3>
                <p className="text-muted-foreground mt-2">This user hasn't uploaded any projects.</p>
              </div>
            )
          )}
        </TabsContent>
        <TabsContent value="about">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-headline text-xl font-semibold mb-4">About Me</h2>
              <p className="text-foreground/80 leading-relaxed">{user.bio || 'This user has not written a bio yet.'}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
