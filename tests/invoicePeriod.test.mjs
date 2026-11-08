import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

function load(file, modules = {}) {
  const source = readFileSync(new URL(file, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  vm.runInNewContext(outputText, { exports, Intl, Date, require: (name) => {
    if (!(name in modules)) throw new Error(`Unexpected import: ${name}`);
    return modules[name];
  } });
  return exports;
}

const { invoiceWorkMonth, invoiceWorkPeriod } = load("../src/lib/invoice.ts");

test("month label comes from work dates, including periods spanning months and years", () => {
  assert.equal(invoiceWorkMonth("2026-01-01", "2026-01-07"), "Januari 2026");
  assert.equal(invoiceWorkMonth("2026-04-27", "2026-05-03"), "April 2026 / Mei 2026");
  assert.equal(invoiceWorkMonth("2026-12-28", "2027-01-03"), "Desember 2026 / Januari 2027");
  assert.equal(invoiceWorkMonth(null, null), "-");
  assert.equal(invoiceWorkPeriod(null, null), "-");
  assert.match(invoiceWorkPeriod("2026-04-27", "2026-05-03"), /27 Apr 2026 s.d. 3 Mei 2026/);
});

test("invoice form sends the numeric week and work dates separately from submit date", async () => {
  let payload;
  const { useInvoiceActions } = load("../src/hooks/Invoice/useInvoice.ts", {
    react: { useState: (value) => [value, () => {}] },
    "@/lib/axios": { AxiosInstance: { post: async (_, body) => { payload = body; } } },
    "@/lib/errors": { getErrorMessage: (error) => error.message },
    "@/hooks/useAsyncData": {},
  });
  const result = await useInvoiceActions().save({
    service_name: "W manual", division: "Dryer", invoice_number: "", service_date: "",
    contract_number: " CONTRACT-A ", work_period_start: "2026-04-27", work_period_end: "2026-05-03",
    week_number: "18", invoice_date: "2026-08-14", client: "", amount: "", notes: "",
  });
  assert.equal(result, null);
  assert.equal(payload.contract_number, "CONTRACT-A");
  assert.equal(payload.week_number, 18);
  assert.equal(payload.work_period_start, "2026-04-27");
  assert.equal(payload.work_period_end, "2026-05-03");
  assert.equal(payload.invoice_date, "2026-08-14");
});
