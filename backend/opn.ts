// forked from https://raw.githubusercontent.com/hashrock/deno-opn/v1.1.1/opn.ts to add permission check (checkDenoPermission)

const { build } = Deno;
import $ from "@david/dax";

//WSL is not supported
//because "platform" in WSL returns just `{ arch: "x64", os: "linux" }`
//and there is no `os.release()`.
const isWsl = false;

export interface OpnOptions {
  /**
   * Specify the app to open the `target` with,
   * or an array with the app and app arguments.
   */
  app?: string[];
  /**
   * Wait for the opened app to exit before fulfilling the promise.
   * If `false` it's fulfilled immediately when opening the app.
   */
  wait?: boolean;
  checkDenoPermission?: boolean;
}

/**
 * Returns a promise for the child process.
 * @param target The thing you want to open. Can be a URL, file, or executable.
 * @param opts
 */
export async function opn(target: string, opts?: OpnOptions) {
  const optsWithDefault: OpnOptions = Object.assign(
    { wait: true, app: [] },
    opts,
  );
  let cmd: string;
  let args = [];
  const wait = optsWithDefault.wait;
  const appArgs = optsWithDefault.app?.slice(1) || [];
  const openApp: string | undefined = optsWithDefault.app
    ? optsWithDefault.app[0]
    : undefined;

  if (build.os === "darwin") {
    cmd = "open";
    if (wait) {
      args.push("-W");
    }
    if (openApp) {
      args.push("-a", openApp);
    }
  } else if (build.os === "windows" || isWsl) {
    cmd = "cmd" + (isWsl ? ".exe" : "");
    args.push("/c", "start", "/b");
    target = target.replace(/&/g, "^&");
    if (wait) {
      args.push("/wait");
    }
    if (openApp) {
      args.push(openApp);
    }
    if (appArgs.length > 0) {
      args = args.concat(appArgs);
    }
  } else {
    //Linux
    if (openApp) {
      cmd = openApp;
    } else {
      cmd = "gio";
      args.push("open");
    }
    if (appArgs.length > 0) {
      args = args.concat(appArgs);
    }
  }
  args.push(target);
  if (build.os === "darwin" && appArgs.length > 0) {
    args.push("--args");
    args = args.concat(appArgs);
  }
  if (opts?.checkDenoPermission) {
    if ((await Deno.permissions.query({ name: "run" })).state !== "granted") {
      throw new Error(`Missing Deno run permission"`);
    }
  }
  return await $`${[cmd, ...args]}`;
}
