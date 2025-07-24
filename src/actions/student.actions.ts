"use server";

import type {
  UploadResponse,
  DownloadResponse,
  StudentAnalysisData,
  SubjectProps,
} from "@/types";
import { analyzeWithPerplexity } from "./ai.actions";
import pdfParse from "pdf-parse";
import { PDFDocument } from "pdf-lib";
// import { parseStudentDataWithPerplexity } from "./parseWithPerplexity";
import { generateText } from "ai";
import { perplexity } from "@ai-sdk/perplexity";

export async function uploadAndAnalyzeReport(
  formData: FormData
): Promise<UploadResponse & { data?: StudentAnalysisData }> {
  try {
    const file = formData.get("file") as File;

    if (!file) return { success: false, error: "No file provided" };
    if (file.type !== "application/pdf")
      return { success: false, error: "Only PDF files are supported" };
    if (file.size > 10 * 1024 * 1024)
      return { success: false, error: "File size must be less than 10MB" };

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
    console.error("Upload and analysis failed:", error);
    return {
      success: false,
      error: "Failed to process report. Please try again.",
    };
  }
}

export async function generateInstantReport(
  analysisData: StudentAnalysisData
): Promise<DownloadResponse> {
  try {
    const reportContent = await generatePDFReport(analysisData);

    return {
      success: true,
      fileName: `${analysisData.name.replace(/\s+/g, "_")}_Analysis_Report.pdf`,
      fileContent: reportContent,
      mimeType: "application/pdf",
    };
  } catch (error) {
    console.error("Report generation failed:", error);
    return { success: false, error: "Failed to generate report" };
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const data = await pdfParse(buffer);
  return data.text;
}

async function generatePDFReport(data: StudentAnalysisData): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontSize = 12;
  let y = height - 50;

  function writeLine(line: string) {
    page.drawText(line, { x: 50, y, size: fontSize });
    y -= 20;
  }

  writeLine("GRADELENS - AI STUDENT PERFORMANCE REPORT");
  writeLine(`Name: ${data.name}`);
  writeLine(`Roll Number: ${data.rollNumber}`);
  writeLine(`Class: ${data.class}`);
  writeLine(`Term: ${data.term}`);
  writeLine(`Overall Grade: ${data.overallGrade}`);
  writeLine(`Overall Percentage: ${data.overallPercentage}%`);
  writeLine("");
  writeLine("Subjects:");
  data.subjects.forEach((s) => {
    writeLine(
      `  - ${s.name}: ${s.marks}/${s.maxMarks} (${s.grade}) - ${s.remarks}`
    );
  });
  writeLine("");
  writeLine("Strengths:");
  data.strengths.forEach((s, i) => writeLine(`  ${i + 1}. ${s}`));
  writeLine("Improvements:");
  data.improvements.forEach((s, i) => writeLine(`  ${i + 1}. ${s}`));
  writeLine("Recommendations:");
  data.recommendations.forEach((s, i) => writeLine(`  ${i + 1}. ${s}`));

  const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
  return pdfBytes;
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

export async function parseStudentDataWithPerplexity(extractedText: string) {
  const prompt = `
Given the following student report card text, extract the structured student performance data in the following JSON format:

{
  "name": string,
  "rollNumber": string,
  "class": string,
  "term": string,
  "subjects": [
    {
      "name": string,
      "marks": number,
      "maxMarks": number,
      "remarks": string
    }
  ],
  "overallPercentage": number
}

Text:
"""${extractedText}"""

Only return valid JSON. Do not explain anything else.
`;

  const result = await generateText({
    model: perplexity("sonar-small-online"), // You can use other models like "sonar-medium-online"
    prompt,
  });

  const output = result.text;

  try {
    const parsed = JSON.parse(output);
    return parsed;
  } catch (error) {
    console.error("Perplexity returned invalid JSON:", output);
    throw new Error("Failed to parse data from Perplexity.");
  }
}
