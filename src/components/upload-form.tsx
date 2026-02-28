'use client';

import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bot, File as FileIcon, Loader2, Sparkles, UploadCloud, X, Image as ImageIcon } from 'lucide-react';
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      
      // Check file sizes
      const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        toast({
          variant: 'destructive',
          title: 'File Terlalu Besar',
          description: `Beberapa file melebihi batas 5MB. Silakan pilih file yang lebih kecil.`,
        });
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
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleEnhanceWithAI = async () => {
    const values = form.getValues();
    if (!values.title || !values.briefDescription || !values.category) {
      toast({
        variant: 'destructive',
        title: 'Info Kurang',
        description: 'Lengkapi judul, deskripsi singkat, dan kategori.',
      });
      return;
    }

    setIsAiLoading(true);
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('briefDescription', values.briefDescription);
    formData.append('category', values.category);

    const result = await generateProjectDescription(formData);

    if (result.success && result.data) {
      form.setValue('descriptionDraft', result.data.descriptionDraft, { shouldValidate: true });
      form.setValue('suggestedTags', result.data.suggestedTags, { shouldValidate: true });
      form.setValue('suggestedKeywords', result.data.suggestedKeywords, { shouldValidate: true });
      toast({
        title: 'AI Berhasil!',
        description: 'Deskripsi Anda telah diperbarui oleh AI.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Gagal AI',
        description: result.error || 'Terjadi kesalahan.',
      });
    }
    setIsAiLoading(false);
  };
  
  const onSubmit = async (values: FormValues) => {
    if (!user || !userProfile) {
        toast({ variant: 'destructive', title: 'Belum Login', description: 'Silakan login untuk mengunggah.' });
        return;
    }
    if (selectedFiles.length === 0) {
        toast({ variant: 'destructive', title: 'File Kosong', description: 'Pilih setidaknya satu gambar.' });
        return;
    }

    setIsSubmitting(true);
    try {
        const mediaUrls: string[] = [];
        
        for (const file of selectedFiles) {
            const fileRef = ref(storage, `projects/${user.uid}/${Date.now()}-${file.name}`);
            const uploadResult = await uploadBytes(fileRef, file);
            const downloadUrl = await getDownloadURL(uploadResult.ref);
            mediaUrls.push(downloadUrl);
        }

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

        toast({
            title: "Proyek Terbit!",
            description: "Karya Anda kini dapat dilihat semua orang dengan gambar asli."
        });
        router.push(`/projects/${docRef.id}`);

    } catch (error: any) {
        console.error("Error submitting project:", error);
        toast({
            variant: 'destructive',
            title: "Gagal Mengunggah",
            description: error.message || "Silakan coba lagi beberapa saat lagi."
        });
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
                Media Proyek
            </CardTitle>
            <CardDescription>Unggah gambar karya terbaik Anda (Maks. 5MB per file).</CardDescription>
          </CardHeader>
          <CardContent>
              <div 
                className="group relative border-2 border-dashed border-muted-foreground/25 hover:border-primary transition-colors rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer bg-muted/5"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-10 w-10 text-primary" />
                </div>
                <p className="text-lg font-medium">Klik untuk pilih file</p>
                <p className="text-sm text-muted-foreground mt-1">Mendukung format JPG, PNG, GIF. Maksimal 5MB.</p>
                <input 
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
              </div>

              {previews.length > 0 && (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previews.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
                            <Image src={url} alt={`Preview ${index}`} fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="icon" 
                                    className="h-8 w-8" 
                                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
              )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Detail Proyek</CardTitle>
                <CardDescription>Berikan informasi dasar tentang karya Anda.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Proyek</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 'Cyber Punk Girl'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="briefDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Singkat</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Jelaskan dalam 1-2 kalimat." {...field} />
                      </FormControl>
                      <FormDescription>Akan digunakan AI untuk membuat draf lengkap.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <div className="flex flex-col gap-2">
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI-Enhanced Description
                        </CardTitle>
                        <CardDescription>Biar AI bantu membuat deskripsi yang keren!</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Button type="button" onClick={handleEnhanceWithAI} disabled={isAiLoading} className="w-full shadow-lg shadow-primary/20">
                        {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                        {isAiLoading ? 'Menghasilkan...' : 'Tingkatkan dengan AI'}
                    </Button>

                     <FormField
                        control={form.control}
                        name="descriptionDraft"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Draf Deskripsi Lengkap</FormLabel>
                            <FormControl>
                                <Textarea rows={6} className="bg-background" placeholder="Hasil AI akan muncul di sini." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    
                    <div className="space-y-2">
                        <FormLabel className="text-xs uppercase text-muted-foreground font-bold">Tag & Kata Kunci</FormLabel>
                        <div className="flex flex-wrap gap-2">
                            {form.watch('suggestedTags')?.map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-background">{tag}</Badge>
                            ))}
                            {form.watch('suggestedKeywords')?.map(kw => (
                                <Badge key={kw} variant="outline" className="bg-background">{kw}</Badge>
                            ))}
                            {(!form.watch('suggestedTags')?.length && !form.watch('suggestedKeywords')?.length) && (
                                <p className="text-xs text-muted-foreground italic">Klik 'Enhance' untuk saran.</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
                {selectedFiles.length} file terpilih.
            </p>
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto min-w-[200px] h-14 text-lg">
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                {isSubmitting ? 'Menerbitkan...' : 'Terbitkan Karya'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
