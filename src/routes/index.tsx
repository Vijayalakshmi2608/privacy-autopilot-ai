import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import "../privacy-autopilot.css";
import { detectPii, redactText, type PiiEntity } from "../lib/privacy-engine";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Privacy Autopilot — On-device Visual Perception for Browser Agents" },
      {
        name: "description",
        content:
          "AI can use your browser — without seeing your secrets. Local perception, PII detection, redaction, and safe AI reasoning. SIH 2026 PS 26171 prototype.",
      },
      { property: "og:title", content: "Privacy Autopilot — Privacy-first browser agent" },
      {
        property: "og:description",
        content:
          "On-device visual perception for lightweight browser agents: the webpage is understood and redacted locally before any AI reasoning happens.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyAutopilot,
});

const PAGE_TEXT = [
  "Name: Vijay Kumar",
  "Email: vijay@example.com",
  "Phone: +91 98765 43210",
  "Password: hunter2",
  "Account Number: 1234567890",
  "Address: 42, Anna Nagar, Chennai",
  "Job Title: Software Engineer Intern",
  "Company: Example Technologies",
  "Location: Chennai",
  "Button: Apply Now",
].join("\n");

const PERCEPTION_LOGS = [
  "Capturing webpage context...",
  "Running local visual perception...",
  "Detecting sensitive information...",
  "Applying privacy protection...",
  "Preparing safe context...",
];

type StageState = "idle" | "working" | "done";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Mark({ children }: { children: string }) {
  return <span className="pii-mark">{children}</span>;
}

