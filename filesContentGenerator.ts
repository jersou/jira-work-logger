#!/usr/bin/env -S deno run --unstable --allow-read --allow-write

import { walk } from "https://deno.land/std@0.74.0/fs/walk.ts";
import { b64_to_utf8, utf8_to_b64 } from "./base64.ts";

export function encodeFileContent(content: Uint8Array): string[] {
  return utf8_to_b64(new TextDecoder().decode(content)).match(/.{1,1000}/g) || [];
}

export function decodeFileContent(encodedContent: string[]): string {
  return b64_to_utf8(encodedContent.join(""));
}

async function encodeFolder(path: string): Promise<{ [key: string]: string[] }> {
  const files: { [key: string]: string[] } = {};
  for await (const entry of walk(path)) {
    if (entry.isFile) {
      const file = await Deno.open(entry.path, { read: true });
      const content = await Deno.readAll(file);
      Deno.close(file.rid);
      // store the file in base64 encoding cut in 1000-character chunks
      files[entry.path.replace(/^frontend\/build\//, "")] = encodeFileContent(content);
    }
  }
  return files;
}

if (import.meta.main) {
  const files = await encodeFolder("./frontend/build");
  await Deno.writeTextFile("filesContent.ts", "export const files = " + JSON.stringify(files, null, " ") + "\n");
}
