import { NextRequest } from "next/server";
import { createUserSession, getQuizData } from "../../../utils/quiz/index.ts";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = "123";
  const questionId = searchParams.get("questionId");
  if (!userId) {
    return new Response(JSON.stringify({ error: "userId is required" }), {
      status: 400,
    });
  }

  const sessionCreated = await createUserSession(userId);
  if (!sessionCreated) {
    return new Response(
      JSON.stringify({ error: "Failed to create user session" }),
      { status: 500 },
    );
  }

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
