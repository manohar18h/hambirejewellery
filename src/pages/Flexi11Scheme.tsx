import { useMemo, useState } from "react";
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
];

const Flexi11Scheme = () => {
  const navigate = useNavigate();
  const clickable = "clickable-ui";
  const [amount, setAmount] = useState(5000);
  const goldRate = 10000;

  const total = amount * 11;
  const goldWeight = useMemo(() => total / goldRate, [total]);

  return (
    <div className="min-h-screen bg-[#fbf7ef]">
      <section className="grid min-h-[70vh] grid-cols-2 items-center bg-gradient-to-br from-[#120902] via-[#251505] to-black px-16 text-white">
        <div>
          <p className="text-[15px] font-bold uppercase tracking-[5px] text-[#f5c542]">
            11 Month Jewellery Purchase Plan
          </p>

          <h1 className="mt-5 font-serif text-[72px] leading-[1.05]">
            Flexi Gold 11
          </h1>

          <p className="mt-6 max-w-[680px] text-[20px] leading-8 text-white/75">
            Pay monthly for 11 months and enjoy jewellery purchase benefits with
            100% V.A benefit, gold rate protection, and flexible value-based or
            weight-based calculation.
          </p>

          <div className="mt-8 grid max-w-[620px] grid-cols-3 gap-4">
            {["100% V.A", "11 Months", "Gold Protection"].map((item) => (
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
className={`${clickable} mt-9 rounded-full bg-[#f5c542] px-10 py-4 text-[17px] font-bold text-black`}          >
            Join Now
          </button>
        </div>

        <div className="rounded-[38px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          <h2 className="font-serif text-[36px]">Calculate Your Benefit</h2>

          <label className="mt-6 block text-white/70">Monthly Amount</label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-3 w-full rounded-2xl border border-white/20 bg-black/40 px-5 py-4 text-[22px] outline-none"
          />

          <div className="mt-6 grid grid-cols-2 gap-5">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-white/60">11 Month Total</p>
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

      <section className="px-12 pt-8 pb-20">
        <div className="mx-auto max-w-[1450px]">
          <h2 className="text-center font-serif text-[48px]">
            Easy Installment Options
          </h2>

          <p className="mx-auto mt-3 max-w-[900px] text-center text-[18px] leading-8 text-gray-700">
            Choose a monthly installment that suits your budget. At the end of
            11 months, your accumulated amount or gold weight can be used for
            jewellery purchase.
          </p>

          <div className="mt-10 grid grid-cols-6 gap-5">
            {[1000, 2000, 5000, 10000, 25000, 50000].map((price) => (
              <button
                key={price}
                onClick={() => setAmount(price)}
className={`${clickable} rounded-[24px] bg-white px-5 py-8 text-[24px] font-bold shadow-lg hover:bg-[#111] hover:text-[#f5c542]`}              >
                ₹{price.toLocaleString("en-IN")}
              </button>
            ))}
          </div>

          <div className="mt-16 rounded-[34px] bg-white p-8 shadow-xl">
            <h3 className="mb-6 font-serif text-[34px]">Scheme Benefits</h3>

            <div className="grid grid-cols-4 gap-5">
              {[
                ["100% VA Benefit", <BadgePercent />],
                ["Gold Rate Protection", <TrendingUp />],
                ["Flexible Monthly Saving", <Wallet />],
                ["Buy Jewellery After 11 Months", <Gem />],
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

          <section className="mt-16 grid grid-cols-2 gap-10">
            <div className="rounded-[34px] bg-[#111] p-8 text-white shadow-xl">
              <Calculator className="h-12 w-12 text-[#f5c542]" />

              <h3 className="mt-5 font-serif text-[34px]">
                Weight-Based or Value-Based Option
              </h3>

              <p className="mt-5 text-[17px] leading-8 text-white/75">
                At the time of jewellery purchase, customers can choose either
                accumulated gold weight calculation or rupee value calculation,
                whichever is beneficial.
              </p>
            </div>

            <div className="rounded-[34px] bg-white p-8 shadow-xl">
              <ShieldCheck className="h-12 w-12 text-[#b98213]" />

              <h3 className="mt-5 font-serif text-[34px]">
                Protection From Gold Rate Fluctuations
              </h3>

              <p className="mt-5 text-[17px] leading-8 text-gray-700">
                Whether gold rate rises or drops, this plan helps customers
                maintain the benefit of their monthly savings during the scheme
                period.
              </p>
            </div>
          </section>

          <section className="mt-16 rounded-[34px] bg-white p-8 shadow-xl">
            <div className="mb-8 text-center">
              <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
                Jewellery Benefit Table
              </p>

              <h3 className="mt-2 font-serif text-[40px]">
                Category Wise Benefits
              </h3>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#ead7ae]">
              <table className="w-full border-collapse text-center">
                <thead className="bg-[#5d1f32] text-white">
                  <tr>
                    <th className="p-5">Category</th>
                    <th className="p-5">V.A Charges</th>
                    <th className="p-5">Making Charges</th>
                    <th className="p-5">Per Carat</th>
                    <th className="p-5">MRP</th>
                  </tr>
                </thead>

                <tbody>
                  {benefitRows.map((row) => (
                    <tr key={row[0]} className="border-b border-[#ead7ae]">
                      {row.map((cell) => (
                        <td
                          key={cell}
                          className="border-r border-[#ead7ae] p-5 text-[16px] font-medium last:border-r-0"
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

          <section className="mt-16 rounded-[34px] bg-[#111] p-8 text-white shadow-xl">
            <div className="mb-8 text-center">
              <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#f5c542]">
                Example Calculation
              </p>

              <h3 className="mt-2 font-serif text-[40px]">
                ₹5,000 Monthly Plan for 11 Months
              </h3>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full border-collapse text-center">
                <thead className="bg-white/10">
                  <tr>
                    <th className="p-5">Month</th>
                    <th className="p-5">Monthly Amount</th>
                    <th className="p-5">Gold Rate / gm</th>
                    <th className="p-5">Gold Weight</th>
                    <th className="p-5">Value Option</th>
                  </tr>
                </thead>

                <tbody>
                  {exampleRows.map((row) => (
                    <tr key={row[0]} className="border-b border-white/10">
                      <td className="p-4 font-bold">{row[0]}</td>
                      <td className="p-4">₹{row[1]}</td>
                      <td className="p-4">₹{row[2]}</td>
                      <td className="p-4">{row[3]} gm</td>
                      <td className="p-4">₹{row[4]}</td>
                    </tr>
                  ))}

                  <tr className="bg-[#f5c542] font-bold text-black">
                    <td className="p-5">Total</td>
                    <td className="p-5">₹55,000</td>
                    <td className="p-5">-</td>
                    <td className="p-5">3.794 gm</td>
                    <td className="p-5">₹55,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-16 rounded-[34px] bg-white p-10 shadow-xl">
            <h3 className="font-serif text-[38px]">
              Important Scheme Details
            </h3>

            <div className="mt-8 space-y-7 text-[17px] leading-8 text-gray-700">
              <p>
                On successful completion of 11 months, customers can purchase
                eligible jewellery with value addition benefits as per the
                scheme rules.
              </p>

              <div>
                <h4 className="mb-2 text-[22px] font-bold text-black">
                  Duration
                </h4>
                <p>
                  This jewellery purchase plan is valid for 11 months. Monthly
                  subscription amount should be paid continuously for all 11
                  months.
                </p>
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
className={`${clickable} mx-auto mt-12 flex items-center gap-3 rounded-full bg-black px-12 py-4 text-[17px] font-bold text-white`}          >
            Join Flexi 11 Plan <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Flexi11Scheme;