import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 bg-vprimary rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">
            Grade<span className="text-vprimary">Lens</span>
          </span>
        </div>

        <div className="text-center">
          <p className="text-gray-400">
            © 2025 GradeLens. All rights reserved. Transforming education
            through AI-powered insights.
          </p>
        </div>
      </div>
    </footer>
  );
}
