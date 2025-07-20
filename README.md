# Community Debate Arena : Live Link: <https://shoyas-batch-2.vercel.app>

## Motivational Site: <https://www.kialo.com>

A full-stack debate platform where users can create debates, choose sides (Support or Oppose), post arguments, and vote on the most compelling opinions.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & Shadcn
- **Authentication**: NextAuth.js
- **Form Validation**: React Hook Form + Zod
- **Database**: Prisma + PostgreSQL
- **Hosting**: Vercel
- **Deployment Ready**: ✅

---

## ✅ Core Features

### 1. Debate Creation

- Authenticated users can create debates with:
  - Title
  - Description
  - Tags
  - Category
  - Banner Image
  - Duration Selector (1h, 12h, 24h)

### 2. Join a Debate

- Authenticated users can join **one side only** (Support or Oppose).

### 3. Argument Posting

- Users can post arguments under their chosen side.
- Each argument displays:
  - Author info
  - Timestamp
  - Vote count
  - Edit/Delete options (within 5 minutes only)

### 4. Voting System

- Users can vote on others’ arguments.
- Only one vote per argument per user.

### 5. Debate Countdown & Auto-Close

- Countdown timer for each debate.
- After expiration:
  - Argument posting & voting are disabled.
  - The winning side is highlighted based on vote count.

### 6. Scoreboard

- Public leaderboard displaying:
  - Username
  - Total votes received
  - Debates participated in
- Filters: weekly / monthly / all-time

### 7. Auto-Moderation

- Arguments are checked for banned words.
- Submissions are blocked with a warning if inappropriate words are detected.
  - Example: `"stupid", "idiot", "dumb"`

---

## ✨ Extra Features Implemented

| Feature | Description |
|--------|-------------|
| ✅ Self-Voting Disabled | Argument authors cannot vote on their own content |
| ✅ Strict Edit/Delete Time | Arguments can only be edited/deleted within 5 minutes |
| ✅ Vote Toggle | Users can vote and also **remove** their vote |
| ✅ Responsive UI | Fully mobile-optimized experience |
| ✅ Dark Mode | Light/Dark theme toggle |
| ✅ Public Share URLs | Each debate has a public shareable link |
| ✅ Search & Filter | Debates can be filtered by title, tag, or category |
| ✅ Debate Summary (Mock) | Static summary for completed debates |

---

## 📂 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/Shoyas/task-debate-arena

# Navigate to project directory
cd debate-arena

# Install dependencies
npm install

# Run the app
npm run dev

