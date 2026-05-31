## Summary

<!-- A concise description of WHAT this PR does and WHY. One paragraph max.
     Bad: "Fixed stuff"
     Good: "Adds the npx gatebreaker install command which copies gatebreaker.skill/ into the user's .claude/skills/ directory, resolving #42" -->


## Type of Change

<!-- Check all that apply -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that changes existing behavior)
- [ ] 🧙 New expert persona added to the Pantheon
- [ ] 🗺️ New career track added
- [ ] 🌐 New LLM provider added
- [ ] 📖 Documentation update
- [ ] 🔒 Security fix
- [ ] 🧹 Refactor / code cleanup (no behavior change)
- [ ] ⚙️ CI/CD or tooling change

## Related Issues

<!-- Link any related issues. Use "Closes #X" to auto-close on merge. -->

Closes #

## Changes Made

<!-- List the specific files and what changed in each. -->

| File | Change |
|------|--------|
| `bin/cli.js` | |
| `bin/mock_responses.js` | |
| `bin/html_generator.js` | |
| Other: | |

## Testing Done

<!-- Describe exactly how you tested your changes. Include commands run and output observed. -->

```bash
# Commands I ran to test:
node bin/cli.js
node bin/cli.js compare
node bin/cli.js roadmap
```

**Test results:**
- [ ] `node bin/cli.js` — main diagnostic flow works end-to-end
- [ ] `node bin/cli.js compare` — expert comparison renders correctly
- [ ] `node bin/cli.js roadmap` — HTML roadmap generates and opens correctly
- [ ] No regressions in existing commands

## Screenshots / Terminal Output

<!-- If applicable, paste terminal output or add screenshots here. 
     Text output is strongly preferred over images. -->

<details>
<summary>Terminal output</summary>

```
<!-- paste output here -->
```

</details>

## Expert Persona Checklist (if applicable)

<!-- Skip this section if this PR does not add a new expert persona -->

- [ ] Expert is a real, documented cybersecurity professional/researcher
- [ ] All three archetype responses are included (cert_collector, experience_gap, impostor)
- [ ] A real, attributable quote is included with a source reference
- [ ] Expert is added to the README Expert Pantheon section
- [ ] Response tone is consistent with the expert's documented philosophy

## Breaking Changes

<!-- If this is a breaking change, describe what breaks and how users should migrate. -->

None / Description: 

## Checklist

- [ ] My code follows the project's commit style (Conventional Commits)
- [ ] I have read the [CONTRIBUTING.md](./CONTRIBUTING.md) guide
- [ ] I have tested all three main CLI commands locally (`start`, `compare`, `roadmap`)
- [ ] I have updated the README if I added or changed a command
- [ ] I have not included API keys, `.env` files, or generated output files in this PR
- [ ] This PR targets the `main` branch
