## 📚 REFERENCE LIBRARY: INTERVIEW-PREP
<a id="reference-library-interview-prep"></a>

# Interview Preparation: Technical + Behavioral
## Domain-Specific Questions, STAR Framework, and Model Answers

---

## 🧠 The Interview Mindset

> From **Chris Sanders**: Security interviews test how you *think*, not just what you know.
> The interviewer wants to see your investigative logic, your ability to handle ambiguity,
> and whether you will panic or reason when something unexpected happens.

**Three rules**:
1. Think out loud. Interviewers value your reasoning process as much as your answer.
2. Say "I don't know, but here's how I would find out" — never bluff.
3. Ask clarifying questions — security is always context-dependent.

---

## 🟢 TIER 1 — Entry Level Interview Questions

### SOC Analyst L1 / Cybersecurity Analyst (Associate)

**Core Technical Questions**

*"Walk me through what happens when a user types google.com into their browser."*
> Expect: DNS resolution (recursive lookup), TCP 3-way handshake, TLS handshake, HTTP/HTTPS request. This tests networking fundamentals — the bedrock of all threat hunting.

*"What is the difference between a virus, worm, and Trojan?"*
> Virus: attaches to a file, needs user action to spread. Worm: self-replicating over a network without user action. Trojan: disguises itself as legitimate software. The distinction matters for malware triage.

*"What does the Windows Event ID 4625 mean? Why does it matter?"*
> Failed logon attempt. Multiple 4625 events in short succession from one source = brute force attempt. Paired with 4624 (success) shortly after = credential stuffing or successful attack.

*"Explain the OSI model and why it matters for security."*
> Layer 7 (Application) — phishing, XSS, injection. Layer 4 (Transport) — TCP/UDP port scanning, DoS. Layer 3 (Network) — IP spoofing, routing attacks. Layer 2 (Data Link) — ARP poisoning. Security controls exist at every layer.

*"What is a false positive in a security context? How do you reduce them?"*
> An alert that fires on legitimate activity. Reduce by: tuning SIEM rules with whitelisted IPs/users, adding context (is this user in IT? is it change window?), improving rule logic with AND conditions.

*"What is phishing? How would you identify a phishing email?"*
> Suspicious sender domain, urgency language, mismatched URLs (hover before clicking), unexpected attachments, poor grammar. Check email headers for SPF/DKIM/DMARC failures.

*"You see 1,000 failed login attempts in 5 minutes from a single IP. What do you do?"*
> Step 1: Check if the IP is internal or external. Step 2: Identify the target accounts. Step 3: Check if any succeeded (Event ID 4624 after 4625 cluster). Step 4: Block the IP at firewall if external. Step 5: Escalate if any account was compromised. Step 6: Document in ticket.

**Scenario Questions**

*"An alert fires for PowerShell executing a base64-encoded command. How do you investigate?"*
> Decode the base64 string first. Check the process tree: what launched PowerShell? Was it a user or a scheduled task? Look at network connections from that PowerShell process. Check EDR for any file drops. Map to ATT&CK: T1059.001 (PowerShell).

---

## 🟡 TIER 2 — Mid Level Interview Questions

### SOC Analyst L2/L3 / Incident Responder / Malware Analyst

**Threat Hunting & Investigation**

*"What is the Pyramid of Pain? How does it affect how you write detection rules?"*
> Hash → IP/Domain → Network Artifacts → Host Artifacts → Tools → TTPs (most painful for attacker to change). Write detection at TTP level (ATT&CK techniques) rather than IOC level — attackers can change hashes in minutes but cannot easily change their behavioral patterns.

*"Walk me through investigating a potential ransomware infection."*
> 1. Identify patient zero (which host first, when). 2. Isolate the host immediately via EDR. 3. Preserve forensic artifacts before any remediation. 4. Check network logs for lateral movement. 5. Identify C2 domains/IPs and block at firewall. 6. Check backup integrity. 7. Initiate IR playbook (NIST 800-61). 8. Escalate to legal if PII involved.

*"What is a Golden Ticket attack? How would you detect it?"*
> Golden Ticket: Attacker forges a Kerberos Ticket Granting Ticket (TGT) using the KRBTGT account hash. Allows unlimited access to any resource with any ticket lifetime. Detection: Look for Event ID 4769 with unusual encryption types (0x17 = RC4 — older, more suspicious), tickets with abnormal lifetimes (>10 hours), tickets requesting service tickets for sensitive services without corresponding 4768 events.

*"Explain the difference between YARA rules and Sigma rules."*
> YARA: scans files and memory for specific byte patterns or strings — used for malware detection at the file level. Sigma: vendor-agnostic SIEM detection logic (converts to KQL, SPL, etc.) — used for log-based behavioral detection. YARA = what malware looks like. Sigma = what malware does in logs.

