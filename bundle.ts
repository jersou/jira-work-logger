#!/usr/bin/env -S deno run -A

import * as esbuild from "npm:esbuild@0.24.0";
// Import the Wasm build on platforms where running subprocesses is not
// permitted, such as Deno Deploy, or when running without `--allow-run`.
// import * as esbuild from "https://deno.land/x/esbuild@0.20.2/wasm.js";

import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.11.0";

import $ from "jsr:@david/dax@0.42.0";

const tsBundlePath = $.path("./dist/jira-work-logger.bundle.ts");

const result = await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["./jira-work-logger.ts"],
  outfile: tsBundlePath.toString(),
  bundle: true,
  format: "esm",
});

console.log(result.outputFiles);

const transformResult = await esbuild.transform(
  await tsBundlePath.readText(),
  {
    target: "es2022",
    // minify: true,
  },
);

await $.path("./dist/jira-work-logger.bundle.esm.js").writeText(
  transformResult.code,
);
console.log({ warnings: transformResult.warnings });

await tsBundlePath.remove();
esbuild.stop();

// TODO bundleApp() function
