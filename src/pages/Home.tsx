import { useEffect, useState } from "react";
import hjIcone from "../assets/hjicone.png";

const banners = [
  {
    type: "image",
    color1: "#0f172a",
    color2: "#1e293b",
    title: "MAKE YOUR DREAMS",
    subTitle: "Luxury Gold Collections",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600",
  },

  {
    type: "image",
    color1: "#7c2d12",
    color2: "#ea580c",
    title: "FLAT 20% OFF",
    subTitle: "On Making Charges",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600",
  },

  {
    type: "video",
    color1: "#000000",
    color2: "#111111",
    title: "HAMBIRE SIGNATURE",
    subTitle: "Timeless Diamond Jewellery",
    video:
      "https://videos.pexels.com/video-files/855341/855341-hd_1920_1080_25fps.mp4",
  },

  {
    type: "image",
    color1: "#4c1d95",
    color2: "#9333ea",
    title: "NEW ARRIVALS",
    subTitle: "Exclusive Bridal Jewellery",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600",
  },
];

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
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=900",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=900",
    ],
  },
  {
    title: "Pendants",
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900",
    ],
  },
  {
    title: "Rings",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=900",
    ],
  },
  {
    title: "Earrings",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900",
    ],
  },
  {
    title: "Bangles",
    images: [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900",
      "https://images.unsplash.com/photo-1619119069152-a2b331eb392a?w=900",
    ],
  },
  {
    title: "Mangalsutra",
    images: [
      "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=900",
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=900",
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

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const banner = banners[active];

  return (
    <div className="w-full bg-[#f8f8f8]">
      <section className="relative h-[520px] w-full overflow-hidden bg-black">
        <div className="relative h-[720px] w-full overflow-hidden">
          {/* VIDEO */}
          {banner.type === "video" ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={banner.video} type="video/mp4" />
            </video>
          ) : (
            <img
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/45" />

          {/* CONTENT */}
          <div className="relative z-20 mx-auto flex h-full max-w-[1450px] items-center px-16">
            <div className="max-w-[700px]">
              <p className="text-[20px] font-medium tracking-wide text-white/90">
                Hambire Jewellery Exclusive
              </p>

              <h1 className="mt-4 text-[78px] font-extrabold leading-[1.05] text-white">
                {banner.title}
              </h1>

              <p className="mt-5 text-[32px] font-light text-white/90">
                {banner.subTitle}
              </p>

              <button className="mt-10 rounded-full bg-white px-12 py-5 text-[18px] font-bold text-black transition-all duration-300 hover:scale-105">
                SHOP NOW
              </button>
            </div>
          </div>

          {/* DOTS */}
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
          <div className="mx-auto grid max-w-[1700px] grid-cols-3 gap-8">
            <div>
              <div className="group overflow-hidden rounded-xl cursor-pointer">
                {" "}
                <img
                  src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=900"
                  alt="Diamond Jewellery"
                  className="h-[640px] w-full cursor-pointer object-cover transition-transform duration-700 group-hover:scale-110"
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
                    src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900"
                    alt="Gold Jewellery"
                    className="h-[290px] w-full cursor-pointer object-cover transition-transform duration-700 group-hover:scale-110"
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
                    src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900"
                    alt="Gemstone Jewellery"
                    className="h-[290px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                  src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900"
                  alt="Platinum Jewellery"
                  className="h-[640px] w-full cursor-pointer object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <h3 className="mt-3 text-center font-serif text-[22px] text-black">
                Platinum Jewellery
              </h3>
            </div>
          </div>
          <div className="mt-6 flex justify-center pb-2">
            {" "}
            <button className="rounded-md border border-[#d7264b] px-20 py-4 text-[17px] font-medium text-[#d7264b] hover:bg-[#d7264b] hover:text-white">
              Discover More
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#fcfcfc] px-6 ">
        <div className="relative z-20">
          <div className="mx-auto max-w-[1450px] px-10 py-14">
            {" "}
            <div className="mb-8 pt-0 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="h-[1.5px] w-[100px] bg-[#ef9541]" />

                <img
                  src={hjIcone}
                  alt="HJ Logo"
                  className="h-[50px] w-auto object-contain "
                />

                <div className="h-[1.5px] w-[100px] bg-[#ef9541]" />
              </div>

              <h2 className="mt-2 text-[38px] font-serif tracking-wide text-[#0f172a]">
                COLLECTIONS
              </h2>

              <p className="mt-3 text-[18px] text-gray-700">
                Find your style. Explore our diverse collections!
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-[1320px] grid-cols-3 gap-10">
              {" "}
              {collections.map((item, index) => (
                <div
                  key={item.title}
                  className={`group relative overflow-hidden rounded-[24px] bg-white shadow-xl cursor-pointer ${
                    index === 1 ? "-translate-y-10" : "translate-y-4"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-[360px] w-full cursor-pointer object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-black/10" />

                  <div className="absolute bottom-8 right-8 text-right">
                    <h2 className="text-[36px] font-light tracking-[8px] text-white">
                      {item.title}
                    </h2>
                    <p className="text-[13px] tracking-[3px] text-white">
                      COLLECTIONS
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <button className="rounded-md border border-[#d7264b] px-10 py-4 text-[17px] font-medium text-[#d7264b] hover:bg-[#d7264b] hover:text-white">
                View All Collection
              </button>
            </div>
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
        <div className="mx-auto grid max-w-[1500px] grid-cols-3 gap-x-5 gap-y-2">
          {" "}
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
    </div>
  );
};

export default Home;
