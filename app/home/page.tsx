"use client";
import { BannerToBQ } from "@/components/BannerToBQ";
import Header from "@/components/Header";
import { NetworkCard } from "@/components/NetworkCard";
import { StatsCircles } from "@/components/stats-circles";
import TokenCard from "@/components/TokenCard";
import { Address } from "viem";
import { useAccount } from "wagmi";
import * as chains from "wagmi/chains";

const statsData = {
  nfts: "17",
  collections: "15",
  transactions: {
    total: "22",
  },
  nft_transfers: {
    total: "22",
  },
  token_transfers: {
    total: "29",
  },
};
const tokenData = {
  token_name: "Plume",
  token_symbol: "P",
  token_logo:
    "https://market-data-images.s3.us-east-1.amazonaws.com/tokenImages/0x79e2edd9d0d4a4f14d4b25215b088c4c1f80e3b7a4adc5208b6f27c828aeda16.png",
  token_decimals: "18",
  contract_address: "0x4c1746a800d224393fe2470c70a35717ed4ea5f1",
  price_usd: "0.165438",
  price_24h_percent_change: "10.40079",
  price_7d_percent_change: "17.11411380436263",
  gainer: true,
};
const tokens = [...Array(10).keys()].map(() => tokenData);

export default function Home() {
  const { address } = useAccount();
  return (
    <div className="w-full h-[100vh] flex flex-col p-4 gap-4">
      <Header />
      <BannerToBQ />
      <div className="flex flex-col gap-3">
        <h1 className="text-[12px] font-bold text-white">Onchain activity</h1>{" "}
        <StatsCircles data={statsData} />
        <NetworkCard address={address as Address} chain={chains.base} />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-[12px] font-bold text-white">
          Market Trending - ERC20 Tokens
        </h1>
        <div className="flex overflow-x-auto gap-4 mt-3 pb-4 scrollbar-hide flex-shrink-0">
          {tokens.map((token, index) => (
            <TokenCard key={index} tokenData={token} />
          ))}
        </div>
      </div>
    </div>
  );
}
