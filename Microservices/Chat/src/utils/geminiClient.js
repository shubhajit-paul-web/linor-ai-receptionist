// utils/geminiClient.js
// const { GoogleGenAI } = require("@google/genai");

// const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// const streamGeminiReply = async (conversationHistory, systemPrompt, onToken) => {
//   if (!Array.isArray(conversationHistory) || conversationHistory.length === 0) {
//     throw new Error("conversationHistory must include the current user message");
//   }

//   const latestMessageEntry = conversationHistory.at(-1);
//   const latestMessage = latestMessageEntry?.parts?.[0]?.text;

//   if (!latestMessage) {
//     throw new Error("Latest user message is missing from conversationHistory");
//   }

//   const chat = genAI.chats.create({
//     model: "gemini-2.0-flash",
//     config: {
//       systemInstruction: systemPrompt,
//     },
//     history: conversationHistory.slice(0, -1),
//   });

//   const responseStream = await chat.sendMessageStream({
//     message: latestMessage,
//   });

//   let fullReply = "";

//   for await (const chunk of responseStream) {
//     const token = chunk.text ?? "";
//     if (token) {
//       fullReply += token;
//       if (typeof onToken === "function") {
//         onToken(token);
//       }
//     }
//   }

//   return fullReply;
// };

// module.exports = { streamGeminiReply };




// groqClient.js — swap this file's URL for Gemini in production
// Current: Groq (free, fast, perfect for hackathon)
// Production: change BASE_URL + model to Gemini

const callAI = async (systemPrompt, messages) => {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Latest supported fast model
        messages: [
          { role: "system", content: systemPrompt },
          ...messages, // last 6 turns
        ],
        max_tokens: 300, // keep responses short — receptionist style
        temperature: 0.7,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

module.exports = { callAI };