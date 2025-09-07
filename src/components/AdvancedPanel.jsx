import React from "react";

export default function AdvancedPanel({ params, onChange }) {
  return (
    <div style={{ 
      background: "#fff", 
      borderRadius: 16, 
      boxShadow: "0 1px 8px rgba(0,0,0,0.06)", 
      padding: "16px 36px 48px 16px",  // Changed right padding from 16px to 36px
      height: "calc(100vh - 30px)", // Changed from 24px to 30px
      overflowY: "auto"
    }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 500 }}>Advanced</h2>
        <p style={{ color: "#64748B", marginTop: 8 }}>Adjust data for analysis</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
        <label>Days to analyze
          <input type="number" min={2} max={7} value={params.lookback_days_short} onChange={(e)=>onChange("lookback_days_short", Number(e.target.value))} style={{ marginTop: 4, width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 8px" }}/>
        </label>
        <label>Min conversions to scale
          <input type="number" min={5} max={30} value={params.conv_scale_min} onChange={(e)=>onChange("conv_scale_min", Number(e.target.value))} style={{ marginTop: 4, width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 8px" }}/>
        </label>
        <label>Min conversions to action
          <input type="number" min={1} max={30} value={params.conv_consider_min} onChange={(e)=>onChange("conv_consider_min", Number(e.target.value))} style={{ marginTop: 4, width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 8px" }}/>
        </label>
        <label>Min spend per ad set (in time frame)
          <input type="number" min={0} step={50} value={params.spend_min} onChange={(e)=>onChange("spend_min", Number(e.target.value))} style={{ marginTop: 4, width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 8px" }}/>
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 32 }}>
        {/* Left column: Relative CPA to mean */}
        <div>
          <div style={{ fontWeight: 500, marginBottom: 12 }}>Relative CPA to mean</div>
          <div style={{ display: "grid", gridTemplateRows: "repeat(4,auto)", gap: 16 }}>
            {[0,1,2,3].map(i => (
              <label key={i} style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 14, marginBottom: 4 }}>Rel CPA ≤</span>
                <input
                  type="number"
                  step={0.01}
                  value={params.rel_cpa_bands[i]}
                  onChange={e => {
                    const v = Number(e.target.value);
                    const arr = [...params.rel_cpa_bands];
                    arr[i] = v;
                    onChange("rel_cpa_bands", arr);
                  }}
                  style={{
                    width: "100%",
                    border: "1px solid #CBD5E1",
                    borderRadius: 8,
                    padding: "6px 8px"
                  }}
                />
              </label>
            ))}
          </div>
        </div>
        {/* Right column: Scale limits */}
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>Scale limits</div>
          <div style={{ fontSize: 12, color: "#64748B", marginBottom: 12 }}>
            Long-term windows fixed at 7/14/21 (summary only).
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
        </div>
      </div>
    </div>
  );
}
