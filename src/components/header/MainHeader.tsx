import hjlogo from "../../assets/logo.png";
import goldlogo from "../../assets/goldicon.png";

import SearchBar from "./SearchBar";
import { User, Heart, ShoppingBag, Menu } from "lucide-react";

const MainHeader = () => {
  return (
    <>
      <div className="-mt-[4px] flex h-[65px] items-center justify-between px-8">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <img src={hjlogo} className="h-[54px] w-[54px] object-contain" />

          <div className="leading-tight">
            <div className="font-bold text-[26px] leading-none tracking-wide text-[#FE7F00]">
              Hambire
            </div>{" "}
            <div className="mt-[1px] text-[11px] font-bold tracking-[4px] text-gray-500">
              Jewellery
            </div>
          </div>
        </div>
        {/* CENTER SECTION */}
        <div className="flex items-center gap-4">
          <div className="text-[16px] text-gray-700 whitespace-nowrap">
            📞 +91 98765 43210
          </div>

          <SearchBar />
          <span
            className="
    flex items-center gap-1 cursor-pointer
    bg-[#F5C542] hover:bg-[#E6B800]
    text-[#2F2F2F]
    font-bold
    m-5
    px-4 py-1
    rounded-full
    text-[14px]
    transition
  "
          >
            Today&apos;s Rate
          </span>
          <button className="flex items-center gap-1 whitespace-nowrap text-[16px] hover:text-yellow-600 transition">
            <img
              src={goldlogo}
              alt="Gold Scheme"
              className="h-[25px] w-[25px] object-contain"
            />
            Gold Scheme
          </button>
        </div>
        {/* RIGHT ICONS */}
        <div className="flex items-center gap-3">
          <button>
            <User className="h-[25px] w-[25px] hover:text-red-600 transition" />
          </button>

          <button>
            <Heart className="h-[25px] w-[25px] hover:text-red-600 transition" />
          </button>

          <button>
            <ShoppingBag className="h-[25px] w-[25px] hover:text-red-600 transition" />
          </button>

          <button>
            <Menu className="h-[25px] w-[25px] hover:text-red-600 transition" />
          </button>
        </div>
      </div>

      {/* GOLD DIVIDER LINE */}
      <div className="-mt-[4px] h-[0.5px] w-full bg-[#beae92]" />
    </>
  );
};

export default MainHeader;
