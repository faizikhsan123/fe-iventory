import { useState } from "react";
import { AxiosInstance } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors";
import { CPD_FIELDS, type CpdForm } from "@/schemas/cpd";

// Data CPD dari API detail karyawan. nik_ktp & npwp hanya ada untuk admin (key tidak dikirim ke non-admin).
export type Cpd = Partial<Record<(typeof CPD_FIELDS)[number]["name"], string | null>>;

export const emptyCpd = (): CpdForm => Object.fromEntries(CPD_FIELDS.map((f) => [f.name, ""])) as CpdForm;

export const cpdToForm = (cpd?: Cpd | null): CpdForm => ({
  ...emptyCpd(),
  ...Object.fromEntries(Object.entries(cpd ?? {}).map(([k, v]) => [k, v ?? ""])),
});

// Objek bersarang cpd[field] di FormData. Field kosong tidak dikirim, kecuali clearEmpty (untuk mengosongkan saat edit).
export const appendCpd = (formData: FormData, cpd: CpdForm | undefined, clearEmpty = false) => {
  if (!cpd) return;
  for (const { name } of CPD_FIELDS) {
    const value = cpd[name];
    if (value) formData.append(`cpd[${name}]`, value);
    else if (clearEmpty && value !== undefined) formData.append(`cpd[${name}]`, "");
  }
};

// Simpan CPD karyawan yang sudah ada (admin) lewat endpoint khusus: PUT /employes/{id}/cpd (JSON).
// String kosong dikirim apa adanya; Laravel mengubahnya jadi null sehingga kolom dikosongkan.
export const useSaveCpd = () => {
  const [saving, setSaving] = useState(false);

  // return pesan error, atau null kalau berhasil
  const save = async (employeId: number, cpd: CpdForm, editableKeys: string[]): Promise<string | null> => {
    setSaving(true);
    try {
      // hanya field yang memang dirender (nik/npwp tidak ikut kalau API tidak mengirimnya)
      const payload = Object.fromEntries(Object.entries(cpd).filter(([k]) => editableKeys.includes(k)));
      await AxiosInstance.put(`/employes/${employeId}/cpd`, payload);
      return null;
    } catch (e) {
      return getErrorMessage(e, "Gagal menyimpan data CPD");
    } finally {
      setSaving(false);
    }
  };

  return { saving, save };
};
