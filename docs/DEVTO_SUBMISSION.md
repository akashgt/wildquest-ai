---
title: "WildQuest AI: Explore More, Scroll Less (Touch Grass with Open-Weight Gemma)"
published: false
description: "A mobile-first, offline-first outdoor nature exploration companion powered by Google Gemma 2B for Hacktoberfest 2026's Touch Grass AI Challenge."
tags: [devchallenge, hf26challenge, ai, opensource, webdev]
canonical_url: false
cover_image: 
---

# What I Built

**WildQuest AI** is a mobile-first, offline-first outdoor exploration companion created for Hacktoberfest 2026's **"Touch Grass" open-source AI challenge**.

Our product vision is simple: **Explore more. Scroll less.**

While the world is flooded with AI applications designed to maximize screen time, WildQuest AI does the exact opposite. It invites people to leave their desks, step into a park, garden, or wooded trail, and pay deep attention to the physical world around them.

Users select their surroundings (backyard, city park, forest trail, or waterfront), available duration (5 to 60 minutes), and personal interests (bird acoustics, plant geometry, seasonal transitions, or mindfulness). The app generates micro-quests such as:

- *Find three different leaf shapes without picking them.*
- *Spend two minutes listening quietly to birds.*
- *Discover five distinct shades of green in nearby foliage.*
- *Observe pollinator flight paths from a respectful distance.*
- *Notice subtle seasonal changes in nearby tree canopies.*

The signature **Adventure Mode** provides a distraction-free, full-screen experience with large readable type, outdoor-ready high-contrast **Screen-Light Mode**, a built-in timer, and an active reminder to put the phone in your pocket and explore.

All observations are recorded in an on-device **Nature Journal** with reflections and optional field photographs. 

---

# Demo

- **Live Deployed Demo:** `<!-- Place your live deployment URL here, e.g. https://wildquest-ai.vercel.app -->`
- **Video Walkthrough:** `<!-- Place video link or embedded WebP animation here -->`

### Visual Walkthrough

<!-- Replace with your actual screenshots -->
- **Landing Page:** Hero invitation to step outside.
- **Onboarding Wizard:** Selecting sensory interests and accessibility preferences.
- **Home Dashboard:** Honest AI status indicator, recorded outdoor minutes, and weekly activity tracker.
- **Adventure Mode:** Signature distraction-free mode with the prompt: *"You're ready. Look up and explore."*
- **Nature Journal:** Local chronological reflections and field photographs.

---

# Code

The complete source code is open source and available on GitHub:

- **GitHub Repository:** `<!-- Place your GitHub repository link here, e.g. https://github.com/your-username/wildquest-ai -->`
- **License:** Apache 2.0 (Software) & Gemma Terms of Use (Model)

---

# How I Built It

### 1. Technology Stack
- **Frontend Core:** React 18, Vite 6, and TypeScript with strict type checking.
- **Design System & Styling:** Tailwind CSS with a curated nature palette (Deep Forest Green, Warm Ivory, Muted Sage, Sunlight Gold, and Earthy Terracotta) and accessible responsive layouts (360px mobile to 1440px desktop).
- **Icons & UI:** Lucide icons and Framer Motion for restrained, purposeful animations.
- **Local Persistence:** IndexedDB via `idb` for offline adventures, active quest state, and private nature journals.
- **Offline Shell & PWA:** Service worker (`sw.js`) and Web App Manifest caching application shell and static assets.
- **Validation Pipeline:** Zod schemas strictly parsing and sanitizing all AI outputs.
- **Testing Suite:** Vitest and React Testing Library with 100% passing automated test coverage across schemas, providers, IndexedDB, and UI components.

### 2. Dual Provider AI Architecture
WildQuest AI implements a unified `IAIProvider` interface with two core engines:
1. **Local Google Gemma Provider:** Connects to Ollama (`http://localhost:11434`) running `gemma2:2b`. Generates structured JSON adhering strictly to outdoor safety rules (no foraging toxic plants, no disturbing wildlife, no trespassing).
2. **Curated Naturalist Engine (Rule-based Fallback):** A deterministic, 100% offline procedural generator based on naturalist observation methods (Japanese Shinrin-yoku forest bathing, botanical noticing, acoustic listening).
3. **Honest AI Indicator:** The app never pretends live inference succeeded when it did not. If Gemma is unreachable or uninstalled, the app explicitly informs the user that the rule-based fallback is active.

### 3. Hardcoded Safety & Accessibility
Quests are strictly prevented from recommending hazardous behaviors:
- No eating or tasting wild vegetation or mushrooms.
- No touching unfamiliar wildlife or disturbing nests.
- No trespassing onto private property.
- No climbing dangerous cliffs or structures.
- No looking at phone screens while near traffic or crossing streets.

---

# Why Does Open Innovation Matter?

Open-source and open-weight innovation is critical for the future of wellness and outdoor technology:

1. **Local Privacy & Sovereignty:** Nature reflections and photos should not be harvested as training data or commercial tracking signals. Running open-weight Gemma locally on the device ensures user thoughts remain 100% private.
2. **True Offline Resilience:** Nature trails and deep parks rarely have reliable 5G connections. Open-weight models and offline-first architectures allow technology to serve humans where cloud-tethered APIs fail.
3. **Reduced Dependence on Closed Commercial APIs:** Developers shouldn't face prohibitive token costs or sudden pricing changes just to build outdoor wellness tools for their communities.
4. **Customizability & Safety:** Open innovation allows communities to inspect, refine, and audit the safety guardrails protecting users in the real world.

---

# My Agent Session

This application was engineered with the assistance of Google Antigravity IDE and Gemini 3.7. The agent session transcript is documented here:

- **Agent Session Link:** `<!-- Place your DevRelay or Antigravity session link here -->`

### Outdoor Testing Notes:
`<!-- Placeholder: Add your genuine personal observations from taking WildQuest AI outside to your neighborhood park or trail -->`
- *Tested on:* `<!-- e.g. Neighborhood park trail on Sunday afternoon -->`
- *Observation notes:* `<!-- e.g. Found five shades of green on a weeping willow and listened to bird calls in the canopy -->`

---

# Prize Categories

1. **Touch Grass Open-Source AI Challenge (Hacktoberfest 2026):** Main submission category. A production-ready, mobile-first app designed specifically to get users away from screens into the outdoors.
2. **Open Innovation / Gemma Integration Track:** Utilizing Google's open-weight Gemma 2B model for local edge inference.
3. **Offline & Edge AI Track:** Full offline PWA architecture with IndexedDB persistence and transparent rule-based fallback.

---

### What Actually Works vs Remaining Limitations

**What Works Today:**
- Complete responsive web app & PWA with service worker caching.
- Onboarding wizard with preference persistence in IndexedDB.
- Structured AI generation with Zod validation.
- Local Gemma provider communicating with Ollama.
- Robust offline rule-based fallback generator.
- Full-screen Adventure Mode with timer, screen-light mode, and persistence across reloads.
- Functional local Nature Journal with notes, photos, search, edit/delete, and JSON export/import.
- Milestone badges calculated strictly from real stored activity.
- 100% automated test pass rate (17 tests across schemas, DB, providers, and UI).

**Remaining Limitations:**
- Running Gemma 2B locally inside a low-end mobile browser natively in WebAssembly requires significant WebGPU/RAM resources; local Ollama host or desktop companion is recommended for full on-device LLM generation.
- Field photo storage is limited by the browser's available IndexedDB storage quota.
