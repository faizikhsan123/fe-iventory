import { isAxiosError } from "axios";

// Ambil pesan error yang ramah dari respons Laravel ({ errors: {field: [..]} } atau { message })
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.errors) return Object.values(data.errors).flat().join(", ");
    if (data?.message) return data.message as string;
  }
  return fallback;
};
