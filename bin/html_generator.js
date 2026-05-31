import { promises as fs } from 'fs';
import path from 'path';

// Expert attributes for the visual bars
const expertAttributes = {
  sun_tzu: { offensive: 95, process: 40, human: 50, tech: 30 },
  bruce_schneier: { offensive: 60, process: 95, human: 80, tech: 65 },
  kevin_mitnick: { offensive: 85, process: 50, human: 98, tech: 40 },
  naomi_buckwalter: { offensive: 40, process: 75, human: 85, tech: 90 },
  dmitri_alperovitch: { offensive: 80, process: 80, human: 60, tech: 50 },
  lenny_zeltser: { offensive: 70, process: 60, human: 40, tech: 95 },
  dr_eric_cole: { offensive: 30, process: 90, human: 75, tech: 50 },
  marcus_aurelius: { offensive: 30, process: 85, human: 90, tech: 30 }
};

const expertNames = {
  sun_tzu: 'Sun Tzu',
  bruce_schneier: 'Bruce Schneier',
  kevin_mitnick: 'Kevin Mitnick',
  naomi_buckwalter: 'Naomi Buckwalter',
  dmitri_alperovitch: 'Dmitri Alperovitch',
  lenny_zeltser: 'Lenny Zeltser',
  dr_eric_cole: 'Dr. Eric Cole',
  marcus_aurelius: 'Marcus Aurelius'
};

const expertSubtitles = {
  sun_tzu: 'Offensive Strategy & Deception',
  bruce_schneier: 'Process Realism & Security Theater',
  kevin_mitnick: 'Human Factors & Intrusion Psychology',
  naomi_buckwalter: 'Hiring Reform & AppSec/DevSecOps',
  dmitri_alperovitch: 'Threat Intelligence & Geopolitics',
  lenny_zeltser: 'Triage-First Malware Analysis',
  dr_eric_cole: 'C-Suite Translation & Risk Economics',
  marcus_aurelius: 'Stoic Composure & Crisis Management'
};

const expertAvatars = {
  sun_tzu: 'https://images.unsplash.com/photo-1599834562135-b6fc90e74ad2?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // placeholder for historical/strategic
  bruce_schneier: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // tech expert style
  kevin_mitnick: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // hacker style
  naomi_buckwalter: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // female tech lead
  dmitri_alperovitch: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  lenny_zeltser: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  dr_eric_cole: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  marcus_aurelius: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
};

/**
 * Converts markdown text to simple HTML elements
 */
