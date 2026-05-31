## 📚 REFERENCE LIBRARY: PORTFOLIO-PROJECTS

# Domain-Specific Portfolio Projects — What to Actually Build

> *"A resume tells a hiring manager what you claim to know. A portfolio shows them what you can actually do. When both exist, the portfolio wins every time."*

Projects are listed per domain at three levels: **Starter** (proves you can do the basics), **Solid** (demonstrates real capability), and **Standout** (separates you from 90% of candidates). Each project includes what to build, what to document, and why it matters to a hiring manager.

---

## 🔵 SOC / BLUE TEAM PROJECTS

### Starter — Wazuh SIEM Home Lab
**What to build**: Deploy Wazuh (open-source SIEM/XDR) on a home lab or free-tier cloud VM. Ingest logs from at least 3 sources (Windows endpoint, Linux server, a web application). Write 5 custom detection rules. Generate and triage 3 realistic alert scenarios.
**What to document**: Architecture diagram, rule logic with reasoning, screenshot of dashboards, write-up of one full alert triage from detection → investigation → resolution.
**Why it matters**: Demonstrates you have actually touched a SIEM, not just read about one. Most entry-level candidates cannot do this.

### Starter — PCAP Analysis Write-Up
**What to build**: Download a real-world malicious PCAP from [Malware Traffic Analysis](https://www.malware-traffic-analysis.net). Analyze it in Wireshark. Identify the attack chain: initial access, C2 communication, exfiltration.
**What to document**: A structured incident report — what happened, timeline, indicators of compromise (IPs, domains, hashes), recommended containment.
**Why it matters**: Hiring managers love this because it shows real analytical thinking, not just tool familiarity.

### Solid — Detection Rule Library
**What to build**: Write 20+ Sigma detection rules covering MITRE ATT&CK techniques. Include at least 5 rules for common living-off-the-land techniques (LOLBins). Convert rules to at least one SIEM-specific format (Splunk SPL, Elastic EQL, or KQL).
**What to document**: GitHub repo with each rule, the ATT&CK technique it maps to, the false positive rate in your testing, and any tuning decisions made.
**Why it matters**: Detection engineering is one of the most in-demand skills in blue team. This is a direct work sample.

### Solid — Threat Hunt Report
**What to build**: Using a free dataset (BOTS v3, OTRF Security Datasets, or your own home lab logs), conduct a hypothesis-driven threat hunt. Document your hypothesis, data sources queried, analysis methodology, and findings.
**What to document**: A full threat hunt report mimicking real SOC output — executive summary, technical findings, evidence, recommended detections.
**Why it matters**: Threat hunters are chronically undersupplied. A documented hunt with a real methodology puts you in a rare category.

### Standout — MITRE ATT&CK Emulation + Detection Coverage Map
**What to build**: Use Atomic Red Team or Caldera to emulate a specific threat actor's TTPs (e.g., APT29, FIN7). Document which techniques generated detections, which did not, and why. Write recommendations to close coverage gaps.
**Why it matters**: This is work that Tier 3 analysts do. Demonstrating it as a portfolio project tells a hiring manager you are already performing above entry-level.

---

## 🔴 RED TEAM / PENETRATION TESTING PROJECTS

### Starter — TryHackMe / HackTheBox Path Completion
**What to build**: Complete the TryHackMe SOC Level 1 or Jr Penetration Tester path, OR complete 10 HackTheBox machines (mix of Easy and Medium). For each box, write a walkthrough.
**What to document**: GitHub repo of write-ups — methodology, enumeration steps, exploitation approach, what you learned from each. Write-ups must be your own words, not reposted solutions.
**Why it matters**: Documented write-ups prove you can explain your methodology — the single most important skill in a pentest interview.

### Starter — Vulnerable VM Lab + Report
**What to build**: Set up Metasploitable 3, DVWA, or VulnHub machines locally. Conduct a simulated penetration test. Write a professional pentest report.
**What to document**: The full report: executive summary, scope, methodology, findings with CVSS scores, evidence screenshots, remediation recommendations. Format it like a real deliverable to a client.
**Why it matters**: Most candidates have never written a pentest report. This alone sets you apart.

### Solid — CVE Research & Proof of Concept
**What to build**: Find a recently published CVE with available technical details. Build a proof-of-concept exploit in a controlled lab environment. Write a technical advisory.
**What to document**: GitHub repo with PoC code (clearly labeled as educational/research), CVE analysis, environment setup instructions, remediation guidance.
**Why it matters**: Demonstrates you can go from a CVE description to working exploitation — a real skill gap in most candidates.

### Solid — Active Directory Attack Lab
**What to build**: Build a Windows AD lab (2 DCs, 3 workstations minimum) on VirtualBox/VMware. Execute the full kill chain: initial access → enumeration (BloodHound) → privilege escalation → lateral movement → domain dominance. Document each stage.
**What to document**: Attack path diagram, BloodHound screenshots, each technique used with the corresponding MITRE ATT&CK ID, and recommended defensive countermeasures.
**Why it matters**: AD security is the single most common pentest scope. Every hiring manager in red team will ask you about it.

### Standout — Bug Bounty Hall of Fame Entry
**What to build**: Find and responsibly disclose a real vulnerability in a public bug bounty program (HackerOne, Bugcrowd). Even a low-severity finding is valid.
**Why it matters**: Real CVE or bug bounty credit outweighs 10 TryHackMe completions. It proves you can find vulnerabilities in real-world systems, not just CTF environments.

---

## 🟢 APPLICATION SECURITY (AppSec) PROJECTS

### Starter — DVWA Exploit Documentation
**What to build**: Set up DVWA (Damn Vulnerable Web Application). Complete all vulnerability categories at all difficulty levels. Document your approach for each.
**What to document**: Write-up for each vulnerability class: what it is, how you exploited it, the vulnerable code, and the fix.
**Why it matters**: AppSec requires you to think from both attacker and developer perspectives. DVWA coverage proves foundational web exploitation literacy.

### Starter — OWASP Top 10 Lab Series
**What to build**: Using PortSwigger Web Security Academy (free), complete all labs for the OWASP Top 10 vulnerabilities. For each category, write a one-page technical summary.
**What to document**: GitHub repo with your lab write-ups and a summary of each vulnerability class: mechanism, detection, exploitation, remediation.
**Why it matters**: PortSwigger labs are used in real BSCP exam preparation. Completing them signals a direct, high-quality skill signal.

### Solid — Secure Code Review + Vulnerability Report
**What to build**: Select an open-source application on GitHub (pick one known to have historical vulnerabilities — look at CVE records). Conduct a source code review. Find at least 3 security issues. Write a vulnerability report.
**What to document**: A professional report with: vulnerable code snippets, exploit scenario, CVSS score, remediation recommendation with example fixed code.
**Why it matters**: Secure code review is what AppSec engineers do all day. A documented code review is a direct work sample.

### Solid — Threat Model for a Real Application
**What to build**: Pick any well-known application (a public web app, an open-source project, or a fictional e-commerce app). Build a complete threat model using STRIDE or PASTA methodology. Document all threats, trust boundaries, and mitigations.
**What to document**: Data flow diagram, trust boundary analysis, threat enumeration table, risk rating matrix, mitigation recommendations.
**Why it matters**: AppSec leaders at Tier 4+ spend most of their time on threat modeling. Junior candidates who can do this are rare.

### Standout — Bug Bounty Finding (Web Focus)
**What to build**: Submit to a web-focused bug bounty program. Target IDOR, SSRF, XSS, or logic flaws — these are the most common impactful web findings.
**Why it matters**: Same as red team — a real finding is a credential no certification can replicate.

---

## 🟡 GRC / COMPLIANCE PROJECTS

### Starter — ISO 27001 Gap Assessment (Fictional Company)
**What to build**: Create a fictional company profile (e.g., a 150-person fintech with a cloud infrastructure). Conduct a full ISO 27001 gap assessment against all Annex A controls. Rate each control as Implemented / Partially Implemented / Not Implemented.
**What to document**: Gap assessment report: company profile, methodology, control-by-control assessment, risk-rated gap summary, prioritized remediation roadmap.
**Why it matters**: GRC hiring managers will often use this as a work sample request. Having one ready demonstrates genuine capability.

### Starter — Risk Register for a Realistic Scenario
**What to build**: Build a complete risk register for a realistic business scenario. Include: risk ID, description, likelihood, impact, risk rating (using a consistent matrix), risk owner, current controls, residual risk, treatment plan.
**What to document**: Excel/CSV risk register with 20+ entries, plus a one-page executive risk summary.
**Why it matters**: Risk registers are the core deliverable of GRC work. Building one from scratch proves you understand the framework, not just the terminology.

### Solid — Full Security Policy Suite
**What to build**: Write a complete set of security policies for a fictional organization: Acceptable Use Policy, Access Control Policy, Incident Response Policy, Data Classification Policy, Vendor Management Policy, BCP/DR Policy.
**What to document**: Each policy formatted professionally with purpose, scope, policy statements, roles and responsibilities, exceptions process, and review schedule.
**Why it matters**: Policy writing is unglamorous but central to GRC. A full policy suite ready to show is something most candidates do not have.

### Standout — SOC 2 Type II Readiness Assessment
**What to build**: Conduct a SOC 2 readiness assessment for a fictional SaaS company against all five Trust Services Criteria. Document gaps, evidence requirements, and a 12-month readiness roadmap.
**Why it matters**: SOC 2 is the dominant compliance framework for SaaS companies globally. Deep familiarity signals real market value for GRC professionals.

---

## ☁️ CLOUD SECURITY PROJECTS

### Starter — AWS/Azure Misconfiguration Hunt
**What to build**: Spin up a free-tier AWS or Azure account. Intentionally misconfigure it (public S3 bucket, open security group, exposed key). Then use tools (ScoutSuite, Prowler, or native security assessments) to find and remediate every misconfiguration.
**What to document**: Before/after screenshots, tool output, what each misconfiguration could enable (attack scenario), and the remediation applied.
**Why it matters**: Cloud misconfiguration is the #1 cause of cloud breaches. This project proves hands-on cloud security literacy.

### Starter — Cloud Threat Model
**What to build**: Using the STRIDE methodology, threat model a 3-tier cloud application (web tier, app tier, data tier) hosted on AWS or Azure. Identify threats at each tier, the relevant services, and mitigations.
**What to document**: Architecture diagram with trust boundaries, STRIDE threat table per component, risk ratings, recommended AWS/Azure security services for each mitigation.
**Why it matters**: Cloud architects and security engineers work from threat models. Building one proves you think architecturally.

### Solid — Kubernetes Security Hardening Lab
**What to build**: Deploy a vulnerable Kubernetes cluster (use KubeCTF or intentionally misconfigure one). Use tools (kube-bench, Trivy, Falco) to audit it. Apply the CIS Kubernetes Benchmark. Document before/after state.
**What to document**: Audit report with findings, benchmark compliance status, remediation steps applied, remaining risk.
**Why it matters**: K8s security is one of the fastest-growing specialty areas. Most candidates have zero hands-on exposure.

### Solid — Cloud IR Tabletop Scenario
**What to build**: Design and run a realistic cloud incident response tabletop scenario (e.g., "A Lambda function is exfiltrating data to an external IP. What do you do?"). Document the full response: detection, containment, investigation, recovery, and post-incident review.
**What to document**: Scenario write-up, timeline of response actions, tools used (CloudTrail, GuardDuty, etc.), lessons learned, recommended preventive controls.
**Why it matters**: Cloud IR is in high demand. Very few entry-mid candidates have structured response experience.

---

## 📌 PORTFOLIO PRESENTATION GUIDELINES

### GitHub Repository Standards
Every project on GitHub must have:
- **README.md**: What you built, why, tools used, architecture diagram if applicable
- **Findings or output**: The actual deliverable (report, rule set, write-up) — not just code
- **What you learned**: One section on what was harder than expected and what you would do differently
- **Disclaimer** (for offensive tools/PoCs): "Built for educational purposes in a controlled lab environment"

### What NOT to Do
- Do not upload tools or PoCs that could be used against real systems without a controlled-environment disclaimer
- Do not post walkthroughs for active HackTheBox machines (wait until they are retired)
- Do not list TryHackMe completion badges without any write-ups — they signal passive learning
- Do not have a private GitHub — if a hiring manager cannot see it, it does not exist

### The Portfolio Conversation Rule
For every project on your portfolio, you must be able to answer:
1. What did you build and why?
2. What was the hardest part?
3. What would you do differently?
4. How does this relate to the work you would do in this role?

If you cannot answer these, the project is not ready for a portfolio.
