/**
 * Test Kit Camera Validation Component
 * 
 * PRIVACY-PRESERVING FEATURES:
 * - Camera-only capture (no file upload)
 * - Metadata validation (screenshot detection)
 * - AI runs locally on device
 * - Image never sent to backend
 * - Only confidence score transmitted
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { validateWithFeedback, warmupModel } from '@/lib/aiValidation';
import { validateImageMetadata, getMetadataSummary } from '@/lib/imageMetadata';
import axios from 'axios';

export default function TestKitValidator({ serial, testTypeId, onSuccess }) {
  const [stream, setStream] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [metadataInfo, setMetadataInfo] = useState('');
  const [validationStep, setValidationStep] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Warmup AI model on component mount
  useEffect(() => {
    warmupModel().catch(err => {
      console.error('Model warmup failed:', err);
    });
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please grant camera permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Capture and validate image
  const captureAndValidate = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Camera not ready');
      return;
    }

    setIsValidating(true);
    setError(null);
    setMessage('');
    setMetadataInfo('');

    try {
      // Step 1: Capture frame from video
      setValidationStep('📸 Capturing image...');
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      // Convert canvas to blob for metadata extraction
      const imageBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.95);
      });
      
      // Create File object for metadata validation
      const imageFile = new File([imageBlob], 'test-kit.jpg', { type: 'image/jpeg' });

      // Step 2: Validate metadata (screenshot detection)
      setValidationStep('🔍 Checking image authenticity...');
      console.log('🔍 Validating metadata...');
      const metadataResult = await validateImageMetadata(imageFile);
      
      // Get metadata summary for display
      const summary = await getMetadataSummary(imageFile);
      setMetadataInfo(summary);
      
      if (!metadataResult.valid) {
        console.error('❌ Metadata validation failed:', metadataResult.reason);
        setError(metadataResult.reason);
        setIsValidating(false);
        return;
      }
      
      console.log('✅ Metadata validation passed');

      // Step 3: Create image element for TensorFlow.js
      const imageElement = new Image();
      imageElement.src = canvas.toDataURL('image/jpeg');
      
      await new Promise((resolve) => {
        imageElement.onload = resolve;
      });

      // Step 4: Run AI validation locally
      setValidationStep('🤖 Running AI validation...');
      console.log('🤖 Running local AI validation...');
      const result = await validateWithFeedback(imageElement);
      
      setConfidence(result.confidence);
      setMessage(result.message);

      if (!result.passed) {
        setError(result.message);
        setIsValidating(false);
        return;
      }

      // Step 5: Send only serial and confidence to backend
      setValidationStep('📤 Submitting to server...');
      console.log('📤 Sending validation to backend...');
      const response = await axios.post(
        '/api/verification/kit',
        {
          serial: serial,
          aiConfidence: result.confidence,
          testTypeId: testTypeId,
        },
        { withCredentials: true }
      );

      console.log('✅ Verification successful:', response.data);
      
      // Stop camera
      stopCamera();
      
      // Call success callback
      if (onSuccess) {
        onSuccess(response.data);
      }

    } catch (err) {
      console.error('Validation error:', err);
      setError(err.response?.data?.error || err.message || 'Validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">
        Test Kit Validation
      </h2>
      
      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="font-semibold mb-2">🔒 Privacy Protected:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>AI runs on your device</li>
          <li>Images never leave your phone</li>
          <li>Only validation score sent to server</li>
        </ul>
      </div>

      {/* Camera Feed */}
      <div className="relative w-full max-w-md">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg border-2 border-gray-300"
        />
        
        {/* Overlay guide */}
        {stream && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-4 border-green-400 rounded-lg w-3/4 h-3/4 opacity-50" />
          </div>
        )}
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Validation Step Indicator */}
      {isValidating && validationStep && (
        <div className="w-full max-w-md p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="font-medium">{validationStep}</span>
        </div>
      )}

      {/* Metadata Info */}
      {metadataInfo && (
        <div className="w-full max-w-md p-3 bg-green-50 text-green-800 rounded-lg border border-green-200">
          <p className="text-xs font-medium mb-1">📋 Image Info:</p>
          <p className="text-sm">{metadataInfo}</p>
        </div>
      )}

      {/* Confidence Display */}
      {confidence !== null && (
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">AI Confidence:</span>
            <span className="text-lg font-bold text-green-600">
              {(confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all ${
                confidence >= 0.85 ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`w-full max-w-md p-4 rounded-lg ${
          confidence >= 0.85 ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'
        }`}>
          <p className="whitespace-pre-line">{message}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="w-full max-w-md p-4 bg-red-50 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 w-full max-w-md">
        {!stream ? (
          <button
            onClick={startCamera}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            📷 Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={captureAndValidate}
              disabled={isValidating}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {isValidating ? '⏳ Validating...' : '✓ Capture & Validate'}
            </button>
            <button
              onClick={stopCamera}
              disabled={isValidating}
              className="bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
            >
              ✕ Stop
            </button>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="w-full max-w-md text-sm text-gray-600 space-y-2">
        <p className="font-semibold">📸 Photo Guidelines:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Place test kit on flat surface</li>
          <li>Ensure good lighting (avoid shadows)</li>
          <li>Keep camera steady and focused</li>
          <li>Entire kit must be visible</li>
          <li>Avoid glare or reflections</li>
        </ul>
      </div>
    </div>
  );
}
