import { decode, encode } from "../deps.ts";

export function encodeFileContentB64(content: ArrayBuffer): string[] {
  return encode(content).match(/.{1,200}/g) || [];
}

export function decodeFileContentB64(encodedContent: string): Uint8Array {
  return new Uint8Array(decode(encodedContent));
}
