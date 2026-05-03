require("dotenv").config();
const { Pinecone } = require("@pinecone-database/pinecone");
const medicalKnowledge = require("../data/medicalKnowledge");
const logger = require("../utils/logger");

const seedMedicalKnowledge = async () => {
  try {
    logger.info("Connecting to Pinecone...");
    
    // Validate environment variables
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("❌ PINECONE_API_KEY is not set in environment variables");
    }
    
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const indexName = process.env.PINECONE_INDEX_NAME || "Linor";
    logger.info('Using Pinecone index: "%s"', indexName);
    
    // Verify the index exists
    logger.info("Verifying index exists...");
    let index;
    try {
      await pc.describeIndex(indexName);
      logger.info('Index "%s" found', indexName);
      index = pc.index(indexName);
    } catch (indexError) {
      if (indexError.message.includes("404")) {
        logger.error('Index "%s" does not exist in Pinecone', indexName);
        logger.error("Available options:");
        logger.error("1. Create the index in Pinecone console");
        logger.error("2. Check PINECONE_INDEX environment variable");
        logger.error("3. Verify PINECONE_API_KEY has correct permissions");
        throw indexError;
      }
      throw indexError;
    }

    logger.info("Seeding %s medical knowledge chunks...", medicalKnowledge.length);

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

      await index.upsertRecords({ records: [...records] });
      logger.info(
        "Batch %s done (%s records)",
        Math.floor(i / batchSize) + 1,
        records.length,
      );
      await new Promise((r) => setTimeout(r, 300));
    }

    logger.info("Seeded successfully!");
    logger.info("Total: %s chunks in Pinecone", medicalKnowledge.length);
  } catch (err) {
    logger.error("Seeding failed: %s", err.message);
    logger.error(err.stack || err.message);
    process.exit(1);
  }
};

seedMedicalKnowledge();
