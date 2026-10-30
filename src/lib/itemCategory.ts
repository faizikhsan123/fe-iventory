// Sumber tunggal kategori barang. Urutan = urutan tampil di dropdown.
export const ITEM_CATEGORIES = [
  { value: "apd", label: "PPE" },
  { value: "tools", label: "Tools" },
  { value: "atk", label: "Stationery" },
  { value: "others", label: "Others" },
] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number]["value"];

export const ITEM_CATEGORY_VALUES = ITEM_CATEGORIES.map((c) => c.value) as [
  ItemCategory,
  ...ItemCategory[],
];

const LABELS: Record<string, string> = Object.fromEntries(
  ITEM_CATEGORIES.map((c) => [c.value, c.label]),
);

export function categoryLabel(value: string): string {
  return LABELS[value.toLowerCase()] ?? value;
}

export const CATEGORY_BADGE_STYLE: Record<string, string> = {
  apd: "bg-[#DBE2EF] text-[#112D4E] ring-[#BFCCE3]",
  tools: "bg-white text-[#112D4E] ring-[#3F72AF]",
  atk: "bg-[#EEF3FA] text-[#0B2240] ring-[#9DB2D3]",
};

export const CATEGORY_BADGE_FALLBACK = "bg-[#F9F7F7] text-[#50688C] ring-[#DBE2EF]";
