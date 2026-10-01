/**
 * Phase 2 Comprehensive Test Suite
 * Executes end-to-end integration tests against the live API on http://localhost:5000
 */

const BASE_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('====================================================');
  console.log('  STARTING PHASE 2 COMPREHENSIVE INTEGRATION TESTS  ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` - Detail: ${detail}` : ''}`);
      failed++;
    }
  }

  // 1. Health Check
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const json: any = await res.json();
    assert(
      res.status === 200 && json.database?.connected === true,
      '1. Health Check & Atlas DB Connection',
      `DB Connected: ${json.database?.connected}`
    );
  } catch (err: any) {
    assert(false, '1. Health Check & Atlas DB Connection', err.message);
  }

  // 2. User Registration
  const testUserEmail = `reader_${Date.now()}@example.com`;
  let userToken = '';
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Reader',
        email: testUserEmail,
        password: 'ReaderPassword123!'
      })
    });
    const json: any = await res.json();
    userToken = json.data?.accessToken;
    assert(
      res.status === 201 && json.data?.user?.email === testUserEmail && !json.data?.user?.passwordHash,
      '2. User Registration Success & Password Hash Protected'
    );
  } catch (err: any) {
    assert(false, '2. User Registration', err.message);
  }

  // 3. Duplicate Registration
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Reader',
        email: testUserEmail,
        password: 'ReaderPassword123!'
      })
    });
    assert(res.status === 409, '3. Duplicate Email Rejection (409 Conflict)');
  } catch (err: any) {
    assert(false, '3. Duplicate Email Rejection', err.message);
  }

  // 4. Invalid Password / Input Validation
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Short Pass',
        email: `short_${Date.now()}@example.com`,
        password: '123'
      })
    });
    assert(res.status === 400, '4. Weak Password Validation Rejection (400 Bad Request)');
  } catch (err: any) {
    assert(false, '4. Weak Password Validation', err.message);
  }

  // 5. User Login with Correct Password
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUserEmail,
        password: 'ReaderPassword123!'
      })
    });
    const json: any = await res.json();
    assert(res.status === 200 && Boolean(json.data?.accessToken), '5. User Login with Valid Credentials');
  } catch (err: any) {
    assert(false, '5. User Login', err.message);
  }

  // 6. User Login with Incorrect Password
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUserEmail,
        password: 'WrongPassword999!'
      })
    });
    assert(res.status === 401, '6. Login with Incorrect Password (401 Unauthorized)');
  } catch (err: any) {
    assert(false, '6. Login with Incorrect Password', err.message);
  }

  // 7. /auth/me with Authenticated User
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const json: any = await res.json();
    assert(
      res.status === 200 && json.data?.user?.email === testUserEmail && json.data?.user?.role === 'user',
      '7. GET /api/v1/auth/me returns Authenticated User Safe Profile'
    );
  } catch (err: any) {
    assert(false, '7. GET /api/v1/auth/me', err.message);
  }

  // 8. /auth/me Unauthenticated
  try {
    const res = await fetch(`${BASE_URL}/auth/me`);
    assert(res.status === 401, '8. GET /api/v1/auth/me unauthenticated rejected with 401');
  } catch (err: any) {
    assert(false, '8. Unauthenticated /me', err.message);
  }

  // 9. Authorization: Normal User Forbidden from Admin Endpoints
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(res.status === 403, '9. Normal User Accessing Admin /users Rejected (403 Forbidden)');
  } catch (err: any) {
    assert(false, '9. Normal User Accessing Admin', err.message);
  }

  // 10. Admin Login
  let adminToken = '';
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@thenews.org',
        password: 'AdminPassword123!'
      })
    });
    const json: any = await res.json();
    adminToken = json.data?.accessToken;
    assert(
      res.status === 200 && json.data?.user?.role === 'admin',
      '10. Admin Login Success (admin@thenews.org)'
    );
  } catch (err: any) {
    assert(false, '10. Admin Login', err.message);
  }

  // 11. Admin Access to User Management
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const json: any = await res.json();
    assert(
      res.status === 200 && Array.isArray(json.data?.users) && Boolean(json.data?.pagination),
      '11. Admin User Management: List Users & Pagination Working'
    );
  } catch (err: any) {
    assert(false, '11. Admin User Management', err.message);
  }

  // 12. Profile Update (Preferred Language & Interests)
  try {
    const res = await fetch(`${BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({
        preferredLanguage: 'te',
        name: 'Updated Reader Name'
      })
    });
    const json: any = await res.json();
    assert(
      res.status === 200 && json.data?.user?.preferredLanguage === 'te' && json.data?.user?.name === 'Updated Reader Name',
      '12. User Profile Update (Name & Preferred Language)'
    );
  } catch (err: any) {
    assert(false, '12. User Profile Update', err.message);
  }

  // 13. Categories CRUD & Hierarchical Nesting
  let createdCatId = '';
  let subCatId = '';
  try {
    // List categories
    const listRes = await fetch(`${BASE_URL}/categories`);
    const listJson: any = await listRes.json();

    // Create primary category
    const createRes = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: `Test Desk ${Date.now()}`,
        slug: `test-desk-${Date.now()}`,
        description: 'Primary testing category'
      })
    });
    const createJson: any = await createRes.json();
    createdCatId = createJson.data?.category?._id;

    // Create nested subcategory
    const subRes = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: `Sub Desk ${Date.now()}`,
        slug: `sub-desk-${Date.now()}`,
        parent: createdCatId
      })
    });
    const subJson: any = await subRes.json();
    subCatId = subJson.data?.category?._id;

    // Clean up
    if (subCatId) {
      await fetch(`${BASE_URL}/categories/${subCatId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    }
    if (createdCatId) {
      await fetch(`${BASE_URL}/categories/${createdCatId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    }

    assert(
      createRes.status === 201 && subRes.status === 201 && Boolean(createdCatId),
      '13. Category CRUD & Hierarchical Subcategory Nesting'
    );
  } catch (err: any) {
    assert(false, '13. Category CRUD', err.message);
  }

  // 14. Tags CRUD & Duplicate Prevention
  try {
    const tagName = `Tag_${Date.now()}`;
    const tagSlug = `tag-${Date.now()}`;

    // Create
    const createRes = await fetch(`${BASE_URL}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ name: tagName, slug: tagSlug })
    });
    const createJson: any = await createRes.json();
    const tagId = createJson.data?.tag?._id;

    // Duplicate check
    const dupRes = await fetch(`${BASE_URL}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ name: tagName, slug: tagSlug })
    });

    // Cleanup
    if (tagId) {
      await fetch(`${BASE_URL}/tags/${tagId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    }

    assert(
      createRes.status === 201 && dupRes.status === 409,
      '14. Tag CRUD & Duplicate Tag Prevention (409 Conflict)'
    );
  } catch (err: any) {
    assert(false, '14. Tag CRUD', err.message);
  }

  // 15. Multilingual Foundation & Default Language Protection
  try {
    const listRes = await fetch(`${BASE_URL}/languages`);
    const listJson: any = await listRes.json();
    const defaultLang = listJson.data?.languages?.find((l: any) => l.isDefault);

    // Try deleting default language (must be rejected with 400)
    const delRes = await fetch(`${BASE_URL}/languages/${defaultLang._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    assert(
      listRes.status === 200 && listJson.data?.languages?.length >= 3 && delRes.status === 400,
      '15. Multilingual Foundation & Platform Default Language Deletion Protection'
    );
  } catch (err: any) {
    assert(false, '15. Multilingual Foundation', err.message);
  }

  // 16. Logout
  try {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert(res.status === 200, '16. User Logout (State Cleared)');
  } catch (err: any) {
    assert(false, '16. User Logout', err.message);
  }

  console.log('\n====================================================');
  console.log(`  RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
