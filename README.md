This is a [Next.js](https://nextjs.org) project for the Humor Project, featuring caption voting functionality.

## Features

### Caption Voting System (Assignment #4)

This app allows logged-in users to vote on captions:

- **Upvote/Downvote**: Users can upvote (+1) or downvote (-1) captions
- **Vote Toggle**: Clicking the same vote button again removes the vote
- **Vote Change**: Users can change their vote from upvote to downvote or vice versa
- **Authentication Required**: Only logged-in users can vote on captions
- **Real-time Updates**: Vote counts update immediately with optimistic UI updates
- **Database Mutations**: Votes are stored in the `caption_votes` table

The voting system uses:
- **Server Actions** (`src/app/captions/actions.ts`) for secure vote mutations
- **Client Components** (`src/app/components/VoteButton.tsx`) for interactive UI
- **Supabase** for authentication and database operations

### Pages

- `/` - Home page with personalized welcome showing two main options when logged in
- `/captions` - Tinder-style voting interface: view one caption at a time with its image (requires login)
- `/voted-history` - Grid view of all captions you've voted on with pagination (20 per page, requires login)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
