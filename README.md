# Weekly Learning Tracker

A minimal two-person accountability tool for ML/DL/AI/Agents learning. Set weekly goals, track daily progress, and review your learning journey together.

## Features

- **Weekly Goal Setting**: Define 1-7 focused objectives with domain categories (ML, DL, AI, Agents)
- **Calendar View**: Day-by-day tracking with status indicators (Todo, In Progress, Done, Missed)
- **Review Dashboard**: Completion charts, domain progress, and shared streaks
- **Real-time Sync**: Both users see updates instantly via Vercel KV
- **Mobile Responsive**: Works great on phones for quick check-ins

## Tech Stack

- **Frontend**: Next.js 14 + React 18 + Tailwind CSS
- **Storage**: Vercel KV (serverless Redis)
- **Deployment**: Vercel (one-click deploy)

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd weekly-learning-tracker
npm install
```

### 2. Set Up Vercel KV

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or select existing
3. Go to **Storage** tab → **Create Database** → **KV**
4. Copy the connection details

### 3. Configure Environment

Copy `.env.local.example` to `.env.local` and add your KV credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
KV_REST_API_URL=https://your-kv-url
KV_REST_API_TOKEN=your-kv-token
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

## Usage

1. **First Visit**: Enter both users' names
2. **Set Goals**: Click "Set Goals" to define weekly objectives
3. **Track Progress**: Use the Calendar view to mark goals as complete
4. **Review**: Check the Review page for summaries and streaks

## Keyboard Shortcuts

- `C` or `G` - Go to Goal Setting
- `K` - Go to Calendar
- `R` - Go to Review
- `H` - Go to Home

## Data Structure

All data is stored as a single JSON blob in Vercel KV:

```typescript
{
  users: ["You", "Friend"],
  goals: [
    {
      id: "uuid",
      user: "You",
      week_start_date: "2026-09-07",
      title: "Read FlashAttention paper",
      category: "DL",
      status: "in_progress",
      day_of_week: ["mon", "wed"],
      focus_hours: 4
    }
  ]
}
```

## Customization

### Design Tokens

Edit `tailwind.config.ts` to customize colors, fonts, and spacing. The design follows the Stitch UI system with:

- **Primary**: Sage green (#4e6b56)
- **Fonts**: Playfair Display (headings) + Plus Jakarta Sans (body)
- **Domain Colors**: ML=Sage, DL=Slate, AI=Terracotta, Agents=Ochre

### Categories

Edit `lib/types.ts` to add or modify learning categories.

## License

MIT
