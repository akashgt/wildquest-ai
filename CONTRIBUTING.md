# Contributing to WildQuest AI

Thank you for your interest in contributing to **WildQuest AI**! We welcome bug fixes, documentation improvements, new accessible naturalist quest templates, and provider enhancements.

## Code of Conduct

All contributors and maintainers are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please be welcoming, respectful, and considerate.

## Development Workflow

### 1. Prerequisites
- Node.js (version 20, 22, or higher)
- npm (version 10 or higher)
- Optional: [Ollama](https://ollama.com) running locally with `gemma2:2b`

### 2. Setup
```bash
git clone https://github.com/your-username/wildquest-ai.git
cd wildquest-ai
npm install
cp .env.example .env
npm run dev
```

### 3. Safety Guidelines for Quests
When adding quest templates or prompt instructions, strictly follow these safety tenets:
- **Never instruct foraging, tasting, or eating wild plants, flowers, berries, or fungi.**
- **Never instruct touching unfamiliar animals or disturbing nests.**
- **Never instruct trespassing onto private property.**
- **Never instruct climbing dangerous cliffs, loose rocks, or structures.**
- **Never instruct looking at phones while walking near roads or crossing traffic.**
- Quests must prioritize calm observation, acoustic listening, safe foliage texture noticing, and mindfulness.

### 4. Running Checks
Before submitting a pull request, ensure all tests, type checks, and builds pass:
```bash
# Run TypeScript strict type checks
npm run lint

# Run automated tests
npm run test

# Run production bundle build
npm run build
```

## Pull Request Guidelines
- Keep pull requests focused on a single change or fix.
- Update tests if modifying core AI schemas, persistence schemas, or providers.
- Maintain honest indicators: never claim remote APIs or live GPS are available when they are not.
