"use client";
import { BannerToBQ } from "@/components/BannerToBQ";
import MobileStatsCard from "@/components/DefiProtocols";
import Header from "@/components/Header";
import { NetworkCard } from "@/components/NetworkCard";
import { StatsCircles } from "@/components/stats-circles";
import TokenCard from "@/components/TokenCard";
import { moralisFetcher } from "@/utils/moralis/moralisFetcher";
import { useMemo } from "react";
import useSWR from "swr";
import { Address, isAddress } from "viem";
import { useAccount } from "wagmi";

export default function Home() {
  const { address } = useAccount();
  const shouldFetch = address && isAddress(address);
  const { data: erc20s } = useSWR(
    shouldFetch
      ? `https://deep-index.moralis.io/api/v2.2/market-data/erc20s/top-movers`
      : null,
    moralisFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    },
  );

  const gainers = useMemo(() => {
    if (!erc20s) return [];
    return erc20s.gainers
      .slice(0, 5)
      .map((token: any) => ({ ...token, gainer: true }));
  }, [erc20s]);
  const losers = useMemo(() => {
    if (!erc20s) return [];
    return erc20s.losers.slice(0, 5);
  }, [erc20s]);
  return (
    <div className="w-full h-[100vh] flex flex-col p-4 gap-4">
      <Header />
      <BannerToBQ />
      <div className="flex flex-col gap-3">
        <h1 className="text-[12px] font-bold text-white">Onchain activity</h1>{" "}
        <StatsCircles address={address as Address} />
        {/* <NetworkCard address={address as Address} chain={chains.base} /> */}
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-[12px] font-bold text-white">
          Gainers - ERC20 Tokens
        </h1>
        <div className="flex overflow-x-auto gap-4 mt-3 pb-4 scrollbar-hide flex-shrink-0">
          {gainers.map((token, index) => (
            <TokenCard key={index} tokenData={token} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-[12px] font-bold text-white">
          Losers - ERC20 Tokens
        </h1>
        <div className="flex overflow-x-auto gap-4 mt-3 pb-4 scrollbar-hide flex-shrink-0">
          {losers.map((token, index) => (
            <TokenCard key={index} tokenData={token} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-[12px] font-bold text-white">Defi Positions</h1>
        <MobileStatsCard address={address as Address} />
      </div>
    </div>
  );
}
