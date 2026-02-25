'use server';

import { aiEnhancedProjectDescription } from '@/ai/flows/ai-enhanced-project-description';
import type { AiEnhancedProjectDescriptionInput } from '@/ai/flows/ai-enhanced-project-description';
import { z } from 'zod';

const ActionInputSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  briefDescription: z.string().min(1, { message: 'Brief description is required.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
});

export async function generateProjectDescription(formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    briefDescription: formData.get('briefDescription'),
    category: formData.get('category'),
  };

  const validation = ActionInputSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid input. Please provide a title, brief description, and category.',
      data: null,
    };
  }

  try {
    const aiInput: AiEnhancedProjectDescriptionInput = {
      title: validation.data.title,
      briefDescription: validation.data.briefDescription,
      category: validation.data.category,
    };

    const result = await aiEnhancedProjectDescription(aiInput);
    
    return {
      success: true,
      error: null,
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to generate AI enhancements. Please try again.',
      data: null,
    };
  }
}
