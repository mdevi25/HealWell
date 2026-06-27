# HealWell

A wellness and recovery app for people who stand all day at work — 
restaurant, nursing, retail, warehouse, hospitality.

## What it does
Workers open it after a shift, do a quick check-in, get recovery 
guidance, and receive an AI-generated reflection on their shift.

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript
- localStorage for persistence
- n8n + Groq AI for shift story generation

## Getting Started

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in your webhook URL
3. Run `npm install`
4. Run `npm run dev`
5. Open http://localhost:3001

## Environment Variables
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_MAKE_WEBHOOK_URL` | n8n webhook URL for AI story generation |