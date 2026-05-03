require("dotenv").config();
const { Pinecone } = require("@pinecone-database/pinecone");
const medicalKnowledge = require("../data/medicalKnowledge");

const seedMedicalKnowledge = async () => {
  try {
    console.log("🔄 Connecting to Pinecone...");
    
    // Validate environment variables
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("❌ PINECONE_API_KEY is not set in environment variables");
    }
    
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const indexName = process.env.PINECONE_INDEX_NAME || "Linor";
    console.log(`📍 Using Pinecone index: "${indexName}"`);
    
    // Verify the index exists
    console.log("🔍 Verifying index exists...");
    let index;
    try {
      await pc.describeIndex(indexName);
      console.log(`✅ Index "${indexName}" found`);
      index = pc.index(indexName);
    } catch (indexError) {
      if (indexError.message.includes("404")) {
        console.error(`❌ Index "${indexName}" does not exist in Pinecone`);
        console.error("Available options:");
        console.error("1. Create the index in Pinecone console");
        console.error("2. Check PINECONE_INDEX environment variable");
        console.error("3. Verify PINECONE_API_KEY has correct permissions");
        throw indexError;
      }
      throw indexError;
    }

    console.log(
      `📚 Seeding ${medicalKnowledge.length} medical knowledge chunks...`,
    );

    const batchSize = 10;

    for (let i = 0; i < medicalKnowledge.length; i += batchSize) {
      const batch = medicalKnowledge.slice(i, i + batchSize);

      // upsertRecords requires an ARRAY
      const records = batch.map((item) => ({
        id: item.id,
        text: item.text,
        condition: item.condition,
        specialist: item.specialist,
        urgency: item.urgency,
        followupQuestions: item.followupQuestions.join(" | "),
        advice: item.advice,
      }));

await index.upsertRecords({ records: [...records] })  
      console.log(
        `✅ Batch ${Math.floor(i / batchSize) + 1} done (${records.length} records)`,
      );
      await new Promise((r) => setTimeout(r, 300));
    }

    console.log("\n🎉 Seeded successfully!");
    console.log(`Total: ${medicalKnowledge.length} chunks in Pinecone`);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    console.error(err);
    process.exit(1);
  }
};

seedMedicalKnowledge();
