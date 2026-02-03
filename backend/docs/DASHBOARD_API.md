# User Health Dashboard API

## Overview

Privacy-preserving health dashboard API for the Veri5 platform. Returns abstract verification states without exposing medical test results, diagnoses, or partner identities.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Request                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Auth Middleware                           │
│                  (authenticateUser)                          │
│              Extracts userId from token                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Dashboard Controller                        │
│             (dashboardController.ts)                         │
│        Validates request, handles errors                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Dashboard Service                           │
│              (dashboardService.ts)                           │
│     Business logic, privacy transformations                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                Dashboard Repository                          │
│            (dashboardRepository.ts)                          │
│         Prisma queries, data access layer                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
└─────────────────────────────────────────────────────────────┘
```

## Endpoints

### GET /api/dashboard/health

Returns complete health dashboard data for authenticated user.

**Authentication:** Required (JWT/Session via middleware)

**Request Headers:**
```
Authorization: Bearer <token>
OR
x-user-id: <userId>  (temporary, for testing)
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "currentStatus": {
      "status": "verified",
      "lastVerifiedAt": "2026-01-15T10:30:00.000Z",
      "statusMessage": "Your health verification is current."
    },
    "testingHistory": [
      {
        "id": "1",
        "testType": "STI Panel",
        "category": "Sexual Health",
        "status": "verified",
        "verifiedAt": "2026-01-15T10:30:00.000Z",
        "testedAt": "2026-01-14T00:00:00.000Z",
        "clinicName": "Downtown Health Center",
        "clinicAddress": "123 Main St, City"
      }
    ],
    "healthStreak": {
      "currentStreak": 3,
      "lastTestedAt": "2026-01-15T10:30:00.000Z",
      "nextRecommendedTestDate": "2026-04-15T10:30:00.000Z",
      "consistencyScore": 85
    },
    "partnerSharing": {
      "totalShares": 5,
      "activeShares": 2,
      "expiredShares": 3,
      "totalViews": 4
    }
  }
}
```

**Error Responses:**

```json
// 401 Unauthorized
{
  "success": false,
  "error": "Unauthorized",
  "message": "User authentication required"
}

// 500 Internal Server Error
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Failed to fetch dashboard data"
}
```

### GET /api/dashboard/health/status

Returns only current verification status (lighter endpoint).

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "currentStatus": {
      "status": "verified",
      "lastVerifiedAt": "2026-01-15T10:30:00.000Z",
      "statusMessage": "Your health verification is current."
    }
  }
}
```

## Privacy Guarantees

### What We NEVER Return

❌ Medical test results (positive/negative)  
❌ Disease names or diagnoses  
❌ Specific STI types  
❌ Partner user IDs  
❌ Partner names or usernames  
❌ userLow / userHigh values  
❌ Raw verification data  

### What We DO Return

✅ Abstract verification states ("verified" / "unverified")  
✅ Generic test type names ("STI Panel")  
✅ Timestamps (when tests occurred)  
✅ Clinic names and addresses  
✅ Aggregate sharing statistics (counts only)  
✅ Testing consistency metrics  

## Data Models

### CurrentStatusResponse
```typescript
{
  status: 'verified' | 'unverified',
  lastVerifiedAt: Date | null,
  statusMessage: string
}
```

### TestingHistoryItem
```typescript
{
  id: string,
  testType: string,          // e.g., "STI Panel" (non-diagnostic)
  category: string | null,    // e.g., "Sexual Health"
  status: 'verified' | 'unverified',
  verifiedAt: Date | null,
  testedAt: Date | null,
  clinicName: string | null,
  clinicAddress: string | null
}
```

### HealthStreakResponse
```typescript
{
  currentStreak: number,              // Consecutive testing cycles
  lastTestedAt: Date | null,
  nextRecommendedTestDate: Date,      // +3 months from last test
  consistencyScore: number            // 0-100 based on regularity
}
```

### PartnerSharingResponse
```typescript
{
  totalShares: number,      // Total status shares created
  activeShares: number,     // Currently valid shares
  expiredShares: number,    // Past expiration or revoked
  totalViews: number        // How many times shared status was viewed
}
```

## Business Logic

### Health Streak Calculation

**Definition:** Number of consecutive testing cycles within recommended interval.

**Algorithm:**
1. Recommended interval: 90 days (3 months)
2. Grace period: 30 days
3. Max acceptable interval: 120 days
4. Streak breaks if gap exceeds 120 days

**Example:**
```
Test 1: Jan 1
Test 2: Apr 5 (95 days) → Streak continues (within 120)
Test 3: Jul 10 (96 days) → Streak continues
Test 4: Dec 15 (158 days) → Streak BREAKS (> 120)
Result: Streak = 3
```

