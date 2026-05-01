# Semester Reflection

---

## What Went Well

The part of the semester that went most smoothly was the end-to-end product loop: building a real pipeline that accepts user images, runs them through a configurable LLM prompt chain, stores the generated captions in a database, and then surfaces those captions to real users for rating. Having all three apps talk to the same Supabase backend meant every vote a user cast in `humor-project` immediately showed up in the `humor-admin` statistics dashboard, and every flavor I configured in `humor-chain` was live and testable within seconds. That tight feedback loop made it feel like a real deployed system rather than a class project, and the moment a real user (my husband) sat down and started rating captions without any guidance from me was genuinely satisfying.

The statistics dashboard in the admin panel also came together better than I expected. Starting from simple count queries and progressively adding the `VotesPerDayChart`, the `VoteValueBreakdown`, and the top-liked / most-rated panels turned it from a data dump into something that told a real story about usage. Discovering from the vote breakdown data that users were overwhelmingly converging on binary (+1/−1) rather than a multi-point scale — and then being able to trace that directly to a product change — was the clearest example this semester of data informing design in a way that felt genuine rather than contrived.

The user studies were also a highlight. Recruiting three people with very different technical backgrounds (an experienced software engineer, a backend engineer, and a CS freshman) and watching them interact with the app independently produced feedback I never would have anticipated from self-testing. The universally confusing "Register" label and the freshman who used the back browser button instead of the in-app navigation button are the kinds of findings that only come from putting real people in front of the product.

---

## What I Enjoyed

I most enjoyed the parts of the project where the three apps had to work together as a system. Configuring a new humor flavor in `humor-chain`, running the test pipeline to confirm it generated captions correctly, then switching to the main app to see those captions appear in the voting queue, and finally checking the admin dashboard to watch the vote counts accumulate — following that entire chain in real time felt like operating actual software infrastructure rather than completing a homework assignment.

I also genuinely enjoyed the constraint of building everything without a pre-built admin library or charting library. Writing the `VotesPerDayChart` from scratch using SVG and raw DOM math forced me to understand the data transformations deeply, and the result was a component that behaved exactly as needed (hover tooltips, range selection, study vs. non-study segmentation) without carrying any third-party overhead.

The iterative nature of the second half of the semester — deploy, share, observe, change, redeploy — was more satisfying than a typical "build it and submit it" assignment structure. Seeing Change 3 (keyboard shortcuts) go from User 1's feedback in a Friday observation session to a live feature by the following week made the work feel purposeful in a way that purely academic assignments often do not.

---

## What I Did Not Enjoy

The authentication setup across three separate Vercel deployments, all sharing one Supabase project, required more coordination overhead than I expected. Getting the OAuth callback URLs, allowed email domains, and RLS policies consistent across all three apps — and then debugging why a session valid in one app was not recognized in another — consumed time that felt more like DevOps busywork than learning. A more guided walkthrough of multi-app Supabase auth configuration early in the semester would have saved several hours of trial and error.

I also found it frustrating that the external caption-generation API (`api.almostcrackd.ai`) was sometimes slow or unavailable during development, which meant I could not always test the full pipeline end-to-end in a single sitting. Building around a dependency I had no visibility into or control over introduced unpredictability that made it harder to plan work sessions. Having a documented mock or stub for the pipeline API available from the start of the semester would have made local development significantly less friction-prone.

---

## Actionable Suggestion for Course Improvement

**Provide a local pipeline mock from Week 1.**

The caption generation API is central to every core feature of all three apps, but it is an external service that students cannot run locally, cannot inspect, and cannot control. A simple mock server — even just a Node script that accepts the same request shape and returns a hardcoded array of fake captions — would allow students to develop and test the full upload-to-caption flow offline, regardless of API availability. This would reduce wasted debugging time, make it easier to write reliable automated tests, and let students focus on the parts of the project that are actually being evaluated. The mock could be provided as a starter file in the course repository from the very first week.
