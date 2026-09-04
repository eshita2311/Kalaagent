import { Router } from "express";
import { getAllProducts } from "../services/catalog";

const router = Router();

/**
 * Agent-readable catalog endpoint.
 *
 * This exposes KalaAgent's product catalog in a structured, machine-queryable
 * format (schema.org Product/Offer shape) so an EXTERNAL AI buyer agent
 * (e.g. a shopping assistant querying on a user's behalf) can discover and
 * evaluate products WITHOUT going through KalaAgent's own chat interface.
 *
 * This is the core "agent-to-agent commerce" piece of the project: it's what
 * makes an unstructured artisan seller "transactable by an AI buyer agent",
 * per the brief. A real integration would also expose this via an MCP tool
 * or an ACP/AP2-style manifest; this REST endpoint is the data layer that
 * such an integration would sit on top of.
 */
router.get("/agent-catalog", (req, res) => {
  try {
    const products = getAllProducts();

    const structured = products.map((p) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      productID: p.id,
      name: p.name,
      category: p.craft_category,
      brand: {
        "@type": "Organization",
        name: p.workshop_name,
      },
      material: p.material,
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "artForm",
          value: p.art_form,
        },
        {
          "@type": "PropertyValue",
          name: "region",
          value: p.region,
        },
        {
          "@type": "PropertyValue",
          name: "giTagStatus",
          value: p.gi_tag_status,
        },
        {
          "@type": "PropertyValue",
          name: "trustScore",
          value: p.trust_score,
        },
      ],
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: p.price,
        availability: "https://schema.org/InStock",
      },
      image: p.image_url,
    }));

    res.json({
      "@context": "https://schema.org",
      "@type": "ItemList",
      description:
        "KalaAgent agent-readable catalog. Query this endpoint to discover authentic, GI-tag-verified Indian handicraft products. To purchase on behalf of a buyer, use POST /api/query with a natural-language request, then POST /api/checkout with the returned productId.",
      numberOfItems: structured.length,
      itemListElement: structured,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to build agent catalog" });
  }
});

export default router;
