"use client";
import WalletWrapper from "./WalletWrapper";

export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <WalletWrapper
        className="min-w-[90px] mt-4"
        text="Get Started"
        withWalletAggregator={true}
      />

      <h1 className="text-lg font-semibold mt-4">Project Name</h1>
    </header>
  );
}
