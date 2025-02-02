import path from "path";
import fs from "fs";
import { createClient } from "../supabase/browserclient.ts";

export function getQuizData() {
  const questionsFilePath = path.join(
    process.cwd(),
    "public",
    "questions.json",
  );
  let quizData;
  try {
    const fileContent = fs.readFileSync(questionsFilePath).toString();
    quizData = JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading questions.json:", error);
    process.exit(1);
  }
  return quizData;
}

export async function getUserSession(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_sessions")
    .select("question_id, answer")
    .eq("user_id", userId); // Removed .limit(10)

  if (error) {
    console.error("Error fetching user session:", error);
    return null;
  }

  return { answers: data || [] }; // Returning all the answers
}

// Save user answer to Supabase
export async function saveUserAnswer(
  userId: string,
  questionId: string,
  answer: string,
) {
  const supabase = createClient();
  const { error } = await supabase.from("user_sessions").upsert([
    {
      user_id: userId,
      question_id: questionId,
      answer: answer,
    },
  ]);
  if (error) {
    console.error("Error saving user answer:", error);
    return false;
  }
  return true;
}

// Compute max score for a metric (unchanged)
export function computeMaxScore(metric: string) {
  const quizData = getQuizData();
  let totalMax = 0;

  quizData.questions.forEach(
    (question: { metrics: string | string[]; options: any[] }) => {
      if (question.metrics.includes(metric)) {
        const maxForQuestion = question.options.reduce((max, opt) => {
          const score = opt.scores[metric] || 0;
          return score > max ? score : max;
        }, 0);
        totalMax += maxForQuestion;
      }
    },
  );

  return totalMax;
}

export async function saveUser({
  userId,
  personality: archetype,
  RT,
  LA,
  THB,
  DMS,
  RAS,
}: {
  userId: string;
  personality: string;
  RT: number;
  LA: number;
  THB: number;
  DMS: number;
  RAS: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.from("users").upsert([
    {
      user_id: userId,
      personality: archetype,
      RT,
      LA,
      THB,
      DMS,
      RAS,
    },
  ]);
  if (error) {
    console.error("Error saving user:", error);
    return error;
  }
  return data;
}

export async function getUser(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("user_id", userId).limit(1);
  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  return data[0];
}

// Compute user score for a metric
export async function computeUserScore(userId: string, metric: string) {
  const session = await getUserSession(userId);

  const userAnswers = session ? session.answers : [];
  const quizData = getQuizData();
  let totalScore = 0;

  // Create a unique set of answers by filtering out duplicates based on question_id
  const uniqueAnswers = Array.from(
    new Map(userAnswers.map((item) => [item.question_id, item])).values(),
  );

  // Iterate through each question in the quiz
  quizData.questions.forEach((question: any) => {
    if (question.metrics.includes(metric)) {
      const userAnswer = uniqueAnswers.find(
        (ans) => ans.question_id === question.id,
      );
      if (userAnswer) {
        const answerOption = userAnswer.answer;
        const selectedOption = question.options.find(
          (opt: any) => opt.option === answerOption,
        );
        if (selectedOption) {
          totalScore += selectedOption.scores[metric] || 0;
        }
      }
    }
  });
  return totalScore;
}
