"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
export const BannerToBQ = () => {
  const { push } = useRouter();
  const { address } = useAccount();
  const { data, isPending } = useQuery({
    queryKey: ["user", address],
    queryFn: async () => {
      const response = await fetch(`/api/user?userId=${address}`);
      return response.json();
    },
  });
  if (isPending) return <Loader className="w-10 h-10" />;
  return (
    <Card className="bg-[#1a1a1a] p-6 rounded-xl flex-shrink-0">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-10">
            <div className="space-y-1">
              <p className="text-[8px] uppercase text-white">
                Check your Risk Appetiate
              </p>
              <p className="text-white font-bold text-[10px]">
                know your risk appetite and understand your risk tolerance
              </p>
            </div>
          </div>
          <div className="w-[40%]">
            <Button
              className="text-[10px] p-2"
              onClick={() => {
                if (data.error || data.personality === "") {
                  push("/quiz/1");
                } else {
                  push("/quiz/result");
                }
              }}
            >
              Check Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
