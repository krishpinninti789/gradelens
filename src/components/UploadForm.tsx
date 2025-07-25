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
  Eye,
  X,
  RotateCcw,
} from "lucide-react";
import { uploadAndAnalyzeReport, generateInstantReport } from "@/actions";

import type { StudentAnalysisData } from "@/types";
import { StudentAnalysis } from "./StudentAnalysis";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [analysisData, setAnalysisData] = useState<StudentAnalysisData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [showPdfPreview, setShowPdfPreview] = useState(false);

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
        setFileUrl(URL.createObjectURL(droppedFile));
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
        setFileUrl(URL.createObjectURL(selectedFile));
        setError(null);
      } else {
        setError("Please select a PDF file");
      }
    }
  };

  const handleRemoveFile = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFile(null);
    setFileUrl(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setAnalysisData(null);

    try {
      setProcessingStep("Extracting text from uploaded PDF...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProcessingStep("Parsing student information from your file...");
      await new Promise((resolve) => setTimeout(resolve, 800));

      setProcessingStep("Analyzing performance with AI...");

      // Only use the actual uploaded file
      const formData = new FormData();
      formData.append("file", file); // This should be the user's uploaded file only

      const result = await uploadAndAnalyzeReport(formData);

      if (result.success && result.data) {
        setProcessingStep("Analysis complete!");
        setAnalysisData(result.data);
      } else {
        setError(result.error || "Failed to analyze your uploaded report");
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
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFile(null);
    setFileUrl(null);
    setAnalysisData(null);
    setError(null);
    setProcessingStep("");
    setShowPdfPreview(false);
  };

  // Show analysis results if available
  if (analysisData) {
    return (
      <div className="space-y-6">
        {/* Success Header with Original PDF Info */}
        <Card className="border-vprimary/20 bg-vprimary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-vprimary" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-vprimary">
                  Analysis Complete!
                </h3>
                <p className="text-gray-600">
                  Analysis of <span className="font-medium">{file?.name}</span>{" "}
                  completed successfully.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  File size: {file ? (file.size / 1024 / 1024).toFixed(2) : 0}{" "}
                  MB • Processed: {new Date().toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                {fileUrl && (
                  <Button
                    onClick={() => setShowPdfPreview(true)}
                    variant="outline"
                    className="border-vprimary text-vprimary hover:bg-vprimary hover:text-white"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View PDF
                  </Button>
                )}
                <Button
                  onClick={handleDownloadReport}
                  className="bg-vprimary hover:bg-vsecondary text-white"
                >
                  Download Report
                </Button>
                <Button onClick={resetForm} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Analyze Another
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PDF Preview Modal */}
        {showPdfPreview && fileUrl && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">
                  Original PDF: {file?.name}
                </h3>
                <Button
                  onClick={() => setShowPdfPreview(false)}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 p-4">
                <iframe
                  src={fileUrl}
                  className="w-full h-[70vh] border rounded"
                  title="PDF Preview"
                />
              </div>
            </div>
          </div>
        )}

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
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-8 w-8 text-vprimary" />
                    <span className="text-lg font-medium text-vprimary">
                      {file.name}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p>Type: {file.type}</p>
                    <p>
                      Last modified:{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {fileUrl && (
                      <Button
                        type="button"
                        onClick={() => setShowPdfPreview(true)}
                        variant="outline"
                        size="sm"
                        className="border-vprimary text-vprimary hover:bg-vprimary hover:text-white"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview PDF
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={handleRemoveFile}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Drop your PDF here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PDF files only, up to 10MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* PDF Preview Modal */}
          {showPdfPreview && fileUrl && !analysisData && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-semibold">
                    PDF Preview: {file?.name}
                  </h3>
                  <Button
                    onClick={() => setShowPdfPreview(false)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 p-4">
                  <iframe
                    src={fileUrl}
                    className="w-full h-[70vh] border rounded"
                    title="PDF Preview"
                  />
                </div>
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>File:</strong> {file?.name}
                      </p>
                      <p>
                        <strong>Size:</strong>{" "}
                        {file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowPdfPreview(false)}
                      className="bg-vprimary hover:bg-vsecondary text-white"
                    >
                      Close Preview
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              <div className="flex-1">
                <p className="text-vprimary font-medium">{processingStep}</p>
                <p className="text-sm text-gray-600">
                  Processing: {file?.name}
                </p>
              </div>
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
                Processing {file?.name}...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Analyze Report Instantly
              </>
            )}
          </Button>

          {/* File Info Display */}
          {file && !isProcessing && (
            <div className="text-center text-sm text-gray-500">
              Ready to analyze:{" "}
              <span className="font-medium text-gray-700">{file.name}</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
