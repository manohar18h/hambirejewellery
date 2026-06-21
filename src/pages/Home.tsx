import { useEffect, useState } from "react";
import hjIcone from "../assets/hjicone.png";
import diamond from "../assets/diamondimage.png"
import gold from "../assets/goldimage.png"
import jewelleryset1 from "../assets/jewelleryset1.png"
import jewelleryset2 from "../assets/jewelleryset2.png"
import jewelleryset3 from "../assets/jewelleryset3.png"
import pendent1 from "../assets/pendent1.png"
import pendent2 from "../assets/pendent2.png"
import pendent3 from "../assets/pendent3.png"
import ring1 from "../assets/ring1.png"
import ring2 from "../assets/ring2.png"
import ring3 from "../assets/ring3.png"
import women from "../assets/women.png"
import men from "../assets/men.png"
import kid from "../assets/kid.png"
import earring1 from "../assets/earring1.png"
import earring2 from "../assets/earring2.png"
import earring3 from "../assets/earring3.png"
import bangle1 from "../assets/bangle1.png"
import bangle2 from "../assets/bangle2.png"
import bangle3 from "../assets/bangle3.png"
import mangal1 from "../assets/mangal1.png"
import mangal2 from "../assets/mangal2.png"
import mangal3 from "../assets/mangal3.png"
import gemstone from "../assets/gemstoneimage.png"
import platinum from "../assets/platinumimage.png"
import hallmark from "../assets/hallmark.png";
import certified from "../assets/certified2.png";
import easyexchange from "../assets/easyexchange.png";
import service from "../assets/service.png";
import hjlogo from "../assets/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Instagram, Facebook, Youtube, MessageCircle } from "lucide-react";
type BannerSlide = {
  bannerId: number;
  title: string;
  subTitle: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  sortOrder: number;
  activeStatus: boolean;
};


const collections = [
  {
    title: "BELLA",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=700",
  },
  {
    title: "AMOLI",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700",
  },
  {
    title: "YUVA",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700",
  },
];
const shopCategories = [
  {
    title: "Jewellery Sets",
  images: [
  jewelleryset1,
  jewelleryset2,
  jewelleryset3,
],
  },
  {
    title: "Pendants",
     images: [
  pendent1,
  pendent2,
  pendent3,
],
  },
  {
    title: "Rings",
     images: [
  ring1,
  ring2,
  ring3,
],
  },
  {
    title: "Earrings",
    images: [
      earring1,
      earring2,
      earring3
    ],
  },
  {
    title: "Bangles",
    images: [
      bangle1,
      bangle2,
      bangle3
    ],
  },
  {
    title: "Mangalsutra",
    images: [
      mangal1,
      mangal2,
      mangal3
    ],
  },
];

const SlidingCategoryCard = ({
  title,
  images,
  delay = 2500,
}: {
  title: string;
  images: string[];
  delay?: number;
}) => {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setPrevIndex(index);
      setIndex((prev) => (prev + 1) % images.length);
    }, delay);

    return () => clearInterval(timer);
  }, [images.length, delay, index]);

  return (
    <div>
      <div className="relative h-[220px] w-full cursor-pointer overflow-hidden rounded-[20px] bg-[#f8f8f8]">
        {" "}
        {prevIndex !== null && (
          <img
            key={`prev-${prevIndex}`}
            src={images[prevIndex]}
            alt={title}
            className="absolute inset-0 h-full w-full cursor-pointer animate-oldSlideOut object-cover"
          />
        )}
        <img
          key={`current-${index}`}
          src={images[index]}
          alt={title}
          className="absolute inset-0 h-full w-full cursor-pointer animate-newSlideIn object-cover"
        />
      </div>

      <h3 className="mt-2 text-center font-serif text-[16px] text-[#222]">
        {" "}
        {title}
      </h3>
    </div>
  );
};



