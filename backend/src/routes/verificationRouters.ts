import { Router } from "express";
import { verifyTestKit } from "../controllers/verificationController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * Test Kit Verification Endpoint
 * 
 * PRIVACY-PRESERVING ARCHITECTURE:
 * - NO image upload middleware (images never sent to backend)
 * - Frontend runs AI validation using TensorFlow.js
 * - Backend receives only: serial number + confidence score
 * - Backend validates confidence threshold and updates status
 * 
 * Request Body:
 * - serial: string (test kit serial from QR code)
 * - aiConfidence: number (0-1, from frontend AI)
 * - testTypeId: bigint (type of test)
 */
router.post(
  "/kit",
  authenticate,
  verifyTestKit
);

export default router;

