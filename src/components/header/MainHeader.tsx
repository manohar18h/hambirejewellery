import hjlogo from "../../assets/hjlogoo.png";
import goldlogo from "../../assets/goldicon.png";

import SearchBar from "./SearchBar";
import { User, Heart, ShoppingBag, Menu } from "lucide-react";

const MainHeader = () => {
  return (
    <>
      <div className="flex items-center justify-between px-8 py-3">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img src={hjlogo} className="h-10 w-10" />

          <div className="leading-tight">
            <div className="font-bold text-[20px] tracking-wide">Hambire</div>
            <div className="text-[11px] tracking-[3px] text-gray-500 uppercase">
              Jewellery
            </div>
          </div>
        </div>

        {/* CENTER SECTION */}
        <div className="flex items-center justify-center gap-8">
          <div className="text-[15px] text-gray-700">📞 +91 98765 43210</div>

          <SearchBar />

          <button className="flex items-center gap-1 text-[15px] hover:text-yellow-600 transition">
            <img
              src={goldlogo}
              alt="Gold Scheme"
              className="h-[26px] w-[26px] object-contain"
            />
            Gold Scheme
          </button>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-5">
          <button>
            <User className="w-6 h-6 hover:text-red-600 transition" />
          </button>

          <button>
            <Heart className="w-6 h-6 hover:text-red-600 transition" />
          </button>

          <button>
            <ShoppingBag className="w-6 h-6 hover:text-red-600 transition" />
          </button>

          <button>
            <Menu className="w-6 h-6 hover:text-red-600 transition" />
          </button>
        </div>
      </div>

      {/* GOLD DIVIDER LINE */}
      <div className="h-[1px] w-full bg-[#d9a441]" />
    </>
  );
};

export default MainHeader;
