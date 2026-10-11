# Google Gemma Local AI Setup Guide

WildQuest AI is designed around **Google's open-weight Gemma model**, running locally on your hardware. This guarantees complete privacy, zero API costs, and full freedom to explore without an internet connection.

---

## 1. Prerequisites & Hardware Requirements

### Minimum Hardware:
| Model Variant | Parameter Size | Minimum RAM / VRAM | Recommended Machine |
| :--- | :--- | :--- | :--- |
| **Gemma 2 (2B)** *(Default)* | ~2.6 Billion | 3 GB RAM | Standard laptops, Apple Silicon M1/M2/M3, x86 PCs |
| **Gemma 2 (9B)** | ~9 Billion | 10 GB RAM | Modern workstations, laptops with 16GB+ RAM |

*Note: Mobile web browsers cannot comfortably run a 9B model in WebAssembly due to memory constraints; running Gemma on your host machine via Ollama and connecting over local WiFi or localhost is the optimal architecture.*

---

## 2. Step-by-Step Installation via Ollama

### Step 1: Install Ollama
Download and install Ollama for your operating system:
- **macOS / Linux / Windows:** Download from [https://ollama.com](https://ollama.com).

### Step 2: Download Google Gemma 2B
Open your terminal and run:
```bash
ollama run gemma2:2b
```
Ollama will download the quantized weights (~1.6 GB) and launch an interactive prompt. Once running, you can test it:
```text
>>> hello
Hello! How can I help you today?
```
Type `/bye` to exit the interactive prompt. Ollama will continue running in the background as a local service on port `11434`.

### Step 3: Enable Cross-Origin Requests (For Local Network Mobile Devices)
If you are accessing WildQuest AI from a mobile device or testing locally from another host, configure Ollama to accept browser fetch requests:

#### On Windows (PowerShell):
```powershell
$env:OLLAMA_ORIGINS="*"
ollama serve
```

#### On macOS / Linux:
```bash
OLLAMA_ORIGINS="*" ollama serve
```

---

## 3. Configuring WildQuest AI

1. Open WildQuest AI in your browser (`http://localhost:5173`).
2. Navigate to **Settings** (gear icon in the top navigation).
3. Under **Google Gemma Local AI Setup**, verify:
   - **Endpoint URL:** `http://localhost:11434` (or your host machine's local IP if testing from phone, e.g. `http://192.168.1.50:11434`)
   - **Model Tag:** `gemma2:2b`
4. Click **Test Connection**.
5. Once verified, the badge will turn green (**Gemma Connected**).

---

## 4. Testing Inference & Fallback

### Testing Gemma Inference:
1. Click **Create an Adventure** on the dashboard.
2. Select your surroundings and duration.
3. Choose **Local Gemma 2B** as your inference provider.
4. Click **Generate Adventure**.
5. The generator will communicate with your local Gemma instance, validate the returned JSON using Zod, and display the personalized quests.

### Testing the Rule-based Fallback:
1. Shut down Ollama or change the endpoint in Settings to an invalid port.
2. Generate an adventure.
3. WildQuest AI will gracefully detect the disconnection, activate the **Naturalist Engine (Fallback)**, and deliver a high-quality adventure without crashing or showing broken interfaces.

---

## 5. Model License & Attribution

- **Model Family:** Google Gemma 2 (released by Google DeepMind).
- **License:** Governed by the [Gemma Terms of Use](https://ai.google.dev/gemma/terms) and [Prohibited Use Policy](https://ai.google.dev/gemma/prohibited_use_policy).
- **Application Code:** Licensed separately under the [Apache 2.0 License](../LICENSE).
