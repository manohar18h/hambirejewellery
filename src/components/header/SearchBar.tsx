import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const materials = ["Gold", "Silver", "Diamond"];

const SearchBar = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) return; // ⛔ stop animation when focused

    const currentWord = materials[wordIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(currentWord.substring(0, text.length + 1));

          if (text.length + 1 === currentWord.length) {
            setTimeout(() => setIsDeleting(true), 800);
          }
        } else {
          setText(currentWord.substring(0, text.length - 1));

          if (text.length === 0) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % materials.length);
          }
        }
      },
      isDeleting ? 60 : 120,
    );

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, isFocused]);

  return (
    <div className="relative w-[360px]">
      <input
        type="text"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? "" : `Search for ${text}`}
        className="h-[38px] w-full rounded-full border border-[#C9A24D]
           px-4 pr-10 text-[13px]
           text-black placeholder:text-black
           focus:outline-none
           focus:ring-2 focus:ring-[#C9A24D]
           focus:border-[#C9A24D]"
      />

      <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
};

export default SearchBar;
