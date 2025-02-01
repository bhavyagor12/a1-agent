import {computeMaxScore, computeUserScore, getUserSession} from '../../../../utils/quiz/index.ts';
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const session = await getUserSession(userId);
    if (!session) {
      return res.status(400).json({ error: 'No quiz session found for this user.' });
    }
    if (!session) {
      return res.status(400).json({ error: 'No quiz session found for this user.' });
    }

    const userAnswers = session.answers;
    const metricsList = ['RT', 'LA', 'THB', 'DMS'];
    const metricResults: { [key: string]: number } = {};

    metricsList.forEach(async metric => {
      const userScore = computeUserScore(userId, metric);
      const maxScore = computeMaxScore(metric);
      const percentage = maxScore > 0 ? (await userScore / maxScore) * 100 : 0;
      metricResults[metric] = Math.round(percentage);
    });

    const RT = metricResults['RT'];
    const LA = metricResults['LA'];
    const THB = metricResults['THB'];
    const DMS = metricResults['DMS'];

    const RAS = Math.round((RT * 0.4) + ((100 - LA) * 0.3) + (THB * 0.2) + (DMS * 0.1));

    let archetype = '';
    if (RAS <= 35) archetype = 'Conservative Guardian';
    else if (RAS <= 65) archetype = 'Balanced Strategist';
    else if (RAS <= 85) archetype = 'Maverick Gambler';
    else archetype = 'Visionary Builder';

    res.json({ metrics: metricResults, RAS, archetype });
    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: 'Failed to create user session' }), { status: 500 });
 }