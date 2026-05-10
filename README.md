# 🔥 PitchPerfect AI — Startup Idea Validator

<div align="center">

**A ruthless AI investor in your browser. Pitch your startup idea and get brutally honest feedback, a score, and a recommended tech stack — in seconds.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-orange?style=for-the-badge)](https://groq.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## ✨ What It Does

You type your startup idea. The AI — channeling the energy of a Y Combinator partner on a bad day — tears it apart with:

| Output | Description |
|---|---|
| 🎯 **Investor Score** | 0–100 rating with animated gauge (green / yellow / red) |
| 🔥 **The Roast** | A brutal 2-sentence reality check, no filter |
| 🛠 **MVP Tech Stack** | 4 modern technologies recommended to build it fast |

---

## 🚀 Tech Stack

- **Framework** — [Next.js 14](https://nextjs.org/) (App Router)
- **AI Model** — [LLaMA 3.3 70B Versatile](https://groq.com/) via Groq API
- **Styling** — Tailwind CSS + Custom CSS (fire/ember dark theme)
- **Language** — TypeScript
- **Runtime** — Node.js Edge-compatible

---

## 🛠 Running Locally

### Prerequisites

- Node.js 18+
- A free [Groq API key](https://console.groq.com) (takes 30 seconds to get)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/pitchperfect-ai.git
cd pitchperfect-ai

# 2. Install dependencies
npm install

# 3. Set your API key
cp .env.example .env.local
# Open .env.local and replace the placeholder:
# GROQ_API_KEY=gsk_your_actual_key_here

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — and start pitching.

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GROQ_API_KEY` | Your Groq API key from [console.groq.com](https://console.groq.com) | ✅ Yes |

---

## 🏗 Project Structure

```
app/
├── api/
│   └── generate/
│       └── route.ts     # Groq API handler (POST /api/generate)
├── globals.css          # Fire/ember dark theme + animations
├── layout.tsx           # App shell + metadata
└── page.tsx             # Main UI — input, results, score ring
```

---

## 🎨 Design

- **Theme** — Deep black background with orange, amber, and red fire accents
- **Animated SVG score ring** — smooth circular gauge with color-coded glow
- **Glassmorphic cards** — backdrop blur, warm borders, layered shadows
- **Staggered animations** — result cards slide up with 80ms delay each
- **Tech pills** — 4 distinct warm color variants with hover lift effects

---

## 🤖 How the AI Works

The app sends your idea to Groq's inference API with a strict system prompt that forces the LLM to respond as a Y Combinator-style investor. The response is constrained to a pure JSON object:

```json
{
  "score": 74,
  "roast": "Your idea solves a real pain point but you're entering a market with entrenched incumbents and zero defensibility. Without a proprietary data moat, you'll be acqui-hired for pennies within 18 months.",
  "tech_stack": ["Next.js", "Supabase", "OpenAI API", "Stripe"]
}
```

`response_format: { type: "json_object" }` is enforced to guarantee parseable output every time.

---

## 📄 License

MIT — use it, fork it, ship it.

---

<div align="center">
  Built with 🔥 and a healthy dose of startup skepticism.
</div>
