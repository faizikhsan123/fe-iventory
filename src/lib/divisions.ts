// Sumber tunggal daftar divisi. Samakan dengan backend bila berubah.
export const DIVISIONS = ["Gas Analyzer", "I&C-PMR", "I&C-ER", "Dryer", "Safety"] as const;

export type Division = (typeof DIVISIONS)[number];
