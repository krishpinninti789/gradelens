import { Button } from "@/components/ui/button";
import { Upload, BarChart3, FileText, Brain } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="p-3 bg-vprimary rounded-xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Grade<span className="text-vprimary">Lens</span>
              </h1>
            </div>
          </div>

          <h2 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            AI-Powered Student Performance Analysis
          </h2>

          <p className="text-xl leading-8 text-gray-600 mb-10">
            Transform student reports into actionable insights. Upload PDF
            reports and get comprehensive analysis with AI-powered
            recommendations, detailed charts, and downloadable report cards.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/upload">
              <Button
                size="lg"
                className="bg-vprimary hover:bg-vsecondary text-white px-8 py-3"
              >
                <Upload className="mr-2 h-5 w-5" />
                Analyze Report
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                variant="outline"
                size="lg"
                className="border-vprimary text-vprimary hover:bg-vprimary hover:text-white px-8 py-3 bg-transparent"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-vprimary/10">
                <Upload className="h-8 w-8 text-vprimary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Upload PDF Reports
              </h3>
              <p className="text-gray-600">
                Simply upload student PDF reports with marks and remarks
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-vprimary/10">
                <BarChart3 className="h-8 w-8 text-vprimary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                AI Analysis
              </h3>
              <p className="text-gray-600">
                Get detailed insights with charts and performance metrics
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-vprimary/10">
                <FileText className="h-8 w-8 text-vprimary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Download Reports
              </h3>
              <p className="text-gray-600">
                Generate and download comprehensive report cards
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
