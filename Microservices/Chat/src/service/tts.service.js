// services/tts.service.js
const Cartesia = require("@cartesia/cartesia-js");

const cartesia = new Cartesia({ apiKey: process.env.CARTESIA_API_KEY });

exports.streamTTS = async (socket, text) => {
  try {
    console.log(`[TTS] Generating audio for: "${text}"`);

    // Initialize the WebSocket to Cartesia
    const websocket = cartesia.tts.websocket({
      container: "raw",
      encoding: "pcm_f32le", // High-quality raw audio format
      sampleRate: 44100,
    });

    await websocket.connect();

    // Listen for audio chunks from Cartesia
    websocket.on("message", (message) => {
      const parsed = JSON.parse(message);
      
      // If we get an audio chunk, emit it immediately to the React frontend
      if (parsed.data) {
        socket.emit("ai-audio-chunk", parsed.data);
      }

      // Close connection when finished
      if (parsed.done) {
        websocket.disconnect();
      }
    });

    // Send the prompt to Cartesia
    await websocket.send({
      model_id: "sonic-english",
      voice: {
        mode: "id",
        // This is a default voice ID. Check Cartesia docs for a "Receptionist" style voice ID
        id: "a0e99841-438c-4a64-b6a9-62f2c68724d1", 
      },
      transcript: text,
    });

  } catch (error) {
    console.error("[Cartesia TTS Error]:", error);
    throw error;
  }
};