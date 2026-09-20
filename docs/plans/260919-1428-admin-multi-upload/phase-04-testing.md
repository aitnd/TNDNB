# Phase 4: Testing

## Objectives
- Ensure the upload process is robust.
- Verify the Electron client can successfully download and apply the update.

## Tasks

### Task 1: Unit & Integration test
- **Bite-sized definition**: Unit test Drag & Drop component and integration test the multi-file upload to Supabase, including edge cases (large files, invalid types).
- **Test snippet (`tests/integration/upload.spec.ts`)**:
```typescript
import { test, expect } from '@playwright/test';
test('rejects invalid file types', async ({ page }) => {
  // test logic
});
```
- **Run test command**: `npm run test:integration -- upload.spec.ts`
- **Implementation snippet (`tests/integration/upload.spec.ts`)**:
```typescript
// Test assertions for network interruptions and invalid files
```
- **Git commit**: `git commit -m "test: add integration tests for upload edge cases"`

### Task 2: E2E Test - Admin uploads release
- **Bite-sized definition**: E2E Test ensuring an Admin can seamlessly upload a new release via the UI.
- **Test snippet (`e2e/admin-upload.spec.ts`)**:
```typescript
import { test, expect } from '@playwright/test';
test('admin uploads release successfully', async ({ page }) => {
  await page.goto('/admin');
  // Upload workflow
});
```
- **Run test command**: `npx playwright test e2e/admin-upload.spec.ts`
- **Implementation snippet (`e2e/admin-upload.spec.ts`)**:
```typescript
// End-to-end admin UI test
```
- **Git commit**: `git commit -m "test(e2e): add admin release upload test"`

### Task 3: E2E Test - Client detects update
- **Bite-sized definition**: E2E Test where the Electron client detects the new release, downloads all files, and updates successfully.
- **Test snippet (`e2e/client-update.spec.ts`)**:
```typescript
import { _electron as electron } from 'playwright';
import { test, expect } from '@playwright/test';
test('client auto-updates', async () => {
  const electronApp = await electron.launch({ args: ['.'] });
  // Test auto updater
  await electronApp.close();
});
```
- **Run test command**: `npx playwright test e2e/client-update.spec.ts`
- **Implementation snippet (`e2e/client-update.spec.ts`)**:
```typescript
// End-to-end client update process test
```
- **Git commit**: `git commit -m "test(e2e): add client auto-update flow test"`
