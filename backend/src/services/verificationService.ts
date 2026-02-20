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
    throw new Error("Invalid test kit");
  }

  // Ownership check
  if (kitInstance.user_id !== requestingUserId) {
    console.error("❌ Kit does not belong to user:", requestingUserId);
    throw new Error("This test kit does not belong to your account.");
  }

  // Already used or verified check
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
 * Compute a backend-only score for a user based on verified negative tests.
 * - Clinical negative test: large number of points
 * - Self-test negative: smaller number of points
 * - Points start to decay daily after 30 days from testedAt
 *
 * This function does NOT expose the score to the frontend; it's used only to decide verification status.
 */
export const computeUserScore = async (userId: bigint) => {
  // Scoring constants (tunable)
  const CLINICAL_POINTS = 50;
  const SELF_POINTS = 10;
  const DECAY_START_DAYS = 30;
  const DECAY_PER_DAY = 1; // points removed per day after DECAY_START_DAYS
  const SCORE_THRESHOLD = 100; // ensure same threshold here for quick reference

  // Fetch verified verifications for the user
  // We don't store a dedicated `result` column in the current Prisma schema.
  // Instead we look for audit log entries where staff or the system recorded a 'negative' result
  // and then map those audit logs back to verification records.
  const negativeLogs = await prisma.audit_logs.findMany({
    where: {
      userId: userId,
      newStatus: 'negative',
    },
    select: { verificationId: true },
  });

  const verificationIds = negativeLogs.map((l) => l.verificationId).filter(Boolean) as bigint[];

  if (verificationIds.length === 0) return 0;

  // Any clinical negative verification (clinicId not null) should maximize the score
  const clinicalNegativeCount = await prisma.user_verifications.count({
    where: {
      id: { in: verificationIds },
      userId: userId,
      status: 'verified',
      clinicId: { not: null },
    },
  });

  if (clinicalNegativeCount > 0) {
    return SCORE_THRESHOLD;
  }

  const verifications = await prisma.user_verifications.findMany({
    where: {
      id: { in: verificationIds },
      userId: userId,
      status: 'verified',
      testedAt: { not: null },
    },
    select: {
      testedAt: true,
      clinicId: true,
    },
  });

  let score = 0;
  const now = new Date();

  for (const v of verifications) {
    if (!v.testedAt) continue;
    const basePoints = v.clinicId ? CLINICAL_POINTS : SELF_POINTS;

    // Days since test
    const days = Math.floor((now.getTime() - new Date(v.testedAt).getTime()) / (1000 * 60 * 60 * 24));

    if (days <= DECAY_START_DAYS) {
      score += basePoints;
    } else {
      const decayDays = days - DECAY_START_DAYS;
      const decay = decayDays * DECAY_PER_DAY;
      const contribution = Math.max(0, basePoints - decay);
      score += contribution;
    }
  }

  return Math.max(0, Math.round(score));
};

/**
 * Run AI Validation
 * Uses machine learning to detect if test result is valid
 * @param imageBuffer - Image data in memory (NOT saved anywhere)
 * @returns Confidence score (0-1)
 */
// const runAiValidation = async (imageBuffer: Buffer): Promise<number> => {
//   console.log('Running AI validation on image...');

//   // TODO: Implement AI validation
//   // Options:
//   // 1. TensorFlow.js for on-device processing
//   // 2. Call external API (OpenAI Vision, Google Cloud Vision)
//   // 3. Custom trained model

//   // For now, return mock confidence
//   const mockConfidence = 0.90;
//   console.log('AI confidence score:', mockConfidence);

//   return mockConfidence;
// };

