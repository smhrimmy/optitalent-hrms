
'use server';

import { categorizeTicket, type CategorizeTicketInput, type CategorizeTicketOutput } from '@/ai/flows/categorize-ticket';

export async function categorizeTicketAction(input: CategorizeTicketInput): Promise<CategorizeTicketOutput> {
  try {
      if (!process.env.GOOGLE_GENAI_API_KEY) {
          console.warn("Missing GOOGLE_GENAI_API_KEY, skipping AI categorization.");
          return { category: 'General Inquiry', priority: 'Medium' };
      }
      return await categorizeTicket(input);
  } catch (error) {
      console.error("AI Categorization Error:", error);
      return { category: 'General Inquiry', priority: 'Medium' };
  }
}
