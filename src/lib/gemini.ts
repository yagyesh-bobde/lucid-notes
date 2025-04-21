
// Wrap Edge Function call for Gemini summarization

import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export async function summarizeText(text: string, options: { maxLength?: number } = {}) {
  try {
    if (!text || text.trim().length === 0) {
      return "No text to summarize.";
    }
    
    const { data, error } = await supabase.functions.invoke("gemini-summarize", {
      body: { text, maxLength: options.maxLength ?? 100 },
    });
    
    if (error) {
      console.error("Supabase function error:", error);
      toast.error("Failed to generate summary");
      throw error;
    }
    
    if (!data?.summary) {
      console.error("No summary in response:", data);
      toast.error("Failed to generate summary");
      throw new Error("No summary received.");
    }
    
    return data.summary;
  } catch (error) {
    console.error("Gemini summarization error:", error);
    return "Error generating summary. Please try again.";
  }
}
