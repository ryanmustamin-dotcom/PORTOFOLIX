'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { Github, Globe, Instagram, Loader2, Twitter } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    username: z.string().min(3, 'Username must be at least 3 characters.'),
    bio: z.string().max(160, 'Bio must be less than 160 characters.').optional(),
    location: z.string().optional(),
    status: z.string().optional(),
    socialLinks: z.object({
        twitter: z.string().url().optional().or(z.literal('')),
        instagram: z.string().url().optional().or(z.literal('')),
        github: z.string().url().optional().or(z.literal('')),
    }).optional(),
    avatarUrl: z.any().optional(),
    headerUrl: z.any().optional(),
});

type EditProfileFormProps = {
    userProfile: UserProfile;
    onFinished?: () => void;
};

export default function EditProfileForm({ userProfile, onFinished }: EditProfileFormProps) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: userProfile.name || '',
            username: userProfile.username || '',
            bio: userProfile.bio || '',
            location: userProfile.location || '',
            status: userProfile.status || '',
            socialLinks: {
                twitter: userProfile.socialLinks?.twitter || '',
                instagram: userProfile.socialLinks?.instagram || '',
                github: userProfile.socialLinks?.github || '',
            }
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!userProfile) return;
        setIsSubmitting(true);
        try {
            const userRef = doc(firestore, 'users', userProfile.uid);
            
            // For now, we simulate image uploads with new picsum photos
            const updatedValues: Partial<UserProfile> = { ...values };
            if (values.avatarUrl && values.avatarUrl.length > 0) {
                updatedValues.avatarUrl = `https://picsum.photos/seed/${userProfile.uid}-${Date.now()}/200/200`;
            } else {
                delete updatedValues.avatarUrl;
            }
            if (values.headerUrl && values.headerUrl.length > 0) {
                updatedValues.headerUrl = `https://picsum.photos/seed/header-${userProfile.uid}-${Date.now()}/1200/300`;
            } else {
                delete updatedValues.headerUrl;
            }

            await updateDoc(userRef, updatedValues);

            toast({ title: 'Profile updated successfully!' });
            if (onFinished) onFinished();
        } catch (error) {
            console.error('Error updating profile', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update profile.' });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                  <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl><Input placeholder="Your username" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
             <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl><Input placeholder="e.g. Graphic Designer @ Studio" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl><Textarea placeholder="A short bio about yourself" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl><Input placeholder="e.g., San Francisco, CA" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <div className="space-y-2">
                <FormLabel>Social Links</FormLabel>
                <div className="space-y-2">
                     <FormField control={form.control} name="socialLinks.twitter" render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-2">
                                <Twitter className="h-5 w-5 text-muted-foreground" />
                                <FormControl><Input placeholder="https://twitter.com/username" {...field} /></FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="socialLinks.instagram" render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-2">
                                <Instagram className="h-5 w-5 text-muted-foreground" />
                                <FormControl><Input placeholder="https://instagram.com/username" {...field} /></FormControl>
                            </div>
                             <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="socialLinks.github" render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-2">
                                <Github className="h-5 w-5 text-muted-foreground" />
                                <FormControl><Input placeholder="https://github.com/username" {...field} /></FormControl>
                            </div>
                             <FormMessage />
                        </FormItem>
                    )} />
                </div>
            </div>

            <FormField control={form.control} name="avatarUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar Image</FormLabel>
                <FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>

            <FormField control={form.control} name="headerUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Header Image</FormLabel>
                <FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </form>
      </Form>
    );
}
