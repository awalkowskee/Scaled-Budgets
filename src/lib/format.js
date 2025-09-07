export const fmtCurrency = (n, d = 2) =>
  n == null || isNaN(n)
    ? "N/A"
    : `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })}`;
export const fmtInteger = (n) => (n == null || isNaN(n) ? "0" : `${Math.round(n)}`);
export const fmt2 = (n) => (n == null || isNaN(n) ? "N/A" : Number(n).toFixed(2));
export const toDate = (v) => new Date(v);
