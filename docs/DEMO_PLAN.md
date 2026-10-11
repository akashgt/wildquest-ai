# WildQuest AI — Live Demonstration Plan

This document outlines a complete, step-by-step live demo script suitable for hackathon judges, community presentations, or video walk-throughs.

---

## Preparation Before Demo

1. **Start the local development server:**
   ```bash
   npm run dev
   ```
2. **(Optional) Start Ollama with Gemma 2B:**
   ```bash
   ollama run gemma2:2b
   ```
3. Open `http://localhost:5173` in Google Chrome or mobile device simulator (width: 390px for mobile preview, or standard desktop).
4. Verify tests pass before the demo:
   ```bash
   npm run test
   ```

---

## 3-Minute Live Demo Script

### Scene 1: The Problem & Vision (30 Seconds)
- **Action:** Show the landing page with the hero text: *"Your next adventure is closer than you think."*
- **Talking Points:**
  - Most AI apps keep people staring at glowing screens.
  - WildQuest AI was built for Hacktoberfest 2026's *"Touch Grass"* challenge.
  - The philosophy is: **Explore more. Scroll less.**
  - Show the 4 pillars: Context-aware quests, 100% offline access, open-weight Google Gemma AI, zero tracking or account creation.

### Scene 2: Onboarding & Preference Tailoring (30 Seconds)
- **Action:** Click **Start Exploring**.
- **Talking Points:**
  - Step 1: Select interests (*Wild Plants*, *Birds & Songs*).
  - Step 2: Choose surroundings (*City or County Park*) and duration (*10 minutes*).
  - Step 3: Choose intensity (*Easy*) and toggle accessibility (*Accessible / Flat Paths*).
  - Highlight: No location permission asked, no sign-in required. Everything saves to local IndexedDB.

### Scene 3: Dashboard & Honest AI Indicator (30 Seconds)
- **Action:** Show the Home Dashboard.
- **Talking Points:**
  - Notice the greeting, real outdoor minutes count, and weekly activity tracker.
  - Point to the **AI Engine Status badge**: Honest attribution showing whether local Gemma is connected or the rule-based fallback is active. Never fakes live status.

### Scene 4: The Signature Feature — Adventure Mode (45 Seconds)
- **Action:** Click **Create an Adventure**, choose provider, and start Adventure Mode.
- **Talking Points:**
  - Notice the headline: *"You're ready. Look up and explore."*
  - Distraction-free full screen with one quest at a time in large readable type.
  - Demonstrate **Screen-Light Mode** (high-contrast dark OLED mode designed for bright outdoor sunlight and battery conservation).
  - Show the message: *"Put your phone in your pocket & take your time."*
  - Complete Step 1: Add a note (*"Noticed three distinct leaf shapes on an oak branch"*).
  - Complete the remaining steps to finish the adventure.

### Scene 5: Nature Journal & Honest Milestones (45 Seconds)
- **Action:** Click **View in Nature Journal**, then navigate to **Badges**.
- **Talking Points:**
  - Journal entries persist on device with notes and optional field photos.
  - Show **Export JSON** and **Import JSON** capabilities.
  - Show the **Badges** screen: *"First Steps"* unlocked based on real stored activity. No guilt-based streaks or manipulative notifications.
  - Demonstrate offline behavior by toggling network offline in DevTools: the app shell, journal, and saved quests continue working smoothly.

---

## Backup Plan
If running on a presentation machine without Ollama or GPU resources:
- The app automatically uses the **Curated Naturalist Engine (Fallback)**.
- Clearly point this out as a strength: the application never crashes, fails, or breaks when offline.
