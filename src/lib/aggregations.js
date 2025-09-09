import { toDate } from "./format.js";

export function median(values) {
  const nums = values.filter((v) => v != null && !isNaN(v)).sort((a, b) => a - b);
  const n = nums.length;
  if (!n) return null;
  const mid = Math.floor(n / 2);
  return n % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

export function withinDays(date, maxDate, days) {
  const d = toDate(date);
  const end = toDate(maxDate);
  const start = new Date(end);
  start.setDate(end.getDate() - (days - 1));
  return d >= start && d <= end;
}

export function aggregateWindow(rows, days, relativeCPAMode = "median") {
  if (!rows.length) return [];
  const maxDate = rows.reduce((m, r) => (!m || r.date > m ? r.date : m), null);
  const byId = new Map();
  rows.forEach((r) => {
    if (!r.adset_id || !r.date) return;
    if (!withinDays(r.date, maxDate, days)) return;
    const key = r.adset_id;
    if (!byId.has(key)) byId.set(key, { adset_id: key, adset_name: r.adset_name ?? "", spend: 0, purchases: 0 });
    const acc = byId.get(key);
    acc.adset_name = r.adset_name ?? acc.adset_name;
    acc.spend += Number(r.spend ?? 0);
    acc.purchases += Number(r.purchases ?? 0);
  });

  const adsets = Array.from(byId.values()).map((rec) => ({
    ...rec,
    cpa: rec.purchases > 0 ? rec.spend / rec.purchases : null,
  }));

  // Calculate reference CPA
  const cpas = adsets.map((r) => r.cpa).filter((c) => c != null && !isNaN(c));
  let referenceCPA = null;
  if (relativeCPAMode === "average") {
    // Use aggregate CPA (total spend / total purchases)
    const totalSpend = adsets.reduce((sum, r) => sum + (r.spend || 0), 0);
    const totalPurchases = adsets.reduce((sum, r) => sum + (r.purchases || 0), 0);
    referenceCPA = totalPurchases > 0 ? totalSpend / totalPurchases : null;
  } else {
    referenceCPA = median(cpas);
  }

  // Add relative_cpa
  return adsets.map((rec) => ({
    ...rec,
    relative_cpa: rec.cpa != null && referenceCPA ? rec.cpa / referenceCPA : null,
  }));
}
