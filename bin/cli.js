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
    copy                                - Copy the full system prompt to your clipboard
    install                             - Install the modular skill folder to .skills/
    install --global / -g               - Install the skill globally in ~/.gemini/config/skills

  ${pc.yellow('Options:')}
    -g, --gemini                        - Force Google Gemini API provider
    -a, --anthropic                     - Force Anthropic Claude API provider
    -o, --output <filename>             - Direct report saving path (bypasses save prompt)
    -h, --help                          - Show this help message
    `);
    return;
  }

  let cliProvider = null;
  let outputFile = null;

  if (command === 'start' || command === 'run' || command === 'caveman') {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg === '--gemini' || arg === '-g') {
        cliProvider = 'gemini';
      } else if (arg === '--anthropic' || arg === '-a') {
        cliProvider = 'anthropic';
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
      apiKey = cliProvider === 'gemini' ? process.env.GEMINI_API_KEY : process.env.ANTHROPIC_API_KEY;
    } else {
      if (process.env.GEMINI_API_KEY) {
        apiProvider = 'gemini';
        apiKey = process.env.GEMINI_API_KEY;
      } else if (process.env.ANTHROPIC_API_KEY) {
        apiProvider = 'anthropic';
        apiKey = process.env.ANTHROPIC_API_KEY;
      }
    }

    if (!apiKey) {
      let selectedProvider = cliProvider;
      if (!selectedProvider) {
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
        selectedProvider = apiChoice.choice;
      }

      if (selectedProvider === 'none') {
        console.log(pc.yellow('\nHere is your formatted intake payload. Copy and paste this to the Coach:'));
        console.log(pc.gray('--------------------------------------------------'));
        console.log(formattedUserMsg);
        console.log(pc.gray('--------------------------------------------------'));
        return;
      }

      if (selectedProvider === 'gemini' || selectedProvider === 'anthropic') {
        const keyInput = await prompts({
          type: 'password',
          name: 'key',
          message: `Please paste your ${selectedProvider === 'gemini' ? 'Gemini' : 'Anthropic'} API Key:`
        });
        apiKey = keyInput.key;
        apiProvider = selectedProvider;
      }
    }

    if (!apiKey || !apiProvider) {
      console.log(pc.red('Missing API provider or API key. Exiting.'));
      return;
    }

    console.log(pc.yellow(`\nChannelling the Coach via ${apiProvider === 'gemini' ? 'Gemini' : 'Anthropic'}...`));

    try {
      const systemPromptPath = path.join(rootDir, 'cybersec-career-coach.md');
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
    copy                                - Copy the full system prompt to your clipboard
    install                             - Install the modular skill folder to .skills/
    install --global / -g               - Install the skill globally in ~/.gemini/config/skills

  ${pc.yellow('Options:')}
    -g, --gemini                        - Force Google Gemini API provider
    -a, --anthropic                     - Force Anthropic Claude API provider
    -o, --output <filename>             - Direct report saving path (bypasses save prompt)
    -h, --help                          - Show this help message
  `);
}

main().catch(err => {
  console.error(pc.red('Fatal error: ' + err.message));
  process.exit(1);
});
