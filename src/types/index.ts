// Student-related types
export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  term: string;
  overallGrade: string;
  overallPercentage: number;
}

export interface Subject {
  name: string;
  marks: number;
  maxMarks: number;
  grade: string;
  remarks: string;
}

export interface PerformanceData {
  subject: string;
  percentage: number;
}

export interface StudentAnalysisData {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  term: string;
  overallGrade: string;
  overallPercentage: number;
  subjects: Subject[];
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  performanceData: PerformanceData[];
  createdAt?: Date;
  updatedAt?: Date;
}

// API-related types
export interface UploadResponse {
  success: boolean;
  reportId?: string;
  error?: string;
}

export interface AnalysisResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface DownloadResponse {
  success: boolean;
  fileName?: string;
  fileContent?: string;
  mimeType?: string;
  error?: string;
}

export interface PerplexityAnalysisRequest {
  studentData: {
    name: string;
    subjects: Array<{
      name: string;
      marks: number;
      maxMarks: number;
      remarks?: string;
    }>;
    overallPercentage: number;
  };
}

export interface PerplexityAnalysisResponse {
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  overallPercentage?: number;
}

// Component prop types
export interface StudentAnalysisProps {
  data: StudentAnalysisData;
}

export interface PerformanceChartProps {
  data: PerformanceData[];
}

export interface SubjectBreakdownProps {
  subjects: Subject[];
}

export interface RecommendationsCardProps {
  recommendations: string[];
}

export interface AnalysisPageProps {
  params: {
    id: string;
  };
}

// Form and UI types
export interface UploadFormData {
  file: File;
}

export interface GradeColorMap {
  [key: string]: string;
}

// Database types (for future use)
export interface DatabaseStudent extends Student {
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseAnalysis extends StudentAnalysisData {
  userId?: string;
  fileUrl?: string;
  originalFileName?: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface BarChartData {
  subject: string;
  percentage: number;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface SubjectProps {
  marks: number;
  name: string;
  maxMarks: number;
}
