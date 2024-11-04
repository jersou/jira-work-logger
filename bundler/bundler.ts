#!/usr/bin/env -S deno run -A

import { genFilesContent } from "./filesContentGenerator.ts";

import $ from "@david/dax";

export async function bundle() {
  $.cd(import.meta);
  await $`cd ../frontend && npm install && npm run build`;
  await genFilesContent();
  await $`mkdir -p ../dist`;
  // deno compile --unstable --allow-net --allow-run --target x86_64-unknown-linux-gnu --output bin/Linux/Jira-Work-Logger --lite backend/server.ts --wait-and-close
  // deno compile --unstable --allow-net --allow-run --target x86_64-pc-windows-msvc --output bin/Windows/Jira-Work-Logger.exe --lite backend/server.ts --wait-and-close
}

if (import.meta.main) {
  await bundle();
}
