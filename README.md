# Veri5 (By Syncode)

> **Status:** This project is under active development. A privacy-first STI testing and verification platform.

## Overview

Veri5 is a full-stack platform for STI testing workflows, verification, and privacy-preserving partner status sharing. Built with security and user privacy as core principles.

**Key Features:**
- 🔒 Privacy-first AI validation (runs entirely on user's device)
- 📸 Camera-based test kit validation with metadata verification
- 🏥 Test verification and status tracking
- 🤝 Anonymous partner status sharing
- 📊 Health dashboard with testing history

**Technology Stack:**
- **Frontend:** Next.js 14+ with React
- **Backend:** Express/TypeScript with Prisma ORM
- **Database:** PostgreSQL
- **AI:** TensorFlow.js (browser-based)
- **Deployment:** Docker Compose

---

## Prerequisites

- **Node.js** 20+
- **Docker** + **Docker Compose** (recommended)
- **PostgreSQL** (if running without Docker)

---

## Quick Start

### Using Docker Compose (Recommended)

1. **Create environment file** in the repo root:

```bash
# .env
POSTGRES_USER=veri5
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=veri5
DATABASE_URL="postgresql://veri5:your_secure_password@postgres:5432/veri5"
```

2. **Start all services:**

```bash
docker compose up --build
```

3. **Seed the database** (first time only):

```bash
docker compose exec backend npx prisma db seed
```

**Services will be available at:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- PostgreSQL: `localhost:5432`

### Local Development (Without Docker)

#### Backend Setup

```bash
cd backend
npm install

# Set DATABASE_URL in backend/.env
echo 'DATABASE_URL="postgresql://veri5:veri5@localhost:5432/veri5"' > .env

# Run migrations and generate Prisma client
npx prisma migrate dev
npx prisma generate

# Seed database (optional)
npx prisma db seed

# Start backend server
npm run dev
```

**Backend available at:** `http://localhost:5000`

#### Frontend Setup

```bash
cd frontend
npm install

# Install TensorFlow.js for AI validation
npm install @tensorflow/tfjs

# Start development server
npm run dev
```

**Frontend available at:** `http://localhost:3000`

---

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/      # HTTP request handlers
│   │   ├── services/         # Business logic
│   │   ├── repositories/     # Data access layer
│   │   ├── routes/           # API route definitions
│   │   ├── middleware/       # Auth, validation, etc.
│   │   └── index.ts          # Server entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── package.json
├── frontend/
│   ├── app/                  # Next.js app directory
│   ├── components/           # React components
│   ├── lib/                  # Utility functions
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Key Features

### 1. Privacy-First AI Validation

**How it works:**
- AI inference runs **100% in the browser** using TensorFlow.js
- Images **never leave the user's device**
- Only the confidence score is sent to the backend
- No medical diagnosis is performed or stored

**Security Benefits:**
- ✅ GDPR & HIPAA compliant architecture
- ✅ No image storage (memory or disk)
- ✅ No PHI (Protected Health Information) collected
- ✅ User has complete data control

**Implementation:**
```javascript
// Frontend: lib/aiValidation.js
const confidence = await validateTestKitImage(imageElement);
// Only confidence score (e.g., 0.92) is sent to backend
```

### 2. Image Metadata Validation

**Screenshot and Fake Detection:**
- Validates EXIF metadata from camera photos
- Detects screenshots (no EXIF data)
- Identifies edited images (Software tags)
- Checks camera authenticity (Make/Model)

**Validation Checks:**
- ✅ EXIF data exists (not a screenshot)
- ✅ DateTimeOriginal present (real photo timestamp)
- ✅ Software tag check (detects editing)
- ✅ Camera metadata validation

**Usage:**
```javascript
// Frontend: lib/imageMetadata.js
const result = await validateImageMetadata(imageFile);
if (!result.valid) {
  // Show error: Screenshot or edited image detected
}
```

### 3. Test Kit Verification

**Validation Pipeline:**
```
📸 Camera Capture
    ↓
🔍 Metadata Check (screenshot detection)
    ↓
🤖 AI Validation (confidence ≥ 0.85)
    ↓
📤 Backend Verification (serial number check)
    ↓
✅ Status Updated in Database
```

**API Endpoint:**
```
POST /api/verification/kit
Body: {
  "serial": "TK-2024-ABC123",
  "aiConfidence": 0.92,
  "testTypeId": "1"
}
```

### 4. Health Dashboard

**Features:**
- Current verification status
- Testing history (non-diagnostic, privacy-preserving)
- Health streak tracking
- Partner sharing statistics (aggregate only)

**Privacy Guarantees:**
- ❌ No medical test results (positive/negative)
- ❌ No disease names or diagnoses
- ❌ No partner identities
- ✅ Only abstract verification states
- ✅ Only generic test type names
- ✅ Only aggregate statistics

**API Endpoints:**
```
GET /api/dashboard/health        # Full dashboard data
GET /api/dashboard/health/status # Current status only
```

---

## API Reference

### Authentication

Most endpoints require authentication. Currently uses placeholder header-based auth:

```bash
curl -H "x-user-id: 1" http://localhost:5000/api/dashboard/health
```

> **Production:** Replace with JWT/OAuth in `backend/src/middleware/auth.ts`

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/verification/kit` | Verify test kit with AI confidence |
| GET | `/api/dashboard/health` | Get complete health dashboard |
| GET | `/api/dashboard/health/status` | Get current verification status |

---

## Database Schema

**Key Tables:**
- `users` - User accounts and verification status
- `test_kit_instances` - Individual test kits with serial numbers
- `user_verifications` - Verification history (no medical data)
- `clinics` - Testing clinic information
- `status_shares` - Anonymous partner sharing records

**Prisma Commands:**
```bash
# View database in browser
npx prisma studio --config ./prisma.config.ts

# Apply schema changes
npx prisma migrate dev

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

---

## Development Workflow

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Linting
npm run lint
```

### Database Migrations

```bash
cd backend

# Create a new migration
npx prisma migrate dev --name description_of_changes

# Apply migrations to production
npx prisma migrate deploy
```

### Adding AI Models

Place TensorFlow.js models in:
```
frontend/public/models/test-kit-validator/
├── model.json
├── group1-shard1of1.bin
└── group1-shard2of2.bin
```

---

## Security & Privacy

### Privacy Architecture

1. **Frontend AI Processing**
   - All image analysis happens in browser
   - Images immediately discarded after processing
   - No network transmission of images

2. **Metadata Validation**
   - Runs client-side only
   - No metadata sent to server
   - Detects screenshots and edited images

3. **Backend Security**
   - Type validation for all inputs
   - Bounds checking (0-1 for confidence)
   - Authentication required
   - Serial number ownership validation

4. **Database Privacy**
   - No image data stored
   - No medical diagnoses stored
   - Abstract verification states only
   - Partner identities never exposed

### Compliance

- ✅ **GDPR Article 5(1)(c)**: Data minimization
- ✅ **HIPAA Privacy Rule**: No PHI stored
- ✅ **Right to be forgotten**: No image data to delete
- ✅ **Data portability**: Minimal data collected

---

## Deployment

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/veri5
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Production Deployment

1. **Build applications:**
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

2. **Run migrations:**
```bash
cd backend
npx prisma migrate deploy
```

3. **Start services:**
```bash
# With Docker Compose
docker compose -f docker-compose.prod.yml up -d
```

---

## Testing

### Manual Testing

**Test AI Validation:**
```bash
# Visit frontend test page
open http://localhost:3000/test-metadata
```

**Test API Endpoints:**
```bash
# Health dashboard
curl -H "x-user-id: 1" http://localhost:5000/api/dashboard/health

# Verification status
curl -H "x-user-id: 1" http://localhost:5000/api/dashboard/health/status
```

### Test Cases

**Should Pass ✅:**
- Photos from iPhone/Android camera apps
- Unedited DSLR photos
- Images with full EXIF data
- AI confidence ≥ 0.85

**Should Fail ❌:**
- Screenshots (no EXIF)
- Photoshopped images (Software tag)
- Web-downloaded images (stripped EXIF)
- AI confidence < 0.85

---

## Troubleshooting

### Common Issues

**Database connection errors:**
```bash
# Check DATABASE_URL is correct
echo $DATABASE_URL

# Verify PostgreSQL is running
docker compose ps
```

**Prisma client not generated:**
```bash
cd backend
npx prisma generate
```

**Frontend can't reach API:**
```bash
# Check NEXT_PUBLIC_API_URL
# Ensure backend is running on correct port
```

**AI model not loading:**
```bash
# Verify model files exist
ls frontend/public/models/test-kit-validator/

# Check browser console for loading errors
```

---

## Contributing

### Development Guidelines

- Keep Prisma schema updates in sync with frontend views
- Always run linters before committing
- Write tests for new features
- Update this README for major changes
- Follow existing code structure and patterns

### Code Style

- **TypeScript:** Strict mode enabled
- **Formatting:** Use Prettier
- **Linting:** ESLint with Next.js config
- **Comments:** JSDoc for public APIs

---

## Performance

### Optimization Tips

1. **Database:**
   - Indexes on frequently queried fields
   - Connection pooling enabled
   - Limit query result sets

2. **Frontend:**
   - TensorFlow.js model caching
   - Image preprocessing optimization
   - Proper tensor disposal (memory management)

3. **Backend:**
   - Parallel query execution with Promise.all()
   - No N+1 query problems
   - Efficient data serialization

### Expected Performance

- Image metadata parsing: < 10ms
- AI inference: 100-500ms (varies by device)
- API response time: < 100ms
- Full dashboard load: < 50ms

---

## Support & Resources

### Documentation
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs
- **TensorFlow.js:** https://www.tensorflow.org/js

### Getting Help
- Check existing issues in the repository
- Review the troubleshooting section above
- Verify DATABASE_URL and environment variables
- Check server logs for detailed errors

---

## License

This project is private and proprietary. All rights reserved.

---

## Project Status

**Completed Features:**
- ✅ Database schema and migrations
- ✅ Privacy-first AI validation
- ✅ Image metadata verification
- ✅ Test kit verification API
- ✅ Health dashboard API
- ✅ Docker development environment

**In Progress:**
- 🔄 Authentication system (JWT/OAuth)
- 🔄 Partner status sharing UI
- 🔄 Production deployment configuration

**Planned:**
- 📋 Admin dashboard
- 📋 Notification system
- 📋 Advanced analytics
- 📋 Mobile app (React Native)

---

**Last Updated:** February 2026
