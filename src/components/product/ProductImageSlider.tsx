import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  alt: string;
  autoSlide?: boolean;
};

const ProductImageSlider = ({ images, alt, autoSlide = false }: Props) => {
  const validImages = images.filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  useEffect(() => {
    if (!autoSlide || validImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [autoSlide, validImages.length]);

  if (validImages.length === 0) {
    return (
      <img
        src="https://via.placeholder.com/500x500?text=Product"
        alt={alt}
        className="h-[320px] w-full object-cover"
      />
    );
  }

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  return (
    <div className="relative">
      <img
        src={validImages[currentIndex]}
        alt={alt}
        className="h-[320px] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
      />

      {validImages.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          </button>

          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow hover:bg-white"
          >
            <ChevronRight className="h-4 w-4 text-gray-700" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
            {validImages.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-1.5 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductImageSlider;
