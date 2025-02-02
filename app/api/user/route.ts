import { getUser } from "@/utils/quiz";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  if (!userId)
    return new Response(JSON.stringify({ error: "No user ID" }), {
      status: 400,
    });
  const userData = await getUser(userId as string);
  if (!userData) {
    return new Response(JSON.stringify({ error: "Failed to get user data" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(userData), {
    status: 200,
  });
}
