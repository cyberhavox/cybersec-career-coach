## 📚 REFERENCE LIBRARY: TRANSITION-GATES
<a id="reference-library-transition-gates"></a>

# Career Transition Gates & Skill Rubrics
## The Hard Metric Framework for Professional Progression

This framework establishes the exact criteria, rubrics, and verification gates required to move between cybersecurity career tiers and specialist domains. No hand-waving or tenure-based progression. You do not progress because you have "years of experience"; you progress because you have demonstrated verifiable capability.

---

## 📊 Part 1: The 0–5 Skill Level Rubric
Use this rubric to assess individual technical competencies across all security domains. Each level requires passing the previous level's requirements.

| Level | Classification | Description & Cognitive State | Practical Testing Standard (Verifiable Proof) |
|---|---|---|---|
| **0** | **Null** | Zero knowledge. Only heard the name or acronym. | Cannot define the acronym or its basic context. |
| **1** | **Conceptual (Theoretical)** | Knows what the technology/protocol is, its purpose, and basic terminology. Cannot execute. | Can explain the concept clearly in an interview and map it to a security domain (e.g., explaining the TCP 3-way handshake). |
| **2** | **Guided (Controlled)** | Can replicate tasks in a sandbox following a step-by-step tutorial or lab guide. Fails immediately if the environment deviates from the guide. | Can complete a guided TryHackMe/PortSwigger room with a walkthrough. Cannot troubleshoot config errors. |
| **3** | **Functional (Applied)** | Can build, configure, and troubleshoot the technology independently in a lab environment. Solves open-ended problems without guides. | Given a VM with misconfigured services, can identify the issues, repair them, write a script to monitor them, and document the solution. |
| **4** | **Production (Enterprise)** | Operates the technology in a live business environment under SLA constraints. Understands scaling, high availability, and business risk. | Can deploy, monitor, and troubleshoot the system under production load; handles incident triage or hardening on live enterprise networks. |
| **5** | **Lead / Architect (Authority)** | Can design architectures from scratch, perform deep root-cause analysis on anomalies, audit systems, and teach senior engineers. | Can write custom security tools, discover novel bypasses, design global secure architectures, and lead enterprise incident response. |

---

## 🚪 Part 2: Phase Transition Gates (Phase 0 to Phase 6)
To transition from one phase to the next, you must pass the corresponding **Hard Gate Verification**.

### 🧬 Phase 0 → Phase 1: The Bedrock Gate (Entering Tier 1)
*Moving from IT generalist/student to Junior Security Analyst.*

* **Objective**: Prove you understand deterministic systems, network flows, and OS internals.
* **The Hard Gate Verification Task**:
  1. **Network Analysis**: Capture traffic using `tcpdump` on a Linux server while running a basic curl request. Open the capture in Wireshark and isolate the TCP stream. Hand-carve the HTTP request headers and DNS queries from the packet payload.
  2. **OS Configuration**: Deploy a Windows Server VM, set up Active Directory Domain Services (AD DS) via PowerShell, and join a Windows 10 workstation VM to the domain.
  3. **Basic Automation**: Write a Bash or PowerShell script that parses an Apache/Nginx `access.log` file, extracts all IP addresses making requests that result in a `404` status code, and outputs a sorted list of the top 5 offending IPs.
* **Verifiable Artifacts**:
  - A `.pcap` capture file containing a fully parsed HTTP packet exchange.
  - A copy of the script with a markdown explanation of how it handles regex patterns.

---

### 🟢 Phase 1 → Phase 2: The Tactical Executioner Gate (Tier 1 → Tier 2)
*Moving from alert triage to full-scope assessment, incident response, or engineering.*

* **Objective**: Transition from pattern-matching and dashboard monitoring to deep investigation and system hardening.
* **The Hard Gate Verification Task**:
  1. **SIEM & Detection Engineering**: In a Splunk or Sentinel environment, write a custom detection rule (SPL or KQL) to detect **Kerberoasting** (Event ID 4769 with RC4 encryption type `0x17` and service name not ending in `$`).
  2. **Vulnerability Exploitation**: Configure a vulnerable machine (e.g., Metasploitable) and perform a manual exploit of a vulnerability (e.g., SSH brute force, SMB exploitation) *without* using Metasploit. Show step-by-step extraction of credentials.
  3. **Incident Investigation**: Analyze a Windows host memory dump using `Volatility 3`. Identify the malicious process PID, extract the network connection it made, dump the process memory, and find the embedded domain/IP it beaconed to.
