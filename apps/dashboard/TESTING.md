# Testing Guide

## Overview

Flagship uses **Vitest** for unit and integration tests. Tests are located in the `__tests__` directory.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

## Test Structure

### API Integration Tests
Located in `__tests__/api/flags.test.ts`

Tests the `/api/v1/flags` endpoint:
- ✅ Health check
- ✅ Authentication (API key validation)
- ✅ Flag evaluation with user context
- ✅ Targeting rules evaluation
- ✅ CORS headers
- ✅ Error handling

### Targeting Engine Unit Tests
Located in `__tests__/lib/targeting.test.ts`

Tests the targeting evaluation logic:
- ✅ Condition operators (eq, ne, contains, in, gt, lt, gte, lte)
- ✅ Hash consistency for rollout
- ✅ Percentage rollout distribution
- ✅ Rule matching (AND logic)
- ✅ Default rules

## Prerequisites for Integration Tests

**Dashboard server must be running:**
```bash
cd apps/dashboard
npm run dev
```

The API integration tests will hit `http://localhost:3000/api/v1/flags`.

## Test API Key

Integration tests use a test API key:
```
fsk_server_133e61fa671d3e927a1eba415220a284
```

Make sure this key exists in your Firestore database with:
- `keyPrefix`: `fsk_server_1`
- `revoked`: `false`
- Valid `environmentId`

## Writing New Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest';

describe('MyFeature', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### API Integration Test Example
```typescript
it('should return flags', async () => {
  const response = await fetch('http://localhost:3000/api/v1/flags', {
    method: 'POST',
    headers: {
      'x-api-key': TEST_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user: { id: 'test' } })
  });
  
  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data).toHaveProperty('flags');
});
```

## CI/CD Integration

Tests run automatically in GitHub Actions on every push:
```yaml
- name: Run tests
  run: npm test
```

## Coverage Reports

Generate coverage reports with:
```bash
npm run test:coverage
```

Coverage HTML report will be available in `coverage/index.html`.

## Troubleshooting

**Tests failing with "fetch is not defined":**
- Make sure `jsdom` is installed
- Check `vitest.config.ts` has `environment: 'jsdom'`

**API tests timing out:**
- Ensure dashboard server is running on port 3000
- Check API key exists in database
- Verify Firestore connection

**Import errors:**
- Check path aliases in `vitest.config.ts`
- Ensure `@` points to project root
