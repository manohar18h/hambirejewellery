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
  Coins
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
  verifyCustomerAadhaar,
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
const formCardRef = useRef<HTMLDivElement | null>(null);
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

type SchemeSection =
  | "PRE_BOOKING"
  | "FLEXI_11"
  | "QUICK_BUY";

const [activeSchemeSection, setActiveSchemeSection] =
  useState<SchemeSection>("PRE_BOOKING");

const [selectedScheme, setSelectedScheme] =
  useState<any>(null);
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
  preBookingCards.length +
  flexi11Cards.length +
  quickBuyCards.length;

const normalizeSchemeStatus = (status: any) =>
  String(status || "")
    .trim()
    .toUpperCase();

const isActiveStatus = (status: any) =>
  normalizeSchemeStatus(status) === "ACTIVE";

const isCompletedStatus = (status: any) =>
  normalizeSchemeStatus(status) === "COMPLETED";

const isInactiveStatus = (status: any) => {
  const normalized =
    normalizeSchemeStatus(status);

  return (
    normalized === "INACTIVE" ||
    normalized === "CANCELLED" ||
    normalized === "CANCELED" ||
    normalized === "CLOSED"
  );
};

const sumSchemeValues = (
  items: any[],
  selector: (item: any) => number,
) =>
  items.reduce(
    (total, item) =>
      total + Number(selector(item) || 0),
    0,
  );

/* PRE-BOOKING COUNTS */

const preBookingActiveCount =
  preBookingCards.filter((item: any) =>
    isActiveStatus(item.status),
  ).length;

const preBookingCompletedCount =
  preBookingCards.filter((item: any) =>
    isCompletedStatus(item.status),
  ).length;

const preBookingInactiveCount =
  preBookingCards.filter((item: any) =>
    isInactiveStatus(item.status),
  ).length;

const advanceGoldBookingCount =
  preBookingCards.filter(
    (item: any) =>
      item.schemeSubType ===
      "ADVANCE_GOLD_BOOKING",
  ).length;

const advanceKamalSilverCount =
  preBookingCards.filter(
    (item: any) =>
      item.schemeSubType ===
      "ADVANCE_KAMAL_SILVER_BOOKING",
  ).length;

const advanceSwastikSilverCount =
  preBookingCards.filter(
    (item: any) =>
      item.schemeSubType ===
      "ADVANCE_SWASTIK_SILVER_BOOKING",
  ).length;

const oldGoldExchangeCount =
  preBookingCards.filter(
    (item: any) =>
      item.schemeSubType ===
      "OLD_GOLD_EXCHANGE",
  ).length;

const oldSilverExchangeCount =
  preBookingCards.filter(
    (item: any) =>
      item.schemeSubType ===
      "OLD_SILVER_EXCHANGE",
  ).length;

const totalPreBookingGoldWeight =
  sumSchemeValues(
    preBookingCards.filter(
      (item: any) =>
        item.schemeSubType ===
          "ADVANCE_GOLD_BOOKING" ||
        item.schemeSubType ===
          "OLD_GOLD_EXCHANGE",
    ),
    (item: any) =>
      item.schemeSubType ===
      "OLD_GOLD_EXCHANGE"
        ? item.oldPurityWeight
        : item.metalWeight,
  );

const totalPreBookingSilverWeight =
  sumSchemeValues(
    preBookingCards.filter(
      (item: any) =>
        item.schemeSubType ===
          "ADVANCE_KAMAL_SILVER_BOOKING" ||
        item.schemeSubType ===
          "ADVANCE_SWASTIK_SILVER_BOOKING" ||
        item.schemeSubType ===
          "OLD_SILVER_EXCHANGE",
    ),
    (item: any) =>
      item.schemeSubType ===
      "OLD_SILVER_EXCHANGE"
        ? item.oldPurityWeight
        : item.metalWeight,
  );

const totalPreBookingAmount =
  sumSchemeValues(
    preBookingCards,
    (item: any) =>
      item.oldExchangeAmount ??
      item.amount,
  );

/* FLEXI 11 COUNTS */

const flexiActiveCount =
  flexi11Cards.filter((item: any) =>
    isActiveStatus(item.status),
  ).length;

const flexiCompletedCount =
  flexi11Cards.filter((item: any) =>
    isCompletedStatus(item.status),
  ).length;

const flexiInactiveCount =
  flexi11Cards.filter((item: any) =>
    isInactiveStatus(item.status),
  ).length;

const flexiPaymentDueCount =
  flexi11Cards.filter(
    (item: any) =>
      Boolean(item.showPayButton) &&
      isActiveStatus(item.status),
  ).length;

const totalFlexiPaidAmount =
  sumSchemeValues(
    flexi11Cards,
    (item: any) =>
      item.totalPaidAmount,
  );

const totalFlexiGoldWeight =
  sumSchemeValues(
    flexi11Cards,
    (item: any) =>
      item.totalGoldWeight,
  );

const totalFlexiPaidMonths =
  sumSchemeValues(
    flexi11Cards,
    (item: any) =>
      item.paidMonths,
  );

/* QUICK BUY COUNTS */

const quickBuyTransactionCount =
  sumSchemeValues(
    quickBuyCards,
    (item: any) =>
      item.transactionCount,
  );

const quickBuyTotalAmount =
  sumSchemeValues(
    quickBuyCards,
    (item: any) =>
      item.totalAmount,
  );

const quickBuyGoldTransactions =
  sumSchemeValues(
    quickBuyCards.filter(
      (item: any) =>
        String(item.metalName || "")
          .toLowerCase()
          .includes("gold"),
    ),
    (item: any) =>
      item.transactionCount,
  );

const quickBuySilverTransactions =
  sumSchemeValues(
    quickBuyCards.filter(
      (item: any) =>
        String(item.metalName || "")
          .toLowerCase()
          .includes("silver"),
    ),
    (item: any) =>
      item.transactionCount,
  );

const quickBuyGoldWeight =
  sumSchemeValues(
    quickBuyCards.filter(
      (item: any) =>
        String(item.metalName || "")
          .toLowerCase()
          .includes("gold"),
    ),
    (item: any) =>
      item.totalWeight,
  );

const quickBuySilverWeight =
  sumSchemeValues(
    quickBuyCards.filter(
      (item: any) =>
        String(item.metalName || "")
          .toLowerCase()
          .includes("silver"),
    ),
    (item: any) =>
      item.totalWeight,
  );

