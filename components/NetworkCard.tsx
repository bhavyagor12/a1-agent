import Link from "next/link";
import { TokensTable } from "./TokensTable";
import { Address, Chain, isAddress } from "viem";
import {
  getBlockExplorerAddressLink,
  getChainNameForMoralis,
} from "@/utils/utils";
import { moralisFetcher } from "@/utils/moralis/moralisFetcher";
import useSWR from "swr";

export const NetworkCard = ({
  chain,
  address,
}: {
  chain: Chain;
  address: Address;
}) => {
  const shouldFetch = address && isAddress(address);

  const { data: tokenBalancesData } = useSWR(
    shouldFetch
      ? `https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=${getChainNameForMoralis(
        chain.id,
      )}&exclude_spam=true&exclude_unverified_contracts=true&exclude_native=false`
      : null,
    moralisFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    },
  );

  if (tokenBalancesData === undefined || !shouldFetch) {
    return (
      <div className="card w-[370px] md:w-[425px] bg-base-100 shadow-xl flex-grow animate-pulse">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <div className="h-2 w-28 bg-slate-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-[370px] md:w-[425px] shadow-xl flex-grow">
      <div className="card-body">
        <h2 className="card-title whitespace-nowrap flex items-center gap-2">
          <Link
            href={getBlockExplorerAddressLink(address, chain)}
            rel="noopener noreferrer"
            target="_blank"
            className="flex items-center gap-2"
          >
            <span className="text-[10px]">{chain.name}</span>
          </Link>
        </h2>
        <TokensTable tokens={tokenBalancesData.result} />
      </div>
    </div>
  );
};
