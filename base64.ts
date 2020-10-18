export function utf8_to_b64(str: string) {
  return btoa(unescape(encodeURIComponent(str)));
}

export function b64_to_utf8(str: string) {
  return decodeURIComponent(escape(window.atob(str)));
}
