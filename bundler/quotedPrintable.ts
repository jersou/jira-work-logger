import { BufReader, BufWriter } from "https://deno.land/std@0.75.0/io/bufio.ts";
import { decode as hexDecode } from "https://deno.land/std@0.75.0/encoding/hex.ts";

const hexTable = new TextEncoder().encode("0123456789ABCDEF");

export function encodeQuotedPrintableByte(c: number): string {
  return c === 9 || c === 10 || c === 13 || (32 <= c && c <= 60) || (62 <= c && c <= 126)
    ? String.fromCharCode(c)
    : "=" + String.fromCharCode(hexTable[c >> 4], hexTable[c & 0x0f]);
}

export function encodeQuotedPrintable(uint8Array: Uint8Array) {
  return Array.from(uint8Array.values())
    .map(encodeQuotedPrintableByte)
    .join("")
    .replaceAll(";", ";=\n")
    .split("\n")
    .map((line) => (line.match(/.{1,200}/g) || []).join("=\n"))
    .join("\n");
}

export async function decodeQuotedPrintable(encoded: string): Promise<Uint8Array> {
  const buffer = new Deno.Buffer();
  const bw = new BufWriter(buffer);
  const array = new TextEncoder().encode(encoded.replaceAll(/=\n/g, ""));
  for (let index = 0; index < array.length; index++) {
    const byte = array[index];
    if (byte !== 61) {
      await bw.write(Uint8Array.from([byte]));
    } else {
      const v = hexDecode(array.slice(index + 1, index + 3))[0];
      index += 2;
      await bw.write(Uint8Array.from([v]));
    }
  }
  await bw.flush();
  return buffer.bytes();
}
