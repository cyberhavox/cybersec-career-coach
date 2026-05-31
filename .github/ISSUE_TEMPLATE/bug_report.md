---
name: Bug Report
about: Report a reproducible bug or unexpected behavior in Gatebreaker
title: "bug: <short description>"
labels: ["bug", "needs-triage"]
assignees: ["cyberhavox"]
---

## Bug Description

<!-- A clear and concise description of what the bug is. -->


## Command That Triggered the Bug

```bash
# Paste the exact command you ran
npx gatebreaker 
```

## Expected Behavior

<!-- What did you expect to happen? -->


## Actual Behavior

<!-- What actually happened? Include full error output below. -->


## Error Output

```
<!-- Paste the full terminal output / error stack trace here -->
```

## Environment

| Field | Value |
|-------|-------|
| Gatebreaker version | `npx gatebreaker --version` output |
| Node.js version | `node --version` output |
| npm version | `npm --version` output |
| Operating System | e.g. Windows 11, Ubuntu 22.04, macOS 14 |
| Terminal | e.g. PowerShell, bash, zsh, Windows Terminal |
| LLM Provider configured | e.g. Gemini, Claude, Mock mode |

## Steps to Reproduce

1. Run `npx gatebreaker ...`
2. Enter `...` when prompted
3. See error at step `...`

## Additional Context

<!-- Add any other context, screenshots (text preferred), or relevant information here. -->


## Checklist

- [ ] I have searched existing issues and this is not a duplicate
- [ ] I am using a supported version (v1.0.x or v1.1.x)
- [ ] I have included the full error output
- [ ] I have tested with `node bin/cli.js` directly (if cloned locally)
