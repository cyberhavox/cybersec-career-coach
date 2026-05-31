#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import prompts from 'prompts';
import pc from 'picocolors';
import { mockResponses } from './mock_responses.js';
import { generateComparisonHTML } from './html_generator.js';

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
  console.log(pc.cyan(`
  🔐  ${pc.bold('GATEBREAKER')}
  ${pc.dim('Brutally Honest Career Diagnostics & Actionable Roadmaps')}
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

// Call LLM API (Gemini or Anthropic)
async function callLLM(systemPrompt, userMessage, provider, apiKey) {
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
  } else {
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
}

// Main logic
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'start';

  if (command === 'copy') {
    try {
      const promptPath = path.join(rootDir, 'gatebreaker.md');
      const text = await fs.readFile(promptPath, 'utf8');
      await copyToClipboard(text);
      console.log(pc.green('✓ System prompt copied to clipboard successfully!'));
    } catch (err) {
      console.log(pc.red('Error copying to clipboard: ' + err.message));
      console.log(pc.yellow('Fallback: You can find the prompt file at:\n' + path.join(rootDir, 'gatebreaker.md')));
    }
    return;
  }

  if (command === 'install') {
    const isGlobal = args.includes('--global') || args.includes('-g');
    let destDir;

    if (isGlobal) {
      // Install globally to standard config directory (e.g. ~/.gemini/config/skills)
      const home = process.env.HOME || process.env.USERPROFILE;
      destDir = path.join(home, '.gemini', 'config', 'skills', 'gatebreaker.skill');
    } else {
      // Local install in current project
      destDir = path.join(process.cwd(), '.skills', 'gatebreaker.skill');
    }

    try {
      const srcDir = path.join(rootDir, 'gatebreaker.skill');
      await copyDir(srcDir, destDir);
      console.log(pc.green(`✓ Skill installed successfully at:\n  ${destDir}`));
    } catch (err) {
      console.log(pc.red('Error installing skill: ' + err.message));
    }
    return;
  }

  if (command === 'compare' || command === 'simulate') {
    printHeader();
    console.log(pc.cyan('🔮 Welcome to the Expert Simulation Arena!'));
    console.log(pc.dim('Compare how different security legends analyze your CV side-by-side.\n'));

    // 1. Choose profile
    const profileChoice = await prompts({
      type: 'select',
      name: 'value',
      message: 'Select a profile to analyze:',
      choices: [
        { title: 'The Cert Collector (Sample Resume)', value: 'cert_collector' },
        { title: 'The Software Engineer Career Pivot (Sample Resume)', value: 'career_pivot' },
        { title: 'The Stuck SOC Analyst (Sample Resume)', value: 'stuck_soc' },
        { title: 'Load custom profile (from text file)', value: 'file' },
        { title: 'Paste custom profile / CV text directly', value: 'paste' }
      ]
    });

    if (!profileChoice.value) {
      console.log(pc.red('No profile selected. Exiting.'));
      return;
    }

    let profileText = '';
    let profileTitle = '';

    if (profileChoice.value === 'file') {
      const fileInput = await prompts({
        type: 'text',
        name: 'path',
        message: 'Enter the absolute or relative path to the text file:'
      });

      if (!fileInput.path) {
        console.log(pc.red('No file path provided. Exiting.'));
        return;
      }

      try {
        profileText = await fs.readFile(path.resolve(fileInput.path), 'utf8');
        profileTitle = path.basename(fileInput.path);
      } catch (err) {
        console.log(pc.red(`Failed to read file: ${err.message}`));
        return;
      }
    } else if (profileChoice.value === 'paste') {
      const pasteInput = await prompts({
        type: 'text',
        name: 'content',
        message: 'Paste your CV / profile text here:'
      });

      if (!pasteInput.content) {
        console.log(pc.red('No content provided. Exiting.'));
        return;
      }

      profileText = pasteInput.content;
      profileTitle = 'Pasted Custom Profile';
    } else {
      // Load one of our samples
      const samplePath = path.join(rootDir, 'samples', `${profileChoice.value}.txt`);
      try {
        profileText = await fs.readFile(samplePath, 'utf8');
        if (profileChoice.value === 'cert_collector') profileTitle = 'The Cert Collector';
        if (profileChoice.value === 'career_pivot') profileTitle = 'The Software Engineer Career Pivot';
        if (profileChoice.value === 'stuck_soc') profileTitle = 'The Stuck SOC Analyst';
      } catch (err) {
        console.log(pc.red(`Failed to read sample profile: ${err.message}`));
        return;
      }
    }

    // 2. Ask for target role
    let initialRole = 'SOC Analyst L1';
    if (profileChoice.value === 'career_pivot') initialRole = 'AppSec Engineer';
    if (profileChoice.value === 'stuck_soc') initialRole = 'Incident Responder';

    const roleChoice = await prompts({
      type: 'text',
      name: 'role',
      message: 'What target security role is this profile aiming for?',
      initial: initialRole
    });

    if (!roleChoice.role) {
      console.log(pc.red('No target role provided. Exiting.'));
      return;
    }

    // 3. Choose experts
    const expertChoice = await prompts({
      type: 'multiselect',
      name: 'experts',
      message: 'Select experts to compare (Select 2 to 4 recommended):',
      choices: [
        { title: 'Sun Tzu (Offensive Strategy & Deception)', value: 'sun_tzu' },
        { title: 'Bruce Schneier (Process & Policy Realism)', value: 'bruce_schneier' },
        { title: 'Kevin Mitnick (Human Factors & Intrusion)', value: 'kevin_mitnick' },
        { title: 'Naomi Buckwalter (Hiring Reform & AppSec)', value: 'naomi_buckwalter' },
        { title: 'Dmitri Alperovitch (Threat Intelligence & Geopolitics)', value: 'dmitri_alperovitch' },
        { title: 'Lenny Zeltser (Malware Analysis)', value: 'lenny_zeltser' },
        { title: 'Dr. Eric Cole (C-Suite Risk Translation)', value: 'dr_eric_cole' },
        { title: 'Marcus Aurelius (Stoic Composure & Crisis Management)', value: 'marcus_aurelius' }
      ],
      min: 1
    });

    if (!expertChoice.experts || expertChoice.experts.length === 0) {
      console.log(pc.red('No experts selected. Exiting.'));
      return;
    }

    const selectedExperts = expertChoice.experts;

    // Define expert persona prompts
    const expertInstructions = {
      sun_tzu: "Adopt the exclusive persona of Sun Tzu (~500 BC), author of The Art of War. Focus on offensive/defensive strategy, deception, terrain, and adversary simulation. Provide brutally honest career advice in this specific style.",
      bruce_schneier: "Adopt the exclusive persona of Bruce Schneier. Focus on security processes vs. products, security theater, policy realism, and systemic design. Provide brutally honest career advice in this specific style.",
      kevin_mitnick: "Adopt the exclusive persona of Kevin Mitnick. Focus on human factors, social engineering, physical security bypasses, and practical intrusion methodologies. Provide brutally honest career advice in this specific style.",
      naomi_buckwalter: "Adopt the exclusive persona of Naomi Buckwalter. Focus on AppSec, developer empathy, hiring reform, bypassing gatekeeping, and practical portfolio building. Provide brutally honest career advice in this specific style.",
      dmitri_alperovitch: "Adopt the exclusive persona of Dmitri Alperovitch. Focus on cyber threat intelligence, geopolitics, nation-state actor attribution, and board-level risk. Provide brutally honest career advice in this specific style.",
      lenny_zeltser: "Adopt the exclusive persona of Lenny Zeltser. Focus on malware analysis, reverse engineering toolkit design, threat triage, and educational path building. Provide brutally honest career advice in this specific style.",
      dr_eric_cole: "Adopt the exclusive persona of Dr. Eric Cole. Focus on translating technical risk into business risk and dollars, executive metrics, C-suite communication, and pragmatism. Provide brutally honest career advice in this specific style.",
      marcus_aurelius: "Adopt the exclusive persona of Marcus Aurelius. Focus on stoic composure, crisis management under uncertainty, rational response to breaches, and mental resilience. Provide brutally honest career advice in this specific style."
    };

    // 4. API keys check & run
    let apiProvider = null;
    let apiKey = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;

    if (process.env.GEMINI_API_KEY) {
      apiProvider = 'gemini';
    } else if (process.env.ANTHROPIC_API_KEY) {
      apiProvider = 'anthropic';
    }

    const isPreloadedSample = ['cert_collector', 'career_pivot', 'stuck_soc'].includes(profileChoice.value);
    const hasMockForSelectedExperts = selectedExperts.every(e => ['sun_tzu', 'bruce_schneier', 'kevin_mitnick', 'naomi_buckwalter'].includes(e));

    const results = {};

    if (!apiKey && isPreloadedSample && hasMockForSelectedExperts) {
      console.log(pc.yellow('\nℹ No API keys found. Running in Mock Fallback Mode using pre-rendered expert reviews.'));
      
      // Load mock responses
      for (const expertKey of selectedExperts) {
        results[expertKey] = mockResponses[profileChoice.value][expertKey];
      }
    } else {
      // Require API key
      if (!apiKey) {
        const apiChoice = await prompts({
          type: 'select',
          name: 'choice',
          message: 'No API keys found in environment. How would you like to proceed?',
          choices: [
            { title: 'Enter a Google Gemini API Key', value: 'gemini' },
            { title: 'Enter an Anthropic Claude API Key', value: 'anthropic' },
            { title: 'Cancel simulation', value: 'cancel' }
          ]
        });

        if (apiChoice.choice === 'cancel' || !apiChoice.choice) {
          console.log(pc.red('Simulation cancelled.'));
          return;
        }

        const keyInput = await prompts({
          type: 'password',
          name: 'key',
          message: `Please paste your ${apiChoice.choice === 'gemini' ? 'Gemini' : 'Anthropic'} API Key:`
        });
        apiKey = keyInput.key;
        apiProvider = apiChoice.choice;
      }

      if (!apiKey || !apiProvider) {
        console.log(pc.red('Missing API provider or API key. Exiting.'));
        return;
      }

      console.log(pc.yellow(`\nGenerating comparative analysis via ${apiProvider === 'gemini' ? 'Gemini' : 'Anthropic'} for ${selectedExperts.length} experts...`));

      try {
        const systemPromptPath = path.join(rootDir, 'gatebreaker.md');
        const systemPrompt = await fs.readFile(systemPromptPath, 'utf8');

        // Loading indicator
        let dots = 0;
        const interval = setInterval(() => {
          process.stdout.write(`\r${pc.cyan('Simulating experts' + '.'.repeat(dots % 4) + ' '.repeat(3 - (dots % 4)))}`);
          dots++;
        }, 300);

        const promises = selectedExperts.map(async (expertKey) => {
          const expertInstruction = expertInstructions[expertKey];
          const expertSystemPrompt = systemPrompt + "\n\nCRITICAL INSTRUCTION: " + expertInstruction;
          
          const userMsg = `
Analyze the following profile for the target role: "${roleChoice.role}".
Adopting the exclusive persona and philosophy of your character, deliver a brutally honest diagnostic review.

PROFILE / CV:
${profileText}
          `.trim();

          const response = await callLLM(expertSystemPrompt, userMsg, apiProvider, apiKey);
          return { expertKey, response };
        });

        const outputs = await Promise.all(promises);
        clearInterval(interval);
        process.stdout.write('\r' + ' '.repeat(40) + '\r'); // Clear loading line

        for (const out of outputs) {
          results[out.expertKey] = out.response;
        }
      } catch (err) {
        console.log(pc.red('\nFailed to generate comparative analysis: ' + err.message));
        return;
      }
    }

    // 5. Generate HTML and open in browser
    const outputPath = path.join(process.cwd(), 'expert-comparison.html');
    console.log(pc.yellow('Generating visualization dashboard...'));

    const profileData = {
      title: profileTitle,
      content: profileText
    };

    try {
      await generateComparisonHTML(profileData, roleChoice.role, results, outputPath);
      console.log(pc.green(`\n✓ Comparison dashboard generated successfully!`));
      console.log(pc.cyan(`  File Location: file:///${outputPath.replace(/\\/g, '/')}`));

      console.log(pc.yellow('\nLaunching dashboard in your browser...'));
      if (process.platform === 'win32') {
        spawn('cmd', ['/c', `start "" "${outputPath}"`]);
      } else if (process.platform === 'darwin') {
        spawn('open', [outputPath]);
      } else {
        spawn('xdg-open', [outputPath]);
      }
    } catch (err) {
      console.log(pc.red(`Failed to generate HTML report: ${err.message}`));
    }

    return;
  }

  if (command === 'start' || command === 'run' || command === 'caveman') {
    printHeader();
    const answers = await runIntakeFlow();

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
    let apiKey = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;

    if (process.env.GEMINI_API_KEY) {
      apiProvider = 'gemini';
    } else if (process.env.ANTHROPIC_API_KEY) {
      apiProvider = 'anthropic';
    }

    if (!apiKey) {
      const apiChoice = await prompts({
        type: 'select',
        name: 'choice',
        message: 'No LLM API keys found in environment. How would you like to proceed?',
        choices: [
          { title: 'Enter a Google Gemini API Key', value: 'gemini' },
          { title: 'Enter an Anthropic Claude API Key', value: 'anthropic' },
          { title: 'No key — Just display the compiled prompt (to paste manually)', value: 'none' }
        ]
      });

      if (apiChoice.choice === 'none') {
        console.log(pc.yellow('\nHere is your formatted intake payload. Copy and paste this to the Coach:'));
        console.log(pc.gray('--------------------------------------------------'));
        console.log(formattedUserMsg);
        console.log(pc.gray('--------------------------------------------------'));
        return;
      }

      if (apiChoice.choice === 'gemini' || apiChoice.choice === 'anthropic') {
        const keyInput = await prompts({
          type: 'password',
          name: 'key',
          message: `Please paste your ${apiChoice.choice === 'gemini' ? 'Gemini' : 'Anthropic'} API Key:`
        });
        apiKey = keyInput.key;
        apiProvider = apiChoice.choice;
      }
    }

    if (!apiKey || !apiProvider) {
      console.log(pc.red('Missing API provider or API key. Exiting.'));
      return;
    }

    console.log(pc.yellow(`\nChannelling the Coach via ${apiProvider === 'gemini' ? 'Gemini' : 'Anthropic'}...`));

    try {
      const systemPromptPath = path.join(rootDir, 'gatebreaker.md');
      const systemPrompt = await fs.readFile(systemPromptPath, 'utf8');

      // Loading indicator
      let dots = 0;
      const interval = setInterval(() => {
        process.stdout.write(`\r${pc.cyan('Analyzing intake data' + '.'.repeat(dots % 4) + ' '.repeat(3 - (dots % 4)))}`);
        dots++;
      }, 300);

      const diagnosticResponse = await callLLM(systemPrompt, formattedUserMsg, apiProvider, apiKey);

      clearInterval(interval);
      process.stdout.write('\r' + ' '.repeat(40) + '\r'); // Clear loading line

      console.log(pc.bold(pc.green('\n--- COACH DIAGNOSTIC RESPONSE ---')));
      console.log(diagnosticResponse);
      console.log(pc.bold(pc.green('----------------------------------\n')));
    } catch (err) {
      console.log(pc.red('\nFailed to generate diagnostic: ' + err.message));
    }
    return;
  }

  // Help command / fallback
  console.log(`
  ${pc.bold('Gatebreaker CLI')}
  
  ${pc.yellow('Usage:')}
    npx gatebreaker           ${pc.dim('- Start the interactive career intake and diagnostic')}
    npx gatebreaker caveman   ${pc.dim('- Start the interactive diagnostic in Caveman style')}
    npx gatebreaker compare   ${pc.dim('- Run side-by-side expert comparison simulator')}
    npx gatebreaker copy      ${pc.dim('- Copy the full system prompt to your clipboard')}
    npx gatebreaker install   ${pc.dim('- Install the modular skill folder to .skills/')}
    npx gatebreaker install --global  ${pc.dim('- Install the skill globally in ~/.gemini/config/skills')}
  `);
}

main().catch(err => {
  console.error(pc.red('Fatal error: ' + err.message));
  process.exit(1);
});