* **Verifiable Artifacts**:
  - The functional SPL/KQL query with documented false-positive suppression logic.
  - A written walkthrough of the manual exploitation process including commands used.
  - A brief incident report summarizing the memory analysis findings.

---

### 🟡 Phase 2 → Phase 3: The Defensive Bastion / Offensive Specialist Gate (Tier 2 → Tier 3)
*Moving from general practitioner to senior engineer or specialized operator.*

* **Objective**: Lead technical initiatives, perform advanced threat hunts, or conduct complex penetration tests.
* **The Hard Gate Verification Task (Choose Track)**:
  * **Defensive Track**:
    1. **Active Threat Hunt**: Build a Wazuh or Elastic Stack home lab. Simulate a Cobalt Strike beacon execution on an endpoint. Analyze the endpoint logs to construct a timeline showing parent-child process anomalies (e.g., `cmd.exe` spawned by `w3wp.exe` or `powershell.exe` with base64 encoded flags spawned by `explorer.exe`).
    2. **WAF & EDR Bypasses**: Test security configurations by attempting to bypass your own alert rules using living-off-the-land binaries (LOLBins) like `certutil.exe` or `bitsadmin.exe`. Harden the detection rules until the bypasses are blocked.
  * **Offensive Track**:
    1. **Privilege Escalation**: Conduct a full, manual local privilege escalation on both a hardened Windows target (exploiting GPO misconfigurations or service DLL hijacking) and a Linux target (exploiting SUID binaries or wildcards in cron jobs).
    2. **Evasion**: Write a custom Python or C# payload that encrypts shellcode using AES-256 and executes it in memory (Process Injection / Runpe) to bypass default Windows Defender static signatures.
* **Verifiable Artifacts**:
  - **Defensive**: A detection rule package and a comprehensive threat hunting report mapping to the MITRE ATT&CK framework.
  - **Offensive**: Fully documented source code of the evasion payload and proof of execution on target VMs.

---

### 🔵 Phase 3 → Phase 4: The Architect Gate (Tier 3 → Tier 4)
*Moving from senior individual contributor to Lead Architect or Principal Consultant.*

* **Objective**: Design scalable security programs, architectural security controls, and govern risk.
* **The Hard Gate Verification Task**:
  1. **Enterprise Identity Architecture**: Design a zero-trust identity architecture for a multi-tenant enterprise utilizing Microsoft Entra ID. Document the Conditional Access policies, Privileged Identity Management (PIM) workflows, and SAML/OIDC federation for third-party SaaS apps.
  2. **Threat Modeling**: Perform an architectural threat model of a cloud-native application (Kubernetes, AWS Lambda, DynamoDB, API Gateway) using STRIDE methodology. Document at least 15 distinct threats and their technical mitigations.
* **Verifiable Artifacts**:
  - Architectural diagrams (Mermaid or similar) detailing trust boundaries and network segmentation.
  - A formal STRIDE Threat Model document with prioritized risk ratings and engineering remediation steps.

---

### 🟣 Phase 4 → Phase 5: The Executive / Strategist Gate (Tier 4 → Tier 5)
*Moving from Principal/Architect to CISO, Director, or Independent Advisory Lead.*

* **Objective**: Align security posture with business revenue, manage multi-million dollar budgets, and own liability.
* **The Hard Gate Verification Task**:
  1. **Risk Register & Business Impact Analysis (BIA)**: Build an enterprise-level risk register containing financial calculations (SLE, ARO, ALE) for top threat scenarios (e.g., Ransomware outbreak on critical production database).
  2. **Security Budget Negotiation**: Prepare and present a 10-minute business case to a mock Board of Directors justifying a 30% increase in security spend, backed by regulatory compliance mandates, insurance premium reductions, and quantitative risk reduction models.
* **Verifiable Artifacts**:
  - A spreadsheet-based quantitative risk matrix with formulas for ROI on proposed security investments.
  - A Board-level presentation deck focusing on business risk, operational downtime, and legal liability rather than technical jargon.

