import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/categoryApi";
import type { Category } from "../../types/category";

const SubCategoryHorizontalSlider = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    loadCategories();
  }, []);

  const duplicatedCategories = useMemo(() => {
    if (categories.length === 0) return [];
    return [...categories, ...categories];
  }, [categories]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || categories.length === 0) return;

    const timer = setInterval(() => {
      const step = 260;

      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 2500);

    return () => clearInterval(timer);
  }, [categories]);

  const handlePrev = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -260, behavior: "smooth" });
  };

  const handleNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: 260, behavior: "smooth" });
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-[#eee3d8] bg-[#fbf5f0]">
      <div className="mx-auto max-w-[1700px] px-10 py-5">
        <div className="flex items-center gap-5">
          <button
            onClick={handlePrev}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#e9c4a2] bg-transparent text-[#2f2f2f] transition hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <div
            ref={scrollRef}
            className="no-scrollbar flex flex-1 gap-4 overflow-x-auto scroll-smooth"
          >
            {duplicatedCategories.map((category, index) => (
              <Link
                key={`${category.categoryId}-${index}`}
                to={`/category/${category.slug}`}
                className="flex h-[72px] min-w-[220px] items-center gap-3 rounded-[4px] border border-[#efc7a6] bg-white px-5 transition hover:bg-[#fffaf6]"
              >
                <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center">
                  <img
                    src={
                      category.imageUrl ||
                      "https://via.placeholder.com/34x34?text=C"
                    }
                    alt={category.categoryName}
                    className="max-h-[34px] max-w-[34px] object-contain"
                  />
                </div>

                <div className="line-clamp-2 text-[16px] font-normal text-[#353535]">
                  {category.categoryName}
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#e9c4a2] bg-transparent text-[#2f2f2f] transition hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SubCategoryHorizontalSlider;
