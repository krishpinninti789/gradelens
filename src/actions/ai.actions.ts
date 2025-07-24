"use server";

import type {
  PerplexityAnalysisRequest,
  PerplexityAnalysisResponse,
} from "@/types";

export async function analyzeWithPerplexity(
  request: PerplexityAnalysisRequest
): Promise<PerplexityAnalysisResponse> {
  try {
    const { studentData } = request;

    // Simulate real-time AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, integrate with Perplexity API:
    /*
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{
          role: 'user',
          content: `Analyze this student's performance in real-time:
            Student: ${studentData.name}
            Overall Percentage: ${studentData.overallPercentage}%
            Subjects: ${JSON.stringify(studentData.subjects)}
            
            Provide immediate insights:
            1. Key strengths and merits (5 points)
            2. Areas for improvement (5 points)  
            3. Specific actionable recommendations (7 points)
            
            Return as JSON: {strengths: [], improvements: [], recommendations: []}`
        }]
      })
    })

    const aiResponse = await response.json()
    return JSON.parse(aiResponse.choices[0].message.content)
    */

    // Real-time analysis based on actual data
    const overallPercentage = studentData.overallPercentage;
    const subjects = studentData.subjects;

    // Find performance patterns
    const bestSubject = subjects.reduce((best, current) =>
      current.marks / current.maxMarks > best.marks / best.maxMarks
        ? current
        : best
    );

    const worstSubject = subjects.reduce((worst, current) =>
      current.marks / current.maxMarks < worst.marks / worst.maxMarks
        ? current
        : worst
    );

    const averagePerformance =
      subjects.reduce(
        (sum, subject) => sum + (subject.marks / subject.maxMarks) * 100,
        0
      ) / subjects.length;

    // Generate contextual insights
    const performanceLevel =
      overallPercentage >= 85
        ? "excellent"
        : overallPercentage >= 75
        ? "good"
        : overallPercentage >= 65
        ? "satisfactory"
        : "needs improvement";

    return {
      strengths: [
        `Outstanding performance in ${bestSubject.name} with ${Math.round(
          (bestSubject.marks / bestSubject.maxMarks) * 100
        )}% - demonstrates strong aptitude`,
        `Overall ${performanceLevel} academic performance of ${overallPercentage}% shows consistent effort and understanding`,
        `Balanced performance across subjects indicates well-rounded academic development`,
        `Strong grasp of fundamental concepts as evidenced by consistent scoring patterns`,
        `Demonstrates good exam preparation and time management skills during assessments`,
      ],
      improvements: [
        `${
          worstSubject.name
        } needs focused attention - current performance at ${Math.round(
          (worstSubject.marks / worstSubject.maxMarks) * 100
        )}% has room for improvement`,
        `Work on strengthening weaker subject areas to achieve more balanced overall performance`,
        `Develop better study strategies for subjects scoring below ${Math.round(
          averagePerformance
        )}% average`,
        `Focus on understanding conceptual foundations rather than rote memorization`,
        `Improve consistency across all subjects to maximize overall academic potential`,
      ],
      recommendations: [
        `Dedicate 30% more study time to ${worstSubject.name} with focus on practice problems and concept clarification`,
        `Leverage strength in ${bestSubject.name} to build confidence and apply similar study methods to other subjects`,
        `Create a weekly revision schedule covering all subjects with emphasis on weaker areas`,
        `Seek additional help from teachers or tutors for subjects scoring below 75%`,
        `Use active learning techniques like summarizing, teaching others, and creating concept maps`,
        `Practice time management with mock tests to improve performance under exam conditions`,
        `Set specific, measurable goals for each subject and track progress weekly`,
      ],
    };
  } catch (error) {
    console.error("Real-time AI analysis failed:", error);

    // Fallback instant analysis
    return {
      strengths: [
        "Demonstrates consistent academic effort across subjects",
        "Shows good understanding of core educational concepts",
        "Maintains regular study habits and exam preparation",
        "Displays problem-solving capabilities in academic work",
        "Exhibits positive learning attitude and engagement",
      ],
      improvements: [
        "Focus on strengthening performance in challenging subject areas",
        "Develop more effective time management strategies for studies",
        "Increase practice with application-based and analytical questions",
        "Build stronger foundation in fundamental concepts",
        "Improve consistency in performance across all subjects",
      ],
      recommendations: [
        "Create a structured daily study schedule with dedicated time blocks",
        "Practice with previous exam papers and sample questions regularly",
        "Form study groups with classmates for collaborative learning",
        "Utilize online educational resources and interactive learning tools",
        "Set weekly academic goals and monitor progress consistently",
        "Seek immediate clarification from teachers when concepts are unclear",
        "Focus on understanding principles rather than memorizing facts",
      ],
    };
  }
}
