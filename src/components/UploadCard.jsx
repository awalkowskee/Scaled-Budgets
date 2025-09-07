import React from "react";

export default function UploadCard({ onFile, onRun, onClear, onLoadSample, onRunTests, fileName, rowsCount, error }) {
  const inputRef = React.useRef(null);
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", padding: 16 }}>
      <h2 style={{ fontWeight: 500, marginBottom: 12 }}>Upload CSV/XLS</h2>
      <p style={{ fontSize: 12, color: "#334155", marginBottom: 10 }}>
        Upload a Meta Ads Report that follows these specifications: 
        <br />Timeframe: Last 21 days, by day. 
        <br />Columns: Ad Set Name, Ad Set ID, Amount Spent, Ad Set Delivery, and Purchases (or main KPI)
      </p>
      
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFile(file);
            e.target.value = ''; // Reset input after successful upload
          }
        }}
        style={{ display: "none" }}
      />
      
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            padding: "8px 12px",
            background: "#4F46E5",
            color: "white",
            borderRadius: 8,
            border: 0,
            height: 36,
            minWidth: 90,
            cursor: "pointer"
          }}
        >
          Upload File
        </button>
        
        <div
          onClick={() => inputRef.current?.click()} // <-- Make clickable
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          style={{
            border: dragActive ? "2px solid #4F46E5" : "2px dashed #CBD5E1",
            borderRadius: 8,
            padding: "8px 12px",
            background: dragActive ? "#EEF2FF" : "#F8FAFC",
            color: "#475569",
            fontSize: 13,
            cursor: "pointer",
            transition: "border 0.2s, background 0.2s",
            height: 20, // Match height with Upload File button
            display: "flex",
            alignItems: "center",
            minWidth: 80
          }}
          tabIndex={0} // for accessibility
          role="button"
          aria-label="Drag file here or click to upload"
        >
          Drag file here
        </div>
        
        <span style={{ fontSize: 13, color: "#475569" }}>
          {fileName || "No file selected"}
        </span>
      </div>

      {rowsCount > 0 && (
        <p style={{ marginTop: 8, fontSize: 13, color: "#475569" }}>
          Loaded rows: {rowsCount.toLocaleString()}
        </p>
      )}
      
      {error && (
        <p style={{ marginTop: 8, fontSize: 13, color: "#DC2626" }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        <button 
          onClick={onRun} 
          style={{ padding: "8px 12px", background: "#0F172A", color: "white", borderRadius: 8, border: 0 }}
        >
          Run Analysis
        </button>
        <button 
          onClick={onClear} 
          style={{ padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 8, background: "white" }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
