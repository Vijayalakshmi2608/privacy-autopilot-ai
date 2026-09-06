# Privacy Pilot

Webpage → Local visual understanding → PII detection → Local redaction → Safe context → AI reasoning → Browser action

Copy-paste prompt for Lovable / AI coding tool
Build a working MVP prototype called "Privacy Autopilot" for Smart India Hackathon 2026 Problem Statement 26171:

"On-device Visual Perception for Light-weight Browser Agents"

TAGLINE:
"AI Can Use Your Browser — Without Seeing Your Secrets"

IMPORTANT:
This is a functional hackathon prototype, not just a UI mockup.
Prioritize the core working flow over advanced features.

TECH STACK:
- React + Vite + TypeScript
- Plain CSS, NOT Tailwind
- Browser-compatible JavaScript
- Use local/mock AI processing where a real model is not practical
- Keep the architecture ready for ONNX Runtime Web / Transformers.js later
- No paid APIs
- No authentication
- No database required

CORE DEMO SCENARIO:

Create a simulated webpage containing:
- Name
- Email
- Phone number
- Address
- Password field
- Bank/account-like information
- Normal task-relevant content
- Buttons such as "Apply", "Submit", "Continue", "Next"

The user enters a task:

"Apply for this job and continue to the next step."

The system must demonstrate that the AI needs the webpage context but does NOT need to receive the user's sensitive information.

==================================================
1. MAIN DASHBOARD
==================================================

Create a professional dashboard with:

Header:
Privacy Autopilot
"Privacy-first browser agent"

Status indicators:
● Local Perception
● Privacy Protection
● AI Reasoning
● Browser Agent

Main layout:

LEFT:
"Current Webpage"

Show a realistic mock webpage.

Include visible sensitive information such as:
Name: Vijay Kumar
Email: vijay@example.com
Phone: +91 98765 43210
Password: ****
Account Number: 1234567890

Also include normal information:
Job Title: Software Engineer Intern
Company: Example Technologies
Location: Chennai
Button: Apply Now

RIGHT:
"Privacy Autopilot"

Show four processing stages:

1. UNDERSTAND LOCALLY
2. DETECT SENSITIVE DATA
3. SANITIZE CONTEXT
4. AI REASONING

Add a large button:

"Run Privacy Autopilot"

==================================================
2. LOCAL PERCEPTION
==================================================

When "Run Privacy Autopilot" is clicked:

Show an animation/progress sequence:

Step 1:
"Capturing webpage context..."

Step 2:
"Running local visual perception..."

Step 3:
"Detecting sensitive information..."

Step 4:
"Applying privacy protection..."

Step 5:
"Preparing safe context..."

Do NOT claim that a large cloud AI model is performing this step.

Clearly display:

"Processed locally"

==================================================
3. PII DETECTION
==================================================

Create a privacy detection engine for the demo.

Detect examples of:

- Email addresses
- Phone numbers
- Password fields
- Account numbers
- Personal names
- Addresses

Use simple local JavaScript pattern detection and DOM inspection for the MVP.

Display a panel:

"Sensitive Data Detected"

Email       ✓
Phone       ✓
Password    ✓
Account No. ✓
Name        ✓

Show:

"Detection performed locally"

Also display a simple confidence value for each detected item.

Example:

Email       98%
Phone       96%
Password    100%
Account No. 94%

These are DEMO confidence values only.
Label them as "Demo confidence".

==================================================
4. PRIVACY REDACTION
==================================================

After detection, visually redact the sensitive information.

Example:

Before:

Name: Vijay Kumar
Email: vijay@example.com
Phone: +91 98765 43210
Password: ****…\

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://privacy-autopilot-ai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3f0366b5-8031-4e14-9443-43ba2939d914).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
