'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { categories } from '@/lib/categories';
import type { Project } from '@/lib/types';
import ProjectCard from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { sampleProjects } from '@/lib/sample-data';

export default function Home() {
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

  // Reset category when search query changes significantly or user clicks Jelajah from header
  useEffect(() => {
    if (searchQuery) {
      setSelectedCategory(null);
    }
  }, [searchQuery]);

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

  const projects = useMemo(() => {
    let list = (!loading && (!firestoreProjects || firestoreProjects.length === 0))
      ? (selectedCategory ? sampleProjects.filter(p => p.category === selectedCategory) : sampleProjects)
      : (firestoreProjects || []);

    if (searchQuery) {
      list = list.filter(p => 
        p.title.toLowerCase().includes(searchQuery) || 
        p.description.toLowerCase().includes(searchQuery) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery)) ||
        p.creator.name?.toLowerCase().includes(searchQuery)
      );
    }
    return list;
  }, [firestoreProjects, loading, selectedCategory, searchQuery]);

  return (
    <div className="container py-8 px-4 md:px-8">
      <section className="text-center mb-12 py-10">
        <h1 className="font-headline text-4xl md:text-6xl font-black tracking-tighter mb-4 text-primary">
          DISCOVER EXTRAORDINARY WORKS
        </h1>
        <p className="font-headline text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium tracking-wide">
          Show, Connect, Inspire.
        </p>
      </section>

      <div className="sticky top-16 bg-white/90 backdrop-blur-md z-40 py-4 mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 border-b transition-all">
          <div className="container mx-auto px-0">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
              <Button 
                variant={selectedCategory === null ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="rounded-full px-6 font-headline text-xs tracking-widest"
              >
                Semua
              </Button>
              <span className="border-l h-6 mx-2 hidden sm:block"></span>
              {categories.map(category => (
                <Button 
                  key={category} 
                  variant={selectedCategory === category ? "secondary" : "ghost"} 
                  size="sm" 
                  className="whitespace-nowrap rounded-full px-6 font-headline text-xs tracking-widest"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
      </div>
      
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
             <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
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
          {searchQuery && (
            <div className="mb-6">
              <p className="text-muted-foreground font-headline text-sm tracking-wide">
                Hasil pencarian untuk: <span className="font-black text-foreground">"{searchQuery}"</span>
              </p>
            </div>
          )}
          
          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed">
              <p className="text-muted-foreground text-lg font-headline">Tidak ada karya yang ditemukan.</p>
              <Button variant="link" onClick={() => {
                setSelectedCategory(null);
                window.history.pushState({}, '', '/');
              }} className="mt-2 text-primary font-black font-headline tracking-tighter">
                Lihat semua karya
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
