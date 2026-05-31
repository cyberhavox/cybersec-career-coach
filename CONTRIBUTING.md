# Contributing to Gatebreaker

Thank you for your interest in contributing to **Gatebreaker** — the god-tier cybersecurity career diagnostic CLI. Every contribution, from a typo fix to a new expert persona, makes this tool more powerful for the community.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Commit Style](#commit-style)
- [Pull Request Process](#pull-request-process)
- [Adding Expert Personas](#adding-expert-personas)
- [Reporting Bugs](#reporting-bugs)

---

## Code of Conduct

By contributing, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before participating.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/gatebreaker.git
   cd gatebreaker
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Test your local build:**
   ```bash
   node bin/cli.js
   ```

---

## Ways to Contribute

| Type | Description |
|------|-------------|
| 🐛 **Bug Fix** | Fix broken logic, incorrect outputs, or CLI crashes |
| ✨ **Feature** | Add new commands, LLM providers, or analysis dimensions |
| 📖 **Docs** | Improve README, add examples, fix typos |
| 🧙 **Expert Persona** | Add a new industry legend to the Expert Pantheon |
| 🗺️ **Roadmap Track** | Add a new career track (e.g. Cloud Security, Bug Bounty) |
| 🌐 **LLM Provider** | Add support for a new API provider |
| 🔒 **Security** | Responsible disclosure — see [SECURITY.md](./SECURITY.md) |

---

## Development Setup

### Prerequisites

- **Node.js** v18+ (LTS recommended)
- **npm** v9+
- An API key for at least one supported LLM (optional for mock mode)

### Project Structure

```
gatebreaker/
├── bin/
│   ├── cli.js              # Main CLI entry point & command router
│   ├── html_generator.js   # Visual HTML/SVG roadmap generator
│   └── mock_responses.js   # Expert persona response library
├── gatebreaker.skill/      # Agentic AI skill definition
│   ├── SKILL.md            # Skill instructions
│   └── references/         # Knowledge base documents
├── index.html              # Landing page
├── styles.css              # Landing page styles
├── package.json
└── README.md
```

### Running Locally

```bash
# Interactive diagnostic (uses mock mode without API key)
node bin/cli.js

# Expert comparison dashboard
node bin/cli.js compare

# Visual roadmap generator
node bin/cli.js roadmap

# Install as a global alias for testing
npm link
gatebreaker
```

---

## Commit Style

We follow **Conventional Commits**:

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

### Types

| Type | Use For |
|------|---------|
| `feat` | New feature or command |
| `fix` | Bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, no logic change |
| `refactor` | Code change without feature/fix |
| `perf` | Performance improvement |
| `chore` | Build process, dependency updates |
| `security` | Security-related changes |

### Examples

```
feat(cli): add npx gatebreaker install command for global skill setup
fix(html_generator): correct localStorage key collision on roadmap save
docs(readme): add LLM provider configuration table
chore(deps): bump node engine requirement to >=18
```

---

## Pull Request Process

1. **Branch** from `main` with a descriptive name:
   ```bash
   git checkout -b feat/new-expert-persona-andy-ellis
   ```

2. **Make your changes** — keep commits atomic and focused.

3. **Test thoroughly:**
   ```bash
   node bin/cli.js          # Smoke test the main flow
   node bin/cli.js compare  # Test expert comparison
   node bin/cli.js roadmap  # Test roadmap generation
   ```

4. **Update relevant docs** — if you add a command, update `README.md`.

5. **Open a Pull Request** using the [PR template](./.github/PULL_REQUEST_TEMPLATE.md). Fill in every section — PRs with empty templates will not be reviewed.

6. **Respond to review comments** within 7 days. Stale PRs (30+ days with no activity) will be closed.

> **Note:** By submitting a PR, you agree that your contribution will be licensed under the project's [MIT License](./LICENSE).

---

## Adding Expert Personas

Gatebreaker's Expert Pantheon (`bin/mock_responses.js`) is the most impactful place to contribute.

### Criteria for a New Expert

- Must be a **real, recognized cybersecurity professional, author, or researcher**
- Must have a **distinctive and documentable philosophy** (books, talks, papers, blog posts)
- Should represent an **underserved perspective** not already covered (e.g., privacy, ICS/OT, threat intel)

### Required Fields

```javascript
{
  name: "Expert Full Name",
  role: "Their Primary Role / Title",
  philosophy: "One-sentence core philosophy",
  diagnostic_style: "How they approach career assessment",
  advice: {
    cert_collector: "Advice for the Cert Collector archetype...",
    experience_gap: "Advice for the Experience Gap archetype...",
    impostor: "Advice for the Impostor Syndrome archetype..."
  },
  quote: "A real, attributable quote from this person"
}
```

### Process

1. Research the expert thoroughly using primary sources
2. Add their entry to `bin/mock_responses.js`
3. Test all three archetype responses for tone consistency
4. Add them to the Expert Pantheon section in `README.md`
5. Submit a PR with the prefix `feat(experts):`

---

## Reporting Bugs

Please use the [Bug Report issue template](./.github/ISSUE_TEMPLATE/bug_report.md). Include:

- Exact command that triggered the bug (`npx gatebreaker compare`, etc.)
- Node.js version (`node --version`)
- OS and terminal (PowerShell, bash, zsh, etc.)
- Full error output (copy-paste, not screenshot)
- Whether you have an LLM API key configured

---

## Questions?

Open a [GitHub Discussion](https://github.com/cyberhavox/gatebreaker/discussions) — not an issue — for general questions, ideas, and feedback.

Thank you for making Gatebreaker better. 🔐
