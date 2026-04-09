"use server";

import { generateQuizOrFlashcard } from "@/lib/ai";
import { redirect } from "next/navigation";
import mammoth from "mammoth";
import PDFParser from "pdf2json";

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileType = file.name.split(".").pop()?.toLowerCase();

  if (fileType === "txt") {
    return buffer.toString("utf-8");
  }

  if (fileType === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (fileType === "pdf") {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => {
        resolve(pdfParser.getRawTextContent());
      });
      pdfParser.parseBuffer(buffer);
    });
  }

  throw new Error("Unsupported file type");
}

export async function generateContent(formData: FormData) {
  const notes = formData.get("notes") as string;
  const mode = formData.get("mode") as "quiz" | "flashcard";
  const file = formData.get("file") as File | null;

  let finalNotes = notes || "";

  if (file && file.size > 0) {
    try {
      const extracted = await extractTextFromFile(file);
      finalNotes = extracted + "\n" + finalNotes;
    } catch (error) {
      console.error("File extraction error:", error);
      // Fallback to text if file extraction fails
    }
  }

  if (!finalNotes.trim()) {
    throw new Error("No content found to generate from.");
  }

  const data = await generateQuizOrFlashcard(finalNotes, mode, 10);
  const encodedData = encodeURIComponent(JSON.stringify(data));
  const target = mode === "quiz" ? "/quiz" : "/flashcard";

  redirect(`${target}?data=${encodedData}`);
}
