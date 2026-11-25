// Entry program for the make.fun bounty "Promote make.fun's
// make-your-own-bounty post on X" (Node 22, standard library only).
//
// The entry itself is a post on X; this program's whole job is to hand the
// grader that post's address. It copies POST.json from the repository root
// (the bot directory) into the output directory, byte for byte, and does
// nothing else: no network, no clock, no other files, so both graded runs
// write the same bytes.
//
// Outside the grader, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for
// /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail early, with a clear message, when POST.json is missing or is not a
// JSON object carrying a string url: the gate would refuse such a file
// anyway, and a named error here is easier to mend than a bare copy error.
const postFile = join(botDir, 'POST.json');
let post: unknown;
try {
  post = JSON.parse(readFileSync(postFile, 'utf8'));
} catch (err) {
  console.error(`POST.json in ${botDir} could not be read: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof post !== 'object' || post === null || typeof (post as { url?: unknown }).url !== 'string') {
  console.error('POST.json must be a JSON object with a string "url" naming the post on X.');
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });

try {
  copyFileSync(postFile, join(outputDir, 'POST.json'));
} catch (err) {
  console.error(`could not copy POST.json out of ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}
