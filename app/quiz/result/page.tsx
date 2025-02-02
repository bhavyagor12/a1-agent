"use client";
import { personalities } from "@/assets/personalities";
import DefiStrategyCard from "@/components/defi-strategy";
import Header from "@/components/Header";
import PersonalityProfile from "@/components/PersonalityProfile";
import RadialProgress from "@/components/radical-progress";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useAccount } from "wagmi";

export default function Result() {
  const { address } = useAccount();
  const { data } = useQuery({
    queryKey: ["user", address],
    queryFn: async () => {
      const response = await fetch(`/api/user?userId=${address}`);
      return response.json();
    },
  });
  if (!data) return null;
  if (data.personality === "") {
    redirect("/quiz/1");
  }
  const personalityKey = data.personality as keyof typeof personalities;
  const imageSrc =
    personalities[personalityKey as keyof typeof personalities]?.image ??
    "/images/default.png";
  return (
    <div className="w-full h-[100vh] flex flex-col p-4 gap-4">
      <Header />
      <div className="flex flex-col gap-3">
        <h1 className="text-[12px] font-bold text-white">Scores</h1>
        <div className="flex overflow-x-auto gap-4 mt-3 pb-4 scrollbar-hide flex-shrink-0">
          <RadialProgress value={data.RT} label="Realistic Thinking" />
          <RadialProgress value={data.LA} label="Loss aversion" />
          <RadialProgress value={data.DMS} label="Decision making" />
          <RadialProgress value={data.THB} label="Time Horizon Bias" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-[14px] font-bold text-gray-400">
          Personality - {data.personality}
        </h1>
        <img
          src={imageSrc}
          alt="personality"
          className="rounded-lg w-full h-[175px]"
        />
        <p className="text-[10px] text-white">
          {personalities[personalityKey].description}
        </p>

        <div className="flex flex-col gap-1 mt-4">
          <h1 className="text-[14px] font-bold text-gray-400">
            Personality Traits
          </h1>
          <div className="flex overflow-x-auto gap-4 mt-3 pb-4 scrollbar-hide flex-shrink-0">
            <PersonalityProfile
              characteristics={personalities[personalityKey].characteristics}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-4">
          <h1 className="text-[14px] font-bold text-gray-400">
            Suggested DeFi Strategy
          </h1>

          <DefiStrategyCard
            strategy={personalities[personalityKey].defi.strategy}
            desiTwist={personalities[personalityKey].defi.desi_twist}
          />
        </div>
      </div>
    </div>
  );
}
