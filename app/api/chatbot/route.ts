import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { depositUSDCToAave } from "@/utils/chatbot/utils";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";


let conversationHistory: { [key: string]: any[] } = {};


export async function POST(req: NextRequest, res: NextResponse) {
    const { userId, userMessage } = await req.json();

    if (!userId || !userMessage) {
        return NextResponse.json(
            { error: "userId is required" },
            { status: 400 },
          );
    }

    const llm = new ChatOpenAI({
        model: "gpt-4o-mini",
    });

    const memory = new MemorySaver();
    const agentConfig = { configurable: { thread_id: userId } };

    const agent = createReactAgent({
      llm,
      tools: [depositUSDCToAave],
      checkpointSaver: memory,
      messageModifier: `
        You are a helpful DEFI agent that can interact onchain using the functions given to you. You are 
        empowered to interact onchain using your tools. If not, you can provide your wallet details and request 
        funds from the user. Before executing your first action, If someone askes to send USDC to AAVE. Ask them to send USDC to your wallet address. If they ask again then call the function accordingly. Make sure the user has entered how many USDC they want to send, if not ask again. 
        you're on. Your wallet_address is "0xb404912E4F942a18Aef2287bd605F3754158D516" dont give any other. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
        asks you to do something you can't do with your currently available tools, you must say so, Refrain from 
        restating your tools' descriptions unless it is explicitly requested. If a user explicitly asks to execute a tool do it without hesitating.
        `,
    });

    // Initialize memory for the user if not already created
    if (!conversationHistory[userId]) {
      conversationHistory[userId] = [];
    }

    // Add the user message to the conversation history
   
    conversationHistory[userId].push(new HumanMessage(userMessage));

    if (!userMessage) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    try {
        const modelResponse = await agent.invoke({ messages: conversationHistory[userId] }, agentConfig);
        conversationHistory[userId] = modelResponse.messages;
        return NextResponse.json(conversationHistory[userId], {
            status: 200,
        });
    } catch (error) {
      return NextResponse.json(
          { error: "Failed to get response from model" + error },
          { status: 500 },
      );
    }
  }
  