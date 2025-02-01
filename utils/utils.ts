import { redirect } from "next/navigation";
import * as chains from "viem/chains";
/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

type ChainAttributes = {
  // color | [lightThemeColor, darkThemeColor]
  color: string | [string, string];
  // Used to fetch price by providing mainnet token address
  // for networks having native currency other than ETH
  nativeCurrencyTokenAddress?: string;
  icon?: string;
};

export const getChainNameForMoralis = (id: number) => {
  switch (id) {
    case 1:
      return "eth";
    case 42161:
      return "arbitrum";
    case 10:
      return "optimism";
    case 8453:
      return "base";
    case 137:
      return "polygon";
    default:
      return "eth";
  }
};

export function getBlockExplorerAddressLink(
  address: string,
  network: chains.Chain = chains.mainnet,
) {
  const blockExplorerBaseURL = network.blockExplorers?.default?.url;
  if (network.id === chains.hardhat.id) {
    return `/blockexplorer/address/${address}`;
  }

  if (!blockExplorerBaseURL) {
    return `https://etherscan.io/address/${address}`;
  }

  return `${blockExplorerBaseURL}/address/${address}`;
}

export const NETWORKS_EXTRA_DATA: Record<string, ChainAttributes> = {
  [chains.mainnet.id]: {
    color: "#ff8b9e",
    icon: "/mainnet.svg",
  },
  [chains.base.id]: {
    color: "#0052ff",
    icon: "/base.svg",
  },
};
