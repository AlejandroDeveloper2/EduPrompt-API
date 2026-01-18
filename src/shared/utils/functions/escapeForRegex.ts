/* eslint-disable @typescript-eslint/no-explicit-any */
// decode seguro (no lanza URIError)
const safeDecode = (s?: string): string => {
  if (!s) return "";
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

// escape para usar en RegExp (RegExp.escape si está disponible, fallback manual)
const escapeForRegex = (input: string): string => {
  if (!input) return "";

  if (typeof (RegExp as any).escape === "function")
    return (RegExp as any).escape(input);
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// normalize (remueve diacríticos) — útil si decides introducir title_normalized
const normalizeForSearch = (s: string): string =>
  s.normalize?.("NFD").replace(/[\u0300-\u036f]/g, "") ?? s;

export { safeDecode, escapeForRegex, normalizeForSearch };
