import Image from 'next/image';
import Link from 'next/link';
import { getProjectById, getProjectsByUser } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageCircle, Send, UserPlus } from 'lucide-react';
import ProjectCard from '@/components/project-card';
import { Textarea } from '@/components/ui/textarea';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = getProjectById(params.id);

  if (!project) {
    notFound();
  }

  const userProjects = getProjectsByUser(project.creator.username).filter(p => p.id !== project.id).slice(0, 3);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-9">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <Link href={`/profile/${project.creator.username}`} className="flex items-center space-x-3 group">
                  <Avatar>
                    <AvatarImage src={project.creator.avatarUrl} alt={project.creator.name} />
                    <AvatarFallback>{project.creator.name.charAt(0)}</AvatarFallback>
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
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4 text-pink-500" fill="currentColor" />
                  <span>{project.likes} Likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{project.comments.length} Comments</span>
                </div>
                <span>Published on {project.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
              <h2 className="font-headline text-lg font-semibold mb-4">Comments ({project.comments.length})</h2>
              <div className="flex space-x-4 mb-6">
                <Avatar>
                  <AvatarImage src="https://picsum.photos/seed/avatar1/100/100" />
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
                {project.comments.map(comment => (
                  <div key={comment.id} className="flex space-x-4">
                    <Avatar>
                      <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name} />
                      <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{comment.user.name}</p>
                        <p className="text-xs text-muted-foreground">{comment.timestamp.toLocaleDateString()}</p>
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
                      <AvatarImage src={project.creator.avatarUrl} alt={project.creator.name} />
                      <AvatarFallback>{project.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold group-hover:text-primary">{project.creator.name}</p>
                      <p className="text-sm text-muted-foreground">{project.creator.location}</p>
                    </div>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-4">{project.creator.bio}</p>
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
