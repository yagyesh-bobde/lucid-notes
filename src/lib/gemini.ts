// Google Generative AI SDK integration for note summarization

// Replace with your own API key if you have one
// In production, use environment variables for API keys
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Summarizes the given text using Google's Gemini API
 * 
 * @param text - The text content to summarize
 * @param options - Configuration options for the summary
 * @returns A promise that resolves to the summarized text
 */
export async function summarizeText(text: string, options: { maxLength?: number } = {}): Promise<string> {
  try {
    if (!text || text.trim().length === 0) {
      return "No text to summarize.";
    }

    // Use Gemini API key
    const apiKey = GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing Gemini API key");
      return "Error generating summary: Missing API key.";
    }

    // Prepare the request to the Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Please provide a concise summary of the following text in about ${options.maxLength || 100} words:\n\n${text}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the summary from the response
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected response structure:", data);
      throw new Error("Failed to parse Gemini API response");
    }
  } catch (error) {
    console.error("Error summarizing text with Gemini:", error);
    return "Error generating summary. Please try again later.";
  }
}