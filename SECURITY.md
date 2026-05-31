# Security Policy

## Supported Versions

The following versions of Gatebreaker are currently receiving security updates:

| Version | Supported |
|---------|-----------|
| 1.1.x   | ✅ Active support |
| 1.0.x   | ✅ Critical fixes only |
| < 1.0   | ❌ No longer supported |

---

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

We take the security of Gatebreaker seriously. If you believe you have found a security vulnerability, please report it responsibly through one of the following channels:

### Option 1: GitHub Private Security Advisory (Preferred)

Use GitHub's built-in private disclosure mechanism:

👉 [**Open a Security Advisory**](https://github.com/cyberhavox/gatebreaker/security/advisories/new)

This is fully encrypted and only visible to maintainers.

### Option 2: Direct Contact

Reach out directly to the maintainers via GitHub:

- [@cyberhavox](https://github.com/cyberhavox)
- [@cyberfascinate](https://github.com/cyberfascinate)

---

## What to Include in Your Report

To help us triage and respond quickly, please include:

- **Description** — A clear summary of the vulnerability
- **Affected versions** — Which version(s) are impacted
- **Reproduction steps** — Exact commands or input to reproduce the issue
- **Impact assessment** — What an attacker could achieve by exploiting this
- **Suggested fix** (optional) — If you have a proposed remediation

---

## Vulnerability Scope

### In Scope

| Area | Description |
|------|-------------|
| **CLI input handling** | Command injection via malicious `--target` or other flags |
| **API key exposure** | Any path where API keys could be logged, leaked, or exfiltrated |
| **Dependency vulnerabilities** | Known CVEs in production npm dependencies |
| **HTML output injection** | XSS or code injection in generated HTML reports/roadmaps |
| **Arbitrary file write** | Any bug allowing the CLI to write files outside the expected output path |

### Out of Scope

| Area | Reason |
|------|--------|
| Third-party LLM API security | Not within our control |
| Social engineering attacks | Not a technical vulnerability |
| Issues in unsupported versions | Use a supported version |
| Issues requiring physical device access | Out of threat model |
| Theoretical vulnerabilities with no PoC | Needs demonstrated impact |

---

## Response Timeline

| Milestone | Target |
|-----------|--------|
| Initial acknowledgment | Within **48 hours** |
| Severity assessment | Within **5 business days** |
| Patch for Critical/High | Within **14 days** |
| Patch for Medium | Within **30 days** |
| Patch for Low | Next scheduled release |
| Public disclosure | After patch is released |

We follow a **coordinated disclosure** model. We ask that you give us a reasonable window to fix and release a patch before public disclosure.

---

## Security Best Practices for Users

### API Key Management

- **Never** hardcode API keys in scripts or commit them to version control
- Use environment variables: `export GEMINI_API_KEY=your_key_here`
- Add `.env` to your `.gitignore` if using a dotenv file
- Rotate keys if you suspect exposure

### Generated Output Files

- Gatebreaker generates HTML reports and roadmaps locally — treat them as **sensitive documents** if they contain your career profile
- Do not upload generated diagnostic reports to public cloud storage
- Generated files are saved to your local working directory, never transmitted externally (unless you use a live LLM API, in which case your prompt data is sent to that provider)

### Dependency Auditing

```bash
# Regularly check for known vulnerabilities
npm audit

# Auto-fix non-breaking issues
npm audit fix
```

---

## Acknowledgments

We are grateful to security researchers who responsibly disclose vulnerabilities. Significant findings will be acknowledged in the release notes of the patched version (with your permission).

---

## Attribution

This security policy is informed by:
- [NIST SP 800-61 Rev. 2](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final) — Computer Security Incident Handling Guide
- [GitHub's Security Advisory Best Practices](https://docs.github.com/en/code-security/security-advisories)
- [OWASP Vulnerability Disclosure Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html)
