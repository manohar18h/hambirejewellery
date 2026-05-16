import { useEffect, useState } from "react";

type BannerSlide = {
  id: number;
  title: string;
  subTitle: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
};

const staticBanners: BannerSlide[] = [
  {
    id: 1,
    title: "Make your dreams a reality with Gold",
    subTitle: "Premium jewellery for every occasion",
    mediaUrl:
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=1800",
    mediaType: "IMAGE",
  },
  {
    id: 2,
    title: "New Bridal Collection",
    subTitle: "Crafted for your special day",
    mediaUrl:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1800",
    mediaType: "IMAGE",
  },
  {
    id: 3,
    title: "Shine brighter with Hambire",
    subTitle: "Gold, diamond and gemstone collections",
    mediaUrl:
      "https://videos.pexels.com/video-files/855341/855341-hd_1920_1080_25fps.mp4",
    mediaType: "VIDEO",
  },
  {
    id: 4,
    title: "Flat 20% Off",
    subTitle: "On making charges",
    mediaUrl:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1800",
    mediaType: "IMAGE",
  },
];

const HomeBannerSlider = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % staticBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const banner = staticBanners[active];

  return (
    <section className="relative h-[560px] w-full overflow-hidden bg-black">
      {banner.mediaType === "VIDEO" ? (
        <video
          key={banner.id}
          src={banner.mediaUrl}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img
          key={banner.id}
          src={banner.mediaUrl}
          alt={banner.title}
          className="h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute left-[7%] top-1/2 z-20 max-w-[560px] -translate-y-1/2 text-white">
        <h1 className="text-[48px] font-extrabold leading-tight">
          {banner.title}
        </h1>
        <p className="mt-3 text-[24px] font-medium">{banner.subTitle}</p>
        <button className="mt-8 rounded-full bg-white px-10 py-4 text-[17px] font-bold text-black shadow-lg">
          SHOP NOW
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-3">
        {" "}
        {staticBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`h-2 rounded-full transition-all ${
              active === index ? "w-10 bg-white" : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeBannerSlider;
