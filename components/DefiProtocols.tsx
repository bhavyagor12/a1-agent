import { BarChart2, DollarSign, Layers } from "lucide-react";
import { StatCircle } from "./stats-circles";
import { Address, isAddress } from "viem";
import useSWR from "swr";
import { moralisFetcher } from "@/utils/moralis/moralisFetcher";

const formatNumber = (num: number | null | undefined) => {
  if (!num || isNaN(num)) return "0"; // Handle invalid values gracefully
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
};

export default function MobileStatsCard({ address }: { address: Address }) {
  const shouldFetch = address && isAddress(address);

  const { data } = useSWR(
    shouldFetch
      ? `https://deep-index.moralis.io/api/v2.2/wallets/${address}/defi/summary?chain=base`
      : null,
    moralisFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    },
  );
  if (data === undefined || !shouldFetch) {
    return null;
  }
  const stats = [
    {
      value: data.active_protocols,
      label: "Active Protocols",
      icon: <Layers className="w-4 h-4" />,
    },
    {
      value: data.total_positions,
      label: "Total Positions",
      icon: <BarChart2 className="w-4 h-4" />,
    },
    {
      value: `$${data.total_usd_value.toLocaleString()}`,
      label: "Total USD Value",
      icon: <DollarSign className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-4 mt-2">
      {stats.map((stat, index) => (
        <StatCircle
          key={index}
          value={formatNumber(Number(stat.value))}
          label={stat.label}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
