// "The World Today" — Friday 27 November 2026.
// A make.fun entry for "Sum up 27 November's world news in one image".
//
// The judged picture is entry.png, sitting in this same folder. This
// program's only job is to place that picture where the grader asks for
// it. It makes no network calls and draws nothing, so running it twice
// writes the same bytes both times.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { createHash as sha256sum } from "node:crypto";

const source = new URL("./entry.png", import.meta.url).pathname;
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = `${outDir}/entry.png`;

if (!existsSync(source)) {
  throw new Error(`entry.png not found beside main.ts: ${source}`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, outFile);

// Prove the output is an exact copy: read both files back and compare
// their bytes, then print the fingerprint so a second run can be checked
// against it.
const original = readFileSync(source);
const written = readFileSync(outFile);
if (original.length !== written.length || !original.equals(written)) {
  throw new Error("output does not match entry.png");
}

const digest = sha256sum("sha256").update(written).digest("hex");
console.log(`copied ${written.length} bytes to ${outFile}`);
console.log(`sha256 ${digest}`);
console.log("copy verified: output matches entry.png");
