import { moralisFetcher } from "@/utils/moralis/moralisFetcher";
import {
  Circle,
  ShoppingBasketIcon as Collection,
  ArrowRightLeft,
  ArrowLeftRight,
  Coins,
  Loader,
} from "lucide-react";
import useSWR from "swr";
import { Address, isAddress } from "viem";

interface StatsData {
  nfts: string;
  collections: string;
  transactions: {
    total: string;
  };
  nft_transfers: {
    total: string;
  };
  token_transfers: {
    total: string;
  };
}

const ICON_SIZE = 12;

interface StatCircleProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export const StatCircle: React.FC<StatCircleProps> = ({ value, label, icon }) => (
  <div className="flex flex-col items-center">
    <div className="relative">
      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
        <div className="text-primary">{icon}</div>
      </div>
      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold">
        {value}
      </div>
    </div>
    <span className="mt-2 text-[8px] text-muted-foreground">{label}</span>
  </div>
);

export const StatsCircles: React.FC<{ address: Address }> = ({ address }) => {
  const shouldFetch = address && isAddress(address);

  const { data } = useSWR(
    shouldFetch
      ? `https://deep-index.moralis.io/api/v2.2/wallets/${address}/stats?chain=base`
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
  return (
    <div className="flex items-center justify-center gap-4">
      <StatCircle
        value={data.nfts}
        label="NFTs"
        icon={<Circle size={ICON_SIZE} />}
      />
      <StatCircle
        value={data.collections}
        label="Collections"
        icon={<Collection size={ICON_SIZE} />}
      />
      <StatCircle
        value={data.transactions.total}
        label="Transactions"
        icon={<ArrowRightLeft size={ICON_SIZE} />}
      />
      <StatCircle
        value={data.nft_transfers.total}
        label="NFT Transfers"
        icon={<ArrowLeftRight size={ICON_SIZE} />}
      />
      <StatCircle
        value={data.token_transfers.total}
        label="Token Transfers"
        icon={<Coins size={ICON_SIZE} />}
      />
    </div>
  );
};
