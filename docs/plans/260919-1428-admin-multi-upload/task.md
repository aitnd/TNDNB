# Living Tracker: Admin Multi-Upload

## Phase 1: Setup and Design
- [x] Review current Admin upload functionality
- [x] Define the Drag & Drop component specifications
- [x] Map out Supabase Storage folder structure for releases
- [x] Task 1: Database Schema Updates (TDD)

## Phase 2: Backend Supabase
- [x] Task 1: Supabase Storage Bucket & Policies (TDD)
- [x] Task 2: Backend logic for database records (TDD)

> **Note:** Phase 1 & 2 were refactored to fix hardcoded Supabase credentials, add file type validation, fix JSON files column insert, and missing TDD SQL migrations/tests were added.

## Phase 3: Frontend UI
- [x] Task 1: Drag & Drop zone & validation (TDD)
- [x] Task 2: Parallel upload & Progress bars (TDD)
- [x] Task 3: Error handling & Success state (TDD)
- [x] Task 4: App Client Check Update Logic (TDD) - SÃ¡Â»Â­a lÃ¡ÂºÂ¡i Logic Check Update trÃƒÂªn App (Web & Win): KhÃƒÂ´ng Ã„â€˜Ã¡Â» c file CHANGELOG local nÃ¡Â»Â¯a mÃƒ query API Supabase `app_releases` Ã„â€˜Ã¡Â»Æ’ lÃ¡ÂºÂ¥y version mÃ¡Â»â€ºi nhÃ¡ÂºÂ¥t
- [x] Fix trÃ¡ÂºÂ­t tÃ¡Â»Â± file CHANGELOG.md (Ã„â€˜Ã†Â°a v3.19.0 lÃƒÂªn trÃƒÂªn cÃƒÂ¹ng).

## Phase 4: Testing
- [ ] Task 1: Unit & Integration test (TDD)
- [ ] Task 2: E2E Test - Admin uploads release (TDD)
- [ ] Task 3: E2E Test - Client detects update (TDD)

## Phase 5: Release v3.19.1
- [x] Bump version to 3.19.1 in package.json (Web & Win)
- [x] Update CHANGELOG.md for v3.19.1 (Fix update logic)
- [x] Build release (/tndnb-build)
- [ ] Upload v3.19.1 via new Admin Drag & Drop Interface