---

## 🛰️ Part 3: Specialized Domain Tracks (Phase 6)
To pivot into highly specialized disciplines, you must master the specialized domain gates.

### 🤖 Track A: AI/ML Security Specialist
*Focuses on securing Machine Learning pipelines, models, and LLM-integrated systems.*

#### 🧱 Domain Knowledge Requirements
* Core ML concepts (training vs. inference, weights, hyperparameters, fine-tuning, retrieval-augmented generation - RAG).
* OWASP Top 10 for Large Language Models (LLM01: Prompt Injection to LLM10: Model Theft).
* Attack surfaces: training data pipelines, API integrations, orchestration layers (LangChain/LlamaIndex), vector databases (Pinecone, ChromaDB).

#### 🛡️ Defensive Hard Gates (Verifiable Projects)
1. **RAG Pipeline Hardening**: Deploy a local RAG application using Python, LangChain, and a vector database. Implement a robust semantic guardrail system (e.g., NeMo Guardrails or Llama Guard) that detects and blocks prompt injections, indirect injections (injected through external web search context), and jailbreaks.
2. **Data Poisoning & Leakage Defense**: Implement a data sanitization pipeline that scans training/fine-tuning datasets for adversarial triggers and PII (using Microsoft Presidio or custom regex) before feeding the data into a model pipeline.
3. **API Rate Limiting & DoS Defense**: Configure an API Gateway (e.g., Kong or Nginx) to enforce token-bucket rate limiting based on model inference cost (compute metrics) rather than simple request counts, preventing Model Denial of Service attacks.

#### 🗡️ Offensive Hard Gates (Verifiable Projects)
1. **Indirect Prompt Injection**: Set up a target environment where an LLM reads an external webpage to summarize it. Construct a webpage containing hidden payload instructions that force the LLM to exfiltrate private user session tokens to an external attacker-controlled listener.
2. **Model Extraction/Inversion**: Write a Python script that queries a target API-hosted classification model repeatedly to reconstruct the model's decision boundary or infer sensitive data from the training set.

---

### ⚙️ Track B: OT/ICS Security Specialist
*Focuses on securing Industrial Control Systems, SCADA networks, and critical infrastructure.*

#### 🧱 Domain Knowledge Requirements
* The Purdue Enterprise Reference Architecture (Purdue Model Levels 0 to 5).
* Industrial Protocols: Modbus/TCP, DNP3, Profinet, EtherNet/IP, OPC UA, BACnet.
* Regulatory Frameworks: IEC 62443, NIST SP 800-82, NERC CIP (North American grid standard) or regional equivalent (EU NIS2, AESCSF in Australia, etc.).
* Safety Instrumented Systems (SIS) and their isolation from Basic Process Control Systems (BPCS).

#### 🛡️ Defensive Hard Gates (Verifiable Projects)
1. **SCADA Network Segmentation**: Design and implement a multi-layered industrial network topology in GNS3 or packet tracer conforming to IEC 62443. Configure firewall rules that restrict all Layer 3 to Layer 2 transitions, permitting only authenticated OPC UA traffic through a DMZ data collector.
2. **Modbus Packet Inspection**: Write a custom Snort or Zeek (Bro) signature to detect anomalous write commands (Modbus Function Code 5 or 6) targeting critical PLC registers (coils) during production hours, while permitting read commands (Function Code 1).
3. **ICS Backup & Recovery Tabletop**: Write a detailed disaster recovery playbook for a simulated industrial incident where a PLC configuration is wiped. The plan must detail offline logic storage verification, firmware checksum validation, and fail-safe hardware recovery protocols.

#### 🗡️ Offensive Hard Gates (Verifiable Projects)
1. **Industrial Reconnaissance & Packet Spoofing**: Setup an open-source PLC emulator (e.g., ModbusPal). Use Scapy (Python) to scan the network, identify the open Modbus port (502), and script a packet injection that sends a malicious command to modify a register value (e.g., changing temp limit), demonstrating process disruption.
2. **Firmware Reverse Engineering**: Analyze a decrypted RTU or PLC firmware image using Binwalk. Extract the file system, locate the telnet/SSH service binary, and identify hardcoded backdoor credentials or unauthenticated configuration endpoints.


---

