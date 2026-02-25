import { getProjects, getCategories } from '@/lib/data';
import ProjectCard from '@/components/project-card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const projects = getProjects();
  const categories = getCategories();

  return (
    <div className="container py-8">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Discover Amazing Artwork
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore a universe of creativity from artists and designers around the world.
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
