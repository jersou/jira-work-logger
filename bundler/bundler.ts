#!/usr/bin/env -S deno run --unstable --allow-read --allow-write --allow-run --allow-net

import { dirname, fromFileUrl, assert } from "../deps.ts";
import { genFilesContent } from "./filesContentGenerator.ts";

export async function bundle() {
  const cwd = dirname(fromFileUrl(import.meta.url));
  assert(
    (
      await Deno.run({
        cmd: ["bash", "-c", "yarn install && yarn build"],
        cwd: cwd + "/../frontend",
      }).status()
    ).success
  );
  await genFilesContent();
  await Deno.mkdir(cwd + "/../dist", { recursive: true });
  const js = cwd + "/../dist/server.js";
  assert(
    (
      await Deno.run({
        cmd: ["deno", "bundle", "--unstable", cwd + "/../backend/server.ts", js],
        cwd,
      }).status()
    ).success
  );
  const bundled = await Deno.readTextFile(js);
  await Deno.writeTextFile(js, bundled.replaceAll(/file:\/\/.*?\/Jira-Work-Logger\//g, "file:///Jira-Work-Logger/"));

  // deno compile --unstable --allow-net --allow-run --target x86_64-unknown-linux-gnu --output bin/Linux/Jira-Work-Logger --lite backend/server.ts --wait-and-close
  // deno compile --unstable --allow-net --allow-run --target x86_64-pc-windows-msvc --output bin/Windows/Jira-Work-Logger.exe --lite backend/server.ts --wait-and-close
}

if (import.meta.main) {
  await bundle();
}
