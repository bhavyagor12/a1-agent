/* ignor */
import { ethers } from "ethers";
import dotenv from "dotenv";
import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";

dotenv.config();

const { RPC_URL, PRIVATE_KEY, AAVE_LENDING_POOL_ADDRESS } = process.env;

if (!RPC_URL || !PRIVATE_KEY || !AAVE_LENDING_POOL_ADDRESS) {
  throw new Error("Missing environment variables");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);


const tokenAbi = [
  "function name() view returns (string)",
  "function nonces(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) external"
];

const poolAbi = [
  "function supplyWithPermit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode, uint256 deadline, uint8 permitV, bytes32 permitR, bytes32 permitS) external"
];

export async function supplyWithPermit(amount: Number, assetAddress: string) {
  const AAVE_LENDING_POOL_ADDRESS = "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5"
  const tokenContract = new ethers.Contract(assetAddress, tokenAbi, provider);
  const poolContract = new ethers.Contract(AAVE_LENDING_POOL_ADDRESS, poolAbi, wallet);

  const deadline = Math.floor(Date.now() / 1000) + 3600;

  const tokenName = await tokenContract.name();
  const nonce = await tokenContract.nonces(wallet.address);
  const chainId = (await provider.getNetwork()).chainId;

  const domain = {
    name: tokenName,
    version: "1",
    chainId: chainId,
    verifyingContract: assetAddress,
  };

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };

  const message = {
    owner: wallet.address,
    spender: AAVE_LENDING_POOL_ADDRESS,
    value: amount,
    nonce: nonce,
    deadline: deadline,
  };

  const signedPermit = await wallet.signTypedData(domain, types, message);
  const { v, r, s } = ethers.Signature.from(signedPermit);

  console.log("Permit signature:");
  console.log("v =", v);
  console.log("r =", r);
  console.log("s =", s);

  // Call supplyWithPermit
  const tx = await poolContract.supplyWithPermit(
    assetAddress,
    amount,
    wallet.address,
    0,
    deadline,
    v,
    r,
    s,
    { gasLimit: 2000000, gasPrice: (await provider.getFeeData()).gasPrice }
  );

  console.log("Transaction sent! Tx hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("Transaction confirmed in block:", receipt.blockNumber);
  return {
    "receipt": receipt, 
    "txHash": tx.hash
  };
}


export const depositUSDCToAave = new DynamicStructuredTool({
    name: "deposit-usdc-aave",
    description: "Deposits a specified amount of USDC tokens to Aave's protocol",
    schema: z.object({
      amount: z.number().describe("The amount of USDC tokens to deposit"),
      token: z.string().describe("The token to deposit (e.g., 'USDC')"),
    }),
    func: async ({ amount, token }) => {
      try {
        if (token !== "USDC") {
          throw new Error("Only USDC is supported for this operation");
        }
        const token_address = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
        const {receipt, txHash} = await supplyWithPermit(amount, token_address);
        console.log(receipt);
        if (receipt) {
          return `Deposited ${amount} ${token} to Aave on tx hash: ${txHash}`;
        }
        return `Deposited ${amount} ${token} to Aave on tx hash: ${txHash}`;
      } catch (error) {
        return error
      }
    }
  });
  