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
import { Heart, MessageCircle, Send, UserPlus, Loader2, Check, Mail } from 'lucide-react';
import ProjectCard from '@/components/project-card';
import { Textarea } from '@/components/ui/textarea';
import MessageDialog from '@/components/message-dialog';
import { useToast } from '@/hooks/use-toast';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const { user, userProfile } = useUser();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

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

  const isFollowing = useMemo(() => {
    if (!userProfile || !project) return false;
    return userProfile.following?.includes(project.creator.uid) ?? false;
  }, [userProfile, project]);

  const handleLike = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Anda harus masuk untuk memberikan suka.' });
      return;
    }
    if (!projectRef) return;

    try {
      if (hasLiked) {
        await updateDoc(projectRef, { likes: arrayRemove(user.uid) });
      } else {
        await updateDoc(projectRef, { likes: arrayUnion(user.uid) });
      }
    } catch (error) {
      console.error("Error liking project:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memperbarui status suka.' });
    }
  };

  const handleFollow = async () => {
    if (!user || !project) {
      toast({ variant: 'destructive', title: 'Silakan masuk untuk mengikuti kreator.' });
      return;
    }
    if (user.uid === project.creator.uid) return;

    const currentUserRef = doc(firestore, 'users', user.uid);
    const targetUserRef = doc(firestore, 'users', project.creator.uid);

    try {
      if (isFollowing) {
        await updateDoc(currentUserRef, { following: arrayRemove(project.creator.uid) });
        await updateDoc(targetUserRef, { followers: arrayRemove(user.uid) });
        toast({ title: `Berhenti mengikuti ${project.creator.name}` });
      } else {
        await updateDoc(currentUserRef, { following: arrayUnion(project.creator.uid) });
        await updateDoc(targetUserRef, { followers: arrayUnion(user.uid) });
        toast({ title: `Berhasil mengikuti ${project.creator.name}` });
      }
    } catch (error) {
      console.error('Error following user:', error);
      toast({ variant: 'destructive', title: 'Gagal melakukan aksi ini.' });
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

  if (!project) notFound();

  return (
    <div className="container mx-auto py-10 px-4">
      <MessageDialog 
        receiverUid={project.creator.uid}
        receiverName={project.creator.name || ''}
        isOpen={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
      />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-9">
          <Card className="mb-8 border-none shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <Link href={`/profile/${project.creator.username}`} className="flex items-center space-x-3 group">
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarImage src={project.creator.avatarUrl || undefined} alt={project.creator.name || ''} />
                    <AvatarFallback>{project.creator.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="font-headline text-xl font-black group-hover:text-primary transition-colors tracking-tighter">{project.title}</h1>
                    <p className="font-subheadline text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Oleh {project.creator.name}</p>
                  </div>
                </Link>
                {user?.uid !== project.creator.uid && (
                  <div className="flex items-center space-x-2 shrink-0">
                    <Button onClick={handleFollow} variant={isFollowing ? 'secondary' : 'outline'} size="sm" className="rounded-full px-4 tracking-widest uppercase font-bold text-[10px]">
                      {isFollowing ? <Check className="h-4 w-4 mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                      {isFollowing ? 'Diikuti' : 'Ikuti'}
                    </Button>
                    <Button onClick={() => setIsMessageDialogOpen(true)} variant="default" size="sm" className="rounded-full px-4 shadow-lg shadow-primary/20 tracking-widest uppercase font-bold text-[10px]">
                      <Mail className="h-4 w-4 mr-2" />
                      Pesan
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-subheadline tracking-widest font-bold text-muted-foreground mb-6">
                 <button onClick={handleLike} className="flex items-center space-x-1 group focus:outline-none bg-muted/30 px-3 py-1.5 rounded-full hover:bg-muted/50 transition-colors uppercase">
                  <Heart className={`h-4 w-4 transition-colors ${hasLiked ? 'text-red-500 fill-current' : 'group-hover:text-red-400'}`} />
                  <span className={hasLiked ? 'text-foreground font-black' : ''}>{project.likes?.length || 0} Suka</span>
                </button>
                <div className="flex items-center space-x-1 bg-muted/30 px-3 py-1.5 rounded-full uppercase">
                  <MessageCircle className="h-4 w-4" />
                  <span>{comments?.length || 0} Komentar</span>
                </div>
                {project.createdAt && (
                    <span className="hidden sm:inline bg-muted/30 px-3 py-1.5 rounded-full uppercase font-subheadline">• Diterbitkan {project.createdAt.toDate().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            {project.mediaUrls.map((url, index) => (
              <div key={index} className="relative aspect-video w-full overflow-hidden rounded-3xl bg-card border shadow-xl">
                <Image src={url} alt={`${project.title} media ${index + 1}`} fill className="object-cover" data-ai-hint="project media" />
              </div>
            ))}
          </div>

          <Card className="my-8 border-none shadow-md bg-white">
            <CardContent className="p-8">
              <h2 className="font-subheadline text-lg font-black mb-4 text-primary tracking-tighter uppercase">Deskripsi</h2>
              <p className="text-foreground/80 text-lg leading-relaxed whitespace-pre-wrap font-subheadline">{project.description}</p>
              <Separator className="my-8" />
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="px-4 py-1 rounded-full hover:bg-primary hover:text-white transition-colors cursor-default font-subheadline text-[10px] tracking-widest uppercase">#{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card id="comments" className="border-none shadow-md bg-white overflow-hidden">
            <div className="h-1.5 w-full bg-primary/10" />
            <CardContent className="p-8">
              <h2 className="font-subheadline text-xl font-black mb-8 tracking-tighter uppercase">Diskusi ({comments?.length || 0})</h2>
              
              {user ? (
                <div className="flex space-x-4 mb-10">
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarImage src={userProfile?.avatarUrl || ''} />
                    <AvatarFallback>{userProfile?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 relative">
                    <Textarea 
                      placeholder="Bagikan pendapat Anda tentang karya ini..." 
                      className="pr-12 min-h-[120px] resize-none rounded-2xl bg-muted/20 border-none focus:ring-2 focus:ring-primary/20 text-md font-subheadline" 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button 
                      onClick={handleAddComment}
                      disabled={isSubmittingComment || !commentText.trim()}
                      variant="default" 
                      size="icon" 
                      className="absolute right-3 bottom-3 h-10 w-10 rounded-full shadow-lg shadow-primary/20"
                    >
                      {isSubmittingComment ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 text-center mb-10">
                  <p className="font-subheadline text-xs tracking-widest font-bold text-muted-foreground uppercase">Silakan <Link href="/auth" className="text-primary font-black hover:underline">Masuk</Link> untuk ikut berdiskusi.</p>
                </div>
              )}

              <div className="space-y-8">
                {loadingComments && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {!loadingComments && comments?.map(comment => (
                  <div key={comment.id} className="flex space-x-4 group animate-in fade-in slide-in-from-top-4">
                    <Link href={`/profile/${comment.author.username}`}>
                      <Avatar className="h-10 w-10 border border-primary/10">
                        <AvatarImage src={comment.author.avatarUrl || ''} alt={comment.author.name || ''} />
                        <AvatarFallback>{comment.author.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1 bg-muted/20 p-5 rounded-2xl group-hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Link href={`/profile/${comment.author.username}`} className="font-subheadline text-sm font-black hover:text-primary transition-colors tracking-tight">{comment.author.name}</Link>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold font-subheadline">
                          {comment.createdAt?.toDate().toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <p className="text-foreground/80 text-md leading-relaxed font-subheadline">{comment.text}</p>
                    </div>
                  </div>
                ))}
                {!loadingComments && comments?.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground italic font-subheadline text-sm tracking-wide">Belum ada komentar. Jadilah yang pertama memberikan apresiasi!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-12 lg:col-span-3">
          <div className="sticky top-24 space-y-6">
             <Card className="overflow-hidden border-none shadow-lg bg-white rounded-3xl">
                <div className="h-2 w-full bg-primary" />
                <CardContent className="p-6 font-subheadline">
                  <Link href={`/profile/${project.creator.username}`} className="flex flex-col items-center text-center group mb-6">
                    <Avatar className="h-24 w-24 mb-4 border-2 border-primary/20 transition-transform group-hover:scale-105 shadow-md">
                      <AvatarImage src={project.creator.avatarUrl || ''} alt={project.creator.name || ''} />
                      <AvatarFallback className="text-2xl">{project.creator.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-subheadline font-black text-xl group-hover:text-primary transition-colors tracking-tighter uppercase">{project.creator.name}</p>
                    <p className="font-subheadline text-[10px] text-muted-foreground uppercase tracking-widest font-bold">@{project.creator.username}</p>
                  </Link>
                  {user?.uid !== project.creator.uid && (
                    <div className="space-y-3">
                      <Button onClick={handleFollow} variant={isFollowing ? 'secondary' : 'default'} className="w-full rounded-full shadow-lg shadow-primary/10 py-6 font-bold tracking-widest uppercase">
                        {isFollowing ? <><Check className="h-4 w-4 mr-2" /> Diikuti</> : <><UserPlus className="h-4 w-4 mr-2" /> Ikuti Kreator</>}
                      </Button>
                      <Button onClick={() => setIsMessageDialogOpen(true)} variant="outline" className="w-full rounded-full py-6 font-bold tracking-widest border-primary/20 hover:bg-primary/5 uppercase">
                        Kirim Pesan
                      </Button>
                    </div>
                  )}
                </CardContent>
            </Card>
            
            {userProjects.length > 0 && (
                <div>
                    <h3 className="font-subheadline font-black mb-4 text-[10px] text-primary tracking-[0.2em] uppercase">Karya Lainnya</h3>
                    <div className="grid grid-cols-1 gap-6">
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
