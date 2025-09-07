import React, { useMemo, useState } from "react";
import UploadCard from "./components/UploadCard.jsx";
import AdvancedPanel from "./components/AdvancedPanel.jsx";
import HamburgerMenu from "./components/HamburgerMenu.jsx";
import ResultsTable from "./components/ResultsTable.jsx";


import { DEFAULTS } from "./lib/constants.js";
import { fmtCurrency, fmtInteger, fmt2, toDate } from "./lib/format.js";
import { aggregateWindow, median } from "./lib/aggregations.js";
import { decideAction, decisionExplanation, longTermSummary } from "./lib/logic.js";
import { mapMetaRows } from "./lib/metaMap.js";
import { exportCSV, exportXLS, exportPDF } from "./lib/exports.js";
import { makeSampleRows } from "./lib/sample.js";
import { runUnitTests } from "./lib/tests.js";

export default function App() {
  const [rawRows, setRawRows] = useState([]);
  const [params, setParams] = useState(DEFAULTS);
  const [results, setResults] = useState([]);
  const [runMeta, setRunMeta] = useState(null);
  const [error, setError] = useState("");
  const [tests, setTests] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const latestDate = useMemo(() => {
    if (!rawRows.length) return null;
    return rawRows.reduce((m, r) => (!m || toDate(r.Day || r.date) > toDate(m) ? (r.Day || r.date) : m), null);
  }, [rawRows]);

  const handleFile = async (file) => {
    setError("");
    try {
      const XLSX = await import("xlsx");
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { raw: true });
      setRawRows(json);
      setUploadedFileName(file.name);
    } catch (e) {
      setError("Failed to parse file. Please upload a CSV/XLS exported from Meta.");
      console.error(e);
    }
  };

  const runAnalysis = () => {
    setError("");
    if (!rawRows.length) {
      setError("Please upload a Meta export first or load sample data.");
      return;
    }
    const rows = mapMetaRows(rawRows)
      .filter((r) => r.adset_id && (r.date || r.Day))
      .map((r) => ({ ...r, date: new Date(r.date || r.Day), spend: Number(r.spend ?? r["Amount spent (USD)"] ?? 0), purchases: Number(r.purchases ?? r["Purchases"] ?? 0) }));

    const shortAgg = aggregateWindow(rows, params.lookback_days_short);
    const medianPool = shortAgg.filter((a) => a.purchases >= params.conv_consider_min && a.cpa != null).map((a) => a.cpa);
    const medCPA = median(medianPool);

    const longAggMap = {};
    for (const win of params.longterm_windows) {
      const agg = aggregateWindow(rows, win);
      longAggMap[win] = Object.fromEntries(agg.map((r) => [r.adset_id, r]));
    }

    const insufficient = medCPA == null || isNaN(medCPA);
    const out = shortAgg.map((s) => {
      const rel = s.cpa != null && medCPA ? s.cpa / medCPA : null;
      const c7 = longAggMap[7]?.[s.adset_id]?.cpa ?? null;
      const c14 = longAggMap[14]?.[s.adset_id]?.cpa ?? null;
      const c21 = longAggMap[21]?.[s.adset_id]?.cpa ?? null;
      const longSummary = longTermSummary(s.cpa, [c7, c14, c21], params.longterm_alignment_tolerance);
      const decision = !insufficient && rel != null
        ? decideAction({ purchasesShort: s.purchases, spendShort: s.spend, relCPA: rel, params })
        : { decision: "Hold", changePct: 0, reason: "Insufficient comparative signal" };

      return {
        adset_id: s.adset_id,
        adset_name: s.adset_name || "",
        spend_short: fmtCurrency(s.spend, 2),
        purchases_short: fmtInteger(s.purchases),
        cpa_short: fmtCurrency(s.cpa, 2),
        relative_cpa: rel == null ? "N/A" : fmt2(rel),
        decision: decision.decision,
        decision_explanation: decisionExplanation(s.cpa, rel ?? NaN, s.purchases),
        longterm_summary: longSummary,
      };
    });

    setResults(out);
    setRunMeta({ timestamp: new Date().toISOString(), latestDate: latestDate ? new Date(latestDate).toISOString() : null, params, medianCPA: medCPA });
  };

  const clearAll = () => { setRawRows([]); setResults([]); setRunMeta(null); setError(""); setTests([]); setUploadedFileName(""); };
  const handleParam = (k, v) => setParams((p) => ({ ...p, [k]: v }));
  const loadSample = () => { setRawRows(makeSampleRows()); setUploadedFileName("Sample Data"); };
  const runTests = () => setTests(runUnitTests(params));

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC", color: "#0F172A", fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial" }}>
      <div className="mx-auto" style={{ maxWidth: 1100, padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Scaled Budgets — MVP</h1>
        <p style={{ fontSize: 14, color: "#475569", marginBottom: 24 }}>Upload your Meta Ads Manager daily export, tweak advanced knobs, and generate concise, manager-ready budget recommendations.</p>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <UploadCard
            onFile={handleFile}
            onRun={runAnalysis}
            onClear={clearAll}
            onLoadSample={loadSample}
            onRunTests={runTests}
            fileName={uploadedFileName}
            rowsCount={rawRows.length}
            error={error}
          />
          <HamburgerMenu>
            <AdvancedPanel
              params={params}
              onChange={(k,v)=>setParams(p=>({...p,[k]:v}))}
              show={showAdvanced}
              setShow={setShowAdvanced}
            />
          </HamburgerMenu>
        </div>

        <ResultsTable
          results={results}
          runMeta={runMeta}
          onXLSX={() => exportXLS("scaled_budgets_recommendations.xlsx", results)}
          onCSV={() => exportCSV("scaled_budgets_recommendations.csv", results)}
          onPDF={() => exportPDF("scaled_budgets_recommendations.pdf", results, runMeta)}
        />

        {tests.length > 0 && (
          <div style={{ marginTop: 16, border: "1px solid #E2E8F0", borderRadius: 8, padding: 12, fontSize: 14 }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Developer Tests</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {tests.map((t, i) => (
                <li key={i} style={{ color: t.pass ? "#047857" : "#B91C1C" }}>
                  {t.pass ? "✔" : "✖"} {t.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
