'use client';

import { useMemo, useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { categories } from '@/lib/categories';
import type { Project } from '@/lib/types';
import ProjectCard from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { sampleProjects } from '@/lib/sample-data';
import { cn } from '@/lib/utils';

export default function Home() {
  const firestore = useFirestore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const projectsQuery = useMemo(() => {
    if (!firestore) return null;
    const projectsRef = collection(firestore, 'projects');
    
    if (selectedCategory) {
      return query(
        projectsRef, 
        where('category', '==', selectedCategory),
        orderBy('createdAt', 'desc')
      );
    }
    
    return query(projectsRef, orderBy('createdAt', 'desc'));
  }, [firestore, selectedCategory]);

  const { data: firestoreProjects, loading } = useCollection<Project>(projectsQuery);

  const projects = (!loading && (!firestoreProjects || firestoreProjects.length === 0))
    ? (selectedCategory ? sampleProjects.filter(p => p.category === selectedCategory) : sampleProjects)
    : firestoreProjects;

  return (
    <div className="container py-8">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Temukan Karya Luar Biasa
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Tunjukkan, Hubungkan, Inspirasi.
        </p>
      </section>

      <div className="sticky top-16 bg-background/95 backdrop-blur z-40 py-4 mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 border-b">
          <div className="container mx-auto px-0">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button 
                variant={selectedCategory === null ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Semua
              </Button>
              <span className="border-l h-6 mx-2"></span>
              {categories.map(category => (
                <Button 
                  key={category} 
                  variant={selectedCategory === category ? "secondary" : "ghost"} 
                  size="sm" 
                  className="whitespace-nowrap"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
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
        <>
          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Tidak ada proyek ditemukan dalam kategori ini.</p>
              <Button variant="link" onClick={() => setSelectedCategory(null)}>Lihat semua kategori</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
