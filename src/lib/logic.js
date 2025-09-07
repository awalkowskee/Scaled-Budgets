import { fmtCurrency, fmtInteger } from "./format.js";
import { DEFAULTS } from "./constants.js";

export function longTermSummary(shortCPA, longTermCPAs, tol = DEFAULTS.longterm_alignment_tolerance) {
  const valid = longTermCPAs.filter((v) => v != null && !isNaN(v));
  if (!valid.length || shortCPA == null || isNaN(shortCPA)) {
    return `Short-term CPA ${fmtCurrency(shortCPA)}, vs long-term trend: No long-term data`;
  }
  const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
  const diff = (shortCPA - avg) / avg;
  let tag = "Aligned with long-term";
  if (diff > tol) tag = "Worse than long-term trend";
  else if (diff < -tol) tag = "Better than long-term trend";
  return `Short-term CPA ${fmtCurrency(shortCPA)}, vs long-term trend: ${tag}`;
}

export function decisionExplanation(cpaShort, relCPA, purchasesShort) {
  if (cpaShort == null || isNaN(cpaShort)) return "No purchases in short window → cannot judge efficiency";
  const p = fmtInteger(purchasesShort);
  let qualifier = "near average, stable";
  if (relCPA <= 0.75) qualifier = "highly efficient";
  else if (relCPA <= 1.0) qualifier = "above average";
  else if (relCPA <= 1.2) qualifier = "near average, stable";
  else if (relCPA <= 1.5) qualifier = "underperforming";
  else qualifier = "poor performance";
  return `CPA ${fmtCurrency(cpaShort)}, ${relCPA?.toFixed(2)}× median with ${p} conversions → ${qualifier}`;
}

export function decideAction({ purchasesShort, spendShort, relCPA, params }) {
  const {
    conv_scale_min, conv_consider_min, spend_min, rel_cpa_bands,
    scale_step_min, scale_step_max, cut_step_min, cut_step_max,
  } = params;

  if (purchasesShort < conv_consider_min && spendShort < spend_min) {
    return { decision: "Hold", changePct: 0, reason: `Only ${fmtInteger(purchasesShort)} conversions (<${conv_consider_min}) and spend < ${fmtCurrency(spend_min)} → low volume hold` };
  }

  const [B0, B1, B2, B3] = rel_cpa_bands; // 0.75, 1.00, 1.20, 1.50
  const fullScaleEligible = purchasesShort >= conv_scale_min;

  if (fullScaleEligible) {
    if (relCPA <= B0) return { decision: `Scale +${scale_step_max}%`, changePct: scale_step_max };
    if (relCPA <= B1) return { decision: `Scale +${Math.max(scale_step_min, 15)}%`, changePct: Math.max(scale_step_min, 15) };
    if (relCPA <= B2) return { decision: "Hold", changePct: 0 };
    if (relCPA <= B3) return { decision: `Cut -${Math.max(cut_step_min, 15)}%`, changePct: -Math.max(cut_step_min, 15) };
    return { decision: `Cut -${cut_step_max}%`, changePct: -cut_step_max };
  } else {
    if (relCPA <= B0) return { decision: `Scale +${scale_step_min}%`, changePct: scale_step_min };
    if (relCPA <= B1) return { decision: "Hold", changePct: 0 };
    if (relCPA <= B2) return { decision: "Hold", changePct: 0 };
    if (relCPA <= B3) return { decision: `Cut -${cut_step_min}%`, changePct: -cut_step_min };
    return { decision: `Cut -${Math.max(cut_step_min, 20)}%`, changePct: -Math.max(cut_step_min, 20) };
  }
}
