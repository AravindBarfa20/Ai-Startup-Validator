"use client";

import { useState } from "react";

interface Competitor { name: string; note: string; }

interface ValidationResult {
  score: number;
  verdict: string;
  roast: string;
  strengths: string[];
  tech_stack: string[];
  upgrades: string[];
  competitors: Competitor[];
  market_size: string;
  go_to_market: string;
  monetization: string;
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width="144" height="144" viewBox="0 0 144 144"
      style={{ filter: `drop-shadow(0 0 18px ${color}66)`, flexShrink: 0 }}>
      <circle cx="72" cy="72" r={r} fill="none" stroke="rgba(40,18,5,0.9)" strokeWidth="12" />
      <circle cx="72" cy="72" r={r} fill="none"
        stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        transform="rotate(-90 72 72)"
        style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1), stroke 0.5s" }} />
      <text x="72" y="66" textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="32" fontWeight="900" fontFamily="inherit">{score}</text>
      <text x="72" y="86" textAnchor="middle" dominantBaseline="middle"
        fill="rgba(120,60,20,0.7)" fontSize="12" fontFamily="inherit">/ 100</text>
    </svg>
  );
}

const PILL_COLORS = ["#ffaa66", "#ffaaaa", "#ffe680", "#80e8ff"];
const PILL_CLASSES = ["tp-0", "tp-1", "tp-2", "tp-3"];

function getScoreColor(score: number) {
  return score > 70 ? "#00e5a0" : score > 40 ? "#ffb700" : "#ff3d3d";
}
function getVerdictClass(verdict: string) {
  if (!verdict) return "";
  const v = verdict.toLowerCase();
  if (v.includes("build")) return "verdict-build";
  if (v.includes("pivot")) return "verdict-pivot";
  return "verdict-dead";
}
function getVerdictEmoji(verdict: string) {
  if (!verdict) return "";
  const v = verdict.toLowerCase();
  if (v.includes("build")) return "🚀";
  if (v.includes("pivot")) return "🔄";
  return "💀";
}

