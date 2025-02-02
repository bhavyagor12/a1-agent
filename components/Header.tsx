"use client";
import WalletWrapper from "./WalletWrapper";
import { Pacifico } from "next/font/google";
import { redirect } from "next/navigation";
const pacifico = Pacifico({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});
export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <WalletWrapper
        className="min-w-[90px] mt-4"
        text="Get Started"
        withWalletAggregator={true}
      />
      <h1 className="text-lg font-semibold mt-4">
        <span className={pacifico.className} onClick={() => {
          redirect("/home")
        }}>Project Name</span>
      </h1>
    </header>
  );
}
