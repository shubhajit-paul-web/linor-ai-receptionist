// sockets/voice.socket.js
const fs = require("fs");
const path = require("path");
const { transcribeAudio } = require("../service/stt.service");
const { streamTTS } = require("../service/tts.service");
const logger = require("../utils/logger");

// Import your EXISTING logic from chat.controller.js or a wrapper service
// e.g., const { processVoiceChat } = require("../controller/chat.controller");

exports.setupVoiceSockets = (io) => {
  io.on("connection", (socket) => {
    logger.info("Patient connected: %s", socket.id);

    // Create a temporary file path for this specific session's audio chunks
    const tempFilePath = path.join(__dirname, `../temp/audio_${socket.id}.webm`);

    socket.on("patient-audio", async (audioBuffer) => {
      try {
        // 1. Save buffer to a temp file (Groq requires file streams)
        // Ensure the 'temp' directory exists in your root folder!
        fs.writeFileSync(tempFilePath, audioBuffer);

        // 2. Convert Audio to Text (Groq)
        const patientText = await transcribeAudio(tempFilePath);
        
        if (!patientText || !patientText.trim()) return;

        // Emit transcript back to frontend for UI display
        socket.emit("transcript", { role: "user", text: patientText });
        logger.info("Patient said: %s", patientText);

        // 3. THE BRAIN: Pass text to your existing RAG/Gemini logic
        // Replace this mock with your actual intent detection and Gemini call
        const aiReplyText = await mockProcessChatLogic(patientText); 
        
        socket.emit("transcript", { role: "ai", text: aiReplyText });

        // 4. Convert Text to Audio Stream (Cartesia)
        await streamTTS(socket, aiReplyText);

      } catch (error) {
        logger.error("Voice Pipeline Error: %s", error.message);
        socket.emit("error", "Failed to process voice request.");
      }
    });

    socket.on("stop-audio", () => {
      logger.info("Patient interrupted AI. Cutting stream.");
      // In a more advanced setup, you'd send a signal to the TTS service to close its specific WebSocket
      socket.emit("interrupt-acknowledged"); 
    });

    socket.on("disconnect", () => {
      logger.info("Patient disconnected: %s", socket.id);
      // Cleanup temp files if they exist
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    });
  });
};

// MOCK: Wrap your existing logic from chat.controller.js here
async function mockProcessChatLogic(text) {
  // e.g., return await processVoiceChat(text, sessionId);
  return "I understand. Let me check the schedule for Dr. Sharma.";
}