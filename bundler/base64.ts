import { decodeBase64, encodeBase64 } from "@std/encoding";

export function encodeFileContentB64(content: ArrayBuffer): string[] {
  return encodeBase64(content).match(/.{1,200}/g) || [];
}

export function decodeFileContentB64(encodedContent: string): Uint8Array {
  return new Uint8Array(decodeBase64(encodedContent));
}
