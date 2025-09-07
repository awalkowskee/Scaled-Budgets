import { DEFAULTS } from "./constants.js";
import { decideAction } from "./logic.js";
import { median } from "./aggregations.js";

export function runUnitTests(params) {
  const results = [];
  results.push({ name: "median odd",  pass: median([1,2,3,4,5]) === 3 });
  results.push({ name: "median even", pass: median([1,2,3,4])    === 2.5 });
  results.push({ name: "median empty", pass: median([]) === null });

  const p = { ...DEFAULTS, ...params };
  const hiPurch = 12, loPurch = 7;

  const t1 = decideAction({ purchasesShort: hiPurch, spendShort: 1000, relCPA: 0.74, params: p }).decision;
  const t2 = decideAction({ purchasesShort: hiPurch, spendShort: 1000, relCPA: 0.99, params: p }).decision;
  const t3 = decideAction({ purchasesShort: hiPurch, spendShort: 1000, relCPA: 1.10, params: p }).decision;
  const t4 = decideAction({ purchasesShort: hiPurch, spendShort: 1000, relCPA: 1.30, params: p }).decision;
  const t5 = decideAction({ purchasesShort: hiPurch, spendShort: 1000, relCPA: 1.60, params: p }).decision;

  results.push({ name: "≥scale_min: rel≤0.75 → Scale max", pass: /Scale \+\d+%/.test(t1) });
  results.push({ name: "≥scale_min: 0.76–1.00 → Scale mid", pass: t2.startsWith("Scale +") });
  results.push({ name: "≥scale_min: 1.01–1.20 → Hold", pass: t3 === "Hold" });
  results.push({ name: "≥scale_min: 1.21–1.50 → Cut", pass: t4.startsWith("Cut -") });
  results.push({ name: ">1.50 → Cut max", pass: t5.startsWith("Cut -") });

  const u1 = decideAction({ purchasesShort: loPurch, spendShort: 1000, relCPA: 0.74, params: p }).decision;
  const u2 = decideAction({ purchasesShort: loPurch, spendShort: 1000, relCPA: 0.95, params: p }).decision;
  const u3 = decideAction({ purchasesShort: loPurch, spendShort: 1000, relCPA: 1.10, params: p }).decision;
  const u4 = decideAction({ purchasesShort: loPurch, spendShort: 1000, relCPA: 1.30, params: p }).decision;
  const u5 = decideAction({ purchasesShort: loPurch, spendShort: 1000, relCPA: 1.60, params: p }).decision;

  results.push({ name: "<scale_min: rel≤0.75 → Scale min", pass: u1.startsWith("Scale +") });
  results.push({ name: "<scale_min: 0.76–1.20 → Hold", pass: u2 === "Hold" && u3 === "Hold" });
  results.push({ name: "<scale_min: 1.21–1.50 → Cut min", pass: u4.startsWith("Cut -") });
  results.push({ name: "<scale_min: >1.50 → Cut >=20%", pass: u5.startsWith("Cut -") });

  return results;
}
