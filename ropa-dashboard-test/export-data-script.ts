// Office Script for ROPA MONITORING.xlsx — builds the dashboard's data.json.
// Paste into Excel (Automate tab → New Script), save as "Export dashboard data".
// Used by the Power Automate flow in HOW-TO-UPDATE.md. Borrower names are not included.
function main(workbook: ExcelScript.Workbook): string {
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const text = (v: string | number | boolean) => String(v === null || v === undefined ? "" : v).trim();
  const num = (v: string | number | boolean) => (typeof v === "number" ? v : Number(text(v).replace(/,/g, "")) || 0);
  const numOrNull = (v: string | number | boolean) => (v === "" || v === null || v === undefined ? null : Number(v));

  // Every sold unit, from the WEB DATA sheet (first row = column names)
  const web = workbook.getWorksheet("WEB DATA").getUsedRange(true).getValues();
  const head = web[0].map((h) => text(h));
  const col = (r: (string | number | boolean)[], name: string) => r[head.indexOf(name)];
  const sold = web.slice(1)
    .filter((r) => MONTHS.indexOf(text(r[0])) >= 0)
    .map((r) => ({
      month: text(col(r, "month")),
      product_type: text(col(r, "product_type")),
      division: text(col(r, "division")),
      condition: text(col(r, "condition")),
      non_starter: /NON.*START/i.test(text(col(r, "non_starter"))),
      opb: num(col(r, "opb")),
      sold_amount: num(col(r, "sold_amount")),
      gain: num(col(r, "gain")),
      recovery: num(col(r, "recovery")),
      associate: text(col(r, "associate")),
      unit: [col(r, "brand"), col(r, "series"), col(r, "year")].map((x) => text(x)).filter((x) => x !== "").join(" "),
      storage_fee: num(col(r, "storage_fee")),
      notarial_fee: num(col(r, "notarial_fee")),
      towing_fee: num(col(r, "towing_fee")),
      legal_fee: num(col(r, "legal_fee")),
      commissions: num(col(r, "commissions")),
      repair_fee: num(col(r, "repair_fee")),
    }));

  // Monthly 2025 vs 2026 table on ROPA OVERVIEW (T = month, U–W = 2025, AB–AD = 2026)
  const ov = workbook.getWorksheet("ROPA OVERVIEW").getRange("T4:AD15").getValues();
  const monthly = ov.map((r, i) => ({
    month_num: i + 1,
    units_2025: numOrNull(r[1]), sales_2025: numOrNull(r[2]), gain_2025: numOrNull(r[3]),
    units_2026: numOrNull(r[8]), sales_2026: numOrNull(r[9]), gain_2026: numOrNull(r[10]),
  }));

  // Inventory by status on DAILY TOTAL INVTY (month names in row 3, statuses in rows 5–14)
  const iv = workbook.getWorksheet("DAILY TOTAL INVTY").getRange("B3:F14").getValues();
  const proper = (s: string | number | boolean) => text(s).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  const inventory = {
    prev: proper(iv[0][1]),
    cur: proper(iv[0][3]),
    rows: iv.slice(2).filter((r) => text(r[0]) !== "").map((r) => ({
      status: text(r[0]), units_prev: numOrNull(r[1]), opb_prev: numOrNull(r[2]), units_cur: numOrNull(r[3]), opb_cur: numOrNull(r[4]),
    })),
  };

  // Month picked on the Excel DASHBOARD (J2) — the website opens on it
  const defaultMonth = text(workbook.getWorksheet("DASHBOARD").getRange("J2").getValue());

  return JSON.stringify({ generated_at: new Date().toISOString(), default_month: defaultMonth, sold, monthly, inventory });
}
