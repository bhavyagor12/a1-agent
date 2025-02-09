import { DynamicStructuredTool } from "@langchain/core/tools";
import { supplyWithPermit } from "./utils";
import { z } from "zod";

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
  
  
