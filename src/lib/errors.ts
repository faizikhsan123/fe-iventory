import { isAxiosError } from "axios";
import { translateServerMessage } from "@/lib/serverMessages";

// Ambil pesan error yang ramah dari respons Laravel ({ errors: {field: [..]} } atau { message }).
// Pesan server berbahasa Indonesia diterjemahkan lewat peta; yang tak dikenal tampil apa adanya.
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.errors)
      return (Object.values(data.errors).flat() as unknown[])
        .map((m) => translateServerMessage(String(m)))
        .join(", ");
    if (data?.message) return translateServerMessage(data.message as string);
  }
  return fallback;
};
