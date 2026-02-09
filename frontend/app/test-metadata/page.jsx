/**
 * Metadata Validation Test Page
 * 
 * Test the EXIF metadata validation system
 * Upload images to see validation results
 */

'use client';

import { useState } from 'react';
import { validateImageMetadata, getMetadataSummary, hasExifData } from '@/lib/imageMetadata';

export default function MetadataTestPage() {
  const [result, setResult] = useState(null);
  const [summary, setSummary] = useState('');
  const [hasExif, setHasExif] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setResult(null);
    setSummary('');
    setHasExif(null);

    try {
      // Run all validations
      const [validationResult, summaryText, exifExists] = await Promise.all([
        validateImageMetadata(file),
        getMetadataSummary(file),
        hasExifData(file),
      ]);

      setResult(validationResult);
      setSummary(summaryText);
      setHasExif(exifExists);

      console.log('Validation Result:', validationResult);
      console.log('Summary:', summaryText);
      console.log('Has EXIF:', exifExists);

    } catch (error) {
      console.error('Error:', error);
      setResult({
        valid: false,
        reason: `Error: ${error.message}`,
        metadata: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          🔍 Image Metadata Validator
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Upload Image to Test</h2>
          
          <input
            type="file"
            accept="image/jpeg,image/jpg"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />

          <p className="mt-2 text-sm text-gray-600">
            Only JPEG files are supported (EXIF metadata)
          </p>
        </div>

        {isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-blue-800 font-medium">Analyzing image...</p>
          </div>
        )}

        {/* Quick Check */}
        {hasExif !== null && (
          <div className={`border rounded-lg p-4 mb-4 ${
            hasExif ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <h3 className="font-semibold mb-2">
              {hasExif ? '✅ EXIF Data Found' : '❌ No EXIF Data'}
            </h3>
            <p className="text-sm">
              {hasExif 
                ? 'This image contains metadata (likely a real camera photo)'
                : 'No EXIF metadata (likely a screenshot or edited image)'}
            </p>
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-2">📋 Metadata Summary</h3>
            <p className="text-sm">{summary}</p>
          </div>
        )}

        {/* Detailed Result */}
        {result && (
          <div className={`border rounded-lg p-6 ${
            result.valid 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              result.valid ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.valid ? '✅ Valid Image' : '❌ Invalid Image'}
            </h3>

            <div className={`p-4 rounded-lg mb-4 ${
              result.valid ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <p className={`font-medium ${
                result.valid ? 'text-green-900' : 'text-red-900'
              }`}>
                {result.reason}
              </p>
            </div>

            {result.metadata && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold mb-3 text-gray-900">
                  📸 EXIF Tags Found:
                </h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(result.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!result.metadata && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600">
                  No EXIF metadata found in this image.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gray-100 rounded-lg p-6 mt-6">
          <h3 className="font-semibold mb-3">ℹ️ How It Works</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span>1.</span>
              <span>Extracts EXIF metadata from JPEG images</span>
            </li>
            <li className="flex gap-2">
              <span>2.</span>
              <span>Checks for camera-specific tags (Make, Model, DateTimeOriginal)</span>
            </li>
            <li className="flex gap-2">
              <span>3.</span>
              <span>Detects editing software tags (Photoshop, GIMP, etc.)</span>
            </li>
            <li className="flex gap-2">
              <span>4.</span>
              <span>Validates image authenticity (screenshot detection)</span>
            </li>
          </ul>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              🔒 <strong>Privacy:</strong> All processing happens in your browser. 
              No data is sent to any server.
            </p>
          </div>
        </div>

        {/* Test Cases */}
        <div className="bg-white rounded-lg p-6 mt-6 border border-gray-200">
          <h3 className="font-semibold mb-3">🧪 Test Cases</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <p className="font-medium text-green-800">✅ Should Pass:</p>
              <ul className="mt-1 ml-4 list-disc text-green-700">
                <li>Photos taken with native camera app</li>
                <li>Images from iPhone/Android cameras</li>
                <li>Unedited photos from DSLR/mirrorless cameras</li>
              </ul>
            </div>

            <div className="p-3 bg-red-50 rounded border border-red-200">
              <p className="font-medium text-red-800">❌ Should Fail:</p>
              <ul className="mt-1 ml-4 list-disc text-red-700">
                <li>Screenshots (no EXIF data)</li>
                <li>Photos edited in Photoshop/GIMP</li>
                <li>Images with stripped metadata</li>
                <li>Web-downloaded images without EXIF</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
