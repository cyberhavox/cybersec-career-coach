## 📚 REFERENCE LIBRARY: DIAGNOSTIC-FRAMEWORK
<a id="reference-library-diagnostic-framework"></a>

# Diagnostic Framework: Past · Present · Future Career Analysis
## The Full System for Self-Assessment, Gap Identification, and Honest Career Diagnosis

---

## 🎯 Purpose of This Framework

Most career advice fails because it is generic, surface-level, and tells people what they want to hear.

This framework does the opposite. It treats your career like a **security incident investigation**:
gather all evidence → form hypotheses → test them → reach an honest conclusion → prescribe specific remediation.

The same rigor you would apply to a breach investigation is applied here to your career.

> **Invoking Alan Turing's method**: Systematically eliminate what your situation *cannot* be
> until only the truth remains. No assumptions. No flattery. Only what the evidence supports.

---

## 📋 PHASE 1: THE PAST AUDIT
### *"Every contact leaves a trace." — Edmond Locard*

Before giving any advice, the advisor must understand the full history.
Patterns in the past predict future behavior unless consciously broken.

### Questions to Surface the Past

**Origin Story**
- What was your background before cybersecurity? (IT, non-IT, student, military, other)
- Why did you choose cybersecurity specifically? (passion, salary, career change, advice from others)
- Was the reason based on reality, or on a perception of the field?

**Education & Certification History**
- What degrees, diplomas, or courses have you completed? In what order?
- What certifications have you pursued? Did you pass? If not, why not?
- Were these chosen strategically (aligned to a target role) or opportunistically (whatever was available or discounted)?
- How much time passed between learning and applying what you learned?

**Experience History**
- What roles have you held? Entry-level? Internships? Adjacent IT roles?
- Were these roles in security, or in adjacent fields (IT support, networking, development)?
- What did you actually do day-to-day in each role? (not what the job title says — what your hands actually did)
- Where did you feel you were not growing?

**Decision Pattern Analysis**
These patterns are the most important and the most honest:

| Pattern | What It Usually Means |
|---|---|
| Collected certs but never applied them | Comfort in studying, avoidance of real-world exposure |
| Applied to senior roles with junior skills | Salary-driven over readiness-driven |
| Jumped domains frequently (SOC → GRC → AppSec) | Lack of commitment or genuine uncertainty |
| Stayed in one role too long without leveling up | Comfort zone paralysis |
| Pursued cheap/fast certs over respected ones | Short-term thinking, possibly resume padding |
| Self-taught but never proved it publicly | Skills may exist but are invisible to employers |
| Network of zero in the security community | Isolation — the hidden job market is inaccessible |
| Applied to hundreds of jobs with zero responses | Resume/positioning problem, not skills problem |

**The Uncomfortable Questions (Must Be Asked)**
- Have you ever been rejected from a role you thought you were qualified for? What did you do afterward?
- Have you ever been in a security role and felt like you did not actually know what you were doing?
- Have you ever taken a certification without any lab practice, hoping the theory would be enough?
- Have you ever avoided learning something difficult because it seemed too hard?
- Have you been honest with yourself about your actual skill level vs. your job title?

---

## 🔬 PHASE 2: THE PRESENT ASSESSMENT
### *"Security is a process, not a product." — Bruce Schneier*

The present assessment is the most uncomfortable phase.
It requires the person to be honest about what they actually know vs. what they claim to know.

### The Brutal Skill Reality Test

For each technology or domain listed, rate yourself honestly:

**Level Definitions (No Inflation)**
- **0 — Never used it**: Only heard the name
- **1 — Theoretical**: Can describe it but never done it
- **2 — Guided exposure**: Did it with tutorials/labs but not independently
- **3 — Functional**: Can do it independently in a lab environment
- **4 — Production-ready**: Have done it in a real workplace under pressure
- **5 — Expert**: Can teach it, troubleshoot unexpected edge cases, build on it

**The skills hiring managers will test you on:**

