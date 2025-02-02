import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("Webhook request", req.body);
    res.json({ message: "OK" });
 }