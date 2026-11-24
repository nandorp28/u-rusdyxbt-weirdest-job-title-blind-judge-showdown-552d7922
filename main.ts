// Entry for "Weirdest Job Title: Blind Judge Showdown" (make.fun).
// Writes one job title, 60 characters or fewer, to /output/entry.txt
// (or $MAKEFUN_OUTPUT_DIR when the harness sets it).
// The title is a real-sounding senior role with one gloriously specific
// twist: the client is a machine that cannot apologise for itself.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TITLE = "Senior Apologizer for Self-Driving Cars";
const MAX_CHARS = 60;

function codePoints(text: string): number {
  return [...text].length;
}

function validate(title: string): void {
  if (title.length === 0 || title.trim().length === 0) {
    throw new Error("entry must not be empty or only whitespace");
  }
  if (title.includes("\n") || title.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (codePoints(title) > MAX_CHARS) {
    throw new Error(
      `entry is ${codePoints(title)} characters, over the ${MAX_CHARS} cap`,
    );
  }
  if (title !== title.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
}

function main(): void {
  validate(TITLE);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, TITLE, "utf8");
  // Read back what was written so a truncated or re-encoded write fails
  // loudly here instead of silently reaching the judge.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== TITLE) {
    throw new Error("round-trip check failed: entry.txt does not match");
  }
  console.log(`wrote ${codePoints(TITLE)} characters to ${outPath}`);
}

main();
