import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateQuizOrFlashcard(notes: string, mode: "quiz" | "flashcard", size: number = 10) {
  // Truncate notes if they are too long for the context window
  const maxLength = 30000;
  const truncatedNotes = notes.length > maxLength
    ? notes.substring(0, maxLength) + "..."
    : notes;

  const prompt = mode === "quiz"
    ? `Create a quiz with exactly ${size} multiple-choice questions based on the following notes. 
       Return the response as a valid JSON array where each object has:
       1. "question": The question text.
       2. "options": An array of 4 possible answers.
       3. "correctAnswer": The index (0-3) of the correct answer in the options array.
       Notes: ${truncatedNotes}`
    : `Create exactly ${size} flashcards based on the following notes. 
       Return the response as a valid JSON array where each object has a "front" string and a "back" string.
       Notes: ${truncatedNotes}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates educational content. You always return content in the exact JSON format requested. Do not include any extra text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) throw new Error("Failed to generate content");

    const parsed = JSON.parse(content);
    // Handle cases where the model might wrap the array in a property like "quiz" or "flashcards"
    if (Array.isArray(parsed)) return parsed;
    if (parsed.quiz && Array.isArray(parsed.quiz)) return parsed.quiz;
    if (parsed.flashcards && Array.isArray(parsed.flashcards)) return parsed.flashcards;
    if (parsed.questions && Array.isArray(parsed.questions)) return parsed.questions;

    // Fallback: return the first array found in the object
    const firstArray = Object.values(parsed).find(v => Array.isArray(v));
    if (firstArray) return firstArray;

    return parsed;
  } catch (error) {
    console.error("AI Generation error:", error);
    throw error;
  }
}
