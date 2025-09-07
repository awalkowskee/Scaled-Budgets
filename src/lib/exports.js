import { fmtCurrency } from "./format.js";

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
function toCSV(rows) {
  if (!rows?.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v) => {
    if (v == null) return "";
    const s = String(v).replace(/\"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => esc(r[h])).join(","));
  return lines.join("\n");
}

export async function exportCSV(filename, rows) {
  const csv = toCSV(rows);
  downloadBlob(filename, new Blob([csv], { type: "text/csv;charset=utf-8;" }));
}

export async function exportXLS(filename, rows) {
  try {
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Recommendations");
    XLSX.writeFile(wb, filename);
  } catch {
    await exportCSV(filename.replace(/\.xlsx?$/i, ".csv"), rows);
  }
}

async function safeAutoTable(doc, { startY, head, body, styles, headStyles }) {
  let used = false;
  try {
    const mod = await import("jspdf-autotable");
    const fn = mod?.default || mod?.autoTable;
    if (typeof fn === "function") { fn(doc, { startY, head: [head], body, styles, headStyles }); used = true; }
  } catch {}
  if (!used && typeof doc.autoTable === "function") {
    doc.autoTable({ startY, head: [head], body, styles, headStyles }); used = true;
  }
  if (!used) {
    let y = startY; doc.setFontSize(10); doc.text(head.join("  |  "), 40, y); y += 18;
    body.forEach((row) => { doc.text(row.map(String).join("   •   "), 40, y); y += 14; });
    return y;
  }
  return (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY : startY + 20;
}

export async function exportPDF(filename, rows, runMeta) {
  let jsPDF;
  try { jsPDF = (await import("jspdf")).jsPDF; } catch {}
  const head = ["Ad Set Name","Spend (short)","Purchases (short)","CPA (short)","Relative CPA","Decision","Decision Explanation","Long-Term Summary"];

  if (!jsPDF) {
    const html = `<!doctype html><html><head><meta charset='utf-8'><title>Scaled Budgets — Recommendations</title>
      <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;padding:24px;} table{border-collapse:collapse;width:100%;} th,td{border:1px solid #ddd;padding:8px;font-size:12px;} th{background:#e5e7eb;text-align:left;}</style>
      </head><body><h2>Scaled Budgets — Recommendations</h2>
      <div style='margin:8px 0 16px;font-size:12px;color:#475569;'>Run: ${new Date(runMeta?.timestamp||Date.now()).toLocaleString()}</div>
      <table><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>
      ${rows.map(r=>`<tr><td>${r.adset_name}</td><td>${r.spend_short}</td><td>${r.purchases_short}</td><td>${r.cpa_short}</td><td>${r.relative_cpa}</td><td>${r.decision}</td><td>${r.decision_explanation}</td><td>${r.longterm_summary}</td></tr>`).join("")}
      </tbody></table><script>window.onload=()=>{window.print();}</script></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    downloadBlob(filename.replace(/\.pdf$/i, ".html"), blob);
    return;
  }

  const doc = new jsPDF({ unit: "pt", orientation: "landscape" });
  doc.setFontSize(14);
  doc.text("Scaled Budgets — Recommendations", 40, 40);
  const body = rows.map(r => [r.adset_name,r.spend_short,r.purchases_short,r.cpa_short,r.relative_cpa,r.decision,r.decision_explanation,r.longterm_summary]);

  const finalY = await safeAutoTable(doc, {
    startY: 60, head, body,
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [30,41,59], textColor: 255 },
  });

  const footerY = (finalY || 60) + 24;
  doc.setFontSize(9);
  doc.text(`Run: ${new Date(runMeta.timestamp).toLocaleString()}  •  Latest Date: ${runMeta.latestDate ? new Date(runMeta.latestDate).toLocaleDateString() : "N/A"}`, 40, footerY);
  doc.text(`Params → lookback: ${runMeta.params.lookback_days_short}d, conv_scale_min: ${runMeta.params.conv_scale_min}, conv_consider_min: ${runMeta.params.conv_consider_min}, spend_min: ${fmtCurrency(runMeta.params.spend_min)}`, 40, footerY+14);
  doc.save(filename);
}
