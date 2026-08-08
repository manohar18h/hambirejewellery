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
  updateSchemeCustomerProfile,
  verifySchemeProfileMobile,

} from "../api/schemeApi";

const SchemeProfile = () => {
  const clickable = "clickable-ui";

  const [step, setStep] = useState<"login" | "register" | "otp" | "profile">(
    "login"
  );



  const [profile, setProfile] = useState<any>(null);
  
  
  const [editingProfile, setEditingProfile] =
  useState(false);

const [savingProfile, setSavingProfile] =
  useState(false);

const [editName, setEditName] =
  useState("");

const [editVillage, setEditVillage] =
  useState("");

const [editPhone, setEditPhone] =
  useState("");

const [editEmail, setEditEmail] =
  useState("");

const [editFullAddress, setEditFullAddress] =
  useState("");

const [editPincode, setEditPincode] =
  useState("");

const [editAadhaarNumber, setEditAadhaarNumber] =
  useState("");

const [editPanNumber, setEditPanNumber] =
  useState("");
  
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

  const [profileOtp, setProfileOtp] =
  useState("");

const [profileSendingOtp, setProfileSendingOtp] =
  useState(false);

const [profileVerifyingOtp, setProfileVerifyingOtp] =
  useState(false);

const [
  profileConfirmationResult,
  setProfileConfirmationResult
] = useState<any>(null);

const [
  profileRecaptchaVerified,
  setProfileRecaptchaVerified
] = useState(false);

const profileRecaptchaRef =
  useRef<RecaptchaVerifier | null>(null);


  useEffect(() => {

  if (
    step !== "profile" ||
    profile?.mobileVerified
  ) {
    return;
  }

  const timer = window.setTimeout(() => {

    const container =
      document.getElementById(
        "profile-mobile-recaptcha"
      );

    if (
      !container ||
      profileRecaptchaRef.current
    ) {
      return;
    }

    profileRecaptchaRef.current =
      new RecaptchaVerifier(
        auth,
        "profile-mobile-recaptcha",
        {
          size: "normal",

          callback: () => {
            setProfileRecaptchaVerified(
              true
            );
          },

          "expired-callback": () => {
            setProfileRecaptchaVerified(
              false
            );
          },
        }
      );

    profileRecaptchaRef.current.render();

  }, 300);

 return () => {
  window.clearTimeout(timer);

  if (profileRecaptchaRef.current) {
    try {
      profileRecaptchaRef.current.clear();
    } catch (error) {
      console.warn(
        "Profile reCAPTCHA cleanup error:",
        error
      );
    }

    profileRecaptchaRef.current = null;
  }

  setProfileRecaptchaVerified(false);
};

}, [
  step,
  profile?.mobileVerified,
]);

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

    /*
     * 1. Firebase verifies OTP.
     */
    const credential =
      await confirmationResult.confirm(otp);

    /*
     * 2. Generate Firebase ID token.
     */
    const firebaseIdToken =
      await credential.user.getIdToken(true);

    if (!firebaseIdToken) {
      throw new Error(
        "Firebase verification token was not received"
      );
    }

    /*
     * 3. Send profile data + Firebase token
     * to Spring Boot.
     */
    const customer =
      await registerSchemeCustomer({
        ...registerData,
        firebaseIdToken,
      });

      /*
 * Aadhaar is optional during Customer Profile registration.
 *
 * But if customer already supplied Aadhaar + document,
 * complete Aadhaar verification now so they do not
 * need to upload it again after registration.
 */
if (
  registerData.aadhaarNumber &&
  aadhaarFile
) {
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

    /*
     * At this point backend has:
     *
     * - verified Firebase token
     * - extracted verified phone
     * - compared it with entered phone
     * - created customer
     * - set mobileVerified=true
     */

    localStorage.setItem(
      "schemeCustomer",
      JSON.stringify(customer)
    );

    localStorage.setItem(
      "schemeLoginTime",
      Date.now().toString()
    );

   alert(
  registerData.aadhaarNumber && aadhaarFile
    ? "Registration, mobile and Aadhaar verification successful"
    : "Registration and mobile verification successful"
);

    setOtp("");
    setConfirmationResult(null);

    /*
     * 4. Reload customer profile.
     */
    await fetchProfile(
      customer.customerId
    );

  } catch (error: any) {

    console.error(
      "Profile registration error:",
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
      error.response?.data ||
      error.message ||
      "Registration failed"
    );
  }
};



