'use server';

/**
 * @fileOverview A flow that generates personalized encouraging messages based on user habits.
 *
 * - generateEncouragingMessage - A function that generates personalized encouraging messages.
 * - GenerateEncouragingMessageInput - The input type for the generateEncouragingMessage function.
 * - GenerateEncouragingMessageOutput - The return type for the generateEncouragingMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEncouragingMessageInputSchema = z.object({
  habitType: z
    .string()
    .describe('The type of habit the user is tracking (e.g., water, sleep, steps, meals, screen time).'),
  habitGoal: z.string().describe('The user specified goal for a given habit.'),
  habitProgress: z
    .number()
    .describe('The numerical progress the user has made toward their goal (e.g. 8 cups for water).'),
  streakLength: z
    .number()
    .describe('The number of consecutive days the user has maintained the habit.'),
});
export type GenerateEncouragingMessageInput = z.infer<typeof GenerateEncouragingMessageInputSchema>;

const GenerateEncouragingMessageOutputSchema = z.object({
  message: z.string().describe('A personalized encouraging message for the user.'),
});
export type GenerateEncouragingMessageOutput = z.infer<typeof GenerateEncouragingMessageOutputSchema>;

export async function generateEncouragingMessage(
  input: GenerateEncouragingMessageInput
): Promise<GenerateEncouragingMessageOutput> {
  return generateEncouragingMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEncouragingMessagePrompt',
  input: {schema: GenerateEncouragingMessageInputSchema},
  output: {schema: GenerateEncouragingMessageOutputSchema},
  prompt: `You are a motivational coach who provides encouraging messages to users based on their habit tracking data.

  Generate a personalized and uplifting message to encourage the user to maintain their streaks and improve their well-being.
  Take into account the habit type, the goal, the progress made, and the streak length to craft a relevant and impactful message.

  Habit Type: {{{habitType}}}
  Habit Goal: {{{habitGoal}}}
  Habit Progress: {{{habitProgress}}}
  Streak Length: {{{streakLength}}}

  Encouraging Message:`,
});

const generateEncouragingMessageFlow = ai.defineFlow(
  {
    name: 'generateEncouragingMessageFlow',
    inputSchema: GenerateEncouragingMessageInputSchema,
    outputSchema: GenerateEncouragingMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
