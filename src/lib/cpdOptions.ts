// Sumber tunggal pilihan dropdown field CPD. Nilai tersimpan = label (bahasa Indonesia).
// Urutan = urutan tampil di dropdown.
export const GENDER_OPTIONS = ["Laki-laki", "Perempuan"] as const;

export const RELIGION_OPTIONS = [
  "Islam",
  "Kristen Protestan",
  "Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
] as const;

export const MARITAL_STATUS_OPTIONS = ["Belum Menikah", "Menikah", "Cerai Hidup", "Cerai Mati"] as const;

export const EMERGENCY_RELATIONSHIP_OPTIONS = [
  "Suami",
  "Istri",
  "Ayah",
  "Ibu",
  "Anak",
  "Saudara Kandung",
  "Lainnya",
] as const;

// Nilai untuk z.enum (tuple non-kosong)
export const GENDER_VALUES = [...GENDER_OPTIONS] as unknown as [
  (typeof GENDER_OPTIONS)[number],
  ...(typeof GENDER_OPTIONS)[number][],
];
export const RELIGION_VALUES = [...RELIGION_OPTIONS] as unknown as [
  (typeof RELIGION_OPTIONS)[number],
  ...(typeof RELIGION_OPTIONS)[number][],
];
export const MARITAL_STATUS_VALUES = [...MARITAL_STATUS_OPTIONS] as unknown as [
  (typeof MARITAL_STATUS_OPTIONS)[number],
  ...(typeof MARITAL_STATUS_OPTIONS)[number][],
];
export const EMERGENCY_RELATIONSHIP_VALUES = [...EMERGENCY_RELATIONSHIP_OPTIONS] as unknown as [
  (typeof EMERGENCY_RELATIONSHIP_OPTIONS)[number],
  ...(typeof EMERGENCY_RELATIONSHIP_OPTIONS)[number][],
];

// Field CPD yang berupa dropdown -> daftar opsinya
export const CPD_SELECT_OPTIONS: Record<string, readonly string[]> = {
  gender: GENDER_OPTIONS,
  religion: RELIGION_OPTIONS,
  marital_status: MARITAL_STATUS_OPTIONS,
  emergency_relationship: EMERGENCY_RELATIONSHIP_OPTIONS,
};
