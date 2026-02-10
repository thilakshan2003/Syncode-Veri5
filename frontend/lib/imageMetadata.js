/**
 * Image Metadata Validation
 * 
 * PRIVACY-PRESERVING ARCHITECTURE:
 * - Runs on FRONTEND (browser)
 * - Validates EXIF metadata to detect edited/fake images
 * - Image never sent to backend
 * - Validates before AI inference
 * 
 * SECURITY CHECKS:
 * - Screenshot detection (no EXIF data)
 * - Edit detection (Software tag present)
 * - Timestamp validation (DateTimeOriginal)
 * - Camera authenticity (Make/Model)
 */

/**
 * Extract EXIF data from image file
 * 
 * @param {File} imageFile - Image file from camera/file input
 * @returns {Promise<Object>} EXIF metadata object
 */
const extractExifData = async (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        const dataView = new DataView(arrayBuffer);
        
        // Check for JPEG marker (0xFFD8)
        if (dataView.getUint16(0, false) !== 0xFFD8) {
          reject(new Error('Not a JPEG image'));
          return;
        }
        
        // Find EXIF marker (0xFFE1)
        let offset = 2;
        while (offset < dataView.byteLength) {
          const marker = dataView.getUint16(offset, false);
          
          if (marker === 0xFFE1) {
            // Found EXIF segment
            const exifData = parseExifSegment(dataView, offset);
            resolve(exifData);
            return;
          }
          
          // Move to next marker
          const segmentLength = dataView.getUint16(offset + 2, false);
          offset += segmentLength + 2;
        }
        
        // No EXIF data found (likely a screenshot)
        resolve(null);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read image file'));
    
    // Read first 64KB (EXIF is usually near the start)
    const blob = imageFile.slice(0, 65536);
    reader.readAsArrayBuffer(blob);
  });
};

/**
 * Parse EXIF segment from DataView
 * 
 * @param {DataView} dataView - Image data
 * @param {number} offset - Offset to EXIF segment
 * @returns {Object} Parsed EXIF tags
 */
const parseExifSegment = (dataView, offset) => {
  const exifData = {};
  
  try {
    // Skip APP1 marker and length
    offset += 4;
    
    // Check EXIF identifier "Exif\0\0"
    const exifIdentifier = String.fromCharCode(
      dataView.getUint8(offset),
      dataView.getUint8(offset + 1),
      dataView.getUint8(offset + 2),
      dataView.getUint8(offset + 3)
    );
    
    if (exifIdentifier !== 'Exif') {
      return exifData;
    }
    
    offset += 6; // Skip "Exif\0\0"
    
    // Check byte order (II = little-endian, MM = big-endian)
    const byteOrder = String.fromCharCode(
      dataView.getUint8(offset),
      dataView.getUint8(offset + 1)
    );
    const littleEndian = byteOrder === 'II';
    
    offset += 2;
    
    // Skip 0x002A marker
    offset += 2;
    
    // Get offset to first IFD
    const ifdOffset = dataView.getUint32(offset, littleEndian);
    
    // Parse IFD tags
    const tiffOffset = offset - 2; // TIFF header start
    parseIFD(dataView, tiffOffset + ifdOffset, littleEndian, exifData);
    
  } catch (error) {
    console.error('Error parsing EXIF:', error);
  }
  
  return exifData;
};

/**
 * Parse IFD (Image File Directory)
 * 
 * @param {DataView} dataView - Image data
 * @param {number} offset - Offset to IFD
 * @param {boolean} littleEndian - Byte order
 * @param {Object} exifData - Object to populate with tags
 */
const parseIFD = (dataView, offset, littleEndian, exifData) => {
  // EXIF tag IDs we care about
  const TAGS = {
    0x010F: 'Make',              // Camera manufacturer
    0x0110: 'Model',             // Camera model
    0x0131: 'Software',          // Editing software (BAD!)
    0x0132: 'DateTime',          // File modification time
    0x9003: 'DateTimeOriginal',  // When photo was taken (GOOD!)
    0x9004: 'DateTimeDigitized', // When photo was digitized
  };
  
  try {
    const numEntries = dataView.getUint16(offset, littleEndian);
    offset += 2;
    
    for (let i = 0; i < numEntries; i++) {
      const tag = dataView.getUint16(offset, littleEndian);
      const type = dataView.getUint16(offset + 2, littleEndian);
      const count = dataView.getUint32(offset + 4, littleEndian);
      const valueOffset = offset + 8;
      
      const tagName = TAGS[tag];
      
      if (tagName) {
        // Read string value (type 2 = ASCII)
        if (type === 2) {
          let str = '';
          for (let j = 0; j < Math.min(count, 100); j++) {
            const charCode = dataView.getUint8(valueOffset + j);
            if (charCode === 0) break;
            str += String.fromCharCode(charCode);
          }
          exifData[tagName] = str;
        }
      }
      
      offset += 12; // Each IFD entry is 12 bytes
    }
  } catch (error) {
    console.error('Error parsing IFD:', error);
  }
};

