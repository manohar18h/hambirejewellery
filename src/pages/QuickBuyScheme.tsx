import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Coins,
  Gem,
  History,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";

type MetalPrices = {
  gold24Rate: number;
  gold22Rate: number;
  silver999Rate: number;
  silver995Rate: number;
};

const QuickBuyScheme = () => {
  const navigate = useNavigate();
  const [rates, setRates] = useState<MetalPrices | null>(null);
const [metal, setMetal] = useState<
  "GOLD" | "KAMAL_SILVER" | "SWASTIK_SILVER"
>("GOLD");
  const [amount, setAmount] = useState(1000);
  const clickable = "clickable-ui";

  useEffect(() => {
    axios
      .get("https://api.hambirejewellery.com/api/catalog/getTodaysRates")
      .then((res) => setRates(res.data))
      .catch((err) => console.error(err));
  }, []);

const rate =
  metal === "GOLD"
    ? rates?.gold24Rate || 0
    : metal === "KAMAL_SILVER"
    ? rates?.silver999Rate || 0
    : rates?.silver995Rate || 0;

const perGramRate = rate / 10;

 const weight = useMemo(() => {
  if (!perGramRate) return 0;
  return amount / perGramRate;
}, [amount, perGramRate]);

  return (
    <div className="min-h-screen bg-[#070707] text-white  max-md:pb-[80px]">
<section className="grid min-h-[82vh] grid-cols-2 items-center gap-12 px-16 max-md:grid-cols-1 max-md:gap-8 max-md:px-4 max-md:py-10">
          <div>
          <p className="text-[15px] font-bold uppercase tracking-[5px] text-[#f5c542]">
            Hambire Digital Metal Wallet
          </p>

          <h1 className="mt-5 font-serif text-[72px] leading-[1.05] max-md:text-[40px]">
            Quick Buy Gold & Silver
          </h1>

          <p className="mt-6 max-w-[700px] text-[20px] leading-8 text-white/75 max-md:text-[16px] max-md:leading-7">
            Save small amounts like ₹1,000, ₹2,000 or ₹5,000 whenever you want
            and convert it into gold or silver weight at today’s live rate. Your
            purchased metal balance will be safely saved in your profile.
          </p>

          <div className="mt-8 grid max-w-[650px] grid-cols-3 gap-4 max-md:grid-cols-1">
            {["Buy Anytime", "Save Metal", "Redeem Later"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-center"
              >
                <p className="font-bold text-[#f5c542]">{item}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/schemes/register?scheme=quick-buy")}
className={`${clickable} mt-9 rounded-full bg-[#f5c542] px-10 py-4 text-[17px] font-bold text-black max-md:w-full`}          >
            Start Buying
          </button>
        </div>

<div className="rounded-[40px] border border-white/10 bg-white/10 p-8 backdrop-blur-xl max-md:p-5">      
    <h2 className="font-serif text-[38px] max-md:text-[30px]">Live Metal Calculator</h2>

       <div className="mt-7 grid grid-cols-3 gap-2 max-md:gap-2">     
     <button
  onClick={() => setMetal("GOLD")}
  className={`${clickable} rounded-xl px-2 py-3 text-[14px] font-bold ${
    metal === "GOLD"
      ? "bg-[#f5c542] text-black"
      : "bg-white/10 text-white"
  }`}
>
  Gold
</button>

<button
  onClick={() => setMetal("KAMAL_SILVER")}
  className={`${clickable} rounded-xl px-2 py-3 text-[14px] font-bold ${
    metal === "KAMAL_SILVER"
      ? "bg-[#f5c542] text-black"
      : "bg-white/10 text-white"
  }`}
>
  Kamal Silver
</button>

<button
  onClick={() => setMetal("SWASTIK_SILVER")}
  className={`${clickable} rounded-xl px-2 py-3 text-[14px] font-bold ${
    metal === "SWASTIK_SILVER"
      ? "bg-[#f5c542] text-black"
      : "bg-white/10 text-white"
  }`}
>
  Swastik Silver
</button>
          </div>

          <label className="mt-7 block text-white/70">Enter Amount</label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-3 w-full rounded-2xl border border-white/20 bg-black/40 px-5 py-4 text-[24px] outline-none max-md:text-[20px]"
          />

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[1000, 2000, 5000].map((value) => (
              <button
                key={value}
                onClick={() => setAmount(value)}
className={`${clickable} rounded-xl bg-white/10 py-3 font-bold hover:bg-[#f5c542] hover:text-black`}              >
                ₹{value}
              </button>
            ))}
          </div>

          <div className="mt-7 rounded-3xl bg-black/40 p-7 max-md:p-5">
<p className="text-white/60">
  Current Rate: ₹{perGramRate || "--"}/gm
</p>
            <h3 className="mt-3 text-[42px] font-bold text-[#f5c542] max-md:text-[34px]">
              {weight.toFixed(4)} gm
            </h3>

            <p className="mt-2 text-white/60">
             Approx{" "}
{metal === "GOLD"
  ? "Gold"
  : metal === "KAMAL_SILVER"
  ? "Kamal Silver"
  : "Swastik Silver"}{" "}
weight saved in wallet
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#fbf7ef] px-12 py-20 text-black max-md:px-4 max-md:py-12">
        <div className="mx-auto max-w-[1450px]">
          <div className="text-center">
            <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
              Smart Metal Savings
            </p>

            <h2 className="mt-3 font-serif text-[48px] max-md:text-[34px]">
              How Quick Buy Works
            </h2>

            <p className="mx-auto mt-4 max-w-[950px] text-[18px] leading-8 text-gray-700 max-md:text-[16px] max-md:leading-7">
              Instead of spending small savings somewhere else, customers can
              buy gold or silver in their name. Every purchase adds metal weight
              to their Hambire wallet.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-4 gap-6 max-md:grid-cols-1">
            {[
              ["Enter Amount", "Customer chooses how much to save.", <Wallet />],
              ["Live Rate", "Gold or silver weight is calculated instantly.", <TrendingUp />],
              ["Save Metal", "Metal weight is stored in customer profile.", <Coins />],
              ["Redeem Later", "Use wallet balance to buy jewellery.", <Gem />],
            ].map(([title, desc, icon]) => (
              <div
                key={String(title)}
                className="rounded-[28px] bg-white p-8 shadow-lg max-md:p-6"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff3cf] text-[#b98213]">
                  {icon}
                </div>

                <h3 className="font-serif text-[24px]">{title}</h3>

                <p className="mt-3 text-[16px] leading-7 text-gray-600">
                  {desc}
                </p>
              </div>
            ))}
          </div>

<section className="mt-16 rounded-[34px] bg-white p-10 shadow-xl max-md:p-5">
              <h3 className="font-serif text-[40px] max-md:text-[30px]">
              Customer Wallet Benefits
            </h3>

            <div className="mt-8 grid grid-cols-2 gap-8  max-md:grid-cols-1">
              <div className="rounded-[28px] bg-[#111] p-8 text-white max-md:p-6">
                <History className="h-12 w-12 text-[#f5c542]" />

                <h4 className="mt-5 font-serif text-[30px]">
                  Multiple Purchases, One Wallet
                </h4>

                <p className="mt-4 text-[17px] leading-8 text-white/70">
                  A customer can buy gold or silver multiple times. Each
                  transaction stores date, metal type, amount, rate and metal
                  weight in the customer profile.
                </p>
              </div>

              <div className="rounded-[28px] bg-[#fbf7ef] p-8 max-md:p-6">
                <ShieldCheck className="h-12 w-12 text-[#b98213]" />

                <h4 className="mt-5 font-serif text-[30px] max-md:text-[24px]">
                  Better Jewellery Benefits
                </h4>

                <p className="mt-4 text-[17px] leading-8 text-gray-700">
                  When the customer buys jewellery, the system can check total
                  metal purchased, number of purchases and holding period to
                  offer making charge discounts.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-16 rounded-[34px] bg-[#111] p-10 text-white shadow-xl max-md:p-5">
            <h3 className="font-serif text-[40px] max-md:text-[30px]">
              Redeem Options
            </h3>

            <div className="mt-8 grid grid-cols-3 gap-6 max-md:grid-cols-1">
              {[
                {
                  title: "Buy Jewellery",
                  desc: "Use wallet gold or silver balance against jewellery purchase.",
                },
                {
                  title: "Redeem Metal",
                  desc: "Redeem available gold or silver weight as per store policy.",
                },
                {
                  title: "Redeem Value",
                  desc: "Customer can get metal value based on the redemption day rate.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[26px] border border-white/10 bg-white/10 p-7"
                >
                  <h4 className="font-serif text-[26px] text-[#f5c542]">
                    {item.title}
                  </h4>

                  <p className="mt-4 text-[16px] leading-7 text-white/70">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 rounded-[34px] bg-white p-10 shadow-xl max-md:p-5">
            <h3 className="font-serif text-[40px]  max-md:text-[30px]">
              Example Wallet Journey
            </h3>

<div className="mt-8 overflow-x-auto rounded-2xl border border-[#ead7ae]">
               <table className="w-full border-collapse text-center text-[12px] md:text-[16px]">
                <thead className="bg-[#5d1f32] text-white">
                  <tr>
                    <th className="p-2 md:p-5 text-[12px] md:text-[16px]">Purchase</th>
                   <th className="p-2 md:p-5 text-[12px] md:text-[16px]">Amount</th>
                    <th className="p-2 md:p-5 text-[12px] md:text-[16px]">Rate / gm</th>
                    <th className="p-2 md:p-5 text-[12px] md:text-[16px]">Metal Saved</th>
                    <th className="p-2 md:p-5 text-[12px] md:text-[16px]">Wallet Status</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    ["1st Buy", "₹1,000", "₹10,000", "0.100 gm", "Saved"],
                    ["2nd Buy", "₹2,000", "₹10,200", "0.196 gm", "Saved"],
                    ["3rd Buy", "₹5,000", "₹10,500", "0.476 gm", "Saved"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-b border-[#ead7ae]">
                      {row.map((cell) => (
                        <td
                          key={cell}
className="border-r border-[#ead7ae] p-2 md:p-5 text-[12px] md:text-[16px] font-medium last:border-r-0 whitespace-nowrap"                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}

                  <tr className="bg-[#fff3cf] font-bold">
                    <td className="p-2 md:p-5 text-[12px] md:text-[16px]">Total</td>
                    <td className="p-2 md:p-5 text-[12px] md:text-[16px]">₹8,000</td>
                    <td className="p-2 md:p-5 text-[12px] md:text-[16px]">-</td>
                    <td className="p-2 md:p-5 text-[12px] md:text-[16px]">0.772 gm</td>
                    <td className="p-2 md:p-5 text-[12px] md:text-[16px]">Available</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-16 rounded-[34px] bg-[#fbf7ef] p-10 shadow-xl max-md:p-5">
            <h3 className="font-serif text-[38px] max-md:text-[30px]">
              Smart Discount Logic Later
            </h3>

            <div className="mt-8 space-y-5 text-[17px] leading-8 text-gray-700">
              <p>
                When customer wants to buy jewellery, your system can calculate
                benefits based on:
              </p>

              <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
                {[
                  "Total amount invested",
                  "Total metal weight purchased",
                  "Number of purchases",
                  "How many days metal was held",
                  "Gold or silver category",
                  "Customer profile validity",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-white p-5 font-semibold shadow"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <p className="font-semibold text-black">
                Example: A customer who buys regularly and holds metal for a
                longer period can get better making charge discount than a new
                customer.
              </p>
            </div>
          </section>

          <button
            onClick={() => navigate("/schemes/register?scheme=quick-buy")}
className={`${clickable} mx-auto mt-12 flex items-center gap-3 rounded-full bg-black px-12 py-4 text-[17px] font-bold text-white max-md:w-full max-md:justify-center`}         >
            Create Metal Wallet <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default QuickBuyScheme;