import { createConfig, http } from "wagmi";
import { mainnet, base, optimism, polygon } from "wagmi/chains";
import * as chains from "viem/chains";

export const RPC_CHAIN_NAMES: Record<number, string> = {
  [chains.mainnet.id]: "eth-mainnet",
  [chains.goerli.id]: "eth-goerli",
  [chains.sepolia.id]: "eth-sepolia",
  [chains.optimism.id]: "opt-mainnet",
  [chains.optimismGoerli.id]: "opt-goerli",
  [chains.optimismSepolia.id]: "opt-sepolia",
  [chains.arbitrum.id]: "arb-mainnet",
  [chains.arbitrumGoerli.id]: "arb-goerli",
  [chains.arbitrumSepolia.id]: "arb-sepolia",
  [chains.polygon.id]: "polygon-mainnet",
  [chains.polygonMumbai.id]: "polygon-mumbai",
  [chains.polygonAmoy.id]: "polygon-amoy",
  [chains.astar.id]: "astar-mainnet",
  [chains.polygonZkEvm.id]: "polygonzkevm-mainnet",
  [chains.polygonZkEvmTestnet.id]: "polygonzkevm-testnet",
  [chains.base.id]: "base-mainnet",
  [chains.baseGoerli.id]: "base-goerli",
  [chains.baseSepolia.id]: "base-sepolia",
};

export const getAlchemyHttpUrl = (chainId: number) => {
  return RPC_CHAIN_NAMES[chainId]
    ? `https://${RPC_CHAIN_NAMES[chainId]}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    : undefined;
};

export const wagmiConfig = createConfig({
  chains: [mainnet, chains.base],
  ssr: true,
  transports: {
    [mainnet.id]: http(getAlchemyHttpUrl(1)),
    [base.id]: http(getAlchemyHttpUrl(8453)),
    [optimism.id]: http(getAlchemyHttpUrl(10)),
    [polygon.id]: http(getAlchemyHttpUrl(137)),
  },
});
