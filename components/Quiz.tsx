"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { notification } from "@/utils/notification";

interface Option {
  option: string;
  text: string;
  scores: {
    RT: number;
    LA: number;
  };
}

function formatQuestionId(id: string) {
  const match = id.match(/\d+/); // Extract the number from the ID
  if (match) {
    return `Question ${match[0]}`;
  }
  return "Question"; // Default fallback if no number is found
}

export default function Quiz({ questionId }: { questionId: string }) {
  const router = useRouter();
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
        userId: "123",
        questionId,
        option: selectedOption,
      }),
    });
    return response.json();
  };
  const submitAndAnswerMutation = useMutation({
    mutationFn: () => submitAnswer(),
    onSuccess: () => {
      router.push(`/quiz/${Number(questionId) + 1}`);
    },
    onError: (error) => {
      console.error("Error submitting answer:", error);
    },
  });
  if (!question) {
    return <div>Loading...</div>;
  }
  return (
    <div
      className="p-6 bg-white text-black rounded-2xl w-full shadow-lg relative h-[100vh] flex flex-col items-center justify-around"
      style={{
        backgroundImage: `url('${question.image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col  text-white items-center">
        <h2 className="text-lg font-bold text-center mb-4">
          {formatQuestionId(question.id)}
        </h2>
        <h2 className="text-lg font-bold text-center mb-4">
          {question.question}
        </h2>
      </div>

      {/* Input Fields */}
      <div className="space-y-3">
        {question.options.map((option: Option) => (
          <div
            key={option.option}
            onClick={() => setSelectedOption(option.option)}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border-2 transition-all 
    ${selectedOption === option.option ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white hover:border-gray-400"}`}
          >
            {option.text}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <Button
        className="w-full mt-4"
        onClick={() => {
          submitAndAnswerMutation.mutate();
        }}
      >
        {" "}
        Submit
      </Button>
    </div>
  );
}