const Home = () => {
const [active, setActive] = useState(0);
const [banners, setBanners] = useState<BannerSlide[]>([]);
const navigate = useNavigate();

useEffect(() => {
  axios
    .get("https://api.hambirejewellery.com/api/catalog/banners")
    .then((res) => {
const sorted = (res.data || [])
  .filter((banner: BannerSlide) => banner.activeStatus)
  .sort(
    (a: BannerSlide, b: BannerSlide) =>
      a.sortOrder - b.sortOrder
  );

setBanners(sorted);      setActive(0);
    })
    .catch((err) => console.error("Banner fetch failed", err));
}, []);


 useEffect(() => {
  if (banners.length === 0) return;

  const timer = setInterval(() => {
    setActive((prev) => (prev + 1) % banners.length);
  }, 3000);

  return () => clearInterval(timer);
}, [banners.length]);

  if (banners.length === 0) {
  return <div className="h-[520px] bg-black text-white">Loading banners...</div>;
}

const banner =
  banners[active] ??
  banners[0] ?? {
    bannerId: 0,
    title: "",
    subTitle: "",
    mediaUrl: "",
    mediaType: "IMAGE",
    sortOrder: 0,
    activeStatus: true,
  };

  return (
    <div className="w-full bg-[#f8f8f8] max-md:pb-[75px]">

<section className="relative h-[600px] w-full overflow-hidden bg-black max-md:h-[300px]">
  <div className="relative h-full w-full overflow-hidden">
    {banner.mediaType === "VIDEO" ? (
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-contain"
      >
        <source src={banner.mediaUrl} type="video/mp4" />
      </video>
    ) : (
      <img
        src={banner.mediaUrl}
        alt={banner.title}
        className="absolute inset-0 h-full w-full object-contain"
      />
    )}

    <div className="absolute inset-0 bg-black/20" />

    <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">
      {banners.map((_, index) => (
        <button
          key={index}
          onClick={() => setActive(index)}
          className={`h-3 rounded-full transition-all duration-300 ${
            active === index
              ? "w-10 bg-white"
              : "w-3 bg-white/50 hover:bg-white"
          }`}
        />
      ))}
    </div>
  </div>
</section>
      <section className="bg-[#fcfcfc] px-6">
        <div className="mx-auto max-w-[1450px] px-10 py-10">
          {" "}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1.5px] w-[100px] bg-[#ef9541]" />

              <img
                src={hjIcone}
                alt="HJ Logo"
                className="h-[50px] w-auto object-contain"
              />

              <div className="h-[1.5px] w-[100px] bg-[#ef9541]" />
            </div>
            <h2 className="text-[38px] font-serif tracking-wide text-[#0f172a]">
              EXPLORE JEWELLERY
            </h2>

            <p className="mt-3 text-[18px] text-gray-700">
              Discover exquisite pieces for every style. Start shopping!
            </p>
          </div>
          <div className="mx-auto grid max-w-[1700px] grid-cols-3 gap-8 max-md:grid-cols-1 max-md:gap-5">
            <div>
              <div className="group overflow-hidden rounded-xl cursor-pointer">
                {" "}
                <img
                  src={diamond}
                  alt="Diamond Jewellery"
                  className="h-[540px] w-full max-md:h-[260px] cursor-pointer object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <h3 className="mt-3 text-center font-serif text-[22px] text-black">
                Diamond Jewellery
              </h3>
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <div className="group overflow-hidden rounded-xl cursor-pointer">
                  {" "}
                  <img
                    src={gold}
                    alt="Gold Jewellery"
                    className="h-[230px] w-full cursor-pointer object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <h3 className="mt-3 text-center font-serif text-[22px] text-black">
                  Gold Jewellery
                </h3>
              </div>

              <div>
                <div className="group overflow-hidden rounded-xl cursor-pointer">
                  {" "}
                  <img
                    src={gemstone}
                    alt="Gemstone Jewellery"
                    className="h-[230px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <h3 className="mt-3 text-center font-serif text-[22px] text-black">
                  Gemstone Jewellery
                </h3>
              </div>
            </div>

            <div>
              <div className="group overflow-hidden rounded-xl cursor-pointer">
                {" "}
                <img
                src = {platinum}
                  alt="Platinum Jewellery"
                  className="h-[540px] w-full max-md:h-[260px] cursor-pointer object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <h3 className="mt-3 text-center font-serif text-[22px] text-black">
                Silver Jewellery
              </h3>
            </div>
          </div>
          <div className="mt-3 flex justify-center pb-0">
            {" "}
            <button className="rounded-md border border-[#d7264b] px-20 py-4 text-[17px] font-medium text-[#d7264b] hover:bg-[#d7264b] hover:text-white">
              Discover More
            </button>
          </div>
        </div>
      </section>

         <div className="mx-auto max-w-[1450px] px-10 py-10">
        {" "}
        <div className="mb-6 text-center">
          {" "}
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1.5px] w-[100px] bg-[#ef9541]" />

            <img
              src={hjIcone}
              alt="HJ Logo"
              className="h-[50px] w-auto object-contain"
            />

            <div className="h-[1.5px] w-[100px] bg-[#ef9541]" />
          </div>
          <h2 className="mt-2 text-[28px] font-serif tracking-wide text-[#0f172a]">
            SHOP BY CATEGORY
          </h2>
          <p className=" text-[16px] text-gray-700">
            Explore our diverse selections. Find your style
          </p>
        </div>
        <div className="mx-auto grid max-w-[1500px] grid-cols-3 gap-x-5 gap-y-2 max-md:grid-cols-2 max-md:gap-4">
          {shopCategories.map((category, index) => {
            const delays = [4100, 5200, 2500, 6900, 2500, 5200];

            return (
              <SlidingCategoryCard
                key={category.title}
                title={category.title}
                images={category.images}
                delay={delays[index]}
              /> 
            );
          })}
        </div>
        <div className="mt-4 flex justify-center">
          <button className="rounded-md border border-[#d7264b] px-15 py-2 text-[17px] font-medium text-[#d7264b] hover:bg-[#d7264b] hover:text-white">
            View All Categories
          </button>
        </div>
      </div>

      {/* SHOP BY GENDER */}
      <div className="mx-auto mt-5 max-w-[1450px] px-10 pb-14">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1.5px] w-[80px] bg-[#ef9541]" />

            <img
              src={hjIcone}
              alt="HJ Logo"
              className="h-[42px] w-auto object-contain"
            />

            <div className="h-[1.5px] w-[80px] bg-[#ef9541]" />
          </div>

          <h2 className="mt-2 text-[34px] font-serif tracking-wide text-[#0f172a]">
            SHOP BY GENDER
          </h2>
        </div>

<div className="mx-auto grid max-w-[1500px] grid-cols-3 gap-6 items-end max-md:grid-cols-1 max-md:gap-8">          {/* WOMEN */}
<div className="group cursor-pointer translate-y-6 max-md:translate-y-0">            <div className="overflow-hidden rounded-[24px]">
              <img
                src={women}
                alt="Women's Jewellery"
                className="h-[480px] w-full max-md:h-[330px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <h3 className="mt-2 text-center font-serif text-[18px] text-[#d7264b]">
              Women's Jewellery
            </h3>
          </div>
          {/* MEN */}
          <div className="group cursor-pointer -translate-y-6 max-md:translate-y-0">
            <div className="overflow-hidden rounded-[24px]">
              <img
                src={men}
                alt="Men's Jewellery"
                className="h-[480px] w-full max-md:h-[330px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <h3 className="mt-2 text-center font-serif text-[18px] text-[#d7264b]">
              Men's Jewellery
            </h3>
          </div>
          {/* KIDS */}
          <div className="group cursor-pointer translate-y-6 max-md:translate-y-0">
            <div className="overflow-hidden rounded-[24px]">
              <img
                src={kid}
                alt="Kid's Jewellery"
                className="h-[480px] w-full max-md:h-[330px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <h3 className="mt-2 text-center font-serif text-[18px] text-[#d7264b]">
              Kid's Jewellery
            </h3>
          </div>
        </div>
      </div>

  <section className=" mt-16 bg-[#0d0702] px-10 py-20 text-white">
<div className="mx-auto grid max-w-[1500px] grid-cols-2 items-center gap-14 max-md:grid-cols-1">    <div>
      <p className="text-[30px] font-bold uppercase tracking-[5px] text-[#f5c542]">
        Hambire Gold Schemes
      </p>

      <h2 className="mt-4 font-serif text-[56px] leading-tight">
        Save Gold. <br />
        Buy Jewellery. <br />
        Grow Securely.
      </h2>

      <p className="mt-6 max-w-[650px] text-[19px] leading-8 text-white/70">
        Explore our premium jewellery saving schemes including Pre-Booking,
        11 Month Flexi Plan and Quick Buy Gold & Silver Wallet.
      </p>

   

      <button

      onClick={() => {
  navigate("/schemes");

  setTimeout(() => {
    window.scrollTo({
      top: 100,
      behavior: "smooth",
    });
  }, 100);
}}

       className="mt-9 rounded-full bg-[#f5c542] px-10 py-4 text-[17px] font-bold text-black transition hover:scale-105"
      >
        Explore Gold Schemes
      </button>
    </div>

    <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
      {[
        ["Pre-Booking", "Exchange old gold or book jewellery in advance."],
        ["Flexi 11 Plan", "Pay monthly and enjoy jewellery benefits."],
        ["Quick Buy", "Buy gold or silver by amount anytime."],
        ["Metal Wallet", "Save your gold and silver balance securely."],
      ].map(([title, desc]) => (
        <div
          key={title}
          className="rounded-[28px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl"
        >
          <h3 className="font-serif text-[26px] text-[#f5c542]">
            {title}
          </h3>

          <p className="mt-4 text-[16px] leading-7 text-white/65">
            {desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

      <section className="mt-5 w-full ">
        {/* TITLE */}
        <div className="mb-8 text-center">
          <div className="mb-3 pt-0 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1.5px] w-[100px] bg-[#ef9541]" />

              <img
                src={hjIcone}
                alt="HJ Logo"
                className="h-[50px] w-auto object-contain "
              />

              <div className="h-[1.5px] w-[100px] bg-[#ef9541]" />
            </div>
          </div>
          <h2 className="text-[42px] font-serif text-[#0f172a]">
            QUALITY-FIRST SERVICE
          </h2>

          <p className="mt-2 text-[18px] text-gray-700">
            We assure you that you will get what you can trust. Always!
          </p>
        </div>

        {/* VIDEO */}
        <div className="overflow-hidden">
          <video
            className="h-[420px] w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls
          >
            <source
              src="https://videos.pexels.com/video-files/4624243/4624243-hd_1920_1080_25fps.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>
    
      <section className="bg-[#fcfcfc] px-6 py-16 -mt-12 max-md:px-3 max-md:py-10 max-md:mt-0">
        <div className="relative mx-auto max-w-[1500px] px-10 py-10 max-md:px-0 max-md:py-4">
<div className="relative rounded-[36px] border border-[#cfc8c1] bg-[#fbfaf7] px-10 py-16 max-md:px-5 max-md:py-12">            {/* TOP LEFT CURVE */}
            <div className="absolute left-[70px] top-[-1px] h-[46px] w-[90px] rounded-b-[50px] border-b border-l border-r border-[#cfc8c1] bg-[#fcfcfc]" />

            {/* TOP RIGHT CURVE */}
            <div className="absolute right-[70px] top-[-1px] h-[46px] w-[90px] rounded-b-[50px] border-b border-l border-r border-[#cfc8c1] bg-[#fcfcfc]" />

            {/* BOTTOM LEFT CURVE */}
            <div className="absolute bottom-[-1px] left-[70px] h-[46px] w-[90px] rounded-t-[50px] border-l border-r border-t border-[#cfc8c1] bg-[#fcfcfc]" />

            {/* BOTTOM RIGHT CURVE */}
            <div className="absolute bottom-[-1px] right-[70px] h-[46px] w-[90px] rounded-t-[50px] border-l border-r border-t border-[#cfc8c1] bg-[#fcfcfc]" />

            <div className="relative z-10 text-center">
              <h2 className="font-serif text-[46px] text-[#3b1111] max-md:text-[34px] max-md:leading-tight">
                The Hambire Assurance
              </h2>

              <p className="mt-2 text-[22px] text-gray-600">
                Crafted by experts, cherished by you.
              </p>
            </div>

            <div className="relative z-10 mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
              {[
                {
                  image: hallmark,
                  title: "Purity\nGuarantee",
                },
                {
                  image: service,
                  title: "Lifetime\nMaintenance",
                },
                {
                  image: certified,
                  title: "Certified\nJewellery",
                },

                {
                  image: easyexchange,
                  title: "Easy\nExchange",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex items-center justify-center ">
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`object-contain ${
                        item.title === "Easy\nExchange"
                          ? "h-[65px] w-[65px]"
                          : "h-[80px] w-[80px]"
                      }`}
                    />
                  </div>

                  <h3 className="mt-3 whitespace-pre-line font-serif text-[20px] leading-tight text-[#3b1111] max-md:text-[17px]">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#fcfcfc] px-10 py-12 -mt-20">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1.5px] w-[80px] bg-[#ef9541]" />
              <img
                src={hjIcone}
                alt="HJ Logo"
                className="h-[42px] w-auto object-contain"
              />
              <div className="h-[1.5px] w-[80px] bg-[#ef9541]" />
            </div>

            <h2 className="mt-2 text-[34px] font-serif tracking-wide text-[#0f172a]">
              FOLLOW US ON INSTAGRAM
            </h2>

            <p className="mt-2 text-[17px] text-gray-700">
              Stay Updated with Our Stories and Updates on Instagram
            </p>
          </div>

         <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
            <div className="flex flex-col gap-6">
              <img
                src={jewelleryset2}
                className="h-[280px] w-full rounded-xl object-cover"
              />

              <img
                src={earring1}
                className="h-[280px] w-full rounded-xl object-cover"
              />
            </div>

            <video
              autoPlay
              muted
              loop
              playsInline
              controls
              className="h-[586px] w-full rounded-xl object-cover"
            >
              <source
                src="https://videos.pexels.com/video-files/855341/855341-hd_1920_1080_25fps.mp4"
                type="video/mp4"
              />
            </video>

            <div className="flex flex-col gap-6">
              <img
              src={bangle1}
                className="h-[280px] w-full rounded-xl object-cover"
              />

              <img
              src={ring2}
                className="h-[280px] w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#fcfcfc] px-15 py-20 max-md:px-5 max-md:py-10">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 items-center gap-16 max-md:grid-cols-1">
          {/* LEFT IMAGES */}
          <div className="relative flex items-center max-md:block max-md:overflow-hidden">
            <img
            src={jewelleryset2}
              alt=""
className="h-[450px] w-[380px] rounded-[26px] object-cover shadow-lg max-md:h-[300px] max-md:w-full"            />

            <img
            src={pendent2}
              alt=""
className="absolute left-[320px] top-8 h-[400px] w-[340px] rounded-[26px] object-cover shadow-2xl max-md:hidden"            />
          </div>

          {/* RIGHT CONTENT */}
         <div className="max-w-[620px] max-md:text-center">
<h2 className="text-[30px] font-serif leading-tight text-[#111827] max-md:text-[26px]">
                Need help in choosing the best Jewellery?
            </h2>

           <p className="mt-4 text-[20px] leading-[30px] text-gray-700 max-md:text-[16px] max-md:leading-7">
              Hambire Jewellery is a premium shopping destination for gold and
              diamond jewellery dedicated to embellishing your everyday moments
              and milestones with elegance.
            </p>

           <div className="mt-8 flex items-center gap-5 max-md:flex-col">
              <button
                className="
            rounded-md bg-[#c91f3a]
            px-10 py-4
            text-[18px] font-semibold text-white
            transition hover:bg-[#a71931]
          "
              >
                Store Locator
              </button>

              <button
                className="
            rounded-md border border-[#c91f3a]
            px-10 py-4
            text-[18px] font-semibold text-[#c91f3a]
            transition hover:bg-[#fff5f7]
          "
              >
                Request Call Back
              </button>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-[#111111] text-white">
        {/* TOP FOOTER */}
        <div className="mx-auto grid max-w-[1500px] grid-cols-4 gap-14 px-10 py-16 max-md:grid-cols-1 max-md:px-5">
          {/* LOGO + ABOUT */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src={hjlogo}
                alt="Hambire"
                className="h-[70px] w-[70px] object-contain"
              />

              <div>
                <h2 className="text-[34px] font-bold text-[#FE7F00]">
                  Hambire
                </h2>

                <p className="tracking-[5px] text-gray-400">JEWELLERY</p>
              </div>
            </div>

            <p className="mt-6 text-[15px] leading-8 text-gray-400">
              Hambire Jewellery brings timeless elegance with premium gold,
              diamond, silver and bridal collections crafted for every special
              moment.
            </p>

            {/* SOCIAL */}
            <div className="mt-7 flex gap-4">
              <div className="cursor-pointer rounded-full bg-[#1f1f1f] p-3 text-gray-300 transition hover:bg-[#FE7F00] hover:text-white">
                <Instagram className="h-5 w-5" />
              </div>

              <div className="cursor-pointer rounded-full bg-[#1f1f1f] p-3 text-gray-300 transition hover:bg-[#FE7F00] hover:text-white">
                <Facebook className="h-5 w-5" />
              </div>

              <div className="cursor-pointer rounded-full bg-[#1f1f1f] p-3 text-gray-300 transition hover:bg-[#FE7F00] hover:text-white">
                <Youtube className="h-5 w-5" />
              </div>

              <div className="cursor-pointer rounded-full bg-[#1f1f1f] p-3 text-gray-300 transition hover:bg-[#FE7F00] hover:text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="mb-6 text-[22px] font-semibold text-white">
              Quick Links
            </h3>

            <div className="flex flex-col gap-4 text-gray-400">
              <a className="hover:text-[#FE7F00]">Home</a>
              <a className="hover:text-[#FE7F00]">Collections</a>
              <a className="hover:text-[#FE7F00]">Gold Scheme</a>
              <a className="hover:text-[#FE7F00]">Offers</a>
              <a className="hover:text-[#FE7F00]">About Us</a>
              <a className="hover:text-[#FE7F00]">Contact Us</a>
            </div>
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="mb-6 text-[22px] font-semibold text-white">
              Jewellery
            </h3>

            <div className="flex flex-col gap-4 text-gray-400">
              <a className="hover:text-[#FE7F00]">Gold Jewellery</a>
              <a className="hover:text-[#FE7F00]">Diamond Jewellery</a>
              <a className="hover:text-[#FE7F00]">Silver Jewellery</a>
              <a className="hover:text-[#FE7F00]">Bridal Collections</a>
              <a className="hover:text-[#FE7F00]">Men's Jewellery</a>
              <a className="hover:text-[#FE7F00]">Kids Jewellery</a>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="mb-6 text-[22px] font-semibold text-white">
              Contact Us
            </h3>

            <div className="space-y-5 text-gray-400">
              <p>📍 Hambire Jewellery, Hyderabad, India</p>

              <p>📞 +91 98765 43210</p>

              <p>✉️ support@hambirejewellery.com</p>

              <p>🕒 Mon - Sun : 10 AM - 9 PM</p>
            </div>

            {/* NEWSLETTER */}
            <div className="mt-8">
              <p className="mb-3 text-[16px] text-white">
                Subscribe Newsletter
              </p>

              <div className="flex overflow-hidden rounded-full bg-white">
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="w-full px-5 py-3 text-black outline-none"
                />

                <button className="bg-[#FE7F00] px-6 font-semibold text-white">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE LINE */}
        <div className="h-[1px] w-full bg-[#2d2d2d]" />

        {/* BOTTOM FOOTER */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-10 py-6 text-[14px] text-gray-400">
          <p>© 2026 Hambire Jewellery. All Rights Reserved.</p>

          <div className="flex items-center gap-6">
            <span className="hover:text-[#FE7F00] cursor-pointer">
              Privacy Policy
            </span>

            <span className="hover:text-[#FE7F00] cursor-pointer">
              Terms & Conditions
            </span>

            <span className="hover:text-[#FE7F00] cursor-pointer">
              Shipping Policy
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
