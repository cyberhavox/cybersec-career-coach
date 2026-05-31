#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import os from 'os';
import prompts from 'prompts';
import pc from 'picocolors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to copy directory recursively
async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

// Helper to copy text to clipboard (zero-dependency)
function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    let proc;
    if (process.platform === 'win32') {
      proc = spawn('clip');
    } else if (process.platform === 'darwin') {
      proc = spawn('pbcopy');
    } else {
      proc = spawn('xclip', ['-selection', 'clipboard']);
    }

    proc.on('error', (err) => {
      // Fallback if clip/pbcopy/xclip is not installed/working
      reject(err);
    });

    proc.stdin.write(text);
    proc.stdin.end();
    proc.on('close', () => resolve());
  });
}

// CLI Header
function printHeader() {
  console.log(pc.magenta(`
   ${pc.bold(pc.cyan('      🛡️  CYBERSEC CAREER COACH  🛡️'))}
   ${pc.dim('==============================================')}
   ${pc.bold('Brutally Honest Diagnostics & Actionable Roadmaps')}
   ${pc.dim('==============================================')}
  `));
}

// Intake questionnaire
async function runIntakeFlow() {
  console.log(pc.yellow('📝 Starting Career Intake Questionnaire...\n'));

  const answers = await prompts([
    {
      type: 'multiselect',
      name: 'helpCategories',
      message: 'Q1: What kind of help are you looking for today? (Select all that apply)',
      choices: [
        { title: 'Full career diagnosis (where am I, where to go, what is missing)', value: 'Full career diagnosis' },
        { title: 'Resume / LinkedIn / portfolio review', value: 'Resume / LinkedIn / portfolio review' },
        { title: 'Certification guidance (which ones, in what order)', value: 'Certification guidance' },
        { title: 'Job search strategy (platforms, applications, outreach)', value: 'Job search strategy' },
        { title: 'Interview preparation (technical or behavioral)', value: 'Interview preparation' },
        { title: 'Salary negotiation or offer evaluation', value: 'Salary negotiation or offer evaluation' },
        { title: 'Career pivot plan (coming from a different field)', value: 'Career pivot plan' },
        { title: 'Specific role deep-dive (what does this role need)', value: 'Specific role deep-dive' },
        { title: 'Skill gap analysis (what am I missing for my target)', value: 'Skill gap analysis' },
        { title: 'Bug bounty (how to start, transition to full-time)', value: 'Bug bounty' },
        { title: 'First 90 days plan (how to succeed in a new role)', value: 'First 90 days plan' },
        { title: 'Burnout / Career paralysis guidance', value: 'Burnout guidance' }
      ],
      min: 1
    },
    {
      type: 'text',
      name: 'backgroundYears',
      message: 'Q2: How many years of experience do you have in IT or cybersecurity?',
      initial: '0'
    },
    {
      type: 'text',
      name: 'backgroundRoles',
      message: 'Q2: What roles/job titles have you held (IT or non-IT)?',
      initial: 'None / Student'
    },
    {
      type: 'text',
      name: 'backgroundCerts',
      message: 'Q2: What certifications do you currently hold?',
      initial: 'None'
    },
    {
      type: 'text',
      name: 'backgroundDegree',
      message: 'Q2: Do you have a degree? If so, in what field?',
      initial: 'None'
    },
    {
      type: 'text',
      name: 'targetRole',
      message: 'Q3: What specific role or job title are you aiming for?',
      initial: 'SOC Analyst L1'
    },
    {
      type: 'select',
      name: 'targetSeniority',
      message: 'Q3: What target seniority level?',
      choices: [
        { title: 'Entry Level', value: 'Entry' },
        { title: 'Mid Level', value: 'Mid' },
        { title: 'Senior / Lead', value: 'Senior' },
        { title: 'Manager / Director', value: 'Management' },
        { title: 'CISO / Executive', value: 'Executive' }
      ]
    },
    {
      type: 'text',
      name: 'targetLocation',
      message: 'Q3: What is your location & preferred work model (Remote/Hybrid/On-site)?',
      initial: 'Remote, India'
    },
    {
      type: 'text',
      name: 'targetTimeline',
      message: 'Q3: What is your timeline to reach this target?',
      initial: '3 to 6 months'
    },
    {
      type: 'text',
      name: 'triedSoFar',
      message: 'Q4: What have you already tried? (Courses, certs, labs, outreach, etc.)',
      initial: 'Self-study'
    },
    {
      type: 'text',
      name: 'attemptsOutcome',
      message: 'Q4: What did NOT work, and why do you think it failed?',
      initial: 'Applying online with no interview responses'
    },
    {
      type: 'text',
      name: 'biggestObstacle',
      message: 'Q5: What is the single biggest obstacle you face right now?',
      initial: 'Getting past the initial resume screening'
    }
  ]);

  if (Object.keys(answers).length < 11) {
    console.log(pc.red('\nIntake cancelled by user.'));
    process.exit(1);
  }

  return answers;
}

