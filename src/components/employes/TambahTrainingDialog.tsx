// import { useEffect, useState } from "react";
// import { AlertCircle, FileText, GraduationCap, Loader2 } from "lucide-react";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
// import { Label } from "../ui/label";
// import { Button } from "../ui/button";
// import { useAddEmployeTraining, useTrainingOptions } from "@/hooks/Training/get";

// type Props = {
//   open: boolean;
//   employeId: string;
//   ownedIds: number[]; // training yang sudah dimiliki karyawan
//   onOpenChange: (open: boolean) => void;
//   onSuccess: () => void;
// };

// const fieldBase =
//   "h-11 w-full rounded-lg border border-[#BFCCE3] bg-white px-3 text-base text-[#112D4E] outline-none transition hover:border-[#3F72AF] focus-visible:border-[#3F72AF] focus-visible:ring-4 focus-visible:ring-[#DBE2EF] disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm";

// const TambahTrainingDialog = ({ open, employeId, ownedIds, onOpenChange, onSuccess }: Props) => {
//   const { options, getOptions } = useTrainingOptions();
//   const { loadingAdd, errorAdd, handleAdd, setErrorAdd } = useAddEmployeTraining();

//   const [trainingId, setTrainingId] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [fileError, setFileError] = useState("");

//   useEffect(() => {
//     if (open) {
//       getOptions();
//     } else {
//       setTrainingId("");
//       setFile(null);
//       setFileError("");
//       setErrorAdd("");
//     }
//   }, [open, getOptions, setErrorAdd]);

//   const onPickFile = (f: File | null) => {
//     setFileError("");
//     if (f) {
//       if (f.type !== "application/pdf") return setFileError("File harus PDF");
//       if (f.size > 5 * 1024 * 1024) return setFileError("Ukuran file maksimal 5 MB");
//     }
//     setFile(f);
//   };

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!trainingId) return setFileError("Pilih training dulu");
//     const ok = await handleAdd(employeId, Number(trainingId), file);
//     if (ok) {
//       onSuccess();
//       onOpenChange(false);
//     }
//   };

//   const isReplace = trainingId !== "" && ownedIds.includes(Number(trainingId));

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="flex max-h-[92dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-[#DBE2EF] bg-white p-0 sm:max-w-lg">
//         <DialogHeader className="shrink-0 border-b border-[#BFCCE3] bg-[#DBE2EF] px-4 py-4 pr-12 sm:px-6">
//           <div className="flex items-center gap-3">
//             <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#112D4E] text-white">
//               <GraduationCap className="h-5 w-5" />
//             </div>
//             <div className="min-w-0 text-left">
//               <DialogTitle className="text-lg font-extrabold text-[#112D4E]">Tambah Training</DialogTitle>
//               <DialogDescription className="mt-0.5 text-sm text-[#50688C]">
//                 Pilih training dan upload dokumen pendukung
//               </DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
//           <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
//             <div className="space-y-2">
//               <Label htmlFor="training" className="text-sm font-semibold text-[#112D4E]">
//                 Training <span className="text-[#B3261E]">*</span>
//               </Label>
//               <select
//                 id="training"
//                 value={trainingId}
//                 onChange={(e) => setTrainingId(e.target.value)}
//                 disabled={loadingAdd}
//                 className={fieldBase}
//               >
//                 <option value="">-- Pilih training --</option>
//                 {options.map((t) => (
//                   <option key={t.id} value={t.id}>
//                     {t.name_training} ({t.id_training} · {t.division_training})
//                     {ownedIds.includes(t.id) ? " • sudah ada" : ""}
//                   </option>
//                 ))}
//               </select>
//               {isReplace && (
//                 <p className="text-xs text-[#8A5A00]">
//                   Training ini sudah ada. Kalau upload PDF baru, dokumen lama akan diganti.
//                 </p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="file" className="text-sm font-semibold text-[#112D4E]">
//                 Dokumen Pendukung (PDF, maks 5 MB)
//               </Label>
//               <input
//                 id="file"
//                 type="file"
//                 accept="application/pdf"
//                 disabled={loadingAdd}
//                 onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
//                 className="block w-full cursor-pointer rounded-lg border border-[#BFCCE3] bg-white text-sm text-[#112D4E] file:mr-3 file:h-11 file:cursor-pointer file:border-0 file:bg-[#DBE2EF] file:px-4 file:font-semibold file:text-[#112D4E] hover:border-[#3F72AF]"
//               />
//               {file && (
//                 <p className="flex items-center gap-1.5 text-xs text-[#50688C]">
//                   <FileText size={14} /> {file.name}
//                 </p>
//               )}
//               {fileError && <p className="text-xs font-medium text-[#B3261E] sm:text-sm">{fileError}</p>}
//             </div>

//             {errorAdd && (
//               <div
//                 role="alert"
//                 className="flex items-start gap-2 rounded-lg border border-[#F2B8B5] bg-[#FDECEA] px-3 py-2.5 text-sm text-[#B3261E]"
//               >
//                 <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
//                 <span className="min-w-0 break-words">{errorAdd}</span>
//               </div>
//             )}
//           </div>

//           <DialogFooter className="m-0 shrink-0 flex-col-reverse gap-2 rounded-none border-t border-[#DBE2EF] bg-[#F9F7F7] p-4 sm:flex-row sm:justify-end sm:px-6">
//             <Button
//               type="button"
//               variant="outline"
//               disabled={loadingAdd}
//               onClick={() => onOpenChange(false)}
//               className="h-11 w-full rounded-lg border-[#BFCCE3] bg-white font-semibold text-[#112D4E] hover:bg-[#DBE2EF] sm:w-auto"
//             >
//               Batal
//             </Button>
//             <Button
//               type="submit"
//               disabled={loadingAdd}
//               className="h-11 w-full gap-2 rounded-lg bg-[#112D4E] px-5 font-bold text-white hover:bg-[#0B2240] disabled:opacity-60 sm:w-auto"
//             >
//               {loadingAdd ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   Menyimpan...
//                 </>
//               ) : (
//                 "Simpan"
//               )}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default TambahTrainingDialog;