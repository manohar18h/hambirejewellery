import { useEffect, useState } from "react";
import axios from "axios";

type BannerSlide = {
  bannerId: number;
  title: string;
  subTitle: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  sortOrder: number;
  activeStatus: boolean;
};

const HomeBannerSlider = () => {
  const [banners, setBanners] = useState<BannerSlide[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners]);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        "https://api.hambirejewellery.com/api/catalog/banners"
      );

      setBanners(response.data);
    } catch (error) {
      console.error("Banner fetch failed", error);
    }
  };

  if (banners.length === 0) {
    return (
      <section className="flex h-[260px] md:h-[420px] lg:h-[560px] items-center justify-center bg-black text-white">
        Loading banners...
      </section>
    );
  }

  const banner = banners[active];

  return (
    <section className="relative h-[260px] md:h-[420px] lg:h-[560px] w-full overflow-hidden bg-black">
      {banner.mediaType === "VIDEO" ? (
        <video
          key={banner.bannerId}
          src={banner.mediaUrl}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img
          key={banner.bannerId}
          src={banner.mediaUrl}
          alt={banner.title}
          className="h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute left-[7%] top-1/2 z-20 max-w-[560px] -translate-y-1/2 text-white">
        <h1 className="text-[26px] font-extrabold leading-tight md:text-[40px] lg:text-[56px]">
          {banner.title}
        </h1>

        <p className="mt-3 text-[14px] font-medium md:text-[20px] lg:text-[24px]">
          {banner.subTitle}
        </p>

        <button className="mt-6 rounded-full bg-white px-7 py-3 text-[14px] font-bold text-black shadow-lg md:px-10 md:py-4 md:text-[17px]">
          SHOP NOW
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              active === index
                ? "w-10 bg-white"
                : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeBannerSlider;