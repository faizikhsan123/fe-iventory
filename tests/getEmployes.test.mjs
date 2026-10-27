import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/hooks/employes/getEmployes.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});

function setup(get) {
  const state = [];
  const exports = {};
  const react = {
    useCallback: (fn) => fn,
    useRef: (current) => ({ current }),
    useState(initial) {
      const index = state.length;
      state.push(initial);
      return [initial, (value) => { state[index] = value; }];
    },
  };
  vm.runInNewContext(outputText, {
    exports,
    require: (name) => name === "react" ? react : { AxiosInstance: { get } },
  });
  return { hook: exports.default(), state };
}

const response = (data, last_page = 1) => ({ data: { data, meta: { last_page, total: data.length } } });

test("all mode returns every employee across more than 100 records", async () => {
  const employees = Array.from({ length: 235 }, (_, i) => ({ id: i + 1 }));
  const calls = [];
  const { hook, state } = setup(async (url, { params }) => {
    calls.push({ url, ...params });
    return response(employees.slice((params.page - 1) * 100, params.page * 100), 3);
  });
  await hook.getEmployesButton({ all: true, division: "Dryer" });
  assert.equal(state[0].length, 235);
  assert.equal(new Set(state[0].map((e) => e.id)).size, 235);
  assert.deepEqual(calls.map((c) => c.page), [1, 2, 3]);
  assert.ok(calls.every((c) => c.per_page === 100 && c.division === "Dryer" && !("all" in c)));
  assert.equal(state[1], false);
  assert.equal(state[3], null);
});

test("normal employee table keeps pagination and filters", async () => {
  let sent;
  const { hook, state } = setup(async (_, { params }) => {
    sent = params;
    return response([{ id: 9 }], 5);
  });
  await hook.getEmployesButton({ page: 2, per_page: 10, search: "Budi" });
  assert.equal(sent.page, 2);
  assert.equal(sent.per_page, 10);
  assert.equal(sent.search, "Budi");
  assert.equal(state[3].last_page, 5);
});

test("a failed later page leaves no partial employee list", async () => {
  const { hook, state } = setup(async (_, { params }) => {
    if (params.page === 2) throw new Error("network error");
    return response([{ id: 1 }], 2);
  });
  await hook.getEmployesButton({ all: true });
  assert.equal(state[0].length, 0);
  assert.ok(state[2]);
  assert.equal(state[1], false);
});

test("a late previous request cannot overwrite a newer result", async () => {
  let resolveOld;
  let count = 0;
  const { hook, state } = setup(async () => {
    if (++count === 1) return new Promise((resolve) => { resolveOld = resolve; });
    return response([{ id: 2 }]);
  });
  const old = hook.getEmployesButton({ all: true });
  await hook.getEmployesButton({ all: true });
  resolveOld(response([{ id: 1 }]));
  await old;
  assert.equal(state[0][0].id, 2);
});
