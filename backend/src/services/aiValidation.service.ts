/**
 * AI Validation Service
 * 
 * PRIVACY DESIGN:
 * - AI inference runs on FRONTEND (TensorFlow.js)
 * - Backend receives ONLY a confidence score (number)
 * - NO images are transmitted to backend
 * - NO medical data is inferred or stored
 * - Backend validates confidence threshold ONLY
 */

/**
 * Validates AI confidence score from frontend
 * 
 * @param confidence - Numeric confidence score from frontend AI (0-1)
 * @returns The confidence score if valid
 * @throws Error if confidence is invalid or below threshold
 * 
 * SECURITY:
 * - Validates type (must be number)
 * - Validates bounds (0 <= confidence <= 1)
 * - Enforces minimum threshold (0.85)
 * - Prevents malicious values (NaN, Infinity, negative)
 */
export const validateAiConfidence = (confidence: number): number => {
  console.log('🤖 Validating AI confidence score:', confidence);

  // Type validation
  if (typeof confidence !== 'number') {
    console.error('❌ Invalid confidence type:', typeof confidence);
    throw new Error('AI confidence must be a number');
  }

  // Bounds validation
  if (Number.isNaN(confidence) || !Number.isFinite(confidence)) {
    console.error('❌ Invalid confidence value: NaN or Infinity');
    throw new Error('AI confidence must be a finite number');
  }

  if (confidence < 0 || confidence > 1) {
    console.error('❌ Confidence out of bounds:', confidence);
    throw new Error('AI confidence must be between 0 and 1');
  }

  // Threshold validation
  const MIN_CONFIDENCE = 0.85;
  if (confidence < MIN_CONFIDENCE) {
    console.warn(`⚠️ Confidence below threshold: ${confidence} < ${MIN_CONFIDENCE}`);
    throw new Error(
      `Image quality check failed. Confidence: ${(confidence * 100).toFixed(1)}%. ` +
      `Please ensure good lighting and clear focus, then retake the photo.`
    );
  }

  console.log(`✅ AI confidence valid: ${(confidence * 100).toFixed(1)}%`);
  return confidence;
};

/**
 * Gets the minimum confidence threshold
 * Useful for frontend to display requirements
 */
export const getMinConfidenceThreshold = (): number => {
  return 0.85;
};