*"How do you perform triage on a suspicious binary without executing it?"*
> Static analysis: file command (file type), strings extraction (look for URLs, IPs, suspicious API calls like CreateRemoteThread, VirtualAlloc), PE header analysis (Detect-It-Easy), import table review (suspicious DLLs), hash lookup on VirusTotal.

*"What is BloodHound? Why is it dangerous?"*
> BloodHound maps Active Directory relationships graphically, showing the shortest privilege escalation path to Domain Admin. Dangerous because defenders don't visualize AD the way it does — attackers find paths that defenders don't know exist (Kerberoastable accounts, unconstrained delegation, ACL abuses).

**Malware Analysis**

*"An unknown executable is found on a compromised machine. Walk me through your analysis process."*
> Phase 1 (Triage): Hash it → VirusTotal. Strings analysis → look for C2 indicators, API imports. File type, timestamp, compilation info. Phase 2 (Dynamic): Detonate in sandbox (Any.Run/Cuckoo). Capture: network connections, registry changes, file system changes, process injection. Phase 3 (Static Deep): Disassemble with Ghidra/IDA if needed. Map to ATT&CK techniques observed.

*"What is process injection? Name two common techniques."*
> Process injection: executing code within the memory space of another process to evade detection.
> 1. **DLL Injection**: forcing a legitimate process to load a malicious DLL (WriteProcessMemory + CreateRemoteThread)
> 2. **Process Hollowing**: create a legitimate process suspended, hollow out its memory, replace with malicious code, resume execution — the process name appears legitimate in Task Manager.

---

## 🔵 TIER 3 — Senior Level Interview Questions

### Red Team Operator / Senior Penetration Tester / Threat Hunter

**Offensive Security**

*"Walk me through your methodology for an external network penetration test."*
> Phase 1 (Reconnaissance): Passive OSINT (Shodan, Censys, LinkedIn, DNS records, certificate transparency logs). Active recon: Nmap scanning, banner grabbing. Phase 2 (Initial Access): Identify exposed services → check known CVEs → test for credential stuffing on VPNs/OWA/Citrix. Phase 3 (Post-Exploitation): Establish persistence, enumerate internal network, lateral movement to high-value targets. Phase 4 (Report): Executive summary + technical findings + remediation recommendations.

*"You have compromised a Windows domain workstation. Walk me through getting to Domain Admin."*
> 1. Local enumeration: whoami, net users, ipconfig, systeminfo, check for local admin. 2. Dump credentials: Mimikatz sekurlsa::logonpasswords (if possible), check LSASS memory. 3. Network enumeration: BloodHound (SharpHound collector) to map AD attack paths. 4. Lateral movement: Pass-the-Hash or Pass-the-Ticket to higher-privileged systems. 5. Target: Domain Controller via DCSync (if DA reached) or Kerberoasting → crack service account → escalate.

*"How would you bypass CrowdStrike Falcon in a red team engagement?"*
> (Ethical/authorized context only) Common approaches: custom payload development in Go/Nim (less AV signatures than common tools), process injection via less-monitored parent processes, PPID spoofing, unhooking EDR hooks from NTDLL, indirect syscalls to bypass usermode hooks, living-off-the-land (LOLBins) — using legitimate Windows binaries. The key is understanding what CrowdStrike monitors vs. what it doesn't.

**Detection Engineering / Threat Hunting**

*"How do you build a detection rule from scratch for a new ATT&CK technique?"*
> 1. Identify the technique (e.g., T1003.001 - LSASS Memory Dumping). 2. Understand the observable evidence: what event IDs are generated? What process behavior? What network traffic? 3. Build a Sigma rule capturing minimum necessary conditions. 4. Convert to SIEM query (KQL/SPL). 5. Test against known-good logs (validate no false positives). 6. Test against simulated malicious traffic (validate detection). 7. Document and add to detection catalog.

*"A threat actor has been in your environment for 90 days without detection. How do you find them?"*
> This is a Threat Hunt. Start with: 1. Review all authentication logs for unusual patterns (off-hours, unusual source IPs, abnormal access). 2. Look for persistence mechanisms: scheduled tasks, registry run keys, unusual services. 3. Review network flows: long-duration low-volume connections (C2 beaconing pattern). 4. Check for lateral movement: unusual RDP/WMI/PsExec activity. 5. Memory analysis on key servers. 6. Baseline deviation: what processes/services are running now that weren't 90 days ago?

---

## 🟠 TIER 4+ — Lead/Senior Manager Questions

### SOC Manager / Red Team Lead / Security Architect

*"Your SOC has a 45% false positive rate. Analysts are burning out. What do you do?"*
> Immediate: Audit the top 10 highest-volume alerts — these are likely the worst offenders. Suppress known-false patterns with whitelisting. Medium-term: Rewrite alert logic with additional AND conditions. Implement SOAR playbooks for auto-enrichment and auto-close of clearly benign patterns. Long-term: Implement risk-based alerting (prioritize by asset criticality + threat context). Track MTTD and analyst saturation as KPIs.