const handleSendProfileMobileOtp =
  async () => {

    if (profileSendingOtp) {
      return;
    }

    const phoneNumber =
      String(profile?.phoneNumber || "")
        .replace(/\D/g, "");

    if (!/^\d{10}$/.test(phoneNumber)) {
      return alert(
        "Current mobile number is invalid"
      );
    }

    if (!profileRecaptchaVerified) {
      return alert(
        "Please complete reCAPTCHA first"
      );
    }

    if (!profileRecaptchaRef.current) {
      return alert(
        "reCAPTCHA is not ready. Please refresh and try again."
      );
    }

    try {

      setProfileSendingOtp(true);

      const result =
        await signInWithPhoneNumber(
          auth,
          `+91${phoneNumber}`,
          profileRecaptchaRef.current
        );

      setProfileConfirmationResult(
        result
      );

      alert(
        "OTP sent successfully"
      );

    } catch (error: any) {

      console.error(
        "Profile OTP send error:",
        error
      );

      alert(
        error?.message ||
        "Failed to send OTP"
      );

    } finally {
      setProfileSendingOtp(false);
    }
  };

  const handleVerifyProfileMobileOtp =
  async () => {

    if (!customerId) {
      return alert(
        "Please login again"
      );
    }

    if (!profileConfirmationResult) {
      return alert(
        "Please send OTP first"
      );
    }

    if (!/^\d{6}$/.test(profileOtp)) {
      return alert(
        "Enter valid 6 digit OTP"
      );
    }

    try {

      setProfileVerifyingOtp(true);

      /*
       * Firebase verifies entered OTP.
       */
      const credential =
        await profileConfirmationResult
          .confirm(profileOtp);

      /*
       * Get secure Firebase ID token.
       */
      const firebaseIdToken =
        await credential.user
          .getIdToken(true);

      if (!firebaseIdToken) {
        throw new Error(
          "Firebase verification token was not received"
        );
      }

      /*
       * Backend verifies token and phone.
       */
      await verifySchemeProfileMobile(
        customerId,
        firebaseIdToken
      );

      alert(
        "Mobile number verified successfully"
      );

      setProfileOtp("");
      setProfileConfirmationResult(null);

      /*
       * Reload profile:
       * mobileVerified should now be true.
       */
      await fetchProfile(customerId);

    } catch (error: any) {

      console.error(
        "Profile mobile verification error:",
        error
      );

      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "OTP verification failed"
      );

    } finally {
      setProfileVerifyingOtp(false);
    }
  };

const handleOpenProfileEdit = () => {

  setEditName(
    profile?.name || ""
  );

  setEditVillage(
    profile?.village || ""
  );

  setEditPhone(
    profile?.phoneNumber || ""
  );

  setEditEmail(
    profile?.emailId || ""
  );

  setEditFullAddress(
    profile?.fullAddress || ""
  );

  setEditPincode(
    profile?.pincode || ""
  );

  setEditAadhaarNumber(
    profile?.aadhaarNumber || ""
  );

  setEditPanNumber(
    profile?.panNumber || ""
  );

  setEditingProfile(true);
};


const savedPhone =
  String(profile?.phoneNumber || "")
    .replace(/\D/g, "");

const changedPhone =
  editPhone.replace(/\D/g, "");

