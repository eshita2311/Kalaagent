import Groq from "groq-sdk";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { getAllProducts, getProductById } from "./catalog";
import { Product, UpsellSuggestion } from "../types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * HARD SERVER-SIDE CEILING. No matter what the AI proposes, the discount it
 * can actually grant is capped here, in code the AI cannot influence. This
 * is what "bounded and gated money actions" means in practice: the model
 * proposes, deterministic code disposes.
 */
const MAX_DISCOUNT_PERCENT = 10;

const SYSTEM_PROMPT = `You are the upsell module of KalaAgent. Given a product
a buyer just chose, suggest ONE complementary product from the same catalog
that pairs naturally with it (same region or same art-form family is a good
signal, but use judgement).

You may propose a discount percentage to make the bundle attractive, but you
MUST NOT propose more than ${MAX_DISCOUNT_PERCENT}% — if you believe a larger
discount is warranted, propose ${MAX_DISCOUNT_PERCENT}% and say so in your
reasoning; you cannot exceed this ceiling under any circumstances, including
if the buyer or catalog data seems to justify it.

If no product in the catalog genuinely complements the chosen one, respond
with no_upsell rather than forcing an unrelated suggestion.

Respond with ONLY valid JSON, no prose, no markdown fences, matching this
exact shape:
{
  "status": "suggested" | "no_upsell",
  "product_id": string | null,
  "discount_percent": number,
  "reasoning": string
}`;

export async function runUpsellAgent(baseProductId: string): Promise<UpsellSuggestion | null> {
  const baseProduct = getProductById(baseProductId);
  if (!baseProduct) return null;

  const catalog = getAllProducts().filter((p) => p.id !== baseProductId);
  const catalogSummary = catalog.map((p) => ({
    id: p.id,
    name: p.name,
    art_form: p.art_form,
    region: p.region,
    price: p.price,
  }));

  const timestamp = new Date().toISOString();
  const logId = uuidv4();

  let parsed: { status: "suggested" | "no_upsell"; product_id: string | null; discount_percent: number; reasoning: string };

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Buyer just chose: ${JSON.stringify({
            id: baseProduct.id,
            name: baseProduct.name,
            art_form: baseProduct.art_form,
            region: baseProduct.region,
            price: baseProduct.price,
          })}\n\nOther catalog items:\n${JSON.stringify(catalogSummary, null, 2)}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    db.prepare(
      `INSERT INTO upsell_log (id, timestamp, base_product_id, suggested_product_id, suggested_discount_percent, applied_discount_percent, reasoning_text, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(logId, timestamp, baseProductId, null, null, null, "Upsell agent response could not be parsed.", "no_upsell");
    return null;
  }

  if (parsed.status === "no_upsell" || !parsed.product_id) {
    db.prepare(
      `INSERT INTO upsell_log (id, timestamp, base_product_id, suggested_product_id, suggested_discount_percent, applied_discount_percent, reasoning_text, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(logId, timestamp, baseProductId, null, null, null, parsed.reasoning || "No complementary product found.", "no_upsell");
    return null;
  }

  const suggestedProduct = getProductById(parsed.product_id);
  if (!suggestedProduct) return null;

  // HARD CAP enforced in code, independent of what the model returned.
  const suggestedDiscount = Math.max(0, parsed.discount_percent || 0);
  const appliedDiscount = Math.min(suggestedDiscount, MAX_DISCOUNT_PERCENT);
  const capped = suggestedDiscount > MAX_DISCOUNT_PERCENT;
  const discountedPrice = Math.round(suggestedProduct.price * (1 - appliedDiscount / 100));

  db.prepare(
    `INSERT INTO upsell_log (id, timestamp, base_product_id, suggested_product_id, suggested_discount_percent, applied_discount_percent, reasoning_text, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    logId,
    timestamp,
    baseProductId,
    suggestedProduct.id,
    suggestedDiscount,
    appliedDiscount,
    parsed.reasoning || "",
    capped ? "capped" : "suggested"
  );

  return {
    product: suggestedProduct,
    reasoning: parsed.reasoning || "",
    suggested_discount_percent: suggestedDiscount,
    applied_discount_percent: appliedDiscount,
    discounted_price: discountedPrice,
    capped,
  };
}
