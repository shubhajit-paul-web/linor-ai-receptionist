// src/service/embeddingService.js
const { GoogleGenAI } = require("@google/genai");
const logger = require("../utils/logger");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates an embedding with production-grade retry logic (Exponential Backoff).
 */
const generateEmbedding = async (text, maxRetries = 3) => {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await ai.models.embedContent({
        model: "text-embedding-004", // Standard for production semantic search
        contents: text,
      });
      return response.embeddings[0].values;
      
    } catch (error) {
      attempt++;
      logger.warn("Embedding failed (Attempt %s/%s): %s", attempt, maxRetries, error.message);
      
      if (attempt >= maxRetries) {
        logger.error("Max retries reached for embedding.");
        throw new Error("Failed to generate embedding after multiple attempts.");
      }
      
      // Wait 1s, then 2s, then 4s...
      await wait(Math.pow(2, attempt - 1) * 1000); 
    }
  }
};

module.exports = { generateEmbedding };