import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgePercent,
  Calculator,
  Gem,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";

const benefitRows = [
  ["Gold Jewellery", "100% No V.A", "-", "-", "-"],
  ["Diamond Jewellery", "-", "30%", "10%", "-"],
  ["Uncut Diamond", "100% No V.A", "-", "10%", "-"],
  ["Silver Articles", "100% No V.A", "-", "-", "-"],
  ["Silver Antique", "100% No V.A", "50%", "-", "-"],
  ["Silver Jewellery MRP Items", "-", "-", "-", "25%"],
  ["Ruby & Emerald", "100% No V.A", "-", "10%", "-"],
];

const exampleRows = [
  [1, 5000, 14200, "0.352", 5000],
  [2, 5000, 14300, "0.350", 5000],
  [3, 5000, 14400, "0.347", 5000],
  [4, 5000, 14500, "0.345", 5000],
  [5, 5000, 14600, "0.342", 5000],
  [6, 5000, 14400, "0.347", 5000],
  [7, 5000, 14300, "0.350", 5000],
  [8, 5000, 14500, "0.345", 5000],
  [9, 5000, 14600, "0.342", 5000],
  [10, 5000, 14800, "0.338", 5000],
  [11, 5000, 14900, "0.336", 5000],
  [12, 5000, 15000, "0.333", 5000],
];



