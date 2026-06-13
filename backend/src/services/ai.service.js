const { GoogleGenAI } = require("@google/genai");
// Initialize the Google SDK locally inside the service container
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Service: Generates a high-speed text stream from Google Gemini
 * @param {Array} messages - Chronological message array from client
 * @returns {Promise<AsyncIterable>} - Returns an async iterable text stream
 */
async function generateReasoningStream(messages) {
    if (!messages || !Array.isArray(messages)) {
        throw new Error("Invalid input: Messages must be an array format.");
    }

    const formattedContents = messages.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
    }));

    // Trigger and return the raw Google Gen AI execution stream line
    const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash", // High speed token output optimization
        contents: formattedContents,
        config: {
            systemInstruction:
                "You are a deep reasoning AI assistant. For every query, you MUST first output your step-by-step thinking process wrapped entirely inside <think> and </think> tags. " +
                "Once you close the </think> tag, provide your final, beautifully formatted markdown answer. Never mix the two zones.",
            temperature: 0.5
        }
    });

    return response.text;
}

module.exports = {
    generateReasoningStream
};
