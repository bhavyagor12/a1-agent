import dotenv from "dotenv";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import fs from "fs";


dotenv.config();

const { RPC_URL, PRIVATE_KEY, AAVE_LENDING_POOL_ADDRESS } = process.env;

if (!RPC_URL || !PRIVATE_KEY || !AAVE_LENDING_POOL_ADDRESS) {
  throw new Error("Missing environment variables");
}

const WALLET_DATA_FILE = "main_wallet_data.txt";

export let agent: any;

export const initialiseAgent = async () => {
  let walletDataStr: string | null = null;
  if (fs.existsSync(WALLET_DATA_FILE)) {
    try {
      walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
    } catch (error) {
      console.error("Error reading wallet data:", error);
      throw error;
    }
  }
  const config = {
    cdpWalletData: walletDataStr || undefined,
    networkId: process.env.NETWORK_ID || "base-sepolia",
  };
  const agentkit = await CdpAgentkit.configureWithWallet(config);
  
  // TODO: Uncomment this code to export the wallet data to a file
  // const exportedWallet = await agentkit.exportWallet();
  // fs.writeFileSync(WALLET_DATA_FILE, exportedWallet);

  const cdpToolkit = new CdpToolkit(agentkit);
  const tools = cdpToolkit.getTools();

  console.log("Tools:", tools);

  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
  });

  const memory = new MemorySaver();

  // Create React Agent using the LLM and CDP AgentKit tools
  agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: `
      You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
      empowered to interact onchain using your tools. If you ever need funds, you can request them from the 
      faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request 
      funds from the user. Before executing your first action, get the wallet details to see what network 
      you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
      asks you to do something you can't do with your currently available tools, you must say so, and 
      encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to 
      docs.cdp.coinbase.com for more information. Be concise and helpful with your responses. Refrain from 
      restating your tools' descriptions unless it is explicitly requested.
      `,
  });
}

export const chatAgent = async (userId: string, userMessage: string) => {
    if (!agent) {
        try{
            await initialiseAgent();
        } catch (error) {
            console.error("Failed to initialise agent", error);
            throw error;
        }
    }
    let conversationHistory: any[] = [];    
    conversationHistory.push({ type: "human", content: userMessage });
    try {
        const modelResponse = await agent.invoke(
        { messages: conversationHistory },
        { configurable: { thread_id: userId } },
        );
        conversationHistory = modelResponse.messages;
        return conversationHistory;
    } catch (error) {
        console.error("Failed to get response from model", error);
        return [];
    }
}
