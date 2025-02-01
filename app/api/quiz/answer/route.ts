import { NextResponse } from "next/server";
import { saveUserAnswer } from "../../../../utils/quiz/index.ts";

export async function POST(req: Request) {
  try {
    const { userId, questionId, option } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const answerUpdated = await saveUserAnswer(userId, questionId, option);

    if (!answerUpdated) {
      return NextResponse.json(
        { error: "Failed to save user answer" },
        { status: 500 },
      );
    }

    return NextResponse.json({ status: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
