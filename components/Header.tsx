"use client";
import { pacifico } from "@/app/page";
import WalletWrapper from "./WalletWrapper";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <WalletWrapper
        className="min-w-[90px] mt-4"
        text="Get Started"
        withWalletAggregator={true}
      />
      <h1 className="text-lg font-semibold mt-4">
        <span className={pacifico.className}>Project Name</span>
      </h1>
    </header>
  );
}
