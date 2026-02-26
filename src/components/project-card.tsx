'use client';

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
  onOpen?: (projectId: string) => void;
};

export default function ProjectCard({ project, className, onOpen }: ProjectCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onOpen) {
      e.preventDefault();
      onOpen(project.id);
    }
  };

  return (
    <div className={cn("group h-full flex flex-col", className)}>
      <Card 
        className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 h-full flex flex-col cursor-pointer"
        onClick={handleClick}
      >
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
            <div className="flex-1 min-w-0">
              <h3 className="font-headline font-semibold truncate group-hover:text-primary tracking-tighter uppercase text-sm">{project.title}</h3>
              <div 
                className="flex items-center space-x-2 text-xs text-muted-foreground mt-1 hover:text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/profile/${project.creator.username}`;
                }}
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src={project.creator.avatarUrl || undefined} alt={project.creator.name || ''} />
                  <AvatarFallback>{project.creator.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="truncate font-subheadline font-bold uppercase tracking-tight">{project.creator.name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground pt-1 ml-2">
              <Heart className="h-4 w-4" />
              <span>{project.likes?.length || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
