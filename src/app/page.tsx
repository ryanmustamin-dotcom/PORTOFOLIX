
'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { categories } from '@/lib/categories';
import type { Project } from '@/lib/types';
import ProjectCard from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { sampleProjects } from '@/lib/sample-data';

export default function Home() {
  const firestore = useFirestore();

  const projectsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: firestoreProjects, loading } = useCollection<Project>(projectsQuery);

  const projects = (!loading && (!firestoreProjects || firestoreProjects.length === 0))
    ? sampleProjects
    : firestoreProjects;

  return (
    <div className="container py-8">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Discover Amazing Artwork
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Show, Connect, Inspire.
        </p>
      </section>

      <div className="sticky top-16 bg-background/95 backdrop-blur z-40 py-4 mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 border-b">
          <div className="container mx-auto px-0">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <Button variant="secondary" size="sm">For You</Button>
              <Button variant="ghost" size="sm">Following</Button>
              <Button variant="ghost" size="sm">Trending</Button>
              <span className="border-l h-6 mx-2"></span>
              {categories.map(category => (
                <Button key={category} variant="ghost" size="sm" className="whitespace-nowrap">{category}</Button>
              ))}
            </div>
          </div>
      </div>
      
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
             <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
             </div>
          ))}
        </div>
      )}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {projects?.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
