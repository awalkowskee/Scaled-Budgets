# Scaled Budgets — MVP (React, Multi-file)

## Quick start
1) Install Node.js LTS from https://nodejs.org
2) Unzip this folder, open a terminal in it, then run:
```bash
npm install
npm start
```
This launches the app at http://localhost:3000

## Structure
- `src/components/` — Upload card, Advanced panel, Results table
- `src/lib/` — formatting, aggregation, decision logic, exports, sample data, tests
- `src/App.js` — wires everything together

## Notes
- XLSX/PDF exports have graceful fallbacks if libraries aren’t available.


## Collapsable panel
Advanced (collapsible panel, defaults prefilled)
lookback_days_short = 3 (user can change; 4 is also common)
conv_scale_min = 10 (purchases in short window to allow scale)
conv_consider_min = 5 (min purchases in short window to take any action; else Hold)
spend_min = $300 (min spend in short window to take action when purchases are low)
rel_cpa_bands = [0.75, 1.00, 1.25, 1.50]
scale_step_min/max = +10% / +25% (default range; see exact mapping below)
cut_step_min/max = −10% / −25% (default range; see exact mapping below)
max_weekly_growth_per_adset = +50%
longterm_windows = 7/14/21 (used internally; only summary shown in UI)

## Logic
For each ad set:
1. Aggregate short window (N = lookback_days_short) daily rows:
    spend_short, purchases_short, cpa_short = spend_short / purchases_short (if purchases > 0)
2. Compute portfolio median CPA across ad sets with purchases_short ≥ conv_consider_min (median is robust).
3. relative_cpa = cpa_short / median_cpa_short.
4. Eligibility:
    If purchases_short < conv_consider_min and spend_short < spend_min → Hold (Low volume).
5. Exact action mapping (defaults; user can change band thresholds and steps in Advanced):
    If purchases_short ≥ conv_scale_min:
        relative_cpa ≤ 0.75 → Scale +25%
        0.76–1.00 → Scale +15%
        1.01–1.20 → Hold
        1.21–1.50 → Cut −15%
        > 1.50 → Cut −25%
6. Else (eligible but below conv_scale_min):
    relative_cpa ≤ 0.75 → Scale +10% (gentle nudge; not full scale until 10+ purchases)
    0.76–1.00 → Hold
    1.01–1.20 → Hold
    1.21–1.50 → Cut −10%
    > 1.50 → Cut −20%
7. Stability guards:
    Enforce max_weekly_growth_per_adset (+50%) across the last 7 days.
    Prevent a single ad set from exceeding an optional spend concentration (e.g., 60%) if we add that later.