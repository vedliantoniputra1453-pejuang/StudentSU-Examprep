# AGENTS.md

Operative rules for any AI coding agent working in this repo. Read this file, `PRD.md`, and `skylearn-DESIGN.md` before writing code. When in doubt, do less.

## 1. What this is

**StudentSU Examprep** — a study and practice-question app for Satu University (SU) students in Management/Accounting preparing for UTS/UAS. It ingests material (Zoom transcripts, PPT/PDF, book references) plus CPMK and grading rubrics, then generates personalized practice questions mapped to the CPMK under test.

## 2. Non-negotiable constraints

- **Local-first.** Runs on `localhost`. No backend, no database, no server routes that persist or proxy user data.
- **Phase 1 is student-only.** One role: Student. No Super Admin, no credits, no payments anywhere in the code or UI.
- **Bring Your Own Key (BYOK).** The user pastes their own Gemini/OpenAI API key in Settings. AI calls go from the browser directly to the provider.
- **Data lives in the browser.** Sample data in `lib/mock-data.ts`, user state in `localStorage`. Nothing is uploaded.
- **Open source under MIT.** No proprietary assets, no telemetry, no hidden network calls.
- **Design benchmark is `skylearn-DESIGN.md`.** Read it. Never modify it.

## 3. Scope discipline

- Build only what `PRD.md` specifies. If it is not in the PRD, it does not get built.
- Reject speculative features, "nice for later" abstractions, and settings nobody asked for. Say no in one line and move on.
- Phase 2 (SaaS, credits, Super Admin) may exist **only** as TypeScript types or interface shapes in `lib/types.ts`. No routes, no UI, no logic, no commented-out code.
- Never add a page, component, or dependency the task did not ask for.
- If a request conflicts with the constraints in section 2, stop and report the conflict instead of coding around it.

## 4. Stack and dependency policy

- Next.js 16 App Router, TypeScript **strict**, Tailwind CSS v4.
- **No new dependency** without a one-line justification in the commit message. If a few lines of code do it, write the lines.
- **No chart library.** The CPMK skill radar is hand-written SVG.
- **No UI kit.** shadcn, daisyUI, MUI, Chakra, Ant are banned in phase 1.
- **No icon package** unless the PRD names one; inline SVG at 2px stroke, rounded caps.
- **No emoji in the UI.** Icons or words, never 🎉.
- **No lorem ipsum**, no placeholder copy, no `TODO` shipped in user-visible text.
- Keep the dependency count small enough that a reviewer can read `package.json` in one glance.

## 5. Design system mandate

- Use only the tokens in `skylearn-DESIGN.md`: sky, sun, leaf, coral, berry; ink / ink-muted / ink-subtle / ink-faint; outline / outline-strong; surface / surface-elevated / surface-sunken.
- Tailwind classes and CSS variables only. **No arbitrary hex**, no `style={{}}` except computed geometry: SVG radar points and progress-bar widths.
- Radius: 8px inputs and chips, 16px buttons, 20px cards, 28px modals, 999px pills and avatars.
- Elevation: 1px outline at rest, soft shadow on hover, larger shadow for modals. No glassmorphism.
- Motion: 240ms, `cubic-bezier(0.34, 1.56, 0.64, 1)`. Nothing loops. Nothing autoplays.
- Accessibility is AA, not a stretch goal:
  - Visible focus ring on every interactive element (`sky`, 3px, 2px offset).
  - Minimum **44px** touch target (student-appropriate; the 56px child target in the benchmark does not apply here).
  - Body text 18px (16px minimum on narrow screens); 14px is the absolute floor for captions and chart labels. Contrast AA minimum on all text.
  - Color is never the only signal — pair correct/incorrect with an icon and copy.
  - Honor `prefers-reduced-motion`: shorten transitions to 120ms, drop particles and shake.
- **Audience adaptation:** students aged 18–23, not K-8 children. Keep the warmth, clarity, and generous spacing; drop mascots, confetti bursts on routine actions, star badges, and cartoon illustration. Warm but adult.

## 6. Copy rules

- Follow `skills/human-copywriter.md` and `skills/anti-slop.md`. They are binding, not inspiration.
- **Default language is Bahasa Indonesia.** English only in code, comments, and these rule files.
- Address the user as **"kamu"**, never "Anda", never "kalian" for one person.
- No exclamation marks stacked, no hype, no "Our AI will transform your learning".
- Banned phrases include: *unlock your potential, seamless, revolutionize/revolutionise, elevate, supercharge, effortless, cutting-edge, game-changer, unleash, empower, AI-powered* (unless immediately backed by a precise claim), *Oops, Yay, Whoops, Uh oh*.
- Errors state what happened and what to do next. No blame, no cheerfulness about failure.

