'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bot, File as FileIcon, Loader2, Sparkles, UploadCloud, X } from 'lucide-react';

import { generateProjectDescription } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string().min(1, 'Please select a category.'),
  briefDescription: z.string().min(10, 'Brief description must be at least 10 characters.'),
  descriptionDraft: z.string().optional(),
  suggestedTags: z.array(z.string()).optional(),
  suggestedKeywords: z.array(z.string()).optional(),
  media: z.custom<FileList>().refine(files => files && files.length > 0, 'Please upload at least one file.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadForm() {
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const watchedMedia = form.watch('media');

  const handleEnhanceWithAI = async () => {
    const title = form.getValues('title');
    const briefDescription = form.getValues('briefDescription');
    const category = form.getValues('category');

    if (!title || !briefDescription || !category) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a title, brief description, and category before using AI enhancement.',
      });
      return;
    }

    setIsAiLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('briefDescription', briefDescription);
    formData.append('category', category);

    const result = await generateProjectDescription(formData);

    if (result.success && result.data) {
      form.setValue('descriptionDraft', result.data.descriptionDraft, { shouldValidate: true });
      form.setValue('suggestedTags', result.data.suggestedTags, { shouldValidate: true });
      form.setValue('suggestedKeywords', result.data.suggestedKeywords, { shouldValidate: true });
      toast({
        title: 'AI Enhancement Complete!',
        description: 'Your project description has been enhanced.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'AI Enhancement Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }
    setIsAiLoading(false);
  };
  
  const onSubmit = (values: FormValues) => {
    console.log(values);
    toast({
      title: "Project Submitted!",
      description: "Your project is now live on your profile."
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="media"
          render={({ field }) => (
            <FormItem>
              <Card>
                <CardHeader>
                  <CardTitle>Project Media</CardTitle>
                  <CardDescription>Upload images or videos for your project.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-dashed border-muted rounded-lg p-12 flex flex-col items-center justify-center text-center">
                      <UploadCloud className="h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">Click the button to browse files</p>
                      <FormControl>
                          <Input 
                              type="file"
                              className="hidden"
                              multiple
                              ref={fileInputRef}
                              onChange={(e) => field.onChange(e.target.files)}
                          />
                      </FormControl>
                      <Button type="button" variant="outline" className="mt-2" onClick={() => fileInputRef.current?.click()}>Browse Files</Button>
                    </div>

                    {watchedMedia && watchedMedia.length > 0 && (
                      <div className="mt-4">
                          <p className="text-sm font-medium">Selected files:</p>
                          <ul className="mt-2 space-y-2">
                            {Array.from(watchedMedia).map((file, index) => (
                                <li key={index} className="flex items-center justify-between p-2 border rounded-md bg-muted/50 text-sm">
                                  <div className="flex items-center gap-2 truncate">
                                      <FileIcon className="h-4 w-4 shrink-0" />
                                      <span className="truncate">{file.name}</span>
                                  </div>
                                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => {
                                        const dataTransfer = new DataTransfer();
                                        const files = form.getValues('media');
                                        if(files) {
                                            Array.from(files).filter((_, i) => i !== index).forEach(f => dataTransfer.items.add(f));
                                        }
                                        field.onChange(dataTransfer.files.length > 0 ? dataTransfer.files : null);
                                  }}>
                                      <X className="h-4 w-4"/>
                                  </Button>
                                </li>
                            ))}
                          </ul>
                      </div>
                    )}
                    <FormMessage className="mt-2" />
                </CardContent>
              </Card>
            </FormItem>
          )}
        />

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Tell us about your project. Start with the basics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'Abstract Cosmic Illustrations'" {...field} />
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
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Digital Art">Digital Art</SelectItem>
                      <SelectItem value="Photography">Photography</SelectItem>
                      <SelectItem value="UI/UX">UI/UX</SelectItem>
                      <SelectItem value="Branding">Branding</SelectItem>
                      <SelectItem value="Illustration">Illustration</SelectItem>
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
                  <FormLabel>Brief Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Briefly describe your project in one or two sentences." {...field} />
                  </FormControl>
                  <FormDescription>This will be used by our AI to help you write a full description.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI-Enhanced Description
                        </CardTitle>
                        <CardDescription>Let AI help you craft the perfect description, tags, and keywords.</CardDescription>
                    </div>
                    <Button type="button" onClick={handleEnhanceWithAI} disabled={isAiLoading} className="w-full sm:w-auto">
                        {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                        {isAiLoading ? 'Generating...' : 'Enhance with AI'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FormField
                    control={form.control}
                    name="descriptionDraft"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Description Draft</FormLabel>
                        <FormControl>
                            <Textarea rows={8} placeholder="AI-generated description will appear here." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                
                <FormField
                    control={form.control}
                    name="suggestedTags"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Suggested Tags</FormLabel>
                        <FormControl>
                            <div className="p-4 border rounded-md min-h-[4rem] flex flex-wrap gap-2">
                                {field.value?.length ? field.value.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                )) : <p className="text-sm text-muted-foreground">AI-suggested tags will appear here.</p>}
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="suggestedKeywords"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Suggested Keywords</FormLabel>
                        <FormControl>
                             <div className="p-4 border rounded-md min-h-[4rem] flex flex-wrap gap-2">
                                {field.value?.length ? field.value.map(keyword => (
                                    <Badge key={keyword} variant="secondary">{keyword}</Badge>
                                )) : <p className="text-sm text-muted-foreground">AI-suggested keywords will appear here.</p>}
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

            </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">Publish Project</Button>
        </div>
      </form>
    </Form>
  );
}
