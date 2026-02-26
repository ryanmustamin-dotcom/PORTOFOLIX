'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import ProjectDetailView from './project-detail-view';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ProjectDetailsDialogProps {
  projectId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectDetailsDialog({ projectId, isOpen, onOpenChange }: ProjectDetailsDialogProps) {
  if (!projectId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto p-0 rounded-3xl border-none shadow-2xl no-scrollbar">
        <VisuallyHidden>
          <DialogTitle>Detail Proyek</DialogTitle>
        </VisuallyHidden>
        <div className="p-4 sm:p-8">
            <ProjectDetailView projectId={projectId} isModal={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
