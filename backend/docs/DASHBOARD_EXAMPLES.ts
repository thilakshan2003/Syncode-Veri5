/**
 * Example: Testing the Dashboard API
 * 
 * This file demonstrates how to test the dashboard endpoints.
 * Run with: npm test (after setting up test framework)
 */

// Example test data setup
const exampleTestData = {
  // User with verification history
  user: {
    id: 1n,
    username: 'testuser',
    status: 'Verified',
  },

  // Testing history
  verifications: [
    {
      userId: 1n,
      testTypeId: 1n,
      status: 'verified',
      verifiedAt: new Date('2026-01-15'),
      testedAt: new Date('2026-01-14'),
      clinicId: 1n,
    },
    {
      userId: 1n,
      testTypeId: 1n,
      status: 'verified',
      verifiedAt: new Date('2025-10-12'),
      testedAt: new Date('2025-10-11'),
      clinicId: 1n,
    },
  ],

  // Current status
  currentStatus: {
    userId: 1n,
    status: 'verified',
    lastVerifiedAt: new Date('2026-01-15'),
  },

  // Status shares
  statusShares: [
    {
      senderUserId: 1n,
      expiresAt: new Date('2026-12-31'),
      viewedAt: new Date('2026-01-20'),
      revokedAt: null,
      viewCount: 1,
      maxViews: 3,
    },
    {
      senderUserId: 1n,
      expiresAt: new Date('2025-12-31'), // expired
      viewedAt: null,
      revokedAt: null,
      viewCount: 0,
      maxViews: 1,
    },
  ],
};

// Example API response
const exampleResponse = {
  success: true,
  data: {
    currentStatus: {
      status: 'verified',
      lastVerifiedAt: '2026-01-15T00:00:00.000Z',
      statusMessage: 'Your health verification is current.',
    },
    testingHistory: [
      {
        id: '1',
        testType: 'STI Panel',
        category: 'Sexual Health',
        status: 'verified',
        verifiedAt: '2026-01-15T00:00:00.000Z',
        testedAt: '2026-01-14T00:00:00.000Z',
        clinicName: 'Downtown Health Center',
        clinicAddress: '123 Main St',
      },
      {
        id: '2',
        testType: 'STI Panel',
        category: 'Sexual Health',
        status: 'verified',
        verifiedAt: '2025-10-12T00:00:00.000Z',
        testedAt: '2025-10-11T00:00:00.000Z',
        clinicName: 'Downtown Health Center',
        clinicAddress: '123 Main St',
      },
    ],
    healthStreak: {
      currentStreak: 2,
      lastTestedAt: '2026-01-15T00:00:00.000Z',
      nextRecommendedTestDate: '2026-04-15T00:00:00.000Z',
      consistencyScore: 85,
    },
    partnerSharing: {
      totalShares: 2,
      activeShares: 1,
      expiredShares: 1,
      totalViews: 1,
    },
  },
};

// Example cURL commands
const exampleCurlCommands = `
# Get full dashboard
curl -X GET http://localhost:5000/api/dashboard/health \\
  -H "x-user-id: 1" \\
  -H "Content-Type: application/json"

# Get status only
curl -X GET http://localhost:5000/api/dashboard/health/status \\
  -H "x-user-id: 1" \\
  -H "Content-Type: application/json"

# With JWT token (production)
curl -X GET http://localhost:5000/api/dashboard/health \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json"
`;

// Example integration test (using a testing framework like Jest)
const exampleIntegrationTest = `
import request from 'supertest';
import app from '../src/index';

describe('Dashboard API', () => {
  describe('GET /api/dashboard/health', () => {
    it('should return dashboard data for authenticated user', async () => {
      const response = await request(app)
        .get('/api/dashboard/health')
        .set('x-user-id', '1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('currentStatus');
      expect(response.body.data).toHaveProperty('testingHistory');
      expect(response.body.data).toHaveProperty('healthStreak');
      expect(response.body.data).toHaveProperty('partnerSharing');
    });

    it('should return 401 for unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/dashboard/health');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Privacy checks', () => {
    it('should not expose partner user IDs', async () => {
      const response = await request(app)
        .get('/api/dashboard/health')
        .set('x-user-id', '1');

      const data = response.body.data;
      
      // Check that no partner IDs are exposed
      expect(data.partnerSharing).not.toHaveProperty('recipientUserId');
      expect(data.partnerSharing).not.toHaveProperty('userLow');
      expect(data.partnerSharing).not.toHaveProperty('userHigh');
    });

    it('should not expose medical test results', async () => {
      const response = await request(app)
        .get('/api/dashboard/health')
        .set('x-user-id', '1');

      const history = response.body.data.testingHistory;
      
      // Verify only abstract verification states
      history.forEach(item => {
        expect(item.status).toMatch(/^(verified|unverified)$/);
        expect(item).not.toHaveProperty('testResult');
        expect(item).not.toHaveProperty('diagnosis');
      });
    });
  });
});
`;

export {
  exampleTestData,
  exampleResponse,
  exampleCurlCommands,
  exampleIntegrationTest,
};