| Technology / Concept | Your Honest Level (0–5) | Required Level for Target Role |
|---|---|---|
| TCP/IP networking fundamentals | | |
| Reading and interpreting Wireshark captures | | |
| Writing KQL queries in Microsoft Sentinel | | |
| Writing SPL queries in Splunk | | |
| Active Directory structure and attack paths | | |
| Windows Event ID log analysis | | |
| Linux command line (file permissions, processes, bash) | | |
| Python scripting for security automation | | |
| MITRE ATT&CK framework navigation and application | | |
| Burp Suite manual testing (not just scanning) | | |
| Nmap scanning and output interpretation | | |
| Metasploit framework (not just msfconsole autopwn) | | |
| Understanding and writing YARA rules | | |
| Understanding and writing Sigma detection rules | | |
| Cloud security (AWS/Azure/GCP) fundamentals | | |
| Incident response lifecycle (NIST 800-61) | | |
| Malware behavioral analysis (sandbox + strings) | | |
| Social engineering identification and prevention | | |
| Risk framework literacy (NIST CSF, ISO 27001) | | |
| Explaining a security concept to a non-technical person | | |

**The Gap Formula**: Required Level − Your Honest Level = Gap Size
Gaps of 2+ are critical and must be addressed before targeting that role.

### Resume Reality Check

Your resume is not what you think it is. It is what a hiring manager who has seen 500 resumes thinks it is.

Ask yourself — and answer honestly:
- Does every bullet point have a measurable outcome, or do bullets say "responsible for X"?
- Are your tool names listed explicitly (Splunk, CrowdStrike, etc.) or described generically?
- Is there a GitHub link, portfolio, or CTF history for a hiring manager to verify your claims?
- Have you tailored this resume to the specific role, or is it one generic document sent everywhere?
- Would a recruiter searching LinkedIn/job boards find you for your target role with their standard search terms?

### LinkedIn Reality Check

