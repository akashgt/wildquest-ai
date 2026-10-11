# WildQuest AI — Architecture & Design System

## System Overview

WildQuest AI is an offline-first, mobile-first nature adventure application designed to encourage real-world exploration and mindful observation while minimizing screen time.

```
┌─────────────────────────────────────────────────────────────┐
│                    User Experience (PWA)                    │
│  Landing  │  Onboarding  │  Dashboard  │  Adventure Mode    │
│  Nature Journal  │  Badges  │  Settings & Accessibility     │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│     AI Provider Manager      │        │    Local Persistence Layer   │
│  ┌────────────────────────┐  │        │          (IndexedDB)         │
│  │ Google Gemma 2B (Edge) │  │        │  • Saved Adventures          │
│  └───────────┬────────────┘  │        │  • Active Quest Session      │
│              ▼               │        │  • Nature Journal & Photos   │
│  ┌────────────────────────┐  │        │  • Honest Milestone Stats    │
│  │ Rule-based Fallback    │  │        │  • Settings & Preferences    │
│  └────────────────────────┘  │        │  • Schema-validated Export   │
│  ┌────────────────────────┐  │        └──────────────────────────────┘
│  │ Zod Schema Validation  │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

## 1. Provider Architecture

### Shared Typed Interface (`IAIProvider`)
All quest generation logic conforms to the `IAIProvider` interface:
```typescript
export interface IAIProvider {
  name: string;
  checkStatus(): Promise<AIProviderStatus>;
  generateAdventure(preferences: UserPreferences): Promise<Adventure>;
}
```

### Implementations:
1. **`GemmaProvider` (Local Edge Model):**
   - Connects to Ollama running locally at `http://localhost:11434` (configurable).
   - Polls `/api/tags` to detect installed Gemma models (`gemma2:2b`, `gemma2:9b`, `gemma:2b`).
   - Issues structured JSON generation requests enforcing pure JSON schema output.
   - Strips code fences, sanitizes HTML, and validates with Zod.
   - Enforces timeouts using `AbortController`.
   - Never fabricates status: explicitly reports if Ollama is unreachable or model is not pulled.

2. **`RuleBasedProvider` (Naturalist Engine Fallback):**
   - 100% offline, deterministic, procedural generator.
   - Built on proven naturalist observation techniques (Japanese Shinrin-yoku, botanical leaf geometry, acoustic listening, pattern noticing).
   - Fully honors user filters (Duration: 5-60 min, Difficulty, Environment, Accessible flat paths, Quiet contemplation, No-photography).

3. **`MockGemmaProvider` (Automated Testing):**
   - Deterministic test harness used in Vitest to simulate model latency, successful inferences, connection errors, and malformed outputs without requiring external services or paid APIs.

4. **`AIManager` (Coordinator):**
   - Coordinates between Gemma and the Naturalist Fallback.
   - Transparently handles failure by falling back to the rule-based engine while explicitly reporting the fallback reason and provider provenance.

## 2. Validation & Safety Pipeline

### Zod Schema Guardrails
Every AI response is passed through `AdventureZodSchema` and `QuestZodSchema`:
- Requires exact quest counts (3-5 depending on duration).
- Sanitizes script tags and malicious HTML characters.
- Validates realistic minute estimates.

### Hardcoded Outdoor Safety Tenets
Prompts and templates strictly enforce:
- No eating or tasting wild vegetation or fungi.
- No touching wild fauna or disturbing habitats.
- No trespassing onto private lands.
- No climbing hazardous terrain or structures.
- No looking at phone screens while walking near traffic or crossing roads.

## 3. Offline & PWA Strategy
- **Service Worker (`sw.js`):** Caches the application shell and static assets using a stale-while-revalidate strategy.
- **IndexedDB (`idb`):** All user data (adventures, journal entries, active timers, preferences) lives purely on device.
- **Privacy Assurance:** User reflections and photos are never sent over the network or saved in shared caches.

## 4. UI/UX Design Philosophy: "Explore More, Scroll Less"
- **Nature Color Palette:** Deep Forest Green (`#1B4332`), Warm Ivory (`#FAF8F5`), Muted Sage (`#8FBC8F`), Sunlight Gold (`#E9C46A`), Earthy Terracotta (`#C86D51`).
- **Signature Adventure Mode:** One quest at a time, massive typography, encouraging the user to put the phone in their pocket.
- **Screen-Light Mode:** Dark, low-glare OLED mode to minimize screen glare outdoors and extend battery life on the trail.
- **No Manipulative Streaks:** Milestones are awarded on real activity without punitive countdowns or guilt-based retention tactics.