const activeSectionTitle =
  activeSchemeSection === "PRE_BOOKING"
    ? "Pre-Booking & Exchange"
    : activeSchemeSection === "FLEXI_11"
      ? "Flexi 11 Monthly Savings"
      : "Quick Buy Transactions";

const activeSectionCount =
  activeSchemeSection === "PRE_BOOKING"
    ? preBookingCards.length
    : activeSchemeSection === "FLEXI_11"
      ? flexi11Cards.length
      : quickBuyTransactionCount;

const openSchemeSection = (
  section: SchemeSection,
) => {
  setActiveSchemeSection(section);
  setShowActiveSchemes(true);

  window.setTimeout(() => {
    document
      .getElementById(
        "customer-scheme-section",
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, 150);
};
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
    // Firebase OTP verification
    await confirmationResult.confirm(otp);

    // Create customer
    const customer =
      await registerSchemeCustomer({
        ...registerData,
        panNumber: "",
      });

    // Verify OCR again, upload and save verified status
    if (aadhaarFile) {
      const aadhaarResult =
        await verifyCustomerAadhaar(
          customer.customerId,
          registerData.aadhaarNumber,
          aadhaarFile
        );

      if (!aadhaarResult.verified) {
        throw new Error(
          aadhaarResult.message ||
          "Aadhaar verification failed"
        );
      }
    }

    alert(
      "Registration and Aadhaar verification successful. Please login."
    );

    setOtp("");
    setConfirmationResult(null);
    setStep("login");
  } catch (error: any) {
    console.error(
      "OTP/Register error:",
      error
    );

    if (error.code?.startsWith("auth/")) {
      alert(
        error.message ||
        "Invalid or expired OTP"
      );
      return;
    }

    alert(
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Registration failed"
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
setActiveSchemeSection("PRE_BOOKING");
setShowActiveSchemes(true);
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


const getCompletedMonths = (item: any) => {
  if (!item.createdAt || !item.maturityDate || !item.holdMonths) return 0;

  const created = new Date(item.createdAt).getTime();
  const maturity = new Date(item.maturityDate).getTime();
  const now = Date.now();

  const total = maturity - created;
  if (total <= 0) return item.holdMonths;

  const elapsed = Math.max(0, Math.min(now - created, total));

  return Math.floor((elapsed / total) * item.holdMonths);
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
setActiveSchemeSection("FLEXI_11");
setShowActiveSchemes(true);
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
setActiveSchemeSection("QUICK_BUY");
setShowActiveSchemes(true);
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
<div className="rounded-[34px] bg-gradient-to-br from-[#120902] via-[#251505] to-black p-8 text-white shadow-2xl max-md:order-2 max-md:p-5">
          <p className="text-[13px] font-bold uppercase tracking-[4px] text-[#f5c542]">
        Hambire Jewellery
      </p>

      <h1 className="mt-4 font-serif text-[42px] leading-tight max-md:text-[30px]">
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

setActiveSchemeSection("FLEXI_11");
setShowActiveSchemes(true);

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

const detailButtonClass = `
  ${clickable}
  flex
  h-[52px]
  w-full
  items-center
  justify-center
  rounded-xl
  border
  border-[#f5c542]
  bg-transparent
  px-4
  font-bold
  text-[#f5c542]
  transition-all
  duration-300
  hover:bg-[#f5c542]
  hover:text-black
  hover:shadow-lg
`;

const getStatusClass = (status: any) => {
  const normalized =
    normalizeSchemeStatus(status);

  if (normalized === "ACTIVE") {
    return "border border-green-300/30 bg-green-100 text-green-700";
  }

  if (normalized === "COMPLETED") {
    return "border border-blue-300/30 bg-blue-100 text-blue-700";
  }

  if (
    normalized === "INACTIVE" ||
    normalized === "CANCELLED" ||
    normalized === "CANCELED" ||
    normalized === "CLOSED"
  ) {
    return "border border-red-300/30 bg-red-100 text-red-700";
  }

  return "border border-gray-300 bg-gray-100 text-gray-700";
};

const scrollToFormCard = () => {
  setTimeout(() => {
    if (formCardRef.current) {
      const y =
        formCardRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        120;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  }, 100);
};

  return (
    <div className="min-h-screen bg-[#fbf7ef] px-8 py-14 max-md:px-4 max-md:py-6 max-md:pb-[90px]">
      {step !== "wallet" ? (
<div className="mx-auto grid max-w-[1450px] grid-cols-[420px_1fr] gap-10 max-md:grid-cols-1 max-md:gap-5">
            {renderLeftCard()}

<div
  ref={formCardRef}
  className="rounded-[34px] bg-white p-10 shadow-2xl max-md:order-1 max-md:p-5"
>
                {step === "login" && (
              <>
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                  Customer Login
                </p>

                <h2 className="mt-3 font-serif text-[44px] max-md:text-[30px] max-md:leading-tight">
                  Login to Scheme Wallet
                </h2>

                <div className="mt-10 grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:mt-6">
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
                  onClick={() => {
  setStep("register");
  scrollToFormCard();
}}
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
          <div className="rounded-[34px] bg-white p-10 shadow-2xl max-md:p-5">
            <div className="flex items-start justify-between max-md:flex-col max-md:gap-4">
              <div>
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                  Hambire Scheme Dashboard
                </p>

                <h2 className="mt-3 font-serif text-[46px] max-md:text-[30px] max-md:leading-tight">
                  Welcome to Your Scheme Wallet
                </h2>
              </div>

             <button
  onClick={logoutSchemeCustomer}
  className={`${clickable} max-md:hidden rounded-full border border-gray-300 px-7 py-3 font-bold text-gray-700`}
>
  Logout
</button>
            </div>

       <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
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
  className={`rounded-[20px] p-4 text-center shadow ${
    item.title === "Active Schemes"
      ? "bg-[#111] text-white"
      : "bg-[#fbf7ef]"
  }`}
>
  <p
    className={`text-[13px] ${
      item.title === "Active Schemes"
        ? "text-white/60"
        : "text-gray-600"
    }`}
  >
    {item.title}
  </p>

  <h3
    className={`mt-2 text-[20px] font-bold ${
      item.title === "Active Schemes"
        ? "text-[#f5c542]"
        : "text-[#b98213]"
    }`}
  >
    {item.value}
  </h3>

  {item.used && (
    <p className="mt-1 text-[11px] font-semibold text-gray-500">
      {item.used}
    </p>
  )}
</div>
  ))}
</div>

            <div className="mt-8 grid grid-cols-4 gap-4 max-md:grid-cols-2 max-md:gap-3">
              {[
                ["overview", "Overview"],
                ["preBooking", "Pre-Booking"],
                ["flexi11", "Flexi 11"],
                ["quickBuy", "Quick Buy"],
              ].map(([key, label]) => (
                <button
                  key={key}
onClick={() => handleDashboardTabClick(key as any)} 
 className={`${clickable} rounded-full px-6 py-3 font-bold max-md:px-3 max-md:text-[14px] ${    
                    dashboardTab === key
                      ? "bg-[#f5c542] text-black"
                      : "bg-[#fbf7ef] text-black"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>


{/* SEPARATE SCHEME CATEGORY SUMMARY CARDS */}
<div className="mt-10">
  <div className="mb-6 flex items-end justify-between gap-4 max-md:flex-col max-md:items-start">
    <div>
      <p className="text-[13px] font-bold uppercase tracking-[4px] text-[#b98213]">
        Your Scheme Portfolio
      </p>

      <h3 className="mt-2 font-serif text-[36px] text-[#111] max-md:text-[27px]">
        View Schemes by Category
      </h3>

      <p className="mt-2 max-w-3xl text-[15px] leading-7 text-gray-500">
        Select one category to view its schemes,
        payment status, metals and complete
        transaction details.
      </p>
    </div>

    <div className="rounded-full bg-[#fff4d1] px-5 py-2 text-sm font-bold text-[#8c6510]">
      {totalDashboardCards} scheme groups
    </div>
  </div>

  <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
    {/* PRE-BOOKING SUMMARY */}
    <button
      type="button"
      onClick={() =>
        openSchemeSection("PRE_BOOKING")
      }
      className={`${clickable} relative overflow-hidden rounded-[30px] border p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        activeSchemeSection ===
          "PRE_BOOKING" &&
        showActiveSchemes
          ? "border-[#d79d22] bg-[#17120a] text-white ring-4 ring-[#f5c542]/20"
          : "border-[#ead9ad] bg-gradient-to-br from-[#fffaf0] to-[#f8ebc8] text-[#17120a]"
      }`}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#f5c542]/20" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5c542] text-xl font-black text-black shadow">
            PB
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              activeSchemeSection ===
                "PRE_BOOKING" &&
              showActiveSchemes
                ? "bg-white/10 text-[#f5c542]"
                : "bg-white text-[#9b6c08]"
            }`}
          >
            {preBookingCards.length} Schemes
          </span>
        </div>

        <h4 className="mt-5 font-serif text-[27px] font-bold">
          Pre-Booking & Exchange
        </h4>

        <p
          className={`mt-2 min-h-[48px] text-sm leading-6 ${
            activeSchemeSection ===
              "PRE_BOOKING" &&
            showActiveSchemes
              ? "text-white/60"
              : "text-gray-600"
          }`}
        >
          Advance gold and silver bookings together
          with old jewellery exchange schemes.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/80 p-3 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-500">
              Active
            </p>

            <p className="mt-1 text-xl font-black text-green-500">
              {preBookingActiveCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-3 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-500">
              Completed
            </p>

            <p className="mt-1 text-xl font-black text-blue-500">
              {preBookingCompletedCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-3 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-500">
              Inactive
            </p>

            <p className="mt-1 text-xl font-black text-red-500">
              {preBookingInactiveCount}
            </p>
          </div>
        </div>

        <div
          className={`mt-4 space-y-3 rounded-[22px] p-4 ${
            activeSchemeSection ===
              "PRE_BOOKING" &&
            showActiveSchemes
              ? "bg-white/[0.07]"
              : "bg-white/70"
          }`}
        >
          <div className="flex justify-between gap-4 text-sm">
            <span className="opacity-60">
              Gold / Old Gold
            </span>

            <b>
              {advanceGoldBookingCount} /{" "}
              {oldGoldExchangeCount}
            </b>
          </div>

          <div className="flex justify-between gap-4 text-sm">
            <span className="opacity-60">
              Silver / Old Silver
            </span>

            <b>
              {advanceKamalSilverCount +
                advanceSwastikSilverCount}{" "}
              / {oldSilverExchangeCount}
            </b>
          </div>

          <div className="flex justify-between gap-4 text-sm">
            <span className="opacity-60">
              Gold Weight
            </span>

            <b>
              {totalPreBookingGoldWeight.toFixed(
                3,
              )}{" "}
              gm
            </b>
          </div>

          <div className="flex justify-between gap-4 text-sm">
            <span className="opacity-60">
              Silver Weight
            </span>

            <b>
              {totalPreBookingSilverWeight.toFixed(
                3,
              )}{" "}
              gm
            </b>
          </div>

          <div className="flex justify-between gap-4 border-t border-current/10 pt-3 text-sm">
            <span className="opacity-60">
              Total Value
            </span>

            <b className="text-[#d49c22]">
              {formatMoney(
                totalPreBookingAmount,
              )}
            </b>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-full bg-[#f5c542] px-5 py-3 font-bold text-black">
          <span>View Pre-Booking Schemes</span>
          <span className="text-xl">→</span>
        </div>
      </div>
    </button>

    {/* FLEXI 11 SUMMARY */}
    <button
      type="button"
      onClick={() =>
        openSchemeSection("FLEXI_11")
      }
      className={`${clickable} relative overflow-hidden rounded-[30px] border p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        activeSchemeSection ===
          "FLEXI_11" &&
        showActiveSchemes
          ? "border-emerald-500 bg-[#071a14] text-white ring-4 ring-emerald-500/20"
          : "border-emerald-200 bg-gradient-to-br from-[#f4fff9] to-[#dff8ea] text-[#10241b]"
      }`}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/15" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-white shadow">
            11
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              activeSchemeSection ===
                "FLEXI_11" &&
              showActiveSchemes
                ? "bg-white/10 text-emerald-300"
                : "bg-white text-emerald-700"
            }`}
          >
            {flexi11Cards.length} Schemes
          </span>
        </div>

        <h4 className="mt-5 font-serif text-[27px] font-bold">
          Flexi 11 Month Plan
        </h4>

        <p
          className={`mt-2 min-h-[48px] text-sm leading-6 ${
            activeSchemeSection ===
              "FLEXI_11" &&
            showActiveSchemes
              ? "text-white/60"
              : "text-gray-600"
          }`}
        >
          Track monthly payments, due dates,
          completed months and collected gold.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/80 p-3 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-500">
              Active
            </p>

            <p className="mt-1 text-xl font-black text-green-500">
              {flexiActiveCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-3 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-500">
              Completed
            </p>

            <p className="mt-1 text-xl font-black text-blue-500">
              {flexiCompletedCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-3 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-500">
              Inactive
            </p>

            <p className="mt-1 text-xl font-black text-red-500">
              {flexiInactiveCount}
            </p>
          </div>
        </div>

        <div
          className={`mt-4 space-y-3 rounded-[22px] p-4 ${
            activeSchemeSection ===
              "FLEXI_11" &&
            showActiveSchemes
              ? "bg-white/[0.07]"
              : "bg-white/70"
          }`}
        >
          <div className="flex justify-between gap-4 text-sm">
            <span className="opacity-60">
              Payments Due
            </span>

            <b
              className={
                flexiPaymentDueCount > 0
                  ? "text-orange-500"
                  : "text-green-500"
              }
            >
              {flexiPaymentDueCount}
            </b>
          </div>

          <div className="flex justify-between gap-4 text-sm">
            <span className="opacity-60">
              Paid Months
            </span>

            <b>{totalFlexiPaidMonths}</b>
          </div>

          <div className="flex justify-between gap-4 text-sm">
            <span className="opacity-60">
              Gold Collected
            </span>

            <b>
              {totalFlexiGoldWeight.toFixed(4)} gm
            </b>
          </div>

          <div className="flex justify-between gap-4 border-t border-current/10 pt-3 text-sm">
            <span className="opacity-60">
              Total Paid
            </span>

            <b className="text-emerald-500">
              {formatMoney(
                totalFlexiPaidAmount,
              )}
            </b>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-full bg-emerald-500 px-5 py-3 font-bold text-white">
          <span>View Flexi 11 Schemes</span>
          <span className="text-xl">→</span>
        </div>
      </div>
    </button>

    {/* QUICK BUY SUMMARY */}
    <button
      type="button"
      onClick={() =>
        openSchemeSection("QUICK_BUY")
      }
      className={`${clickable} relative overflow-hidden rounded-[30px] border p-6 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        activeSchemeSection ===
          "QUICK_BUY" &&
        showActiveSchemes
          ? "border-blue-500 bg-[#081426] text-white ring-4 ring-blue-500/20"
          : "border-blue-200 bg-gradient-to-br from-[#f5f9ff] to-[#dfeaff] text-[#10213d]"
      }`}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/15" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-xl font-black text-white shadow">
            QB
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              activeSchemeSection ===
                "QUICK_BUY" &&
              showActiveSchemes
                ? "bg-white/10 text-blue-300"
                : "bg-white text-blue-700"
            }`}
          >
            {quickBuyTransactionCount} Transactions
          </span>
        </div>

        <h4 className="mt-5 font-serif text-[27px] font-bold">
          Quick Buy Gold & Silver
        </h4>

        <p
          className={`mt-2 min-h-[48px] text-sm leading-6 ${
            activeSchemeSection ===
              "QUICK_BUY" &&
            showActiveSchemes
              ? "text-white/60"
              : "text-gray-600"
          }`}
        >
          View all instant gold, Kamal Silver and
          Swastik Silver wallet purchases.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/80 p-3 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-500">
              Gold Transactions
            </p>

            <p className="mt-1 text-xl font-black text-[#d49c22]">
              {quickBuyGoldTransactions}
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-3 text-center">
            <p className="text-[10px] font-bold uppercase text-gray-500">
              Silver Transactions
            </p>

            <p className="mt-1 text-xl font-black text-gray-500">
              {quickBuySilverTransactions}
            </p>
          </div>
        </div>

        <div
          className={`mt-4 space-y-3 rounded-[22px] p-4 ${
            activeSchemeSection ===
              "QUICK_BUY" &&
            showActiveSchemes
              ? "bg-white/[0.07]"
              : "bg-white/70"
          }`}
        >
          <div className="flex justify-between gap-4 text-sm">
            <span className="opacity-60">
              Gold Purchased
            </span>

            <b>
              {quickBuyGoldWeight.toFixed(4)} gm
            </b>
          </div>

          <div className="flex justify-between gap-4 text-sm">
            <span className="opacity-60">
              Silver Purchased
            </span>

            <b>
              {quickBuySilverWeight.toFixed(4)} gm
            </b>
          </div>

          <div className="flex justify-between gap-4 border-t border-current/10 pt-3 text-sm">
            <span className="opacity-60">
              Total Invested
            </span>

            <b className="text-blue-500">
              {formatMoney(
                quickBuyTotalAmount,
              )}
            </b>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-full bg-blue-500 px-5 py-3 font-bold text-white">
          <span>View Quick Buy Transactions</span>
          <span className="text-xl">→</span>
        </div>
      </div>
    </button>
  </div>
</div>

{/* SELECTED CATEGORY SCHEME DETAILS */}
<div
  id="customer-scheme-section"
  className="scroll-mt-24"
>
  <div
    className={`mt-8 grid transition-all duration-700 ${
      showActiveSchemes
        ? "grid-rows-[1fr] opacity-100"
        : "grid-rows-[0fr] opacity-0"
    }`}
  >
    <div className="overflow-hidden">
      <div className="overflow-hidden rounded-[32px] border border-[#f5c542]/30 bg-[#111] shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-7 py-6 max-md:px-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[4px] text-[#f5c542]">
              Selected Category
            </p>

            <h3 className="mt-2 font-serif text-[30px] text-white max-md:text-[23px]">
              {activeSectionTitle}
            </h3>

            <p className="mt-1 text-sm text-white/50">
              {activeSectionCount}{" "}
              {activeSchemeSection === "QUICK_BUY"
                ? "transactions"
                : "schemes"}{" "}
              found
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowActiveSchemes(false)
            }
            className={`${clickable} flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white transition hover:bg-[#f5c542] hover:text-black`}
            aria-label="Close scheme category"
          >
            ×
          </button>
        </div>

        <div className="px-7 py-7 max-md:px-4">
          {/* PRE-BOOKING CARDS */}
          {activeSchemeSection ===
            "PRE_BOOKING" && (
            <>
              {preBookingCards.length === 0 ? (
                <div className="rounded-[24px] bg-white/[0.07] p-10 text-center">
                  <p className="text-xl font-bold text-white">
                    No Pre-Booking schemes
                  </p>

                  <p className="mt-2 text-sm text-white/50">
                    You have not started a Pre-Booking
                    or Exchange scheme.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
                  {preBookingCards.map(
                    (
                      item: any,
                      index: number,
                    ) => {
                      const oldExchange =
                        item.schemeSubType ===
                          "OLD_GOLD_EXCHANGE" ||
                        item.schemeSubType ===
                          "OLD_SILVER_EXCHANGE";

                      return (
                        <article
                          key={`pre-${item.schemeId}`}
                          onClick={() =>
                            openSchemeDetails(
                              "PRE_BOOKING",
                              item,
                            )
                          }
                          className="flex cursor-pointer flex-col rounded-[26px] border border-white/10 bg-white/[0.07] p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#f5c542]/70 hover:bg-white/[0.1] hover:shadow-2xl active:scale-[0.99]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-[#f5c542]">
                                {oldExchange
                                  ? "Exchange"
                                  : "Pre-Booking"}{" "}
                                #{index + 1}
                              </p>

                              <h4 className="mt-2 text-[21px] font-bold leading-8">
                                {String(
                                  item.schemeSubType ||
                                    "PRE BOOKING",
                                ).replaceAll(
                                  "_",
                                  " ",
                                )}
                              </h4>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${getStatusClass(
                                item.status,
                              )}`}
                            >
                              {item.status || "UNKNOWN"}
                            </span>
                          </div>

                          <div className="mt-5 flex-1 space-y-3">
                            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                              <span className="text-white/50">
                                Metal
                              </span>

                              <b className="text-right">
                                {item.metalName || "-"}
                              </b>
                            </div>

                            {oldExchange ? (
                              <>
                                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                                  <span className="text-white/50">
                                    Old Item
                                  </span>

                                  <b className="max-w-[55%] text-right">
                                    {item.itemName ||
                                      "Old Jewellery"}
                                  </b>
                                </div>

                                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                                  <span className="text-white/50">
                                    Purity Weight
                                  </span>

                                  <b>
                                    {Number(
                                      item.oldPurityWeight ||
                                        0,
                                    ).toFixed(3)}{" "}
                                    gm
                                  </b>
                                </div>

                                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                                  <span className="text-white/50">
                                    Exchange Value
                                  </span>

                                  <b className="text-[#f5c542]">
                                    {formatMoney(
                                      item.oldExchangeAmount,
                                    )}
                                  </b>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                                  <span className="text-white/50">
                                    Booked Weight
                                  </span>

                                  <b>
                                    {Number(
                                      item.metalWeight ||
                                        0,
                                    ).toFixed(3)}{" "}
                                    gm
                                  </b>
                                </div>

                                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                                  <span className="text-white/50">
                                    Amount
                                  </span>

                                  <b className="text-[#f5c542]">
                                    {formatMoney(
                                      item.amount,
                                    )}
                                  </b>
                                </div>

                                <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                                  <span className="text-white/50">
                                    Booked Rate
                                  </span>

                                  <b>
                                    {formatMoney(
                                      item.ratePerGram,
                                    )}
                                    /gm
                                  </b>
                                </div>
                              </>
                            )}

                            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                              <span className="text-white/50">
                                Hold Progress
                              </span>

                              <b>
                                {getCompletedMonths(
                                  item,
                                )}
                                /
                                {item.holdMonths ||
                                  0}{" "}
                                months
                              </b>
                            </div>

                            <div className="flex justify-between gap-4">
                              <span className="text-white/50">
                                Maturity
                              </span>

                              <b>
                                {formatDate(
                                  item.maturityDate,
                                )}
                              </b>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();

                              openSchemeDetails(
                                "PRE_BOOKING",
                                item,
                              );
                            }}
                            className={`${detailButtonClass} mt-6`}
                          >
                            View Full Details
                          </button>
                        </article>
                      );
                    },
                  )}
                </div>
              )}
            </>
          )}

          {/* FLEXI 11 CARDS */}
          {activeSchemeSection ===
            "FLEXI_11" && (
            <>
              {flexi11Cards.length === 0 ? (
                <div className="rounded-[24px] bg-white/[0.07] p-10 text-center">
                  <p className="text-xl font-bold text-white">
                    No Flexi 11 schemes
                  </p>

                  <p className="mt-2 text-sm text-white/50">
                    You have not started a Flexi 11
                    monthly plan.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
                  {flexi11Cards.map(
                    (
                      item: any,
                      index: number,
                    ) => {
                      const canPay =
                        Boolean(
                          item.showPayButton,
                        ) &&
                        isActiveStatus(
                          item.status,
                        ) &&
                        !isCompletedStatus(
                          item.status,
                        );

                      return (
                        <article
                          key={`flexi-${item.schemeId}`}
                          onClick={() =>
                            openSchemeDetails(
                              "FLEXI_11",
                              item,
                            )
                          }
                          className="flex cursor-pointer flex-col rounded-[26px] border border-white/10 bg-white/[0.07] p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-white/[0.1] hover:shadow-2xl active:scale-[0.99]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-emerald-400">
                                Flexi 11 #{index + 1}
                              </p>

                              <h4 className="mt-2 text-[22px] font-bold">
                                Monthly Gold Savings
                              </h4>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${getStatusClass(
                                item.status,
                              )}`}
                            >
                              {item.status || "UNKNOWN"}
                            </span>
                          </div>

                          <div className="mt-5 flex-1 space-y-3">
                            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                              <span className="text-white/50">
                                Monthly Amount
                              </span>

                              <b>
                                {formatMoney(
                                  item.monthlyAmount,
                                )}
                              </b>
                            </div>

                            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                              <span className="text-white/50">
                                Total Paid
                              </span>

                              <b className="text-emerald-400">
                                {formatMoney(
                                  item.totalPaidAmount,
                                )}
                              </b>
                            </div>

                            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                              <span className="text-white/50">
                                Gold Collected
                              </span>

                              <b>
                                {Number(
                                  item.totalGoldWeight ||
                                    0,
                                ).toFixed(4)}{" "}
                                gm
                              </b>
                            </div>

                            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                              <span className="text-white/50">
                                Paid Months
                              </span>

                              <b>
                                {item.paidMonths || 0}/
                                {item.durationMonths ||
                                  11}
                              </b>
                            </div>

                            <div className="flex justify-between gap-4">
                              <span className="text-white/50">
                                Next Due Date
                              </span>

                              <b
                                className={
                                  canPay
                                    ? "text-orange-400"
                                    : ""
                                }
                              >
                                {formatDate(
                                  item.nextDueDate,
                                )}
                              </b>
                            </div>
                          </div>

                          {canPay && (
                            <div className="mt-5 rounded-2xl border border-orange-400/30 bg-orange-400/10 px-4 py-3">
                              <p className="text-xs font-bold uppercase tracking-[2px] text-orange-300">
                                Payment Available
                              </p>

                              <p className="mt-1 text-sm text-white/60">
                                Your next monthly
                                payment is available.
                              </p>
                            </div>
                          )}

                          <div className="mt-5 grid gap-3">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();

                                openSchemeDetails(
                                  "FLEXI_11",
                                  item,
                                );
                              }}
                              className={detailButtonClass}
                            >
                              View Full Details
                            </button>

                            {canPay && (
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();

                                  handlePayFlexiMonth(
                                    item,
                                  );
                                }}
                                className={`${clickable} flex h-[52px] w-full items-center justify-center rounded-xl bg-[#f5c542] px-4 font-black text-black shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffd85c] hover:shadow-xl active:scale-[0.98]`}
                              >
                                Pay Due Month —{" "}
                                {formatMoney(
                                  item.monthlyAmount,
                                )}
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    },
                  )}
                </div>
              )}
            </>
          )}

          {/* QUICK BUY CARDS */}
          {activeSchemeSection ===
            "QUICK_BUY" && (
            <>
              {quickBuyCards.length === 0 ? (
                <div className="rounded-[24px] bg-white/[0.07] p-10 text-center">
                  <p className="text-xl font-bold text-white">
                    No Quick Buy transactions
                  </p>

                  <p className="mt-2 text-sm text-white/50">
                    You have not made any Quick Buy
                    gold or silver purchases.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
                  {quickBuyCards.map(
                    (
                      item: any,
                      index: number,
                    ) => (
                      <article
                        key={`quick-${
                          item.metalName || index
                        }`}
                        onClick={() =>
                          openSchemeDetails(
                            "QUICK_BUY",
                            item,
                          )
                        }
                        className="flex cursor-pointer flex-col rounded-[26px] border border-white/10 bg-white/[0.07] p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/60 hover:bg-white/[0.1] hover:shadow-2xl active:scale-[0.99]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-blue-400">
                              Quick Buy
                            </p>

                            <h4 className="mt-2 text-[22px] font-bold">
                              {item.metalName ||
                                "Metal"}
                            </h4>
                          </div>

                          <span className="shrink-0 rounded-full border border-blue-300/30 bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-700">
                            COMPLETED
                          </span>
                        </div>

                        <div className="mt-5 flex-1 space-y-3">
                          <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                            <span className="text-white/50">
                              Transactions
                            </span>

                            <b>
                              {item.transactionCount ||
                                0}
                            </b>
                          </div>

                          <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                            <span className="text-white/50">
                              Total Amount
                            </span>

                            <b className="text-blue-400">
                              {formatMoney(
                                item.totalAmount,
                              )}
                            </b>
                          </div>

                          <div className="flex justify-between gap-4">
                            <span className="text-white/50">
                              Total Weight
                            </span>

                            <b>
                              {Number(
                                item.totalWeight ||
                                  0,
                              ).toFixed(4)}{" "}
                              gm
                            </b>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();

                            openSchemeDetails(
                              "QUICK_BUY",
                              item,
                            );
                          }}
                          className={`${detailButtonClass} mt-6`}
                        >
                          View All Transactions
                        </button>
                      </article>
                    ),
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  </div>
</div>


            {dashboardTab === "overview" && (
<div id="overview-section" className="mt-10 grid grid-cols-3 gap-6 max-md:grid-cols-1">
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
                    className="rounded-[30px] bg-[#111] p-7 text-white shadow-xl max-md:p-5"
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
<div id="pre-booking-section" className="mt-10 rounded-[34px] bg-[#111] p-8 text-white shadow-2xl max-md:p-5">
      <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#f5c542]">
      Pre-Booking & Exchange
    </p>

    <div className="flex items-start justify-between max-md:flex-col max-md:gap-4">
      <div>
        <h3 className="mt-2 font-serif text-[38px] max-md:text-[28px]">
          Hold Gold Value & Buy Jewellery Later
        </h3>

        <p className="mt-4 max-w-[950px] text-[17px] leading-8 text-white/70">
          Customer can either pay advance amount or submit old jewellery
          for exchange. After holding for selected months, customer can
          purchase jewellery with eligible VA benefit.
        </p>
      </div>

      {isAdvanceBooking && selectedRate && (
       <div className="text-right max-md:text-left">
          <p className="text-[14px] font-semibold uppercase tracking-[2px] text-[#f5c542]">
            {selectedRateTitle}
          </p>

          <h2 className="mt-1 text-[42px] max-md:text-[32px] font-extrabold leading-none text-[#f5c542]">
            ₹{selectedRate / 10}
          </h2>

          <p className="mt-1 text-[15px] text-white/60">Per Gram</p>
        </div>
      )}
    </div>

    <div className="mt-8 grid grid-cols-2 gap-6 max-md:grid-cols-1">
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
<div id="flexi11-section" className="mt-10 rounded-[34px] bg-[#111] p-8 text-white shadow-2xl max-md:p-5">
                  <div className="flex items-start justify-between max-md:flex-col max-md:gap-4">
  <div>
    <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#f5c542]">
      Flexi 11 Month Plan
    </p>

    <h3 className="mt-2 font-serif text-[38px] max-md:text-[28px]">
      Monthly Gold Savings Tracker
    </h3>

    <p className="mt-3 text-[17px] text-white/70">
      Save every month and accumulate gold value at live market rates.
    </p>
  </div>

  <div className="text-right max-md:text-left">
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

               <div className="mt-8 grid grid-cols-4 gap-5 max-md:grid-cols-2 max-md:gap-3">
  {[1000, 2000, 5000, 10000, 15000, 20000, 25000, 50000].map((value) => (
    <button
      key={value}
      onClick={() => setMonthlyAmount(String(value))}
className={`${clickable} rounded-2xl border border-[#f5c542]/30 px-5 py-6 text-[22px] font-bold max-md:px-3 max-md:py-4 max-md:text-[16px] ${        monthlyAmount === String(value)
          ? "bg-[#f5c542] text-black shadow-lg"
          : "bg-[#fff8e6] text-black hover:bg-[#fde7a1]"
      }`}
    >
      ₹{value.toLocaleString("en-IN")}
    </button>
  ))}
</div>

                <div className="mt-8 grid grid-cols-3 gap-5 max-md:grid-cols-1 max-md:gap-3">
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
<div className="mt-10 w-full overflow-x-auto rounded-2xl border border-[#ead7ae]">
  <table className="w-full min-w-[280px] border-collapse text-center text-[9px] leading-tight md:min-w-full md:text-[13px]">
<thead className="bg-[#f5c542] text-black">
    <tr>
   <th className="whitespace-nowrap px-1.5 py-2 md:px-3 md:py-3">Month</th>
<th className="whitespace-nowrap px-1.5 py-2 md:px-3 md:py-3">Gold Rate</th>
<th className="whitespace-nowrap px-1.5 py-2 md:px-3 md:py-3">Amount</th>
<th className="whitespace-nowrap px-1.5 py-2 md:px-3 md:py-3">Gold Grams</th>
<th className="whitespace-nowrap px-1.5 py-2 md:px-3 md:py-3">Due Date</th>
<th className="whitespace-nowrap px-1.5 py-2 md:px-3 md:py-3">Status</th>
    </tr>
  </thead>

  <tbody className="bg-black/20">
  {Array.from({ length: 11 }).map((_, index) => {
    const isFirstMonth = index === 0;
const grams = Number(monthlyAmount || 0) / (goldRate / 10);
    return (
      <tr key={index} className="border-b border-white/10">
        <td className="whitespace-nowrap px-1.5 py-2 font-bold md:px-3 md:py-3">{index + 1}</td>
        <td className="whitespace-nowrap px-1.5 py-2 md:px-3 md:py-3">
          {isFirstMonth ? `₹${goldRate / 10}/gm` : "Upcoming"}
        </td>
            <td className="whitespace-nowrap px-1.5 py-2 md:px-3 md:py-3">
  ₹{Number(monthlyAmount).toLocaleString("en-IN")}
</td>
        <td className="whitespace-nowrap px-1.5 py-2 md:px-3 md:py-3">
          {isFirstMonth ? `${grams.toFixed(4)} gm` : "Upcoming"}
        </td>
         <td className="whitespace-nowrap px-1.5 py-2 md:px-3 md:py-3">
          {new Date(
            new Date().setMonth(new Date().getMonth() + index)
          ).toLocaleDateString("en-IN")}
        </td>
        <td className="whitespace-nowrap px-1.5 py-2 md:px-3 md:py-3">
       <span
  className={`whitespace-nowrap rounded-full px-1.5 py-0.5 text-[8px] font-bold md:px-3 md:text-[12px] ${
    isFirstMonth
      ? "bg-yellow-200 text-yellow-800"
      : "bg-gray-100 text-gray-500"
  }`}
>
  {isFirstMonth ? "Pay" : "Soon"}
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
  Pay First Month & Activate 
</button>
              </div>
            )}

            {dashboardTab === "quickBuy" && (
<div id="quick-buy-section" className="mt-10 rounded-[34px] bg-[#070707] p-8 text-white shadow-2xl max-md:p-5">
                  <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#f5c542]">
                  Quick Buy Gold & Silver
                </p>

                <h3 className="mt-2 font-serif text-[38px] max-md:text-[28px]">
                  Buy Metal Instantly
                </h3>

                <div className="mt-8 grid grid-cols-3 gap-3">
  <button
    onClick={() => setQuickMetal("Gold")}
className={`${clickable} rounded-2xl px-2 py-4 text-[13px] md:px-6 md:py-5 md:text-[22px] font-bold ${
      quickMetal === "Gold"
        ? "bg-[#f5c542] text-black"
        : "bg-white/10 text-white"
    }`}
  >
Gold ₹{((rates?.gold24Rate || 0) / 10).toFixed(0)}/gm
  </button>

  <button
    onClick={() => setQuickMetal("Kamal Silver")}
    className={`${clickable} rounded-2xl px-2 py-4 text-[13px] md:px-6 md:py-5 md:text-[22px] font-bold ${
      quickMetal === "Kamal Silver"
        ? "bg-[#f5c542] text-black"
        : "bg-white/10 text-white"
    }`}
  >
Kamal Silver ₹{((rates?.silver999Rate || 0) / 10).toFixed(2)}/gm
  </button>

  <button
    onClick={() => setQuickMetal("Swastik Silver")}
    className={`${clickable} rounded-2xl px-2 py-4 text-[13px] md:px-6 md:py-5 md:text-[22px] font-bold ${
      quickMetal === "Swastik Silver"
        ? "bg-[#f5c542] text-black"
        : "bg-white/10 text-white"
    }`}
  >
Swastik Silver ₹{((rates?.silver995Rate || 0) / 10).toFixed(2)}/gm
  </button>
</div>

               <div className="mt-8 grid grid-cols-[1fr_360px] gap-6 max-md:grid-cols-1">
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

                    <div className="mt-5 grid grid-cols-4 gap-3 max-md:grid-cols-2">
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
                   <p className="mt-2 text-white/60 max-md:text-[14px]">
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
<div className="relative max-h-[90vh] w-full max-w-[1150px] overflow-y-auto rounded-[34px] bg-white p-8 shadow-2xl max-md:rounded-[28px] max-md:p-4">
          <button
        onClick={closeSchemeDetails}
className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black text-2xl font-bold text-white max-md:h-10 max-md:w-10"
      >
        ×
      </button>

      {selectedSchemeType === "PRE_BOOKING" && (
        <>
          <p className="text-[13px] font-bold uppercase tracking-[4px] text-[#b98213]">
            Pre-Booking Scheme Details
          </p>

          <h2 className="mt-2 font-serif text-[38px]  max-md:text-[28px]">
            {selectedScheme.schemeSubType?.replaceAll("_", " ")}
          </h2>

          <div className="mt-8 grid grid-cols-4 gap-5 max-md:grid-cols-2 max-md:gap-3">
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
              <div key={title} className="rounded-2xl bg-[#fbf7ef] p-5 max-md:p-4">
               <p className="text-gray-500 max-md:text-[13px]">{title}</p>
<h4 className="mt-2 break-words text-[20px] font-bold text-[#b98213] max-md:text-[16px]">
                  {value}
                </h4>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] bg-black p-6 text-white max-md:p-5">
            <h3 className="text-[24px] font-bold text-[#f5c542]">
              Timeline
            </h3>

           <div className="mt-5 grid grid-cols-3 gap-5 max-md:gap-3"> 
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

          <h2 className="mt-2 font-serif text-[38px]  max-md:text-[28px]">
            Monthly Gold Savings Tracker
          </h2>

          <div className="mt-8 grid grid-cols-4 gap-5 max-md:grid-cols-2 max-md:gap-3">
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
              <div key={title} className="rounded-2xl bg-[#fbf7ef] p-5 max-md:p-4">
                <p className="text-gray-500">{title}</p>
                <h4 className="mt-2 text-[20px] font-bold text-[#b98213]">
                  {value}
                </h4>
              </div>
            ))}
          </div>

<div className="mt-10 w-full overflow-x-auto rounded-2xl border border-[#ead7ae]">
  <table className="min-w-[350px] border-collapse text-center text-[10px] leading-tight md:min-w-full md:text-[13px]">
  <thead className="bg-[#f5c542] text-black">
    <tr>
     <th className="whitespace-nowrap px-2 py-3">Month</th>
<th className="whitespace-nowrap px-2 py-3">Due Date</th>
<th className="whitespace-nowrap px-2 py-3">Paid Date</th>
<th className="whitespace-nowrap px-2 py-3">Amount</th>
<th className="whitespace-nowrap px-2 py-3">Gold Rate</th>
<th className="whitespace-nowrap px-2 py-3">Gold Grams</th>
<th className="whitespace-nowrap px-2 py-3">Type</th>
<th className="whitespace-nowrap px-2 py-3">Status</th>
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
            <td className="px-2 py-3 font-bold">{monthNumber}</td>

            <td className="p-2 md:p-4">
              {dueDate.toLocaleDateString("en-IN")}
            </td>

            <td className="p-2 md:p-4">
              {payment ? formatDate(payment.paymentDate) : "-"}
            </td>

            <td className="p-2 md:p-4">
              {payment ? formatMoney(payment.paidAmount) : "-"}
            </td>

            <td className="p-2 md:p-4">
              {payment ? `₹${payment.ratePerGram}/gm` : "-"}
            </td>

            <td className="p-2 md:p-4">
              {payment
                ? `${Number(payment.metalWeight || 0).toFixed(4)} gm`
                : "-"}
            </td>

            <td className="p-2 md:p-4">
              {payment?.paymentMethod || "-"}
            </td>

            <td className="p-2 md:p-4">
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-bold md:px-4 md:text-sm ${
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

          <h2 className="mt-2 font-serif text-[38px]  max-md:text-[28px]">
            {selectedScheme.metalName} Purchase History
          </h2>

        <div className="mt-8 grid grid-cols-3 gap-5 max-md:grid-cols-2 max-md:gap-3">
  <div className="rounded-2xl bg-[#fbf7ef] p-5 max-md:p-4">
    <p className="text-gray-500">Total Transactions</p>
    <h4 className="mt-2 text-[20px] font-bold text-[#b98213] max-md:text-[20px]">
      {selectedScheme.transactionCount}
    </h4>
  </div>

  <div className="rounded-2xl bg-[#fbf7ef] p-5 max-md:p-4">
    <p className="text-gray-500">Total Amount</p>
    <h4 className="mt-2 text-[20px] font-bold text-[#b98213] max-md:text-[20px]">
      {formatMoney(selectedScheme.totalAmount)}
    </h4>
  </div>

  <div className="flex flex-col items-center justify-center rounded-2xl bg-[#111] p-5 text-center text-white max-md:col-span-2 max-md:p-2">
  <p className="text-white/60">Total Weight</p>
  <h4 className="mt-2 text-[20px] font-bold text-[#f5c542] max-md:text-[22px]">
    {Number(selectedScheme.totalWeight || 0).toFixed(4)} gm
  </h4>
</div>
</div>

<div className="mt-8 w-full overflow-x-auto rounded-2xl border border-[#ead7ae]">
  <table className="w-full min-w-[300px] border-collapse text-center text-[10px] leading-tight md:min-w-full md:text-[13px]">
         <thead className="bg-[#f5c542] text-black">
                <tr>
                 <th className="whitespace-nowrap px-2 py-3">Date</th>
<th className="whitespace-nowrap px-2 py-3">Metal</th>
<th className="whitespace-nowrap px-2 py-3">Amount</th>
<th className="whitespace-nowrap px-2 py-3">Rate</th>
<th className="whitespace-nowrap px-2 py-3">Weight</th>
<th className="whitespace-nowrap px-2 py-3">Type</th>
<th className="whitespace-nowrap px-2 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {selectedScheme.transactions?.map((item: any) => {
                  const payment = item.payments?.[0];

                  return (
                    <tr key={item.schemeId} className="border-b">
                      <td className="whitespace-nowrap px-2 py-3 md:px-4">{formatDate(item.createdAt)}</td>
                     <td className="whitespace-nowrap px-2 py-3 md:px-4 font-bold">{item.metalName}</td>
                      <td className="whitespace-nowrap px-2 py-3 md:px-4">{formatMoney(item.amount)}</td>
                      <td className="whitespace-nowrap px-2 py-3 md:px-4">₹{item.ratePerGram || 0}/gm</td>
                      <td className="whitespace-nowrap px-2 py-3 md:px-4">
                        {Number(item.metalWeight || 0).toFixed(4)} gm
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 md:px-4">{payment?.paymentMethod || "-"}</td>
                     <td className="whitespace-nowrap px-2 py-3 md:px-4">
<span className="whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold md:text-[12px]">
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

