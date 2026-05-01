# User Study Report — Generative Caption Application

---

## User Study 1

### 1. User Information

- **Relationship to researcher:** Husband
- **Prior use of this app:** None
- **Experience with similar apps:** Extensive — software engineer with 10+ years of industry experience; familiar with web application patterns, REST APIs, and frontend interactions

### 2. Observation Context

- **Location:** Researcher's apartment
- **Device:** Laptop (researcher's computer)
- **Instructions given:** Logged into Google account on behalf of user; told him to freely explore the app
- **Task structure:** Free exploration; researcher observed and took notes, answering only brief clarifying questions when asked

### 3. Three Things the User Liked (Functionality Only)

1. **Voting animation:** Appreciated the visual animation on the voting interface. He found it engaging and felt it gave clear feedback when a vote was registered.
2. **Preloading of the next caption:** Noticed and explicitly called out that the next caption was already loaded and ready at the bottom of the page before he finished voting on the current one. He saw this as a sign of thoughtful performance engineering.
3. **Spam protection on the skip button:** Observed that clicking the skip/next button rapidly was throttled — the interface made users wait for the next caption to load before the button became active again. He appreciated that this prevented users from accidentally skipping too fast.

### 4. Three Areas for Improvement

1. **No way to revisit skipped captions:** The voting history page only shows captions the user has voted on. There is no mechanism to view or go back to captions that were skipped. He suggested adding a browsable list of skipped captions or a way to navigate back to a specific one.
2. **Accessibility on the voting interface:** Suggested adding keyboard shortcuts — specifically, using the left/right arrow keys to go back and advance to the next caption, and using keyboard keys (e.g., `U` for upvote, `D` for downvote) so power users and accessibility-focused users can interact without touching the mouse.
3. **Voting history sort order is affected by vote changes:** Observed that when a vote is changed from the history page, the caption's position in the list shifts because the list is sorted by last-modified time rather than the original vote date. He argued that the sort order should be based on the first time the user voted on a caption, not the most recent update.

### 5. Observed Friction or Confusion

- **"Register" terminology:** During the upload and caption generation flow, one of the progress steps is labeled "Register." He paused and asked aloud what "register" meant in this context. The term was not immediately intuitive; he expected something like "Process" or "Link image."
- **Generate captions again:** After captions were displayed, he noticed the "Generate Captions" button was still present. He asked what would happen if he clicked it again — then clicked it, which triggered an entirely new set of captions to be generated. This was not immediately obvious as an available action.
- **Captions he generated are not votable:** After generating captions via the upload flow, he clicked "Go vote on more captions" and asked whether the captions he had just generated would appear in the voting queue. He expressed a clear desire to vote on his own generated captions but found that this was not the case.
- **Drag-and-drop from browser not supported:** He attempted to grab an image directly from a browser tab and drag it into the upload drop zone. This did not work because the app only accepts files from the local file system. He noted this as a limitation, since users often want to upload images they find online.
- **Invalid file upload behavior unknown:** He asked what would happen if an invalid or corrupted image was uploaded. He flagged it as a missing edge case in the UX — there was no visible indication of what types of failures are handled.

### 6. Behavioral Observations

- He navigated methodically: started on the homepage, read each card label before clicking, then explored the voting interface first.
- He immediately noticed the preloading behavior by scrolling down while a caption was still displayed — an intentional and exploratory action.
- On the voting history page, he right-clicked an image thumbnail and opened it in a new tab to inspect the original image and its CDN URL directly.
- He spam-clicked the light/dark mode toggle multiple times rapidly to observe how the UI handled rapid state changes.
- He was generally confident and exploratory, rarely hesitating, but paused and verbalized questions when he encountered unclear terminology or unexpected behavior.

### 7. User Quotes

> "I like that the next one is already loaded — that's good UX."

> "What does 'register' mean here? Is it registering an account? I'd call this something else."

> "If I vote on captions here in history and it moves them around, that's going to be confusing — it should stay in the order I first voted."

---

## User Study 2

### 1. User Information

- **Relationship to researcher:** Close friend
- **Prior use of this app:** None
- **Experience with similar apps:** Moderate — backend software engineer; familiar with web apps as a user but does not specialize in frontend or UX

### 2. Observation Context

- **Location:** Researcher's apartment
- **Device:** Laptop (researcher's computer)
- **Instructions given:** Logged into Google account; told her to explore freely and share what she thought as she went
- **Task structure:** Free exploration with light verbal commentary; researcher took notes

### 3. Three Things the User Liked (Functionality Only)

1. **Blinking/pulsing indicator during caption generation:** She specifically called out the animated blinking indicator under the third step ("Generating Captions") in the upload pipeline. She said it clearly communicated that the user needs to wait and that something is happening in the background, rather than leaving the user wondering if the page had frozen.
2. **Image preview before uploading:** She appreciated that after selecting a file, a preview of the image appeared before the upload process began. It gave her a chance to confirm she had picked the right file before committing to the full pipeline.
3. **Pagination controls on the voting history page:** She liked that the voting history page had clear previous/next page controls. She found navigating between pages straightforward and said the grid layout made it easy to scan her vote history quickly.

### 4. Three Areas for Improvement

1. **No indication of total caption count in the system:** While voting, she had no sense of how many captions existed in the system overall. She suggested showing a rough count or progress indicator so users know the scale of what they're voting on.
2. **No file size limit displayed on the upload page:** She noticed that the upload area did not mention any maximum file size. As someone who works with backend systems, she suspected there must be a limit and felt it should be displayed upfront so users don't waste time uploading an oversized file only to have it fail silently.
3. **No session recap after a voting session:** After voting through several captions, she felt there was no satisfying endpoint to the experience. She suggested adding a brief summary at natural break points — for example, after voting on 10 captions — showing how many she upvoted versus downvoted in that session.

### 5. Observed Friction or Confusion

- She wasn't sure if her votes were being saved in real time or if there was a submit/confirm step somewhere. She asked "Does this save automatically?" after her first vote — there was no visible confirmation beyond the button animation.
- On the voting history page, she couldn't tell how many total pages existed. The pagination controls showed page numbers but no total count, leaving her uncertain whether she was looking at page 1 of 2 or page 1 of 20.
- She looked for a profile or account page where she could see aggregate stats (e.g., total votes cast, ratio of upvotes to downvotes) and was mildly surprised when she couldn't find one.

### 6. Behavioral Observations

- She went to the "Upload & Generate" page first, drawn by curiosity about what the caption generation process entailed.
- She read through the generated captions carefully one by one after the pipeline completed, treating them as genuine output worth evaluating.
- She hovered over the uploaded image in the results section and tried scrolling on it, as if expecting zoom or expand functionality.
- She navigated through all three main sections (voting, history, upload) in a methodical order before going back to explore individual features more deeply.
- She was generally positive and encouraging throughout, verbalizing compliments about design choices as she went.

### 7. User Quotes

> "Does this save automatically? I don't see a confirm button anywhere."

> "How many captions are in the system? I feel like I could be here a while."

> "I keep wanting to know my stats — like how many I've upvoted total."

---

## User Study 3

### 1. User Information

- **Relationship to researcher:** Cousin
- **Prior use of this app:** None
- **Experience with similar apps:** None — CS freshman with no web development experience; primary hobbies are gaming and bird photography

### 2. Observation Context

- **Location:** Researcher's apartment
- **Device:** Laptop (researcher's computer)
- **Instructions given:** Logged into Google account; told him to use the app however felt natural and ask questions whenever confused
- **Task structure:** Fully free exploration; no guided tasks

### 3. Three Things the User Liked (Functionality Only)

1. **Dark mode toggle:** He immediately noticed the dark mode switch and toggled it on, saying it was easier on his eyes. He spam-clicked it several times to watch it animate back and forth between modes and seemed genuinely delighted by the transition.
2. **Drag-and-drop upload area:** He found the upload drop zone on the upload page visually clear and understood its purpose immediately. He tried dragging an image file from his Desktop into it and successfully initiated the upload without any instruction.
3. **Real-time progress steps during upload:** He appreciated seeing the three labeled steps (Upload → Register → Generate) update in real time during the caption generation process. He said it made the wait feel less uncertain because he could see the app was making progress.

### 4. Three Areas for Improvement

1. **Terminology is too technical for non-developers:** The step label "Register" did not mean anything to him. He suggested the app use plain, everyday language instead of technical terms so that users without a software background can follow along without confusion.
2. **No supported file types listed upfront on the upload page:** He tried dragging a screenshot and was unsure whether it would be accepted. He said the upload area should clearly list supported formats before the user tries, rather than making them guess or wait for an error.
3. **No option to upload directly from a mobile device or camera:** As someone who takes bird photos on his phone, he immediately asked whether he could upload a photo directly from his phone's camera roll rather than having to first transfer the file to a computer. He found the desktop-only workflow limiting for his use case.

### 5. Observed Friction or Confusion

- He took several seconds to find the login button when first arriving at the app — his eyes went to the center of the page rather than the top navigation bar where the login control was located.
- He did not immediately understand what "voting on captions" meant. He clicked into the voting page, saw a caption with an image, and asked "Am I rating this like a meme?"
- After voting on a few captions, he pressed the browser's back button instead of the app's built-in Back button, which navigated him away from the voting page entirely. He looked confused and had to click back into the voting section from the homepage.
- He was unaware the voting history page existed until the researcher pointed out the navigation bar. He had not noticed the nav links at the top of the page during his session.

### 6. Behavioral Observations

- He first looked at the center of the homepage and read the card titles slowly before clicking.
- He went to the voting page first after reading the label.
- He clicked the upvote button on every caption without reading carefully — he was treating the interaction more like a fast-paced game than a deliberate rating action.
- On the upload page, he spent time examining the generated captions individually and scrolled back up to look at his uploaded image alongside them.
- He toggled dark/light mode repeatedly throughout the session and returned to it even while exploring other pages — it was consistently the feature he engaged with most enthusiastically.
- He was less exploratory on deeper features and relied more on cards and visible buttons than on the navigation bar.

### 7. User Quotes

> "Oh this is like a meme rater? That's actually fun."

> "Why does it say 'register' — am I signing up for something?"

> "Can I do this from my phone? I have so many bird photos I want to try."

---

## Final Summary

### What I Learned from Observing Users

Observing three users with very different technical backgrounds revealed that the application communicates well at the high level — all three users understood the core loop of voting on image captions without much guidance. However, specific details of the interface created friction in ways that were not apparent during development, and the friction points differed meaningfully depending on the user's technical background.

### Surprising Findings

- **"Register" was universally confusing across two very different user types.** Both the experienced software engineer (User 1) and the non-technical freshman (User 3) paused at the word "Register" during the upload pipeline. The label felt self-explanatory from a developer's perspective but was genuinely opaque from a user's perspective.
- **The "Generate Captions Again" button created an unexpected interaction.** User 1 discovered that the button remained active after captions were displayed and clicked it intentionally — exposing a gap where there is no confirmation and no way to recover the previous captions. This was not designed as a deliberate feature and was never tested as an edge case.
- **Non-technical users rely on center-page content, not the navigation bar.** User 3 never independently discovered the voting history page and only found it after being pointed to the navigation bar. This suggests that key features linked only through the nav may be invisible to less experienced users.

### Patterns Noticed Across Multiple Users

- User 1 and User 3 both paused at the "Register" label — the only truly shared friction point, and the most consistent usability issue across the entire study.
- User 2 and User 3 both engaged meaningfully with the dark/light mode toggle, suggesting it is a noticeable and appreciated feature across different user types.
- Users with more technical confidence (User 1 and User 2) explored the app more systematically and pushed features to their limits, while User 3 stayed closer to the surface and was more game-like in his interactions.
- All three users had questions about what happens next at some point in the flow — whether after voting, after generating captions, or after changing a vote — indicating that the app lacks clear guidance at transition points.

### Three Specific Improvements Planned

1. **Rename "Register" to a user-friendly label.** Based on confusion from two out of three users, the "Register" step in the upload pipeline will be relabeled to something like "Link Image" or "Processing Image" to make the step's purpose immediately clear without requiring technical knowledge.

2. **Add a clear call-to-action at every transition point.** After generating captions, after completing a voting session, and after changing a vote in history, the app will surface a clear next-step prompt (e.g., "Vote on These Captions," "Keep Voting," "Back to History") so users are never left wondering what to do next.

3. **Add keyboard shortcuts to the voting interface.** Based on the power-user feedback from User 1, left/right arrow keys will be mapped to back/advance navigation, and keyboard shortcuts (e.g., `U` / `D`) will be added to cast votes without using the mouse. This improves both accessibility and efficiency for repeat users.

---

## Post-Study Implementation Log

The following changes were made to the application after conducting the three user studies. Each change is traced back to specific feedback collected during those sessions.

---

### Change 1 — Rename "Register" step to "Process Image"

**Files changed:** `src/app/upload/page.tsx`

**What changed:**
- The progress step label `"Register"` was renamed to `"Process Image"`
- The in-progress status message `"Registering image..."` was updated to `"Processing image..."`

**Why:**
Two out of three users (User 1 and User 3) paused at the word "Register" during the upload pipeline and verbalized confusion — User 1 asked what it meant; User 3 asked whether it meant signing up for something. The word is accurate from a backend engineering perspective (the CDN URL is being registered with the pipeline API) but is opaque from a user's perspective. "Process Image" communicates the same idea in plain language that requires no prior technical knowledge.

---

### Change 2 — Add voting buttons to generated captions on the upload page

**Files changed:** `src/app/upload/page.tsx`

**What changed:**
- Each caption card in the upload results now includes a **👍 Funny** and **👎 Not funny** vote button
- Votes are submitted via the existing `submitVote` server action, keeping the same data path as the main voting interface
- The UI uses optimistic updates (button highlights immediately) and reverts on server error
- Buttons are disabled while a vote is in flight to prevent double-submission
- A confirmation label ("Voted funny!" / "Voted not funny") appears inline after voting
- If the pipeline API does not return a caption `id`, a graceful fallback message is shown instead of broken buttons

**Why:**
User 1 explicitly asked whether the captions he had just generated would appear in the voting queue. He expressed a clear desire to rate his own generated captions immediately after seeing them, but the app provided no way to do so. The generated captions are stored in the `captions` table in the database and already have UUIDs, so the same `submitVote` action used elsewhere in the app could be wired directly to the results cards — no new backend work was needed.

---

### Change 3 — Keyboard shortcuts on the voting page

**Files changed:** `src/app/components/CaptionVotingInterface.tsx`

**What changed:**
- `ArrowLeft` navigates to the previous caption (same as the Back button)
- `ArrowRight` advances to the next caption, or skips to load a new one when at the end of the session history (same as the Next / Skip button)
- `ArrowUp` casts an upvote (👍 LOL!)
- `ArrowDown` casts a downvote (👎 Not funny)
- Keypresses are ignored while a vote or caption load is in flight, preventing double-firing
- Keypresses inside `<input>` or `<textarea>` elements are excluded so the shortcuts do not interfere with text entry
- A keyboard hint legend (`↑ funny  ↓ not funny  ← back  → next`) is shown in the footer below the caption card

**Why:**
User 1 directly requested keyboard shortcuts, framing them as an accessibility and power-user improvement. He specifically called out left/right arrow keys for navigation. The up/down arrow key mapping for voting (rather than letter keys like `U`/`D`) was chosen because it is more intuitive directionally — up = positive, down = negative — and matches the spatial layout of the upvote/downvote buttons on screen.

---

### Change 4 — Fix voting history sort order and add modified timestamp

**Files changed:** `src/app/captions/actions.ts`, `src/app/components/VotedHistoryItem.tsx`

**What changed:**
- The voting history list is now sorted by `created_datetime_utc` of the vote record (i.e., the first time the user cast a vote on that caption), from most recent to oldest
- Previously the list was sorted by `modified_datetime_utc`, which caused captions to jump position whenever a vote was changed
- Each caption card now shows "Voted [date/time]" for when the vote was originally cast
- If the vote was later changed, a secondary "Updated [date/time]" line appears in a lighter color beneath it
- The `voteModifiedTimestamp` field is only populated when `modified_datetime_utc` differs from `created_datetime_utc`, so cards that have never been changed show only the single "Voted" line

**Why:**
User 1 noticed that changing a vote from the history page caused the card to move to a new position in the list, because the sort key (last-modified time) updated when the vote value changed. He argued that sort order should reflect when he first engaged with a caption, not when he last edited his opinion. Keeping the first-vote timestamp as the stable sort key makes the list predictable regardless of how many times a vote is amended. The secondary "Updated" timestamp was added so that users can still see when they changed their mind, without affecting the card's position in the list.

---

### Change 5 — Display file size limit on the upload page

**Files changed:** `src/app/upload/page.tsx`

**What changed:**
- A 10 MB maximum file size constant (`MAX_FILE_SIZE_MB = 10`) was added
- The drop zone hint text was updated from `"JPEG, PNG, WebP, GIF, HEIC"` to `"JPEG, PNG, WebP, GIF, HEIC · Max 10 MB"` so the limit is visible before the user selects a file
- A client-side validation check was added in `handleFileChange`: if the selected file exceeds 10 MB, an error message is shown immediately (e.g., "File is too large (12.3 MB). Maximum size is 10 MB.") and the upload pipeline is not started

**Why:**
User 2 flagged the absence of any visible file size limit as a usability gap. As a backend engineer, she inferred that a limit must exist but was not shown. Her concern was that a user could attempt to upload a large file, wait through the pipeline, and only receive an opaque failure at the end — with no guidance on what went wrong or how to fix it. Showing the limit in the drop zone sets expectations before any action is taken, and the client-side validation provides immediate, specific feedback rather than a silent or misleading error from the pipeline API.

---

## Database-Driven Improvements

The following changes were motivated not by individual user observations but by patterns discovered directly in the collected `caption_votes` data, visible through the statistics dashboard in the admin panel.

---

### Change 6 — Simplify voting UI to two options based on vote distribution data

**Files changed:** `src/app/components/CaptionVotingInterface.tsx`, `src/app/captions/actions.ts`

**What the data showed:**

After collecting several weeks of real user votes, the vote value breakdown chart in the admin dashboard (the `VoteValueBreakdown` component, which plots counts for each vote value from −1 through +5) revealed a striking pattern: the overwhelming majority of all votes cast were either **+1** ("Funny") or **−1** ("Not funny"). The intermediate values (+2, +3, +4, +5) were used only rarely — typically by power users who appeared to be testing the interface rather than rating captions as part of a natural session. The −1 and +1 buckets together accounted for well over 90% of all recorded `caption_votes` rows.

This was visible not just in the all-time breakdown but also when filtering to the most recent 7-day window, confirming that the pattern was consistent over time and not a product of early behavior alone. The `VotesPerDayChart` further showed that daily vote volume was steady, meaning the simplification would affect a real, ongoing stream of interactions — not a stale one.

**What changed:**

Based on this data, the voting interface was simplified to present only two vote options — **👍 LOL!** (recorded as `vote_value = 1`) and **👎 Not funny** (recorded as `vote_value = -1`) — rather than a multi-point scale. The server action `submitVote` already accepted any integer vote value, so no backend schema change was required; the change was purely in which values the UI presented. The buttons were made larger and more prominent since they now occupied the full width of the action area previously shared by a wider set of options.

**Why this matters:**

A multi-point scale only adds value if users meaningfully differentiate between the levels. The database showed they were not doing so — they were collapsing to a binary judgment in practice. Presenting a scale that users ignore introduces visual noise and decision friction without capturing any additional information. Simplifying to two options matches actual user behavior, reduces cognitive load per caption, and makes the voting session feel faster and more game-like, which aligns with what User 3 described ("this is like a meme rater — that's actually fun"). The data, not intuition, was the deciding evidence here.
