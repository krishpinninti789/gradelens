"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  Download,
  User,
  Calendar,
  Hash,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
} from "lucide-react";
import type { StudentAnalysisProps } from "@/types";
import { SubjectBreakdown } from "./SubjectBreakDown";
import { PerformanceChart } from "./PerformanceChart";
import { RecommendationsCard } from "./RecommendationsCard";
import { generateInstantReport } from "@/actions";

export function StudentAnalysis({
  data,
  originalFileName,
}: StudentAnalysisProps & { originalFileName?: string }) {
  const handleDownloadReport = async () => {
    try {
      const result = await generateInstantReport(data);

      if (
        result.success &&
        result.fileContent &&
        result.fileName &&
        result.mimeType
      ) {
        // Create and trigger download on client side
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
      }
    } catch (error) {}
  };

  const getGradeColor = (grade: string) => {
    switch (grade.toUpperCase()) {
      case "A+":
      case "A":
        return "bg-vprimary text-white";
      case "B+":
      case "B":
        return "bg-blue-500 text-white";
      case "C+":
      case "C":
        return "bg-yellow-500 text-white";
      default:
        return "bg-red-500 text-white";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Real-time Performance Analysis
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-vprimary" />
              <p className="text-gray-600">
                Generated instantly • {new Date().toLocaleString()}
              </p>
            </div>
            {originalFileName && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <p className="text-gray-600">Source: {originalFileName}</p>
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={handleDownloadReport}
          className="bg-vprimary hover:bg-vsecondary text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Real-time Processing Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 bg-vprimary/10 text-vprimary px-4 py-2 rounded-full text-sm font-medium">
          <div className="w-2 h-2 bg-vprimary rounded-full animate-pulse"></div>
          Real-time AI Analysis Complete
        </div>
      </div>

      {/* Student Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-vprimary" />
              <div>
                <p className="text-sm text-gray-600">Student Name</p>
                <p className="text-lg font-semibold">{data.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Hash className="h-8 w-8 text-vprimary" />
              <div>
                <p className="text-sm text-gray-600">Roll Number</p>
                <p className="text-lg font-semibold">{data.rollNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-vprimary" />
              <div>
                <p className="text-sm text-gray-600">Class & Term</p>
                <p className="text-lg font-semibold">
                  {data.class} - {data.term}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <Badge
                  className={getGradeColor(data.overallGrade)}
                  variant="secondary"
                >
                  {data.overallGrade}
                </Badge>
                <p className="text-2xl font-bold text-vprimary mt-2">
                  {data.overallPercentage}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Grade</p>
                <Progress value={data.overallPercentage} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PerformanceChart data={data.performanceData} />
        <SubjectBreakdown subjects={data.subjects} />
      </div>

      {/* Subject Details */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Performance</CardTitle>
          <CardDescription>
            Detailed breakdown of marks and grades for each subject
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.subjects.map((subject, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{subject.name}</h3>
                  <Badge
                    className={getGradeColor(subject.grade)}
                    variant="secondary"
                  >
                    {subject.grade}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Marks Obtained</p>
                    <p className="text-xl font-bold text-vprimary">
                      {subject.marks}/{subject.maxMarks}
                    </p>
                    <Progress
                      value={(subject.marks / subject.maxMarks) * 100}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Percentage</p>
                    <p className="text-xl font-bold">
                      {Math.round((subject.marks / subject.maxMarks) * 100)}%
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Remarks</p>
                    <p className="text-sm">{subject.remarks}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-vprimary" />
              Strengths & Merits
            </CardTitle>
            <CardDescription>Areas where the student excels</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-vprimary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{strength}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-500" />
              Areas for Improvement
            </CardTitle>
            <CardDescription>
              Areas that need attention and focus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{improvement}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <RecommendationsCard recommendations={data.recommendations} />
    </div>
  );
}
