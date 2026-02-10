import { prisma } from "../config/db.js";
import { validateAiConfidence } from './aiValidation.service.js';

// TypeScript type for validation result
interface ValidateKitResult {
  id: bigint;
  serial_number: string;
  test_kit_id: bigint;
  user_id: bigint;
  purchasedAt: Date;
  usedAt: Date | null;
  verifiedAt: Date | null;
}

/**
 * 🔢 Validate Test Kit Serial Number
 * Checks if serial number exists and hasn't been used
 * @param serial - Test kit serial number from QR code
 * @returns Test kit instance data if valid
 */
const validateTestKitSerial = async (
  serial: string,
  requestingUserId: bigint
): Promise<ValidateKitResult> => {
  console.log("🔍 Validating test kit serial:", serial);

  const kitInstance = await prisma.test_kit_instances.findUnique({
    where: { serial_number: serial },
    select: {
      id: true,
      serial_number: true,
      test_kit_id: true,
      user_id: true,
      created_at: true,   // purchase / issuance date
      used_at: true,
      verified_at: true,
    },
  });

  // 1️⃣ Serial existence
  if (!kitInstance) {
    console.error("❌ Serial not found:", serial);
    throw new Error("Invalid test kit. Please scan the QR code again.");
  }

  // 2️⃣ Ownership check
  if (kitInstance.user_id !== requestingUserId) {
    console.error("❌ Kit does not belong to user:", requestingUserId);
    throw new Error("This test kit does not belong to your account.");
  }

  // 3️⃣ Already used or verified check
  if (kitInstance.used_at || kitInstance.verified_at) {
    console.error("❌ Kit already used:", {
      usedAt: kitInstance.used_at,
      verifiedAt: kitInstance.verified_at,
    });

    throw new Error(
      "This test kit has already been used and cannot be reused."
    );
  }

  console.log("✅ Test kit is valid and unused:", {
    serial: kitInstance.serial_number,
    purchasedAt: kitInstance.created_at,
  });

  return {
    id: kitInstance.id,
    serial_number: kitInstance.serial_number,
    test_kit_id: kitInstance.test_kit_id,
    user_id: kitInstance.user_id,
    purchasedAt: kitInstance.created_at,
    usedAt: kitInstance.used_at,
    verifiedAt: kitInstance.verified_at,
  };
};

/**
 * 🤖 Run AI Validation
 * Uses machine learning to detect if test result is valid
 * @param imageBuffer - Image data in memory (NOT saved anywhere)
 * @returns Confidence score (0-1)
 */
const runAiValidation = async (imageBuffer: Buffer): Promise<number> => {
  console.log('🤖 Running AI validation on image...');

  // TODO: Implement AI validation
  // Options:
  // 1. TensorFlow.js for on-device processing
  // 2. Call external API (OpenAI Vision, Google Cloud Vision)
  // 3. Custom trained model

  // For now, return mock confidence
  const mockConfidence = 0.90;
  console.log('✅ AI confidence score:', mockConfidence);

  return mockConfidence;
};

/**
 * ✅ Verify Test Kit - Main Service
 * 
 * PRIVACY-PRESERVING ARCHITECTURE:
 * - AI runs on FRONTEND (TensorFlow.js)
 * - Backend receives ONLY: serial + confidence score
 * - NO images transmitted to backend
 * - NO medical diagnosis performed
 * 
 * Process:
 * 1. Frontend captures image via camera
 * 2. Frontend runs AI inference locally
 * 3. Frontend sends serial + confidence to backend
 * 4. Backend validates confidence threshold
 * 5. Backend updates verification status
 * 6. Image stays on user's device ONLY
 */
export const verifyTestKitService = async ({
  userId,
  serial,
  aiConfidence,
  testTypeId,
}: {
  userId: bigint;
  serial: string;
  aiConfidence: number;
  testTypeId: bigint;
}) => {

  console.log('🔬 Starting test kit verification for user:', userId.toString());

  // 1️⃣ Serial validation - Check test kit is valid and unused
  const kit = await validateTestKitSerial(serial, userId);

  // 2️⃣ AI confidence validation - Verify quality threshold
  // NOTE: AI inference already happened on frontend
  // Backend ONLY validates the confidence score
  const validatedConfidence = validateAiConfidence(aiConfidence);

  console.log('✅ All validations passed! Updating database...');

  // 3️⃣ Atomic DB update - Save verification results (NOT the image)
  await prisma.$transaction(async (tx: any) => {
    // Mark test kit instance as used
    await tx.test_kit_instances.update({
      where: { id: kit.id },
      data: {
        used_at: new Date(),
        verified_at: new Date(),
      },
    });

    // Create verification record
    await tx.user_verifications.create({
      data: {
        user_id: userId,
        test_kit_id: testTypeId, // testTypeId is the variable name from arguments, which we keep for compatibility
        status: "verified",
        tested_at: new Date(),
        verified_at: new Date(),
        // NOTE: No image data stored here!
        // NOTE: No medical diagnosis stored here!
      },
    });

    // Update user current status
    await tx.users.update({
      where: { id: userId },
      data: {
        status: "Verified",
        updated_at: new Date(),
      },
    });
  });

  console.log('✅ Verification complete!');

  return {
    status: "verified",
    confidence: validatedConfidence,
    verifiedAt: new Date(),
  };
};

export const updateVerificationStatus = async (
  verificationId: bigint,
  newStatus: string,
  verifiedByUserId: bigint
) => {
  return await prisma.$transaction(async (tx: any) => {
    const oldVerification = await tx.user_verifications.findUnique({
      where: { id: verificationId },
    });

    if (!oldVerification) throw new Error("Verification record not found");

    // Update the record
    const updated = await tx.user_verifications.update({
      where: { id: verificationId },
      data: {
        status: newStatus,
        verifiedByUserId: verifiedByUserId,
        verifiedAt: newStatus === "verified" ? new Date() : null,
      },
    });

    // Create audit log
    await tx.audit_logs.create({
      data: {
        verificationId,
        userId: verifiedByUserId,
        oldStatus: oldVerification.status,
        newStatus: newStatus,
      },
    });

    return updated;
  });
};
