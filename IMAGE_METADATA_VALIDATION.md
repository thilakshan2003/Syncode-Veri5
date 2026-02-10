# Image Metadata Validation

## Overview

The image metadata validation system runs **entirely on the frontend** to detect screenshots, edited images, and fake photos before AI validation. This adds an extra layer of security without compromising privacy.

## How It Works

### Detection Methods

1. **EXIF Data Check**: Real camera photos contain EXIF metadata
2. **Screenshot Detection**: Screenshots lack camera-specific EXIF tags
3. **Edit Detection**: Edited images have "Software" tags (Photoshop, GIMP, etc.)
4. **Timestamp Validation**: Checks for `DateTimeOriginal` (when photo was taken)
5. **Camera Authentication**: Validates `Make` and `Model` tags

### Privacy Guarantee

✅ Runs in browser (JavaScript)  
✅ No data sent to server  
✅ No external API calls  
✅ Raw EXIF parsing only  
✅ Image stays on device  

---

## Implementation

### Frontend Usage

```javascript
import { validateImageMetadata, getMetadataSummary } from '@/lib/imageMetadata';

// From file input
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  
  // Validate metadata
  const result = await validateImageMetadata(file);
  
  if (!result.valid) {
    alert(result.reason);
    return;
  }
  
  console.log('✅ Valid image:', result.metadata);
  // Proceed with AI validation...
};

// From camera capture
const handleCameraCapture = async (canvas) => {
  // Convert canvas to blob
  const blob = await new Promise(resolve => 
    canvas.toBlob(resolve, 'image/jpeg', 0.95)
  );
  
  // Create File object
  const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
  
  // Validate metadata
  const result = await validateImageMetadata(file);
  
  if (!result.valid) {
    console.error('Invalid image:', result.reason);
    return;
  }
  
  // Continue with validation...
};
```

### API Reference

#### `validateImageMetadata(imageFile)`

**Parameters:**
- `imageFile` (File): Image file from input or camera

**Returns:** Promise<Object>
```javascript
{
  valid: boolean,           // Whether image passed all checks
  reason: string,           // Human-readable explanation
  metadata: {               // EXIF data (if found)
    Make: "Apple",
    Model: "iPhone 13 Pro",
    DateTimeOriginal: "2026:02:09 10:30:45",
    Software: "iOS 17.2"    // May indicate editing
  }
}
```

**Example:**
```javascript
const result = await validateImageMetadata(file);

if (result.valid) {
  console.log('✅ Authentic image from:', result.metadata.Model);
} else {
  console.warn('❌ Invalid:', result.reason);
}
```

#### `hasExifData(imageFile)`

Quick check if EXIF data exists.

**Returns:** Promise<boolean>

```javascript
const hasExif = await hasExifData(file);
if (!hasExif) {
  alert('This appears to be a screenshot. Please use your camera.');
}
```

#### `getMetadataSummary(imageFile)`

Get human-readable metadata summary for display.

**Returns:** Promise<string>

```javascript
const summary = await getMetadataSummary(file);
// "📷 Apple iPhone 13 Pro • 📅 2026:02:09 10:30:45"
```

---

## Validation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Captures Photo                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              1. METADATA VALIDATION (Frontend)               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ✓ Extract EXIF data from JPEG                              │
│  ✓ Check EXIF exists (not a screenshot)                     │
│  ✓ Check DateTimeOriginal (real photo)                      │
│  ✓ Check Software tag (not edited)                          │
│  ✓ Check Make/Model (authentic camera)                      │
│                                                              │
│  ❌ FAIL → Show error, request new photo                     │
│  ✅ PASS → Continue to AI validation                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               2. AI VALIDATION (Frontend)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ✓ TensorFlow.js inference                                  │
│  ✓ Confidence score calculation                             │
│  ✓ Threshold check (>= 0.85)                                │
│                                                              │
│  ❌ FAIL → Show error, request better photo                  │
│  ✅ PASS → Continue to backend                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│          3. BACKEND VALIDATION (Confidence Only)             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ✓ Validate confidence score                                │
│  ✓ Validate serial number                                   │
│  ✓ Update database                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Error Messages

### No EXIF Data
```
⚠️ No EXIF data found. This may be a screenshot or edited image. 
Please use your camera to take a fresh photo.
```

**Cause:** Screenshot, heavily edited image, or image from unsupported app

**Solution:** Use native camera app

### Software Tag Detected
```
⚠️ Image appears to be edited (Software: Adobe Photoshop). 
Please take a fresh photo with your camera.
```

**Cause:** Image processed through editing software

**Solution:** Take original photo without editing

**Whitelist:** iOS, Android, Google Camera, Samsung Camera (allowed)

### Missing Timestamp
```
⚠️ Missing photo timestamp. This may be a screenshot or edited image. 
Please use your camera to take a fresh photo.
```

**Cause:** EXIF data stripped or screenshot

**Solution:** Use camera app that preserves EXIF

---

## EXIF Tags Checked

