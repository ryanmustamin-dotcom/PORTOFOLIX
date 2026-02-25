'use server';
/**
 * @fileOverview An AI agent that suggests relevant tags, keywords, and an initial draft for project descriptions.
 *
 * - aiEnhancedProjectDescription - A function that handles the AI-enhanced project description generation process.
 * - AiEnhancedProjectDescriptionInput - The input type for the aiEnhancedProjectDescription function.
 * - AiEnhancedProjectDescriptionOutput - The return type for the aiEnhancedProjectDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AiEnhancedProjectDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the project.'),
  briefDescription: z
    .string()
    .describe('A brief, initial description provided by the user.'),
  category: z.string().describe('The main category of the project (e.g., Photography, Digital Art, Illustration).'),
  mediaDataUris: z.array(
    z.string().describe(
      "A media file (image or video) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
  ).optional().describe('An array of media files associated with the project.'),
});
export type AiEnhancedProjectDescriptionInput = z.infer<typeof AiEnhancedProjectDescriptionInputSchema>;

// Output Schema
const AiEnhancedProjectDescriptionOutputSchema = z.object({
  suggestedTags: z.array(z.string()).describe('An array of relevant tags for the project.'),
  suggestedKeywords: z.array(z.string()).describe('An array of relevant keywords for the project.'),
  descriptionDraft: z.string().describe('An initial draft for the project description.'),
});
export type AiEnhancedProjectDescriptionOutput = z.infer<typeof AiEnhancedProjectDescriptionOutputSchema>;

// Wrapper function
export async function aiEnhancedProjectDescription(
  input: AiEnhancedProjectDescriptionInput
): Promise<AiEnhancedProjectDescriptionOutput> {
  return aiEnhancedProjectDescriptionFlow(input);
}

// Prompt definition
const aiEnhancedProjectDescriptionPrompt = ai.definePrompt({
  name: 'aiEnhancedProjectDescriptionPrompt',
  input: {schema: AiEnhancedProjectDescriptionInputSchema},
  output: {schema: AiEnhancedProjectDescriptionOutputSchema},
  prompt: `You are an AI assistant specialized in creative project descriptions for an art portfolio website like Behance. Your task is to analyze the provided project details and media, then generate relevant tags, keywords, and an initial draft for the project description.

Ensure the output is in JSON format, strictly adhering to the following schema:
\`\`\`json
{{jsonSchema OutputSchema}}
\`\`\`

Here are the project details:
Title: {{{title}}}
Brief Description: {{{briefDescription}}}
Category: {{{category}}}

{{#if mediaDataUris}}
Media for analysis (if provided and relevant to the brief description):
{{#each mediaDataUris}}
  {{media url=this}}
{{/each}}
{{/if}}

Generate:
1.  **Suggested Tags**: A list of 5-10 relevant tags to help categorize the project and improve discoverability.
2.  **Suggested Keywords**: A list of 5-10 keywords that describe the project's content, style, and themes.
3.  **Description Draft**: A compelling and detailed draft of the project description (2-4 paragraphs). It should expand on the brief description, highlighting creative process, unique aspects, inspirations, and technical details (if suggested by the content). Make it engaging and professional.
`,
});

// Flow definition
const aiEnhancedProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'aiEnhancedProjectDescriptionFlow',
    inputSchema: AiEnhancedProjectDescriptionInputSchema,
    outputSchema: AiEnhancedProjectDescriptionOutputSchema,
  },
  async (input) => {
    const promptInput: Parameters<typeof aiEnhancedProjectDescriptionPrompt>[0] = {
      title: input.title,
      briefDescription: input.briefDescription,
      category: input.category,
    };

    if (input.mediaDataUris && input.mediaDataUris.length > 0) {
      promptInput.mediaDataUris = input.mediaDataUris;
    }

    const {output} = await aiEnhancedProjectDescriptionPrompt(promptInput);

    if (!output) {
      throw new Error('Failed to generate project description enhancements.');
    }
    return output;
  }
);
