import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, Lightbulb } from "lucide-react";
import type { RecommendationsCardProps } from "@/types";

export function RecommendationsCard({
  recommendations,
}: RecommendationsCardProps) {
  return (
    <Card className="border-vprimary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-vprimary" />
          AI-Powered Recommendations
        </CardTitle>
        <CardDescription>
          Personalized suggestions to improve student performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-vprimary/5 rounded-lg"
            >
              <Lightbulb className="h-5 w-5 text-vprimary mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
