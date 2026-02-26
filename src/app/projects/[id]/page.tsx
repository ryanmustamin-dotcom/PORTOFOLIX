'use client';

import ProjectDetailView from '@/components/project-detail-view';

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <ProjectDetailView projectId={params.id} isModal={false} />;
}
