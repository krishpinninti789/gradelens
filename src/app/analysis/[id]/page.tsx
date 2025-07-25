import { notFound } from "next/navigation";
import { StudentAnalysis } from "@/components/StudentAnalysis";

import { getStudentAnalysis } from "@/actions";

const AnalysisPage = async ({ params }: any) => {
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
