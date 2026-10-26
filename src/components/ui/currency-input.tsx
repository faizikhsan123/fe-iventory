import * as React from "react"

import { Input } from "@/components/ui/input"
import { formatRaw, parseCurrency, valueToRaw } from "@/lib/currency"

type CurrencyInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  /** Nilai dari form/server: angka, "10000000.00", atau kosong. */
  value: string | number | null | undefined
  /** Dipanggil dengan string angka murni ("" bila kosong, "1234.5" bila desimal). */
  onValueChange: (raw: string) => void
  /** Jumlah digit desimal yang didukung (koma id-ID). 0 = bilangan bulat. */
  decimals?: number
}

const isNumericallyEqual = (a: string, b: string) =>
  a === b || (a !== "" && b !== "" && Number(a) === Number(b))

// posisi caret di teks tampilan setelah `count` digit/koma
function caretFor(display: string, count: number) {
  if (count <= 0) return 0
  let seen = 0
  for (let i = 0; i < display.length; i++) {
    if (display[i] !== ".") seen++
    if (seen === count) return i + 1
  }
  return display.length
}

function CurrencyInput({
  value,
  onValueChange,
  decimals = 0,
  inputMode,
  onBlur,
  ref,
  ...props
}: CurrencyInputProps) {
  const innerRef = React.useRef<HTMLInputElement | null>(null)
  const caretRef = React.useRef<number | null>(null)
  const [display, setDisplay] = React.useState(() => formatRaw(valueToRaw(value, decimals)))
  const rawRef = React.useRef(valueToRaw(value, decimals))

  // sinkronkan bila nilai berubah dari luar (reset form, data server tiba)
  React.useEffect(() => {
    const incoming = valueToRaw(value, decimals)
    if (!isNumericallyEqual(incoming, rawRef.current)) {
      rawRef.current = incoming
      setDisplay(formatRaw(incoming))
    }
  }, [value, decimals])

  React.useLayoutEffect(() => {
    if (caretRef.current !== null && innerRef.current === document.activeElement) {
      innerRef.current?.setSelectionRange(caretRef.current, caretRef.current)
    }
    caretRef.current = null
  }, [display])

  const setRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node
    if (typeof ref === "function") ref(node)
    else if (ref) ref.current = node
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value
    let caret = e.target.selectionStart ?? text.length
    const inputType = (e.nativeEvent as InputEvent).inputType

    let next = parseCurrency(text, decimals)
    // Backspace/Delete tepat pada titik pemisah: teks hasil sama setelah diformat ulang,
    // jadi hapus digit di sebelahnya agar tombol tidak terasa "macet".
    if (next === rawRef.current && (inputType === "deleteContentBackward" || inputType === "deleteContentForward")) {
      const idx = inputType === "deleteContentBackward" ? caret - 1 : caret
      let target = idx
      while (target >= 0 && target < text.length && text[target] === ".") {
        target += inputType === "deleteContentBackward" ? -1 : 1
      }
      if (target >= 0 && target < text.length) {
        text = text.slice(0, target) + text.slice(target + 1)
        caret = target
        next = parseCurrency(text, decimals)
      }
    }

    const typedCount = text.slice(0, caret).replace(/[^\d,]/g, "").length
    const leadingZerosDropped = text.slice(0, caret).replace(/[^\d,]/g, "").length - formatRaw(next).replace(/\./g, "").length
    const nextDisplay = formatRaw(next)
    caretRef.current = caretFor(nextDisplay, Math.min(typedCount, typedCount - Math.max(leadingZerosDropped, 0)))

    rawRef.current = next
    setDisplay(nextDisplay)
    if (nextDisplay === display) {
      // state tidak berubah (mis. huruf ditolak): kembalikan caret manual
      const pos = caretRef.current
      caretRef.current = null
      requestAnimationFrame(() => innerRef.current?.setSelectionRange(pos, pos))
    }
    onValueChange(next)
  }

  return (
    <Input
      {...props}
      ref={setRefs}
      type="text"
      inputMode={inputMode ?? (decimals > 0 ? "decimal" : "numeric")}
      autoComplete="off"
      value={display}
      onChange={handleChange}
      onBlur={(e) => {
        // buang koma menggantung ("12," -> "12")
        if (display.endsWith(",")) {
          const trimmed = rawRef.current.replace(/\.$/, "")
          rawRef.current = trimmed
          setDisplay(formatRaw(trimmed))
        }
        onBlur?.(e)
      }}
    />
  )
}

export { CurrencyInput }