function PrivacyAutopilot() {
  const [task, setTask] = useState("Apply for this job and continue to the next step.");
  const [running, setRunning] = useState(false);
  const [redacted, setRedacted] = useState(false);
  const [flash, setFlash] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [logIdx, setLogIdx] = useState(-1);
  const [entities, setEntities] = useState<PiiEntity[]>([]);
  const [safeCtx, setSafeCtx] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [stages, setStages] = useState<StageState[]>(["idle", "idle", "idle", "idle"]);
  const pageRef = useRef<HTMLDivElement>(null);

  const chipStates = useMemo(() => {
    const any = (s: StageState) => stages.includes(s);
    return [
      stages[0], // perception
      stages[2], // privacy protection (detection+redaction)
      stages[3], // reasoning
      clicked ? "done" : any("working") ? "idle" : "idle",
    ] as StageState[];
  }, [stages, clicked]);

  const setStage = (i: number, s: StageState) =>
    setStages((prev) => prev.map((p, idx) => (idx === i ? s : p)));

  async function run() {
    if (running) return;
    setRunning(true);
    setRedacted(false);
    setClicked(false);
    setEntities([]);
    setSafeCtx("");
    setReasoning("");
    setStages(["idle", "idle", "idle", "idle"]);

    // Stage 1 — local perception
    setStage(0, "working");
    for (let i = 0; i < 2; i++) {
      setLogIdx(i);
      await wait(650);
    }
    setStage(0, "done");

    // Stage 2 — PII detection (local JS + DOM inspection)
    setStage(1, "working");
    setLogIdx(2);
    const domText = pageRef.current?.innerText ?? PAGE_TEXT;
    await wait(700);
    const found = detectPii(domText);
    setEntities(found);
    await wait(500);
    setStage(1, "done");

    // Stage 3 — redaction
    setStage(2, "working");
    setLogIdx(3);
    setFlash(true);
    await wait(600);
    setRedacted(true);
    setFlash(false);
    await wait(500);
    setStage(2, "done");

    // Stage 4 — safe context + AI reasoning
    setStage(3, "working");
    setLogIdx(4);
    const safe = redactText(domText, found);
    await wait(600);
    setSafeCtx(safe);
    await wait(500);
    setReasoning(
      "Task understood: the user wants to apply for the Software Engineer Intern role. The safe context shows an 'Apply Now' button and no sensitive data was shared. Reasoning on sanitized context only — clicking 'Apply Now' is the correct next action.",
    );
    await wait(900);
    setClicked(true);
    setStage(3, "done");
    setRunning(false);
  }

  const chipLabels = ["Local Perception", "Privacy Protection", "AI Reasoning", "Browser Agent"];
  const stageMeta = [
    { title: "1 · Understand Locally", badge: "Processed locally" },
    { title: "2 · Detect Sensitive Data", badge: "Detection performed locally" },
    { title: "3 · Sanitize Context", badge: "Redacted on-device" },
    { title: "4 · AI Reasoning", badge: "Safe context only" },
  ];

  return (
    <div className="pa-root">
      <header className="pa-header">
        <div className="pa-brand">
          <h1>
            Privacy <span>Autopilot</span>
          </h1>
          <p>AI Can Use Your Browser — Without Seeing Your Secrets · SIH 2026 · PS 26171</p>
        </div>
        <div className="pa-status">
          {chipLabels.map((l, i) => (
            <span key={l} className={`pa-chip ${chipStates[i] === "done" ? "done" : chipStates[i] === "working" ? "active" : ""}`}>
              <span className="dot" />
              {l}
            </span>
          ))}
        </div>
      </header>

      <div className="pa-taskbar">
        <input
          aria-label="Task for the browser agent"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          disabled={running}
        />
        <p className="hint">
          The AI needs the webpage context to complete this task — but it should never receive your sensitive information.
        </p>
      </div>

      <main className="pa-main">
        {/* LEFT — mock webpage */}
        <section className="pa-panel" aria-label="Current webpage">
          <h2>Current Webpage</h2>
          <p className="sub">Simulated page as the user sees it</p>
          <div className={`mock-page ${flash ? "mock-flash" : ""}`}>
            <div className="mock-browserbar">
              <span className="lights">
                <i style={{ background: "#ff5f57" }} />
                <i style={{ background: "#febc2e" }} />
                <i style={{ background: "#28c840" }} />
              </span>
              <span className="url">https://careers.example-tech.in/apply/software-engineer-intern</span>
            </div>
            <div className="mock-body" ref={pageRef}>
              <h3>Software Engineer Intern</h3>
              <p className="mock-meta">Example Technologies · Chennai · Internship</p>

              <div className="mock-section">
                <h4>Your Profile</h4>
                <div className="mock-row"><span className="k">Name:</span><span className="v">{redacted ? <Mark>[NAME_REDACTED]</Mark> : "Vijay Kumar"}</span></div>
                <div className="mock-row"><span className="k">Email:</span><span className="v">{redacted ? <Mark>[EMAIL_REDACTED]</Mark> : "vijay@example.com"}</span></div>
                <div className="mock-row"><span className="k">Phone:</span><span className="v">{redacted ? <Mark>[PHONE_REDACTED]</Mark> : "+91 98765 43210"}</span></div>
                <div className="mock-row"><span className="k">Password:</span><span className="v">{redacted ? <Mark>[PASSWORD_REDACTED]</Mark> : "hunter2"}</span></div>
                <div className="mock-row"><span className="k">Account Number:</span><span className="v">{redacted ? <Mark>[ACCOUNT_REDACTED]</Mark> : "1234567890"}</span></div>
                <div className="mock-row"><span className="k">Address:</span><span className="v">{redacted ? <Mark>[ADDRESS_REDACTED]</Mark> : "42, Anna Nagar, Chennai"}</span></div>
              </div>

              <div className="mock-section">
                <h4>Job Details</h4>
                <div className="mock-row"><span className="k">Job Title:</span><span className="v">Software Engineer Intern</span></div>
                <div className="mock-row"><span className="k">Company:</span><span className="v">Example Technologies</span></div>
                <div className="mock-row"><span className="k">Location:</span><span className="v">Chennai</span></div>
              </div>

              <div className="mock-actions">
                <button type="button" className={`mock-btn primary ${clicked ? "clicked" : ""}`}>Apply Now</button>
                <button type="button" className="mock-btn ghost">Save for Later</button>
                <button type="button" className="mock-btn ghost">Next</button>
              </div>

              {clicked && (
                <div className="mock-banner">
                  Application started — the agent clicked “Apply Now” using only the sanitized context.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT — pipeline */}
        <section className="pa-panel" aria-label="Privacy Autopilot pipeline">
          <h2>Privacy Autopilot</h2>
          <p className="sub">On-device perception → redaction → safe AI reasoning → browser action</p>

          {stageMeta.map((s, i) => (
            <div key={s.title} className={`pa-stage ${stages[i]}`}>
              <h3>
                {s.title}
                <span className={`badge ${stages[i] === "idle" ? "idle" : stages[i] === "working" ? "working" : ""}`}>
                  {stages[i] === "working" ? "Working…" : stages[i] === "done" ? s.badge : "Waiting"}
                </span>
              </h3>

              {i === 0 && (
                <p className="pa-log">
                  {logIdx >= 0 ? PERCEPTION_LOGS[Math.min(logIdx, PERCEPTION_LOGS.length - 1)] : ""}
                  {stages[0] === "done" && <span className="ok">  ✓ Processed locally</span>}
                </p>
              )}

              {i === 1 && stages[1] !== "idle" && (
                <>
                  {entities.length > 0 && (
                    <table className="pa-detect" aria-label="Sensitive data detected">
                      <tbody>
                        {["Email", "Phone", "Password", "Account No.", "Name", "Address"]
                          .filter((label) => entities.some((e) => e.label === label))
                          .map((label) => {
                            const e = entities.find((x) => x.label === label)!;
                            return (
                              <tr key={label}>
                                <td>{label}</td>
                                <td className="check">✓</td>
                                <td>{e.confidence}%</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  )}
                  <p className="pa-note">Demo confidence values · Detection performed locally</p>
                </>
              )}

              {i === 2 && stages[2] === "done" && (
                <p className="pa-log">
                  <span className="ok">✓ {entities.length} sensitive fields replaced with tokens on-device</span>
                </p>
              )}

              {i === 3 && stages[3] !== "idle" && (
                <>
                  {safeCtx && (
                    <div className="pa-safe" aria-label="Safe context sent to AI">
                      {safeCtx.split(/(\[[A-Z_]+_REDACTED\])/g).map((part, idx) =>
                        part.startsWith("[") ? <span key={idx} className="pa-token">{part}</span> : part,
                      )}
                    </div>
                  )}
                  {reasoning && <div className="pa-reason">{reasoning}</div>}
                  {clicked && <p className="pa-actionline">→ Browser action executed: click “Apply Now”</p>}
                </>
              )}
            </div>
          ))}

          <button type="button" className="pa-run" onClick={run} disabled={running}>
            {running ? "Running…" : "Run Privacy Autopilot"}
          </button>
        </section>
      </main>
    </div>
  );
}
