import { z } from "zod";
import {
  EMERGENCY_RELATIONSHIP_VALUES,
  GENDER_VALUES,
  MARITAL_STATUS_VALUES,
  RELIGION_VALUES,
} from "@/lib/cpdOptions";

// Field CPD, urutan = urutan tampil. Semua opsional.
export const CPD_FIELDS = [
  { name: "date_of_birth", label: "Date of Birth", type: "date" },
  { name: "place_of_birth", label: "Place of Birth", max: 100 },
  { name: "gender", label: "Gender", select: true },
  { name: "marital_status", label: "Marital Status", select: true },
  { name: "religion", label: "Religion", select: true },
  { name: "nik_ktp", label: "National ID (NIK)", max: 32, sensitive: true, inputMode: "numeric" },
  { name: "npwp", label: "Tax ID (NPWP)", max: 32, sensitive: true },
  { name: "bpjs_labour_no", label: "BPJS Employment No.", max: 50 },
  { name: "phone", label: "Phone No.", max: 30, type: "tel", inputMode: "tel" },
  { name: "province", label: "Province", max: 100 },
  { name: "city", label: "City", max: 100 },
  { name: "post_code", label: "Postal Code", max: 10, inputMode: "numeric" },
  { name: "contract_number", label: "Contract No.", max: 100 },
  { name: "department", label: "Department", max: 100 },
  { name: "employee_type", label: "Employee Type", max: 50 },
  { name: "ptfi_assigned_uid", label: "PTFI Assigned UID", max: 50 },
  { name: "emergency_name", label: "Emergency Contact Name", max: 100 },
  { name: "emergency_phone", label: "Emergency Contact Phone", max: 30, type: "tel", inputMode: "tel" },
  { name: "emergency_relationship", label: "Emergency Contact Relationship", select: true },
] as const satisfies readonly {
  name: string;
  label: string;
  max?: number;
  select?: boolean;
  type?: string;
  inputMode?: string;
  sensitive?: boolean;
  wide?: boolean;
}[];

export type CpdFieldName = (typeof CPD_FIELDS)[number]["name"];

const optionalText = (max: number) =>
  z.string().max(max, `Maximum ${max} characters`).optional().nullable();

// Dropdown: string kosong -> null. Nilai lama di luar daftar ditolak dengan pesan jelas.
// Tipe input = output (termasuk "") dideklarasikan eksplisit supaya cocok dengan nilai default form (""),
// sama seperti field teks lain; saat parse, "" tetap menjadi null.
const optionalEnum = <T extends [string, ...string[]]>(values: T) =>
  z
    .union([z.literal("").transform(() => null), z.enum(values, "Select one of the available options")])
    .optional()
    .nullable() as unknown as z.ZodType<T[number] | "" | null | undefined, T[number] | "" | null | undefined>;

export const cpdSchema = z.object({
  date_of_birth: z.string().optional().nullable(),
  place_of_birth: optionalText(100),
  gender: optionalEnum(GENDER_VALUES),
  marital_status: optionalEnum(MARITAL_STATUS_VALUES),
  religion: optionalEnum(RELIGION_VALUES),
  nik_ktp: optionalText(32),
  npwp: optionalText(32),
  bpjs_labour_no: optionalText(50),
  phone: optionalText(30),
  province: optionalText(100),
  city: optionalText(100),
  post_code: optionalText(10),
  contract_number: optionalText(100),
  department: optionalText(100),
  employee_type: optionalText(50),
  ptfi_assigned_uid: optionalText(50),
  emergency_name: optionalText(100),
  emergency_phone: optionalText(30),
  emergency_relationship: optionalEnum(EMERGENCY_RELATIONSHIP_VALUES),
});

export type CpdForm = z.infer<typeof cpdSchema>;

// Ukuran APD (teks bebas, maks 30 karakter)
export const PPE_FIELDS = [
  { name: "ppe_shoes", key: "shoes", label: "Shoes" },
  { name: "ppe_coverall", key: "coverall", label: "Coverall" },
  { name: "ppe_wearpack", key: "wearpack", label: "Wearpack" },
  { name: "ppe_respirator", key: "respirator", label: "Respirator" },
  { name: "ppe_vest", key: "vest", label: "Vest" },
  { name: "ppe_gloves", key: "gloves", label: "Gloves" },
] as const;

export type PpeFieldName = (typeof PPE_FIELDS)[number]["name"];

const ppeText = z.string().max(30, "Maximum 30 characters").optional().nullable();

export const ppeSchemaShape = {
  ppe_shoes: ppeText,
  ppe_coverall: ppeText,
  ppe_wearpack: ppeText,
  ppe_respirator: ppeText,
  ppe_vest: ppeText,
  ppe_gloves: ppeText,
};

export type PpeSizes = { [K in (typeof PPE_FIELDS)[number]["key"]]?: string | null };