export default function Home() {
  const [idea, setIdea]     = useState("");
  const [loading, setLoad]  = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError]   = useState<string | null>(null);

  async function validate() {
    if (!idea.trim()) return;
    setLoad(true); setResult(null); setError(null);
    try {
      const res  = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Something went wrong.");
      setResult(data as ValidationResult);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unexpected error.");
    } finally {
      setLoad(false);
    }
  }

  const scoreColor = result ? getScoreColor(result.score) : "#ff6b00";

  return (
    <>
      {/* Background */}
      <div className="bg-wrap">
        <div className="bg-glow" />
        <div className="bg-grid" />
        <div className="bg-orb-l" />
        <div className="bg-orb-r" />
        <div className="bg-orb-b" />
      </div>

      <main className="page">
        {/* Badge */}
        <div className="badge">
          <span className="badge-dot" />
          AI Investor · Startup Validator
        </div>

        {/* Hero */}
        <h1 className="hero-title">PitchPerfect AI</h1>
        <p className="hero-sub">
          Get your startup idea <em>roasted, scored &amp; fully analyzed</em> by a ruthless AI investor.
          Market size, competitors, upgrades — the full picture.
        </p>

        {/* Input Card */}
        <div className="glass-card input-card" style={{ width: "100%" }}>
          <label className="input-label" htmlFor="startup-idea">
            💡 Describe Your Startup Idea
          </label>
          <textarea
            id="startup-idea"
            className="input-textarea"
            placeholder="e.g. An AI-powered platform that helps solo founders validate their ideas, find co-founders, and automate their early-stage GTM strategy..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            maxLength={800}
            disabled={loading}
          />
          <div className="input-meta">{idea.length} / 800</div>
          <button id="validate-btn" className="btn" onClick={validate} disabled={loading || !idea.trim()}>
            {loading
              ? <><span className="spinner" /> Consulting the investor…</>
              : <>🔥 Validate My Idea</>}
          </button>
          {error && <div className="error-box" role="alert">⚠️ {error}</div>}
        </div>

        {/* Results */}
        {result && (
          <div className="results" role="region" aria-label="Validation Results">

            {/* Score + Verdict */}
            <div className="glass-card result-card">
              <div className="section-label">Investor Score</div>
              <div className="verdict-badge" style={{ marginBottom: 20 }}>
                <span className={`verdict-badge ${getVerdictClass(result.verdict)}`}>
                  {getVerdictEmoji(result.verdict)} {result.verdict || "ANALYZING"}
                </span>
              </div>
              <div className="score-layout">
                <div className="score-ring-wrap">
                  <ScoreRing score={result.score} color={scoreColor} />
                </div>
                <div className="score-info">
                  <div className="score-heading" style={{ color: scoreColor }}>
                    {result.score > 70 ? "Worth a Second Look"
                      : result.score > 40 ? "Needs More Thinking"
                      : "Back to the Drawing Board"}
                  </div>
                  <p className="score-desc">
                    {result.score > 70
                      ? "Your idea shows genuine promise. There's a real market here. Sharpen the GTM and unit economics."
                      : result.score > 40
                      ? "There's a kernel of something interesting, but fundamental pivots are needed before this is investable."
                      : "This idea has critical flaws in the core assumptions. Rethink before spending a single dollar."}
                  </p>
                  <div className="score-bar-bg">
                    <div className="score-bar-fill"
                      style={{ width: `${result.score}%`, background: scoreColor, boxShadow: `0 0 12px ${scoreColor}` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <div className="glass-card result-card">
                <div className="section-label">✅ What You Got Right</div>
                <div className="strengths-list">
                  {result.strengths.map((s, i) => (
                    <div key={i} className="strength-item">
                      <span className="strength-icon">✓</span>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Roast */}
            <div className="glass-card result-card">
              <div className="section-label">The Roast</div>
              <span className="roast-emoji">🔥</span>
              <blockquote className="roast-quote">{result.roast}</blockquote>
            </div>

            {/* Upgrades */}
            {result.upgrades?.length > 0 && (
              <div className="glass-card result-card">
                <div className="section-label">⚡ Key Upgrades to Boost Your Score</div>
                <div className="upgrades-list">
                  {result.upgrades.map((u, i) => (
                    <div key={i} className="upgrade-item">
                      <span className="upgrade-num">{i + 1}</span>
                      {u}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competitors */}
            {result.competitors?.length > 0 && (
              <div className="glass-card result-card">
                <div className="section-label">🏆 You&apos;re Up Against</div>
                <div className="competitors-grid">
                  {result.competitors.map((c, i) => (
                    <div key={i} className="competitor-item">
                      <span className="competitor-icon">⚔️</span>
                      <div>
                        <div className="competitor-name">{c.name}</div>
                        <div className="competitor-note">{c.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Market + GTM */}
            <div className="two-col">
              {result.market_size && (
                <div className="glass-card info-block">
                  <span className="info-icon">📈</span>
                  <div className="info-title">Market Opportunity</div>
                  <div className="info-value market-size">{result.market_size}</div>
                </div>
              )}
              {result.monetization && (
                <div className="glass-card info-block">
                  <span className="info-icon">💰</span>
                  <div className="info-title">Monetization Model</div>
                  <div className="info-value">{result.monetization}</div>
                </div>
              )}
            </div>

            {result.go_to_market && (
              <div className="glass-card result-card">
                <div className="section-label">🎯 Go-To-Market Strategy</div>
                <p style={{ fontSize: 14.5, color: "#e8c4a0", lineHeight: 1.75 }}>
                  {result.go_to_market}
                </p>
              </div>
            )}

            {/* Tech Stack */}
            <div className="glass-card result-card">
              <div className="section-label">🛠 Recommended MVP Stack</div>
              <div className="tech-grid">
                {result.tech_stack.map((tech, i) => (
                  <span key={i} className={`tech-pill ${PILL_CLASSES[i % 4]}`}>
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: PILL_COLORS[i % 4],
                      display: "inline-block", flexShrink: 0,
                      boxShadow: `0 0 8px ${PILL_COLORS[i % 4]}`,
                    }} />
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        <footer className="footer">
          Built with Next.js &amp; Groq · Powered by LLaMA 3.3 70B
        </footer>
      </main>
    </>
  );
}
