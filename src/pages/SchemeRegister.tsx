import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import {
  Smartphone,
  Wallet,
  UserPlus,
  ArrowRight,
  Gem,
  Upload,
  Lock,
  TrendingUp,
  Coins,
  
} from "lucide-react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../api/firebase";
import {
  registerSchemeCustomer,
  loginSchemeCustomer,
  getSchemeDashboard,
  createPreBookingScheme,
  createFlexi11Scheme,
  createQuickBuyScheme,
  payFlexiMonth,
  checkSchemeMobile,
   checkForgotPasswordMobile,
  resetSchemePassword,
  verifyAadhaarOcr,
  uploadSchemeProof,
} from "../api/schemeApi";



const SchemeRegister = () => {
  const overviewRef = useRef<HTMLDivElement | null>(null);
const preBookingRef = useRef<HTMLDivElement | null>(null);
const flexi11Ref = useRef<HTMLDivElement | null>(null);
const quickBuyRef = useRef<HTMLDivElement | null>(null);
  const [params] = useSearchParams();
  const scheme = params.get("scheme") || "scheme";
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
const isOtpAllowed = isRecaptchaVerified;
const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
const [aadhaarVerified, setAadhaarVerified] = useState(false);
const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
  const [registerData, setRegisterData] = useState({
  name: "",
  village: "",
  phoneNumber: "",
  emailId: "",
  password: "",
  fullAddress: "",
  pincode: "",
  aadhaarNumber: "",
  panNumber: "",
});


const [dashboard, setDashboard] = useState<any>(null);
const [step, setStep] = useState<
  | "checking"
  | "login"
  | "otp"
  | "register"
  | "wallet"
  | "forgotMobile"
  | "forgotOtp"
  | "resetPassword"
>("checking");

  type MetalPrices = {
  gold24Rate: number;
  gold22Rate: number;
  silver999Rate: number;
  silver995Rate: number;
};

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const [dashboardTab, setDashboardTab] = useState<
    "overview" | "preBooking" | "flexi11" | "quickBuy"
  >("overview");

  const [confirmationResult, setConfirmationResult] = useState<any>(null);

const [preBookingType, setPreBookingType] = useState("Advance Gold Booking");
  const [holdMonths, setHoldMonths] = useState("5");

  const [monthlyAmount, setMonthlyAmount] = useState("5000");

const [quickMetal, setQuickMetal] = useState<
  "Gold" | "Kamal Silver" | "Swastik Silver"
>("Gold");
  const [quickAmount, setQuickAmount] = useState("1000");

  const [rates, setRates] = useState<MetalPrices | null>(null);

const [metalWeight, setMetalWeight] = useState("");
const [metalAmount, setMetalAmount] = useState("");

const [oldGrossWeight, setOldGrossWeight] = useState("");
const [oldPurity, setOldPurity] = useState("");
const [oldExchangeAmount, setOldExchangeAmount] = useState("");

  const goldRate = rates?.gold24Rate || 10000;

const [showActiveSchemes, setShowActiveSchemes] = useState(false);
const [selectedScheme, setSelectedScheme] = useState<any>(null);
const [selectedSchemeType, setSelectedSchemeType] = useState<
  "PRE_BOOKING" | "FLEXI_11" | "QUICK_BUY" | null
>(null);

const preBookingCards = dashboard?.preBookingSchemes || [];
const flexi11Cards = dashboard?.flexi11Schemes || [];
const quickBuyCards = dashboard?.quickBuySummaries || [];
const [itemName, setItemName] = useState("");

const formatMoney = (value: any) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatWeight = (value: any) =>
  `${Number(value || 0).toFixed(3)} gm`;

const formatDate = (value: any) =>
  value ? new Date(value).toLocaleDateString("en-IN") : "-";

const openSchemeDetails = (
  type: "PRE_BOOKING" | "FLEXI_11" | "QUICK_BUY",
  data: any
) => {
  setSelectedSchemeType(type);
  setSelectedScheme(data);
};

const closeSchemeDetails = () => {
  setSelectedScheme(null);
  setSelectedSchemeType(null);
};

const totalDashboardCards =
  preBookingCards.length + flexi11Cards.length + quickBuyCards.length;

  const [sendingOtp, setSendingOtp] = useState(false);
  const [sendingForgotOtp, setSendingForgotOtp] = useState(false);
  const clickable = "clickable-ui";

useEffect(() => {
  fetchRates();
}, []);

useEffect(() => {
  setIsRecaptchaVerified(false);
}, [step]);

useEffect(() => {
  if (step !== "register" && step !== "forgotMobile") return;

  const timer = setTimeout(() => {
    const container = document.getElementById("recaptcha-container");

    if (!container || recaptchaRef.current) return;

  recaptchaRef.current = new RecaptchaVerifier(
  auth,
  "recaptcha-container",
  {
    size: "normal",
    callback: () => {
      setIsRecaptchaVerified(true);
    },
    "expired-callback": () => {
      setIsRecaptchaVerified(false);
    },
  }
);

    recaptchaRef.current.render();
  }, 500);

  return () => clearTimeout(timer);
}, [step]);

const fetchRates = async () => {
  try {
    const res = await axios.get(
      "https://api.hambirejewellery.com/api/catalog/getTodaysRates"
    );
    setRates(res.data);
  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  const customer = JSON.parse(localStorage.getItem("schemeCustomer") || "{}");
  const loginTime = Number(localStorage.getItem("schemeLoginTime") || 0);

  if (!customer?.customerId || !loginTime) {
    setStep("login");
    return;
  }

  const sixHours = 6 * 60 * 60 * 1000;

  if (Date.now() - loginTime > sixHours) {
    logoutSchemeCustomer();
    return;
  }

  getSchemeDashboard(customer.customerId)
    .then((dash) => {
      setDashboard(dash);
      setStep("wallet");
    })
    .catch(() => logoutSchemeCustomer());
}, []);

const isAdvanceBooking =
  preBookingType === "Advance Gold Booking" ||
  preBookingType === "Advance kamal Silver Booking" ||
  preBookingType === "Advance Swastik Silver Booking";

const isOldExchange =
  preBookingType === "Old Gold Exchange" ||
  preBookingType === "Old Silver Exchange";

const selectedRate =
  preBookingType === "Advance Gold Booking"
    ? rates?.gold24Rate
    : preBookingType === "Advance kamal Silver Booking"
    ? rates?.silver999Rate
    : preBookingType === "Advance Swastik Silver Booking"
    ? rates?.silver995Rate
    : null;

const selectedRateTitle =
  preBookingType === "Advance Gold Booking"
    ? "24K Gold Rate"
    : preBookingType === "Advance kamal Silver Booking"
    ? "Kamal Silver Rate"
    : preBookingType === "Advance Swastik Silver Booking"
    ? "Swastik Silver Rate"
    : "";

const quickRate =
  quickMetal === "Gold"
    ? rates?.gold24Rate
    : quickMetal === "Kamal Silver"
    ? rates?.silver999Rate
    : rates?.silver995Rate;

const perGramRate = (quickRate || 0) / 10;

const quickWeight =
  perGramRate > 0
    ? Number(quickAmount || 0) / perGramRate
    : 0;

  const schemeTitle = scheme
    .replace("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
    const pageTitle =
  scheme === "dashboard" ? "Scheme Dashboard" : `Join ${schemeTitle}`;

const handleLogin = async () => {
  if (mobile.length !== 10) {
    return alert("Enter valid 10 digit mobile number");
  }

  if (!password) {
    return alert("Enter password");
  }

  try {
    const customer = await loginSchemeCustomer(mobile, password);

localStorage.setItem("schemeCustomer", JSON.stringify(customer));
localStorage.setItem("schemeLoginTime", Date.now().toString());
    const dash = await getSchemeDashboard(customer.customerId);
    setDashboard(dash);

    setStep("wallet");
  } catch (error) {
    console.error(error);
    alert("Invalid mobile number or password");
  }
};
const handleRegisterSubmit = async () => {
  if (sendingOtp) return;

  if (!registerData.name.trim()) {
  return alert("Full Name is required");
}

  if (registerData.phoneNumber.length !== 10) {
    return alert("Enter valid 10 digit mobile number");
  }

    if (!registerData.village.trim()) {
  return alert("Village / City is required");
}

if (!registerData.fullAddress.trim()) {
  return alert("Full Address is required");
}

  if (!registerData.pincode.trim()) {
  return alert("Pincode is required");
}

if (!registerData.aadhaarNumber.trim()) {
  return alert("Aadhaar Number is required");
}
if (registerData.pincode.length !== 6) {
  return alert("Enter valid 6 digit pincode");
}

if (!aadhaarFile) {
  return alert("Please upload Aadhaar document");
}
if (!registerData.password.trim()) {
  return alert("Password is required");
}

  if (registerData.password.length < 6) {
    return alert("Password must be at least 6 characters");
  }
  if (!confirmPassword.trim()) {
  return alert("Confirm Password is required");
}

  if (registerData.password !== confirmPassword) {
    return alert("Password and confirm password not matching");
  }



  try {

    if (registerData.aadhaarNumber.length !== 12) {
  return alert("Enter valid 12 digit Aadhaar number");
}

if (!registerData.name || !registerData.fullAddress || !registerData.pincode) {
  return alert("Name, address and pincode are required for Aadhaar verification");
}


    if (!aadhaarFile) {
  return alert("Please upload Aadhaar document");
}

if (!aadhaarVerified) {
  try {
    setVerifyingAadhaar(true);

    const verify = await verifyAadhaarOcr({
      file: aadhaarFile,
      name: registerData.name,
      aadhaarNumber: registerData.aadhaarNumber,
    });

    if (!verify.matched) {
      alert(verify.message);
      return;
    }

    setAadhaarVerified(true);
  } catch (error) {
    console.error(error);
    alert("Aadhaar verification failed. Please upload clear Aadhaar image.");
    return;
  } finally {
    setVerifyingAadhaar(false);
  }
}

    setSendingOtp(true);

    const check = await checkSchemeMobile(registerData.phoneNumber);

    if (!check.allowOtp) {
      alert(check.message);
      return;
    }

    if (!recaptchaRef.current) {
      alert("reCAPTCHA not ready. Please refresh and try again.");
      return;
    }

    const result = await signInWithPhoneNumber(
      auth,
      `+91${registerData.phoneNumber}`,
      recaptchaRef.current
    );

    setConfirmationResult(result);
    setStep("otp");
  } catch (error: any) {
    console.error(error);

    alert(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to send OTP"
    );
  } finally {
    setSendingOtp(false);
  }
};

const logoutSchemeCustomer = () => {
  localStorage.removeItem("schemeCustomer");
  localStorage.removeItem("schemeLoginTime");
   localStorage.removeItem("schemeNotificationError");

   window.location.href = "/";

  window.dispatchEvent(new Event("scheme-notifications-refresh"));

  setDashboard(null);
  setStep("login");
};

const handleOtpVerify = async () => {
  if (otp.length !== 6) {
    return alert("Enter valid 6 digit OTP");
  }

  if (!confirmationResult) {
    return alert("Please send OTP first");
  }

  try {
    await confirmationResult.confirm(otp);

const customer = await registerSchemeCustomer({
  ...registerData,
  panNumber: "",
});

if (aadhaarFile) {
  await uploadSchemeProof(customer.customerId, "ADDRESS", aadhaarFile);
}
    alert("Registration successful. Please login.");

    setOtp("");
    setConfirmationResult(null);
    setStep("login");
  } catch (error: any) {
  console.error("OTP/Register error full:", error);
  console.error("Backend response:", error.response?.data);

  if (error.code?.startsWith("auth/")) {
    alert(error.message || "Invalid or expired OTP");
    return;
  }

  alert(
    error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data ||
      error.message ||
      "OTP verified, but customer registration failed."
  );
}
};
const handleRegisterChange = (
  field: keyof typeof registerData,
  value: string
) => {
  setRegisterData((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const handleForgotMobile = async () => {
  if (sendingForgotOtp) return;

  if (mobile.length !== 10) {
    return alert("Enter valid 10 digit mobile number");
  }

  try {
    setSendingForgotOtp(true);

    const check = await checkForgotPasswordMobile(mobile);

    if (!check.allowOtp) {
      alert(check.message);
      return;
    }

    if (!recaptchaRef.current) {
      alert("reCAPTCHA not ready");
      return;
    }

    const result = await signInWithPhoneNumber(
      auth,
      `+91${mobile}`,
      recaptchaRef.current
    );

    setConfirmationResult(result);
    setStep("forgotOtp");

    alert("OTP sent successfully");
  } catch (error: any) {
    console.error(error);
    alert(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to send OTP"
    );
  } finally {
    setSendingForgotOtp(false);
  }
};


 const handleForgotOtp = async () => {
  try {
    await confirmationResult.confirm(otp);

    setStep("resetPassword");
  } catch (error) {
    console.error(error);
    alert("Invalid OTP");
  }
};

  const handleResetPassword = async () => {
  if (newPassword.length < 6) {
    return alert("Password must be at least 6 characters");
  }

  if (newPassword !== confirmPassword) {
    return alert("Password and confirm password not matching");
  }

  try {
    await resetSchemePassword(mobile, newPassword);

    alert("Password reset successful. Please login.");

    setPassword("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setConfirmationResult(null);
    setStep("login");
  } catch (error: any) {
    console.error(error);
    alert(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Password reset failed"
    );
  }
};

  const refreshDashboard = async () => {
  const customer = JSON.parse(localStorage.getItem("schemeCustomer") || "{}");
  if (!customer.customerId) return;

  const dash = await getSchemeDashboard(customer.customerId);
  setDashboard(dash);
};

const getCustomerId = () => {
  const customer = JSON.parse(localStorage.getItem("schemeCustomer") || "{}");
  return customer.customerId;
};

const getPreBookingSubType = () => {
  switch (preBookingType) {
    case "Advance Gold Booking":
      return "ADVANCE_GOLD_BOOKING";
    case "Advance kamal Silver Booking":
      return "ADVANCE_KAMAL_SILVER_BOOKING";
    case "Advance Swastik Silver Booking":
      return "ADVANCE_SWASTIK_SILVER_BOOKING";
    case "Old Gold Exchange":
      return "OLD_GOLD_EXCHANGE";
    case "Old Silver Exchange":
      return "OLD_SILVER_EXCHANGE";
    default:
      return "ADVANCE_GOLD_BOOKING";
  }
};

const handleCreatePreBooking = async () => {
  const customerId = getCustomerId();
  if (!customerId) return alert("Please login again");

  try {
    const payload = {
      customerId,
      schemeSubType: getPreBookingSubType(),
      metalName: preBookingType.includes("Silver") ? "Silver" : "Gold",
        itemName: isOldExchange ? itemName : null,
      ratePerGram: selectedRate ? selectedRate / 10 : null,
      metalWeight: isAdvanceBooking ? Number(metalWeight || 0) : Number(oldPurity || 0),
      amount: isAdvanceBooking ? Number(metalAmount || 0) : Number(oldExchangeAmount || 0),
      holdMonths: Number(holdMonths),
      oldGrossWeight: isOldExchange ? Number(oldGrossWeight || 0) : null,
      oldPurityWeight: isOldExchange ? Number(oldPurity || 0) : null,
      oldExchangeAmount: isOldExchange ? Number(oldExchangeAmount || 0) : null,
    };

    await createPreBookingScheme(payload);
    await refreshDashboard();

    alert("Pre-booking activated successfully");
    setDashboardTab("overview");
  } catch (error: any) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Please verify Aadhaar before activating scheme.";

  localStorage.setItem("schemeNotificationError", message);

  window.dispatchEvent(
    new CustomEvent("scheme-notifications-refresh", {
      detail: { type: "AADHAAR_REQUIRED", message },
    })
  );

  alert(message);
}
};





const handleCreateFlexi11 = async () => {
  const customerId = getCustomerId();
  if (!customerId) return alert("Please login again");

  try {
    await createFlexi11Scheme({
      customerId,
      monthlyAmount: Number(monthlyAmount),
      durationMonths: 11,
      firstMonthRatePerGram: goldRate / 10,
      firstMonthGoldWeight: Number(monthlyAmount) / (goldRate / 10),
      paymentMethod: "ONLINE",
    });

    await refreshDashboard();
    alert("Flexi 11 activated successfully");
    setDashboardTab("overview");
  }catch (error: any) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Please verify Aadhaar before activating scheme.";

  localStorage.setItem("schemeNotificationError", message);

  window.dispatchEvent(
    new CustomEvent("scheme-notifications-refresh", {
      detail: { type: "AADHAAR_REQUIRED", message },
    })
  );

  alert(message);
}
};

const handleCreateQuickBuy = async () => {
  const customerId = getCustomerId();
  if (!customerId) return alert("Please login again");

  try {
    await createQuickBuyScheme({
      customerId,
      schemeSubType:
        quickMetal === "Gold"
          ? "QUICK_GOLD_BUY"
          : quickMetal === "Kamal Silver"
          ? "QUICK_KAMAL_SILVER_BUY"
          : "QUICK_SWASTIK_SILVER_BUY",
      metalName: quickMetal,
      ratePerGram: quickRate ? quickRate / 10 : 0,
      metalWeight: quickWeight,
      amount: Number(quickAmount),
      paymentMethod: "ONLINE",
    });

    await refreshDashboard();
    alert("Quick buy saved successfully");
    setDashboardTab("overview");
  }  catch (error: any) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    "Please verify Aadhaar before activating scheme.";

  localStorage.setItem("schemeNotificationError", message);

  window.dispatchEvent(
    new CustomEvent("scheme-notifications-refresh", {
      detail: { type: "AADHAAR_REQUIRED", message },
    })
  );

  alert(message);
}
};

  const renderLeftCard = () => (
    <div className="rounded-[34px] bg-gradient-to-br from-[#120902] via-[#251505] to-black p-8 text-white shadow-2xl">
      <p className="text-[13px] font-bold uppercase tracking-[4px] text-[#f5c542]">
        Hambire Jewellery
      </p>

      <h1 className="mt-4 font-serif text-[42px] leading-tight">
        {pageTitle}
      </h1>

      <p className="mt-5 text-[17px] leading-8 text-white/70">
        Login with mobile number and password. New customers can create a secure
        profile with OTP verification.
      </p>

      <div className="mt-10 space-y-5">
        {[
          ["Mobile Verification", <Smartphone />],
          ["Password Protected Login", <Lock />],
          ["Gold & Silver Wallet", <Wallet />],
          ["Jewellery Purchase Benefits", <Gem />],
           ["Save More", <Coins />],
            ["Live Rate", <TrendingUp />],
        ].map(([title, icon]) => (
          <div
            key={String(title)}
            className="flex items-center gap-4 rounded-2xl bg-white/10 p-4"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5c542] text-black">
              {icon}
            </div>
            <p className="font-semibold">{title}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const handleDashboardTabClick = (
  tab: "overview" | "preBooking" | "flexi11" | "quickBuy"
) => {
  setDashboardTab(tab);
  setShowActiveSchemes(false);

  setTimeout(() => {
    const target =
      tab === "overview"
        ? overviewRef.current
        : tab === "preBooking"
        ? preBookingRef.current
        : tab === "flexi11"
        ? flexi11Ref.current
        : quickBuyRef.current;

    target?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 150);
};

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);

  if (element) {
    const y =
      element.getBoundingClientRect().top +
      window.pageYOffset -
      40;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  }
};

const handlePayFlexiMonth = async (scheme: any) => {
  const ratePerGram = goldRate / 10;
  const paidAmount = Number(scheme.monthlyAmount || 0);

  if (!paidAmount || !ratePerGram) {
    return alert("Invalid amount or gold rate");
  }

  try {
    await payFlexiMonth({
      schemeId: scheme.schemeId,
      paidAmount,
      ratePerGram,
      paymentMethod: "DIRECT_TEST",
    });

    await refreshDashboard();
    alert("Payment saved successfully");
  } catch (error: any) {
    console.error(error);
    alert(error.response?.data?.message || "Payment failed");
  }
};

const handleSchemeTabClick = (
  tab: "overview" | "preBooking" | "flexi11" | "quickBuy",
  sectionId: string
) => {
  setDashboardTab(tab);

  if (showActiveSchemes) {
    setShowActiveSchemes(false);

    setTimeout(() => {
      scrollToSection(sectionId);
    }, 3000);
  } else {
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 100);
  }
};

const calculatePreBookingAmount = (weight: string) => {
  const perGram = selectedRate ? selectedRate / 10 : 0;
  return Number(weight || 0) * perGram;
};

useEffect(() => {
  if (!isAdvanceBooking || !metalWeight) return;

  const perGram = selectedRate ? selectedRate / 10 : 0;
  const amount = Number(metalWeight || 0) * perGram;

  setMetalAmount(amount ? amount.toFixed(0) : "");
}, [preBookingType, selectedRate]);


if (step === "checking") {
  return (
    <div className="min-h-screen bg-[#fbf7ef] p-10 text-center text-[24px] font-bold">
      Loading dashboard...
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#fbf7ef] px-8 py-14">
      {step !== "wallet" ? (
        <div className="mx-auto grid max-w-[1450px] grid-cols-[420px_1fr] gap-10">
          {renderLeftCard()}

          <div className="rounded-[34px] bg-white p-10 shadow-2xl">
            {step === "login" && (
              <>
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                  Customer Login
                </p>

                <h2 className="mt-3 font-serif text-[44px]">
                  Login to Scheme Wallet
                </h2>

                <div className="mt-10 grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block font-semibold text-gray-700">
                      Mobile Number
                    </label>
                    <input
                      value={mobile}
                      maxLength={10}
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Enter 10 digit mobile"
                      className="w-full rounded-xl border border-gray-300 px-4 py-4 outline-none focus:border-[#b98213]"
                    />
                  </div>


                  <div>
                    <label className="mb-2 block font-semibold text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full rounded-xl border border-gray-300 px-4 py-4 outline-none focus:border-[#b98213]"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setStep("forgotMobile")}
  className="cursor-pointer text-[15px] font-bold text-[#b98213] transition-all duration-200 hover:scale-105 hover:underline active:scale-95"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  onClick={handleLogin}
className={`${clickable} mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white`}                >
                  Login & Open Wallet <ArrowRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setStep("register")}
className={`${clickable} mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-[#b98213] px-8 py-4 text-[17px] font-bold text-[#b98213]`}                >
                  New Customer Registration <UserPlus className="h-5 w-5" />
                </button>
              </>
            )}

            {step === "register" && (
              <>
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                  New Customer Registration
                </p>

                <h2 className="mt-3 font-serif text-[44px]">
                  Create Customer Profile
                </h2>

                <div className="mt-10 grid grid-cols-2 gap-6">
                 {[
  ["Full Name", "name"],
  ["Mobile Number", "phoneNumber"],
  ["Email", "emailId"],
  ["Village / City", "village"],
  ["Full Address", "fullAddress"],
  ["Pincode", "pincode"],
  ["Aadhaar Number", "aadhaarNumber"],
].map(([label, field]) => (
  <div key={field}>
   <label className="mb-2 block font-semibold text-gray-700">
  {label}
  {field !== "emailId" && <span className="text-red-600"> *</span>}
</label>

    <input
      value={registerData[field as keyof typeof registerData]}
      maxLength={
        field === "phoneNumber"
          ? 10
          : field === "pincode"
          ? 6
          : field === "aadhaarNumber"
          ? 12
          : undefined
      }
      onChange={(e) => {
        const value =
          field === "phoneNumber" ||
          field === "pincode" ||
          field === "aadhaarNumber"
            ? e.target.value.replace(/\D/g, "")
            : e.target.value;

        handleRegisterChange(field as keyof typeof registerData, value);
      }}
      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b98213]"
    />
  </div>
))}
<div>
 <label className="mb-2 block font-semibold text-gray-700">
  Password <span className="text-red-600">*</span>
</label>
  <input
    type="password"
    value={registerData.password}
    onChange={(e) =>
      handleRegisterChange("password", e.target.value)
    }
    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b98213]"
  />
</div>

                  <div>
                    <label className="mb-2 block font-semibold text-gray-700">
  Confirm Password <span className="text-red-600">*</span>
</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b98213]"
                    />
                  </div>
                </div>

                <div className="mt-8">
<label className="mb-2 block font-semibold text-gray-700">
  Aadhaar Document <span className="text-red-600">*</span>
</label>
  <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 px-4 py-4">
    <Upload className="h-5 w-5 text-[#b98213]" />

    <input
      type="file"
      accept="image/*"
      className="w-full text-sm"
      onChange={(e) => {
        setAadhaarFile(e.target.files?.[0] || null);
        setAadhaarVerified(false);
      }}
    />
  </div>

  <p className="mt-2 text-sm text-gray-500">
    Upload Aadhaar image from gallery or take photo using camera.
  </p>

  {aadhaarVerified && (
    <p className="mt-2 font-bold text-green-600">
      Aadhaar verified successfully
    </p>
  )}
</div>

               

<div id="recaptcha-container" className="mt-6 flex justify-center"></div>
            <button
   disabled={sendingOtp || verifyingAadhaar || !isRecaptchaVerified}
  onClick={handleRegisterSubmit}
  className={`
    mt-10 w-full rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white
    ${isOtpAllowed ? clickable : "cursor-not-allowed opacity-60"}
  `}>
      {verifyingAadhaar
  ? "Verifying Aadhaar..."
  : sendingOtp
  ? "Sending OTP..."
  : "Submit & Send OTP"}
</button>

                <button
                  onClick={() => setStep("login")}
className={`${clickable} mt-4 w-full rounded-full border border-gray-300 px-8 py-4 text-[16px] font-bold text-gray-700`}                >
                  Already Registered? Login
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                  OTP Verification
                </p>

                <h2 className="mt-3 font-serif text-[44px]">
                  Verify Mobile Number
                </h2>

                <input
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6 digit OTP"
                  className="mt-10 w-full rounded-xl border border-gray-300 px-4 py-4 text-[24px] tracking-[8px] outline-none focus:border-[#b98213]"
                />

                <button
                  onClick={handleOtpVerify}
className={`${clickable} mt-10 w-full rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white`}                >
                  Verify & Open Wallet
                </button>
              </>
            )}

            {step === "forgotMobile" && (
              <>
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                  Forgot Password
                </p>

                <h2 className="mt-3 font-serif text-[44px]">
                  Recover Your Password
                </h2>

                <input
                  value={mobile}
                  maxLength={10}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter registered mobile number"
                  className="mt-10 w-full rounded-xl border border-gray-300 px-4 py-4 outline-none focus:border-[#b98213]"
                />
                <div id="recaptcha-container" className="mt-6 flex justify-center"></div>

               <button
  disabled={sendingForgotOtp || !isRecaptchaVerified}
  onClick={handleForgotMobile}
 className={`
    mt-10 w-full rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white
    ${isOtpAllowed ? clickable : "cursor-not-allowed opacity-60"}
  `}>
  {sendingForgotOtp ? "Sending OTP..." : "Send OTP"}
</button>

                <button
                  onClick={() => setStep("login")}
className={`${clickable} mt-4 w-full rounded-full border border-gray-300 px-8 py-4 text-[16px] font-bold text-gray-700`}
               >
                    Back to Login
                </button>
              </>
            )}

            {step === "forgotOtp" && (
              <>
<p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
  Verify OTP
</p>                 

                <h2 className="mt-3 font-serif text-[44px]">
                  Enter OTP Sent to Mobile
                </h2>

                <input
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6 digit OTP"
                  className="mt-10 w-full rounded-xl border border-gray-300 px-4 py-4 text-[24px] tracking-[8px] outline-none focus:border-[#b98213]"
                />

                <button
                  onClick={handleForgotOtp}
className={`${clickable} mt-10 w-full rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white`}                >
                  Verify OTP
                </button>
              </>
            )}

            {step === "resetPassword" && (
              <>
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                  Reset Password
                </p>

                <h2 className="mt-3 font-serif text-[44px]">
                  Create New Password
                </h2>

                <div className="mt-10 grid grid-cols-2 gap-6">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full rounded-xl border border-gray-300 px-4 py-4 outline-none focus:border-[#b98213]"
                  />

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full rounded-xl border border-gray-300 px-4 py-4 outline-none focus:border-[#b98213]"
                  />
                </div>

                <button
                  onClick={handleResetPassword}
className={`${clickable} mt-10 w-full rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white`}                >
                  Reset Password
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-[1550px]">
          <div className="rounded-[34px] bg-white p-10 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                  Hambire Scheme Dashboard
                </p>

                <h2 className="mt-3 font-serif text-[46px]">
                  Welcome to Your Scheme Wallet
                </h2>
              </div>

              <button
                onClick={logoutSchemeCustomer}
className={`${clickable} rounded-full border border-gray-300 px-7 py-3 font-bold text-gray-700`}              >
                Logout
              </button>
            </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-6">
  {[
    {
      title: "Active Schemes",
      value: dashboard?.activeSchemes || 0,
      used: null,
    },
    {
      title: "Gold Wallet",
      value: formatWeight(dashboard?.goldWallet),
      used: `Used: ${formatWeight(dashboard?.goldUsedWeight)}`,
    },
    {
      title: "Old Exchange Gold",
      value: formatWeight(dashboard?.oldExchangeGoldPurityWeight),
      used: "Purity weight",
    },
    {
      title: "Kamal Silver",
      value: formatWeight(dashboard?.kamalSilverWallet),
      used: `Used: ${formatWeight(dashboard?.kamalSilverUsedWeight)}`,
    },
    {
      title: "Swastik Silver",
      value: formatWeight(dashboard?.swastikSilverWallet),
      used: `Used: ${formatWeight(dashboard?.swastikSilverUsedWeight)}`,
    },
    {
  title: "Total Amount",
  value: formatMoney(dashboard?.totalSavings),
  used: "Scheme value",
},
  ].map((item) => (
    <div
      key={item.title}
    className={`rounded-[24px] p-6 text-center shadow ${
  item.title === "Active Schemes"
    ? "bg-[#111] text-white"
    : "bg-[#fbf7ef]"
}`}
    >
      <p className={item.title === "Active Schemes" ? "text-white/60" : "text-gray-600"}>
        {item.title}
      </p>

      <h3 className={`mt-3 text-[26px] font-bold ${
        item.title === "Active Schemes" ? "text-[#f5c542]" : "text-[#b98213]"
      }`}>
        {item.value}
      </h3>

      {item.used && (
        <p className={item.title === "Total Savings" ? "mt-2 text-[14px] text-white/50" : "mt-2 text-[14px] font-semibold text-gray-500"}>
          {item.used}
        </p>
      )}
    </div>
  ))}
</div>

            <div className="mt-10 grid grid-cols-4 gap-4">
              {[
                ["overview", "Overview"],
                ["preBooking", "Pre-Booking"],
                ["flexi11", "Flexi 11"],
                ["quickBuy", "Quick Buy"],
              ].map(([key, label]) => (
                <button
                  key={key}
onClick={() => handleDashboardTabClick(key as any)}  className={`${clickable} rounded-full px-6 py-3 font-bold ${    
                    dashboardTab === key
                      ? "bg-[#f5c542] text-black"
                      : "bg-[#fbf7ef] text-black"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-8 overflow-hidden rounded-[30px] border border-[#f5c542]/40 bg-[#111] shadow-2xl">
  <button
    onClick={() => setShowActiveSchemes((prev) => !prev)}
className={`${clickable} flex w-full items-center justify-between px-8 py-6 text-left`}  >
    <div>
      <p className="text-[13px] font-bold uppercase tracking-[4px] text-[#f5c542]">
View All Schemes & Transactions
      </p>
      <h3 className="mt-2 font-serif text-[32px] text-white">
        Your Running Gold & Silver Benefits
      </h3>
      <p className="mt-2 text-white/60">
Check Pre-Booking, Flexi 11 and Quick Buy transactions in one place.      </p>
    </div>

    <div
      className={`flex h-14 w-14 items-center justify-center rounded-full bg-[#f5c542] text-[28px] font-bold text-black transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        showActiveSchemes ? "rotate-180" : ""
      }`}
    >
      ↓
    </div>
  </button>

  <div
  className={`grid transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
    showActiveSchemes
      ? "grid-rows-[1fr] opacity-100"
      : "grid-rows-[0fr] opacity-0"
  }`}
>
    <div className="overflow-hidden">
      <div className="border-t border-white/10 px-8 py-8">
        {totalDashboardCards === 0 ? (
          <div className="rounded-[24px] bg-white/10 p-8 text-center text-white">
            No active schemes found.
          </div>
        ) : (
          <div
  className={`grid grid-cols-3 gap-6 transition-all duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
    showActiveSchemes
      ? "translate-y-0 scale-100 opacity-100"
      : "translate-y-8 scale-[0.98] opacity-0"
  }`}
>
  {preBookingCards.map((item: any, index: number) => {
    const isOldExchange =
      item.schemeSubType === "OLD_GOLD_EXCHANGE" ||
      item.schemeSubType === "OLD_SILVER_EXCHANGE";

    return (
      <div
        key={`pre-${item.schemeId}`}
  className="
    cursor-pointer
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-2xl
    active:scale-[0.98]
    rounded-[26px]
    bg-white/[0.07]
    p-6
    text-white
    shadow-xl
  "      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-[#f5c542]">
              Pre-Booking #{index + 1}
            </p>
            <h4 className="mt-2 text-[22px] font-bold">
              {item.schemeSubType?.replaceAll("_", " ")}
            </h4>
          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
            {item.status}
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-white/50">Metal</span>
            <b>{item.metalName || "-"}</b>
          </div>

          {isOldExchange ? (
            <>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50">Item Name</span>
                <b>{item.itemName || "Old Jewellery"}</b>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50">Exchange Amount</span>
                <b>{formatMoney(item.oldExchangeAmount)}</b>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50">Purity Weight</span>
                <b>{item.oldPurityWeight || 0} gm</b>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50">Amount</span>
                <b>{formatMoney(item.amount)}</b>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50">Weight</span>
                <b>{item.metalWeight || 0} gm</b>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50">Booked Rate</span>
                <b>₹{item.ratePerGram || 0}/gm</b>
              </div>
            </>
          )}

          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-white/50">Hold Months</span>
            <b>{item.holdMonths || 0} Months</b>
          </div>

          <div className="flex justify-between">
            <span className="text-white/50">Maturity</span>
            <b>{formatDate(item.maturityDate)}</b>
          </div>
        </div>

        <button
          onClick={() => openSchemeDetails("PRE_BOOKING", item)}
className={`${clickable} mt-5 w-full rounded-full bg-[#f5c542] px-5 py-3 font-bold text-black`}        >
          View Scheme Details
        </button>
      </div>
    );
  })}

  {flexi11Cards.map((item: any, index: number) => (
    <div
      key={`flexi-${item.schemeId}`}
  className="
    cursor-pointer
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-2xl
    active:scale-[0.98]
    rounded-[26px]
    bg-white/[0.07]
    p-6
    text-white
    shadow-xl
  "    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-[#f5c542]">
            Flexi 11 #{index + 1}
          </p>
          <h4 className="mt-2 text-[22px] font-bold">
            Monthly Gold Savings
          </h4>
        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
          {item.status}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-white/50">Metal</span>
          <b>{item.metalName || "Gold"}</b>
        </div>

        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-white/50">Monthly Amount</span>
          <b>{formatMoney(item.monthlyAmount)}</b>
        </div>

        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-white/50">Total Paid</span>
          <b>{formatMoney(item.totalPaidAmount)}</b>
        </div>

        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-white/50">Gold Collected</span>
          <b>{Number(item.totalGoldWeight || 0).toFixed(4)} gm</b>
        </div>

        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-white/50">Next Due Date</span>
          <b>{formatDate(item.nextDueDate)}</b>
        </div>

        <div className="flex justify-between">
          <span className="text-white/50">Paid Months</span>
          <b>
            {item.paidMonths || 0}/{item.durationMonths || 11}
          </b>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
    {item.showPayButton === true && (
 <button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    handlePayFlexiMonth(item);
  }}
className={`${clickable} mt-5 w-full rounded-full bg-[#f5c542] px-5 py-3 font-bold text-black`}>
  Pay Now
</button>
)}

        <button
          onClick={() => openSchemeDetails("FLEXI_11", item)}
          className={`${clickable} rounded-full bg-[#f5c542] px-5 py-3 font-bold text-black ${
            item.showPayButton ? "" : "col-span-2"
          }`}
        >
          View Scheme Details
        </button>
      </div>
    </div>
  ))}

  {quickBuyCards.map((item: any) => (
    <div
      key={`quick-${item.metalName}`}
  className="
    cursor-pointer
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-2xl
    active:scale-[0.98]
    rounded-[26px]
    bg-white/[0.07]
    p-6
    text-white
    shadow-xl
  "    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-[#f5c542]">
            Quick Buy {item.metalName}
          </p>
          <h4 className="mt-2 text-[22px] font-bold">
            {item.transactionCount} Transactions
          </h4>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          COMPLETED
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-white/50">Metal</span>
          <b>{item.metalName}</b>
        </div>

        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-white/50">Total Amount</span>
          <b>{formatMoney(item.totalAmount)}</b>
        </div>

        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-white/50">Total Weight</span>
          <b>{Number(item.totalWeight || 0).toFixed(4)} gm</b>
        </div>

        <div className="flex justify-between">
          <span className="text-white/50">Transactions</span>
          <b>{item.transactionCount}</b>
        </div>
      </div>

      <button
        onClick={() => openSchemeDetails("QUICK_BUY", item)}
className={`${clickable} mt-5 w-full rounded-full bg-[#f5c542] px-5 py-3 font-bold text-black`}      >
        View All Transactions
      </button>
    </div>
  ))}
  
</div>        )}
      </div>
    </div>
  </div>
</div>



            {dashboardTab === "overview" && (
              <div  id="overview-section" className="mt-10 grid grid-cols-3 gap-6">
                {[
                  {
                    title: "Pre-Booking & Exchange",
                    desc: "Hold advance amount or old jewellery and buy later with VA benefits.",
                    action: "Start Pre-Booking",
                    tab: "preBooking",
                  },
                  {
                    title: "Flexi 11 Month Plan",
                    desc: "Pay monthly amount for 11 months and track amount + gold grams.",
                    action: "Start Flexi Plan",
                    tab: "flexi11",
                  },
                  {
                    title: "Quick Buy Gold/Silver",
                    desc: "Enter amount, calculate metal weight and save it in wallet instantly.",
                    action: "Buy Metal",
                    tab: "quickBuy",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[30px] bg-[#111] p-7 text-white shadow-xl"
                  >
                    <h3 className="font-serif text-[28px] text-[#f5c542]">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-[16px] leading-7 text-white/70">
                      {item.desc}
                    </p>
                   <button
  onClick={() =>
    handleSchemeTabClick(
      item.tab as "overview" | "preBooking" | "flexi11" | "quickBuy",
      item.tab === "overview"
        ? "overview-section"
        : item.tab === "preBooking"
        ? "pre-booking-section"
        : item.tab === "flexi11"
        ? "flexi11-section"
        : "quick-buy-section"
    )
  }
className={`${clickable} mt-5 w-full rounded-full bg-[#f5c542] px-5 py-3 font-bold text-black`}>
  {item.action}
</button>
                  </div>
                ))}
              </div>
            )}

            {dashboardTab === "preBooking" && (
  <div id="pre-booking-section"  className="mt-10 rounded-[34px] bg-[#111] p-8 text-white shadow-2xl">
    <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#f5c542]">
      Pre-Booking & Exchange
    </p>

    <div className="flex items-start justify-between">
      <div>
        <h3 className="mt-2 font-serif text-[38px]">
          Hold Gold Value & Buy Jewellery Later
        </h3>

        <p className="mt-4 max-w-[950px] text-[17px] leading-8 text-white/70">
          Customer can either pay advance amount or submit old jewellery
          for exchange. After holding for selected months, customer can
          purchase jewellery with eligible VA benefit.
        </p>
      </div>

      {isAdvanceBooking && selectedRate && (
        <div className="text-right">
          <p className="text-[14px] font-semibold uppercase tracking-[2px] text-[#f5c542]">
            {selectedRateTitle}
          </p>

          <h2 className="mt-1 text-[42px] font-extrabold leading-none text-[#f5c542]">
            ₹{selectedRate / 10}
          </h2>

          <p className="mt-1 text-[15px] text-white/60">Per Gram</p>
        </div>
      )}
    </div>

    <div className="mt-8 grid grid-cols-2 gap-6">
      <div>
        <label className="mb-2 block text-white/70">Scheme Type</label>
        <select
          value={preBookingType}
          onChange={(e) => setPreBookingType(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-4 outline-none"
        >
          <option>Advance Gold Booking</option>
          <option>Advance kamal Silver Booking</option>
          <option>Advance Swastik Silver Booking</option>
          <option>Old Gold Exchange</option>
          <option>Old Silver Exchange</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-white/70">Hold Period</label>
        <select
          value={holdMonths}
          onChange={(e) => setHoldMonths(e.target.value)}
          className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-4 outline-none"
        >
          <option value="5">5 Months - 5% VA Benefit</option>
          <option value="6">6 Months - 6% VA Benefit</option>
          <option value="7">7 Months - 7% VA Benefit</option>
          <option value="8">8 Months - 8% VA Benefit</option>
          <option value="9">9 Months - 9% VA Benefit</option>
          <option value="10">10 Months - 10% VA Benefit</option>
          <option value="11">11 Months - Full Eligible VA Benefit</option>
          <option value="12">12 Months - Full Eligible VA Benefit</option>
        </select>
      </div>

      {isAdvanceBooking && (
        <>
          <div>
            <label className="mb-2 block text-white/70">Metal Weight</label>
          <input
  value={metalWeight}
  onChange={(e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setMetalWeight(value);

    const amount = calculatePreBookingAmount(value);
    setMetalAmount(amount ? amount.toFixed(0) : "");
  }}
  placeholder="Enter metal weight in grams"
  className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-4 outline-none"
/>
          </div>

          <div>
            <label className="mb-2 block text-white/70">Metal Amount</label>
           <input
  value={metalAmount}
  onChange={(e) =>
    setMetalAmount(e.target.value.replace(/\D/g, ""))
  }
  placeholder="Enter amount for metal"
  className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-4 outline-none"
/>
          </div>
        </>
      )}

      {isOldExchange && (
        <>
        <div>
  <label className="mb-2 block text-white/70">
    Item Name
  </label>

  <input
    value={itemName}
    onChange={(e) => setItemName(e.target.value)}
    placeholder="Gold Chain / Ring / Bangles"
    className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-4 outline-none"
  />
</div>
          <div>
            <label className="mb-2 block text-white/70">
              Old Metal Gross Weight
            </label>
            <input
              value={oldGrossWeight}
              onChange={(e) =>
                setOldGrossWeight(e.target.value.replace(/[^0-9.]/g, ""))
              }
              placeholder="Enter gross weight"
              className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-4 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-white/70">Purity</label>
            <input
              value={oldPurity}
              onChange={(e) =>
                setOldPurity(e.target.value.replace(/[^0-9.]/g, ""))
              }
              placeholder="Enter purity"
              className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-4 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-white/70">
              Old Exchange Amount
            </label>
            <input
              value={oldExchangeAmount}
              onChange={(e) =>
                setOldExchangeAmount(e.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter old exchange amount"
              className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-4 outline-none"
            />
          </div>
        </>
      )}
    </div>

 <button
  onClick={handleCreatePreBooking}
className={`${clickable} mt-5 w-full rounded-full bg-[#f5c542] px-5 py-3 font-bold text-black`}>
  Pay / Submit Old Gold & Activate Pre-Booking
</button>
  </div>
)}



            {dashboardTab === "flexi11" && (
              <div id="flexi11-section" className="mt-10 rounded-[34px] bg-[#111] p-8 text-white shadow-2xl">
                <div className="flex items-start justify-between">
  <div>
    <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#f5c542]">
      Flexi 11 Month Plan
    </p>

    <h3 className="mt-2 font-serif text-[38px]">
      Monthly Gold Savings Tracker
    </h3>

    <p className="mt-3 text-[17px] text-white/70">
      Save every month and accumulate gold value at live market rates.
    </p>
  </div>

  <div className="text-right">
    <p className="text-[14px] uppercase tracking-[2px] text-[#f5c542]">
      Today's Gold Rate
    </p>

    <h2 className="text-[42px] font-extrabold text-[#f5c542]">
      ₹{goldRate / 10}
    </h2>

    <p className="text-white/60">
      Per Gram
    </p>
  </div>
</div>

                <div className="mt-8 grid grid-cols-4 gap-5">
  {[1000, 2000, 5000, 10000, 15000, 20000, 25000, 50000].map((value) => (
    <button
      key={value}
      onClick={() => setMonthlyAmount(String(value))}
className={`${clickable} rounded-2xl border border-[#f5c542]/30 px-5 py-6 text-[22px] font-bold ${        monthlyAmount === String(value)
          ? "bg-[#f5c542] text-black shadow-lg"
          : "bg-[#fff8e6] text-black hover:bg-[#fde7a1]"
      }`}
    >
      ₹{value.toLocaleString("en-IN")}
    </button>
  ))}
</div>

                <div className="mt-8 grid grid-cols-3 gap-5">
                  {[
                    [
                      "Monthly Amount",
                      `₹${Number(monthlyAmount).toLocaleString("en-IN")}`,
                    ],
                    ["Plan Duration", "11 Months"],
                    [
                      "Total Plan Value",
                      `₹${(Number(monthlyAmount) * 11).toLocaleString(
                        "en-IN"
                      )}`,
                    ],
                  ].map(([title, value]) => (
                    <div
                      key={title}
                      className="rounded-[24px] bg-white/10 p-6 border border-white/10"
                    >
                     <p className="text-white/60">{title}</p>

<h4 className="mt-2 text-[28px] font-bold text-[#f5c542]">
  {value}
</h4>
                    </div>
                  ))}
                </div>

                <div className="mt-10 overflow-hidden rounded-2xl border border-[#ead7ae]">
                  <table className="w-full border-collapse text-center">
  <thead className="bg-[#f5c542] text-black">
    <tr>
      <th className="p-4">Month</th>
      <th className="p-4">Due Date</th>
      <th className="p-4">Amount</th>
      <th className="p-4">Gold Rate</th>
      <th className="p-4">Gold Grams</th>
      <th className="p-4">Status</th>
    </tr>
  </thead>

  <tbody className="bg-black/20">
  {Array.from({ length: 11 }).map((_, index) => {
    const isFirstMonth = index === 0;
const grams = Number(monthlyAmount || 0) / (goldRate / 10);
    return (
      <tr key={index} className="border-b border-white/10">
        <td className="p-4 font-bold">{index + 1}</td>

        <td className="p-4">
          {new Date(
            new Date().setMonth(new Date().getMonth() + index)
          ).toLocaleDateString("en-IN")}
        </td>

        <td className="p-4">
          ₹{Number(monthlyAmount).toLocaleString("en-IN")}
        </td>

        <td className="p-4">
          {isFirstMonth ? `₹${goldRate / 10}/gm` : "Upcoming"}
        </td>

        <td className="p-4">
          {isFirstMonth ? `${grams.toFixed(4)} gm` : "Upcoming"}
        </td>

        <td className="p-4">
          <span
            className={`rounded-full px-4 py-1 text-sm font-bold ${
              isFirstMonth
                ? "bg-yellow-200 text-yellow-800"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isFirstMonth ? "Pay Now" : "Upcoming"}
          </span>
        </td>
      </tr>
    );
  })}
</tbody>
                  </table>
                </div>

         <button
  onClick={handleCreateFlexi11}
className={`${clickable} mt-5 w-full rounded-full bg-[#f5c542] px-5 py-3 font-bold text-black`}>
  Pay First Month & Activate Flexi 11
</button>
              </div>
            )}

            {dashboardTab === "quickBuy" && (
              <div id="quick-buy-section" className="mt-10 rounded-[34px] bg-[#070707] p-8 text-white shadow-2xl">
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#f5c542]">
                  Quick Buy Gold & Silver
                </p>

                <h3 className="mt-2 font-serif text-[38px]">
                  Buy Metal Instantly
                </h3>

                <div className="mt-8 grid grid-cols-3 gap-6">
  <button
    onClick={() => setQuickMetal("Gold")}
className={`${clickable} rounded-2xl px-6 py-5 text-[22px] font-bold ${
      quickMetal === "Gold"
        ? "bg-[#f5c542] text-black"
        : "bg-white/10 text-white"
    }`}
  >
Gold ₹{((rates?.gold24Rate || 0) / 10).toFixed(0)}/gm
  </button>

  <button
    onClick={() => setQuickMetal("Kamal Silver")}
    className={`${clickable} rounded-2xl px-6 py-5 text-[22px] font-bold ${
      quickMetal === "Kamal Silver"
        ? "bg-[#f5c542] text-black"
        : "bg-white/10 text-white"
    }`}
  >
Kamal Silver ₹{((rates?.silver999Rate || 0) / 10).toFixed(2)}/gm
  </button>

  <button
    onClick={() => setQuickMetal("Swastik Silver")}
    className={`${clickable} rounded-2xl px-6 py-5 text-[22px] font-bold ${
      quickMetal === "Swastik Silver"
        ? "bg-[#f5c542] text-black"
        : "bg-white/10 text-white"
    }`}
  >
Swastik Silver ₹{((rates?.silver995Rate || 0) / 10).toFixed(2)}/gm
  </button>
</div>

                <div className="mt-8 grid grid-cols-[1fr_360px] gap-6">
                  <div>
                    <label className="mb-2 block text-white/70">
                      Enter Amount
                    </label>
                    <input
                      value={quickAmount}
                      onChange={(e) =>
                        setQuickAmount(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Enter amount"
                      className="w-full rounded-2xl border border-white/20 bg-black/40 px-5 py-5 text-[26px] outline-none"
                    />

                    <div className="mt-5 grid grid-cols-4 gap-3">
                      {[1000, 2000, 5000, 10000].map((value) => (
                        <button
                          key={value}
                          onClick={() => setQuickAmount(String(value))}
className={`${clickable} rounded-xl bg-white/10 py-3 font-bold hover:bg-[#f5c542] hover:text-black`}                        >
                          ₹{value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-white/10 p-6 text-center">
                    <p className="text-white/60">Metal Weight</p>
                    <h4 className="mt-3 text-[42px] font-bold text-[#f5c542]">
                      {quickWeight.toFixed(3)} gm
                    </h4>
                    <p className="mt-2 text-white/60">
                      {quickMetal} will be saved
                    </p>
                  </div>
                </div>

             <button
  onClick={handleCreateQuickBuy}
 className={`${clickable} mt-5 w-full rounded-full bg-[#f5c542] px-5 py-3 font-bold text-black`}
>
  Pay Now & Save {quickMetal} in Wallet
</button>
              </div>
            )}
          </div>
        </div>
      )}
      {selectedScheme && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-6">
    <div className="relative max-h-[90vh] w-full max-w-[1150px] overflow-y-auto rounded-[34px] bg-white p-8 shadow-2xl">
      <button
        onClick={closeSchemeDetails}
        className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-black text-2xl font-bold text-white"
      >
        ×
      </button>

      {selectedSchemeType === "PRE_BOOKING" && (
        <>
          <p className="text-[13px] font-bold uppercase tracking-[4px] text-[#b98213]">
            Pre-Booking Scheme Details
          </p>

          <h2 className="mt-2 font-serif text-[38px]">
            {selectedScheme.schemeSubType?.replaceAll("_", " ")}
          </h2>

          <div className="mt-8 grid grid-cols-4 gap-5">
            {[
              ["Metal", selectedScheme.metalName || "-"],
              [
  "Item Name",
  selectedScheme.schemeSubType === "OLD_GOLD_EXCHANGE" ||
  selectedScheme.schemeSubType === "OLD_SILVER_EXCHANGE"
    ? selectedScheme.itemName || "Old Jewellery"
    : "-",
],
              ["Amount", formatMoney(selectedScheme.amount || selectedScheme.oldExchangeAmount)],
              ["Weight", `${selectedScheme.metalWeight || selectedScheme.oldPurityWeight || 0} gm`],
              ["Rate", `₹${selectedScheme.ratePerGram || 0}/gm`],
              ["Hold Months", `${selectedScheme.holdMonths || 0} Months`],
              ["Benefit", selectedScheme.benefitText || "-"],
              ["Maturity Date", formatDate(selectedScheme.maturityDate)],
            ].map(([title, value]) => (
              <div key={title} className="rounded-2xl bg-[#fbf7ef] p-5">
                <p className="text-gray-500">{title}</p>
                <h4 className="mt-2 text-[20px] font-bold text-[#b98213]">
                  {value}
                </h4>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[24px] bg-black p-6 text-white">
            <h3 className="text-[24px] font-bold text-[#f5c542]">
              Timeline
            </h3>

            <div className="mt-5 grid grid-cols-3 gap-5">
              <div>
                <p className="text-white/50">Created Date</p>
                <b>{formatDate(selectedScheme.createdAt)}</b>
              </div>

              <div>
                <p className="text-white/50">Remaining Days</p>
                <b>{selectedScheme.remainingDays || 0} Days</b>
              </div>

              <div>
                <p className="text-white/50">Status</p>
                <b>{selectedScheme.status}</b>
              </div>
            </div>
          </div>
        </>
      )}

      {selectedSchemeType === "FLEXI_11" && selectedScheme && (
        <>
          <p className="text-[13px] font-bold uppercase tracking-[4px] text-[#b98213]">
            Flexi 11 Scheme Details
          </p>

          <h2 className="mt-2 font-serif text-[38px]">
            Monthly Gold Savings Tracker
          </h2>

          <div className="mt-8 grid grid-cols-4 gap-5">
            {[
              ["Metal", selectedScheme.metalName || "Gold"],
              ["Monthly Amount", formatMoney(selectedScheme.monthlyAmount)],
              ["Total Paid", formatMoney(selectedScheme.totalPaidAmount)],
              ["Gold Collected", `${Number(selectedScheme.totalGoldWeight || 0).toFixed(4)} gm`],
              ["Paid Months", `${selectedScheme.paidMonths}/${selectedScheme.durationMonths}`],
              ["Remaining Months", selectedScheme.remainingMonths],
              ["Next Due Date", formatDate(selectedScheme.nextDueDate)],
              ["Status", selectedScheme.status],
            ].map(([title, value]) => (
              <div key={title} className="rounded-2xl bg-[#fbf7ef] p-5">
                <p className="text-gray-500">{title}</p>
                <h4 className="mt-2 text-[20px] font-bold text-[#b98213]">
                  {value}
                </h4>
              </div>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-[#ead7ae]">
          <table className="w-full border-collapse text-center">
  <thead className="bg-[#f5c542] text-black">
    <tr>
      <th className="p-4">Month</th>
      <th className="p-4">Due Date</th>
      <th className="p-4">Paid Date</th>
      <th className="p-4">Amount</th>
      <th className="p-4">Gold Rate</th>
      <th className="p-4">Gold Grams</th>
      <th className="p-4">Method</th>
      <th className="p-4">Status</th>
    </tr>
  </thead>

  <tbody>
    {Array.from({ length: selectedScheme?.durationMonths || 11 }).map(
      (_, index) => {
        const monthNumber = index + 1;

        const payment = selectedScheme.payments?.find(
          (p: any) => p.monthNumber === monthNumber
        );

        const dueDate = new Date(selectedScheme.createdAt);
dueDate.setDate(dueDate.getDate() + index * 2);

        return (
          <tr key={index} className="border-b">
            <td className="p-4 font-bold">{monthNumber}</td>

            <td className="p-4">
              {dueDate.toLocaleDateString("en-IN")}
            </td>

            <td className="p-4">
              {payment ? formatDate(payment.paymentDate) : "-"}
            </td>

            <td className="p-4">
              {payment ? formatMoney(payment.paidAmount) : "-"}
            </td>

            <td className="p-4">
              {payment ? `₹${payment.ratePerGram}/gm` : "-"}
            </td>

            <td className="p-4">
              {payment
                ? `${Number(payment.metalWeight || 0).toFixed(4)} gm`
                : "-"}
            </td>

            <td className="p-4">
              {payment?.paymentMethod || "-"}
            </td>

            <td className="p-4">
              <span
                className={`rounded-full px-4 py-1 text-sm font-bold ${
                  payment
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {payment ? "PAID" : "DUE"}
              </span>
            </td>
          </tr>
        );
      }
    )}
  </tbody>
</table>
          </div>
        </>
      )}

      {selectedSchemeType === "QUICK_BUY" && (
        <>
          <p className="text-[13px] font-bold uppercase tracking-[4px] text-[#b98213]">
            Quick Buy Transactions
          </p>

          <h2 className="mt-2 font-serif text-[38px]">
            {selectedScheme.metalName} Purchase History
          </h2>

          <div className="mt-8 grid grid-cols-3 gap-5">
            <div className="rounded-2xl bg-[#fbf7ef] p-5">
              <p className="text-gray-500">Total Transactions</p>
              <h4 className="mt-2 text-[24px] font-bold text-[#b98213]">
                {selectedScheme.transactionCount}
              </h4>
            </div>

            <div className="rounded-2xl bg-[#fbf7ef] p-5">
              <p className="text-gray-500">Total Amount</p>
              <h4 className="mt-2 text-[24px] font-bold text-[#b98213]">
                {formatMoney(selectedScheme.totalAmount)}
              </h4>
            </div>

            <div className="rounded-2xl bg-[#fbf7ef] p-5">
              <p className="text-gray-500">Total Weight</p>
              <h4 className="mt-2 text-[24px] font-bold text-[#b98213]">
                {Number(selectedScheme.totalWeight || 0).toFixed(4)} gm
              </h4>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-[#ead7ae]">
            <table className="w-full border-collapse text-center">
              <thead className="bg-[#f5c542] text-black">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Metal</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Rate</th>
                  <th className="p-4">Weight</th>
                  <th className="p-4">Payment Type</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {selectedScheme.transactions?.map((item: any) => {
                  const payment = item.payments?.[0];

                  return (
                    <tr key={item.schemeId} className="border-b">
                      <td className="p-4">{formatDate(item.createdAt)}</td>
                      <td className="p-4 font-bold">{item.metalName}</td>
                      <td className="p-4">{formatMoney(item.amount)}</td>
                      <td className="p-4">₹{item.ratePerGram || 0}/gm</td>
                      <td className="p-4">
                        {Number(item.metalWeight || 0).toFixed(4)} gm
                      </td>
                      <td className="p-4">{payment?.paymentMethod || "-"}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-bold text-blue-700">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  </div>
)}
</div>

  );
};

export default SchemeRegister;