/**
 * Validate image metadata for authenticity
 * 
 * VALIDATION CHECKS:
 * 1. EXIF data exists (not a screenshot)
 * 2. No editing software markers
 * 3. DateTimeOriginal present (real camera photo)
 * 4. Camera Make/Model present (authentic device)
 * 
 * @param {File} imageFile - Image file from camera
 * @returns {Promise<{valid: boolean, reason: string, metadata: Object}>}
 */
export const validateImageMetadata = async (imageFile) => {
  console.log('🔍 Validating image metadata...');
  
  try {
    // Extract EXIF data
    const exifData = await extractExifData(imageFile);
    
    // Check 1: EXIF data exists
    if (!exifData || Object.keys(exifData).length === 0) {
      return {
        valid: false,
        reason: '⚠️ No EXIF data found. This may be a screenshot or edited image. Please use your camera to take a fresh photo.',
        metadata: null,
      };
    }
    
    // Check 2: No editing software
    if (exifData.Software) {
      // Whitelist common camera software
      const allowedSoftware = [
        'Android',
        'iOS',
        'iPhone',
        'Google Camera',
        'Samsung Camera',
      ];
      
      const isAllowed = allowedSoftware.some(sw => 
        exifData.Software.toLowerCase().includes(sw.toLowerCase())
      );
      
      if (!isAllowed) {
        return {
          valid: false,
          reason: `⚠️ Image appears to be edited (Software: ${exifData.Software}). Please take a fresh photo with your camera.`,
          metadata: exifData,
        };
      }
    }
    
    // Check 3: DateTimeOriginal exists
    if (!exifData.DateTimeOriginal && !exifData.DateTimeDigitized) {
      return {
        valid: false,
        reason: '⚠️ Missing photo timestamp. This may be a screenshot or edited image. Please use your camera to take a fresh photo.',
        metadata: exifData,
      };
    }
    
    // Check 4: Camera Make/Model exists (optional but recommended)
    if (!exifData.Make && !exifData.Model) {
      console.warn('⚠️ Camera Make/Model missing, but allowing...');
    }
    
    // All checks passed
    console.log('✅ Metadata validation passed:', {
      Make: exifData.Make,
      Model: exifData.Model,
      DateTimeOriginal: exifData.DateTimeOriginal,
    });
    
    return {
      valid: true,
      reason: '✅ Image metadata validated successfully',
      metadata: exifData,
    };
    
  } catch (error) {
    console.error('❌ Metadata validation error:', error);
    return {
      valid: false,
      reason: `⚠️ Failed to validate metadata: ${error.message}`,
      metadata: null,
    };
  }
};

/**
 * Quick validation (just check if EXIF exists)
 * 
 * @param {File} imageFile - Image file
 * @returns {Promise<boolean>}
 */
export const hasExifData = async (imageFile) => {
  try {
    const exifData = await extractExifData(imageFile);
    return exifData !== null && Object.keys(exifData).length > 0;
  } catch (error) {
    return false;
  }
};

/**
 * Get human-readable metadata summary
 * 
 * @param {File} imageFile - Image file
 * @returns {Promise<string>}
 */
export const getMetadataSummary = async (imageFile) => {
  try {
    const exifData = await extractExifData(imageFile);
    
    if (!exifData || Object.keys(exifData).length === 0) {
      return 'No metadata available (likely a screenshot)';
    }
    
    const parts = [];
    
    if (exifData.Make || exifData.Model) {
      parts.push(`📷 ${exifData.Make || ''} ${exifData.Model || ''}`.trim());
    }
    
    if (exifData.DateTimeOriginal) {
      parts.push(`📅 ${exifData.DateTimeOriginal}`);
    }
    
    if (exifData.Software) {
      parts.push(`💻 ${exifData.Software}`);
    }
    
    return parts.join(' • ') || 'Limited metadata available';
    
  } catch (error) {
    return 'Error reading metadata';
  }
};
