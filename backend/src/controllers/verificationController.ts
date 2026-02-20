import type { Request, Response } from "express";
import { verifyTestKitService, updateVerificationStatus } from "../services/verificationService.js";

/**
 * Verify Test Kit Controller
 * 
 * PRIVACY-PRESERVING DESIGN:
 * - Receives only serial number and AI confidence score
 * - NO image data received from frontend
 * - AI inference already completed on frontend
 * - Backend validates confidence threshold only
 * - Backend updates verification result
 */
export const verifyTestKit = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authenticate middleware
    const userId = req.user.id;

    // Extract data from request body
    const { serial, aiConfidence, testTypeId, testResult, imageMetadata } = req.body;

    console.log('=== Test Kit Verification Request ===');
    console.log('User ID:', userId);
    console.log('Serial:', serial);
    console.log('AI Confidence:', aiConfidence);
    console.log('Test Type ID:', testTypeId);
    console.log('Test Result:', testResult);
    console.log('Image Metadata:', imageMetadata);

    // Validation
    if (!serial || aiConfidence === undefined || !testTypeId || !testResult) {
      console.error('Missing required fields:', { serial, aiConfidence, testTypeId, testResult });
      return res.status(400).json({
        error: "Missing required fields: serial, aiConfidence, testTypeId, or testResult"
      });
    }

    // Validate testResult value
    if (!['positive', 'negative'].includes(testResult)) {
      console.error('Invalid testResult value:', testResult);
      return res.status(400).json({
        error: "Invalid testResult value. Must be 'positive' or 'negative'"
      });
    }

    // Convert aiConfidence to number
    const confidence = parseFloat(aiConfidence);
    if (isNaN(confidence)) {
      console.error('Invalid aiConfidence value:', aiConfidence);
      return res.status(400).json({
        error: "Invalid aiConfidence value"
      });
    }

    // Validate testTypeId
    const parsedTestTypeId = parseInt(testTypeId);
    if (isNaN(parsedTestTypeId)) {
      console.error('Invalid testTypeId value:', testTypeId);
      return res.status(400).json({
        error: "Invalid testTypeId value"
      });
    }

    console.log('All validations passed, calling service...');

    // Call service
    const result = await verifyTestKitService({
      userId,
      serial,
      aiConfidence: confidence,
      testTypeId: BigInt(parsedTestTypeId),
      testResult: testResult as 'positive' | 'negative',
      imageMetadata,
    });

    console.log('Verification successful!');
    res.json({
      success: true,
      ...result
    });
  } catch (err: any) {
    console.error('Verification error:', err);
    console.error('Error message:', err.message);
    res.status(400).json({ error: err.message });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user is set by authenticate middleware
    const userId = req.user.id;
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const { status, testResult } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: "Missing required fields: id or status" });
    }

    const result = await updateVerificationStatus(
      BigInt(id),
      status,
      userId,
      testResult // optional, may be undefined
    );

    console.log('Update result:', result);
    res.json({ success: true, verification: result });
  } catch (err: any) {
    console.error('Update status error:', err);
    console.error('Stack trace:', err.stack);
    res.status(400).json({ error: err.message });
  }
};
