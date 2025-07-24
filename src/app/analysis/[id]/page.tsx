import { StudentAnalysis } from "@/components/student-analysis";
import { getStudentAnalysis } from "@/lib/actions";
import { notFound } from "next/navigation";
import type { AnalysisPageProps } from "@/types/components";

const AnalysisPage = async ({ params }: AnalysisPageProps) => {
  const analysis = await getStudentAnalysis(params.id);

  if (!analysis) {
    notFound();
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <StudentAnalysis data={analysis} />
      </div>
    </div>
  );
};

export default AnalysisPage;
