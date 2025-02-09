import { NextRequest, NextResponse } from "next/server";
import { chatAgent } from "@/utils/chatbot/agent";


export async function POST(req: NextRequest) {
  const { userId, userMessage } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  if (!userMessage) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
  
  try {
    const responseConversationHistory = await chatAgent(userId, userMessage);
    const finalMessages = [];
    console.log(responseConversationHistory);
    for(const message of responseConversationHistory) {
      finalMessages.push({
        type: message.type || "text",
        role: message.role,
        content: message.content,
      })
    }
    return NextResponse.json(finalMessages, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get response from model" + error },
      { status: 500 },
    );
  }
}
