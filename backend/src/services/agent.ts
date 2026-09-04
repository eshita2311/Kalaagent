import Groq from "groq-sdk";
import { getAllProducts } from "./catalog";
import { AgentDecision, Product } from "../types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are KalaAgent, an AI shopping agent that matches buyer
queries to a catalog of authentic, GI-tag-verified Indian handicrafts spanning
Painting, Pottery and Clay Craft, Textile and Fiber Craft, Basketry and Cane
Craft, Wood and Stone Craft, Metal Craft, and Paper Craft.

Rules you MUST follow:
1. Only recommend products that are actually in the catalog provided to you.
2. If the query asks for something not represented in the catalog (e.g. mass-
   produced items, items with no verifiable artisan origin, or a craft form
   not present), you MUST decline instead of guessing or substituting a
   loosely related product.
3. If the query is too vague to confidently narrow down (e.g. no budget, no
   craft type, no clear intent), decline and explain what's missing.
4. For every match, give a short, concrete reasoning string referencing the
   actual fields that justified the match (GI-tag status, region, craft
   category, price vs budget, art form).
5. Never fabricate authenticity claims beyond what the catalog data states.

Respond with ONLY valid JSON, no prose, no markdown fences, matching this
exact shape:
{
  "status": "matched" | "declined",
  "matches": [ { "product_id": string, "reasoning": string } ],
  "decline_reason": string | null
}`;

export async function runAgentQuery(queryText: string): Promise<AgentDecision> {
  const catalog = getAllProducts();

  const catalogSummary = catalog.map((p) => ({
    id: p.id,
    name: p.name,
    art_form: p.art_form,
    craft_category: p.craft_category,
    region: p.region,
    gi_tag_status: p.gi_tag_status,
    price: p.price,
    trust_score: p.trust_score,
  }));

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Buyer query: "${queryText}"\n\nCatalog:\n${JSON.stringify(catalogSummary, null, 2)}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content || "{}";

  let parsed: { status: "matched" | "declined"; matches: Array<{ product_id: string; reasoning: string }>; decline_reason: string | null };
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    return {
      status: "declined",
      matches: [],
      decline_reason: "Agent response could not be parsed. Declining rather than guessing.",
    };
  }

  if (parsed.status === "declined") {
    return {
      status: "declined",
      matches: [],
      decline_reason: parsed.decline_reason || "Unable to confidently match this request.",
    };
  }

  const productMap = new Map<string, Product>(catalog.map((p) => [p.id, p]));
  const matches = parsed.matches
    .filter((m) => productMap.has(m.product_id))
    .map((m) => ({ product: productMap.get(m.product_id)!, reasoning: m.reasoning }));

  if (matches.length === 0) {
    return {
      status: "declined",
      matches: [],
      decline_reason: "No products in the catalog satisfy this request confidently.",
    };
  }

  return { status: "matched", matches };
}
