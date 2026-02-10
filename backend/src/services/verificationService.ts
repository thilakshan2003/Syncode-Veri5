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
 * Validation Flow:
 * 1. Validate serial number from database
 * 2. Check image metadata (size, format, dimensions)
 * 3. Validate AI confidence score
 * 4. Update database with result
 * 
 * Process:
 * 1. Validate serial number exists and belongs to user
 * 2. Check serial hasn't been used before
 * 3. Validate AI confidence threshold
 * 4. Store test result (positive/negative)
 * 5. Update used_at timestamp
 * 6. Update user verification status
 */
export const verifyTestKitService = async ({
  userId,
  serial,
  aiConfidence,
  testTypeId,
  testResult,
  imageMetadata,
}: {
  userId: bigint;
  serial: string;
  aiConfidence: number;
  testTypeId: bigint;
  testResult: 'positive' | 'negative';
  imageMetadata?: {
    size: number;
    format: string;
    width?: number;
    height?: number;
  };
}) => {

  console.log('🔬 Starting test kit verification for user:', userId.toString());
  console.log('📋 Test Result:', testResult);
  console.log('📸 Image Metadata:', imageMetadata);

  // 1️⃣ Serial validation - Check test kit is valid and unused
  console.log('Step 1: Validating serial number...');
  const kit = await validateTestKitSerial(serial, userId);
  console.log('✅ Serial number validated');

  // 2️⃣ Image metadata validation
  console.log('Step 2: Validating image metadata...');
  if (imageMetadata) {
    // Check file size (max 10MB)
    if (imageMetadata.size > 10 * 1024 * 1024) {
      throw new Error('Image file size exceeds 10MB limit');
    }

    // Check format
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedFormats.includes(imageMetadata.format)) {
      throw new Error('Invalid file format. Only JPG, PNG, and PDF are allowed');
    }

    console.log('✅ Image metadata validated');
  }

  // 3️⃣ AI confidence validation - Verify quality threshold
  console.log('Step 3: Validating AI confidence...');
  const validatedConfidence = validateAiConfidence(aiConfidence);
  console.log('✅ AI confidence validated:', validatedConfidence);

  console.log('✅ All validations passed! Updating database...');

  // 4️⃣ Atomic DB update - Save verification results
  const result = await prisma.$transaction(async (tx: any) => {
    // Mark test kit instance as used with current timestamp
    const updatedKit = await tx.test_kit_instances.update({
      where: { id: kit.id },
      data: {
        used_at: new Date(),
        verified_at: new Date(),
      },
    });

    // Create verification record with test result
    const verification = await tx.user_verifications.create({
      data: {
        userId: userId,
        testTypeId: testTypeId,
        status: "verified",
        testedAt: new Date(),
        verifiedAt: new Date(),
      },
    });

    // Update user current status only if test is negative (clean)
    if (testResult === 'negative') {
      await tx.users.update({
        where: { id: userId },
        data: {
          status: "Verified",
          updatedAt: new Date(),
        },
      });
    }

    return {
      kit: updatedKit,
      verification,
    };
  });

  console.log('✅ Verification complete!');
  console.log('📅 Used at timestamp:', result.kit.used_at);

  return {
    status: "verified",
    testResult: testResult,
    confidence: validatedConfidence,
    usedAt: result.kit.used_at,
    verifiedAt: result.kit.verified_at,
  };
};

import fs from 'fs';

// ... existing code ...

const log = (msg: string) => fs.appendFileSync('DEBUG.log', `${new Date().toISOString()} - ${msg}\n`);

export const updateVerificationStatus = async (
  verificationId: bigint,
  newStatus: string,
  verifiedByUserId: bigint
) => {
  log(`[Service] Updating status for verification ${verificationId} to ${newStatus} by user ${verifiedByUserId}`);

  return await prisma.$transaction(async (tx: any) => {
    try {
      const oldVerification = await tx.user_verifications.findUnique({
        where: { id: verificationId },
      });

      if (!oldVerification) {
        log(`[Service] Verification record not found: ${verificationId}`);
        throw new Error("Verification record not found");
      }

      log(`[Service] Old status: ${oldVerification.status}`);

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

      log(`[Service] Audit log created`);

      // Update user status if verification is "verified"
      if (newStatus === "verified") {
        log(`[Service] Updating user ${oldVerification.userId} to Verified status`);
        await tx.users.update({
          where: { id: oldVerification.userId },
          data: {
            status: "Verified",
            // updatedAt is automatically handled by @updatedAt, but we can update it explicitly if we want to change the timestamp even if status didn't change (e.g. re-verification)
          },
        });
        log(`[Service] User ${oldVerification.userId} updated`);
      }

      return updated;
    } catch (e: any) {
      log(`[Service] Error in transaction: ${e.message}`);
      throw e;
    }
  });
};
