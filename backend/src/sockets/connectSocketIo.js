const { Server } = require("socket.io");
const { generateReasoningStream } = require("../services/ai.service.js");
const ChatSession = require("../models/chatSession.model.js");
const Message = require("../models/message.model.js");

async function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: 
        { 
          origin: "http://localhost:5173", 
          methods: ["GET", "POST"] 
          
        }
    });

    io.on("connection", socket => {
        socket.on("sendMessage", async data => {
            const { sessionId, messages } = data;

            let fullReasoning = "";
            let fullAnswer = "";
            let insideThinkingBlock = false;
            const startTime = Date.now();

            try {
                const responseStream = await generateReasoningStream(messages);

                // 1. Live Frontend Streaming Loop
                for await (const chunk of responseStream) {
                    const chunkText = chunk.text;
                    if (!chunkText) continue;

                    let remainingText = chunkText;

                    if (remainingText.includes("<think>")) {
                        insideThinkingBlock = true;
                        remainingText = remainingText.replace("<think>", "");
                    }

                    if (remainingText.includes("</think>")) {
                        insideThinkingBlock = false;
                        const parts = remainingText.split("</think>");
                        const thinkingPart = parts[0];
                        const answerPart = parts[1] || "";

                        if (thinkingPart) {
                            fullReasoning += thinkingPart;
                            socket.emit("thinking_chunk", thinkingPart);
                        }
                        if (answerPart) {
                            fullAnswer += answerPart;
                            socket.emit("answer_chunk", answerPart);
                        }
                        continue;
                    }

                    if (insideThinkingBlock) {
                        fullReasoning += remainingText;
                        socket.emit("thinking_chunk", remainingText);
                    } else {
                        fullAnswer += remainingText;
                        socket.emit("answer_chunk", remainingText);
                    }
                }


                socket.emit("stream_done");


                if (sessionId) {
                    (async () => {
                        try {
                            const totalThinkingTime = Date.now() - startTime;
                            const lastUserMsg = messages[messages.length - 1];

                            await Promise.all([
                                Message.create({
                                    sessionId,
                                    role: "user",
                                    content: lastUserMsg.content
                                }),
                                Message.create({
                                    sessionId,
                                    role: "assistant",
                                    content: fullAnswer,
                                    reasoningContent: fullReasoning,
                                    thinkingTime: totalThinkingTime
                                }),
                                ChatSession.findByIdAndUpdate(sessionId, {
                                    updatedAt: new Date()
                                })
                            ]);

                            console.log(
                                `💾 [Background Sync Successful] Chat data cached for Session: ${sessionId}`
                            );
                        } catch (dbErr) {
                            console.error(
                                "❌ Background Database Write Failed:",
                                dbErr.message
                            );
                        }
                    })();
                }
            } catch (error) {
                console.error("Socket loop generation crash:", error);
                socket.emit("stream_error", {
                    message: "Failed to process stream loop."
                });
            }
        });
    });

    return io;
}

module.exports = initSocket;
