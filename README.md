# Spores

Spores is a consent-based mental wellness support app for trusted circles.

Each private support space is called a **Spore**. Inside a Spore, friends can check in on themselves, notice patterns, send support, participate in small challenges, talk together, and use AI-assisted listening tools in a way that feels gentle rather than invasive.

## Developers
Aayush Acharya (SWE)
Anvesh Sapkota (Product & UI)

## Problem

A lot of people want support before a crisis point, but most tools today are either:

- too private and isolating
- too public and socially unsafe
- too clinical for everyday emotional care
- too shallow to notice real patterns over time

Spores is designed to solve that gap.

It helps people build a **trusted, consent-based support circle** where care can be proactive, not just reactive. Instead of waiting until someone is clearly struggling, Spores creates a space for:

- daily reflection
- lightweight social support
- passive wellness signals
- challenge-based encouragement
- AI-assisted listening
- group awareness when someone may need a gentler check-in

## What Spores Does

- Creates private support circles called Spores
- Lets users create or join a Spore through onboarding and invites
- Supports self check-ins and care-oriented observations
- Allows appreciations and supportive notes between members
- Tracks Spore wellness and challenge participation
- Includes a shared workspace chat for each Spore
- Offers an AI Listener for reflective support conversations
- Logs in-app notifications and supports push notification flows
- Includes passive tracking scaffolds for location, steps, screen time, and spending
- Supports demo notification triggering from the terminal for presentations

## Core Features

### 1. Auth and onboarding

- Email/password signup and login with Supabase Auth
- Detailed onboarding flow for creating or joining a Spore
- Invite-code based joining
- Consent, sharing style, support style, and alert preference capture

### 2. Spore support system

- Multi-Spore support
- Active Spore switching
- Spore detail workspace
- Member care views
- Invite generation for trusted friends

### 3. Care flows

- Daily self check-ins
- Member observations
- Appreciation and support notes
- Care summary and support feed

### 4. Challenges and Spore health

- Create and browse challenges
- Invite Spore members into a challenge
- Join and complete activities
- Spore health scoring based on participation and feedback signals

### 5. AI and RAG

- AI Listener powered through a Supabase edge function
- `gpt-4o-mini` support through the OpenAI API
- RAG-style memory retrieval from stored care and signal history
- Concern-band detection for steady, watch, and elevated moments

### 6. Notifications

- In-app notification log
- Expo push registration flow
- Local notification mirroring for simulator/demo scenarios
- Terminal-triggered demo notifications for live presentations

### 7. Passive tracking architecture

- Location signal support
- Steps/activity support scaffold
- Screen-time scaffold
- Spending-habit scaffold

Important:
Screen time and spending are still scaffolded and not fully production-native yet.

## Tech Stack

- Expo
- React Native
- Expo Router
- TypeScript
- TanStack Query
- Zustand
- Supabase Auth
- Supabase Postgres
- Supabase Edge Functions
- OpenAI via edge-function proxy

## Project Structure

```text
app/                  Expo Router routes
src/features/         Feature-based app modules
src/components/       Shared UI primitives and layout
src/store/            Zustand app state
src/lib/              Shared runtime, env, and client utilities
supabase/migrations/  Database schema and RPC migrations
supabase/functions/   Edge functions for AI, RAG, notifications, and care logic
scripts/              Local scripts, including demo notification tooling
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment variables

Copy the example file:

```bash
cp .env.example .env
```

Fill in at least:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

For edge functions and AI features, also set:

```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_MODEL=gpt-4o-mini
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

## Supabase Setup

### 1. Install and login to the Supabase CLI

```bash
npx supabase login
```

### 2. Link the project

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

### 3. Push database migrations

```bash
npx supabase db push
```

### 4. Deploy edge functions

```bash
npx supabase functions deploy ai-proxy
npx supabase functions deploy rag-ingest
npx supabase functions deploy rag-search
npx supabase functions deploy analyze-member-risk
npx supabase functions deploy dispatch-push
npx supabase functions deploy send-demo-notification
npx supabase functions deploy care-agent-context
```

### 5. Set function secrets

```bash
npx supabase secrets set OPENAI_API_KEY=YOUR_OPENAI_API_KEY
npx supabase secrets set OPENAI_MODEL=gpt-4o-mini
npx supabase secrets set SUPABASE_URL=https://YOUR_PROJECT.supabase.co
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

## Running the App

Start the Expo dev server:

```bash
npm start
```

For iOS simulator builds:

```bash
npm run ios
```

If you are using the installed native dev build, prefer:

```bash
npx expo start --dev-client --clear --port 8081
```

## Demo Notifications

You can trigger a demo care notification from the terminal:

```bash
npm run demo:notify -- \
  --spore YOUR_SPORE_ID \
  --target-member TARGET_MEMBER_ID \
  --audience both \
  --self-title "Hey, let's go out for a walk" \
  --self-body "Hey, let's go out for a walk" \
  --friends-title "Check in on Aayush" \
  --friends-body "Hey, [name] hasn't stepped out of his house for four days. Maybe it's time to check in on him"
```

This is useful for demos because it can:

- write an in-app notification
- trigger push on supported devices
- mirror as a local notification in simulator-friendly flows

## Current Limitations

- Screen time is scaffolded, not fully production-native
- Spending sync is scaffolded, not fully production-native
- Steps/activity architecture exists, but native health integrations may still need final device-specific work
- Push delivery is best tested on a physical iPhone, not only the simulator

## Notes

This repo is the UI and product source of truth for the new Spores app. The goal is to preserve the mobile visual language while wiring it to real backend logic, richer care features, and demo-ready flows.