// Call LLM API (Gemini, Anthropic, OpenAI, Groq, OpenRouter, Ollama)
async function callLLM(systemPrompt, userMessage, provider, apiKey, options = {}) {
  const modelName = provider === 'gemini' ? 'gemini-1.5-pro' : 'claude-3-5-sonnet-20241022';
  
  if (provider === 'gemini') {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
  }

  if (provider === 'anthropic') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || 'No response generated.';
  }

  // OpenAI-compatible endpoints
  let url = '';
  let model = '';

  if (provider === 'openai') {
    url = 'https://api.openai.com/v1/chat/completions';
    model = 'gpt-4o';
  } else if (provider === 'groq') {
    url = 'https://api.groq.com/openai/v1/chat/completions';
    model = 'llama-3.1-70b-versatile';
  } else if (provider === 'openrouter') {
    url = 'https://openrouter.ai/api/v1/chat/completions';
    model = 'meta-llama/llama-3-8b-instruct:free';
  } else if (provider === 'deepseek') {
    url = 'https://api.deepseek.com/v1/chat/completions';
    model = 'deepseek-chat';
  } else if (provider === 'mistral') {
    url = 'https://api.mistral.ai/v1/chat/completions';
    model = 'mistral-large-latest';
  } else if (provider === 'cohere') {
    url = 'https://api.cohere.com/v1/chat/completions';
    model = 'command-r-plus';
  } else if (provider === 'krutrim') {
    url = 'https://cloud.olakrutrim.com/v1/chat/completions';
    model = 'Krutrim-spectre-v2';
  } else if (provider === 'sarvam') {
    url = 'https://api.sarvam.ai/chat/completions';
    model = 'sarvam-2b';
  } else if (provider === 'zhipu') {
    url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
    model = 'glm-4';
  } else if (provider === 'qwen') {
    url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
    model = 'qwen-plus';
  } else if (provider === 'ollama') {
    url = 'http://localhost:11434/v1/chat/completions';
    model = options.ollamaModel || 'llama3';
  }

  if (url) {
    const headers = { 'Content-Type': 'application/json' };
    if (provider !== 'ollama') {
      headers['Authorization'] = `Bearer ${apiKey}`;
      headers['api-key'] = apiKey; // Support Sarvam AI header
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`${provider.toUpperCase()} API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response generated.';
  }

  throw new Error(`Unsupported API provider: ${provider}`);
}


// Track details extraction
function getTrackDetails(targetRole) {
  const role = (targetRole || '').toLowerCase();
  
  if (
    role.includes('soc') || 
    role.includes('analyst') || 
    role.includes('detect') || 
    role.includes('defense') || 
    role.includes('defensive') ||
    role.includes('blue') || 
    role.includes('incident') || 
    role.includes('response') || 
    role.includes('dfir') || 
    role.includes('forensic') ||
    role.includes('hunt') ||
    role.includes('threat')
  ) {
    return {
      name: 'Defensive Security (Blue Team)',
      color: '#00f2fe',
      focus: 'SIEM deployments, log parsing, threat detection, incident response playbooks, and security monitoring operations.',
      certs: [
        { name: 'CompTIA Security+ (Bedrock Foundation)', desc: 'Crucial for basic vocabulary and hiring gates.' },
        { name: 'Blue Team Level 1 (BTL1) or CCD (Certified Cyber Defender)', desc: 'Hands-on practical blue team operations. Extremely highly regarded.' },
        { name: 'CompTIA CySA+ (Cybersecurity Analyst)', desc: 'Standard entry-to-mid level analyst credential.' },
        { name: 'GIAC Certified Incident Handler (GCIH)', desc: 'Premium incident management certification (optional/advanced).' }
      ],
      labs: [
        {
          title: 'Wazuh SIEM Home Lab Setup',
          steps: [
            'Spin up Wazuh Manager inside a Docker container or dedicated Ubuntu VM.',
            'Deploy Wazuh Agents onto at least two local virtual machines (e.g., Windows 10, Ubuntu Server).',
            'Configure Sysmon on the Windows VM to generate advanced telemetry, and pipe Sysmon logs to Wazuh.',
            'Simulate a credential-dumping or privilege-escalation attack (e.g., via Mimikatz) on the Windows agent.',
            'Verify that the Wazuh manager triggers alert rules and displays events on the Kibana/Wazuh dashboard.',
            'Write a custom detection rule inside Wazuh to detect specific commands (e.g., whoami query).'
          ]
        },
        {
          title: 'Active Directory Security Audit',
          steps: [
            'Set up a Windows Server VM acting as a Domain Controller (DC) in a local VirtualBox/VMware environment.',
            'Create active directory users, organizational units (OUs), and assign some users to domain administrator groups.',
            'Configure Windows Event Forwarding (WEF) or Sysmon auditing settings to track logins and security group changes.',
            'Audit the DC using PingCastle or BloodHound to map privilege paths and find weak GPOs.',
            'Write a mitigation report outlining how to disable LLMNR/NBT-NS and force SMB signing.'
          ]
        }
      ]
    };
  } else if (
    role.includes('pentest') || 
    role.includes('penetration') || 
    role.includes('red') || 
    role.includes('offensive') || 
    role.includes('exploit') || 
    role.includes('hack') || 
    role.includes('ethical') ||
    role.includes('bug') ||
    role.includes('bounty') ||
    role.includes('appsec') ||
    role.includes('application security') ||
    role.includes('web')
  ) {
    return {
      name: 'Offensive Security (Red Team / Pentesting)',
      color: '#f355da',
      focus: 'Exploit development, web app vulnerability scanning, active directory testing, post-exploitation scripts, and bug hunting workflows.',
      certs: [
        { name: 'eLearnSecurity Junior Penetration Tester (eJPT)', desc: 'Excellent hands-on entry-level ethical hacking exam.' },
        { name: 'Practical Network Penetration Tester (PNPT)', desc: 'Realistic active directory network pentest exam.' },
        { name: 'Offensive Security Certified Professional (OSCP)', desc: 'The gold standard hiring gate for penetration testers.' },
        { name: 'PortSwigger Certified Active Practitioner (OSWE/Burp)', desc: 'Excellent specialization for web application security.' }
      ],
      labs: [
        {
          title: 'Active Directory Hacking Sandbox',
          steps: [
            'Set up an Active Directory Forest containing 1 Domain Controller and 1 domain-joined Windows 10 client VM.',
            'Intentionally configure weak settings: enable LLMNR, configure a user service account with SPN (for Kerberoasting), and enable pre-authentication bypass (for AS-REP Roasting).',
            'Deploy Kali Linux VM on the same isolated host-only network.',
            'Use Responder to perform LLMNR poisoning and capture NTLM hashes.',
            'Use Impacket scripts to execute Kerberoasting and crack the service account password using Hashcat.',
            'Utilize BloodHound to map the attack path from the initial user to Domain Admin.'
          ]
        },
        {
          title: 'Web Application Pentest Environment',
          steps: [
            'Set up an OWASP Juice Shop or DVWA container locally using Docker.',
            'Configure Burp Suite Community/Pro to intercept traffic between your host browser and the container.',
            'Execute manual SQL injection to bypass login controls and dump user tables.',
            'Identify and exploit Cross-Site Scripting (XSS) and Insecure Direct Object References (IDOR).',
            'Draft a formal, professional penetration test report detailing remediation advice for developers.'
          ]
        }
      ]
    };
  } else {
    return {
      name: 'Governance, Risk, Compliance & Management (GRC)',
      color: '#ffc107',
      focus: 'Risk management frameworks, compliance audits (SOC 2, ISO 27001), corporate security policies, and third-party risk analysis.',
      certs: [
        { name: 'ISACA Certified Information Systems Auditor (CISA)', desc: 'Industry standard for IT auditing roles.' },
        { name: 'CompTIA Security+ (Bedrock Foundation)', desc: 'Ensures strong technical baseline for compliance analysts.' },
        { name: 'ISACA Certified in Risk and Information Systems Control (CRISC)', desc: 'Specialized enterprise risk management certification.' },
        { name: 'Certified Information Systems Security Professional (CISSP)', desc: 'The elite certificate for senior professionals and managers.' }
      ],
      labs: [
        {
          title: 'Enterprise Compliance Mapping Simulation',
          steps: [
            'Download a standard framework spreadsheet (e.g. NIST CSF or ISO 27001:2022 Controls).',
            'Conduct a simulated risk assessment on a mock startup (e.g. evaluating access controls, encryption, and backups).',
            'Draft a formal Information Security Policy (ISP) covering Password complexity, Acceptable Use, and Incident Response.',
            'Develop a Vendor Risk Assessment template to evaluate the security posture of third-party SaaS applications.',
            'Run a mock tabletop simulation for a ransomware event and document lessons learned.'
          ]
        },
        {
          title: 'Vulnerability Management & GRC Audit Lab',
          steps: [
            'Install OpenVAS or Nessus Essentials on a local VM.',
            'Run credentialed security scans against a local target host (e.g., Metasploitable).',
            'Export the scan reports and triage the vulnerabilities based on threat intelligence and business impact.',
            'Create a remediation checklist and track exception requests using risk registers.'
          ]
        }
      ]
    };
  }
}

// Generate the customized HTML/SVG roadmap
function generateRoadmapHtml(answers, track) {
  const years = parseInt(answers.backgroundYears) || 0;
  const certsList = answers.backgroundCerts || 'None';
  
  let gapKnowledge = years === 0 ? 85 : (years < 2 ? 55 : 30);
  let gapSkills = years === 0 ? 90 : (years < 2 ? 65 : 35);
  let gapTools = years === 0 ? 90 : (years < 2 ? 70 : 40);
  let gapCerts = certsList.toLowerCase() === 'none' || certsList === '' ? 95 : 55;
  let gapPortfolio = answers.triedSoFar.toLowerCase().includes('portfolio') || answers.triedSoFar.toLowerCase().includes('github') ? 45 : 85;
  let gapNetwork = answers.attemptsOutcome.toLowerCase().includes('referral') || answers.biggestObstacle.toLowerCase().includes('resume') ? 80 : 50;
  let gapMindset = years === 0 ? 75 : 40;
  let gapComm = years === 0 ? 80 : 45;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cybersec Career Coach - Interactive Roadmap</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Courier+Prime&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-color: #0b0f19;
      --card-bg: rgba(30, 41, 59, 0.4);
      --card-border: rgba(255, 255, 255, 0.08);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent-color: ${track.color};
      --accent-glow: rgba(${track.color === '#00f2fe' ? '0, 242, 254' : (track.color === '#f355da' ? '243, 85, 218' : '255, 193, 7')}, 0.3);
      --success-color: #10b981;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Outfit', sans-serif;
      background-color: var(--bg-color);
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(15, 23, 42, 0.9) 0%, transparent 60%),
        radial-gradient(circle at 90% 80%, var(--accent-glow) 0%, transparent 50%);
      color: var(--text-main);
      line-height: 1.6;
      padding: 40px 20px;
      min-height: 100vh;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
    }

    /* Header styling */
    header {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 40px;
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .profile-info h1 {
      font-size: 2.2rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #fff 0%, var(--accent-color) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 5px;
    }

    .profile-info p {
      color: var(--text-muted);
      font-size: 1.1rem;
    }

    .profile-info span {
      color: var(--accent-color);
      font-weight: 600;
    }

    .progress-widget {
      display: flex;
      align-items: center;
      gap: 20px;
      background: rgba(255, 255, 255, 0.03);
      padding: 15px 25px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .progress-ring-container {
      position: relative;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .progress-ring {
      position: absolute;
      top: 0;
      left: 0;
    }

    #progress-percentage {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .progress-text h3 {
      font-size: 1.1rem;
      margin-bottom: 2px;
    }

    .progress-text p {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    /* Grid Layout */
    .grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 40px;
    }

    @media (max-width: 900px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }

    /* Cards */
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 30px;
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
    }

    .card-title {
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 12px;
      color: var(--accent-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Timeline Styling */
    .timeline {
      position: relative;
      padding-left: 30px;
      border-left: 2px solid rgba(255, 255, 255, 0.08);
      margin-left: 10px;
    }

    .timeline-item {
      position: relative;
      margin-bottom: 40px;
    }

    .timeline-item:last-child {
      margin-bottom: 0;
    }

    .timeline-dot {
      position: absolute;
      left: -41px;
      top: 5px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--bg-color);
      border: 3px solid var(--accent-color);
      box-shadow: 0 0 10px var(--accent-color);
      z-index: 2;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .timeline-title {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .timeline-phase {
      font-size: 0.8rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 3px 8px;
      border-radius: 4px;
      color: var(--text-muted);
    }

    .timeline-content {
      color: var(--text-muted);
      font-size: 0.95rem;
    }

    .timeline-content ul {
      margin-top: 10px;
      padding-left: 20px;
    }

    .timeline-content li {
      margin-bottom: 5px;
    }

    /* Gap Analyzer */
    .gap-metric {
      margin-bottom: 20px;
    }

    .gap-metric:last-child {
      margin-bottom: 0;
    }

    .gap-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.95rem;
      margin-bottom: 6px;
    }

    .gap-name {
      font-weight: 600;
    }

    .gap-percent {
      color: var(--accent-color);
      font-weight: bold;
    }

    .gap-bar-bg {
      height: 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.03);
    }

    .gap-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-color) 0%, #fff 100%);
      box-shadow: 0 0 8px var(--accent-color);
      border-radius: 4px;
      transition: width 1s ease-out;
    }

    /* Checklist / Labs */
    .lab-section {
      margin-bottom: 30px;
    }

    .lab-section:last-child {
      margin-bottom: 0;
    }

    .lab-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .checkbox-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid rgba(255, 255, 255, 0.03);
      padding: 12px 15px;
      border-radius: 8px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .checkbox-item:hover {
      background: rgba(255, 255, 255, 0.03);
      border-color: rgba(255, 255, 255, 0.08);
      transform: translateX(2px);
    }

    .checkbox-item input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border: 2px solid var(--accent-color);
      border-radius: 4px;
      outline: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      margin-top: 3px;
      flex-shrink: 0;
    }

    .checkbox-item input[type="checkbox"]:checked {
      background-color: var(--accent-color);
      box-shadow: 0 0 8px var(--accent-color);
    }

    .checkbox-item input[type="checkbox"]:checked::before {
      content: '✓';
      color: var(--bg-color);
      font-size: 12px;
      font-weight: 800;
    }

    .checkbox-item input[type="checkbox"]:checked + .checkbox-label {
      text-decoration: line-through;
      color: var(--text-muted);
    }

    .checkbox-label {
      font-size: 0.95rem;
      color: var(--text-main);
      user-select: none;
    }

    .focus-badge {
      font-family: 'Courier Prime', monospace;
      background: rgba(${track.color === '#00f2fe' ? '0, 242, 254' : (track.color === '#f355da' ? '243, 85, 218' : '255, 193, 7')}, 0.1);
      border: 1px solid var(--accent-color);
      color: var(--accent-color);
      padding: 8px 15px;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-bottom: 20px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="profile-info">
        <h1>Career Roadmap & Labs</h1>
        <p>Target Role: <span>${answers.targetRole} (${answers.targetSeniority})</span> | Track: <span>${track.name}</span></p>
      </div>
      <div class="progress-widget">
        <div class="progress-ring-container">
          <svg class="progress-ring" width="80" height="80">
            <circle class="progress-ring-bg" stroke="rgba(255, 255, 255, 0.05)" stroke-width="6" fill="transparent" r="34" cx="40" cy="40"/>
            <circle id="progress-ring-circle" class="progress-ring-bar" stroke="var(--accent-color)" stroke-width="6" fill="transparent" r="34" cx="40" cy="40" style="stroke-dasharray: 213.63; stroke-dashoffset: 213.63; transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 0.35s;"/>
          </svg>
          <div id="progress-percentage">0%</div>
        </div>
        <div class="progress-text">
          <h3>Your Roadmap Progress</h3>
          <p>Complete labs and check items to track progress</p>
        </div>
      </div>
    </header>

    <div class="grid">
      <!-- Left Column: Timeline & Checklist -->
      <div class="left-col">
        <div class="card">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Structured Timeline
          </div>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-header">
                <div class="timeline-title">Stage 1: Bedrock Foundations</div>
                <div class="timeline-phase">Phase 0/1</div>
              </div>
              <div class="timeline-content">
                <p>Acquire foundational credentials and build initial local lab environment. Focus on vocabulary, basic networking, and target fundamentals.</p>
                <ul>
                  <li>Primary Certification: <strong>${track.certs[0].name}</strong> - ${track.certs[0].desc}</li>
                  <li>Secondary/Optional: <strong>${track.certs[1].name}</strong> - ${track.certs[1].desc}</li>
                  <li>Home Lab: Set up a virtualization environment (VirtualBox or VMware Workstation) to host guest virtual machines safely.</li>
                </ul>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-header">
                <div class="timeline-title">Stage 2: Core Engineering & Projects</div>
                <div class="timeline-phase">Phase 2/3</div>
              </div>
              <div class="timeline-content">
                <p>Build enterprise-grade labs and host custom configurations. Create public portfolio repositories as proof of work.</p>
                <ul>
                  <li>Primary Certification: <strong>${track.certs[2].name}</strong> - ${track.certs[2].desc}</li>
                  <li>Portfolio: Document lab builds, attack paths, or vulnerability analysis on GitHub or a personal security blog.</li>
                  <li>Critical Skill: Ability to explain security configurations, scripts, and logs in simple, risk-adjusted terms.</li>
                </ul>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-header">
                <div class="timeline-title">Stage 3: Market Transition & Specialization</div>
                <div class="timeline-phase">Phase 4/5</div>
              </div>
              <div class="timeline-content">
                <p>Clear standard resume filters with intermediate-to-advanced certifications. Initiate cold outreach campaigns to recruiters and security leaders.</p>
                <ul>
                  <li>Primary Certification: <strong>${track.certs[3].name}</strong> - ${track.certs[3].desc}</li>
                  <li>Networking: Engage with local security chapters (OWASP, BSides, DefCon) and publish technical notes.</li>
                  <li>Remediation: Refactor resume to highlight practical projects rather than generic list of terms.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Hands-on Lab Checklist
          </div>
          
          <div class="focus-badge">TRACK FOCUS: ${track.focus}</div>

          ${track.labs.map((lab, labIdx) => `
            <div class="lab-section">
              <div class="lab-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
                ${lab.title}
              </div>
              ${lab.steps.map((step, stepIdx) => {
                const stepId = `lab-${labIdx}-step-${stepIdx}`;
                return `
                  <label class="checkbox-item" for="${stepId}">
                    <input type="checkbox" id="${stepId}" onchange="saveProgress('${stepId}', this.checked)">
                    <span class="checkbox-label">${step}</span>
                  </label>
                `;
              }).join('')}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Right Column: 8-Dimension Gap Analyzer -->
      <div class="right-col">
        <div class="card">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
            8-Dimension Gap Analysis
          </div>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 25px;">Estimated gaps relative to target job requirements based on intake:</p>

          <div class="gap-metric">
            <div class="gap-info">
              <span class="gap-name">Knowledge Gaps</span>
              <span class="gap-percent">${gapKnowledge}%</span>
            </div>
            <div class="gap-bar-bg"><div class="gap-bar-fill" style="width: ${gapKnowledge}%"></div></div>
          </div>

          <div class="gap-metric">
            <div class="gap-info">
              <span class="gap-name">Skill Gaps</span>
              <span class="gap-percent">${gapSkills}%</span>
            </div>
            <div class="gap-bar-bg"><div class="gap-bar-fill" style="width: ${gapSkills}%"></div></div>
          </div>

          <div class="gap-metric">
            <div class="gap-info">
              <span class="gap-name">Tool Gaps</span>
              <span class="gap-percent">${gapTools}%</span>
            </div>
            <div class="gap-bar-bg"><div class="gap-bar-fill" style="width: ${gapTools}%"></div></div>
          </div>

          <div class="gap-metric">
            <div class="gap-info">
              <span class="gap-name">Certification Gaps</span>
              <span class="gap-percent">${gapCerts}%</span>
            </div>
            <div class="gap-bar-bg"><div class="gap-bar-fill" style="width: ${gapCerts}%"></div></div>
          </div>

          <div class="gap-metric">
            <div class="gap-info">
              <span class="gap-name">Portfolio Gaps</span>
              <span class="gap-percent">${gapPortfolio}%</span>
            </div>
            <div class="gap-bar-bg"><div class="gap-bar-fill" style="width: ${gapPortfolio}%"></div></div>
          </div>

          <div class="gap-metric">
            <div class="gap-info">
              <span class="gap-name">Network Gaps</span>
              <span class="gap-percent">${gapNetwork}%</span>
            </div>
            <div class="gap-bar-bg"><div class="gap-bar-fill" style="width: ${gapNetwork}%"></div></div>
          </div>

          <div class="gap-metric">
            <div class="gap-info">
              <span class="gap-name">Mindset Gaps</span>
              <span class="gap-percent">${gapMindset}%</span>
            </div>
            <div class="gap-bar-bg"><div class="gap-bar-fill" style="width: ${gapMindset}%"></div></div>
          </div>

          <div class="gap-metric">
            <div class="gap-info">
              <span class="gap-name">Communication Gaps</span>
              <span class="gap-percent">${gapComm}%</span>
            </div>
            <div class="gap-bar-bg"><div class="gap-bar-fill" style="width: ${gapComm}%"></div></div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            Remediation Guideline
          </div>
          <p style="font-size: 0.95rem; margin-bottom: 12px;"><strong>Rule of Thumb:</strong> Stop collecting paper certificates and start deploying configurations. You need at least two substantial, verifiable projects in your portfolio to get interviews.</p>
          <p style="font-size: 0.95rem; color: var(--text-muted);">Ensure your portfolio contains full lab write-ups, network topology diagrams, configuration details, and custom detection rules or exploit code.</p>
        </div>
      </div>
    </div>
  </div>

  <script>
    function saveProgress(id, checked) {
      localStorage.setItem('coach_roadmap_' + id, checked ? 'true' : 'false');
      updateOverallProgress();
    }

    function loadProgress() {
      const inputs = document.querySelectorAll('input[type="checkbox"]');
      inputs.forEach(input => {
        const val = localStorage.getItem('coach_roadmap_' + input.id);
        if (val === 'true') {
          input.checked = true;
        }
      });
      updateOverallProgress();
    }

    function updateOverallProgress() {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const checked = document.querySelectorAll('input[type="checkbox"]:checked');
      const percentage = Math.round((checked.length / checkboxes.length) * 100) || 0;
      
      document.getElementById('progress-percentage').innerText = percentage + '%';
      
      const circle = document.getElementById('progress-ring-circle');
      if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
      }
    }

    window.onload = loadProgress;
  </script>
</body>
</html>`;
}

// Main logic
async function main() {
  const args = process.argv.slice(2);
  let command = args[0] || 'start';

  // If the first argument is a flag, default command to 'start'
  if (command.startsWith('-')) {
    command = 'start';
  }

  // Help command / fallback
  if (args.includes('--help') || args.includes('-h') || command === 'help') {
    console.log(`
  ${pc.bold('Cybersec Career Coach CLI')}
  
  ${pc.yellow('Usage:')}
    npx cybersec-career-coach [command] [options]

  ${pc.yellow('Commands:')}
    start / run                         - Start the interactive career intake and diagnostic (default)
    caveman                             - Start the interactive diagnostic in Caveman style
    roadmap                             - Generate your interactive SVG/HTML career roadmap and lab checklist
    copy                                - Copy the full system prompt to your clipboard
    install                             - Install the modular skill folder to .skills/
    install --global / -g               - Install the skill globally in ~/.gemini/config/skills

  ${pc.yellow('Options:')}
    -g, --gemini                        - Force Google Gemini API provider (USA)
    -a, --anthropic                     - Force Anthropic Claude API provider (USA)
    --openai                            - Force OpenAI GPT API provider (USA)
    --groq                              - Force Groq API provider (USA)
    --openrouter                        - Force OpenRouter API provider (USA)
    --deepseek                          - Force DeepSeek API provider (China)
    --mistral                           - Force Mistral AI API provider (Europe)
    --cohere                            - Force Cohere API provider (Europe)
    --krutrim                           - Force Krutrim AI API provider (India)
    --sarvam                            - Force Sarvam AI API provider (India)
    --zhipu                             - Force Zhipu GLM API provider (China)
    --qwen                              - Force Alibaba Qwen API provider (China)
    --ollama                            - Force Local Ollama provider (completely free/local)
    -o, --output <filename>             - Direct report saving path (bypasses save prompt)
    -h, --help                          - Show this help message
    `);
    return;
  }

  let cliProvider = null;
  let outputFile = null;

  if (command === 'start' || command === 'run' || command === 'caveman' || command === 'roadmap') {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg === '--gemini' || arg === '-g') {
        cliProvider = 'gemini';
      } else if (arg === '--anthropic' || arg === '-a') {
        cliProvider = 'anthropic';
      } else if (arg === '--openai') {
        cliProvider = 'openai';
      } else if (arg === '--groq') {
        cliProvider = 'groq';
      } else if (arg === '--openrouter') {
        cliProvider = 'openrouter';
      } else if (arg === '--deepseek') {
        cliProvider = 'deepseek';
      } else if (arg === '--mistral') {
        cliProvider = 'mistral';
      } else if (arg === '--cohere') {
        cliProvider = 'cohere';
      } else if (arg === '--krutrim') {
        cliProvider = 'krutrim';
      } else if (arg === '--sarvam') {
        cliProvider = 'sarvam';
      } else if (arg === '--zhipu') {
        cliProvider = 'zhipu';
      } else if (arg === '--qwen') {
        cliProvider = 'qwen';
      } else if (arg === '--ollama') {
        cliProvider = 'ollama';
      } else if (arg.startsWith('--output=')) {
        outputFile = arg.split('=')[1];
      } else if (arg === '-o') {
        if (i + 1 < args.length) {
          outputFile = args[i + 1];
          i++;
        }
      }
    }
  }



  if (command === 'copy') {
    try {
      const promptPath = path.join(rootDir, 'cybersec-career-coach.md');
      const text = await fs.readFile(promptPath, 'utf8');
      await copyToClipboard(text);
      console.log(pc.green('✓ System prompt copied to clipboard successfully!'));
    } catch (err) {
      console.log(pc.red('Error copying to clipboard: ' + err.message));
      console.log(pc.yellow('Fallback: You can find the prompt file at:\n' + path.join(rootDir, 'cybersec-career-coach.md')));
    }
    return;
  }

  if (command === 'install') {
    const isGlobal = args.includes('--global') || args.includes('-g');
    let destDir;

    if (isGlobal) {
      // Install globally to standard config directory (e.g. ~/.gemini/config/skills)
      const home = process.env.HOME || process.env.USERPROFILE;
      destDir = path.join(home, '.gemini', 'config', 'skills', 'cybersec-career-coach.skill');
    } else {
      // Local install in current project
      destDir = path.join(process.cwd(), '.skills', 'cybersec-career-coach.skill');
    }

    try {
      const srcDir = path.join(rootDir, 'cybersec-career-coach.skill');
      await copyDir(srcDir, destDir);
      console.log(pc.green(`✓ Skill installed successfully at:\n  ${destDir}`));
    } catch (err) {
      console.log(pc.red('Error installing skill: ' + err.message));
    }
    return;
  }

  if (command === 'roadmap') {
    const cachePath = path.join(os.homedir(), '.cybersec-career-coach-cache.json');
    let answers;

    try {
      const cacheContent = await fs.readFile(cachePath, 'utf8');
      answers = JSON.parse(cacheContent);
      console.log(pc.green(`✓ Loaded intake answers from cache (Target: ${pc.bold(answers.targetRole)}).\n`));
    } catch (e) {
      console.log(pc.yellow('No cached profile found. Let\'s complete the intake first.'));
      answers = await runIntakeFlow();
      try {
        await fs.writeFile(cachePath, JSON.stringify(answers, null, 2), 'utf8');
      } catch (err) {}
    }

    const reportPath = outputFile || path.join(process.cwd(), 'cybersec-career-coach-roadmap.html');
    const targetReportPath = path.isAbsolute(reportPath) ? reportPath : path.resolve(process.cwd(), reportPath);

    try {
      const track = getTrackDetails(answers.targetRole);
      const htmlContent = generateRoadmapHtml(answers, track);
      await fs.writeFile(targetReportPath, htmlContent, 'utf8');
      console.log(pc.green(`✓ Visual career roadmap generated successfully at:\n  ${targetReportPath}\n`));
      console.log(pc.cyan('Open this HTML file in any browser to view your roadmap and track your lab checklist!'));
    } catch (err) {
      console.error(pc.red('Error generating roadmap: ' + err.message));
    }
    return;
  }

  if (command === 'start' || command === 'run' || command === 'caveman') {
    printHeader();

    const cachePath = path.join(os.homedir(), '.cybersec-career-coach-cache.json');
    let answers;
    let useCached = false;

    try {
      const cacheContent = await fs.readFile(cachePath, 'utf8');
      const cachedData = JSON.parse(cacheContent);
      console.log(pc.yellow(`Found answers from your last session (Target: ${pc.bold(cachedData.targetRole)}).\n`));
      
      const confirmChoice = await prompts({
        type: 'confirm',
        name: 'value',
        message: 'Would you like to reuse these cached answers?',
        initial: true
      });

      if (confirmChoice.value) {
        answers = cachedData;
        useCached = true;
        console.log(pc.green('\n✓ Loaded cached answers.\n'));
      } else {
        console.log(''); // spacer
      }
    } catch (e) {
      // Cache doesn't exist or is invalid, proceed to questionnaire
    }

    if (!useCached) {
      answers = await runIntakeFlow();
      try {
        await fs.writeFile(cachePath, JSON.stringify(answers, null, 2), 'utf8');
      } catch (e) {
        // Silent catch for cache write errors
      }
    }

    // Setup User prompt
    let formattedUserMsg = `
I have completed my Intake Questionnaire. Please perform a career diagnostic.

Q1 — Help Needed:
${answers.helpCategories.map(cat => `- ${cat}`).join('\n')}

Q2 — Current Background:
- Years of IT/Cybersec experience: ${answers.backgroundYears}
- Roles held: ${answers.backgroundRoles}
- Certifications currently held: ${answers.backgroundCerts}
- Degree: ${answers.backgroundDegree}

Q3 — Target Role & Career Objectives:
- Specific role target: ${answers.targetRole}
- Target Seniority: ${answers.targetSeniority}
- Location & Work Model: ${answers.targetLocation}
- Target Timeline: ${answers.targetTimeline}

Q4 — Steps Taken & Past Outcomes:
- Steps already taken: ${answers.triedSoFar}
- What did NOT work: ${answers.attemptsOutcome}

Q5 — Biggest Obstacle:
- Single biggest obstacle: ${answers.biggestObstacle}
    `.trim();

    if (command === 'caveman') {
      formattedUserMsg += `\n\n[CAVEMAN MODE ACTIVE] Speak exclusively in the Caveman Coach voice (extremely simplified, primitive, broken English/Hinglish, raw and blunt). No professional jargon.`;
    }

    // Determine LLM options
    let apiProvider = null;
    let apiKey = null;

    if (cliProvider) {
      apiProvider = cliProvider;
      if (cliProvider === 'gemini') apiKey = process.env.GEMINI_API_KEY;
      else if (cliProvider === 'anthropic') apiKey = process.env.ANTHROPIC_API_KEY;
      else if (cliProvider === 'openai') apiKey = process.env.OPENAI_API_KEY;
      else if (cliProvider === 'groq') apiKey = process.env.GROQ_API_KEY;
      else if (cliProvider === 'openrouter') apiKey = process.env.OPENROUTER_API_KEY;
      else if (cliProvider === 'deepseek') apiKey = process.env.DEEPSEEK_API_KEY;
      else if (cliProvider === 'mistral') apiKey = process.env.MISTRAL_API_KEY;
      else if (cliProvider === 'cohere') apiKey = process.env.COHERE_API_KEY;
      else if (cliProvider === 'krutrim') apiKey = process.env.KRUTRIM_API_KEY;
      else if (cliProvider === 'sarvam') apiKey = process.env.SARVAM_API_KEY;
      else if (cliProvider === 'zhipu') apiKey = process.env.ZHIPU_API_KEY;
      else if (cliProvider === 'qwen') apiKey = process.env.DASHSCOPE_API_KEY;
      else if (cliProvider === 'ollama') apiKey = 'ollama-local';
    } else {
      if (process.env.GEMINI_API_KEY) {
        apiProvider = 'gemini';
        apiKey = process.env.GEMINI_API_KEY;
      } else if (process.env.ANTHROPIC_API_KEY) {
        apiProvider = 'anthropic';
        apiKey = process.env.ANTHROPIC_API_KEY;
      } else if (process.env.OPENAI_API_KEY) {
        apiProvider = 'openai';
        apiKey = process.env.OPENAI_API_KEY;
      } else if (process.env.GROQ_API_KEY) {
        apiProvider = 'groq';
        apiKey = process.env.GROQ_API_KEY;
      } else if (process.env.OPENROUTER_API_KEY) {
        apiProvider = 'openrouter';
        apiKey = process.env.OPENROUTER_API_KEY;
      } else if (process.env.DEEPSEEK_API_KEY) {
        apiProvider = 'deepseek';
        apiKey = process.env.DEEPSEEK_API_KEY;
      } else if (process.env.MISTRAL_API_KEY) {
        apiProvider = 'mistral';
        apiKey = process.env.MISTRAL_API_KEY;
      } else if (process.env.COHERE_API_KEY) {
        apiProvider = 'cohere';
        apiKey = process.env.COHERE_API_KEY;
      } else if (process.env.KRUTRIM_API_KEY) {
        apiProvider = 'krutrim';
        apiKey = process.env.KRUTRIM_API_KEY;
      } else if (process.env.SARVAM_API_KEY) {
        apiProvider = 'sarvam';
        apiKey = process.env.SARVAM_API_KEY;
      } else if (process.env.ZHIPU_API_KEY) {
        apiProvider = 'zhipu';
        apiKey = process.env.ZHIPU_API_KEY;
      } else if (process.env.DASHSCOPE_API_KEY) {
        apiProvider = 'qwen';
        apiKey = process.env.DASHSCOPE_API_KEY;
      }
    }

    if (!apiKey && apiProvider !== 'ollama') {
      let selectedProvider = cliProvider;
      if (!selectedProvider) {
        const apiChoice = await prompts({
          type: 'select',
          name: 'choice',
          message: 'No LLM API keys found in environment. How would you like to proceed?',
          choices: [
            { title: 'Google Gemini (USA / Free tier available)', value: 'gemini' },
            { title: 'Anthropic Claude (USA)', value: 'anthropic' },
            { title: 'OpenAI GPT (USA)', value: 'openai' },
            { title: 'Groq (USA / Free tier available)', value: 'groq' },
            { title: 'OpenRouter (USA / Free models available)', value: 'openrouter' },
            { title: 'DeepSeek (China / High-efficiency)', value: 'deepseek' },
            { title: 'Mistral AI (Europe)', value: 'mistral' },
            { title: 'Cohere (Europe)', value: 'cohere' },
            { title: 'Krutrim AI (India)', value: 'krutrim' },
            { title: 'Sarvam AI (India)', value: 'sarvam' },
            { title: 'Zhipu GLM (China)', value: 'zhipu' },
            { title: 'Alibaba Qwen (China)', value: 'qwen' },
            { title: 'Ollama (Local / Completely Free)', value: 'ollama' },
            { title: 'No key — Just display the compiled prompt (to paste manually)', value: 'none' }
          ]
        });
        selectedProvider = apiChoice.choice;
      }

      if (selectedProvider === 'none') {
        console.log(pc.yellow('\nHere is your formatted intake payload. Copy and paste this to the Coach:'));
        console.log(pc.gray('--------------------------------------------------'));
        console.log(formattedUserMsg);
        console.log(pc.gray('--------------------------------------------------'));
        return;
      }

      if (selectedProvider === 'ollama') {
        apiProvider = 'ollama';
        apiKey = 'ollama-local';
      } else if (selectedProvider) {
        const keyNames = {
          gemini: 'Gemini',
          anthropic: 'Anthropic',
          openai: 'OpenAI',
          groq: 'Groq',
          openrouter: 'OpenRouter',
          deepseek: 'DeepSeek',
          mistral: 'Mistral',
          cohere: 'Cohere',
          krutrim: 'Krutrim',
          sarvam: 'Sarvam',
          zhipu: 'Zhipu/GLM',
          qwen: 'DashScope/Qwen'
        };
        const keyInput = await prompts({
          type: 'password',
          name: 'key',
          message: `Please paste your ${keyNames[selectedProvider]} API Key:`
        });
        apiKey = keyInput.key;
        apiProvider = selectedProvider;
      }
    }

    if (!apiKey || !apiProvider) {
      console.log(pc.red('Missing API provider or API key. Exiting.'));
      return;
    }

    let ollamaModel = 'llama3';
    if (apiProvider === 'ollama') {
      const modelPrompt = await prompts({
        type: 'text',
        name: 'model',
        message: 'Enter the name of your local Ollama model (e.g. llama3, llama3.1, mistral, codellama):',
        initial: 'llama3'
      });
      ollamaModel = modelPrompt.model || 'llama3';
    }

    const providerNames = {
      gemini: 'Gemini',
      anthropic: 'Claude',
      openai: 'OpenAI GPT',
      groq: 'Groq (Llama-3.1)',
      openrouter: 'OpenRouter (Llama-3)',
      deepseek: 'DeepSeek',
      mistral: 'Mistral',
      cohere: 'Cohere',
      krutrim: 'Krutrim',
      sarvam: 'Sarvam',
      zhipu: 'Zhipu GLM',
      qwen: 'Alibaba Qwen',
      ollama: `Ollama (${ollamaModel})`
    };

    console.log(pc.yellow(`\nChannelling the Coach via ${providerNames[apiProvider]}...`));

    try {
      const systemPromptPath = path.join(rootDir, 'cybersec-career-coach.md');
      const systemPrompt = await fs.readFile(systemPromptPath, 'utf8');

      // Loading indicator
      let dots = 0;
      const interval = setInterval(() => {
        process.stdout.write(`\r${pc.cyan('Analyzing intake data' + '.'.repeat(dots % 4) + ' '.repeat(3 - (dots % 4)))}`);
        dots++;
      }, 300);

      const diagnosticResponse = await callLLM(systemPrompt, formattedUserMsg, apiProvider, apiKey, { ollamaModel });

      clearInterval(interval);
      process.stdout.write('\r' + ' '.repeat(40) + '\r'); // Clear loading line

      console.log(pc.bold(pc.green('\n--- COACH DIAGNOSTIC RESPONSE ---')));
      console.log(diagnosticResponse);
      console.log(pc.bold(pc.green('----------------------------------\n')));

      const reportContent = `
# Cybersec Career Coach Diagnostic Report

**Generated on:** ${new Date().toLocaleDateString()}
**Target Role:** ${answers.targetRole} (${answers.targetSeniority})

---

${diagnosticResponse}
      `.trim();

      let targetReportPath;
      if (outputFile) {
        targetReportPath = path.isAbsolute(outputFile) ? outputFile : path.resolve(process.cwd(), outputFile);
        await fs.writeFile(targetReportPath, reportContent, 'utf8');
        console.log(pc.green(`\n✓ Report saved successfully to:\n  ${targetReportPath}\n`));
      } else {
        const saveChoice = await prompts({
          type: 'confirm',
          name: 'value',
          message: 'Would you like to save this diagnostic report as a Markdown file in your current directory?',
          initial: true
        });

        if (saveChoice.value) {
          targetReportPath = path.join(process.cwd(), 'cybersec-career-coach-report.md');
          await fs.writeFile(targetReportPath, reportContent, 'utf8');
          console.log(pc.green(`\n✓ Report saved successfully to:\n  ${targetReportPath}\n`));
        }
      }
    } catch (err) {
      console.log(pc.red('\nFailed to generate diagnostic: ' + err.message));
    }
    return;
  }

  // Help command / fallback
  console.log(`
  ${pc.bold('Cybersec Career Coach CLI')}
  
  ${pc.yellow('Usage:')}
    npx cybersec-career-coach [command] [options]

  ${pc.yellow('Commands:')}
    start / run                         - Start the interactive career intake and diagnostic (default)
    caveman                             - Start the interactive diagnostic in Caveman style
    roadmap                             - Generate your interactive SVG/HTML career roadmap and lab checklist
    copy                                - Copy the full system prompt to your clipboard
    install                             - Install the modular skill folder to .skills/
    install --global / -g               - Install the skill globally in ~/.gemini/config/skills

  ${pc.yellow('Options:')}
    -g, --gemini                        - Force Google Gemini API provider (USA)
    -a, --anthropic                     - Force Anthropic Claude API provider (USA)
    --openai                            - Force OpenAI GPT API provider (USA)
    --groq                              - Force Groq API provider (USA)
    --openrouter                        - Force OpenRouter API provider (USA)
    --deepseek                          - Force DeepSeek API provider (China)
    --mistral                           - Force Mistral AI API provider (Europe)
    --cohere                            - Force Cohere API provider (Europe)
    --krutrim                           - Force Krutrim AI API provider (India)
    --sarvam                            - Force Sarvam AI API provider (India)
    --zhipu                             - Force Zhipu GLM API provider (China)
    --qwen                              - Force Alibaba Qwen API provider (China)
    --ollama                            - Force Local Ollama provider (completely free/local)
    -o, --output <filename>             - Direct report saving path (bypasses save prompt)
    -h, --help                          - Show this help message
  `);
}

main().catch(err => {
  console.error(pc.red('Fatal error: ' + err.message));
  process.exit(1);
});
