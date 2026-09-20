# Project Plan: Admin Multi-Upload (Drag & Drop)

## Overview
Upgrade the Admin page with a "Drag & Drop" multi-file upload feature. This allows admins to upload all release files (.exe, .yml, .blockmap) simultaneously, improving efficiency and user experience.

## Tech Stack
- Frontend: React / Next.js (Admin UI), Drag & Drop component
- Backend/Storage: Supabase Storage, Supabase Database
- App Client: Electron (TNDNB) - will consume the uploaded files.

## Phases
1. **Phase 1: Setup and Design** - Survey current Admin UI code and design data structures.
2. **Phase 2: Backend Supabase** - Logic for storing multiple files to Supabase Storage and updating Database records.
3. **Phase 3: Frontend UI** - Build Drag & Drop zone component, handle parallel uploads and progress display.
4. **Phase 4: Testing** - QA test the upload flow and Client update download.
