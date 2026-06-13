import { useEffect, useRef, useState } from "react";
import {
  Upload,
  User,
  Phone,
  Mail,
  MapPin,
  ShieldAlert,
  ArrowRight,
  UserPlus,
  Lock,
} from "lucide-react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../api/firebase";
import {
  getSchemeCustomerProfile,
  registerSchemeCustomer,
  loginSchemeCustomer,
  checkSchemeMobile,
  verifyAadhaarOcr,
  verifyCustomerAadhaar,
} from "../api/schemeApi";

const SchemeProfile = () => {
  const clickable = "clickable-ui";

  const [step, setStep] = useState<"login" | "register" | "otp" | "profile">(
    "login"
  );

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [sendingOtp, setSendingOtp] = useState(false);
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);

  const [profileAadhaarNumber, setProfileAadhaarNumber] = useState("");
  const [profileAadhaarFile, setProfileAadhaarFile] = useState<File | null>(
    null
  );

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

  const customer = JSON.parse(localStorage.getItem("schemeCustomer") || "{}");
  const customerId = customer?.customerId;

  const logoutCustomer = () => {
    localStorage.removeItem("schemeCustomer");
    localStorage.removeItem("schemeLoginTime");
      localStorage.removeItem("schemeNotificationError");

      window.location.href = "/";
      window.dispatchEvent(new Event("scheme-notifications-refresh"));
    setProfile(null);
    setStep("login");
  };

  const fetchProfile = async (id?: number) => {
    const finalCustomerId = id || customerId;
    if (!finalCustomerId) return;

    try {
      setLoading(true);
      const data = await getSchemeCustomerProfile(finalCustomerId);
      setProfile(data);
      setProfileAadhaarNumber(data?.aadhaarNumber || "");
      setStep("profile");
    } catch (error) {
      console.error(error);
      alert("Failed to load profile");
      logoutCustomer();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedCustomer = JSON.parse(
      localStorage.getItem("schemeCustomer") || "{}"
    );
    const loginTime = Number(localStorage.getItem("schemeLoginTime") || 0);

    if (!savedCustomer?.customerId || !loginTime) return;

    const sixHours = 6 * 60 * 60 * 1000;

    if (Date.now() - loginTime > sixHours) {
      logoutCustomer();
      return;
    }

    fetchProfile(savedCustomer.customerId);
  }, []);

  useEffect(() => {
    setIsRecaptchaVerified(false);
    recaptchaRef.current = null;
  }, [step]);

  useEffect(() => {
    if (step !== "register") return;

    const timer = setTimeout(() => {
      const container = document.getElementById("recaptcha-container");

      if (!container || recaptchaRef.current) return;

      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
          callback: () => setIsRecaptchaVerified(true),
          "expired-callback": () => setIsRecaptchaVerified(false),
        }
      );

      recaptchaRef.current.render();
    }, 500);

    return () => clearTimeout(timer);
  }, [step]);

  const handleLogin = async () => {
    if (mobile.length !== 10) {
      return alert("Enter valid 10 digit mobile number");
    }

    if (!password.trim()) {
      return alert("Enter password");
    }

    try {
      const customer = await loginSchemeCustomer(mobile, password);

      localStorage.setItem("schemeCustomer", JSON.stringify(customer));
      localStorage.setItem("schemeLoginTime", Date.now().toString());

      await fetchProfile(customer.customerId);
    } catch (error: any) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Invalid mobile number or password"
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

  const handleRegisterSubmit = async () => {
    if (sendingOtp || verifyingAadhaar) return;

    if (!registerData.name.trim()) return alert("Full Name is required");

    if (registerData.phoneNumber.length !== 10) {
      return alert("Enter valid 10 digit mobile number");
    }

    if (!registerData.village.trim()) {
      return alert("Village / City is required");
    }

    if (!registerData.fullAddress.trim()) {
      return alert("Full Address is required");
    }

    if (registerData.pincode.length !== 6) {
      return alert("Enter valid 6 digit pincode");
    }

    if (!registerData.password.trim()) {
      return alert("Password is required");
    }

    if (registerData.password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    if (registerData.password !== confirmPassword) {
      return alert("Password and confirm password not matching");
    }

    const aadhaarEntered = registerData.aadhaarNumber.trim();
    const aadhaarFileSelected = aadhaarFile;

    if (aadhaarEntered || aadhaarFileSelected) {
      if (registerData.aadhaarNumber.length !== 12) {
        return alert("Enter valid 12 digit Aadhaar number");
      }

      if (!aadhaarFile) {
        return alert("Please upload Aadhaar document");
      }

      try {
        setVerifyingAadhaar(true);

        const verify = await verifyAadhaarOcr({
          file: aadhaarFile,
          name: registerData.name,
          aadhaarNumber: registerData.aadhaarNumber,
        });

        if (!verify.matched) {
          alert(verify.message || "Aadhaar verification failed");
          return;
        }
      } catch (error) {
        console.error(error);
        alert("Aadhaar verification failed. Please upload clear Aadhaar image.");
        return;
      } finally {
        setVerifyingAadhaar(false);
      }
    }

    try {
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

  const handleOtpVerify = async () => {
    if (otp.length !== 6) {
      return alert("Enter valid 6 digit OTP");
    }

    if (!confirmationResult) {
      return alert("Please send OTP first");
    }

    try {
      await confirmationResult.confirm(otp);

      const customer = await registerSchemeCustomer(registerData);

      localStorage.setItem("schemeCustomer", JSON.stringify(customer));
      localStorage.setItem("schemeLoginTime", Date.now().toString());

      alert("Registration successful");

      setOtp("");
      setConfirmationResult(null);

      await fetchProfile(customer.customerId);
    } catch (error: any) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Registration failed"
      );
    }
  };

  const handleProfileAadhaarVerify = async () => {
    if (!customerId) return alert("Please login again");

    if (profileAadhaarNumber.length !== 12) {
      return alert("Enter valid 12 digit Aadhaar number");
    }

    if (!profileAadhaarFile) {
      return alert("Please upload Aadhaar document");
    }

    try {
      setVerifyingAadhaar(true);

      const res = await verifyCustomerAadhaar(
        customerId,
        profileAadhaarNumber,
        profileAadhaarFile
      );

      if (!res.verified) {
        alert(res.message || "Aadhaar verification failed");
        return;
      }

      alert("Aadhaar verified successfully");
      await fetchProfile(customerId);
    } catch (error: any) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Aadhaar verification failed"
      );
    } finally {
      setVerifyingAadhaar(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf7ef] p-10 text-center text-[24px] font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf7ef] px-8 py-14">
      {step !== "profile" ? (
        <div className="mx-auto grid max-w-[1450px] grid-cols-[420px_1fr] gap-10">
          <div className="rounded-[34px] bg-gradient-to-br from-[#120902] via-[#251505] to-black p-8 text-white shadow-2xl">
            <p className="text-[13px] font-bold uppercase tracking-[4px] text-[#f5c542]">
              Hambire Jewellery
            </p>

            <h1 className="mt-4 font-serif text-[42px] leading-tight">
              Customer Account
            </h1>

            <p className="mt-5 text-[17px] leading-8 text-white/70">
              Login or register to access your profile, wallet, schemes and
              jewellery benefits.
            </p>

            <div className="mt-10 space-y-5">
              {[
                ["Mobile Login", <Phone />],
                ["Password Protected", <Lock />],
                ["Profile Access", <User />],
                ["Aadhaar Verification for Schemes", <ShieldAlert />],
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

          <div className="rounded-[34px] bg-white p-10 shadow-2xl">
            {step === "login" && (
              <>
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                  Customer Login
                </p>

                <h2 className="mt-3 font-serif text-[44px]">
                  Login to Your Account
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

                <button
                  onClick={handleLogin}
                  className={`${clickable} mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white`}
                >
                  Login <ArrowRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setStep("register")}
                  className={`${clickable} mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-[#b98213] px-8 py-4 text-[17px] font-bold text-[#b98213]`}
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
                  Create Customer Account
                </h2>

                <div className="mt-10 grid grid-cols-2 gap-6">
                  {[
                    ["Full Name", "name"],
                    ["Mobile Number", "phoneNumber"],
                    ["Email", "emailId"],
                    ["Village / City", "village"],
                    ["Full Address", "fullAddress"],
                    ["Pincode", "pincode"],
                    ["Aadhaar Number Optional", "aadhaarNumber"],
                  ].map(([label, field]) => (
                    <div key={field}>
                      <label className="mb-2 block font-semibold text-gray-700">
                        {label}
                        {!["emailId", "aadhaarNumber"].includes(field) && (
                          <span className="text-red-600"> *</span>
                        )}
                      </label>

                      <input
                        value={
                          registerData[field as keyof typeof registerData]
                        }
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

                          handleRegisterChange(
                            field as keyof typeof registerData,
                            value
                          );
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
                    Aadhaar Document Optional
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 px-4 py-4">
                    <Upload className="h-5 w-5 text-[#b98213]" />

                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-sm"
                      onChange={(e) =>
                        setAadhaarFile(e.target.files?.[0] || null)
                      }
                    />
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Optional now. But Aadhaar verification is required before
                    activating any scheme.
                  </p>
                </div>

                <div
                  id="recaptcha-container"
                  className="mt-6 flex justify-center"
                ></div>

                <button
                  disabled={
                    sendingOtp || verifyingAadhaar || !isRecaptchaVerified
                  }
                  onClick={handleRegisterSubmit}
                  className={`mt-10 w-full rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white ${
                    isRecaptchaVerified
                      ? clickable
                      : "cursor-not-allowed opacity-60"
                  }`}
                >
                  {verifyingAadhaar
                    ? "Verifying Aadhaar..."
                    : sendingOtp
                    ? "Sending OTP..."
                    : "Submit & Send OTP"}
                </button>

                <button
                  onClick={() => setStep("login")}
                  className={`${clickable} mt-4 w-full rounded-full border border-gray-300 px-8 py-4 text-[16px] font-bold text-gray-700`}
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
                  className={`${clickable} mt-10 w-full rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white`}
                >
                  Verify & Open Profile
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-[1250px] rounded-[36px] bg-white p-10 shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                Hambire Jewellery
              </p>

              <h1 className="mt-3 font-serif text-[48px]">
                Customer Account Profile
              </h1>
            </div>

            <button
              onClick={logoutCustomer}
              className={`${clickable} rounded-full border border-gray-300 px-7 py-3 font-bold text-gray-700`}
            >
              Logout
            </button>
          </div>

          {!profile?.aadhaarVerified && (
            <div className="mt-8 flex gap-4 rounded-[24px] border border-yellow-300 bg-yellow-50 p-6 text-yellow-800">
              <ShieldAlert className="h-8 w-8" />
              <div>
                <h3 className="text-[20px] font-bold">
                  Scheme Access Verification Required
                </h3>
                <p className="mt-1 text-[16px]">
                  To activate Hambire Jewellery schemes, please verify your
                  profile by uploading Aadhaar document. Aadhaar number and
                  your name must match the document.
                </p>
              </div>
            </div>
          )}

          {profile?.aadhaarVerified && (
            <div className="mt-8 rounded-[24px] border border-green-300 bg-green-50 p-6 text-green-700">
              <h3 className="text-[20px] font-bold">
                Aadhaar Verified Successfully
              </h3>
              <p className="mt-1 text-[16px]">
                You can now activate Hambire Jewellery schemes.
              </p>
            </div>
          )}

          <div className="mt-10 grid grid-cols-2 gap-7">
            {[
              ["Name", profile?.name, <User />],
              ["Mobile", profile?.phoneNumber, <Phone />],
              ["Email", profile?.emailId || "-", <Mail />],
              ["Village", profile?.village || "-", <MapPin />],
              ["Address", profile?.fullAddress || "-", <MapPin />],
              ["Pincode", profile?.pincode || "-", <MapPin />],
              [
                "Aadhaar Number",
                profile?.aadhaarNumber || "Not Added",
                <User />,
              ],
              [
                "Aadhaar Status",
                profile?.aadhaarVerified ? "Verified" : "Not Verified",
                <ShieldAlert />,
              ],
            ].map(([label, value, icon]) => (
              <div
                key={String(label)}
                className="rounded-[24px] bg-[#fbf7ef] p-6 shadow"
              >
                <div className="flex items-center gap-3 text-[#b98213]">
                  {icon}
                  <p className="font-bold">{label}</p>
                </div>

                <h3 className="mt-3 text-[22px] font-bold text-black">
                  {String(value)}
                </h3>
              </div>
            ))}
          </div>

          {!profile?.aadhaarVerified && (
            <div className="mt-12 rounded-[28px] bg-[#111] p-8 text-white">
              <h3 className="font-serif text-[30px] text-[#f5c542]">
                Verify Aadhaar for Scheme Access
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-white/70">
                    Aadhaar Number
                  </label>
                  <input
                    value={profileAadhaarNumber}
                    maxLength={12}
                    onChange={(e) =>
                      setProfileAadhaarNumber(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="Enter 12 digit Aadhaar number"
                    className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-4 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-white/70">
                    Aadhaar Document
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProfileAadhaarFile(e.target.files?.[0] || null)
                    }
                    className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-4 outline-none"
                  />
                </div>
              </div>

              <button
                disabled={verifyingAadhaar}
                onClick={handleProfileAadhaarVerify}
                className={`${clickable} mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#f5c542] px-6 py-4 font-bold text-black`}
              >
                <Upload className="h-5 w-5" />
                {verifyingAadhaar
                  ? "Verifying Aadhaar..."
                  : "Verify Aadhaar"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchemeProfile;