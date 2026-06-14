const { Server } = require("socket.io");
const { generateReasoningStream } = require("../services/ai.service.js");
const ChatSession = require("../models/chatSession.model.js");
const Message = require("../models/message.model.js");

async function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: { 
            origin: "http://localhost:5173", 
            methods: ["GET", "POST"] 
        }
    });

    io.on("connection", (socket) => {
        console.log(`🔌 [Socket Connection Established] Client Connected: ${socket.id}`);

        socket.on("sendMessage", async (data) => {
            const { sessionId, messages } = data;

            let fullReasoning = "";
            let fullAnswer = "";
            
            // STATE MACHINE FLAGS
            let insideThinkingBlock = false;
            let textBuffer = ""; // Holds incoming strings to catch split tags smoothly
            
            const startTime = Date.now();

            try {
                // Fetch the iterable response structure from our updated Gemini service layer
                const responseStream = await generateReasoningStream(messages);

                // 1. Live Frontend Streaming Loop
                for await (const chunk of responseStream) {
                    // Extract text content cleanly based on standard @google/genai layouts
                    const chunkText = chunk.text;
                    if (!chunkText) continue;

                    // Append fresh tokens into our scanning window buffer
                    textBuffer += chunkText;

                    // CONTINUOUS PARSING LAYER STATE ENGINE
                    while (textBuffer.length > 0) {
                        if (!insideThinkingBlock) {
                            const thinkStartIdx = textBuffer.indexOf("<think>");
                            
                            if (thinkStartIdx !== -1) {
                                // Emit any content captured before the thinking tag opened
                                const priorAnswerText = textBuffer.substring(0, thinkStartIdx);
                                if (priorAnswerText) {
                                    fullAnswer += priorAnswerText;
                                    socket.emit("answer_chunk", priorAnswerText);
                                }
                                
                                // Flip the state machine tracker parameters
                                insideThinkingBlock = true;
                                // Clip out the processed text window up through the end of the <think> tag
                                textBuffer = textBuffer.substring(thinkStartIdx + 7);
                                continue;
                            }
                        }

                        if (insideThinkingBlock) {
                            const thinkEndIdx = textBuffer.indexOf("</think>");
                            
                            if (thinkEndIdx !== -1) {
                                // Extract the residual interior logic block text
                                const internalReasoningText = textBuffer.substring(0, thinkEndIdx);
                                if (internalReasoningText) {
                                    fullReasoning += internalReasoningText;
                                    socket.emit("thinking_chunk", internalReasoningText);
                                }

                                insideThinkingBlock = false;
                                // Clip out everything through the end of the </think> tag
                                textBuffer = textBuffer.substring(thinkEndIdx + 8);
                                continue;
                            }
                        }

                        // DEFENSIVE FLUSH SEGMENT
                        // If no structural tags match in the current window buffer, 
                        // flush the valid content segments to prevent user input lag.
                        // We leave a small historical tail (7 chars) inside the buffer 
                        // to protect incoming split-tag sequences (e.g., "</thin") from being lost.
                        const safetyMargin = 8;
                        if (textBuffer.length > safetyMargin) {
                            const flushableLength = textBuffer.length - safetyMargin;
                            const flushableContent = textBuffer.substring(0, flushableLength);
                            textBuffer = textBuffer.substring(flushableLength);

                            if (insideThinkingBlock) {
                                fullReasoning += flushableContent;
                                socket.emit("thinking_chunk", flushableContent);
                            } else {
                                fullAnswer += flushableContent;
                                socket.emit("answer_chunk", flushableContent);
                            }
                        }
                        
                        break; // Step out of loop if remaining tokens fall under safety margins
                    }
                }

                // POST-STREAM BUFFER DRAIN: Flush out any characters left in the buffer safely
                if (textBuffer.length > 0) {
                    if (insideThinkingBlock) {
                        fullReasoning += textBuffer;
                        socket.emit("thinking_chunk", textBuffer);
                    } else {
                        fullAnswer += textBuffer;
                        socket.emit("answer_chunk", textBuffer);
                    }
                }

                // Notify frontend streaming hooks that compilation channels are finished
                socket.emit("stream_done");

                // 2. BACKGROUND DURABILITY WORKER
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
                                    content: fullAnswer.trim(),
                                    reasoningContent: fullReasoning.trim(),
                                    thinkingTime: totalThinkingTime
                                }),
                                ChatSession.findByIdAndUpdate(sessionId, {
                                    updatedAt: new Date()
                                })
                            ]);

                            console.log(`💾 [Background Sync Successful] Session data cached: ${sessionId}`);
                        } catch (dbErr) {
                            console.error("❌ Background Database Write Failed:", dbErr.message);
                        }
                    })();
                }

            } catch (error) {
                console.error("❌ Sockets Engine Exception Caught:", error.message);
                socket.emit("stream_error", {
                    message: "Internal socket loop processing exception thrown cleanly."
                });
            }
        });

        socket.on("disconnect", () => {
            console.log(`🔌 [Socket Severed] Client Disconnected: ${socket.id}`);
        });
    });

    return io;
}

module.exports = initSocket;