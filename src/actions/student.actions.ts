"use server";

import type {
  UploadResponse,
  DownloadResponse,
  StudentAnalysisData,
} from "@/types";
import { analyzeWithPerplexity } from "./ai.actions";

export async function uploadAndAnalyzeReport(
  formData: FormData
): Promise<UploadResponse & { data?: StudentAnalysisData }> {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (file.type !== "application/pdf") {
      return { success: false, error: "Only PDF files are supported" };
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return { success: false, error: "File size must be less than 10MB" };
    }

    // Step 1: Extract text from PDF (simulated - in production use pdf-parse)
    const extractedText = await extractTextFromPDF(file);

    // Step 2: Parse student data from extracted text
    const parsedData = await parseStudentData(extractedText);

    // Step 3: Analyze with AI immediately
    const analysis = await analyzeWithPerplexity({
      studentData: {
        name: parsedData.name,
        subjects: parsedData.subjects,
        overallPercentage: parsedData.overallPercentage,
      },
    });

    // Step 4: Create complete analysis data instantly
    const analysisData: StudentAnalysisData = {
      id: `instant_${Date.now()}`, // Temporary ID for instant processing
      name: parsedData.name,
      rollNumber: parsedData.rollNumber,
      class: parsedData.class,
      term: parsedData.term,
      overallGrade: calculateGrade(parsedData.overallPercentage),
      overallPercentage: parsedData.overallPercentage,
      subjects: parsedData.subjects.map((subject) => ({
        ...subject,
        grade: calculateGrade((subject.marks / subject.maxMarks) * 100),
      })),
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      recommendations: analysis.recommendations,
      performanceData: parsedData.subjects.map((subject) => ({
        subject: subject.name,
        percentage: Math.round((subject.marks / subject.maxMarks) * 100),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      success: true,
      reportId: analysisData.id,
      data: analysisData, // Return data immediately
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
    // Generate PDF report content instantly
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

// Helper function to extract text from PDF (simulated)
async function extractTextFromPDF(file: File): Promise<string> {
  // In production, use libraries like:
  // - pdf-parse
  // - PDF.js
  // - pdfjs-dist

  // Simulate PDF text extraction
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock extracted text that would come from actual PDF
  return `
    STUDENT REPORT CARD
    
    Student Name: John Smith
    Roll Number: ST2024${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}
    Class: Grade 10-A
    Term: Mid-Term Examination 2024
    
    SUBJECT-WISE MARKS:
    Mathematics: 85/100 - Good problem solving skills
    Science: 92/100 - Excellent practical work
    English: 78/100 - Needs improvement in grammar
    History: 88/100 - Strong analytical thinking
    Geography: 82/100 - Good map reading skills
    
    Overall Percentage: 85%
    Grade: A
  `;
}

// Helper function to parse student data from extracted text
async function parseStudentData(extractedText: string) {
  // In production, use NLP or regex patterns to extract structured data
  // For now, simulate parsing with realistic data

  const subjects = [
    {
      name: "Mathematics",
      marks: 85,
      maxMarks: 100,
      remarks: "Good problem solving skills",
    },
    {
      name: "Science",
      marks: 92,
      maxMarks: 100,
      remarks: "Excellent practical work",
    },
    {
      name: "English",
      marks: 78,
      maxMarks: 100,
      remarks: "Needs improvement in grammar",
    },
    {
      name: "History",
      marks: 88,
      maxMarks: 100,
      remarks: "Strong analytical thinking",
    },
    {
      name: "Geography",
      marks: 82,
      maxMarks: 100,
      remarks: "Good map reading skills",
    },
  ];

  const overallPercentage = Math.round(
    subjects.reduce(
      (sum, subject) => sum + (subject.marks / subject.maxMarks) * 100,
      0
    ) / subjects.length
  );

  return {
    name: `Student_${Date.now().toString().slice(-4)}`, // Would be extracted from PDF
    rollNumber: `ST2025${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`,
    class: "Grade 10-A",
    term: "Mid-Term Examination 2025",
    subjects,
    overallPercentage,
  };
}

// Helper function to generate PDF report content
async function generatePDFReport(
  analysis: StudentAnalysisData
): Promise<string> {
  // In production, use libraries like:
  // - jsPDF
  // - Puppeteer
  // - React-PDF
  // - PDFKit

  // For now, return formatted text content
  return `
GRADELENS - AI STUDENT PERFORMANCE ANALYSIS REPORT
================================================

STUDENT INFORMATION
------------------
Name: ${analysis.name}
Roll Number: ${analysis.rollNumber}
Class: ${analysis.class}
Term: ${analysis.term}
Overall Grade: ${analysis.overallGrade}
Overall Percentage: ${analysis.overallPercentage}%

SUBJECT-WISE PERFORMANCE
-----------------------
${analysis.subjects
  .map(
    (subject) =>
      `${subject.name}: ${subject.marks}/${subject.maxMarks} (${subject.grade}) - ${subject.remarks}`
  )
  .join("\n")}

STRENGTHS & MERITS
-----------------
${analysis.strengths
  .map((strength, index) => `${index + 1}. ${strength}`)
  .join("\n")}

AREAS FOR IMPROVEMENT
--------------------
${analysis.improvements
  .map((improvement, index) => `${index + 1}. ${improvement}`)
  .join("\n")}

AI-POWERED RECOMMENDATIONS
-------------------------
${analysis.recommendations
  .map((recommendation, index) => `${index + 1}. ${recommendation}`)
  .join("\n")}

PERFORMANCE SUMMARY
------------------
${analysis.performanceData
  .map((data) => `${data.subject}: ${data.percentage}%`)
  .join("\n")}

---
Report Generated: ${new Date().toLocaleString()}
Powered by GradeLens AI Analysis System
  `.trim();
}

// Helper function to calculate grade
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