## 7. Privacy and security (highest priority)

- **API keys live only in `localStorage`** under a single documented key. Never in a cookie, never in a URL, never in a React context that serializes.
- **The key is sent only to the chosen provider host** (Google or OpenAI). Never to our server, analytics, error reporting, or logs. Phase 1 has no server to send it to — keep it that way.
- Never `console.log` a key, a full prompt containing user material, or a raw provider response.
- Never commit `.env`, `.env.local`, or any credential. `.gitignore` covers them; check before staging.
- Validate every input at the boundary: file type and size on upload, question count (clamp to a sane range), free-text length, CPMK count. Reject with a visible, specific message.
- **Never render model output as HTML.** No `dangerouslySetInnerHTML` on generated content. Render as text or structured data.
- Client-side rate limiting: block a new generation while one is in flight, and enforce a minimum interval between calls. State the limit in the UI.
- Uploaded files are parsed in the browser and discarded. No persistence of raw uploads beyond what the student explicitly saves.

## 8. Code conventions

- **Server Component by default.** Add `"use client"` only for state, effects, browser APIs, or event handlers — and put it on the smallest possible leaf.
- File naming: `kebab-case.tsx` for components, `page.tsx`/`layout.tsx` for routes. Default export for pages and components, named exports for helpers.
- Components stay **under 200 lines**. If it grows, extract a piece rather than nesting deeper.
- Local state first: `useState` → props → `localStorage`. No global store, no context unless two distant trees genuinely share state.
- All shared types belong in `lib/types.ts`. No inline duplicated shapes.
- Sample/demo data belongs in `lib/mock-data.ts`. Components never hardcode content arrays.
- All `localStorage` access goes through `lib/storage.ts` with a guard for SSR and malformed JSON. One module, one key namespace (`sus.`).
- **Never swallow errors.** Show an honest error state with a retry path. Empty catch blocks and `catch {}` are defects.
- No `any`. No `@ts-ignore` without a comment explaining why. No `eslint-disable` without a reason on the same line.
- Keep comments rare and load-bearing. Do not narrate obvious code.

## 9. Definition of Done

A change is done only when all of the following hold:

- [ ] `npm run build` passes.
- [ ] `npm run lint` passes with no new warnings.
- [ ] `npx tsc --noEmit` is clean.
- [ ] Keyboard-only pass: every control reachable by Tab, visible focus, no traps, Enter/Space work.
- [ ] `prefers-reduced-motion` pass: no looping or unnecessary animation.
- [ ] No dark mode (out of scope in phase 1) — the light theme is the only theme.
- [ ] Reviewed at 360px and 1280px widths.
- [ ] No network request leaves the page except the provider call the user triggered.
- [ ] Copy reviewed against `skills/human-copywriter.md`.
- [ ] Diff touches only files the task owns.

## 10. Commits

- **Conventional Commits:** `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `test:`, `chore:`.
- One logical change per commit. No mixed commits ("adds radar chart and rewrites copy and bumps deps").
- Reference the feature in the body when it maps to a requirement.

```
feat(dashboard): add CPMK coverage cards

Shows understanding per CPMK from localStorage. Radar chart
stays in a separate commit.

Refs: F2
```

## 11. Never do

1. No mocks, stubs, or fake data in a production code path.
2. No invented testimonials, user counts, ratings, or metrics. Ever.
3. No autoplay audio or video.
4. No purple-blue AI gradient hero, no glow-on-dark "AI" aesthetic.
5. No modal-first UX — do not open a dialog for a task that fits inline.
6. No hidden or collapsed-required form fields; no required fields discovered at submit.
7. No tracking, analytics, pixels, or third-party scripts.
8. No `localStorage` for anything secret except the user's own API key.
9. No overriding native scroll, no scroll-jacking, no custom cursors.
10. No `dangerouslySetInnerHTML` on model or user content.
11. No fake loading states to make the app feel busier.
12. No disabled control without an adjacent explanation of why.
13. No hardcoded colors, spacing magic numbers, or off-scale font sizes.
14. No feature flags, config objects, or env plumbing for things that never vary.
15. No touching `skylearn-DESIGN.md`, `PRD.md` scope, or files outside the task.

## 12. Handoff protocol

- Paste the relevant PRD excerpt into the prompt before asking for work. Assume the agent has not read it.
- Start from a clean `git status`. If dirty, stop and report.
- Do not modify files outside the stated scope, even to "fix" something adjacent. Report it instead.
- When blocked, report the blocker, the constraint it violates, and the smallest decision needed. Do not guess.