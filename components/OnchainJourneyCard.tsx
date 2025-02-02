import { Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import Image from "next/image";
import baseLogo from "../public/images/base_logo.png";
import { Address, isAddress } from "viem";
import useSWR from "swr";
import { moralisFetcher } from "@/utils/moralis/moralisFetcher";

const OnChainJourneyCard = ({ address }: { address: Address }) => {
  const shouldFetch = address && isAddress(address);
  const { data: journeyData } = useSWR(
    shouldFetch
      ? `https://deep-index.moralis.io/api/v2.2/wallets/${address}/chains`
      : null,
    moralisFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    },
  );
  if (journeyData === undefined || !shouldFetch) {
    return (
      <Card className="w-full max-w-[360px] rounded-xl p-4 shadow-lg border border-gray-200 animate-pulse">
        <CardHeader className="flex items-center space-x-3">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const chain = journeyData.active_chains[0];
  const { first_transaction, last_transaction } = chain;

  return (
    <Card className="w-full max-w-[360px] rounded-xl p-4 shadow-lg border border-gray-200">
      {/* Card Header */}
      <CardHeader className="flex items-center space-x-3">
        <Image
          src={baseLogo}
          alt="Base Logo"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="text-[14px] font-semibold">Base On-Chain Journey</h2>
        </div>
      </CardHeader>
      <CardContent className="mt-2">
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-gray-500" />
          <div>
            <p className="text-gray-500">First Transaction</p>
            <p className="font-bold">
              {new Date(first_transaction.block_timestamp).toDateString()}
            </p>
          </div>
        </div>

        {/* Last Transaction */}
        <div className="flex items-center gap-3">
          <Clock size={16} className="text-gray-500" />
          <div>
            <p className="text-gray-500">Last Transaction</p>
            <p className="font-bold">
              {new Date(last_transaction.block_timestamp).toDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnChainJourneyCard;
