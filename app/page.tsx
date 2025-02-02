"use client";
import WalletWrapper from "@/components/WalletWrapper";
import { Pacifico } from "next/font/google";
import baseLogo from "../public/images/base_logo.png";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
const pacifico = Pacifico({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});

export default function Landing() {
  const { address } = useAccount();
  const { push } = useRouter();
  return (
    <div
      className="w-full h-[100vh] flex flex-col gap-4 justify-center p-4"
      style={{
        background: "linear-gradient(to bottom, #1e3c72, #2a5298)", // Top-to-bottom gradient
        color: "white", // Ensuring text is readable
      }}
    >
      <Image src={baseLogo} alt="logo" width={50} height={50} />
      <h2 className={pacifico.className}>asset.</h2>
      <h1 className="text-[48px] font-bold">
        Allocate Assets <span className={pacifico.className}>Smart</span> and{" "}
        <span className={pacifico.className}>Simple</span>.
      </h1>
      <div className="flex items-center gap-4">
        <WalletWrapper
          className="min-w-[90px] mt-4"
          text="Get Started"
          withWalletAggregator={true}
        />
        {address && (
          <button
            className="bg-white text-black p-2 rounded-md mt-4 flex items-center justify-center"
            onClick={() => {
              push("/home");
            }}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
