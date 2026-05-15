import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    color1: "#ff650f",
    color2: "#ff9a55",
    title: "FLAT 20% OFF",
    subTitle: "on making charges",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700",
  },
  {
    color1: "#a84cff",
    color2: "#d58cff",
    title: "UP TO 75% OFF",
    subTitle: "Diamond Jewellery",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700",
  },
  {
    color1: "#fff000",
    color2: "#fff8a8",
    title: "NEW ARRIVALS",
    subTitle: "Gold Collection",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=700",
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
    <div className="w-full bg-[#e4e9e8]">
      <section
        className="relative min-h-[920px] overflow-hidden"
        style={{
          background: `
            linear-gradient(
              to bottom,
              ${banner.color1} 0%,
              ${banner.color1} 28%,
              ${banner.color2} 48%,
              #f1c3a4 62%,
              #e4e9e8 78%,
              #e4e9e8 100%
            )
          `,
        }}
      >
        <button
          onClick={() =>
            setActive((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
          }
          className="absolute left-8 top-[250px] z-30 text-black"
        >
          <ChevronLeft size={52} strokeWidth={1.5} />
        </button>

        <button
          onClick={() => setActive((prev) => (prev + 1) % banners.length)}
          className="absolute right-8 top-[250px] z-30 text-black"
        >
          <ChevronRight size={52} strokeWidth={1.5} />
        </button>

        <div className="mx-auto flex max-w-[1350px] items-center justify-center gap-20 pt-8">
          <div className="text-left">
            <p className="text-[16px] font-semibold text-white">
              Hambire Jewellery Special Sale
            </p>

            <h1 className="mt-2 text-[46px] font-extrabold leading-tight text-white">
              {banner.title}
            </h1>

            <p className="mt-1 text-[28px] font-medium text-white">
              {banner.subTitle}
            </p>

            <button className="mt-5 rounded-full bg-white px-8 py-3 text-[15px] font-bold text-black shadow-md">
              SHOP NOW
            </button>
          </div>

          <img
            src={banner.image}
            alt={banner.title}
            className="h-[220px] w-[330px] rounded-2xl object-cover shadow-2xl"
          />
        </div>

        <div className="absolute bottom-10 left-0 right-0 z-20">
          <div className="mb-7 text-center">
            <h2 className="text-[36px] font-serif text-[#0f172a]">
              COLLECTIONS
            </h2>
            <p className="mt-2 text-[18px] text-gray-700">
              Find your style. Explore our diverse collections!
            </p>
          </div>{" "}
          <div className="mx-auto  mt-16 grid max-w-[1700px] grid-cols-3 gap-8 px-10">
            {collections.map((item, index) => (
              <div
                key={item.title}
                className={`relative overflow-hidden rounded-[24px] bg-white shadow-xl ${
                  index === 1 ? "-translate-y-10" : "translate-y-4"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[360px] w-full object-cover"
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
      </section>
    </div>
  );
};

export default Home;
