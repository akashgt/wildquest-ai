# WildQuest AI 🌿
> **Explore more. Scroll less.**  
> A mobile-first, offline-first AI nature exploration application powered by Google’s open-weight Gemma model. Built for Hacktoberfest 2026’s “Touch Grass” open-source AI challenge.

[![CI Quality Suite](https://github.com/your-username/wildquest-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/wildquest-ai/actions)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Model: Google Gemma](https://img.shields.io/badge/Model-Google_Gemma_2B-emerald.svg)](https://ai.google.dev/gemma)

---

## 📖 Table of Contents
- [Product Vision](#-product-vision)
- [Why Open Innovation Matters](#-why-open-innovation-matters)
- [Features & Signature Experience](#-features--signature-experience)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Getting Started](#-getting-started)
- [Configuring Google Gemma (Local AI)](#-configuring-google-gemma-local-ai)
- [Offline Architecture & PWA](#-offline-architecture--pwa)
- [Safety & Accessibility](#-safety--accessibility)
- [Automated Testing & Quality Suite](#-automated-testing--quality-suite)
- [Licensing & Model Attribution](#-licensing--model-attribution)

---

## 🌿 Product Vision

Most modern digital products are designed to maximize screen time, engagement metrics, and endless scrolling. **WildQuest AI does the exact opposite.**

It is an offline-ready nature companion that invites you to leave your desk, step into your backyard, neighborhood park, or forest trail, and pay deep sensory attention to the natural world around you.

Instead of keeping your eyes fixed on a screen, WildQuest AI presents a single, mindful quest at a time with large, readable instructions, and prompts:
> **“You're ready. Look up and explore.”**  
> *Put your phone in your pocket and observe nature with your own eyes and ears.*

---

## 💡 Why Open Innovation Matters

WildQuest AI is intentionally built on **open-weight foundation models (Google Gemma)** and local-first architecture rather than commercial, closed APIs. Here is why open innovation is critical:

1. **Absolute On-Device Privacy:** Nature reflections, personal notes, and field photographs are deeply personal. They should never be harvested as training data or commercial surveillance signals. By utilizing local models and IndexedDB, everything remains strictly on your device.
2. **True Offline Resilience:** Nature trails, state parks, and coastal areas frequently have poor or zero cell connectivity. Proprietary cloud APIs fail completely when offline. Open-weight models and deterministic fallback engines allow technology to serve humans anywhere on the planet.
3. **Freedom from API Tollbooths & Vendor Lock-in:** Open innovation ensures that wellness and environmental education tools cannot be shut down by sudden API pricing changes, restrictive rate limits, or corporate deprecations.
4. **Community Auditability & Safety:** Open-source architectures allow environmentalists, educators, and developers to inspect prompt guardrails, verify that toxic foraging advice is eliminated, and contribute culturally inclusive naturalist templates.

---

## ✨ Features & Signature Experience

- 🗺️ **Personalized Adventure Generator:** Select your surroundings (Garden, Urban, City Park, Forest Trail, Waterfront), available duration (5 to 60 minutes), and interests (plants, bird acoustics, natural patterns, seasonal shifts, or mindfulness).
- 🧭 **Signature Adventure Mode:** Full-screen distraction-free interface presenting one quest at a time, persistent timer, and simple progress indication.
- ☀️ **Screen-Light Mode:** High-contrast dark OLED mode designed to reduce outdoor sun glare and save phone battery on the trail.
- 📓 **Private Nature Journal:** Chronological observation log with personal reflection notes, field photographs, search, editing, and JSON export/import.
- 🏅 **Honest Milestone Badges:** Real achievements based strictly on recorded outdoor activity (*First Steps*, *Curious Eyes*, *Slow Down*, *Weekend Explorer*, *Nature Noticer*). No manipulative streaks or guilt notifications.
- 🛡️ **Truthful AI Status Badge:** Explicitly communicates whether local Gemma inference is active or whether the offline rule-based fallback engine is operating. Never fakes live status.

---

## 🛠️ Architecture & Tech Stack

- **Framework:** React 18, Vite 6, TypeScript
- **Styling & Tokens:** Tailwind CSS (curated palette: Deep Forest Green `#1B4332`, Warm Ivory `#FAF8F5`, Muted Sage `#8FBC8F`, Sunlight Gold `#E9C46A`, Earthy Terracotta `#C86D51`)
- **Icons & Motion:** Lucide React, Framer Motion
- **AI Engine:** Google Gemma 2B via Ollama, paired with a deterministic procedural Naturalist Fallback Engine
- **Validation:** Zod schemas strictly parsing and sanitizing all AI outputs
- **Storage:** IndexedDB (`idb`) for local-first persistence
- **PWA:** Service worker (`sw.js`) and Web App Manifest caching application shell and static assets
- **Testing:** Vitest, React Testing Library, and Fake-IndexedDB (17 automated tests, 100% passing)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/wildquest-ai.git
cd wildquest-ai
npm install
```

### 2. Environment Configuration
Copy the configuration template:
```bash
cp .env.example .env
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🤖 Configuring Google Gemma (Local AI)

WildQuest AI natively communicates with Google's open-weight **Gemma 2B** running via Ollama.

### Step 1: Install Ollama
Download and install Ollama from [ollama.com](https://ollama.com).

### Step 2: Pull & Run Gemma 2B
```bash
ollama run gemma2:2b
```
*(Gemma 2B requires ~2.5 GB of RAM/VRAM. For higher-end machines with 16GB+ RAM, `gemma2:9b` can also be used).*

### Step 3: Allow Browser Requests (CORS)
To allow browser fetch requests to the local Ollama instance:
```bash
# On Linux/macOS
OLLAMA_ORIGINS="*" ollama serve

# On Windows PowerShell
$env:OLLAMA_ORIGINS="*"
ollama serve
```

### Step 4: Verify in WildQuest Settings
Open the **Settings** view in the application and click **Test Connection**. Once verified, the status indicator will switch to **Gemma Local Connected**.

> **Note on Fallback:** If Ollama is not installed or unreachable, WildQuest AI automatically and transparently activates its built-in **Naturalist Engine (Rule-based Fallback)** so the application remains 100% functional offline.

---

## 🌲 Offline Architecture & PWA

- **Application Shell:** Cached by the service worker (`public/sw.js`).
- **Data Persistence:** All user preferences, active adventure timers, journal reflections, and badges reside in IndexedDB.
- **Export & Backup:** Use the **Export JSON** feature in the Nature Journal to create an unencrypted local backup file, which can be imported and validated on any device.

---

## 🛡️ Safety & Accessibility

### Hardcoded Outdoor Safety Guardrails:
1. **Never instructs foraging or eating:** Quests strictly forbid tasting, picking, or consuming wild plants, berries, or fungi.
2. **Never disturbs wildlife:** Observes birds and pollinators from respectful distances without cornering or touching.
3. **Respects boundaries:** Quests strictly forbid trespassing on private property or entering unsafe structures.
4. **Traffic safety:** Instructs users to step off pathways before looking up and never look at phones near traffic.

### Accessibility:
- Semantic HTML and full keyboard accessibility.
- High-contrast outdoor mode for bright sunlight.
- Reduced motion toggle honoring `prefers-reduced-motion`.
- Accessible flat-path quest filters for users with mobility constraints.

---

## 🧪 Automated Testing & Quality Suite

The test suite covers schema validation, error handling, provider fallback, IndexedDB persistence, and UI components:

```bash
# Run automated tests
npm run test

# Run TypeScript type check
npm run lint

# Run production build
npm run build
```

**Test Coverage Summary:**
- `src/test/schema.test.ts`: Zod validation, sanitization of malicious script tags, and markdown code fence extraction.
- `src/test/providers.test.ts`: Rule-based generation, Mock Gemma provider, runtime connection failures, and transparent fallback triggering.
- `src/test/indexedDb.test.ts`: Settings persistence, active adventure session restoration, journal CRUD, stats/achievements recalculation, and JSON export/import.
- `src/test/components.test.tsx`: Landing page rendering, onboarding wizard step progression, and achievements milestone rendering.

---

## 📜 Licensing & Model Attribution

- **Application Software:** Licensed under the [Apache License 2.0](LICENSE).
- **AI Model Weights:** Powered by [Google Gemma](https://ai.google.dev/gemma), subject to the separate [Gemma Terms of Use](https://ai.google.dev/gemma/terms) and [Prohibited Use Policy](https://ai.google.dev/gemma/prohibited_use_policy).
