import { useState } from "react";
import axios from "axios";
import hjlogo from "../../assets/logo.png";
import goldlogo from "../../assets/goldicon.png";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { User, Heart, ShoppingBag, Menu, X } from "lucide-react";

type MetalPrices = {
  gold24Rate: number;
  gold22Rate: number;
  silver999Rate: number;
  silver995Rate: number;
};

const MainHeader = () => {
  const [showRates, setShowRates] = useState(false);
  const [rates, setRates] = useState<MetalPrices | null>(null);
const navigate = useNavigate();
  const fetchRates = async () => {
    try {
    const res = await axios.get(
  "https://api.hambirejewellery.com/api/catalog/getTodaysRates"
);
      setRates(res.data);
      setShowRates(true);
    } catch (error) {
      console.error(error);
      alert("Failed to load today's rates");
    }
  };

  return (
    <>
      <div className="-mt-[4px] flex h-[65px] items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <img src={hjlogo} className="h-[54px] w-[54px] object-contain" />
          <div className="leading-tight">
            <div className="font-bold text-[26px] leading-none tracking-wide text-[#FE7F00]">
              Hambire
            </div>
            <div className="mt-[1px] text-[11px] font-bold tracking-[4px] text-gray-500">
              Jewellery
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-[16px] text-gray-700 whitespace-nowrap">
            📞 +91 98765 43210
          </div>

          <SearchBar />

          <button
            onClick={fetchRates}
            className="flex items-center gap-1 cursor-pointer bg-[#F5C542] hover:bg-[#E6B800] text-[#2F2F2F] font-bold m-5 px-4 py-1 rounded-full text-[14px] transition"
          >
            Today&apos;s Rate
          </button>

          <button
  onClick={() => navigate("/schemes")}
  className="flex items-center gap-1 whitespace-nowrap text-[16px] hover:text-yellow-600 transition"
>
  <img
    src={goldlogo}
    alt="Gold Scheme"
    className="h-[25px] w-[25px] object-contain"
  />
  Gold Scheme
</button>
        </div>

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

      <div className="-mt-[4px] h-[0.5px] w-full bg-[#beae92]" />

    {showRates && rates && (
  <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/40 pt-10">
    <div className="relative w-[390px] rounded-[20px] bg-white px-6 py-6 text-center shadow-2xl">
      
      <button
        onClick={() => setShowRates(false)}
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#e0aa22] text-white shadow"
      >
        <X className="h-6 w-6" />
      </button>

      <img
        src={goldlogo}
        alt="Gold"
        className="mx-auto h-[55px] w-[55px] object-contain"
      />

      <h2 className="mt-3 font-serif text-[22px] font-semibold text-[#1f1f1f]">
        Today&apos;s Gold Rate
      </h2>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-[#faf7f0] px-4 py-3">
          <span className="text-[16px] font-medium text-gray-700">
            Gold 24Kt
          </span>
          <span className="text-[18px] font-bold text-black">
            ₹{rates.gold24Rate}/gm
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#faf7f0] px-4 py-3">
          <span className="text-[16px] font-medium text-gray-700">
            Gold 22Kt
          </span>
          <span className="text-[18px] font-bold text-black">
            ₹{rates.gold22Rate}/gm
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#faf7f0] px-4 py-3">
          <span className="text-[16px] font-medium text-gray-700">
            Silver 999
          </span>
          <span className="text-[18px] font-bold text-black">
            ₹{rates.silver999Rate}/gm
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#faf7f0] px-4 py-3">
          <span className="text-[16px] font-medium text-gray-700">
            Silver 995
          </span>
          <span className="text-[18px] font-bold text-black">
            ₹{rates.silver995Rate}/gm
          </span>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default MainHeader;