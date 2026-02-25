'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import EditProfileForm from './edit-profile-form';
import type { UserProfile } from '@/lib/types';

type EditProfileDialogProps = {
    userProfile: UserProfile;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function EditProfileDialog({ userProfile, isOpen, onOpenChange }: EditProfileDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <EditProfileForm userProfile={userProfile} onFinished={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
