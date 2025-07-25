"use server";

import type {
  PerplexityAnalysisRequest,
  PerplexityAnalysisResponse,
} from "@/types";
import { generateText } from "ai";
import { perplexity } from "@ai-sdk/perplexity";

export async function analyzeWithPerplexity(
  request: PerplexityAnalysisRequest
): Promise<PerplexityAnalysisResponse> {
  try {
    const { studentData } = request;

    const prompt = `As an educational AI analyst, analyze this student's academic performance and provide detailed insights:

Student: ${studentData.name}
Overall Percentage: ${studentData.overallPercentage}%
Subjects and Performance:
${studentData.subjects
  .map(
    (subject) =>
      `- ${subject.name}: ${subject.marks}/${subject.maxMarks} (${Math.round(
        (subject.marks / subject.maxMarks) * 100
      )}%)${subject.remarks ? ` - ${subject.remarks}` : ""}`
  )
  .join("\n")}

Please provide a comprehensive analysis in the following JSON format:

{
  "strengths": [
    "List 5 specific strengths and merits based on the actual performance data"
  ],
  "improvements": [
    "List 5 specific areas for improvement based on the actual performance data"
  ],
  "recommendations": [
    "List 7 specific, actionable recommendations for academic improvement"
  ]
}

Guidelines:
- Base analysis on actual subject performance and grades
- Identify the strongest and weakest subjects
- Provide specific, actionable recommendations
- Consider the overall performance level (${studentData.overallPercentage}%)
- Make recommendations practical and achievable
- Focus on academic improvement strategies

Only return valid JSON. Do not include explanations outside the JSON structure.`;

    const result = await generateText({
      model: perplexity("sonar-pro"),
      prompt,
      maxTokens: 1500,
      temperature: 0.3, // Slightly higher for more creative insights
    });

    const output = result.text.trim();

    let cleanedOutput = output;
    if (cleanedOutput.startsWith("```json")) {
      cleanedOutput = cleanedOutput
        .replace(/```json\n?/, "")
        .replace(/\n?```$/, "");
    }
    if (cleanedOutput.startsWith("```")) {
      cleanedOutput = cleanedOutput
        .replace(/```\n?/, "")
        .replace(/\n?```$/, "");
    }

    try {
      const parsed = JSON.parse(cleanedOutput);

      // Validate the response structure - no fallbacks
      const validatedResponse: PerplexityAnalysisResponse = {
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        improvements: Array.isArray(parsed.improvements)
          ? parsed.improvements
          : [],
        recommendations: Array.isArray(parsed.recommendations)
          ? parsed.recommendations
          : [],
      };

      // Ensure we have actual data from AI - no fallbacks
      if (
        validatedResponse.strengths.length === 0 ||
        validatedResponse.improvements.length === 0 ||
        validatedResponse.recommendations.length === 0
      ) {
        throw new Error(
          "AI analysis returned incomplete data. Please try again."
        );
      }

      return validatedResponse;
    } catch (parseError) {
      throw new Error(
        "Failed to parse AI analysis response. Please try again."
      );
    }
  } catch (error) {
    throw new Error(
      `AI analysis failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
