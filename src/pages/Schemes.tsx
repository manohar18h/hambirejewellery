import { useNavigate } from "react-router-dom";
import {
  Gem,
  ShieldCheck,
  Wallet,
  ArrowRight,
  Coins,
  BadgePercent,
} from "lucide-react";

const Schemes = () => {
  const navigate = useNavigate();
  const clickable = "clickable-ui";

  const schemes = [
    {
      title: "Pre-Booking & Exchange",
      subtitle: "Exchange old jewellery or advance book new jewellery.",
      path: "/schemes/pre-booking",
      icon: <Gem className="h-10 w-10" />,
points: [
  "Up to full wastage benefit",
  "Old jewellery exchange",
  "12 month plan",
],
    },
   {
  title: "Flexi 12 Month Plan",
  subtitle: "Pay monthly and enjoy jewellery purchase benefits.",
  path: "/schemes/flexi-11",
  icon: <ShieldCheck className="h-10 w-10" />,
  points: [
    "12 month savings",
    "Up to full wastage benefit",
    "Gold rate protection",
  ],
},
    {
      title: "Quick Buy Metal Wallet",
      subtitle: "Buy gold or silver by amount and save metal in wallet.",
      path: "/schemes/quick-buy",
      icon: <Wallet className="h-10 w-10" />,
      points: ["Live rates", "Instant weight calculation", "Redeem anytime"],
    },
  ];

  return (
<div className="min-h-screen bg-[#070707] text-white max-md:pb-[80px]">
<section className="relative flex min-h-screen items-center overflow-hidden px-8 max-md:min-h-auto max-md:px-4 max-md:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#f5b94233,transparent_35%),linear-gradient(135deg,#070707,#1b1206,#090909)]" />
        <div className="absolute right-[-120px] top-[80px] h-[520px] w-[520px] rounded-full bg-[#f5b942]/10 blur-3xl" />

<div className="relative z-10 mx-auto grid max-w-[1500px] grid-cols-2 items-center gap-12 max-md:grid-cols-1 max-md:gap-8">
            <div>
            <p className="mb-4 text-[16px] font-semibold uppercase tracking-[5px] text-[#f5c542]">
              Hambire Jewellery Schemes
            </p>

<h1 className="font-serif text-[74px] leading-[1.05] max-md:text-[42px]">              Build Wealth. <br />
              Buy Jewellery. <br />
              Save More.
            </h1>

<p className="mt-5 max-w-[650px] text-[20px] leading-8 text-white/75 max-md:text-[16px] max-md:leading-7">
              Explore premium gold and silver schemes designed for advance
              booking, monthly savings, old jewellery exchange and quick metal
              buying.
            </p>

          <div className="mt-8 flex gap-4 max-md:flex-col">
  <button
    onClick={() => {
      const element = document.getElementById("scheme-cards");

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
    }}
    className={`${clickable} rounded-full bg-[#f5c542] px-9 py-4 text-[17px] font-bold text-black shadow-xl max-md:w-full`}
  >
    Explore Schemes
  </button>

  <button
    onClick={() => navigate("/schemes/register?scheme=dashboard")}
    className={`${clickable} rounded-full border border-[#f5c542] px-9 py-4 text-[17px] font-bold text-[#f5c542] shadow-xl hover:bg-[#f5c542] hover:text-black max-md:w-full`}
  >
    View Dashboard
  </button>
</div>
          </div>

<div className="rounded-[40px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl max-md:p-4">
            <div className="rounded-[32px] bg-gradient-to-br from-[#f8d46a] via-[#b9851c] to-[#3b2105] p-[1px]">
             <div className="rounded-[32px] bg-black/80 p-10 max-md:p-6">
                <Coins className="mb-8 h-20 w-20 text-[#f5c542]" />
<h2 className="font-serif text-[42px] max-md:text-[30px]">
  Premium Gold Plans
</h2>                <p className="mt-4 text-[18px] leading-8 text-white/70">
                  Save monthly, exchange old jewellery, or buy gold and silver
                  instantly with live rate calculation.
                </p>

               <div className="mt-8 grid grid-cols-3 gap-4 max-md:grid-cols-1">
                  {["Trust", "Savings", "Growth"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-white/10 px-5 py-6 text-center"
                    >
                      <p className="text-[28px] font-bold text-[#f5c542]">
                        100%
                      </p>
                      <p className="mt-1 text-sm text-white/70">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

<section id="scheme-cards" className="bg-[#fbf7ef] px-8 py-24 text-black max-md:px-4 max-md:py-12">
          <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 text-center">
            <p className="text-[15px] font-bold uppercase tracking-[4px] text-[#b98213]">
              Choose Your Plan
            </p>
            <h2 className="mt-3 font-serif text-[52px] max-md:text-[34px] max-md:leading-tight">
              Jewellery Schemes Designed for You
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1">
            {schemes.map((scheme) => (
              <div
                key={scheme.title}
className={`${clickable} group rounded-[34px] border border-[#ead7ae] bg-white p-8 shadow-xl max-md:p-6`}     >
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#fff3cf] text-[#b98213]">
                  {scheme.icon}
                </div>

                <h3 className="font-serif text-[32px] leading-tight max-md:text-[28px]">
                  {scheme.title}
                </h3>

                <p className="mt-4 min-h-[70px] text-[17px] leading-7 text-gray-600">
                  {scheme.subtitle}
                </p>

                <div className="mt-7 space-y-3">
                  {scheme.points.map((point) => (
                    <div key={point} className="flex items-center gap-3">
                      <BadgePercent className="h-5 w-5 text-[#b98213]" />
                      <span className="text-[16px] text-gray-700">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>

                <button
onClick={() => {
  navigate(scheme.path);

  setTimeout(() => {
    window.scrollTo({
      top: 100,
      behavior: "smooth",
    });
  }, 100);
}}              
className={`${clickable} mt-9 flex w-full items-center justify-center gap-3 rounded-full bg-black px-6 py-4 text-[16px] font-bold text-white group-hover:bg-[#b98213]`}                >
                  Explore Scheme <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

         <div className="mt-14 grid grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-4">
            {[
              ["50+", "Years Trust"],
              ["100%", "Secure Process"],
              ["Live", "Gold & Silver Rates"],
              ["Easy", "Joining Process"],
            ].map(([value, label]) => (
              <div
                key={label}
className="rounded-[28px] bg-[#111] px-8 py-9 text-center text-white max-md:px-4 max-md:py-6"              >
                <h3 className="text-[38px] font-bold text-[#f5c542]">
                  {value}
                </h3>
                <p className="mt-2 text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Schemes;