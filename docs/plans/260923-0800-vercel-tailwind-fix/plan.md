# Product Plan: Fix Vercel Build Error with Tailwind (PA2)

## Context & Problem
Currently, `@tailwindcss/vite` and `tailwindcss` are in `devDependencies`. During the build process on Vercel, this setup causes a build failure because Vercel might lack access to these packages during specific build phases or production environment preparation. 

## Goal
Resolve the build error on Vercel by moving `@tailwindcss/vite` and `tailwindcss` from `devDependencies` to `dependencies`.

## Scope
- Update `package.json` to move the specified packages.
- Ensure local development environment still works correctly.
- Verify the build process on Vercel after the change.

## Success Metrics
- Vercel build succeeds without errors.
- No impact on the local development workflow.
- Website deploys successfully on Vercel.
