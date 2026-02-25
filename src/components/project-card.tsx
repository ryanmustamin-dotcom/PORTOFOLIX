import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import type { Project } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type ProjectCardProps = {
  project: Project;
  className?: string;
};

export default function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className={cn("group block", className)}>
      <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 h-full flex flex-col">
        <CardContent className="p-0 flex flex-col flex-grow">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="project thumbnail"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <div className="p-4 flex justify-between items-start mt-auto">
            <div>
              <h3 className="font-headline font-semibold truncate group-hover:text-primary">{project.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={project.creator.avatarUrl || undefined} alt={project.creator.name || ''} />
                  <AvatarFallback>{project.creator.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="truncate">{project.creator.name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground pt-1">
              <Heart className="h-4 w-4" />
              <span>{project.likes}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
