import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const sourceRoot = resolve(scriptsDir, "..");

function findProjectRoot(startDir) {
  let currentDir = resolve(startDir);

  while (true) {
    if (existsSync(join(currentDir, "slides"))) return currentDir;

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      throw new Error("Could not locate the tantuyu.slidevs project root.");
    }
    currentDir = parentDir;
  }
}

export const root = existsSync(join(sourceRoot, "slides"))
  ? sourceRoot
  : findProjectRoot(process.cwd());
export const slidesDir = join(root, "slides");

export function discoverSlides(slug = null) {
  return readdirSync(slidesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      slug: entry.name,
      slidesPath: join(slidesDir, entry.name, "slides.md"),
    }))
    .filter((slide) => existsSync(slide.slidesPath))
    .filter((slide) => !slug || slide.slug === slug)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function readSlideMetadata(slidesPath) {
  const content = readFileSync(slidesPath, "utf-8");
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) return {};

  try {
    return parseYaml(match[1]) || {};
  } catch {
    console.warn(`Warning: could not parse frontmatter in ${slidesPath}`);
    return {};
  }
}

export function discoverSlidesWithMetadata(slug = null) {
  return discoverSlides(slug).map((slide) => ({
    ...slide,
    meta: readSlideMetadata(slide.slidesPath),
  }));
}
