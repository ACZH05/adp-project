# Agent Instructions

## Project

This is a Next.js web app.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- CSS Variables for styling

## Main Rules

- Use reusable components.
- Keep pages clean and not too large.
- Do not place all UI directly inside one page file.
- Use mock data first unless API integration is requested.
- Do not add new packages unless necessary.
- Do not modify backend or unrelated files.

## Folder Rules

- Shared reusable components go in `src/shared/components`.
- App theme files go in `src/core/theme`.
- Feature-specific pages and components go in `src/features/<feature>/presentation`.
- Feature mock data goes in `src/features/<feature>/data`.
- Common models go in `src/models`.

## UI Rules

- Follow `docs/DESIGN.md`.
- Follow `docs/UI_REQUIREMENTS.md`.
- Use responsive layouts.
- Avoid horizontal overflow.
- Support common screen widths.
- Prefer Tailwind responsive utilities, `flex`, `grid`, and scroll containers where appropriate.
- Avoid fixed widths unless necessary.

## Next.js Rules

- Prefer Server Components when no client-side state is needed.
- Use Client Components (`"use client"`) only when local UI state or browser APIs are required.
- Use `const` and memoization where possible.
- Extract repeated UI into components.
- Keep business logic out of component render functions.

## Before Finishing

Run:

- `next lint`
- `next build`

Fix errors before reporting completion.

## Figma Screenshot Reference Rule

The screenshots in `docs/screenshots/` are exported from Figma and are used as visual/layout references only.

When implementing Next.js UI:

- Do not attempt to extract or reuse any underlying code from the screenshots.
- Translate the visual layout into Next.js and Tailwind components by interpreting the screenshot.
- Preserve the same page hierarchy and component order as seen in the screenshot.
- Preserve visible labels, section names, and navigation structure.
- Use `docs/DESIGN.md` for design tokens and style rules.
- Use `docs/SCREEN_SPEC.md` for exact page layout.
