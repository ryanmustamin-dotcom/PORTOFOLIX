'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useDoc, useCollection, useFirestore, useUser } from '@/firebase';
import { doc, collection, query, where, limit, orderBy, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import type { Project, Comment } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageCircle, Send, UserPlus, Loader2 } from 'lucide-react';
import ProjectCard from '@/components/project-card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const projectRef = useMemo(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'projects', params.id);
  }, [firestore, params.id]);

  const { data: project, loading: loadingProject } = useDoc<Project>(projectRef);
  
  const commentsQuery = useMemo(() => {
    if (!firestore || !params.id) return null;
    return query(collection(firestore, 'projects', params.id, 'comments'), orderBy('createdAt', 'desc'));
  }, [firestore, params.id]);

  const { data: comments, loading: loadingComments } = useCollection<Comment>(commentsQuery);

  const userProjectsQuery = useMemo(() => {
      if (!firestore || !project) return null;
      return query(
          collection(firestore, 'projects'),
          where('creator.uid', '==', project.creator.uid),
          orderBy('createdAt', 'desc'),
          limit(4) // Fetch 4 and filter out the current one
      );
  }, [firestore, project]);

  const { data: userProjectsData, loading: loadingUserProjects } = useCollection<Project>(userProjectsQuery);

  const userProjects = userProjectsData?.filter(p => p.id !== project?.id).slice(0, 3) || [];

  const hasLiked = useMemo(() => {
    if (!user || !project?.likes) return false;
    return project.likes.includes(user.uid);
  }, [user, project]);

  const handleLike = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'You must be logged in to like a project.' });
      return;
    }
    if (!projectRef) return;

    try {
      if (hasLiked) {
        await updateDoc(projectRef, {
          likes: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(projectRef, {
          likes: arrayUnion(user.uid)
        });
      }
    } catch (error) {
      console.error("Error liking project:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update like status.' });
    }
  };


  if (loadingProject) {
      return (
        <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      )
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-9">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <Link href={`/profile/${project.creator.username}`} className="flex items-center space-x-3 group">
                  <Avatar>
                    <AvatarImage src={project.creator.avatarUrl || undefined} alt={project.creator.name || ''} />
                    <AvatarFallback>{project.creator.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="font-headline text-xl font-bold group-hover:text-primary">{project.title}</h1>
                    <p className="text-sm text-muted-foreground">{project.creator.name}</p>
                  </div>
                </Link>
                <div className="flex items-center space-x-2 shrink-0">
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                  <Button variant="default" size="sm">
                    Hire Me
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6">
                 <button onClick={handleLike} className="flex items-center space-x-1 focus:outline-none">
                  <Heart className={`h-4 w-4 ${hasLiked ? 'text-pink-500 fill-current' : ''}`} />
                  <span>{project.likes?.length || 0} Likes</span>
                </button>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{comments?.length || 0} Comments</span>
                </div>
                {project.createdAt && (
                    <span>Published on {project.createdAt.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            {project.mediaUrls.map((url, index) => (
              <div key={index} className="relative aspect-video w-full overflow-hidden rounded-lg bg-card">
                <Image src={url} alt={`${project.title} media ${index + 1}`} fill className="object-contain" data-ai-hint="project media" />
              </div>
            ))}
          </div>

          <Card className="my-8">
            <CardContent className="p-6">
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{project.description}</p>
              <Separator className="my-6" />
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-headline text-lg font-semibold mb-4">Comments ({comments?.length || 0})</h2>
              <div className="flex space-x-4 mb-6">
                <Avatar>
                  {/* Current user avatar logic needed here */}
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 relative">
                  <Textarea placeholder="Add a comment..." className="pr-12" />
                  <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-primary">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-6">
                {loadingComments && <Loader2 className="h-6 w-6 animate-spin" />}
                {!loadingComments && comments?.map(comment => (
                  <div key={comment.id} className="flex space-x-4">
                    <Avatar>
                      <AvatarImage src={comment.author.avatarUrl || ''} alt={comment.author.name || ''} />
                      <AvatarFallback>{comment.author.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{comment.author.name}</p>
                        <p className="text-xs text-muted-foreground">{comment.createdAt.toDate().toLocaleDateString()}</p>
                      </div>
                      <p className="text-foreground/80 mt-1">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-12 lg:col-span-3">
          <div className="sticky top-24 space-y-6">
             <Card>
                <CardContent className="p-4">
                  <Link href={`/profile/${project.creator.username}`} className="flex items-center space-x-3 mb-4 group">
                    <Avatar>
                      <AvatarImage src={project.creator.avatarUrl || ''} alt={project.creator.name || ''} />
                      <AvatarFallback>{project.creator.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold group-hover:text-primary">{project.creator.name}</p>
                      {/* Location is not in project.creator, would require another fetch */}
                    </div>
                  </Link>
                  {/* Bio is not in project.creator */}
                  <Button className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                </CardContent>
            </Card>
            
            {userProjects.length > 0 && (
                <div>
                    <h3 className="font-headline font-semibold mb-4">More from {project.creator.name}</h3>
                    <div className="space-y-4">
                        {userProjects.map(p => <ProjectCard key={p.id} project={p} />)}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