*"Design the security architecture for a company moving from on-premises to AWS."*
> 1. Identity: AWS IAM with least-privilege + MFA everywhere. Federate with existing IdP (Okta/Entra ID) via SAML/OIDC. 2. Network: VPC with public/private subnets, Security Groups, NACLs. WAF in front of web-facing resources. 3. Logging: CloudTrail (all API calls), VPC Flow Logs, GuardDuty (threat detection), Security Hub (aggregation), Config (compliance state). 4. Data: S3 bucket policies, KMS encryption, Macie (data classification). 5. Incident Response: Automated Lambda responses to GuardDuty findings.

---

## 🔴 TIER 5–6 — Director/Executive Questions

*"How do you communicate a critical security risk to a Board that doesn't understand cybersecurity?"*
> Never use technical terms. Translate to business language: "We have a critical vulnerability in our payment processing system. If exploited, we estimate $25M in potential fines under PCI-DSS, plus the reputational cost of customer notification. Remediation costs $350,000 and takes 6 weeks. The question is not whether to fix it — it is whether we fix it now or after an incident."

*"How do you build a security culture in an organization that sees security as a blocker?"*
> 1. Embed security into the development process rather than bolting it on at the end (shift-left). 2. Make security easy: replace security theater with practical, non-disruptive controls. 3. Celebrate security wins publicly: when the security team catches something, make it visible. 4. Train developers to find security bugs: make it a game (internal bug bounty). 5. Measure security metrics and share them with leadership quarterly.

*"Walk me through your first 90 days as a new CISO."*
> Days 1–30 (Listen): Meet every stakeholder. Understand the business, not just the technology. Read the last 3 audit reports. Identify the most critical assets. Days 31–60 (Assess): Gap analysis against NIST CSF or ISO 27001. Evaluate the current team, tools, and processes. Days 61–90 (Prioritize): Build a 12-month security roadmap. Present to the board. Quick wins (low-cost, high-impact fixes) deployed immediately to demonstrate value.

---

## 💬 BEHAVIORAL QUESTIONS (STAR Format)

**STAR Framework**: Situation → Task → Action → Result

### Universal Behavioral Questions for Security Roles

*"Tell me about a time you discovered a critical vulnerability. What did you do?"*
> Structure: What was the vulnerability? What was your role in finding it? What immediate actions did you take? (Escalation, containment, documentation, notification). What was the outcome (systems protected, breach prevented)?

*"Describe a situation where you had to explain a technical security risk to a non-technical audience."*
> Focus on: how you translated technical language into business impact language. Did you use analogies? What was their reaction? Did they act on your recommendation? What was the result?

*"Tell me about a time you disagreed with a security decision made by leadership."*
> Show: you voiced your concern professionally with data, you accepted the final decision even if overruled, you documented your objection in writing (for accountability), and you continued to execute professionally.

*"Describe your most complex security incident response."*
> Cover: scope (how many systems, what type of incident), your specific role, the key decisions made under pressure, how you coordinated with other teams, and the final outcome.

*"Tell me about a time you worked under extreme time pressure on a security problem."*
> Show: prioritization under pressure, clear communication, methodical thinking even when panicking, and effective escalation.

*"Have you ever had to say no to a business request for security reasons? How did you handle it?"*
> Show: you risk-assessed the request, you explained the *why* clearly, you offered a secure alternative rather than a flat no, and you maintained a collaborative relationship.

---

## 🔬 TECHNICAL MINI-TESTS (Common in Security Interviews)

### "Here is a PCAP / log file. Tell me what you see."
- Identify: source/destination IPs, protocols, port numbers, timing patterns
- Flag: unexpected protocols, unusual ports, external connections, beaconing patterns
- Document: timeline of events, potential indicators of compromise

### "Here is a piece of code. Is it vulnerable? If so, why?"
- SQL injection: unsanitized user input in SQL queries
- XSS: unsanitized input rendered in HTML without encoding
- Buffer overflow: unchecked array bounds in C/C++
- Command injection: user input passed directly to system()

### "Write a KQL query that detects..."
- Know basic KQL: SecurityEvent, DeviceProcessEvents tables; | where, | summarize, | extend operators
- Example: Find all failed logon attempts > 10 in 5 minutes:
```kql
SecurityEvent
| where EventID == 4625
| summarize FailedAttempts = count() by Account, bin(TimeGenerated, 5m), IpAddress
| where FailedAttempts > 10
```

### "Describe how you would test this web application for vulnerabilities."
- OWASP Testing Guide methodology
- Injection (SQL, Command, LDAP), XSS, CSRF, Broken Auth, IDOR, Security Misconfig
- Tools: Burp Suite (intercept proxy), OWASP ZAP, Nmap for service discovery


---

