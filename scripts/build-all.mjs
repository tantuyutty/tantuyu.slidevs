import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { join, resolve, dirname } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, "..");

const decksDir = join(root, "decks");
const distDir = join(root, "dist");
const templatePath = join(root, "scripts", "landing-template.html");

// Flags
const args = process.argv.slice(2);
const landingOnly = args.includes("--landing-only");
const filterDeck = args.find((a) => !a.startsWith("--")) || null;

// Discover all decks by scanning decks/<name>/slides.md
function discoverDecks() {
  const entries = readdirSync(decksDir);
  const decks = [];

  for (const entry of entries) {
    const deckPath = join(decksDir, entry);
    const slidesPath = join(deckPath, "slides.md");

    if (statSync(deckPath).isDirectory() && existsSync(slidesPath)) {
      if (filterDeck && entry !== filterDeck) continue;
      decks.push({ slug: entry, slidesPath });
    }
  }

  return decks;
}

// Parse YAML frontmatter from a slides.md file
function parseFrontmatter(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) return {};

  try {
    return parseYaml(match[1]) || {};
  } catch {
    console.warn(`  Warning: could not parse frontmatter in ${filePath}`);
    return {};
  }
}

// Build a single deck with slidev
function buildDeck(deck) {
  const { slug, slidesPath } = deck;
  const outDir = join(distDir, slug);
  const base = `/${slug}/`;

  console.log(`\n📦 Building deck: ${slug}`);
  console.log(`   Entry: ${slidesPath}`);
  console.log(`   Output: ${outDir}`);
  console.log(`   Base: ${base}`);

  const cmd = `npx slidev build "${slidesPath}" --base "${base}" --out "${outDir}"`;
  execSync(cmd, { cwd: root, stdio: "inherit" });

  console.log(`✅ Built: ${slug}`);
}

// Generate the landing page from template + deck metadata
function generateLandingPage(decks) {
  const template = readFileSync(templatePath, "utf-8");

  const cards = decks
    .sort((a, b) => {
      // Sort by date descending, then by title
      if (a.meta.date && b.meta.date)
        return b.meta.date.localeCompare(a.meta.date);
      if (a.meta.date) return -1;
      if (b.meta.date) return 1;
      return (a.meta.title || a.slug).localeCompare(b.meta.title || b.slug);
    })
    .map(({ slug, meta }) => {
      const title = meta.title || slug;
      const description = meta.description || meta.info || "";
      // Strip markdown from description
      const cleanDesc =
        typeof description === "string"
          ? description.replace(/[#*_`\[\]()]/g, "").trim()
          : "";
      const date = meta.date || "";

      return `    <a href="/${slug}/" class="group block border border-neutral-800 rounded-xl p-5 bg-neutral-900 transition-all duration-200 hover:border-accent hover:bg-neutral-800/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5">
      <div class="flex justify-between items-baseline gap-4">
        <h2 class="text-lg font-semibold text-neutral-100 group-hover:text-accent transition-colors">${escapeHtml(title)}</h2>
        ${date ? `<span class="text-xs text-neutral-500 whitespace-nowrap">${escapeHtml(String(date))}</span>` : ""}
      </div>
      ${cleanDesc ? `<p class="mt-2 text-sm text-neutral-400 leading-relaxed">${escapeHtml(cleanDesc)}</p>` : ""}
    </a>`;
    })
    .join("\n");

  const html = template.replace(
    '<div id="decksGrid" class="grid gap-4 grid-cols-1 sm:grid-cols-2">\n        <!-- DECKS_PLACEHOLDER -->\n      </div>',
    `<div id="decksGrid" class="grid gap-4 grid-cols-1 sm:grid-cols-2">\n        ${cards}\n      </div>`
  );

  mkdirSync(distDir, { recursive: true });
  writeFileSync(join(distDir, "index.html"), html, "utf-8");
  console.log(`\n🏠 Landing page generated: dist/index.html`);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// --- Main ---

const decks = discoverDecks();

if (decks.length === 0) {
  console.error("No decks found in decks/ directory.");
  process.exit(1);
}

// Parse metadata for all decks
for (const deck of decks) {
  deck.meta = parseFrontmatter(deck.slidesPath);
}

if (landingOnly) {
  console.log("🏠 Building landing page only...\n");
  generateLandingPage(decks);
} else {
  console.log("🚀 Building all slide decks...\n");
  console.log(
    `Found ${decks.length} deck(s): ${decks.map((d) => d.slug).join(", ")}`,
  );

  // Build each deck sequentially
  for (const deck of decks) {
    buildDeck(deck);
  }

  // Generate landing page (always from all decks, even if filtered build)
  if (filterDeck) {
    const allEntries = readdirSync(decksDir);
    const fullDecks = [];
    for (const entry of allEntries) {
      const deckPath = join(decksDir, entry);
      const slidesPath = join(deckPath, "slides.md");
      if (statSync(deckPath).isDirectory() && existsSync(slidesPath)) {
        fullDecks.push({
          slug: entry,
          slidesPath,
          meta: parseFrontmatter(slidesPath),
        });
      }
    }
    generateLandingPage(fullDecks);
  } else {
    generateLandingPage(decks);
  }
}

console.log("\n🎉 All done!");
