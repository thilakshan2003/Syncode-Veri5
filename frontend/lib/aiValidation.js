/**
 * AI Image Validation using TensorFlow.js
 * 
 * PRIVACY ARCHITECTURE:
 * - AI runs 100% on user's device (frontend)
 * - Images NEVER sent to backend
 * - Model loaded once and cached
 * - Inference happens in browser memory
 * - Only confidence score sent to backend
 * 
 * SECURITY:
 * - Camera-only capture (no file upload to prevent screenshots)
 * - Image processed and discarded immediately
 * - No image storage on device
 * - No third-party API calls
 */

import * as tf from '@tensorflow/tfjs';

// Model configuration
const MODEL_URL = '/models/test-kit-validator/model.json';
const IMAGE_SIZE = 224;
const MIN_CONFIDENCE_THRESHOLD = 0.85;

// Class labels (order must match training)
const CLASS_LABELS = {
  VALID_KIT: 0,
  INVALID: 1,
};

/**
 * Singleton model loader
 * Loads model once and caches it for subsequent validations
 */
let cachedModel = null;

export const loadModel = async () => {
  if (cachedModel) {
    console.log('✅ Using cached TensorFlow.js model');
    return cachedModel;
  }

  console.log('📦 Loading TensorFlow.js model...');
  try {
    cachedModel = await tf.loadLayersModel(MODEL_URL);
    console.log('✅ Model loaded successfully');
    return cachedModel;
  } catch (error) {
    console.error('❌ Failed to load model:', error);
    throw new Error('AI model failed to load. Please check your connection.');
  }
};

/**
 * Preprocess image for model input
 * 
 * @param {HTMLImageElement | HTMLVideoElement} imageElement - Image from camera
 * @returns {tf.Tensor3D} Preprocessed tensor ready for inference
 */
const preprocessImage = (imageElement) => {
  return tf.tidy(() => {
    // Convert image to tensor
    let tensor = tf.browser.fromPixels(imageElement);

    // Resize to model input size
    const resized = tf.image.resizeBilinear(tensor, [IMAGE_SIZE, IMAGE_SIZE]);

    // Normalize pixel values to [0, 1]
    const normalized = resized.div(255.0);

    return normalized;
  });
};

/**
 * Run AI inference on test kit image
 * 
 * PRIVACY GUARANTEE:
 * - Image processed in browser memory only
 * - Tensor disposed immediately after inference
 * - No image data leaves the device
 * 
 * @param {HTMLImageElement | HTMLVideoElement} imageElement - Image from camera capture
 * @returns {Promise<number>} Confidence score (0-1) for VALID_KIT class
 */
export const validateTestKitImage = async (imageElement) => {
  console.log('🤖 Starting AI validation...');

  let inputTensor = null;
  let batchedTensor = null;

  try {
    // Load model if not cached
    const model = await loadModel();

    // Preprocess image
    inputTensor = preprocessImage(imageElement);

    // Add batch dimension [1, 224, 224, 3]
    batchedTensor = inputTensor.expandDims(0);

    // Run inference
    const predictions = model.predict(batchedTensor);

    // Extract confidence for VALID_KIT class
    const confidenceArray = await predictions.data();
    const validKitConfidence = confidenceArray[CLASS_LABELS.VALID_KIT];

    // Clean up tensors
    predictions.dispose();
    console.log(`✅ AI inference complete: ${(validKitConfidence * 100).toFixed(1)}% confidence`);

    return validKitConfidence;

  } catch (error) {
    console.error('❌ AI validation error:', error);
    throw new Error('AI validation failed. Please try again.');
  } finally {
    // CRITICAL: Dispose all tensors to free memory
    // This ensures the image is removed from memory
    if (inputTensor) inputTensor.dispose();
    if (batchedTensor) batchedTensor.dispose();
    console.log('🧹 Tensors disposed - image removed from memory');
  }
};

/**
 * Validate with visual feedback
 * 
 * @param {HTMLImageElement | HTMLVideoElement} imageElement - Image from camera
 * @returns {Promise<{confidence: number, passed: boolean, message: string}>}
 */
export const validateWithFeedback = async (imageElement) => {
  const confidence = await validateTestKitImage(imageElement);

  const passed = confidence >= MIN_CONFIDENCE_THRESHOLD;
  
  let message;
  if (passed) {
    message = `✅ Image validated! Confidence: ${(confidence * 100).toFixed(1)}%`;
  } else {
    message = 
      `⚠️ Image quality too low (${(confidence * 100).toFixed(1)}%). ` +
      `Please ensure:\n` +
      `• Good lighting\n` +
      `• Clear focus on test kit\n` +
      `• No glare or shadows\n` +
      `• Entire kit visible in frame`;
  }

  return { confidence, passed, message };
};

/**
 * Get minimum confidence threshold
 * Useful for displaying requirements to user
 * @returns {number}
 */
export const getMinConfidence = () => {
  return MIN_CONFIDENCE_THRESHOLD;
};

/**
 * Warmup model (optional)
 * Run once on app load to speed up first inference
 * @returns {Promise<void>}
 */
export const warmupModel = async () => {
  console.log('🔥 Warming up AI model...');
  
  const model = await loadModel();
  
  // Create dummy input
  const dummyInput = tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
  
  // Run inference
  const output = model.predict(dummyInput);
  
  // Clean up
  output.dispose();
  dummyInput.dispose();
  
  console.log('✅ Model warmed up');
};

