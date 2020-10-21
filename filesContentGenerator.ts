#!/usr/bin/env -S deno run --unstable --allow-read --allow-write

import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts";
import { walk } from "https://deno.land/std@0.74.0/fs/walk.ts";
import { decodeQuotedPrintable, encodeQuotedPrintable } from "./quotedPrintable.ts";
import { decodeFileContentB64, encodeFileContentB64 } from "./base64.ts";
import { dirname, fromFileUrl } from "https://deno.land/std@0.74.0/path/posix.ts";

export type EncodedFile = { content: string[]; encoding: "base64" | "quoted" };
export type EncodedFiles = { [key: string]: EncodedFile };

export function encodeFileContent(content: Uint8Array): EncodedFile {
  const b64 = encodeFileContentB64(content);
  const quotedPrintable = encodeQuotedPrintable(content).split("\n");
  return b64.join("").length < quotedPrintable.join("").length
    ? { encoding: "base64", content: b64 }
    : { encoding: "quoted", content: quotedPrintable };
}

export async function decodeFileContent(fileEncoded: EncodedFile): Promise<Uint8Array> {
  return fileEncoded.encoding === "base64"
    ? decodeFileContentB64(fileEncoded.content.join("\n"))
    : await decodeQuotedPrintable(fileEncoded.content.join("\n"));
}

async function encodeFolder(folderPath: string): Promise<EncodedFiles> {
  const files: EncodedFiles = {};
  for await (const entry of walk(folderPath)) {
    if (entry.isFile) {
      const file = await Deno.open(entry.path, { read: true });
      const content = await Deno.readAll(file);
      Deno.close(file.rid);
      const path = entry.path.replace(folderPath + "/", "");
      console.log(path);
      files[path] = encodeFileContent(content);
      assertEquals(await decodeFileContent(files[path]), content);
    }
  }
  return files;
}

function replacer(key: string, value: any) {
  return value == null || value.constructor != Object
    ? value
    : Object.keys(value)
        .sort()
        .reduce((obj: { [key: string]: any }, key) => {
          obj[key] = value[key];
          return obj;
        }, {});
}

export async function genFilesContent() {
  const cwd = dirname(fromFileUrl(import.meta.url));
  const files = await encodeFolder(cwd + "/frontend/build");
  await Deno.writeTextFile(
    "filesContent.ts",
    `import { EncodedFiles } from "${cwd}/filesContentGenerator.ts";\n` +
      "export const files: EncodedFiles = " +
      JSON.stringify(files, replacer, " ") +
      "\n"
  );
}

if (import.meta.main) {
  await genFilesContent();
}
