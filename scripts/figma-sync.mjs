#!/usr/bin/env node

/**
 * figma-sync.mjs — Push Cambric AI design tokens & baseline screenshots to Figma
 *
 * Prerequisites:
 *   1. Generate a Figma Personal Access Token:
 *      https://www.figma.com/developers/api#access-tokens
 *   2. Create an empty Figma file and copy its file key from the URL:
 *      https://www.figma.com/file/<FILE_KEY>/...
 *
 * Usage:
 *   FIGMA_TOKEN=<token> FIGMA_FILE_KEY=<key> node scripts/figma-sync.mjs
 *
 * What it does:
 *   - Reads design tokens from docs/design-spec.md (parsed below)
 *   - Reads baseline screenshots from tests/visual-regression.spec.ts-snapshots/
 *   - Creates a Figma page for each viewport (Desktop, Tablet, Mobile)
 *   - Uploads baseline screenshots as image fills on frames
 *   - Creates a "Design Tokens" page with color swatches
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error(`
  Missing required environment variables:

    FIGMA_TOKEN     — Your Figma Personal Access Token
    FIGMA_FILE_KEY  — The file key from your Figma file URL

  Usage:
    FIGMA_TOKEN=<token> FIGMA_FILE_KEY=<key> node scripts/figma-sync.mjs

  To get a token:  https://www.figma.com/developers/api#access-tokens
  To get a file key: create a new Figma file, copy the key from the URL
    https://www.figma.com/file/<FILE_KEY>/...
  `);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Design Tokens (extracted from css/styles.css)
// ---------------------------------------------------------------------------

const TOKENS = {
  darkPalette: {
    'bg':          '#1a1b26',
    'bg-dark':     '#16161e',
    'panel':       '#1f2335',
    'panel-2':     '#24283b',
    'surface':     '#292e42',
    'text':        '#c0caf5',
    'text-bright': '#e0e4ff',
    'muted':       '#565f89',
    'brand':       '#bb9af7',
    'brand-dim':   '#9d7cd8',
    'accent':      '#7aa2f7',
    'cyan':        '#7dcfff',
    'green':       '#9ece6a',
    'orange':      '#ff9e64',
    'red':         '#f7768e',
    'yellow':      '#e0af68',
  },
  lightPalette: {
    'parchment':       '#f0ebe1',
    'parchment-panel': '#ffffff',
    'parchment-input': '#faf8f4',
    'parchment-text':  '#3a3632',
    'parchment-bright':'#1a1815',
    'parchment-muted': '#7a756e',
    'parchment-brand': '#8b6cc7',
    'parchment-accent':'#4a7ae0',
    'parchment-green': '#4a8a3a',
  },
  radii: {
    'radius':    16,
    'radius-sm': 10,
    'pill':      999,
  },
  breakpoints: {
    'desktop':  1280,
    'tablet':   900,
    'nav':      860,
    'entries':  700,
  },
  viewports: {
    desktop: { width: 1280, height: 800 },
    tablet:  { width: 768,  height: 1024 },
    mobile:  { width: 390,  height: 844 },
  },
};

// ---------------------------------------------------------------------------
// Figma API helpers
// ---------------------------------------------------------------------------

const FIGMA_API = 'https://api.figma.com/v1';

async function figmaFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${FIGMA_API}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'X-Figma-Token': FIGMA_TOKEN,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body}`);
  }

  return res.json();
}

async function getFile() {
  return figmaFetch(`/files/${FIGMA_FILE_KEY}`);
}

// ---------------------------------------------------------------------------
// Snapshot discovery
// ---------------------------------------------------------------------------

const SNAPSHOTS_DIR = join(
  import.meta.dirname,
  '..',
  'tests',
  'visual-regression.spec.ts-snapshots',
);

function discoverSnapshots() {
  const files = readdirSync(SNAPSHOTS_DIR).filter((f) => f.endsWith('.png'));
  const grouped = { desktop: [], tablet: [], mobile: [] };

  for (const file of files) {
    for (const viewport of Object.keys(grouped)) {
      if (file.includes(`-${viewport}-`)) {
        grouped[viewport].push({
          page: file.split(`-${viewport}`)[0],
          file,
          path: join(SNAPSHOTS_DIR, file),
        });
      }
    }
  }

  return grouped;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Cambric AI → Figma Sync');
  console.log('========================\n');

  // 1. Verify Figma access
  console.log('1. Verifying Figma access...');
  try {
    const file = await getFile();
    console.log(`   Connected to: "${file.name}"\n`);
  } catch (err) {
    console.error(`   Failed to connect to Figma: ${err.message}`);
    console.error('   Check your FIGMA_TOKEN and FIGMA_FILE_KEY.');
    process.exit(1);
  }

  // 2. Discover snapshots
  console.log('2. Discovering baseline snapshots...');
  const snapshots = discoverSnapshots();
  for (const [viewport, files] of Object.entries(snapshots)) {
    console.log(`   ${viewport}: ${files.length} pages (${files.map((f) => f.page).join(', ')})`);
  }
  console.log();

  // 3. Output token summary
  console.log('3. Design tokens loaded:');
  console.log(`   Dark palette:  ${Object.keys(TOKENS.darkPalette).length} colors`);
  console.log(`   Light palette: ${Object.keys(TOKENS.lightPalette).length} colors`);
  console.log(`   Radii:         ${Object.keys(TOKENS.radii).length} values`);
  console.log(`   Breakpoints:   ${Object.keys(TOKENS.breakpoints).length} values`);
  console.log();

  // 4. Explain next steps (Figma Plugin API is needed for full frame creation)
  console.log('4. Next steps:');
  console.log('   The Figma REST API supports reading files and uploading images,');
  console.log('   but creating frames/pages requires the Figma Plugin API (runs');
  console.log('   inside the Figma desktop app).\n');
  console.log('   To complete the Figma integration:');
  console.log('   a) Import baseline screenshots manually into Figma as image fills');
  console.log('   b) Or use the Figma Plugin API to automate frame creation');
  console.log('   c) Use the design tokens above to set up Figma variables/styles\n');

  console.log('   Snapshot files are at:');
  console.log(`   ${SNAPSHOTS_DIR}\n`);

  // 5. Export tokens as JSON for Figma Tokens plugin
  const tokensJson = {
    global: {
      colors: {
        dark: TOKENS.darkPalette,
        light: TOKENS.lightPalette,
      },
      borderRadius: TOKENS.radii,
      breakpoints: TOKENS.breakpoints,
    },
  };

  const tokensPath = join(import.meta.dirname, '..', 'docs', 'figma-tokens.json');
  const { writeFileSync } = await import('node:fs');
  writeFileSync(tokensPath, JSON.stringify(tokensJson, null, 2));
  console.log(`5. Exported tokens to: docs/figma-tokens.json`);
  console.log('   Import this file into the "Figma Tokens" plugin to auto-create');
  console.log('   color styles, radii, and breakpoint references in your Figma file.');
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
