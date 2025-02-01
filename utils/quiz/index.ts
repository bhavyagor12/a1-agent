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

export async function createUserSession(userId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("user_sessions")
    .insert([{ user_id: userId }]);
  if(error) {
    console.error("Error creating user session:", error);
    return error;
  }
  return true;
}

// Get user session from Supabase
export async function getUserSession(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_sessions")
    .select("question_id, answer")
    .eq("user_id", userId)
    .limit(1);

  if (error) {
    console.error("Error fetching user session:", error);
    return null;
  }

  return { answers: data[0] || {} };
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

// Compute user score for a metric
export async function computeUserScore(userId: string, metric: string) {
  const session = await getUserSession(userId);
  const userAnswers: { [key: string]: string } = session ? session.answers : {};
  const quizData = getQuizData();

  let totalScore = 0;
  quizData.questions.forEach(
    (question: {
      metrics: string | string[];
      id: string | number;
      options: any[];
    }) => {
      if (question.metrics.includes(metric)) {
        const answerOption = userAnswers[question.id];
        if (answerOption) {
          const selectedOption = question.options.find(
            (opt) => opt.option === answerOption,
          );
          if (selectedOption) {
            totalScore += selectedOption.scores[metric] || 0;
          }
        }
      }
    },
  );

  return totalScore;
}
