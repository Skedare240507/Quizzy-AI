"use server";

import { generateQuizOrFlashcard } from "@/lib/ai";
import { redirect } from "next/navigation";
import mammoth from "mammoth";
// PDF reader will be dynamically loaded inside the function to avoid bundling issues

async function extractTextFromFile(file: File): Promise<string> {
  console.log(`[Extraction] Starting: ${file.name} (${file.type}, ${file.size} bytes)`);
  
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileType = file.name.split(".").pop()?.toLowerCase();

  try {
    if (fileType === "txt") {
      return buffer.toString("utf-8");
    }

    if (fileType === "docx") {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    if (fileType === "pdf") {
      try {
        // Use dynamic import for ESM compatibility
        const pdfModule = await import("pdf-parse") as any;
        const parseFunc = typeof pdfModule === "function" ? pdfModule : 
                          (pdfModule.default ? pdfModule.default : pdfModule);

        const data = await parseFunc(buffer);
        const cleanText = data.text.replace(/\u0000/g, "").trim();
        
        if (cleanText.length < 5) {
          throw new Error("The PDF seems to be empty or contains only images/scans which cannot be read as text.");
        }
        
        return cleanText;
      } catch (err: any) {
        console.error("[PDF Parse Internal Error]:", err);
        throw new Error(`Failed to read PDF: ${err.message || "Unknown error"}. If this is a photo of a document, please paste the text manually.`);
      }
    }

    throw new Error(`Unsupported file type: .${fileType}`);
  } catch (error: any) {
    console.error(`[Extraction] Error for ${file.name}:`, error);
    throw new Error(error.message || `Could not extract text from ${file.name}.`);
  }
}

export async function generateContent(formData: FormData) {
  const notes = formData.get("notes") as string;
  const mode = formData.get("mode") as "quiz" | "flashcard";
  const size = parseInt(formData.get("size") as string || "10");
  const file = formData.get("file") as File | null;

  let finalNotes = notes || "";

  if (file && file.size > 0) {
    try {
      const extracted = await extractTextFromFile(file);
      finalNotes = extracted + "\n" + finalNotes;
    } catch (error: any) {
      console.error("[Backend] File extraction failed:", error);
      // If we have pasted notes, we can continue even if the file failed
      if (notes.trim().length > 0) {
        console.warn("[Backend] File extraction failed, but found pasted notes. Continuing...");
      } else {
        throw new Error(error.message);
      }
    }
  }

  if (!finalNotes.trim()) {
    throw new Error("No readable content found. Please upload a clear text PDF/DOCX or paste some text.");
  }

  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
    console.error("[Backend] Missing GROQ_API_KEY");
    throw new Error("AI Configuration missing. You need to add a valid GROQ_API_KEY to your .env.local file.");
  }

  let targetUrl = "";

  try {
    console.log(`[AI] Generating ${mode} (count: ${size}) from ${finalNotes.length} chars...`);
    const data = await generateQuizOrFlashcard(finalNotes, mode, size);
    
    // Save to local database history
    const { addSession } = await import("@/lib/db");
    const title = finalNotes.split("\n")[0].substring(0, 40) || "Untitled Session";
    const session = await addSession({
      title: title.length >= 40 ? title + "..." : title,
      type: mode === "quiz" ? "Quiz" : "Flash",
      data: data
    });

    const target = mode === "quiz" ? "/quiz" : "/flashcard";
    targetUrl = `${target}?id=${session.id}`;
    
    console.log(`[AI] Success. Preparing redirect to ${target}`);
  } catch (error: any) {
    if (error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error("[AI] Generation failed:", error);
    throw new Error(error.message || "AI failed to process. Try simplifying your text.");
  }

  if (targetUrl) {
    redirect(targetUrl);
  }
}
