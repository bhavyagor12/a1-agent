import { NextRequest } from "next/server";
import { getQuizData } from "../../../utils/quiz/index.ts";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const questionId = searchParams.get("questionId");
  const quizData = await getQuizData();
  const question = quizData.questions[Number(questionId) - 1];
  if (!quizData) {
    return new Response(JSON.stringify({ error: "Failed to get quiz data" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(question), {
    status: 200,
  });
}
