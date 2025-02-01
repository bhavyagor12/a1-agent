"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export const BannerToBQ = () => {
  const { push } = useRouter();
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
                push("/quiz/1");
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
