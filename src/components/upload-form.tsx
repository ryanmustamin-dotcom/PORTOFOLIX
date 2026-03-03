'use client';

import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bot, Loader2, Sparkles, UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser, useFirestore, useStorage } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { generateProjectDescription } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { categories } from '@/lib/categories';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

const formSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter.'),
  category: z.string().min(1, 'Pilih kategori.'),
  briefDescription: z.string().min(10, 'Deskripsi singkat minimal 10 karakter.'),
  descriptionDraft: z.string().optional(),
  suggestedTags: z.array(z.string()).optional(),
  suggestedKeywords: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadForm() {
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, userProfile } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: '',
      briefDescription: '',
      descriptionDraft: '',
      suggestedTags: [],
      suggestedKeywords: [],
    },
  });

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1600; // Optimized width for web
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Compression failed'));
          }, 'image/jpeg', 0.75); // Slightly more aggressive compression
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        toast({ variant: 'destructive', title: 'File Terlalu Besar', description: `Maksimal 10MB.` });
        return;
      }
      setSelectedFiles(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  const handleEnhanceWithAI = async () => {
    const values = form.getValues();
    if (!values.title || !values.briefDescription || !values.category) {
      toast({ variant: 'destructive', title: 'Info Kurang', description: 'Lengkapi data dasar dahulu.' });
      return;
    }
    setIsAiLoading(true);
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('briefDescription', values.briefDescription);
    formData.append('category', values.category);
    const result = await generateProjectDescription(formData);
    if (result.success && result.data) {
      form.setValue('descriptionDraft', result.data.descriptionDraft);
      form.setValue('suggestedTags', result.data.suggestedTags);
      form.setValue('suggestedKeywords', result.data.suggestedKeywords);
      toast({ title: 'AI Berhasil!', description: 'Deskripsi telah diperbarui.' });
    }
    setIsAiLoading(false);
  };
  
  const onSubmit = async (values: FormValues) => {
    if (!user || !userProfile) return;
    if (selectedFiles.length === 0) {
        toast({ variant: 'destructive', title: 'Media Kosong', description: 'Unggah minimal satu gambar.' });
        return;
    }

    setIsSubmitting(true);
    try {
        // Parallelize compression and upload for better performance
        const uploadPromises = selectedFiles.map(async (file) => {
            const compressedBlob = await compressImage(file);
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;
            const fileRef = ref(storage, `projects/${user.uid}/${fileName}`);
            const uploadResult = await uploadBytes(fileRef, compressedBlob);
            return getDownloadURL(uploadResult.ref);
        });

        const mediaUrls = await Promise.all(uploadPromises);

        const projectData = {
            title: values.title,
            category: values.category,
            description: values.descriptionDraft || values.briefDescription,
            tags: values.suggestedTags || [],
            keywords: values.suggestedKeywords || [],
            thumbnailUrl: mediaUrls[0],
            mediaUrls,
            likes: [],
            createdAt: serverTimestamp(),
            creator: {
                uid: user.uid,
                username: userProfile.username,
                name: userProfile.name,
                avatarUrl: userProfile.avatarUrl,
            },
        };
        
        const docRef = await addDoc(collection(firestore, 'projects'), projectData);
        toast({ title: "Karya Terbit!", description: "Proyek Anda berhasil disimpan di cloud." });
        router.push(`/projects/${docRef.id}`);
    } catch (error: any) {
        console.error("Upload error:", error);
        toast({ variant: 'destructive', title: "Gagal Mengunggah", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Media Proyek (Cloud Storage)
            </CardTitle>
            <CardDescription>Gambar asli Anda akan diunggah dan disimpan secara permanen.</CardDescription>
          </CardHeader>
          <CardContent>
              <div 
                className="group relative border-2 border-dashed border-muted-foreground/25 hover:border-primary transition-colors rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer bg-muted/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="h-10 w-10 text-primary mb-4" />
                <p className="text-lg font-medium">Klik untuk pilih gambar asli</p>
                <input type="file" className="hidden" multiple accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
              </div>

              {previews.length > 0 && (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previews.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
                            <Image src={url} alt={`Preview ${index}`} fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeFile(index)}><X className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
              )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader><CardTitle>Detail Proyek</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Judul</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl>
                      <SelectContent>{categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="briefDescription" render={({ field }) => (
                  <FormItem><FormLabel>Deskripsi Singkat</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                )} />
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />AI Optimization</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <Button type="button" onClick={handleEnhanceWithAI} disabled={isAiLoading} className="w-full">Tingkatkan dengan AI</Button>
                     <FormField control={form.control} name="descriptionDraft" render={({ field }) => (
                        <FormItem><FormLabel>Deskripsi Lengkap</FormLabel><FormControl><Textarea rows={6} className="bg-background" {...field} /></FormControl></FormItem>
                    )} />
                </CardContent>
            </Card>
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full h-14 text-lg">
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Sedang Mengunggah...
              </div>
            ) : 'Terbitkan Sekarang'}
        </Button>
      </form>
    </Form>
  );
}
