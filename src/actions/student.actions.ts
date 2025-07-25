"use server";

import type {
  UploadResponse,
  DownloadResponse,
  StudentAnalysisData,
  SubjectProps,
  PerplexityAnalysisResponse,
} from "@/types";
import PDFDocument from "pdfkit";

import pdfParse from "pdf-parse";
// import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { generateText } from "ai";
import { perplexity } from "@ai-sdk/perplexity";
import { analyzeWithPerplexity } from "./ai.actions";

export async function uploadAndAnalyzeReport(
  formData: FormData
): Promise<UploadResponse & { data?: StudentAnalysisData }> {
  try {
    const file = formData.get("file") as File;

    if (!file || file.type !== "application/pdf" || file.size === 0) {
      return {
        success: false,
        error: "Invalid or empty PDF file provided",
      };
    }

    const extractedText = await extractTextFromPDF(file);
    const parsedData = await parseStudentDataWithPerplexity(extractedText);

    const analysis = await analyzeWithPerplexity({
      studentData: {
        name: parsedData.name,
        subjects: parsedData.subjects,
        overallPercentage: parsedData.overallPercentage,
      },
    });

    const analysisData: StudentAnalysisData = {
      id: `instant_${Date.now()}`,
      name: parsedData.name,
      rollNumber: parsedData.rollNumber,
      class: parsedData.class,
      term: parsedData.term,
      overallGrade: calculateGrade(parsedData.overallPercentage),
      overallPercentage: parsedData.overallPercentage,
      subjects: parsedData.subjects.map((subject: SubjectProps) => ({
        ...subject,
        grade: calculateGrade((subject.marks / subject.maxMarks) * 100),
      })),
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      recommendations: analysis.recommendations,
      attendance: parsedData.attendance || "Not specified",
      behaviour: parsedData.behaviour || "Not specified",
      performanceData: parsedData.subjects.map((subject: SubjectProps) => ({
        subject: subject.name,
        percentage: Math.round((subject.marks / subject.maxMarks) * 100),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      success: true,
      reportId: analysisData.id,
      data: analysisData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const data = await pdfParse(buffer);

  if (!data.text || data.text.trim().length === 0) {
    throw new Error("No readable text found in PDF");
  }

  return data.text;
}

export async function generateInstantReport(
  analysisData: StudentAnalysisData
): Promise<DownloadResponse> {
  try {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Uint8Array[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    const pdfBufferPromise = new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    doc.font("Times-Roman");

    // Header
    doc.fontSize(16).fillColor("blue").text("Student Performance Report");
    doc.moveDown();

    // Student Info
    doc.fontSize(12).fillColor("black");
    doc.text(`Name: ${analysisData.name}`);
    doc.text(`Class: ${analysisData.class}`);
    doc.text(`Roll Number: ${analysisData.rollNumber}`);
    doc.moveDown();

    doc
      .fillColor("green")
      .text(
        `Overall: ${analysisData.overallPercentage}% - ${analysisData.overallGrade}`
      );
    doc.moveDown();

    doc.fillColor("black").text("Subject-wise Performance:");
    analysisData.subjects.forEach((subject) => {
      doc
        .fontSize(10)
        .text(
          `• ${subject.name}: ${subject.marks}/${subject.maxMarks} - ${subject.grade}`
        );
    });

    doc.end();

    const pdfBuffer = await pdfBufferPromise;
    const base64 = pdfBuffer.toString("base64");

    return {
      success: true,
      fileName: `${analysisData.name.replace(/\s+/g, "_")}_Report.pdf`,
      fileContent: base64,
      mimeType: "application/pdf",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Failed to generate PDF",
    };
  }
}

function calculateGrade(percentage: number): string {
  if (percentage >= 95) return "A+";
  if (percentage >= 85) return "A";
  if (percentage >= 75) return "B+";
  if (percentage >= 65) return "B";
  if (percentage >= 55) return "C+";
  if (percentage >= 45) return "C";
  if (percentage >= 35) return "D";
  return "F";
}

export async function parseStudentDataWithPerplexity(
  extractedText: string
): Promise<any> {
  const prompt = `Extract this student's data from the report:

${extractedText}

Return JSON with:
- name
- rollNumber
- class
- term
- attendance
- behaviour
- subjects: [{ name, marks, maxMarks, remarks }]
- overallPercentage`;

  const result = await generateText({
    model: perplexity("sonar-pro"),
    prompt,
    maxTokens: 1000,
    temperature: 0.1,
  });

  const output = result.text.trim();

  const start = output.indexOf("{");
  const end = output.lastIndexOf("}");

  const json = output.substring(start, end + 1);
  const parsed = JSON.parse(json);

  if (!parsed.name || !Array.isArray(parsed.subjects)) {
    throw new Error("Invalid data extracted from report");
  }

  if (!parsed.overallPercentage) {
    parsed.overallPercentage = Math.round(
      parsed.subjects.reduce(
        (sum: number, s: any) => sum + (s.marks / s.maxMarks) * 100,
        0
      ) / parsed.subjects.length
    );
  }

  return parsed;
}