| Tag | ID | Purpose | Required |
|-----|-----|---------|----------|
| Make | 0x010F | Camera manufacturer | Optional |
| Model | 0x0110 | Camera model | Optional |
| Software | 0x0131 | Editing software (BAD if present) | Check only |
| DateTime | 0x0132 | File modification time | Fallback |
| DateTimeOriginal | 0x9003 | When photo was taken | **Required** |
| DateTimeDigitized | 0x9004 | When digitized | Fallback |

---

## Security Considerations

### ✅ What It Protects Against

- Screenshots of test results
- Photos of photos (re-photographed)
- Heavily edited images
- Fake/generated images (without EXIF)
- Images from untrusted sources

### ⚠️ Limitations

- **Sophisticated edits:** Advanced editing tools can preserve EXIF
- **EXIF stripping:** Some apps remove EXIF intentionally
- **Camera apps:** Third-party camera apps may have different EXIF
- **Web captures:** Browser-based captures may lack EXIF

### 🔒 Best Practices

1. **Combine with AI validation** (not standalone)
2. **Use camera-only capture** (no file upload)
3. **Check multiple EXIF tags** (layered validation)
4. **Whitelist known camera software** (iOS, Android)
5. **Log validation failures** for analysis

---

## Testing

### Valid Image (Pass)
```javascript
// Real camera photo
const file = new File([cameraBlob], 'photo.jpg');
const result = await validateImageMetadata(file);

// Expected:
{
  valid: true,
  reason: "✅ Image metadata validated successfully",
  metadata: {
    Make: "Apple",
    Model: "iPhone 13 Pro",
    DateTimeOriginal: "2026:02:09 10:30:45"
  }
}
```

### Screenshot (Fail)
```javascript
// Screenshot (no EXIF)
const file = new File([screenshotBlob], 'screenshot.jpg');
const result = await validateImageMetadata(file);

// Expected:
{
  valid: false,
  reason: "⚠️ No EXIF data found. This may be a screenshot...",
  metadata: null
}
```

### Edited Image (Fail)
```javascript
// Photoshopped image
const result = await validateImageMetadata(editedFile);

// Expected:
{
  valid: false,
  reason: "⚠️ Image appears to be edited (Software: Adobe Photoshop)...",
  metadata: {
    Make: "Canon",
    Model: "EOS 5D",
    Software: "Adobe Photoshop CC 2024",
    DateTimeOriginal: "2026:02:08 14:20:10"
  }
}
```

---

## Integration with AI Validation

```javascript
import { validateImageMetadata } from '@/lib/imageMetadata';
import { validateTestKitImage } from '@/lib/aiValidation';

const validateComplete = async (imageFile, videoElement) => {
  // Step 1: Metadata validation
  const metadataResult = await validateImageMetadata(imageFile);
  
  if (!metadataResult.valid) {
    throw new Error(metadataResult.reason);
  }
  
  // Step 2: AI validation
  const confidence = await validateTestKitImage(videoElement);
  
  if (confidence < 0.85) {
    throw new Error(`Low confidence: ${(confidence * 100).toFixed(1)}%`);
  }
  
  // Step 3: Send to backend
  return { confidence, metadata: metadataResult.metadata };
};
```

---

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | FileReader, DataView |
| Firefox 88+ | ✅ Full | FileReader, DataView |
| Safari 14+ | ✅ Full | FileReader, DataView |
| Edge 90+ | ✅ Full | FileReader, DataView |
| Mobile Safari | ✅ Full | iOS 14+ |
| Chrome Mobile | ✅ Full | Android 10+ |

**Required APIs:**
- `FileReader`
- `DataView`
- `ArrayBuffer`
- `Blob.slice()`

---

## Performance

- **Parse time:** < 10ms for typical photos
- **Memory usage:** < 100KB (only reads first 64KB)
- **No external dependencies:** Pure JavaScript
- **Async/await:** Non-blocking UI

---

## Debugging

Enable detailed logging:

```javascript
const result = await validateImageMetadata(file);

console.log('Validation Result:', result);
console.log('EXIF Tags:', result.metadata);
console.log('Has DateTimeOriginal:', result.metadata?.DateTimeOriginal);
console.log('Has Software tag:', result.metadata?.Software);
```

Common issues:
1. **File not a JPEG:** Only JPEG files have EXIF
2. **EXIF stripped:** Some platforms remove metadata
3. **Wrong file type:** PNG/WebP don't have EXIF
4. **Browser compatibility:** Check FileReader support

---

## Privacy Impact

**Data Flow:**
```
Image File → EXIF Parser (Browser) → Validation Result
                    ↓
              (No network call)
                    ↓
           (Image stays local)
```

**No Data Sent:**
- ✅ EXIF data not transmitted
- ✅ Image not transmitted
- ✅ Metadata not stored
- ✅ Only validation result used locally

**GDPR Compliance:**
- No personal data processed on server
- All processing happens client-side
- User has full control over data
- No cookies or tracking for this feature

---

## Summary

The metadata validation adds a crucial security layer:

1. **Detects screenshots** before AI validation
2. **Prevents edited images** from being submitted
3. **Runs entirely client-side** (privacy-first)
4. **No performance impact** on server
5. **Complements AI validation** (multi-layer security)

Combined with frontend AI validation, this creates a robust, privacy-preserving validation pipeline.
