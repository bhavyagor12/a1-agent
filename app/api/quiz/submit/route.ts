import {
  computeMaxScore,
  computeUserScore,
  getUserSession,
  saveUser,
} from "../../../../utils/quiz/index";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const session = await getUserSession(userId);
  if (!session) {
    return NextResponse.json(
      { error: "No quiz session found for this user." },
      { status: 400 },
    );
  }

  const metricsList = ["RT", "LA", "THB", "DMS"];
  const metricResults: { [key: string]: number } = {};

  for (const metric of metricsList) {
    const userScore = await computeUserScore(userId, metric);
    const maxScore = computeMaxScore(metric);
    const percentage = maxScore > 0 ? (userScore / maxScore) * 100 : 0;
    metricResults[metric] = Math.round(percentage);
  }

  const RT = metricResults["RT"];
  const LA = metricResults["LA"];
  const THB = metricResults["THB"];
  const DMS = metricResults["DMS"];

  const RAS = Math.round(RT * 0.4 + (100 - LA) * 0.3 + THB * 0.2 + DMS * 0.1);
  let archetype = "";
  if (RAS <= 35) archetype = "Conservative Guardian";
  else if (RAS <= 65) archetype = "Balanced Strategist";
  else if (RAS <= 85) archetype = "Maverick Gambler";
  else archetype = "Visionary Builder";
  await saveUser({ userId, personality: archetype, RT, LA, THB, DMS, RAS });
  return NextResponse.json({ metrics: metricResults, RAS, archetype });
}
