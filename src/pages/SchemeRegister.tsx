import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Smartphone,
  Wallet,
  UserPlus,
  ArrowRight,
  Gem,
  Upload,
  Lock,
  ShieldCheck,
  Coins,
} from "lucide-react";

const SchemeRegister = () => {
  const [params] = useSearchParams();
  const scheme = params.get("scheme") || "scheme";

  const [step, setStep] = useState<
    | "login"
    | "otp"
    | "register"
    | "wallet"
    | "forgotMobile"
    | "forgotOtp"
    | "resetPassword"
  >("login");

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [dashboardTab, setDashboardTab] = useState<
    "overview" | "preBooking" | "flexi11" | "quickBuy"
  >("overview");

  const [preBookingType, setPreBookingType] = useState("Advance Booking");
  const [preBookingAmount, setPreBookingAmount] = useState("");
  const [oldGoldWeight, setOldGoldWeight] = useState("");
  const [holdMonths, setHoldMonths] = useState("5");

  const [monthlyAmount, setMonthlyAmount] = useState("5000");

  const [quickMetal, setQuickMetal] = useState<"Gold" | "Silver">("Gold");
  const [quickAmount, setQuickAmount] = useState("1000");

  const goldRate = 10000;
  const silverRate = 120;

  const quickWeight =
    quickMetal === "Gold"
      ? Number(quickAmount || 0) / goldRate
      : Number(quickAmount || 0) / silverRate;

  const schemeTitle = scheme
    .replace("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const handleLogin = () => {
    if (mobile.length !== 10) return alert("Enter valid 10 digit mobile number");
    if (!password) return alert("Enter password");
    setStep("wallet");
  };

  const handleRegisterSubmit = () => {
    if (newPassword.length < 6)
      return alert("Password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return alert("Password and confirm password not matching");
    setStep("otp");
  };

  const handleOtpVerify = () => {
    if (otp.length !== 6) return alert("Enter valid 6 digit OTP");
    setStep("wallet");
  };

  const handleForgotMobile = () => {
    if (mobile.length !== 10) return alert("Enter valid 10 digit mobile number");
    setStep("forgotOtp");
  };

  const handleForgotOtp = () => {
    if (otp.length !== 6) return alert("Enter valid 6 digit OTP");
    setStep("resetPassword");
  };

  const handleResetPassword = () => {
    if (newPassword.length < 6)
      return alert("Password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return alert("Password and confirm password not matching");

    alert("Password reset successful");
    setPassword("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setStep("login");
  };

  const renderLeftCard = () => (
    <div className="rounded-[34px] bg-gradient-to-br from-[#120902] via-[#251505] to-black p-8 text-white shadow-2xl">
      <p className="text-[13px] font-bold uppercase tracking-[4px] text-[#f5c542]">
        Hambire Jewellery
      </p>

      <h1 className="mt-4 font-serif text-[42px] leading-tight">
        Join {schemeTitle}
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
                    className="text-[15px] font-bold text-[#b98213] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  onClick={handleLogin}
                  className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white"
                >
                  Login & Open Wallet <ArrowRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setStep("register")}
                  className="mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-[#b98213] px-8 py-4 text-[17px] font-bold text-[#b98213]"
                >
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
                    "Full Name",
                    "Mobile Number",
                    "Email",
                    "Village / City",
                    "Full Address",
                    "Pincode",
                    "Aadhaar Number",
                    "PAN Number",
                  ].map((label) => (
                    <div key={label}>
                      <label className="mb-2 block font-semibold text-gray-700">
                        {label}
                      </label>
                      <input className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b98213]" />
                    </div>
                  ))}

                  <div>
                    <label className="mb-2 block font-semibold text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b98213]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#b98213]"
                    />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-6">
                  {["Address Proof", "ID Document"].map((label) => (
                    <div key={label}>
                      <label className="mb-2 block font-semibold text-gray-700">
                        {label}
                      </label>
                      <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 px-4 py-4">
                        <Upload className="h-5 w-5 text-[#b98213]" />
                        <input type="file" className="w-full text-sm" />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleRegisterSubmit}
                  className="mt-10 w-full rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white"
                >
                  Submit & Send OTP
                </button>

                <button
                  onClick={() => setStep("login")}
                  className="mt-4 w-full rounded-full border border-gray-300 px-8 py-4 text-[16px] font-bold text-gray-700"
                >
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
                  className="mt-10 w-full rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white"
                >
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

                <button
                  onClick={handleForgotMobile}
                  className="mt-10 w-full rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white"
                >
                  Send OTP
                </button>

                <button
                  onClick={() => setStep("login")}
                  className="mt-4 w-full rounded-full border border-gray-300 px-8 py-4 text-[16px] font-bold text-gray-700"
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
                  className="mt-10 w-full rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white"
                >
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
                  className="mt-10 w-full rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white"
                >
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
                onClick={() => setStep("login")}
                className="rounded-full border border-gray-300 px-7 py-3 font-bold text-gray-700"
              >
                Logout
              </button>
            </div>

            <div className="mt-8 grid grid-cols-4 gap-6">
              {[
                ["Active Schemes", "0"],
                ["Gold Wallet", "0.000 gm"],
                ["Silver Wallet", "0.000 gm"],
                ["Total Savings", "₹0"],
              ].map(([title, value]) => (
                <div
                  key={title}
                  className="rounded-[24px] bg-[#fbf7ef] p-6 text-center shadow"
                >
                  <p className="text-gray-600">{title}</p>
                  <h3 className="mt-3 text-[28px] font-bold text-[#b98213]">
                    {value}
                  </h3>
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
                  onClick={() => setDashboardTab(key as any)}
                  className={`rounded-full px-6 py-3 font-bold ${
                    dashboardTab === key
                      ? "bg-black text-white"
                      : "bg-[#fbf7ef] text-black"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {dashboardTab === "overview" && (
              <div className="mt-10 grid grid-cols-3 gap-6">
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
                      onClick={() => setDashboardTab(item.tab as any)}
                      className="mt-7 w-full rounded-full bg-[#f5c542] px-6 py-3 font-bold text-black"
                    >
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {dashboardTab === "preBooking" && (
              <div className="mt-10 rounded-[34px] bg-[#111] p-8 text-white shadow-2xl">
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#f5c542]">
                  Pre-Booking & Exchange
                </p>

                <h3 className="mt-2 font-serif text-[38px]">
                  Hold Gold Value & Buy Jewellery Later
                </h3>

                <p className="mt-4 max-w-[950px] text-[17px] leading-8 text-white/70">
                  Customer can either pay advance amount or submit old jewellery
                  for exchange. After holding for selected months, customer can
                  purchase jewellery with eligible VA benefit.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-white/70">
                      Scheme Type
                    </label>
                    <select
                      value={preBookingType}
                      onChange={(e) => setPreBookingType(e.target.value)}
                      className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-4 outline-none"
                    >
                      <option>Advance Booking</option>
                      <option>Old Gold Exchange</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-white/70">
                      Hold Period
                    </label>
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
                      <option value="11">
                        11 Months - Full Eligible VA Benefit
                      </option>
                    </select>
                  </div>

                  {preBookingType === "Advance Booking" ? (
                    <input
                      value={preBookingAmount}
                      onChange={(e) =>
                        setPreBookingAmount(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Enter advance amount"
                      className="rounded-xl border border-white/20 bg-black/40 px-4 py-4 outline-none"
                    />
                  ) : (
                    <input
                      value={oldGoldWeight}
                      onChange={(e) => setOldGoldWeight(e.target.value)}
                      placeholder="Enter old gold weight in grams"
                      className="rounded-xl border border-white/20 bg-black/40 px-4 py-4 outline-none"
                    />
                  )}

                  <input
                    placeholder="Expected Jewellery: Bangles / Chain / Necklace"
                    className="rounded-xl border border-white/20 bg-black/40 px-4 py-4 outline-none"
                  />
                </div>

                <div className="mt-8 grid grid-cols-4 gap-4">
                  {[
                    ["Type", preBookingType],
                    ["Hold Period", `${holdMonths} Months`],
                    [
                      "VA Benefit",
                      holdMonths === "11" ? "Full Eligible" : `${holdMonths}%`,
                    ],
                    ["Status", "Ready to Activate"],
                  ].map(([title, value]) => (
                    <div
                      key={title}
                      className="rounded-2xl bg-white/10 p-5"
                    >
                      <p className="text-white/60">{title}</p>
                      <h5 className="mt-2 font-bold text-[#f5c542]">
                        {value}
                      </h5>
                    </div>
                  ))}
                </div>

                <button className="mt-8 w-full rounded-full bg-[#f5c542] px-8 py-4 text-[17px] font-bold text-black">
                  Pay / Submit Old Gold & Activate Pre-Booking
                </button>
              </div>
            )}

            {dashboardTab === "flexi11" && (
              <div className="mt-10 rounded-[34px] bg-white p-8 shadow-2xl">
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                  Flexi 11 Month Plan
                </p>

                <h3 className="mt-2 font-serif text-[38px]">
                  Monthly Gold Savings Tracker
                </h3>

                <div className="mt-8 grid grid-cols-4 gap-5">
                  {[1000, 2000, 5000, 10000].map((value) => (
                    <button
                      key={value}
                      onClick={() => setMonthlyAmount(String(value))}
                      className={`rounded-2xl px-5 py-5 text-[22px] font-bold shadow ${
                        monthlyAmount === String(value)
                          ? "bg-black text-[#f5c542]"
                          : "bg-[#fbf7ef] text-black"
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
                      className="rounded-[24px] bg-[#fbf7ef] p-6"
                    >
                      <p className="text-gray-600">{title}</p>
                      <h4 className="mt-2 text-[28px] font-bold text-[#b98213]">
                        {value}
                      </h4>
                    </div>
                  ))}
                </div>

                <div className="mt-10 overflow-hidden rounded-2xl border border-[#ead7ae]">
                  <table className="w-full border-collapse text-center">
                    <thead className="bg-[#5d1f32] text-white">
                      <tr>
                        <th className="p-4">Month</th>
                        <th className="p-4">Due Date</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Gold Rate</th>
                        <th className="p-4">Gold Grams</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {Array.from({ length: 11 }).map((_, index) => {
                        const grams = Number(monthlyAmount) / goldRate;

                        return (
                          <tr
                            key={index}
                            className="border-b border-[#ead7ae]"
                          >
                            <td className="p-4 font-bold">{index + 1}</td>
                            <td className="p-4">
                              {new Date(
                                new Date().setMonth(
                                  new Date().getMonth() + index
                                )
                              ).toLocaleDateString("en-IN")}
                            </td>
                            <td className="p-4">
                              ₹{Number(monthlyAmount).toLocaleString("en-IN")}
                            </td>
                            <td className="p-4">₹{goldRate}/gm</td>
                            <td className="p-4">{grams.toFixed(4)} gm</td>
                            <td className="p-4">
                              <span
                                className={`rounded-full px-4 py-1 text-sm font-bold ${
                                  index === 0
                                    ? "bg-yellow-200 text-yellow-800"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {index === 0 ? "Pay Now" : "Upcoming"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <button className="mt-8 w-full rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white">
                  Pay First Month & Activate Flexi 11
                </button>
              </div>
            )}

            {dashboardTab === "quickBuy" && (
              <div className="mt-10 rounded-[34px] bg-[#070707] p-8 text-white shadow-2xl">
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#f5c542]">
                  Quick Buy Gold & Silver
                </p>

                <h3 className="mt-2 font-serif text-[38px]">
                  Buy Metal Instantly
                </h3>

                <div className="mt-8 grid grid-cols-2 gap-6">
                  <button
                    onClick={() => setQuickMetal("Gold")}
                    className={`rounded-2xl px-6 py-5 text-[22px] font-bold ${
                      quickMetal === "Gold"
                        ? "bg-[#f5c542] text-black"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    Gold ₹{goldRate}/gm
                  </button>

                  <button
                    onClick={() => setQuickMetal("Silver")}
                    className={`rounded-2xl px-6 py-5 text-[22px] font-bold ${
                      quickMetal === "Silver"
                        ? "bg-[#f5c542] text-black"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    Silver ₹{silverRate}/gm
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
                          className="rounded-xl bg-white/10 py-3 font-bold hover:bg-[#f5c542] hover:text-black"
                        >
                          ₹{value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-white/10 p-6 text-center">
                    <p className="text-white/60">Metal Weight</p>
                    <h4 className="mt-3 text-[42px] font-bold text-[#f5c542]">
                      {quickWeight.toFixed(4)} gm
                    </h4>
                    <p className="mt-2 text-white/60">
                      {quickMetal} will be saved
                    </p>
                  </div>
                </div>

                <button className="mt-8 w-full rounded-full bg-[#f5c542] px-8 py-4 text-[17px] font-bold text-black">
                  Pay Now & Save {quickMetal} in Wallet
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeRegister;