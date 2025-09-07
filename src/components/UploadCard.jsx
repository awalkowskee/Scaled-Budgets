import React from "react";

export default function UploadCard({ onFile, onRun, onClear, onLoadSample, onRunTests, fileName, rowsCount, error }) {
  const inputRef = React.useRef(null);
  return (
    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", padding: 16 }}>
      <h2 style={{ fontWeight: 500, marginBottom: 12 }}>1) Upload CSV/XLS</h2>
      <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" onChange={(e) => e.target.files && onFile(e.target.files[0])} style={{ display: "none" }}/>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => inputRef.current?.click()} style={{ padding: "8px 12px", background: "#4F46E5", color: "white", borderRadius: 8, border: 0 }}>Upload File</button>
        <span style={{ fontSize: 13, color: "#475569" }}>{fileName || "No file selected"}</span>
      </div>
      {rowsCount > 0 && <p style={{ marginTop: 8, fontSize: 13, color: "#475569" }}>Loaded rows: {rowsCount.toLocaleString()}</p>}
      {error && <p style={{ marginTop: 8, fontSize: 13, color: "#DC2626" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        <button onClick={onRun} style={{ padding: "8px 12px", background: "#0F172A", color: "white", borderRadius: 8, border: 0 }}>Run Analysis</button>
        <button onClick={onClear} style={{ padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 8, background: "white" }}>Clear</button>
        <button onClick={onLoadSample} style={{ padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 8, background: "white" }}>Load Sample Data</button>
        <button onClick={onRunTests} style={{ padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 8, background: "white" }}>Run Tests</button>
      </div>
    </div>
  );
}
