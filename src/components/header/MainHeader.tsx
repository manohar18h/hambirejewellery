import { useEffect,useState, useRef  } from "react";
import axios from "axios";
import hjlogo from "../../assets/logo.png";
import goldlogo from "../../assets/goldicon.png";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

import { User, Heart, ShoppingBag, Menu, X, Bell } from "lucide-react";
import { getSchemeCustomerProfile, getSchemeDashboard } from "../../api/schemeApi";
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
const clickable = "clickable-ui"; 
const [showNotifications, setShowNotifications] = useState(false);
const [notifications, setNotifications] = useState<any[]>([]);
const notificationRef = useRef<HTMLDivElement | null>(null);
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
  
const loadNotifications = async () => {
  const customer = JSON.parse(localStorage.getItem("schemeCustomer") || "{}");
  const loginTime = Number(localStorage.getItem("schemeLoginTime") || 0);

  if (!customer?.customerId || !loginTime) {
    localStorage.removeItem("schemeNotificationError");
    setNotifications([]);
    return;
  }

  const sixHours = 6 * 60 * 60 * 1000;

  if (Date.now() - loginTime > sixHours) {
    localStorage.removeItem("schemeNotificationError");
    setNotifications([]);
    return;
  }

  const list: any[] = [];

  try {
    const profile = await getSchemeCustomerProfile(customer.customerId);

    if (!profile?.aadhaarVerified) {
      list.push({
        id: "aadhaar-required",
        title: "Aadhaar Verification Required",
        message:
          "Please verify Aadhaar before activating Hambire Jewellery schemes.",
        buttonText: "Verify Document",
        action: () => navigate("/scheme-profile"),
      });
    } else {
      localStorage.removeItem("schemeNotificationError");
    }

    const dashboard = await getSchemeDashboard(customer.customerId);

    const dueFlexiList =
      dashboard?.flexi11Schemes?.filter(
        (item: any) => item.showPayButton === true
      ) || [];

    dueFlexiList.forEach((item: any, index: number) => {
      list.push({
        id: `flexi-due-${item.schemeId}`,
        title: "Flexi 11 Payment Due",
        message: `Your Flexi 11 month ${
          Number(item.paidMonths || 0) + 1
        } payment is ready. Amount: ₹${Number(
          item.monthlyAmount || 0
        ).toLocaleString("en-IN")}`,
        buttonText: "Open Scheme Dashboard",
        action: () => navigate("/schemes?open=activeSchemes"),
      });
    });

    setNotifications(list);
  } catch (error) {
    console.error(error);
    setNotifications([]);
  }
};

useEffect(() => {
  loadNotifications();

  const interval = setInterval(loadNotifications, 30000);

  window.addEventListener("scheme-notifications-refresh", loadNotifications);

  return () => {
    clearInterval(interval);
    window.removeEventListener(
      "scheme-notifications-refresh",
      loadNotifications
    );
  };
}, []);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target as Node)
    ) {
      setShowNotifications(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);





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
            className={`${clickable} flex items-center gap-1 cursor-pointer bg-[#F5C542] hover:bg-[#E6B800] text-[#2F2F2F] font-bold m-5 px-4 py-1 rounded-full text-[14px] transition`}
          >
            Today&apos;s Rate
          </button>

          <button
  onClick={() => navigate("/schemes")}
className={`${clickable} flex items-center gap-1 whitespace-nowrap text-[16px] m-5 px-3 py-1 rounded-full hover:text-yellow-600`}>
  <img
    src={goldlogo}
    alt="Gold Scheme"
    className="h-[25px] w-[25px] object-contain"
  />
  Gold Scheme
</button>
        </div>

        <div className="flex items-center gap-3">
          <button
  onClick={() => navigate("/scheme-profile")}
  className={clickable}
>
  <User className="h-[25px] w-[25px] hover:text-red-600 transition" />
</button>
         <button className={clickable}>
  <Heart className="h-[25px] w-[25px] hover:text-red-600 transition" />
</button>

<button className={clickable}>
  <ShoppingBag className="h-[25px] w-[25px] hover:text-red-600 transition" />
</button>

<div className="relative">
  <button
    onClick={() => {
      setShowNotifications((prev) => !prev);
      loadNotifications();
    }}
    className={clickable}
  >
    <Bell className="h-[25px] w-[25px] hover:text-red-600 transition" />
  </button>

 {notifications.length > 0 && (
  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white">
    {notifications.length}
  </span>
)}

 {showNotifications && (
  <div
    ref={notificationRef}
    className="absolute right-0 top-10 z-[9999] w-[360px] rounded-2xl bg-white p-4 shadow-2xl border"
  > <h3 className="text-[18px] font-bold text-black">Notifications</h3>

    {notifications.length === 0 ? (
  <p className="mt-4 text-sm text-gray-500">No notifications</p>
) : (
  <div className="mt-4 space-y-3">
    {notifications.map((item) => (
      <div key={item.id} className="rounded-xl bg-[#fbf7ef] p-4 shadow-sm">
        <h4 className="font-bold text-[#b98213]">{item.title}</h4>
        <p className="mt-1 text-sm text-gray-700">{item.message}</p>

        <button
          onClick={() => {
            setShowNotifications(false);
            item.action();
          }}
          className={`${clickable} mt-3 rounded-full bg-black px-4 py-2 text-sm font-bold text-white`}
        >
          {item.buttonText}
        </button>
      </div>
    ))}
  </div>
)}
        
    </div>
  )}
</div>

<button className={clickable}>
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
            ₹{(rates.gold24Rate)/10}/gm
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#faf7f0] px-4 py-3">
          <span className="text-[16px] font-medium text-gray-700">
            Gold 22Kt
          </span>
          <span className="text-[18px] font-bold text-black">
            ₹{(rates.gold22Rate)/10}/gm
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#faf7f0] px-4 py-3">
          <span className="text-[16px] font-medium text-gray-700">
            Silver 999
          </span>
          <span className="text-[18px] font-bold text-black">
            ₹{(rates.silver999Rate)/10}/gm
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#faf7f0] px-4 py-3">
          <span className="text-[16px] font-medium text-gray-700">
            Silver 995
          </span>
          <span className="text-[18px] font-bold text-black">
            ₹{(rates.silver995Rate)/10}/gm
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