Go to your own LinkedIn profile. Look at it as a recruiter seeing it for the first time.
- Does your headline contain role + tools + cert? Or just your current job title?
- Is your "About" section a generic paragraph that could belong to anyone in tech?
- Do you have skills endorsed by colleagues — or 0 endorsements?
- When did you last post anything? (Silence = you don't exist in the algorithm)
- Do you have 500+ connections or are you invisible to search ranking?

### The Interview Readiness Test

Can you answer these without hesitation? Without Google?

**If targeting SOC/Blue Team:**
- Walk me through investigating a PowerShell base64-encoded command execution alert
- What is the Pyramid of Pain and how does it change how you hunt?
- What Windows Event IDs indicate a brute force attack followed by successful compromise?
- Write a KQL query to find failed logins > 5 in 2 minutes from the same IP

**If targeting Offensive/Red Team:**
- Walk me through your methodology for an external network penetration test from zero
- Explain Kerberoasting: what it is, how it works, what it gives you, how to detect it
- How do you bypass CrowdStrike on a red team engagement? (authorized context)

**If targeting GRC:**
- What is the difference between ISO 27001 and SOC 2 Type II?
- How do you translate a CVSS 9.8 vulnerability into business risk language for a CFO?
- Walk me through designing a vendor risk assessment process from scratch

**If targeting AppSec:**
- Explain SQL injection and demonstrate how to find and fix it in code
- What is the difference between SAST and DAST? When do you use each?
- How do you perform threat modeling on a new web application feature?

If any of these questions caused hesitation or uncertainty — that is an interview gap.

---

## 🔭 PHASE 3: FUTURE MAPPING
### *"Predicting the future requires understanding the present completely." — Stephen Hawking doctrine*

### The Target Role Clarity Test

Before mapping a future, the target must be specific:

**Unacceptable targets** (too vague to plan for):
- "I want to work in cybersecurity"
- "I want a senior role"
- "I want to work in offensive security someday"

**Acceptable targets** (specific enough to plan for):
- "I want to be a SOC Analyst L2 at a financial services company within 8 months"
- "I want to pass OSCP and get a Penetration Tester role at an MSSP within 12 months"
- "I want to transition from IT Helpdesk to Endpoint Security Analyst in 6 months"
- "I want to be a Cloud Security Engineer at a US tech company (remote) within 18 months"

Once the target is specific, the gap between present state and target state can be calculated precisely.

### The Gap-to-Action Converter

For each gap identified across the 8 dimensions, produce:

```
GAP: [Specific missing element]
SEVERITY: Critical / Significant / Minor
EVIDENCE: [What demonstrates this gap]
FIX: [Exact resource, course, project, community — not generic advice]
TIMELINE: [Realistic weeks/months to close this gap]
EXPERT VOICE: [Which expert in the pantheon addresses this directly]
SUCCESS METRIC: [How will you know the gap is closed?]
```

**Example Diagnosis Entry:**
```
GAP: No hands-on SIEM experience — only theoretical knowledge of Splunk
SEVERITY: Critical (target role requires daily Splunk querying)
EVIDENCE: Resume says "familiar with Splunk" — no queries written, no lab environment
FIX: 
  1. Deploy Splunk Free on a home VM (8 hours setup)
  2. Complete Boss of the SOC (BOTS) challenges on Splunk's free training (40 hours)
  3. Write 5 custom detection rules for common attack patterns
  4. Add these to GitHub with documentation
TIMELINE: 6 weeks to functional level (Level 3 on the scale)
EXPERT VOICE: John Hubbard — "You cannot triage alerts you cannot query"
SUCCESS METRIC: Can independently write a Splunk query to detect brute force 
                attempts within 5 minutes, without documentation assistance
```

---

## ⚠️ COMMON CAREER MISTAKE PATTERNS

These are patterns seen repeatedly in cybersecurity career failures.
If you recognize yourself in any of these, you are not being judged — you are being diagnosed.

### Mistake Pattern 1: The Certification Collector
**What it looks like**: 5–7 certifications. No practical projects. No GitHub. No CTF history.
**The brutal truth**: Certifications prove you can pass a multiple-choice exam. They do not prove you can do the work. Hiring managers who conduct technical interviews will expose this within 10 minutes.
**The fix**: Stop collecting. Deploy a home lab. Build something. Break something. Document it publicly.
**Expert voice**: Bruce Schneier — "Security is a process, not a product." Certs are not security skills.

### Mistake Pattern 2: The Title Hunter
**What it looks like**: Applying for Senior/Lead roles with Tier 1–2 experience because the salary is attractive.
**The brutal truth**: This wastes your time and burns your reputation with employers. You will be screened out by ATS or exposed in the technical round. Worse, it signals poor self-awareness — a dangerous trait in security.
**The fix**: Be honest about your tier. Get the role that matches your current skill level. Level up fast inside it, then move up. Two years of real Tier 2 experience beats five years of failed Tier 4 applications.
**Expert voice**: W. Edwards Deming — measure where you actually are before setting targets.

### Mistake Pattern 3: The Domain Jumper
**What it looks like**: Started in SOC, switched to GRC, now interested in AppSec, considering OT security.
**The brutal truth**: Employers hire specialists at Tier 2+ and generalists only at Tier 1. Jumping domains repeatedly signals you do not know what you want — which means neither does a hiring manager when they look at your resume.
**The fix**: Choose a domain. Build depth. You can expand later from a position of strength. A 5-year SOC specialist transitioning to CTI is logical. A 5-year domain jumper is confusing.
**Expert voice**: Carl Linnaeus — rigorous taxonomy and classification before action.

### Mistake Pattern 4: The Invisible Expert
**What it looks like**: Genuinely skilled. Nobody knows it. No GitHub. No LinkedIn activity. No community presence. No CTF writeups. Applies to jobs with a resume that cannot be verified.
**The brutal truth**: In cybersecurity, if you cannot prove it, it does not exist. A hiring manager at a top firm cannot take your word for your skills. They need evidence. Your skills are invisible.
**The fix**: Make your work visible. One GitHub repo. One blog post. One CTF writeup. One LinkedIn post about something you learned. Start the visibility engine immediately.
**Expert voice**: Katie Nickels — "Intelligence without action is just information." Skills without proof are just claims.

### Mistake Pattern 5: The Theory-Only Student
**What it looks like**: Watches YouTube videos. Reads security blogs. Passes certifications. Never touched a real tool in anger.
**The brutal truth**: You will be destroyed in any practical technical interview. Reading about Metasploit is not the same as running it. Reading about log analysis is not the same as triaging 10,000 events under pressure.
**The fix**: Labs, labs, labs. TryHackMe. HackTheBox. Home SIEM. Deploy Splunk. Run Nessus. Break a vulnerable VM. Do not read about it. Do it.
**Expert voice**: Alan Turing built the Bombe. He did not theorize about it.

### Mistake Pattern 6: The Network Isolationist
**What it looks like**: Works alone. Never attends meetups. No community connections. 70% of security jobs are filled through referrals and community networks. This person applies cold to everything.
**The brutal truth**: The hidden job market — roles filled before they are posted, referrals that bypass ATS, hiring managers who ask their network before posting — is completely inaccessible to you.
**The fix**: Attend one OWASP meetup. Join one security Discord. Contribute to one open-source security tool. Connect with 10 security professionals on LinkedIn this week. Start somewhere.
**Expert voice**: Kevin Mitnick — social engineering works because humans trust their networks. Build yours.

### Mistake Pattern 7: The Comfort Zone Prisoner
**What it looks like**: Stays in the same role for 3–5 years because it is comfortable. Keeps doing the same tasks. Does not push for new responsibilities. Salary is fine. Growth is zero.
**The brutal truth**: In cybersecurity, standing still is moving backward. Threats evolve. Tools change. A 5-year SOC analyst who has done the same job for 5 years is not a 5-year analyst. They are a 1-year analyst who repeated it 5 times.
**The fix**: Identify the next skill your role does not currently require you to use. Learn it. Propose a new responsibility to your manager. If they say no — the company is not investing in you. Leave.
**Expert voice**: Dr. Eric Cole — "The threat landscape in 5 years will not resemble the threat landscape today. Neither can you."

### Mistake Pattern 8: The Wrong Market Targeter
**What it looks like**: Has legitimate skills, applies only to top-tier companies (Google, Microsoft, FAANG), gets rejected repeatedly. Or applies to commodity-service companies for roles that require elite skills and ends up underpaid.
**The brutal truth**: Market selection is a skill. Your skills may be real and your resume solid, but you are targeting the wrong segment of employers for your current level.
**The fix**: Map your tier accurately. Tier 1–2: regional MSSPs, mid-size IT companies, startups. Tier 3: MNC offices, global MSSPs. Tier 4+: direct FAANG/MNC with referrals.
**Expert voice**: Sun Tzu — choose your battles based on where you can win.

---

## 🛠️ THE SELF-ASSESSMENT QUESTIONNAIRE
### Complete This Before Receiving a Diagnosis

Share your answers to these questions for a full diagnostic:

**Background**
1. What is your educational background? (Degree, field, institution)
2. How many years have you worked in IT/security total?
3. What is your current role and company type?

**Skills & Tools**
4. List every security tool you have used in a real job or serious lab environment (not just seen a demo of)
5. Which of those can you use independently without documentation?
6. What scripting/programming languages can you write basic security scripts in?

**Certifications**
7. List every certification you hold (name, issuer, year obtained, status)
8. List every certification you are studying for or plan to pursue
9. Why did you choose each one?

**Portfolio**
10. Do you have a GitHub profile? What is in it?
11. Have you completed any CTF challenges? Which platforms? What ranking/achievements?
12. Do you have a blog, writeup, or any public security work?
13. Have you discovered or responsibly disclosed any vulnerabilities?

**Career History**
14. List your last 3 roles (title, company type, duration, what you actually did)
15. What is the highest-level security role you have ever held?
16. Have you been rejected from roles in the past 12 months? How many, approximately?

**Goals**
17. What exact role do you want in 12 months? (Be specific: title, company type, domain)
18. What exact role do you want in 3–5 years?
19. What is your current compensation, and what is your target?

**Self-Assessment**
20. What do you think is your biggest weakness in your current career trajectory?
21. What do you think is your biggest strength?
22. What is the one thing you have been avoiding that you know you should be doing?

---

## 📊 DIAGNOSIS OUTPUT FORMAT

After gathering the above information, the advisor will produce:

### Section 1: Honest Current State Assessment
*No inflation. This is where you actually are.*

### Section 2: Gap Analysis (8 Dimensions)
*Every gap, ranked by severity, with specific fixes.*

### Section 3: Pattern Identification
*What behavioral or strategic patterns are holding your career back.*

### Section 4: The Prescription
*Exact next steps, in priority order, with timelines and success metrics.*

### Section 5: Expert Council
*Which expert voices from the pantheon are most relevant to your situation, and what they would say to you specifically.*

### Section 6: The 90-Day Plan
*Concrete, weekly-level actions for the next 90 days. Not vague goals. Specific actions.*

### Section 7: Red Flags to Stop Immediately
*Behaviors, platforms, certifications, or strategies that are actively wasting your time and must stop.*


---

