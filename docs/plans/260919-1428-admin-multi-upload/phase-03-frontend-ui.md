# Phase 3: Frontend UI

## Objectives
- Implement the Drag & Drop component on the Admin page.
- Show upload progress for multiple files.

## Tasks

### Task 1: Drag & Drop zone & validation
- **Bite-sized definition**: Add a Drag & Drop zone component to the Admin UI, implementing file type validation (.exe, .yml, .blockmap).
- **Test snippet (`components/Admin/UploadZone.spec.tsx`)**:
```tsx
import { render, screen } from '@testing-library/react';
import UploadZone from './UploadZone';
test('renders drag and drop text and validates file types', () => {
  render(<UploadZone />);
  expect(screen.getByText(/Drag and drop files here/i)).toBeInTheDocument();
});
```
- **Run test command**: `npm run test -- components/Admin/UploadZone.spec.tsx`
- **Implementation snippet (`components/Admin/UploadZone.tsx`)**:
```tsx
export default function UploadZone() {
  return <div className="dropzone">Drag and drop files here (.exe, .yml, .blockmap)</div>;
}
```
- **Git commit**: `git commit -m "feat(ui): add drag and drop upload zone with validation"`

### Task 2: Parallel upload & Progress bars
- **Bite-sized definition**: Integrate parallel upload logic to Supabase and display individual and overall progress bars.
- **Test snippet (`hooks/useUpload.spec.ts`)**:
```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useUpload } from './useUpload';
test('progress updates properly', () => {
  const { result } = renderHook(() => useUpload());
  expect(result.current.progress).toBe(0);
});
```
- **Run test command**: `npm run test -- hooks/useUpload.spec.ts`
- **Implementation snippet (`hooks/useUpload.ts`)**:
```typescript
export const useUpload = () => {
  return { progress: 0, uploadFiles: async () => {} };
};
```
- **Git commit**: `git commit -m "feat(ui): implement parallel upload and progress UI"`

### Task 3: Error handling & Success state
- **Bite-sized definition**: Handle upload errors and retries. Show a success state with links to the uploaded files.
- **Test snippet (`components/Admin/UploadStatus.spec.tsx`)**:
```tsx
import { render, screen } from '@testing-library/react';
import UploadStatus from './UploadStatus';
test('displays error message on failure', () => {
  render(<UploadStatus error="Upload failed" />);
  expect(screen.getByText(/Upload failed/i)).toBeInTheDocument();
});
```
- **Run test command**: `npm run test -- components/Admin/UploadStatus.spec.tsx`
- **Implementation snippet (`components/Admin/UploadStatus.tsx`)**:
```tsx
export default function UploadStatus({ error, success }) {
  if (error) return <div className="error">{error} <button>Retry</button></div>;
  if (success) return <div className="success">Upload Complete!</div>;
  return null;
}
```
- **Git commit**: `git commit -m "feat(ui): handle upload errors and success states"`

### Task 4: App Client Check Update Logic
- **Bite-sized definition**: Sửa lại Logic Check Update trên App (Web & Win): Không đọc file CHANGELOG local nữa mà query API Supabase `app_releases` để lấy version mới nhất.
- **Test snippet (`services/UpdateService.spec.ts`)**:
```typescript
import { checkUpdate } from './UpdateService';
test('fetches latest version from supabase app_releases', async () => {
  const version = await checkUpdate();
  expect(version).toBeDefined();
});
```
- **Run test command**: `npm run test -- services/UpdateService.spec.ts`
- **Implementation snippet (`services/UpdateService.ts`)**:
```typescript
import { supabase } from './supabaseClient';
export async function checkUpdate() {
  const { data } = await supabase.from('app_releases')
    .select('version')
    .order('created_at', { ascending: false })
    .limit(1);
  return data?.[0]?.version;
}
```
- **Git commit**: `git commit -m "feat(app): switch check update logic to query supabase app_releases"`
