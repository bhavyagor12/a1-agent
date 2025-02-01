import {saveUserAnswer} from '../../../../utils/quiz/index.ts';
import type { NextApiRequest} from 'next'

export async function POST(req: NextApiRequest) {
  const {userId, questionId, option} = req.body;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId is required' }), { status: 400 });
  }
  const answerUpdated = await saveUserAnswer(userId, questionId, option);
  if (!answerUpdated) {
    return new Response(JSON.stringify({ error: 'Failed to create user session' }), { status: 500 });
  }
  return new Response(JSON.stringify({ status : "Success" }), { status: 200 });
}