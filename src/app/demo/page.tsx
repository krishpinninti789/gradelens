import { StudentAnalysis } from "@/components/StudentAnalysis";
import type { StudentAnalysisData } from "@/types";

const demoData: StudentAnalysisData = {
  id: "demo-student",
  name: "Emma Johnson",
  rollNumber: "ST2024002",
  class: "Grade 9",
  term: "Final Term 2024",
  overallGrade: "B+",
  overallPercentage: 78,
  subjects: [
    {
      name: "Mathematics",
      marks: 75,
      maxMarks: 100,
      grade: "B+",
      remarks: "Good understanding, needs more practice",
    },
    {
      name: "Science",
      marks: 85,
      maxMarks: 100,
      grade: "A",
      remarks: "Excellent lab work and theory knowledge",
    },
    {
      name: "English",
      marks: 72,
      maxMarks: 100,
      grade: "B",
      remarks: "Creative writing skills, grammar needs work",
    },
    {
      name: "Social Studies",
      marks: 80,
      maxMarks: 100,
      grade: "A",
      remarks: "Strong research and presentation skills",
    },
  ],
  strengths: [
    "Excellent performance in Science with strong practical skills",
    "Good research and analytical abilities in Social Studies",
    "Creative approach to problem-solving",
    "Consistent effort and improvement over time",
    "Strong collaboration skills in group projects",
  ],
  improvements: [
    "Mathematics problem-solving speed needs improvement",
    "English grammar and sentence structure require attention",
    "Time management during examinations",
    "More consistent study habits needed",
    "Should participate more in class discussions",
  ],
  recommendations: [
    "Practice daily math problems to improve speed and accuracy",
    "Use grammar checking tools and practice exercises for English",
    "Create a structured study timetable with regular breaks",
    "Join study groups for peer learning and motivation",
    "Set small, achievable goals for each subject",
    "Use visual aids and diagrams for better concept understanding",
  ],
  performanceData: [
    { subject: "Math", percentage: 75 },
    { subject: "Science", percentage: 85 },
    { subject: "English", percentage: 72 },
    { subject: "Social Studies", percentage: 80 },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function DemoPage() {
  return (
    <div className="bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-vprimary/10 text-vprimary px-4 py-2 rounded-full text-sm font-medium mb-4">
            Demo Mode
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sample Student Analysis
          </h1>
          <p className="text-gray-600 mt-2">
            This is a demonstration of GradeLens analysis capabilities
          </p>
        </div>

        <StudentAnalysis data={demoData} />
      </div>
    </div>
  );
}
