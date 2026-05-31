# Cybersec Career Coach

<p align="center">
  <img src="https://img.shields.io/badge/Open--Source-MIT-blue?style=for-the-badge&logo=github" alt="MIT License" />
  <img src="https://img.shields.io/badge/Model-Claude%20%7C%20GPT--4%20%7C%20Gemini-orange?style=for-the-badge&logo=anthropic" alt="Model Compatibility" />
  <img src="https://img.shields.io/badge/Ready%20to%20Paste-System%20Prompt-success?style=for-the-badge&logo=markdown" alt="Ready to Paste" />
</p>

---

## The God-Tier Cybersecurity Career Advisor

The **Cybersec Career Coach** is a brutally honest, deeply analytical, and structured career advisor designed to guide you through every stage of your cybersecurity journey. 

Unlike generic career guides, the Coach operates like a **security incident investigation**: it gathers all evidence, forms diagnostic hypotheses, runs gap analyses across 8 core dimensions, and prescribes specific, actionable, and time-bound remediation plans.

> [!IMPORTANT]
> **Radical Honesty is the Core Doctrine.** The Coach does not sugarcoat the reality of the cybersecurity job market. It tells you exactly where you are, what is actually holding you back, and exactly what to do next.

---

## What's Inside This Repository

This repository contains two options to suit your setup:

### 1. Consolidated System Prompt (`cybersec-career-coach.md`)
A single, massive (~14,000 token) ready-to-paste system prompt. It consolidates all experts, frameworks, roadmaps, and benchmarks into one file. Paste it directly into **Claude Projects**, **ChatGPT Custom GPTs**, **Google Gemini System Instructions**, or your custom API wrappers.

### 2. Modular Agentic Skill (`cybersec-career-coach.skill/`)
A fully-featured custom skill folder designed for developer agents (like Antigravity or Claude Code). It contains modular reference guides covering specific domains:
- **Career Phases & Transition Gates**: Step-by-step progressions from Phase 0 (Bedrock) to Phase 6 (C-Suite).
- **Certification & Home Lab Blueprints**: The exact order of certifications to take (and which ones to avoid), plus step-by-step setup guides for Wazuh, Active Directory, and Malware Sandbox labs.
- **Job Search & Resume Optimization**: Booleans, templates, cold outreach sequences, and platform recommendations.
- **The Expert Pantheon**: Pre-coded parameters to channel the specific philosophies of 40+ legends (including Bruce Schneier, Kevin Mitnick, Alan Turing, Dmitri Alperovitch, and more).

---

## Quick Start Guide (Via npx CLI)

The easiest way to use the Coach, copy the system prompt, or install the skill is by using our **npx CLI tool**:

### 1. Run the Interactive Intake & Diagnostic
Start an interactive terminal session that guides you through the Intake Questionnaire and generates a career diagnostic report utilizing LLMs (Gemini or Claude):
```bash
npx cybersec-career-coach
```

#### CLI Options:
*   **Select LLM Provider**: Override auto-detection and specify which AI provider/model to run the diagnostic on:
    ```bash
    # Force Google Gemini API (Free tier available)
    npx cybersec-career-coach --gemini
    
    # Force Anthropic Claude API
    npx cybersec-career-coach --anthropic
    
    # Force OpenAI GPT API
    npx cybersec-career-coach --openai

    # Force Groq API (High-speed free developer tier)
    npx cybersec-career-coach --groq

    # Force OpenRouter API (Supports free LLM models)
    npx cybersec-career-coach --openrouter

    # Force DeepSeek API (China / High-efficiency)
    npx cybersec-career-coach --deepseek

    # Force Mistral AI API (Europe)
    npx cybersec-career-coach --mistral

    # Force Cohere API (Europe)
    npx cybersec-career-coach --cohere

    # Force Krutrim AI API (India)
    npx cybersec-career-coach --krutrim

    # Force Sarvam AI API (India)
    npx cybersec-career-coach --sarvam

    # Force Zhipu GLM API (China)
    npx cybersec-career-coach --zhipu

    # Force Alibaba Qwen API (China)
    npx cybersec-career-coach --qwen

    # Force Local Ollama endpoint (100% local and free)
    npx cybersec-career-coach --ollama
    ```
*   **Direct File Output**: Directly write the generated report to a Markdown file without interactive confirmation prompts:
    ```bash
    npx cybersec-career-coach --output=my-diagnostics.md
    ```

### Run the Diagnostic in Caveman Mode
Run the same diagnostic questionnaire, but prompt the Coach to answer in a brutally honest, primitive "caveman" style:
```bash
npx cybersec-career-coach caveman
```

### 2. Generate an Interactive Visual Roadmap & Lab Checklist
Generate a highly polished, interactive local HTML/SVG roadmap and hands-on lab checklist based on your career profile:
```bash
npx cybersec-career-coach roadmap
```
*   Determines your security track (**Offensive**, **Defensive**, or **GRC**) based on your target role.
*   Outputs a beautiful, customized `cybersec-career-coach-roadmap.html` file.
*   Includes built-in browser `localStorage` integration to automatically save checked lab items when you reload the page.
*   Specify a custom output path using the `--output` or `-o` flag:
    ```bash
    npx cybersec-career-coach roadmap --output=my-visual-roadmap.html
    ```

