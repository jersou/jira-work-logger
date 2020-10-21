#!/usr/bin/env -S deno run --unstable --allow-read --allow-write --allow-run --allow-net

import { dirname, fromFileUrl } from "https://deno.land/std@0.74.0/path/posix.ts";
import { assert } from "https://deno.land/std@0.74.0/testing/asserts.ts";
import { genFilesContent } from "./filesContentGenerator.ts";

export async function bundle() {
  const cwd = dirname(fromFileUrl(import.meta.url));
  assert((await Deno.run({ cmd: ["bash", "-c", "yarn build"], cwd: cwd + "/frontend" }).status()).success);
  await genFilesContent();
  await Deno.mkdir(cwd + "/dist", { recursive: true });
  const js = cwd + "/dist/server.js";
  assert((await Deno.run({ cmd: ["deno", "bundle", "--unstable", cwd + "/server.ts", js], cwd }).status()).success);
  const bundled = await Deno.readTextFile(js);
  await Deno.writeTextFile(js, bundled.replaceAll(/file:\/\/.*?\/Jira-Work-Logger\//g, "file:///Jira-Work-Logger/"));
}

if (import.meta.main) {
  await bundle();
}
