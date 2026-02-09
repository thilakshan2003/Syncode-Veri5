import type { Request, Response } from "express";
import { verifyTestKitService } from "../services/verificationService.js";

/**
 * Verify Test Kit Controller
 * 
 * PRIVACY-PRESERVING DESIGN:
 * - Receives only serial number and AI confidence score
 * - NO image data received from frontend
 * - AI inference already completed on frontend
 * - Backend validates confidence threshold only
 */
export const verifyTestKit = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authenticate middleware
    const userId = req.user.id;
    
    // Extract data from request body
    const { serial, aiConfidence, testTypeId } = req.body;

    // Validation
    if (!serial || aiConfidence === undefined || !testTypeId) {
      return res.status(400).json({ 
        error: "Missing required fields: serial, aiConfidence, or testTypeId" 
      });
    }

    // Convert aiConfidence to number
    const confidence = parseFloat(aiConfidence);
    if (isNaN(confidence)) {
      return res.status(400).json({ 
        error: "Invalid aiConfidence value" 
      });
    }

    // Call service
    const result = await verifyTestKitService({
      userId,
      serial,
      aiConfidence: confidence,
      testTypeId: BigInt(testTypeId),
    });

    res.json({ 
      success: true, 
      ...result 
    });
  } catch (err: any) {
    console.error('Verification error:', err);
    res.status(400).json({ error: err.message });
  }
};