const Flexi11Scheme = () => {
  const navigate = useNavigate();
  const clickable = "clickable-ui";
  const [amount, setAmount] = useState(5000);
  const goldRate = 10000;
const calculatorRef = useRef<HTMLDivElement | null>(null);
  const total = amount * 12;
  const goldWeight = useMemo(() => total / goldRate, [total]);


  const scrollToCalculator = () => {
  if (calculatorRef.current) {
    const y =
      calculatorRef.current.getBoundingClientRect().top +
      window.pageYOffset -
      120; // adjust offset if needed

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  }
};

  return (
    <div className="min-h-screen bg-[#fbf7ef] max-md:pb-[80px]">
<section className="grid min-h-[70vh] grid-cols-2 items-center gap-12 bg-gradient-to-br from-[#120902] via-[#251505] to-black px-16 py-14 text-white max-md:grid-cols-1 max-md:px-4 max-md:py-10">        <div>
          <p className="text-[15px] font-bold uppercase tracking-[5px] text-[#f5c542]">
            12 Month Jewellery Purchase Plan
          </p>

          <h1 className="mt-5 font-serif text-[72px] leading-[1.05] max-md:text-[42px]">
            Flexi Gold 12
          </h1>

<p className="mt-5 max-w-[680px] text-[20px] leading-8 text-white/75 max-md:text-[16px] max-md:leading-7">       
     Pay monthly for 12 months and build gold weight with every payment.
Redeem earlier with month-based wastage benefits, or complete 12 months
for full eligible wastage benefit.
          </p>

         <div className="mt-8 grid max-w-[620px] grid-cols-3 gap-4 max-md:grid-cols-1">
            {["Full Wastage at 12M", "12 Months", "Gold Protection"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-center"
              >
                <p className="font-bold text-[#f5c542]">{item}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/schemes/register?scheme=flexi-11")}
className={`${clickable} mt-9 rounded-full bg-[#f5c542] px-10 py-4 text-[17px] font-bold text-black max-md:w-full`}>      
      Join Now
          </button>
        </div>

<div  ref={calculatorRef} className="rounded-[38px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl max-md:p-5">
          <h2 className="font-serif text-[36px] max-md:text-[30px]">Calculate Your Benefit</h2>

          <label className="mt-6 block text-white/70">Monthly Amount</label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
className="mt-3 w-full rounded-2xl border border-white/20 bg-black/40 px-5 py-4 text-[22px] outline-none max-md:text-[20px]"
          />

          <div className="mt-6 grid grid-cols-2 gap-5 max-md:grid-cols-1">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-white/60">12 Month Total</p>
              <h3 className="mt-2 text-[28px] font-bold text-[#f5c542]">
                ₹{total.toLocaleString("en-IN")}
              </h3>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-white/60">Estimated Gold</p>
              <h3 className="mt-2 text-[28px] font-bold text-[#f5c542]">
                {goldWeight.toFixed(3)} gm
              </h3>
            </div>
          </div>

          <p className="mt-6 text-[15px] leading-7 text-white/60">
            Final gold weight depends on actual gold rate on each payment date.
            Customer can choose the better option at purchase time.
          </p>
        </div>
      </section>

      <section className="px-12 pt-8 pb-20 max-md:px-4 max-md:pb-12">
        <div className="mx-auto max-w-[1450px]">
          <h2 className="text-center font-serif text-[48px] max-md:text-[34px]">
            Easy Installment Options
          </h2>

<p className="mx-auto mt-3 max-w-[900px] text-center text-[18px] leading-8 text-gray-700 max-md:text-[16px] max-md:leading-7">
              Choose a monthly installment that suits your budget. At the end of
            12 months, your accumulated amount or gold weight can be used for
            jewellery purchase.
          </p>

          <div className="mt-8 grid grid-cols-6 gap-5 max-md:grid-cols-2 max-md:gap-3">
            {[1000, 2000, 5000, 10000, 25000, 50000].map((price) => (
              <button
                key={price}
               onClick={() => {
  setAmount(price);

  setTimeout(() => {
    scrollToCalculator();
  }, 100);
}}
className={`${clickable} rounded-[24px] bg-white px-5 py-8 text-[24px] font-bold shadow-lg hover:bg-[#111] hover:text-[#f5c542] max-md:px-3 max-md:py-5 max-md:text-[18px]`}
>                ₹{price.toLocaleString("en-IN")}
              </button>
            ))}
          </div>

          <div className="mt-16 rounded-[34px] bg-white p-8 shadow-xl max-md:p-5">
            <h3 className="mb-6 font-serif text-[34px] max-md:text-[28px]">Scheme Benefits</h3>

            <div className="grid grid-cols-4 gap-5 max-md:grid-cols-1">
              {[
                ["100% VA Benefit", <BadgePercent />],
                ["Gold Rate Protection", <TrendingUp />],
                ["Flexible Monthly Saving", <Wallet />],
               ["Full Benefit After 12 Months", <Gem />],
              ].map(([item, icon]) => (
                <div
                  key={String(item)}
                  className="rounded-2xl bg-[#fbf7ef] p-6 text-[18px] font-semibold"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff3cf] text-[#b98213]">
                    {icon}
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <section className="mt-16 grid grid-cols-2 gap-10 max-md:grid-cols-1">
            <div className="rounded-[34px] bg-[#111] p-8 text-white shadow-xl  max-md:p-5">
              <Calculator className="h-12 w-12 text-[#f5c542]" />

              <h3 className="mt-5 font-serif text-[34px] max-md:text-[28px]">
                Weight-Based or Value-Based Option
              </h3>

              <p className="mt-5 text-[17px] leading-8 text-white/75">
                At the time of jewellery purchase, customers can choose either
                accumulated gold weight calculation or rupee value calculation,
                whichever is beneficial.
              </p>
            </div>

            <div className="rounded-[34px] bg-white p-8 shadow-xl max-md:p-5">
              <ShieldCheck className="h-12 w-12 text-[#b98213]" />

              <h3 className="mt-5 font-serif text-[34px] max-md:text-[28px]">
                Protection From Gold Rate Fluctuations
              </h3>

              <p className="mt-5 text-[17px] leading-8 text-gray-700">
                Whether gold rate rises or drops, this plan helps customers
                maintain the benefit of their monthly savings during the scheme
                period.
              </p>
            </div>
          </section>

          <section className="mt-16 rounded-[34px] bg-white p-8 shadow-xl max-md:p-5">
            <div className="mb-8 text-center">
              <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                Jewellery Benefit Table
              </p>

              <h3 className="mt-2 font-serif text-[40px] max-md:text-[30px]">
                Category Wise Benefits
              </h3>
            </div>

<div className="overflow-hidden rounded-2xl border border-[#ead7ae]">        
        <table className="w-full border-collapse text-center">
                <thead className="bg-[#5d1f32] text-white">
                  <tr>
                    <th className="p-2 text-[11px] md:p-5 md:text-[16px]">Category</th>
                    <th className="p-2 text-[11px] md:p-5 md:text-[16px]">V.A Charges</th>
                    <th className="p-2 text-[11px] md:p-5 md:text-[16px]">Making Charges</th>
                    <th className="p-2 text-[11px] md:p-5 md:text-[16px]">Per Carat</th>
                    <th className="p-2 text-[11px] md:p-5 md:text-[16px]">MRP</th>
                  </tr>
                </thead>

                <tbody>
                  {benefitRows.map((row) => (
                    <tr key={row[0]} className="border-b border-[#ead7ae]">
                      {row.map((cell) => (
                        <td
                          key={cell}
className="border-r border-[#ead7ae] p-2 text-[10px] font-medium last:border-r-0 md:p-5 md:text-[16px]"
                 >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

<section className="mt-16 rounded-[34px] bg-[#111] p-8 text-white shadow-xl max-md:p-5">            <div className="mb-8 text-center">
              <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#f5c542]">
                Example Calculation
              </p>

              <h3 className="mt-2 font-serif text-[40px] max-md:text-[30px]">
                ₹5,000 Monthly Plan for 12 Months
              </h3>
            </div>

<div className="overflow-hidden rounded-2xl border border-white/10">
<table className="w-full border-collapse text-center">
                  <thead className="bg-white/10">
                  <tr>
                    <th className="p-2 text-[10px] md:p-5 md:text-[16px]">Month</th>
                    <th className="p-2 text-[10px] md:p-5 md:text-[16px]">Monthly Amount</th>
                    <th className="p-2 text-[10px] md:p-5 md:text-[16px]">Gold Rate / gm</th>
                    <th className="p-2 text-[10px] md:p-5 md:text-[16px]">Gold Weight</th>
                    <th className="p-2 text-[10px] md:p-5 md:text-[16px]">Value Option</th>
                  </tr>
                </thead>

                <tbody>
                  {exampleRows.map((row) => (
                    <tr key={row[0]} className="border-b border-white/10">
                      <td className="p-2 text-[10px] font-bold md:p-4 md:text-[16px]">{row[0]}</td>
                      <td className="p-2 text-[10px] md:p-4 md:text-[16px]">₹{row[1]}</td>
                      <td className="p-2 text-[10px] md:p-4 md:text-[16px]">₹{row[2]}</td>
                      <td className="p-2 text-[10px] md:p-4 md:text-[16px]">{row[3]} gm</td>
                      <td className="p-2 text-[10px] md:p-4 md:text-[16px]">₹{row[4]}</td>
                    </tr>
                  ))}

                  <tr className="bg-[#f5c542] font-bold text-black">
                    <td className="p-2 text-[10px] md:p-5 md:text-[16px]">Total</td>
                    <td className="p-2 text-[10px] md:p-5 md:text-[16px]">₹60,000</td>
                    <td className="p-2 text-[10px] md:p-5 md:text-[16px]">-</td>
                    <td className="p-2 text-[10px] md:p-5 md:text-[16px]">4.127 gm</td>
                    <td className="p-2 text-[10px] md:p-5 md:text-[16px]">₹60,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

<section className="mt-16 rounded-[34px] bg-white p-10 shadow-xl max-md:p-5">     
         <h3 className="font-serif text-[38px] max-md:text-[30px]">
              Important Scheme Details
            </h3>

            <div className="mt-8 space-y-7 text-[17px] leading-8 text-gray-700 max-md:text-[16px] max-md:leading-7">
              <p>
                On successful completion of 12 months, customers can purchase
                eligible jewellery with value addition benefits as per the
                scheme rules.
              </p>

            <div>
  <label className="mb-2 block text-white/70">
    Scheme Duration
  </label>

  <div className="rounded-xl border border-white/20 bg-black/40 px-4 py-4">
    <p className="font-bold text-[#f5c542]">
      12 Months
    </p>

    <p className="mt-1 text-sm text-white/60">
      Redeem in months 1–5 with 0% wastage discount, months 6–11 with
      corresponding wastage discount, or complete 12 months for full
      eligible wastage discount.
    </p>
  </div>
</div>

              <div>
                <h4 className="mb-2 text-[22px] font-bold text-black">
                  Payment Benefit
                </h4>
                <p>
                  Monthly payments can be considered either as amount in rupees
                  or gold weight in grams. At purchase time, the beneficial
                  option can be selected.
                </p>
              </div>

              <div>
                <h4 className="mb-2 text-[22px] font-bold text-black">
                  Excess Purchase Value
                </h4>
                <p>
                  If the jewellery value is higher than the accumulated plan
                  value, V.A charges may apply only on the excess purchase value
                  as per store policy.
                </p>
              </div>

              <div>
                <h4 className="mb-2 text-[22px] font-bold text-black">
                  GST & Taxes
                </h4>
                <p>
                  Applicable GST and government taxes will be borne by the
                  customer as per current rules.
                </p>
              </div>
            </div>
          </section>

          <button
            onClick={() => navigate("/schemes/register?scheme=flexi-11")}
className={`${clickable} mx-auto mt-12 flex items-center justify-center gap-3 rounded-full bg-black px-12 py-4 text-[17px] font-bold text-white max-md:w-full`}
>            Join Flexi 12 Plan <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Flexi11Scheme;