function parseMarkdown(md) {
  if (!md) return '';
  let html = md;
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="expert-section-title">$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4 class="expert-section-sub">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="expert-main-title">$1</h2>');
  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote class="expert-quote">$1</blockquote>');
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Lists
  html = html.replace(/^\s*\-\s*(.*$)/gim, '<li>$1</li>');
  // Wrap list items
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  // Clean double wrapping of <ul>
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  // Line breaks / paragraphs
  html = html.split('\n\n').map(p => {
    if (p.trim().startsWith('<h') || p.trim().startsWith('<blockquote') || p.trim().startsWith('<ul') || p.trim().startsWith('<li')) {
      return p;
    }
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');
  return html;
}

export async function generateComparisonHTML(profileData, targetRole, results, outputPath) {
  const profileName = profileData.title || 'Custom Profile';
  const profileContent = profileData.content || '';

  // Render columns for each expert
  const columnsHtml = Object.keys(results).map(expertKey => {
    const name = expertNames[expertKey] || expertKey;
    const subtitle = expertSubtitles[expertKey] || 'Security Legend';
    const rawContent = results[expertKey];
    const parsedContent = parseMarkdown(rawContent);
    const attrs = expertAttributes[expertKey] || { offensive: 50, process: 50, human: 50, tech: 50 };

    return `
      <div class="expert-column" id="col-${expertKey}">
        <div class="expert-card-header">
          <div class="expert-meta">
            <h2 class="expert-name">${name}</h2>
            <span class="expert-sub">${subtitle}</span>
          </div>
        </div>

        <div class="attributes-grid">
          <div class="attribute-bar-container">
            <span class="attr-label">Offensive Strategy</span>
            <div class="bar-outer"><div class="bar-inner attr-off" style="width: ${attrs.offensive}%"></div></div>
            <span class="attr-val">${attrs.offensive}%</span>
          </div>
          <div class="attribute-bar-container">
            <span class="attr-label">Process & Policy</span>
            <div class="bar-outer"><div class="bar-inner attr-proc" style="width: ${attrs.process}%"></div></div>
            <span class="attr-val">${attrs.process}%</span>
          </div>
          <div class="attribute-bar-container">
            <span class="attr-label">Human Factors</span>
            <div class="bar-outer"><div class="bar-inner attr-human" style="width: ${attrs.human}%"></div></div>
            <span class="attr-val">${attrs.human}%</span>
          </div>
          <div class="attribute-bar-container">
            <span class="attr-label">Tech & Code</span>
            <div class="bar-outer"><div class="bar-inner attr-tech" style="width: ${attrs.tech}%"></div></div>
            <span class="attr-val">${attrs.tech}%</span>
          </div>
        </div>

        <div class="expert-analysis-body">
          ${parsedContent}
        </div>
      </div>
    `;
  }).join('\n');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cybersec Career Coach — Expert Comparison</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0a0d16;
      --bg-card: #111625;
      --border-color: rgba(0, 242, 254, 0.15);
      --neon-cyan: #00f2fe;
      --neon-violet: #9b51e0;
      --neon-emerald: #10b981;
      --text-main: #ffffff;
      --text-muted: #b3bccf;
      --text-dark: #64748b;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      padding: 20px;
      overflow-x: hidden;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(155, 81, 224, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(0, 242, 254, 0.08) 0%, transparent 40%);
    }

    header {
      max-width: 1400px;
      margin: 20px auto 40px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 25px;
      position: relative;
    }

    .header-logo-group {
      display: flex;
      flex-direction: column;
    }

    h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-violet) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
      position: relative;
    }

    .header-subtitle {
      color: var(--text-muted);
      font-size: 0.95rem;
      font-weight: 400;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      opacity: 0.8;
    }

    .badge-diagnostic {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid var(--neon-emerald);
      color: var(--neon-emerald);
      padding: 6px 14px;
      border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: -0.2px;
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);
      animation: pulse 2s infinite alternate;
    }

    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 0 10px rgba(16, 185, 129, 0.1); }
      100% { transform: scale(1.03); box-shadow: 0 0 20px rgba(16, 185, 129, 0.25); }
    }

    .main-container {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 30px;
    }

    /* Sidebar Profile Card */
    .sidebar {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 24px;
      height: fit-content;
      position: sticky;
      top: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .sidebar-section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.15rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--neon-cyan);
      margin-bottom: 16px;
      border-left: 3px solid var(--neon-cyan);
      padding-left: 10px;
    }

    .profile-meta-item {
      margin-bottom: 20px;
    }

    .profile-meta-label {
      color: var(--text-dark);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .profile-meta-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.95rem;
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.03);
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      white-space: pre-wrap;
      word-break: break-word;
    }

    .profile-cv-box {
      max-height: 250px;
      overflow-y: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--text-muted);
      background: rgba(0, 0, 0, 0.2);
      padding: 12px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    /* Comparison Grid Columns */
    .comparison-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 24px;
      align-items: start;
    }

    .expert-column {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 28px;
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      position: relative;
    }

    .expert-column:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 242, 254, 0.06);
      border-color: rgba(0, 242, 254, 0.35);
    }

    .expert-card-header {
      display: flex;
      align-items: center;
      gap: 15px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 20px;
      margin-bottom: 20px;
    }

    .expert-meta {
      display: flex;
      flex-direction: column;
    }

    .expert-name {
      font-family: 'Outfit', sans-serif;
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .expert-sub {
      color: var(--neon-cyan);
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: 0.2px;
    }

    /* Attributes Grid */
    .attributes-grid {
      background: rgba(255, 255, 255, 0.02);
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.04);
      margin-bottom: 24px;
    }

    .attribute-bar-container {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-size: 0.75rem;
    }

    .attribute-bar-container:last-child {
      margin-bottom: 0;
    }

    .attr-label {
      width: 110px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .bar-outer {
      flex-grow: 1;
      height: 6px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 3px;
      margin: 0 10px;
      overflow: hidden;
    }

    .bar-inner {
      height: 100%;
      border-radius: 3px;
      transition: width 1s ease-out;
    }

    .attr-off { background: linear-gradient(90deg, #f43f5e, #e11d48); }
    .attr-proc { background: linear-gradient(90deg, #3b82f6, #2563eb); }
    .attr-human { background: linear-gradient(90deg, #d946ef, #c026d3); }
    .attr-tech { background: linear-gradient(90deg, #10b981, #059669); }

    .attr-val {
      width: 30px;
      text-align: right;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-main);
      font-weight: 500;
    }

    /* Expert Analysis Body Formatting */
    .expert-analysis-body {
      font-size: 0.95rem;
      color: var(--text-muted);
    }

    .expert-analysis-body h3.expert-section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.15rem;
      color: var(--text-main);
      margin-top: 24px;
      margin-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 6px;
    }

    .expert-analysis-body h4.expert-section-sub {
      color: var(--neon-cyan);
      font-size: 0.9rem;
      font-weight: 600;
      margin-top: 18px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .expert-analysis-body p {
      margin-bottom: 14px;
    }

    .expert-analysis-body ul {
      margin-bottom: 16px;
      padding-left: 20px;
    }

    .expert-analysis-body li {
      margin-bottom: 8px;
      list-style-type: square;
    }

    .expert-analysis-body li::marker {
      color: var(--neon-cyan);
    }

    .expert-quote {
      border-left: 3px solid var(--neon-violet);
      background: rgba(155, 81, 224, 0.04);
      padding: 12px 16px;
      margin: 15px 0 20px 0;
      border-radius: 0 8px 8px 0;
      font-style: italic;
      color: #e2e8f0;
      font-size: 0.92rem;
    }

    /* Custom scrollbars */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 1100px) {
      .main-container {
        grid-template-columns: 1fr;
      }
      .sidebar {
        position: relative;
        top: 0;
        width: 100%;
      }
    }

    @media (max-width: 600px) {
      body {
        padding: 10px;
      }
      header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }
      .comparison-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-logo-group">
      <h1>CYBERSEC CAREER COACH</h1>
      <span class="header-subtitle">Expert Pantheon Simulation Arena</span>
    </div>
    <div class="badge-diagnostic">ANALYSIS COMPLETE</div>
  </header>

  <div class="main-container">
    <div class="sidebar">
      <div class="sidebar-section-title">Profile Under Review</div>
      <div class="profile-meta-item">
        <div class="profile-meta-label">Selected Profile</div>
        <div class="profile-meta-val">${profileName}</div>
      </div>
      <div class="profile-meta-item">
        <div class="profile-meta-label">Target Security Role</div>
        <div class="profile-meta-val">${targetRole}</div>
      </div>
      <div class="profile-meta-item">
        <div class="profile-meta-label">Resume / Input Telemetry</div>
        <div class="profile-cv-box">${profileContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      </div>
    </div>

    <div class="comparison-grid">
      ${columnsHtml}
    </div>
  </div>
</body>
</html>
  `;

  await fs.writeFile(outputPath, htmlContent, 'utf8');
}
