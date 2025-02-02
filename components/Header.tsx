"use client";
import WalletWrapper from "./WalletWrapper";
import { Pacifico } from "next/font/google";
import { redirect } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bot } from "lucide-react";
import { ChatModal } from "@/app/chat/chatModal";
import { useAccount } from "wagmi";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
const pacifico = Pacifico({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});
export default function Header() {
  const { address } = useAccount();
  return (
    <header className="flex items-center justify-between">
      <WalletWrapper
        className="min-w-[90px] mt-4"
        text="Get Started"
        withWalletAggregator={true}
      />

      <div className="text-lg font-semibold mt-4 flex items-center gap-2">
        <span
          className={pacifico.className}
          onClick={() => {
            redirect("/home");
          }}
        >
          Project Name
        </span>
        <Dialog>
          <DialogTrigger asChild>
            <Bot />
          </DialogTrigger>
          <DialogContent className="bg-gray-800 p-0 rounded-lg w-[360px] h-[640px]">
            <VisuallyHidden>
              <DialogTitle></DialogTitle>
            </VisuallyHidden>
            <ChatModal userId={address as string} />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
