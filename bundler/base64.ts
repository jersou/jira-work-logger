import { decode, encode } from "https://deno.land/std@0.75.0/encoding/base64.ts";

export function encodeFileContentB64(content: ArrayBuffer): string[] {
  return encode(content).match(/.{1,200}/g) || [];
}

export function decodeFileContentB64(encodedContent: string): Uint8Array {
  return new Uint8Array(decode(encodedContent));
}
