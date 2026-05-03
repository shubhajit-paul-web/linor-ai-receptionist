// services/stt.service.js
const fs = require("fs");
const Groq = require("groq-sdk");
const logger = require("../utils/logger");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.transcribeAudio = async (filePath) => {
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3",
      // Adding medical context here drastically improves accuracy for hospital use-cases
      prompt: "Medical appointment, doctor, symptoms, hospital receptionist, booking.", 
      response_format: "json",
    });

    // Clean up the file immediately after Groq processes it
    fs.unlinkSync(filePath); 

    return transcription.text;
  } catch (error) {
    logger.error("Groq STT Error: %s", error.message);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Cleanup on fail
    throw error;
  }
};