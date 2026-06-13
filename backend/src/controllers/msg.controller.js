const { GoogleGenAI } = require("@google/genai");
const ChatSession = require("../models/chatSession.model.js");
const Message = require("../models/message.model.js");

// Initialize the Google Gen AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function msgController(req, res) {
    const { sessionId, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const heartbeat = setInterval(() => {
        res.write(": keep-alive\n\n");
    }, 15000);

    // Format incoming messages to match Gemini's contents layout structure
    const formattedContents = messages.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
    }));

    let fullReasoning = "";
    let fullAnswer = "";
    let insideThinkingBlock = false;
    const startTime = Date.now();
    let reasoningEndTime = startTime;

    try {
        // Call the streaming API
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: formattedContents,
            config: {
                systemInstruction:
                    "You are a deep reasoning AI assistant. For every query, you MUST first output your step-by-step thinking process wrapped entirely inside <think> and </think> tags. " +
                    "Once you close the </think> tag, provide your final, beautifully formatted markdown answer. Never mix the two zones.",
                temperature: 0.5
            }
        });

        // Token Parsing Loop
        for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            if (!chunkText) continue;

            // Handle raw incoming text chunks and dynamically stream them based on tags
            let remainingText = chunkText;

            // Check if this chunk opens the thinking block
            if (remainingText.includes("<think>")) {
                insideThinkingBlock = true;
                remainingText = remainingText.replace("<think>", "");
            }

            // Check if this chunk closes the thinking block
            if (remainingText.includes("</think>")) {
                insideThinkingBlock = false;
                reasoningEndTime = Date.now();

                const parts = remainingText.split("</think>");
                const thinkingPart = parts[0];
                const answerPart = parts[1] || "";

                if (thinkingPart) {
                    fullReasoning += thinkingPart;
                    res.write(
                        `data: ${JSON.stringify({ type: "thinking", text: thinkingPart })}\n\n`
                    );
                }
                if (answerPart) {
                    fullAnswer += answerPart;
                    res.write(
                        `data: ${JSON.stringify({ type: "answer", text: answerPart })}\n\n`
                    );
                }
                continue;
            }

            // Route the token stream based on current state machine zone
            if (insideThinkingBlock) {
                fullReasoning += remainingText;
                res.write(
                    `data: ${JSON.stringify({ type: "thinking", text: remainingText })}\n\n`
                );
            } else {
                fullAnswer += remainingText;
                res.write(
                    `data: ${JSON.stringify({ type: "answer", text: remainingText })}\n\n`
                );
            }
        }

        res.write("data: [DONE]\n\n");

        // Database Sync Loop
        if (sessionId) {
            const totalThinkingTime = reasoningEndTime - startTime;
            const lastUserMsg = messages[messages.length - 1];

            await Message.create({
                sessionId,
                role: "user",
                content: lastUserMsg.content
            });

            await Message.create({
                sessionId,
                role: "assistant",
                content: fullAnswer,
                reasoningContent: fullReasoning,
                thinkingTime: totalThinkingTime > 0 ? totalThinkingTime : 0
            });

            await ChatSession.findByIdAndUpdate(sessionId, {
                updatedAt: new Date()
            });
        }
    } catch (error) {
        console.error("Gemini Stream Error:", error);
        res.write(
            `data: ${JSON.stringify({ type: "error", text: "Stream connection dropped." })}\n\n`
        );
    } finally {
        clearInterval(heartbeat);
        res.end();
    }
}

module.exports = msgController;
