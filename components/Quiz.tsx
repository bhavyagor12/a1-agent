"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { notification } from "@/utils/notification";
import Loading from "@/app/loading";
import { useAccount } from "wagmi";

interface Option {
  option: string;
  text: string;
  scores: {
    RT: number;
    LA: number;
  };
}

function formatQuestionId(id: string) {
  const match = id.match(/\d+/);
  if (match) {
    return `Question ${match[0]}`;
  }
  return "Question";
}

export default function Quiz({ questionId }: { questionId: string }) {
  const { address } = useAccount();
  const { push } = useRouter();
  const { data: question } = useQuery({
    queryKey: ["question", questionId],
    queryFn: async () => {
      const response = await fetch(`/api/quiz?questionId=${questionId}`);
      return response.json();
    },
  });

  const [selectedOption, setSelectedOption] = useState<Option["option"] | null>(
    null,
  );

  const submitAnswer = async () => {
    if (!selectedOption) {
      notification.error("Please select an option");
      return;
    }
    if (questionId === "10") {
      return;
    }
    const response = await fetch("/api/quiz/answer", {
      method: "POST",
      body: JSON.stringify({
        userId: address,
        questionId,
        option: selectedOption,
      }),
    });
    return response.json();
  };
  const submitAndAnswerMutation = useMutation({
    mutationFn: () => submitAnswer(),
    onSuccess: () => {
      if (!selectedOption) return;
      push(`/quiz/${Number(questionId) + 1}`);
    },
    onError: (error) => {
      console.error("Error submitting answer:", error);
    },
  });
  if (!question) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <Loading />
      </div>
    );
  }
  return (
    <div className="relative w-full h-[100vh] flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-30 bg-cover bg-center"
        style={{ backgroundImage: `url('${question.image}')` }}
      ></div>

      <div className="relative z-10 flex flex-col items-center justify-around w-full h-full max-w-lg p-6 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold mb-2 text-white">
            {formatQuestionId(question.id)}
          </h2>
          <h2 className="text-[14px] font-bold text-white">
            {question.question}
          </h2>
        </div>

        <div className="w-full space-y-3">
          {question.options.map((option) => (
            <div
              key={option.option}
              onClick={() => setSelectedOption(option.option)}
              className={`flex items-center text-center p-3 rounded-lg cursor-pointer border-2 transition-all text-[12px] text-gray-900
                ${selectedOption === option.option ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white hover:border-gray-400"}`}
            >
              {option.text}
            </div>
          ))}
        </div>

        <Button
          className="w-full mt-4"
          onClick={() => submitAndAnswerMutation.mutate()}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
