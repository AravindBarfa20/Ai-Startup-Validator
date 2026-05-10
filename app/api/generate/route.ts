import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();
    if (!idea?.trim()) {
      return NextResponse.json({ error: "A startup idea is required." }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a ruthless, highly experienced Silicon Valley investor and startup analyst — think Y Combinator partner meets Marc Andreessen. Analyze the startup idea deeply and return ONLY a strict JSON object with no markdown, no extra text, and no code fences.

The JSON must have EXACTLY these keys:
- "score": integer 0-100 (investor rating)
- "verdict": exactly one of these strings: "BUILD IT", "PIVOT HARD", or "DEAD ON ARRIVAL"
- "roast": a brutal, witty 3-sentence reality check that highlights the core fatal flaws
- "strengths": array of exactly 2 strings — genuine strengths (even bad ideas have something)
- "tech_stack": array of exactly 4 modern technology names to build the MVP quickly
- "upgrades": array of exactly 4 strings — specific, actionable improvements that would increase the score significantly
- "competitors": array of exactly 3 objects, each with "name" (company/product name) and "note" (one sentence on how they already solve this or differ)
- "market_size": a string with the estimated Total Addressable Market (TAM) size in dollars, growth rate (CAGR), and the year range (e.g. "$4.2B by 2028, growing at 18% CAGR")
- "go_to_market": a 2-sentence go-to-market strategy focused on the first 100 customers
- "monetization": a string describing the ideal monetization model (pricing, tiers, revenue streams)`,
        },
        { role: "user", content: idea.trim() },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 1200,
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
