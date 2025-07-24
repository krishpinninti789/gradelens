import { UploadForm } from "@/components/UploadForm";

export default function UploadPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Instant AI Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Upload your PDF report and get immediate AI-powered insights
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-vprimary">
              <div className="w-2 h-2 bg-vprimary rounded-full"></div>
              <span className="text-sm font-medium">Real-time Processing</span>
            </div>
            <div className="flex items-center gap-2 text-vprimary">
              <div className="w-2 h-2 bg-vprimary rounded-full"></div>
              <span className="text-sm font-medium">Instant Results</span>
            </div>
            <div className="flex items-center gap-2 text-vprimary">
              <div className="w-2 h-2 bg-vprimary rounded-full"></div>
              <span className="text-sm font-medium">No Storage Required</span>
            </div>
          </div>
        </div>

        <UploadForm />
      </div>
    </div>
  );
}