### 3. Copy the System Prompt to Clipboard
Copy the complete, ready-to-paste system prompt directly to your clipboard:
```bash
npx cybersec-career-coach copy
```
*Then paste it directly as a System Prompt into Claude Projects, ChatGPT Custom GPTs, or Google AI Studio.*

### 3. Integrate as a Universal AI Skill
Make this career coach context available inside your favorite AI environment:

*   **Cursor IDE**: Copy `.cursorrules` to the root of your workspace.
*   **Windsurf IDE**: Copy `.windsurfrules` to the root of your workspace.
*   **Roo Code / Cline**: Copy `.clinerules` to the root of your workspace.
*   **VS Code GitHub Copilot**: Copy `.github/copilot-instructions.md` to your workspace.
*   **Sourcegraph Cody**: Copy `.codyrules` to the root of your workspace.
*   **PearAI**: Copy `.pearai-rules` to the root of your workspace.
*   **Claude Code & Google Antigravity**:
    *   Local workspace installation:
        ```bash
        npx cybersec-career-coach install
        ```
    *   Global user installation:
        ```bash
        npx cybersec-career-coach install --global
        ```
*   **ChatGPT Custom GPTs / Claude.ai Projects / Gemini System Instructions**: Run `npx cybersec-career-coach copy` to copy the system prompt, and paste it into the system instructions field of your AI agent.

---

## Command Reference

Once the prompt is active, you can trigger specific diagnostics using these shorthand commands:

| Command | Output |
| :--- | :--- |
| `diagnose me` | Runs the full past/present/future career diagnostic with gap analysis. |
| `gap analysis` | Assesses your profile across all 8 dimensions of Gaps. |
| `honest review [resume/profile text]` | Delivers a brutally honest critique of your CV/LinkedIn with specific fixes. |
| `what's missing [target role]` | Compares your current skills against the target role requirements. |
| `roadmap [goal]` | Designs the fastest effective path (not the comfortable one) to your goal. |
| `phase [0-6]` | Details a career phase's cognitive shifts, frameworks, and expert mentors. |
| `cert path [domain]` | Shows the optimal certification sequence and vendor recommendations. |
| `interview prep [role]` | Simulates a technical/behavioral interview with hard-hitting questions. |
| `jd decode [paste JD]` | Decodes a job description—revealing what they actually want vs. what they wrote. |
| `outreach [company/role]` | Generates high-converting cold outreach messages for recruiters or CISOs. |

---

## The 8-Dimension Gap Analysis Framework

The Coach evaluates your profile across 8 distinct dimensions:
1. **Knowledge Gaps**: Theoretical concepts required for the target role.
2. **Skill Gaps**: Practical tasks you can do independently (not just describe).
3. **Tool Gaps**: Hands-on experience with SIEMs, EDRs, hypervisors, etc.
4. **Certification Gaps**: Aligning credentials with target requirements.
5. **Portfolio Gaps**: Verifiable proof (GitHub repos, CTFs, lab write-ups).
6. **Network Gaps**: Professional community presence and referral access.
7. **Mindset Gaps**: Thinking patterns (e.g., defender vs. adversary).
8. **Communication Gaps**: Explaining technical risks in terms of business impact.

---

## The Expert Pantheon

The Coach channels specific mentors based on your diagnosis:

*   **Sun Tzu** (Red Team Strategy & Deception)
*   **Bruce Schneier** (Process Realism & Schneier's Law)
*   **Kevin Mitnick** (Social Engineering & Human Factors)
*   **Dmitri Alperovitch** (CTI & Geopolitical Threat Intelligence)
*   **Alan Turing** (Digital Forensic Logic & Hypothesis Elimination)
*   **Dr. Eric Cole** (C-Suite Translation & Cyber Risk Dollars)
*   **Lenny Zeltser** (REMnux & Triage-First Malware Analysis)
*   **Katie Nickels** (MITRE ATT&CK & Intelligence-Driven Defense)
*   **Naomi Buckwalter** (Hiring Reform & Entry-Level Job Seekers)
*   **Graham Cluley** (Threat Communications & Public Security Education)

---

## Repository Structure

```
.
├── cybersec-career-coach.md        # Consolidated ready-to-paste system prompt
├── LICENSE                         # MIT License
├── README.md                       # Documentation and usage guide
└── cybersec-career-coach.skill/     # Custom modular agentic skill folder
    ├── SKILL.md                    # Core skill configuration
    └── references/                 # 19 specialized markdown reference sheets
```

---

## Credits

*   **Creator**: Raghav Gupta ([@cyberhavox](https://github.com/cyberhavox))
    *   Founder, BSides Faridabad
*   **Socials**: [LinkedIn](https://linkedin.com/in/cyberhavox) | [GitHub](https://github.com/cyberhavox)

---

## License

This project is licensed under the MIT License - see the [LICENSE](file:///d:/PORTFOLIO/CHS/LICENSE) file for details.
