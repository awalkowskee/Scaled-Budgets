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
