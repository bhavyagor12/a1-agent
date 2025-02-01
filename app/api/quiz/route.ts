import {createUserSession, getQuizData} from '../../../utils/quiz/index.ts';
import type { NextApiRequest} from 'next'

export async function GET(req: NextApiRequest) {
  const queryParams = req.query;
  console.log(queryParams);
  const userId = "123";

  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId is required' }), { status: 400 });
  }

  const sessionCreated = await createUserSession(userId);
  if (!sessionCreated) {
    return new Response(JSON.stringify({ error: 'Failed to create user session' }), { status: 500 });
  }

  const quizData = await getQuizData();
  if (!quizData) {
    return new Response(JSON.stringify({ error: 'Failed to get quiz data' }), { status: 500 });
  }

  return new Response(JSON.stringify({ questions: quizData.questions }), { status: 200 });
}