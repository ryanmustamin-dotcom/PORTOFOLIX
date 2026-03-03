'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, useStorage } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { Github, Instagram, Loader2, Twitter } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter.'),
    username: z.string().min(3, 'Username minimal 3 karakter.'),
    bio: z.string().max(160, 'Bio maksimal 160 karakter.').optional(),
    location: z.string().optional(),
    status: z.string().optional(),
    socialLinks: z.object({
        twitter: z.string().url().optional().or(z.literal('')),
        instagram: z.string().url().optional().or(z.literal('')),
        github: z.string().url().optional().or(z.literal('')),
    }).optional(),
    avatarFile: z.any().optional(),
    headerFile: z.any().optional(),
});

type EditProfileFormProps = {
    userProfile: UserProfile;
    onFinished?: () => void;
};

export default function EditProfileForm({ userProfile, onFinished }: EditProfileFormProps) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const storage = useStorage();
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
            const updatedData: any = {
                name: values.name,
                username: values.username,
                bio: values.bio,
                location: values.location,
                status: values.status,
                socialLinks: values.socialLinks,
            };

            const uploadTasks = [];

            // Parallelize Avatar Upload
            if (values.avatarFile?.[0]) {
                const avatarRef = ref(storage, `profiles/${userProfile.uid}/avatar-${Date.now()}`);
                const task = uploadBytes(avatarRef, values.avatarFile[0]).then(async (snapshot) => {
                    updatedData.avatarUrl = await getDownloadURL(snapshot.ref);
                });
                uploadTasks.push(task);
            }

            // Parallelize Header Upload
            if (values.headerFile?.[0]) {
                const headerRef = ref(storage, `profiles/${userProfile.uid}/header-${Date.now()}`);
                const task = uploadBytes(headerRef, values.headerFile[0]).then(async (snapshot) => {
                    updatedData.headerUrl = await getDownloadURL(snapshot.ref);
                });
                uploadTasks.push(task);
            }

            await Promise.all(uploadTasks);
            await updateDoc(userRef, updatedData);
            
            toast({ title: 'Profil diperbarui!' });
            if (onFinished) onFinished();
        } catch (error: any) {
            console.error("Profile update error:", error);
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Nama Lengkap</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem><FormLabel>Username</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
             <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>Pekerjaan/Status</FormLabel><FormControl><Input placeholder="e.g. Designer" {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem><FormLabel>Lokasi</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />

            <div className="space-y-2">
                <FormLabel>Media Sosial</FormLabel>
                <div className="space-y-2">
                     <FormField control={form.control} name="socialLinks.twitter" render={({ field }) => (
                        <FormItem><div className="flex items-center gap-2"><Twitter className="h-4 w-4" /><FormControl><Input placeholder="Twitter URL" {...field} /></FormControl></div></FormItem>
                    )} />
                     <FormField control={form.control} name="socialLinks.instagram" render={({ field }) => (
                        <FormItem><div className="flex items-center gap-2"><Instagram className="h-4 w-4" /><FormControl><Input placeholder="Instagram URL" {...field} /></FormControl></div></FormItem>
                    )} />
                </div>
            </div>

            <FormField control={form.control} name="avatarFile" render={({ field }) => (
              <FormItem><FormLabel>Ganti Foto Profil</FormLabel><FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl></FormItem>
            )}/>

            <FormField control={form.control} name="headerFile" render={({ field }) => (
              <FormItem><FormLabel>Ganti Banner Profil</FormLabel><FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl></FormItem>
            )}/>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
        </form>
      </Form>
    );
}
