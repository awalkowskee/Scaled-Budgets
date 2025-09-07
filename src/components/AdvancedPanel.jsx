import React from "react";

export default function AdvancedPanel({ params, onChange, show, setShow }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ fontWeight: 500 }}>2) Advanced</h2>
        <button onClick={() => setShow(v => !v)} style={{ fontSize: 13, padding: "6px 10px", border: "1px solid #CBD5E1", borderRadius: 8, background: "white" }}>{show ? "Hide" : "Show"}</button>
      </div>
      {show ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>Lookback (days)
              <input type="number" min={2} max={7} value={params.lookback_days_short} onChange={(e)=>onChange("lookback_days_short", Number(e.target.value))} style={{ marginTop: 4, width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 8px" }}/>
            </label>
            <label>Conv to scale
              <input type="number" min={5} max={30} value={params.conv_scale_min} onChange={(e)=>onChange("conv_scale_min", Number(e.target.value))} style={{ marginTop: 4, width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 8px" }}/>
            </label>
            <label>Conv to consider
              <input type="number" min={1} max={30} value={params.conv_consider_min} onChange={(e)=>onChange("conv_consider_min", Number(e.target.value))} style={{ marginTop: 4, width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 8px" }}/>
            </label>
            <label>Min spend (short)
              <input type="number" min={0} step={50} value={params.spend_min} onChange={(e)=>onChange("spend_min", Number(e.target.value))} style={{ marginTop: 4, width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 8px" }}/>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 12 }}>
            {[0,1,2,3].map(i => (
              <label key={i}>Rel CPA ≤
                <input type="number" step={0.01} value={params.rel_cpa_bands[i]} onChange={(e)=>{ const v = Number(e.target.value); const arr = [...params.rel_cpa_bands]; arr[i]=v; onChange("rel_cpa_bands", arr); }} style={{ marginTop: 4, width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 8px" }}/>
              </label>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 12 }}>
            <label>Scale min %
              <input type="number" min={5} max={50} value={params.scale_step_min} onChange={(e)=>onChange("scale_step_min", Number(e.target.value))} style={{ marginTop: 4, width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 8px" }}/>
            </label>
            <label>Scale max %
              <input type="number" min={5} max={100} value={params.scale_step_max} onChange={(e)=>onChange("scale_step_max", Number(e.target.value))} style={{ marginTop: 4, width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 8px" }}/>
            </label>
            <label>Cut min %
              <input type="number" min={5} max={50} value={params.cut_step_min} onChange={(e)=>onChange("cut_step_min", Number(e.target.value))} style={{ marginTop: 4, width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 8px" }}/>
            </label>
            <label>Cut max %
              <input type="number" min={5} max={100} value={params.cut_step_max} onChange={(e)=>onChange("cut_step_max", Number(e.target.value))} style={{ marginTop: 4, width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 8px" }}/>
            </label>
          </div>

          <p style={{ fontSize: 12, color: "#64748B", marginTop: 8 }}>Long-term windows fixed at 7/14/21 (summary only).</p>
        </>
      ) : (
        <p style={{ fontSize: 12, color: "#64748B" }}>Advanced settings are hidden to prevent accidental changes.</p>
      )}
    </div>
  );
}
