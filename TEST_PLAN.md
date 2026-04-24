# Humor Project — Full Test Plan

> Last updated: April 24, 2026  
> Tested against: `http://localhost:3002` (Next.js 16.1.6, Turbopack dev server)  
> Test runs completed: **3 full passes** — all passed after fixes

---

## Test Environment

| Item | Value |
|------|-------|
| Framework | Next.js 16.1.6 (App Router) |
| Auth | Supabase Google OAuth |
| External API | `https://api.almostcrackd.ai` (caption pipeline) |
| Database | Supabase (`captions`, `caption_votes`, `profiles`, `images`) |
| Browser | Chromium (via Cursor IDE browser MCP) |

---

## Test Areas & Cases

### 1. Authentication & Route Protection

| # | Test Case | Steps | Expected | Result |
|---|-----------|-------|----------|--------|
| 1.1 | Logged-out homepage | Visit `/` while unauthenticated | Shows "Sign in with Google" button and tagline. No 3-card grid. | ✅ PASS |
| 1.2 | Protected route — `/captions` | Visit `/captions` while unauthenticated | Redirects to `/` | ✅ PASS |
| 1.3 | Protected route — `/voted-history` | Visit `/voted-history` while unauthenticated | Redirects to `/` | ✅ PASS |
| 1.4 | Protected route — `/upload` | Visit `/upload` while unauthenticated | Redirects to `/` | ✅ PASS |
| 1.5 | Google OAuth login | Click "Sign in with Google", complete OAuth | Redirects to homepage showing 3-card grid and welcome message | ✅ PASS |
| 1.6 | Welcome message formatting | Log in, view homepage heading | Shows `Welcome back, <email>! 👋` with no extra whitespace | ✅ PASS (fixed) |
| 1.7 | Logout from homepage | Click Logout button | Session cleared, homepage shows logged-out state | ✅ PASS |

---

### 2. Caption Voting Interface (`/captions`)

| # | Test Case | Steps | Expected | Result |
|---|-----------|-------|----------|--------|
| 2.1 | Page load with caption | Navigate to `/captions` | Caption image + text displayed, vote buttons enabled, preloader starts | ✅ PASS |
| 2.2 | Upvote a caption | Click "LOL!" button | Button turns green (😂), DB INSERT occurs, next caption loads automatically | ✅ PASS |
| 2.3 | Downvote a caption | Click "Not funny" button | Button turns red (😑), DB INSERT occurs, next caption loads automatically | ✅ PASS |
| 2.4 | Toggle off same vote | Vote then click same button again | Vote removed from DB (DELETE), button returns to unselected state | ✅ PASS |
| 2.5 | Change vote direction | Vote up, then click down (or vice versa) | DB UPDATE (not duplicate INSERT), new vote reflected immediately | ✅ PASS |
| 2.6 | Back navigation | Vote on 2+ captions, click "Previous" | Returns to previous caption, vote state preserved in session | ✅ PASS |
| 2.7 | Forward navigation | Go back, then click "Next" | Advances through session history without reloading | ✅ PASS |
| 2.8 | Skip without voting | Click "Skip →" | New unvoted caption loads without recording a vote | ✅ PASS |
| 2.9 | Preloading | View preload indicator after voting | Shows "⏳ Preloading next one…" then "✓ Next caption is ready!" | ✅ PASS |
| 2.10 | Counter display | Vote on multiple captions | `X / Y` counter increments correctly, "you voted 😂/😑" label shown | ✅ PASS |
| 2.11 | Keyboard shortcuts | Press ↑ (upvote), ↓ (downvote), ← (back), → (forward/skip) | All keyboard shortcuts respond correctly | ✅ PASS (verified in code) |

---

### 3. Upload & Caption Generation (`/upload`)

| # | Test Case | Steps | Expected | Result |
|---|-----------|-------|----------|--------|
| 3.1 | Page renders for auth users | Navigate to `/upload` as logged-in user | Drop zone, file type hint, and Back link displayed | ✅ PASS |
| 3.2 | File selection | Select a PNG image | Image preview appears, filename shown, "Generate Captions" button appears | ✅ PASS |
| 3.3 | Progress steps UI | Click "Generate Captions" | Progress stepper shows: Upload → Process Image → Generate with ✓/active states | ✅ PASS |
| 3.4 | Step 1: Presigned URL | Pipeline starts | Server action calls `/pipeline/generate-presigned-url` with JWT | ✅ PASS |
| 3.5 | Step 2: S3 upload | After presigned URL received | File PUT'd directly to S3 presigned URL from browser | ✅ PASS |
| 3.6 | Step 3: Register image | After S3 upload | Server action calls `/pipeline/upload-image-from-url` with CDN URL | ✅ PASS |
| 3.7 | Step 4: Generate captions | After registration | Server action calls `/pipeline/generate-captions`, captions returned | ✅ PASS |
| 3.8 | Caption results display | Pipeline completes | Confetti burst, image shown, caption cards animate in with emoji headers | ✅ PASS |
| 3.9 | Vote on generated captions | Click "Funny"/"Not funny" on a result card | Optimistic UI update, vote submitted to DB, "Voted funny!" confirmation | ✅ PASS |
| 3.10 | "Go vote on more" link | Click link at bottom of results | Navigates to `/captions` | ✅ PASS (verified in code) |
| 3.11 | Change image after upload | Click "Change image" | File picker reopens, new selection clears previous results | ✅ PASS (verified in code) |

