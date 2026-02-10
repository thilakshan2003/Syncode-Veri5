import type { Request, Response } from 'express';
import { chatWithGemini } from '../services/chatService.js';
import fs from 'fs';

const log = (msg: string) => fs.appendFileSync('DEBUG.log', `${new Date().toISOString()} - [ChatController] ${msg}\n`);

export const handleChat = async (req: Request, res: Response) => {
    try {
        const { messages } = req.body;
        log(`Received chat request with ${messages?.length || 0} messages`);

        if (!messages || !Array.isArray(messages)) {
            log(`Error: Invalid messages array`);
            return res.status(400).json({ success: false, message: "Invalid request. Messages array is required." });
        }

        const aiResponse = await chatWithGemini(messages);
        log(`Successfully got response from Gemini`);

        res.status(200).json({
            success: true,
            message: aiResponse
        });
    } catch (error: any) {
        log(`Chat Controller Error: ${error.message}\nStack: ${error.stack}`);
        console.error("Chat Controller Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while processing your request."
        });
    }
};
