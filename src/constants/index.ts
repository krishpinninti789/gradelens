import { Upload, Brain, BarChart3, Download } from "lucide-react";
import { CheckCircle, TrendingUp, Award, Users, Zap } from "lucide-react";

export const steps = [
  {
    name: "Upload PDF Report",
    description:
      "Upload student PDF reports containing marks, grades, and remarks.",
    icon: Upload,
    step: "01",
  },
  {
    name: "AI Processing",
    description:
      "Our AI extracts and analyzes student data using advanced algorithms.",
    icon: Brain,
    step: "02",
  },
  {
    name: "Generate Insights",
    description:
      "View detailed analytics with charts, trends, and performance metrics.",
    icon: BarChart3,
    step: "03",
  },
  {
    name: "Download Report",
    description:
      "Get comprehensive report cards with recommendations and insights.",
    icon: Download,
    step: "04",
  },
];

export const features = [
  {
    name: "Intelligent PDF Processing",
    description:
      "Advanced OCR and AI parsing to extract student data from any PDF format.",
    icon: Zap,
  },
  {
    name: "Performance Analytics",
    description:
      "Comprehensive charts and graphs showing student performance trends.",
    icon: TrendingUp,
  },
  {
    name: "AI-Powered Insights",
    description:
      "Get personalized recommendations and improvement suggestions.",
    icon: Award,
  },
  {
    name: "Batch Processing",
    description:
      "Analyze multiple student reports simultaneously for class insights.",
    icon: Users,
  },
  {
    name: "Detailed Reports",
    description:
      "Generate comprehensive report cards with merits and areas for improvement.",
    icon: CheckCircle,
  },
  {
    name: "Export & Download",
    description: "Download analysis reports in PDF format for easy sharing.",
    icon: Download,
  },
];
