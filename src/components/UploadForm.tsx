"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { uploadAndAnalyzeReport, generateInstantReport } from "@/actions";

import type { StudentAnalysisData } from "@/types";
import { StudentAnalysis } from "./StudentAnalysis";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [analysisData, setAnalysisData] = useState<StudentAnalysisData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Please select a PDF file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please select a PDF file");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setAnalysisData(null);

    try {
      // Step 1: Extract text from PDF
      setProcessingStep("Extracting text from PDF...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 2: Parse student data
      setProcessingStep("Parsing student information...");
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Step 3: AI Analysis
      setProcessingStep("Analyzing performance with AI...");
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadAndAnalyzeReport(formData);

      if (result.success && result.data) {
        setProcessingStep("Analysis complete!");
        setAnalysisData(result.data);
      } else {
        setError(result.error || "Failed to analyze report");
      }
    } catch (error) {
      console.error("Processing failed:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  const handleDownloadReport = async () => {
    if (!analysisData) return;

    try {
      const result = await generateInstantReport(analysisData);

      if (
        result.success &&
        result.fileContent &&
        result.fileName &&
        result.mimeType
      ) {
        // Create and trigger download
        const blob = new Blob([result.fileContent], { type: result.mimeType });
        const url = URL.createObjectURL(blob);
        const element = document.createElement("a");
        element.href = url;
        element.download = result.fileName;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      } else {
        setError("Failed to generate report");
      }
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download report");
    }
  };

  const resetForm = () => {
    setFile(null);
    setAnalysisData(null);
    setError(null);
    setProcessingStep("");
  };

  // Show analysis results if available
  if (analysisData) {
    return (
      <div className="space-y-6">
        {/* Success Header */}
        <Card className="border-vprimary/20 bg-vprimary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-vprimary" />
              <div>
                <h3 className="text-lg font-semibold text-vprimary">
                  Analysis Complete!
                </h3>
                <p className="text-gray-600">
                  Your student report has been analyzed successfully.
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <Button
                  onClick={handleDownloadReport}
                  className="bg-vprimary hover:bg-vsecondary text-white"
                >
                  Download Report
                </Button>
                <Button onClick={resetForm} variant="outline">
                  Analyze Another
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <StudentAnalysis data={analysisData} />
      </div>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Upload PDF Report
        </CardTitle>
        <CardDescription className="text-center">
          Get instant AI-powered analysis of student performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-vprimary bg-vprimary/5"
                : file
                ? "border-vprimary bg-vprimary/5"
                : "border-gray-300 hover:border-vprimary"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />

            <div className="space-y-4">
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-8 w-8 text-vprimary" />
                  <span className="text-lg font-medium text-vprimary">
                    {file.name}
                  </span>
                </div>
              ) : (
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
              )}

              <div>
                <p className="text-lg font-medium text-gray-900">
                  {file
                    ? "File selected"
                    : "Drop your PDF here, or click to browse"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  PDF files only, up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <div className="flex items-center gap-3 p-4 bg-vprimary/5 border border-vprimary/20 rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-vprimary" />
              <p className="text-vprimary font-medium">{processingStep}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!file || isProcessing}
            className="w-full bg-vprimary hover:bg-vsecondary text-white py-3"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Analyze Report Instantly
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
