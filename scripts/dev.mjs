import { spawn } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { discoverSlides, root } from "./slides.mjs";

const args = process.argv.slice(2);
const separatorIndex = args.indexOf("--");
const launcherArgs =
  separatorIndex === -1 ? args : args.slice(0, separatorIndex);
const slidevArgs = separatorIndex === -1 ? [] : args.slice(separatorIndex + 1);

function usage() {
  console.log(`Usage: pnpm dev [slide] [-- <Slidev options>]

Available slides:
${discoverSlides()
  .map((slide) => `  ${slide.slug}`)
  .join("\n")}

Examples:
  pnpm dev
  pnpm dev api-world
  pnpm dev api-world -- --port 3031 --no-open`);
}

async function selectSlide(slides) {
  if (!stdin.isTTY || !stdout.isTTY) {
    console.error("Specify a slide when not running interactively.");
    usage();
    process.exit(1);
  }

  console.log("Available slides:");
  slides.forEach((slide, index) => console.log(`  ${index + 1}. ${slide.slug}`));

  const readline = createInterface({ input: stdin, output: stdout });
  const answer = await readline.question("Select a slide: ");
  readline.close();

  const index = Number(answer) - 1;
  if (!Number.isInteger(index) || !slides[index]) {
    console.error(`Invalid slide selection: ${answer}`);
    process.exit(1);
  }

  return slides[index];
}

if (launcherArgs.includes("--help") || launcherArgs.includes("-h")) {
  usage();
  process.exit(0);
}

if (launcherArgs.length > 1) {
  console.error("Specify at most one slide before --.");
  usage();
  process.exit(1);
}

const slides = discoverSlides();
if (slides.length === 0) {
  console.error("No slides found in slides/<slug>/slides.md.");
  process.exit(1);
}

const requestedSlug = launcherArgs[0];
const slide = requestedSlug
  ? slides.find((candidate) => candidate.slug === requestedSlug)
  : await selectSlide(slides);

if (!slide) {
  console.error(`Unknown slide: ${requestedSlug}`);
  usage();
  process.exit(1);
}

console.log(`Starting ${slide.slug}: ${slide.slidesPath}`);
const child = spawn(
  "pnpm",
  ["exec", "slidev", slide.slidesPath, "--open", ...slidevArgs],
  { cwd: root, stdio: "inherit" },
);

child.on("error", (error) => {
  console.error(`Failed to start Slidev: ${error.message}`);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
