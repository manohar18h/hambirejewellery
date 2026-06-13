import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  RefreshCcw,
  ShieldCheck,
  Gem,
  BadgePercent,
  Sparkles,
} from "lucide-react";

const rows = [
  ["After 5 Months", "Gold jewellery with VA charges up to 5% covered."],
  ["After 6 Months", "Gold jewellery with VA charges up to 6% covered."],
  ["After 7 Months", "Gold jewellery with VA charges up to 7% covered."],
  ["After 8 Months", "Gold jewellery with VA charges up to 8% covered."],
  ["After 9 Months", "Gold jewellery with VA charges up to 9% covered."],
  ["After 10 Months", "Gold jewellery with VA charges up to 10% covered."],
  ["After 11 Months", "Gold jewellery with full eligible VA benefit."],
];

const PreBookingScheme = () => {
  const navigate = useNavigate();
  const clickable = "clickable-ui";

  return (
    <div className="min-h-screen bg-[#fbf7ef]">
      <section className="relative min-h-screen overflow-hidden bg-[#100903] px-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,#f5c54244,transparent_40%)]" />

        <div className="relative z-10 mx-auto grid min-h-screen max-w-[1500px] grid-cols-2 items-center gap-12">
          <div>
            <p className="text-[15px] font-bold uppercase tracking-[5px] text-[#f5c542]">
              Hambire Exchange Utsav
            </p>

            <h1 className="mt-5 font-serif text-[70px] leading-[1.05]">
              Jewellery Pre-Booking & Exchange Scheme
            </h1>

            <p className="mt-5 text-[20px] font-semibold uppercase leading-8 text-[#f5c542]">
              Something valuable, something different. 100% no V.A. charges for
              eligible jewellery.
            </p>

            <p className="mt-6 max-w-[700px] text-[19px] leading-8 text-white/75">
              Make a one-time advance payment or exchange your old jewellery and
              enjoy premium jewellery purchase benefits with reduced wastage
              charges.
            </p>

            <button
              onClick={() => navigate("/schemes/register?scheme=pre-booking")}
className={`${clickable} mt-9 rounded-full bg-[#f5c542] px-10 py-4 text-[17px] font-bold text-black`}            >
              Join Now
            </button>
          </div>

          <div className="rounded-[42px] border border-white/10 bg-white/10 p-10 backdrop-blur-xl">
            <Gem className="h-24 w-24 text-[#f5c542]" />

            <h2 className="mt-8 font-serif text-[42px]">Save VA Charges</h2>

            <p className="mt-4 text-[18px] leading-8 text-white/70">
              Pre-book jewellery today and buy after the scheme period with
              eligible value addition benefits. Or exchange old jewellery for
              new jewellery and make the most of your stored gold value.
            </p>
          </div>
        </div>
      </section>

      <section className="px-8 py-20">
        <div className="mx-auto max-w-[1450px]">
          <div className="rounded-[34px] bg-white p-10 shadow-xl">
            <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#b98213]">
              Scheme Overview
            </p>

            <h2 className="mt-3 font-serif text-[44px] text-[#111]">
              Buy Jewellery With Smart Savings
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-10 text-[18px] leading-9 text-gray-700">
              <div>
                <p>
                  There is nothing like this in the jewellery market. This
                  Jewellery Pre-Booking Scheme helps reduce the burden of
                  wastage costs while making your jewellery purchase.
                </p>

                <p className="mt-6">
                  There are two ways to avail this scheme: make a one-time
                  advance payment to pre-book, or exchange your old jewellery.
                </p>
              </div>

              <div>
                <p>
                  After completing the eligible scheme period, customers can
                  purchase jewellery with attractive V.A. benefits as per the
                  scheme timeline.
                </p>

                <p className="mt-6 font-semibold text-[#111]">
                  Either way, you save more on your jewellery purchase while
                  enjoying a transparent and premium buying experience.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-4 gap-6">
            {[
              ["No Wastage Benefits", <BadgePercent />],
              ["Old Gold Exchange", <RefreshCcw />],
              ["Secure Valuation", <ShieldCheck />],
              ["Premium Jewellery", <Gem />],
            ].map(([title, icon]) => (
              <div
                key={String(title)}
                className="rounded-[28px] bg-white p-8 shadow-lg"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff3cf] text-[#b98213]">
                  {icon}
                </div>

                <h3 className="font-serif text-[24px]">{title}</h3>
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-[34px] bg-[#111] p-8 text-white shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-[14px] font-bold uppercase tracking-[4px] text-[#f5c542]">
                  Benefit Timeline
                </p>

                <h2 className="mt-2 font-serif text-[42px]">
                  V.A. Charges Benefit
                </h2>
              </div>

              <Sparkles className="h-14 w-14 text-[#f5c542]" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              {rows.map(([month, benefit]) => (
                <div
                  key={month}
                  className="grid grid-cols-[300px_1fr] border-b border-white/10 last:border-b-0"
                >
                  <div className="bg-white/10 p-6 text-[18px] font-bold">
                    {month}
                  </div>

                  <div className="p-6 text-[17px] text-white/80">
                    {benefit}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[24px] bg-white/10 p-7 text-[17px] leading-8 text-white/75">
              <p>
                This scheme helps customers plan their jewellery purchase in
                advance and enjoy better savings on value addition charges.
                Benefits are applicable as per the completed scheme duration and
                selected jewellery category.
              </p>
            </div>

            <button
              onClick={() => navigate("/schemes/register?scheme=pre-booking")}
className={`${clickable} mx-auto mt-10 flex items-center gap-3 rounded-full bg-[#f5c542] px-10 py-4 font-bold text-black`}            >
              Join Pre-Booking Scheme <ArrowRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PreBookingScheme;