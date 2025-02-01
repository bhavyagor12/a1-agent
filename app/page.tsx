import WalletWrapper from "@/components/WalletWrapper";
import { Pacifico } from "next/font/google";
import baseLogo from "../public/images/base_logo.png";
import Image from "next/image";
const pacifico = Pacifico({
  weight: ["400"],
  style: "normal",
  subsets: ["latin"],
});

export default function Landing() {
  return (
    <div
      className="w-full h-[100vh] flex flex-col gap-4 justify-center p-4"
      style={{
        background: "linear-gradient(to bottom, #1e3c72, #2a5298)", // Top-to-bottom gradient
        color: "white", // Ensuring text is readable
      }}
    >
      <Image src={baseLogo} alt="logo" width={50} height={50} />
      <h2 className={pacifico.className}>PROJECT NAME</h2>
      <h1 className="text-[48px] font-bold">
        Allocate Assets <span className={pacifico.className}>Smart</span> and{" "}
        <span className={pacifico.className}>Simple</span>.
      </h1>
      <WalletWrapper
        className="min-w-[90px] mt-4"
        text="Get Started"
        withWalletAggregator={true}
      />
    </div>
  );
}
