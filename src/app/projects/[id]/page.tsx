'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useDoc, useCollection, useFirestore, useUser } from '@/firebase';
import { doc, collection, query, where, limit, orderBy, updateDoc, arrayUnion, arrayRemove, addDoc, serverTimestamp } from 'firebase/firestore';
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
  const { user, userProfile } = useUser();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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
          limit(5)
      );
  }, [firestore, project]);

  const { data: userProjectsData } = useCollection<Project>(userProjectsQuery);

  const userProjects = userProjectsData?.filter(p => p.id !== project?.id).slice(0, 3) || [];

  const hasLiked = useMemo(() => {
    if (!user || !project?.likes) return false;
    return project.likes.includes(user.uid);
  }, [user, project]);

  const handleLike = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Anda harus masuk untuk memberikan suka.' });
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
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memperbarui status suka.' });
    }
  };

  const handleAddComment = async () => {
    if (!user || !userProfile) {
      toast({ variant: 'destructive', title: 'Anda harus masuk untuk berkomentar.' });
      return;
    }
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const commentsRef = collection(firestore, 'projects', params.id, 'comments');
      await addDoc(commentsRef, {
        text: commentText,
        createdAt: serverTimestamp(),
        author: {
          uid: user.uid,
          name: userProfile.name,
          username: userProfile.username,
          avatarUrl: userProfile.avatarUrl,
        }
      });
      setCommentText('');
      toast({ title: 'Komentar ditambahkan!' });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal mengirim komentar.' });
    } finally {
      setIsSubmittingComment(false);
    }
  };


  if (loadingProject) {
      return (
        <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
                    Ikuti
                  </Button>
                  <Button variant="default" size="sm">
                    Hubungi
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6">
                 <button onClick={handleLike} className="flex items-center space-x-1 group focus:outline-none">
                  <Heart className={`h-5 w-5 transition-colors ${hasLiked ? 'text-red-500 fill-current' : 'group-hover:text-red-400'}`} />
                  <span className={hasLiked ? 'text-foreground font-bold' : ''}>{project.likes?.length || 0} Suka</span>
                </button>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-5 w-5" />
                  <span>{comments?.length || 0} Komentar</span>
                </div>
                {project.createdAt && (
                    <span className="hidden sm:inline">• Diterbitkan pada {project.createdAt.toDate().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            {project.mediaUrls.map((url, index) => (
              <div key={index} className="relative aspect-video w-full overflow-hidden rounded-lg bg-card border shadow-sm">
                <Image src={url} alt={`${project.title} media ${index + 1}`} fill className="object-contain" data-ai-hint="project media" />
              </div>
            ))}
          </div>

          <Card className="my-8">
            <CardContent className="p-6">
              <h2 className="font-headline text-lg font-semibold mb-4 text-primary">Deskripsi</h2>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{project.description}</p>
              <Separator className="my-6" />
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="hover:bg-primary hover:text-white cursor-default transition-colors">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card id="comments">
            <CardContent className="p-6">
              <h2 className="font-headline text-lg font-semibold mb-6">Diskusi ({comments?.length || 0})</h2>
              
              {user ? (
                <div className="flex space-x-4 mb-8">
                  <Avatar>
                    <AvatarImage src={userProfile?.avatarUrl || ''} />
                    <AvatarFallback>{userProfile?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 relative">
                    <Textarea 
                      placeholder="Apa pendapat Anda tentang karya ini?" 
                      className="pr-12 min-h-[100px] resize-none" 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button 
                      onClick={handleAddComment}
                      disabled={isSubmittingComment || !commentText.trim()}
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 bottom-2 h-8 w-8 text-primary hover:bg-primary/10"
                    >
                      {isSubmittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/50 rounded-lg p-4 text-center mb-8">
                  <p className="text-sm text-muted-foreground">Silakan <Link href="/auth" className="text-primary font-bold hover:underline">Masuk</Link> untuk ikut berdiskusi.</p>
                </div>
              )}

              <div className="space-y-6">
                {loadingComments && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
                {!loadingComments && comments?.map(comment => (
                  <div key={comment.id} className="flex space-x-4 group animate-in fade-in slide-in-from-top-2">
                    <Link href={`/profile/${comment.author.username}`}>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.author.avatarUrl || ''} alt={comment.author.name || ''} />
                        <AvatarFallback>{comment.author.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1 bg-muted/30 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <Link href={`/profile/${comment.author.username}`} className="font-semibold hover:text-primary transition-colors">{comment.author.name}</Link>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          {comment.createdAt?.toDate().toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <p className="text-foreground/80 text-sm leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))}
                {!loadingComments && comments?.length === 0 && (
                  <p className="text-center text-muted-foreground py-4 italic text-sm">Belum ada komentar. Jadilah yang pertama!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-12 lg:col-span-3">
          <div className="sticky top-24 space-y-6">
             <Card className="overflow-hidden border-primary/10">
                <div className="h-2 w-full bg-primary" />
                <CardContent className="p-6">
                  <Link href={`/profile/${project.creator.username}`} className="flex flex-col items-center text-center group mb-4">
                    <Avatar className="h-20 w-20 mb-3 border-2 border-primary/20 transition-transform group-hover:scale-105">
                      <AvatarImage src={project.creator.avatarUrl || ''} alt={project.creator.name || ''} />
                      <AvatarFallback className="text-xl">{project.creator.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-headline font-bold text-lg group-hover:text-primary transition-colors">{project.creator.name}</p>
                    <p className="text-sm text-muted-foreground">@{project.creator.username}</p>
                  </Link>
                  <Button className="w-full mb-2 shadow-lg shadow-primary/20">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ikuti
                  </Button>
                  <Button variant="outline" className="w-full">
                    Kirim Pesan
                  </Button>
                </CardContent>
            </Card>
            
            {userProjects.length > 0 && (
                <div>
                    <h3 className="font-headline font-semibold mb-4 text-sm text-primary">Karya Lainnya</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {userProjects.map(p => <ProjectCard key={p.id} project={p} className="h-auto" />)}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
