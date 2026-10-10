import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { searchInputClass } from "@/lib/formStyles";

// Pencarian dikirim saat submit (bukan tiap ketikan), jadi tidak membanjiri API.
const SearchBar = ({
  placeholder,
  busy,
  onSearch,
}: {
  placeholder: string;
  busy?: boolean;
  onSearch: (keyword: string) => void;
}) => {
  const [keyword, setKeyword] = useState("");

  const clear = () => {
    setKeyword("");
    onSearch("");
  };

  return (
    <form
      className="flex w-full gap-2 md:max-w-lg"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(keyword.trim());
      }}
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3F72AF]" size={17} />
        <Input
          className={searchInputClass}
          placeholder={placeholder}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {keyword && (
          <button
            type="button"
            onClick={clear}
            aria-label="Hapus pencarian"
            className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#50688C] transition hover:bg-[#DBE2EF] hover:text-[#112D4E]"
          >
            <X size={15} />
          </button>
        )}
      </div>
      <Button
        className="h-11 rounded-lg bg-[#112D4E] px-5 font-semibold text-white hover:bg-[#0B2240] disabled:opacity-60"
        disabled={busy}
      >
        Cari
      </Button>
    </form>
  );
};

export default SearchBar;
