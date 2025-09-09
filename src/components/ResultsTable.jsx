import React from "react";

export default function ResultsTable({ results, runMeta, onXLSX, onCSV, onPDF }) {
  // Aggregate calculations
  const sumSpend = results.reduce((a, r) => a + (parseFloat(r.spend_short?.replace(/[^0-9.-]+/g, "")) || 0), 0);
  const sumPurchases = results.reduce((a, r) => a + (parseInt(r.purchases_short?.replace(/[^0-9.-]+/g, "")) || 0), 0);
  const aggCPA = sumPurchases > 0 ? sumSpend / sumPurchases : null;

  return (
    <div style={{ marginTop: 24, background: "#fff", borderRadius: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontWeight: 500 }}>Results</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={onXLSX} disabled={!results.length} style={{ padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 8, background: "white" }}>Download XLSX</button>
          <button onClick={onCSV}  disabled={!results.length} style={{ padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 8, background: "white" }}>Download CSV</button>
          <button onClick={onPDF}  disabled={!results.length} style={{ padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 8, background: "white" }}>Download PDF</button>
        </div>
      </div>

      {!results.length ? (
        <p style={{ marginTop: 12, fontSize: 14, color: "#475569" }}>No results yet. Upload a file, <b>Load Sample Data</b>, and click <b>Run Analysis</b>.</p>
      ) : (
        <div style={{ overflowX: "auto", marginTop: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", background: "#E2E8F0" }}>
                {["Ad Set Name","Spend","Purchases","CPA","Relative CPA","Decision","Decision Explanation","Extended Trends"].map(h => (
                  <th key={h} style={{ padding: 8, borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.adset_id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                  <td style={{ padding: 8, whiteSpace: "nowrap" }}>{r.adset_name}</td>
                  <td style={{ padding: 8, whiteSpace: "nowrap" }}>{r.spend_short}</td>
                  <td style={{ padding: 8, whiteSpace: "nowrap" }}>{r.purchases_short}</td>
                  <td style={{ padding: 8, whiteSpace: "nowrap" }}>{r.cpa_short}</td>
                  <td style={{ padding: 8, whiteSpace: "nowrap" }}>{r.relative_cpa}</td>
                  <td style={{ padding: 8, whiteSpace: "nowrap", fontWeight: 600 }}>{r.decision}</td>
                  <td style={{ padding: 8, minWidth: 320 }}>{r.decision_explanation}</td>
                  <td style={{ padding: 8, minWidth: 320 }}>{r.longterm_summary}</td>
                </tr>
              ))}
              {/* Aggregate row */}
              {results.length > 0 && (
                <tr style={{ background: "#F1F5F9", fontWeight: 600 }}>
                  <td style={{ padding: 8 }}>Aggregate Data</td>
                  <td style={{ padding: 8 }}>{`$${sumSpend.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`}</td>
                  <td style={{ padding: 8 }}>{sumPurchases}</td>
                  <td style={{ padding: 8 }}>{aggCPA != null ? `$${aggCPA.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}` : "N/A"}</td>
                  <td style={{ padding: 8 }} colSpan={4}></td>
                </tr>
              )}
            </tbody>
          </table>

          {runMeta && (
            <div style={{ marginTop: 12, fontSize: 12, color: "#64748B" }}>
              <div>Run: {new Date(runMeta.timestamp).toLocaleString()} • Latest date: {runMeta.latestDate ? new Date(runMeta.latestDate).toLocaleDateString() : "N/A"}</div>
              <div>Params → lookback: {runMeta.params.lookback_days_short}d, conv_scale_min: {runMeta.params.conv_scale_min}, conv_consider_min: {runMeta.params.conv_consider_min}, spend_min: {runMeta.params.spend_min}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
