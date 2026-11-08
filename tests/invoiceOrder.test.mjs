import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

function setup() {
  const source = readFileSync(new URL("../src/hooks/Invoice/useInvoice.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const calls = [];
  const modules = {
    react: { useState: (value) => [value, () => {}] },
    "@/lib/axios": { AxiosInstance: {
      post: async (url, body) => { calls.push({ url, body }); },
      put: async (url, body) => { calls.push({ url, body }); },
    } },
    "@/lib/errors": { getErrorMessage: (error) => error.message },
    "@/hooks/useAsyncData": {},
  };
  const exports = {};
  vm.runInNewContext(outputText, { exports, require: (name) => {
    if (!(name in modules)) throw new Error(`Unexpected import: ${name}`);
    return modules[name];
  } });
  return { actions: exports.useInvoiceActions(), calls };
}

const form = {
  service_name: "MAY 2026 W18-W22", division: "I&C-PMR", invoice_number: "129",
  service_date: "2026-09-07", invoice_date: "2026-09-17", sort_order: "20",
  client: "Client", amount: "32666800", notes: "Existing notes",
};

test("manual order is saved as a number without changing dates or description", async () => {
  const { actions, calls } = setup();
  assert.equal(await actions.save(form, 5), null);
  assert.equal(calls[0].url, "/invoices/5");
  assert.equal(calls[0].body.sort_order, 20);
  assert.equal(calls[0].body.service_date, "2026-09-07");
  assert.equal(calls[0].body.invoice_date, "2026-09-17");
  assert.equal(calls[0].body.service_name, form.service_name);
  assert.ok(!("contract_number" in calls[0].body));
  assert.ok(!("work_period_start" in calls[0].body));
});

test("clearing Order sends null so the invoice moves to the end", async () => {
  const { actions, calls } = setup();
  assert.equal(await actions.save({ ...form, sort_order: "" }), null);
  assert.equal(calls[0].url, "/invoices");
  assert.equal(calls[0].body.sort_order, null);
});
