import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import { encodeFunctionData, namehash } from "viem";
import { z } from "zod";
import { Decimal } from "decimal.js";

// Dont knwo why this exists
const REGISTER_BASENAME_PROMPT = `
This tool will register a Basename for the agent. The agent should have a wallet associated to register a Basename.
When your network ID is 'base-mainnet' (also sometimes known simply as 'base'), the name must end with .base.eth, and when your network ID is 'base-sepolia', it must ends with .basetest.eth.
Do not suggest any alternatives and never try to register a Basename with another postfix. The prefix of the name must be unique so if the registration of the
Basename fails, you should prompt to try again with a more unique name.
`;

async function getContractId(chainId: string, isMainnet: boolean): Promise<string> {
  return process.env.AAVE_LENDING_POOL_ADDRESS || "";
}


export const L2_RESOLVER_ADDRESS_MAINNET = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD";
export const L2_RESOLVER_ADDRESS_TESTNET = "0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA";


// Relevant ABI for L2 Resolver Contract.
export const L2_RESOLVER_ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "node", type: "bytes32" },
      { internalType: "address", name: "a", type: "address" },
    ],
    name: "setAddr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "node", type: "bytes32" },
      { internalType: "string", name: "newName", type: "string" },
    ],
    name: "setName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const tokenAbi = [
    "function name() view returns (string)",
    "function nonces(address) view returns (uint256)",
    "function approve(address spender, uint256 amount) external"
];
  
const AAVE_POOL_ABI = [
    "function supplyWithPermit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode, uint256 deadline, uint8 permitV, bytes32 permitR, bytes32 permitS) external",
    "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) public virtual override",
];


/**
 * Input schema for registering a Basename.
 */
export const depositUSDCtoAAVEInput = z
  .object({
    amount: z.string().describe("The amount of USDC to to lend in AAVE's protocol"),
    user_address: z.string().describe("The user's address where we will send back the AAVE tokens"),
  })
  .strip()
  .describe("Deposits USDC tokens to Aave's protocol from the agnents wallet. Also needs the users address to send him the AAVE tokens back");

/**
 * Creates registration arguments for Basenames.
 *
 * @param baseName - The Basename (e.g., "example.base.eth" or "example.basetest.eth").
 * @param addressId - The Ethereum address.
 * @param isMainnet - True if on mainnet, False if on testnet.
 * @returns Formatted arguments for the register contract method.
 */
function createRegisterContractMethodArgs(
  baseName: string,
  addressId: string,
  isMainnet: boolean,
): object {
  const l2ResolverAddress = isMainnet ? L2_RESOLVER_ADDRESS_MAINNET : L2_RESOLVER_ADDRESS_TESTNET;
  const suffix = isMainnet ? ".base.eth" : ".basetest.eth";

  const addressData = encodeFunctionData({
    abi: L2_RESOLVER_ABI,
    functionName: "setAddr",
    args: [namehash(baseName), addressId],
  });
  const nameData = encodeFunctionData({
    abi: L2_RESOLVER_ABI,
    functionName: "setName",
    args: [namehash(baseName), baseName],
  });

  const registerArgs = {
    request: [
      baseName.replace(suffix, ""),
      addressId,
      l2ResolverAddress,
      [addressData, nameData],
      true,
    ],
  };

  return registerArgs;
}

export async function createSupplyWithArgs(
    amount: number,
    assetAddress: string,
    wallet: Wallet,
    user_address: string,
) {
    try{
        const AAVE_LENDING_POOL_ADDRESS = await getContractId(wallet.getNetworkId(), true);
        const tokenApproveInvocation = await wallet.invokeContract({
            contractAddress: assetAddress,
            method: "approve",
            args:[AAVE_LENDING_POOL_ADDRESS, amount],
            abi: tokenAbi,
            amount: new Decimal(amount),
            assetId: "USDC",
        });
        await tokenApproveInvocation.wait();
        const aaveSupplyInvocation = await wallet.invokeContract({
            contractAddress: AAVE_LENDING_POOL_ADDRESS,
            method: "supply",
            args: [
                assetAddress,
                amount,
                user_address,
                0,
            ],
            abi: AAVE_POOL_ABI,
            amount: new Decimal(amount),
            assetId: "USDC",
        })
        await aaveSupplyInvocation.wait();
        return true;
    } catch (error) {
        return error;
    }
}

/**
 * This function deposits USDC tokens to Aave's protocol.
 * @param wallet 
 * @param args 
 * @returns 
 */
export async function depositUSDCToAave(
  wallet: Wallet,
  args: z.infer<typeof depositUSDCtoAAVEInput>,
): Promise<string> {
  const addressId = (await wallet.getDefaultAddress()).getId();
  const isMainnet = wallet.getNetworkId() === Coinbase.networks.BaseMainnet;


  try {
    const contractAddress = await getContractId(wallet.getNetworkId(), isMainnet);
    const txHash = await createSupplyWithArgs(
      Number(args.amount),
      contractAddress,
      wallet,
      args.user_address,
    );
    console.log(txHash);
    return `Successfully deposited USDC ${args.amount} for address ${addressId}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    return `Error depositing USDC to AAVE: Error: ${error}`;
  }
}