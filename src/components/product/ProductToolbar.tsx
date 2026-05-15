import { SlidersHorizontal, ArrowUpDown, ChevronDown } from "lucide-react";

const ProductToolbar = () => {
  return (
    <div className="flex items-center gap-4">
      <button className="flex items-center gap-2 rounded-md bg-[#d7264b] px-5 py-3 text-[15px] font-medium text-white hover:bg-[#bf1f40]">
        FILTERS
        <SlidersHorizontal className="h-5 w-5" />
      </button>

      <button className="flex min-w-[220px] items-center justify-between rounded-md border border-gray-300 bg-white px-5 py-3 text-[15px] text-[#1c1c1c] hover:border-gray-400">
        <span className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5" />
          SORT
          <span className="font-medium">Position</span>
        </span>

        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ProductToolbar;
