import { useSearchParams } from "react-router-dom";

const SchemeRegister = () => {
  const [params] = useSearchParams();
  const scheme = params.get("scheme") || "scheme";

  return (
    <div className="min-h-screen bg-[#fbf7ef] px-8 py-16">
      <div className="mx-auto max-w-[1100px] rounded-[34px] bg-white p-10 shadow-2xl">
        <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
          Hambire Jewellery
        </p>

        <h1 className="mt-3 font-serif text-[46px]">
          Join {scheme.replace("-", " ")}
        </h1>

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
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              Address Proof
            </label>
            <input type="file" className="w-full rounded-xl border border-gray-300 px-4 py-3" />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              ID Document
            </label>
            <input type="file" className="w-full rounded-xl border border-gray-300 px-4 py-3" />
          </div>
        </div>

        <button className="mt-10 w-full rounded-full bg-black px-8 py-4 text-[17px] font-bold text-white">
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default SchemeRegister;