const phoneHasChanged =
  savedPhone !== changedPhone;


  const handleSaveProfile = async () => {

  if (!customerId) {
    return alert(
      "Please login again"
    );
  }

  if (!editName.trim()) {
    return alert(
      "Customer name is required"
    );
  }

  if (!editVillage.trim()) {
    return alert(
      "Village is required"
    );
  }

  const phoneNumber =
    editPhone.replace(/\D/g, "");

  if (!/^\d{10}$/.test(phoneNumber)) {
    return alert(
      "Enter valid 10 digit mobile number"
    );
  }

  if (
    editEmail.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      editEmail.trim()
    )
  ) {
    return alert(
      "Enter valid email address"
    );
  }

  if (
    editPincode &&
    !/^\d{6}$/.test(editPincode)
  ) {
    return alert(
      "Pincode must contain 6 digits"
    );
  }

  if (
    !profile?.aadhaarVerified &&
    editAadhaarNumber &&
    !/^\d{12}$/.test(editAadhaarNumber)
  ) {
    return alert(
      "Aadhaar number must contain 12 digits"
    );
  }

  /*
   * Ask before removing existing
   * mobile verification.
   */
  if (
    phoneHasChanged &&
    profile?.mobileVerified
  ) {

    const confirmed =
      window.confirm(
        "This mobile number is already verified. If you change the mobile number, the current mobile verification will be removed and the new number must be verified again. Do you want to continue?"
      );

    if (!confirmed) {
      return;
    }
  }

  try {

    setSavingProfile(true);

    const payload: any = {
      name: editName.trim(),
      village: editVillage.trim(),
      phoneNumber,

      emailId:
        editEmail.trim() || null,

      fullAddress:
        editFullAddress.trim() || null,

      pincode:
        editPincode.trim() || null,

      panNumber:
        editPanNumber.trim() || null,
    };

    /*
     * Never send Aadhaar change when
     * Aadhaar is already verified.
     */
    if (!profile?.aadhaarVerified) {
      payload.aadhaarNumber =
        editAadhaarNumber
          .replace(/\D/g, "") ||
        null;
    }

    await updateSchemeCustomerProfile(
      customerId,
      payload
    );

    /*
     * If mobile changed, also update the
     * locally stored customer phone.
     */
    const savedCustomer =
      JSON.parse(
        localStorage.getItem(
          "schemeCustomer"
        ) || "{}"
      );

    localStorage.setItem(
      "schemeCustomer",
      JSON.stringify({
        ...savedCustomer,
        phoneNumber,
        mobileVerified:
          phoneHasChanged
            ? false
            : savedCustomer.mobileVerified,
      })
    );

    /*
     * Reload from backend.
     */
    await fetchProfile(customerId);

    setEditingProfile(false);

    alert(
      phoneHasChanged
        ? "Profile updated. Mobile verification was reset because the mobile number changed. Please verify the new mobile number."
        : "Profile updated successfully."
    );

  } catch (error: any) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data ||
      "Profile update failed"
    );

  } finally {
    setSavingProfile(false);
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
    <div className="min-h-screen bg-[#fbf7ef] px-8 py-14 max-md:px-4 max-md:py-6 max-md:pb-[90px]">
      {step !== "profile" ? (
        <div className="mx-auto grid max-w-[1450px] grid-cols-[420px_1fr] gap-10 max-md:grid-cols-1 max-md:gap-5">
          <div className="rounded-[34px] bg-gradient-to-br from-[#120902] via-[#251505] to-black p-8 text-white shadow-2xl max-md:p-6">
            <p className="text-[13px] font-bold uppercase tracking-[4px] text-[#f5c542]">
              Hambire Jewellery
            </p>

            <h1 className="mt-4 font-serif text-[42px] leading-tight max-md:text-[32px]">
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

          <div className="rounded-[34px] bg-white p-10 shadow-2xl max-md:p-5">
            {step === "login" && (
              <>
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                  Customer Login
                </p>

                <h2 className="mt-3 font-serif text-[44px] max-md:text-[30px]">
                  Login to Your Account
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
<div className="mx-auto max-w-[1250px] rounded-[36px] bg-white p-10 shadow-2xl max-md:p-5">    
        <div className="flex items-start justify-between max-md:flex-col max-md:gap-4">
            <div>
              <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                Hambire Jewellery
              </p>

             <h1 className="mt-3 font-serif text-[48px] max-md:text-[32px]">
                Customer Account Profile
              </h1>
            </div>

         <div className="flex gap-3">
  <button
    onClick={handleOpenProfileEdit}
    className={`${clickable} rounded-full border border-[#b98213] px-7 py-3 font-bold text-[#b98213]`}
  >
    Edit Profile
  </button>

  <button
    onClick={logoutCustomer}
    className={`${clickable} rounded-full border border-gray-300 px-7 py-3 font-bold text-gray-700`}
  >
    Logout
  </button>
</div>
          </div>

          {editingProfile && (
  <div className="mt-8 rounded-[28px] border border-[#b98213]/30 bg-[#fffaf0] p-7">
    <h2 className="text-[28px] font-bold">
      Edit Profile
    </h2>

    <div className="mt-6 grid grid-cols-2 gap-5 max-md:grid-cols-1">

      <div>
        <label className="mb-2 block font-semibold">
          Customer Name
        </label>

        <input
          value={editName}
          disabled={profile?.aadhaarVerified}
          onChange={(e) =>
            setEditName(e.target.value)
          }
          className={`w-full rounded-xl border px-4 py-3 ${
            profile?.aadhaarVerified
              ? "cursor-not-allowed bg-gray-200 text-gray-500"
              : "bg-white"
          }`}
        />

 {profile?.aadhaarVerified && (
    <p className="mt-1 text-sm text-gray-500">
      Name is locked because Aadhaar has been verified.
    </p>
  )}
      
      </div>

   

      <div>
        <label className="mb-2 block font-semibold">
          Mobile Number
        </label>

        <input
          value={editPhone}
          maxLength={10}
          onChange={(e) =>
            setEditPhone(
              e.target.value.replace(/\D/g, "")
            )
          }
          className="w-full rounded-xl border bg-white px-4 py-3"
        />

        {phoneHasChanged && (
          <p className="mt-2 text-sm font-semibold text-orange-600">
            Changing the mobile number will remove the existing OTP verification.
            The new mobile number must be verified again.
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Village / City
        </label>

        <input
          value={editVillage}
          onChange={(e) =>
            setEditVillage(e.target.value)
          }
          className="w-full rounded-xl border bg-white px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Email
        </label>

        <input
          value={editEmail}
          onChange={(e) =>
            setEditEmail(e.target.value)
          }
          className="w-full rounded-xl border bg-white px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Full Address
        </label>

        <input
          value={editFullAddress}
          onChange={(e) =>
            setEditFullAddress(e.target.value)
          }
          className="w-full rounded-xl border bg-white px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Pincode
        </label>

        <input
          value={editPincode}
          maxLength={6}
          onChange={(e) =>
            setEditPincode(
              e.target.value.replace(/\D/g, "")
            )
          }
          className="w-full rounded-xl border bg-white px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          Aadhaar Number
        </label>

        <input
          value={
            profile?.aadhaarVerified
              ? "XXXX XXXX XXXX"
              : editAadhaarNumber
          }
          disabled={profile?.aadhaarVerified}
          maxLength={12}
          onChange={(e) =>
            setEditAadhaarNumber(
              e.target.value
                .replace(/\D/g, "")
                .slice(0, 12)
            )
          }
          className={`w-full rounded-xl border px-4 py-3 ${
            profile?.aadhaarVerified
              ? "cursor-not-allowed bg-gray-200 text-gray-500"
              : "bg-white"
          }`}
        />

        <p className="mt-1 text-sm text-gray-500">
          {profile?.aadhaarVerified
            ? "Aadhaar is verified and cannot be changed."
            : "Aadhaar can be changed until verification."}
        </p>
      </div>

      <div>
        <label className="mb-2 block font-semibold">
          PAN Number
        </label>

        <input
          value={editPanNumber}
          onChange={(e) =>
            setEditPanNumber(
              e.target.value.toUpperCase()
            )
          }
          className="w-full rounded-xl border bg-white px-4 py-3"
        />
      </div>
    </div>

    <div className="mt-7 flex gap-3">
      <button
        disabled={savingProfile}
        onClick={handleSaveProfile}
        className="rounded-full bg-black px-7 py-3 font-bold text-white"
      >
        {savingProfile
          ? "Saving..."
          : "Save Changes"}
      </button>

      <button
        disabled={savingProfile}
        onClick={() => setEditingProfile(false)}
        className="rounded-full border border-gray-300 px-7 py-3 font-bold"
      >
        Cancel
      </button>
    </div>
  </div>
)}

{!(
  profile?.mobileVerified &&
  profile?.aadhaarVerified
) && (
  <div className="mt-8 flex gap-4 rounded-[24px] border border-yellow-300 bg-yellow-50 p-6 text-yellow-800 max-md:flex-col max-md:p-4">
    <ShieldAlert className="h-8 w-8" />

    <div>
      <h3 className="text-[20px] font-bold">
        Scheme Access Verification Required
      </h3>

      <p className="mt-1 text-[16px]">
        Mobile OTP verification and Aadhaar verification
        must both be completed before activating
        Hambire Jewellery schemes.
      </p>
    </div>
  </div>
)}

{profile?.mobileVerified &&
 profile?.aadhaarVerified && (
  <div className="mt-8 rounded-[24px] border border-green-300 bg-green-50 p-6 text-green-700">

    <h3 className="text-[20px] font-bold">
      Profile Verified Successfully
    </h3>

    <p className="mt-1 text-[16px]">
      Mobile number and Aadhaar are verified.
      You can now activate Hambire Jewellery schemes.
    </p>
  </div>
)}


{!profile?.mobileVerified && (
  <div className="mt-10 rounded-[28px] bg-[#111] p-8 text-white max-md:p-5">

    <h3 className="font-serif text-[30px] text-[#f5c542] max-md:text-[24px]">
      Verify Mobile Number
    </h3>

    <p className="mt-2 text-white/70">
      Your current mobile number{" "}
      <strong>{profile?.phoneNumber}</strong>{" "}
      must be verified using OTP.
    </p>

    <div
      id="profile-mobile-recaptcha"
      className="mt-6 flex justify-center"
    />

    {!profileConfirmationResult ? (
      <button
        disabled={profileSendingOtp}
        onClick={handleSendProfileMobileOtp}
        className={`${clickable} mt-6 w-full rounded-full bg-[#f5c542] px-6 py-4 font-bold text-black`}
      >
        {profileSendingOtp
          ? "Sending OTP..."
          : "Send OTP"}
      </button>
    ) : (
      <>
        <input
          value={profileOtp}
          maxLength={6}
          onChange={(e) =>
            setProfileOtp(
              e.target.value
                .replace(/\D/g, "")
                .slice(0, 6)
            )
          }
          placeholder="Enter 6 digit OTP"
          className="mt-6 w-full rounded-xl bg-white px-4 py-4 text-[22px] tracking-[6px] text-black"
        />

        <button
          disabled={profileVerifyingOtp}
          onClick={handleVerifyProfileMobileOtp}
          className={`${clickable} mt-4 w-full rounded-full bg-[#f5c542] px-6 py-4 font-bold text-black`}
        >
          {profileVerifyingOtp
            ? "Verifying..."
            : "Verify Mobile Number"}
        </button>
      </>
    )}
  </div>
)}
        

          <div className="mt-10 grid grid-cols-2 gap-7 max-md:grid-cols-1 max-md:gap-4">
           {[
  ["Name", profile?.name, <User />],
  ["Mobile", profile?.phoneNumber, <Phone />],

  [
    "Mobile Status",
    profile?.mobileVerified
      ? "Verified"
      : "Not Verified",
    <Phone />,
  ],

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
    profile?.aadhaarVerified
      ? "Verified"
      : "Not Verified",
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

                <h3 className="mt-3 break-words text-[22px] font-bold text-black max-md:text-[18px]">
                  {String(value)}
                </h3>
              </div>
            ))}
          </div>

          {!profile?.aadhaarVerified && (
<div className="mt-12 rounded-[28px] bg-[#111] p-8 text-white max-md:p-5">            
   <h3 className="font-serif text-[30px] text-[#f5c542] max-md:text-[24px]">
                Verify Aadhaar for Scheme Access
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-6 max-md:grid-cols-1">
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