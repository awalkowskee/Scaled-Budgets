export const HEADER_MAP = {
  "Ad Set Name": "adset_name",
  "Ad set ID": "adset_id",
  Day: "date",
  "Amount spent (USD)": "spend",
  Purchases: "purchases",
};

export function mapMetaRows(rawRows) {
  return rawRows.map((row) => {
    const mapped = {};
    for (const [meta, key] of Object.entries(HEADER_MAP)) {
      if (meta in row) mapped[key] = row[meta];
      else if (key in row) mapped[key] = row[key];
    }
    return mapped;
  });
}
