// src/lib/format.js
export function num(n, digits = 2) {
  if (n == null || isNaN(Number(n))) return "-";
  try {
    return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: digits }).format(Number(n));
  } catch {
    return String(n);
  }
}

// "2.547,50" -> 2547.5
export function parseTr(s) {
  if (s == null) return NaN;
  const n = Number(String(s).replaceAll('.', '').replace(',', '.'));
  return isFinite(n) ? n : NaN;
}