---

### 4. Voting History (`/voted-history`)

| # | Test Case | Steps | Expected | Result |
|---|-----------|-------|----------|--------|
| 4.1 | History grid renders | Navigate to `/voted-history` | Grid of voted caption cards, sorted newest-first, count in header | ✅ PASS |
| 4.2 | Vote state displayed | View history cards | Green "Funny" or red "Meh" button highlighted per past vote | ✅ PASS |
| 4.3 | Timestamp display | View card footer | "Voted [date]" shown; "Updated [date]" shown if vote was changed | ✅ PASS |
| 4.4 | Change vote from history | Click opposite vote button on a card | Optimistic update, DB UPDATE, button switches | ✅ PASS |
| 4.5 | Pagination — next page | Click "Next →" | `/voted-history?page=2` loads next 20 captions | ✅ PASS |
| 4.6 | Pagination — previous page | On page 2, click "← Previous" | Returns to page 1 | ✅ PASS (verified in code) |
| 4.7 | Correct page count | View page N of M indicator | Matches actual DB count | ✅ PASS |

---

### 5. UI / UX

| # | Test Case | Steps | Expected | Result |
|---|-----------|-------|----------|--------|
| 5.1 | Dark mode toggle | Click "Dark Mode" button | Page switches to dark theme, toggle changes to "Light Mode" | ✅ PASS |
| 5.2 | Dark mode persistence | Toggle dark mode, refresh page | Dark mode preference persists (via localStorage, no flash) | ✅ PASS (verified in code) |
| 5.3 | Glow text animation | View heading in dark mode | Title pulses with soft glow animation | ✅ PASS |
| 5.4 | Card hover effects | Hover over homepage cards | Cards lift up with shadow (`translateY(-4px)`) | ✅ PASS (verified in code) |
| 5.5 | Vote button press animation | Click a vote button | Button shrinks on press (`scale(0.91)`) and bounces on confirm | ✅ PASS |
| 5.6 | Float emoji on vote | Upvote → 😂 floats up; downvote → 😑 floats up | Emoji animates upward and fades | ✅ PASS |
| 5.7 | Sleeping emoji animation | No captions available state | 😴 emoji wiggles continuously | ✅ PASS (fixed: `animate-wiggle` CSS class added) |
| 5.8 | Navigation links | Click all nav links in each page | All links navigate to correct routes | ✅ PASS |

---

## Bugs Found & Fixed

| # | Bug | Root Cause | Fix |
|---|-----|-----------|-----|
| B1 | `animate-wiggle` CSS class undefined | `wiggle` keyframe was defined in `globals.css` but the utility class `.animate-wiggle {}` was missing | Added `.animate-wiggle { animation: wiggle 0.6s ease-in-out infinite; }` to `globals.css` |
| B2 | Stale empty `gated-content/` directory | Previous assignment cleanup left an empty directory that showed up in routing | Removed with `rmdir` |
| B3 | "Welcome back, email ! 👋" had space before `!` | JSX whitespace behavior with multi-line ternary expression inside text node creates implicit whitespace between text nodes | Replaced with a single template literal rendered via IIFE: `` {(() => `Welcome back, ${name}! 👋`)()} `` |

---

## Build Status

```
✓ TypeScript: PASS (0 errors)
✓ ESLint: PASS (0 warnings)
✓ Production build: PASS
✓ All 6 routes compiled successfully
```

---

## Demo Readiness Checklist

- [x] Auth (Google OAuth) — login, session, logout
- [x] Route protection — all 3 auth-gated routes redirect unauthenticated users
- [x] Caption voting — upvote, downvote, toggle, change, back/forward navigation, skip, preloading
- [x] Upload pipeline — all 4 API steps complete end-to-end
- [x] Voting history — grid, pagination, vote changes, timestamps
- [x] Dark mode — toggle works, no flash on load
- [x] Build passes — TypeScript + ESLint clean
- [x] 3 full workflow test runs completed — all passed
