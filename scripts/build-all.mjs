import { cpSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { discoverSlides, root } from "./slides.mjs";

const distDir = join(root, "dist");
const landingDir = join(root, "landing");

// Flags
const args = process.argv.slice(2);
const landingOnly = args.includes("--landing-only");
const filterSlide = args.find((a) => !a.startsWith("--")) || null;


// Build a single slide presentation with slidev
function buildSlide(slide) {
  const { slug, slidesPath } = slide;
  const outDir = join(distDir, slug);
  const base = `/${slug}/`;

  console.log(`\n📦 Building slides: ${slug}`);
  console.log(`   Entry: ${slidesPath}`);
  console.log(`   Output: ${outDir}`);
  console.log(`   Base: ${base}`);

  execFileSync(
    "pnpm",
    ["exec", "slidev", "build", slidesPath, "--base", base, "--out", outDir],
    { cwd: root, stdio: "inherit" },
  );

  console.log(`✅ Built: ${slug}`);
}

// Build the Astro landing page and copy its output beside the slide builds.
function buildLandingPage() {
  execFileSync(
    "pnpm",
    ["exec", "astro", "build", "--root", landingDir],
    { cwd: root, stdio: "inherit" },
  );

  const landingOutputDir = join(landingDir, "dist");
  const outputAssetsDir = join(distDir, "_landing");

  mkdirSync(distDir, { recursive: true });
  rmSync(outputAssetsDir, { recursive: true, force: true });
  cpSync(landingOutputDir, distDir, { recursive: true });

  console.log(`\n🏠 Astro landing page generated: dist/index.html`);
}

// --- Main ---

const slides = discoverSlides(filterSlide);

if (slides.length === 0) {
  console.error("No slides found in slides/ directory.");
  process.exit(1);
}

// Slide metadata for the landing page is read by Astro at build time.

if (landingOnly) {
  console.log("🏠 Building Astro landing page only...\n");
  buildLandingPage();
} else {
  console.log("🚀 Building all slides...\n");
  console.log(
    `Found ${slides.length} presentation(s): ${slides.map((s) => s.slug).join(", ")}`,
  );

  // Build each slide presentation sequentially
  for (const slide of slides) {
    buildSlide(slide);
  }

  buildLandingPage();
}

console.log("\n🎉 All done!");
