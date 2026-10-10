import { useCallback, useEffect, useRef, useState } from "react";
import { isCancel } from "axios";
import { getErrorMessage } from "@/lib/errors";

type Result<T> = { key: string; data: T | null; error: string };

/**
 * Fetch data secara deklaratif:
 * - request otomatis diulang saat `deps` berubah (atau `reload()` dipanggil)
 * - request lama dibatalkan (AbortController), jadi respons basi tidak menimpa yang baru
 * - data lama tetap tampil selama request baru jalan (`isFetching`), tanpa kedip skeleton
 * - tidak ada setState sinkron di dalam effect
 */
export function useAsyncData<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[],
  { enabled = true, errorMessage = "Gagal mengambil data" }: { enabled?: boolean; errorMessage?: string } = {},
) {
  const [tick, setTick] = useState(0);
  const [result, setResult] = useState<Result<T>>({ key: "", data: null, error: "" });

  // fetcher selalu versi terbaru tanpa menjadi dependency effect
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const key = JSON.stringify([...deps, tick]);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();

    fetcherRef
      .current(controller.signal)
      .then((data) => setResult({ key, data, error: "" }))
      .catch((e) => {
        if (isCancel(e) || controller.signal.aborted) return;
        setResult({ key, data: null, error: getErrorMessage(e, errorMessage) });
      });

    return () => controller.abort();
  }, [key, enabled, errorMessage]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  // hasil milik request saat ini? (kalau bukan, request baru masih berjalan)
  const isCurrent = result.key === key;
  const error = isCurrent ? result.error : "";

  return {
    data: result.data,
    error,
    // true hanya saat belum ada data sama sekali (load pertama / setelah error)
    loading: enabled && result.data === null && !error,
    // true selama request baru berjalan; data lama masih tersedia di `data`
    isFetching: enabled && !isCurrent,
    reload,
  };
}
