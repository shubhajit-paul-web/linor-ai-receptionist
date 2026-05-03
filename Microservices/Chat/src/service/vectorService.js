const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Using integrated embedding — no separate embedding API needed
// Pinecone handles embedding internally with llama-text-embed-v2
const index = pc.index(process.env.PINECONE_INDEX_NAME || "Linor");

// ── Upsert medical knowledge chunk ────────────────────────────
const upsertKnowledge = async ({ id, text, metadata }) => {
  await index.upsertRecords([
    {
      id,
      text,       // Pinecone auto-embeds this field (field map: text)
      ...metadata,
    },
  ]);
};

// ── Query medical knowledge by patient message ─────────────────
const queryKnowledge = async ({ text, topK = 3, filter = {} }) => {
  const results = await index.searchRecords({
    query: {
      inputs: { text }, // Pinecone auto-embeds query too
      topK,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    },
    fields: ["text", "condition", "specialist", "urgency", "followupQuestions", "advice"],
  });

  return results.result?.hits || [];
};

module.exports = { upsertKnowledge, queryKnowledge };