### Consistency Score

**Definition:** 0-100 score measuring testing regularity.

**Formula:**
```
Base Score = 100 - (avgDeviation / 60 * 100)
Bonus = min(testCount * 2, 20)
Final Score = min(100, baseScore + bonus)
```

Where:
- `avgDeviation` = average deviation from 90-day interval
- Lower deviation = higher score
- Bonus for having more tests (max +20)

**Example:**
```
Tests at: Day 0, 90, 180, 270
Intervals: 90, 90, 90
Avg interval: 90 days
Deviation: 0 days
Base score: 100
Bonus: min(4 * 2, 20) = 8
Final: 100 (perfect consistency)
```

## Database Queries

### Query Optimization

All queries are optimized to avoid N+1 problems:

```typescript
// ✅ GOOD: Single query with joins
const history = await prisma.userVerification.findMany({
  where: { userId },
  include: {
    testType: true,
    clinic: true,
  }
});

// ❌ BAD: N+1 queries
const verifications = await prisma.userVerification.findMany({ where: { userId } });
for (const v of verifications) {
  const testType = await prisma.testType.findUnique({ where: { id: v.testTypeId } });
}
```

### Parallel Execution

Dashboard data fetching uses `Promise.all()` for optimal performance:

```typescript
const [status, history, timestamps, stats] = await Promise.all([
  repository.getCurrentStatus(userId),
  repository.getTestingHistory(userId),
  repository.getVerifiedTimestamps(userId),
  repository.getPartnerSharingStats(userId),
]);
```

## Testing

### Manual Testing with cURL

```bash
# Test with temporary header-based auth
curl -X GET http://localhost:5000/api/dashboard/health \
  -H "x-user-id: 1" \
  -H "Content-Type: application/json"

# Test status-only endpoint
curl -X GET http://localhost:5000/api/dashboard/health/status \
  -H "x-user-id: 1"
```

### Test Data Setup

Create test data in your database:

```sql
-- Insert test user
INSERT INTO users (username, email, password_hash, status)
VALUES ('testuser', 'test@example.com', 'hash', 'Verified');

-- Insert verification history
INSERT INTO user_verifications (user_id, test_type_id, status, verified_at)
VALUES (1, 1, 'verified', NOW() - INTERVAL '30 days');

-- Insert current status
INSERT INTO user_current_status (user_id, status, last_verified_at)
VALUES (1, 'verified', NOW() - INTERVAL '30 days');
```

## Security Considerations

### Authentication
- Always validate JWT token or session
- Never trust client-provided userId without verification
- Implement rate limiting to prevent abuse

### Data Privacy
- Log access to health data for audit trails
- Never log sensitive medical information
- Implement HTTPS in production
- Consider additional encryption for sensitive fields

### Authorization
- Users can only access their own dashboard data
- Implement proper RBAC if needed for admin access
- Validate userId matches authenticated user

## Performance

### Expected Query Times
- Current status: ~5ms
- Testing history: ~20ms (with 50 records)
- Full dashboard: ~50ms (all queries parallel)

### Optimization Tips
1. Add database indexes on frequently queried fields
2. Consider caching current status (updates infrequently)
3. Paginate testing history if > 100 records
4. Use database connection pooling

### Recommended Indexes

Already defined in Prisma schema:
```prisma
@@index([userId, createdAt])  // user_verifications
@@index([userId, status])      // user_verifications
@@index([senderUserId, createdAt])  // status_shares
```

## Migration to Production

### Replace Auth Middleware

Update `/middleware/auth.ts` with your actual authentication:

```typescript
// JWT example
import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = BigInt(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Environment Variables

Ensure these are set:
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
```

## Files Created

```
backend/
├── src/
│   ├── controllers/
│   │   └── dashboardController.ts      # HTTP request handling
│   ├── service/
│   │   └── dashboardService.ts         # Business logic
│   ├── repositories/
│   │   └── dashboardRepository.ts      # Data access (Prisma)
│   ├── routers/
│   │   └── dashboardRouter.ts          # Route definitions
│   ├── middleware/
│   │   └── auth.ts                     # Auth middleware (placeholder)
│   └── index.ts                        # Updated with dashboard routes
└── docs/
    └── DASHBOARD_API.md                # This file
```

## Next Steps

1. ✅ Replace auth middleware with your actual authentication
2. ✅ Test with real user data
3. ✅ Add rate limiting for production
4. ✅ Set up monitoring/logging
5. ✅ Add integration tests
6. ✅ Deploy to staging environment
7. ✅ Frontend integration

## Support

For questions or issues:
- Check Prisma schema matches database
- Verify DATABASE_URL is correct
- Ensure user has testing data in database
- Check server logs for detailed errors