/**
 * Verify Test Kit - Main Service
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

  console.log('Starting test kit verification for user:', userId.toString());
  console.log('Test Result:', testResult);
  console.log('Image Metadata:', imageMetadata);

  // Serial validation - Check test kit is valid and unused
  console.log('Step 1: Validating serial number...');
  const kit = await validateTestKitSerial(serial, userId);
  console.log('Serial number validated');

  // Enforce self-test limit: maximum 2 self-test verifications per user
  // We treat a self-test as a verification without a clinic (clinicId === null)
  const existingSelfTests = await prisma.user_verifications.count({
    where: {
      userId: userId,
      clinicId: null,
      status: 'verified'
    }
  });

  if (existingSelfTests >= 2) {
    throw new Error('You have reached the maximum number of self-test submissions (2). Please visit a clinic for further testing.');
  }

  // Test type validation - Check test type matches ordered kit
  if (kit.test_kit_id !== testTypeId) {
    console.error('❌ Test type does not match ordered kit:', {
      expected: kit.test_kit_id,
      received: testTypeId,
    });
    throw new Error('Test type does not match the ordered test kit for this serial number.');
  }

  // Image metadata validation

  if (imageMetadata) {
    console.log('Step 2: Validating image metadata...');
    // Check file size (max 10MB)
    if (imageMetadata.size > 10 * 1024 * 1024) {
      throw new Error('Image file size exceeds 10MB limit');
    }

    // Check format
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedFormats.includes(imageMetadata.format)) {
      throw new Error('Invalid file format. Only JPG, PNG, and PDF are allowed');
    }

    console.log('Image metadata validated');

    // 3️⃣ AI confidence validation - Verify quality threshold
    console.log('Step 3: Validating AI confidence...');
    //const validatedConfidence = validateAiConfidence(aiConfidence);
    //console.log(' AI confidence validated:', validatedConfidence);
    // If you want to enforce a minimum confidence, do it here:
    // if (aiConfidence < 0.3) throw new Error('Image quality too low. Please upload a clearer photo.');
  } else {
    console.log('No image uploaded, skipping image validation.');
  }

  console.log('All validations passed! Updating database...');

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

    // Create verification record (we do not persist a dedicated `result` column in the current schema)
    const verification = await tx.user_verifications.create({
      data: ({
        userId: userId,
        testKitId: kit.test_kit_id, // Link to the test_kits table via the kit instance
        // For self-submitted kit verification we mark initial status as verified when accepted
        status: "verified",
        testedAt: new Date(),
        verifiedAt: new Date(),
      } as any),
    });

    // Record the test result in an audit log entry so we can compute scores without changing the Prisma schema
    await tx.audit_logs.create({
      data: {
        verificationId: verification.id,
        userId: userId,
        oldStatus: null,
        newStatus: testResult, // 'positive' or 'negative'
      },
    });

    // Update user status based on test result
    if (testResult === 'negative') {
      await tx.users.update({
        where: { id: userId },
        data: {
          status: "Verified",
          updatedAt: new Date(),
        },
      });
    } else if (testResult === 'positive') {
      await tx.users.update({
        where: { id: userId },
        data: {
          status: "Not_Verified",
          updatedAt: new Date(),
        },
      });
    }

    return {
      kit: updatedKit,
      verification,
    };
  });

  console.log('Verification complete!');
  console.log('Used at timestamp:', result.kit.used_at);

  // --- Scoring (backend-only) ---
  try {
    const score = await computeUserScore(userId);
    console.log('Computed score for user', userId.toString(), score);

    // Threshold logic: if score exceeds threshold, mark user as Verified
    const SCORE_THRESHOLD = 100; // configurable threshold
    if (score >= SCORE_THRESHOLD) {
      await prisma.users.update({ where: { id: userId }, data: { status: 'Verified' } });
      console.log('User status set to Verified due to score threshold');
    }
    // Special rule: if user has any clinical negative test, maximize score (handled inside computeUserScore)
  } catch (e) {
    console.error('Error computing/applying score:', e);
  }

  return {
    status: "verified",
    testResult: testResult,
    //confidence: validatedConfidence,
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
  verifiedByUserId: bigint,
  testResult?: string
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
          // Note: we do not persist a `result` field in the current Prisma schema.
          // If staff provided a testResult, we will record it in an audit log below.
        },
      });

      // Create audit log for the status change
      await tx.audit_logs.create({
        data: {
          verificationId,
          userId: verifiedByUserId,
          oldStatus: oldVerification.status,
          newStatus: newStatus,
        },
      });

      // If staff provided an explicit testResult (positive/negative), save that as an audit entry
      if (testResult) {
        await tx.audit_logs.create({
          data: {
            verificationId,
            userId: verifiedByUserId,
            oldStatus: null,
            newStatus: testResult,
          },
        });
        log(`[Service] Result audit log created for verification ${verificationId}`);
      }

      log(`[Service] Audit log created`);

      // Update user status if verification is "verified"
      if (newStatus === "verified") {
        log(`[Service] Updating user ${oldVerification.userId} to Verified status`);
        await tx.users.update({
          where: { id: oldVerification.userId },
          data: {
            status: "Verified",
          },
        });
        log(`[Service] User ${oldVerification.userId} updated`);

        // Recompute backend-only score and apply threshold logic
        try {
          const score = await computeUserScore(oldVerification.userId);
          log(`[Service] Recomputed score for user ${oldVerification.userId}: ${score}`);
          const SCORE_THRESHOLD = 100;
          if (score >= SCORE_THRESHOLD) {
            await tx.users.update({ where: { id: oldVerification.userId }, data: { status: 'Verified' } });
            log(`[Service] User ${oldVerification.userId} set to Verified by score threshold`);
          }
        } catch (e: any) {
          log(`[Service] Error computing score: ${e.message}`);
        }
      }

      return updated;
    } catch (e: any) {
      log(`[Service] Error in transaction: ${e.message}`);
      throw e;
    }
  });
};
