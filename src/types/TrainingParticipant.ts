export type TrainingParticipant = {
  id: number;
  training_id: number;
  employes_id: number;
  name: string | null;
  division: string | null;
  position: string | null;
  date: string | null; // tampilan, contoh: 08 Oktober 2026
  date_raw: string | null; // buat form, contoh: 2026-10-08
  file: string | null;
  notes: string | null;
};