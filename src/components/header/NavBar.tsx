import { useEffect, useState } from "react";
import { getCategories } from "../../api/categoryApi";
import { getSubCategoriesByCategory } from "../../api/subCategoryApi";
import type { Category } from "../../types/category";
import type { SubCategory } from "../../types/subCategory";

import offer from "../../assets/offer.png";
import delivery from "../../assets/delivery.png";
import MegaMenu from "./MegaMenu";

const NavBar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleCategoryEnter = async (category: Category) => {
    setActiveCategory(category);

    if (!category.categoryId) {
      setSubCategories([]);
      return;
    }

    try {
      setLoading(true);
      const data = await getSubCategoriesByCategory(category.categoryId);
      setSubCategories(data);
    } catch (error) {
      console.error("Failed to load subcategories", error);
      setSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuLeave = () => {
    setActiveCategory(null);
    setSubCategories([]);
  };

  return (
    <div className="relative" onMouseLeave={handleMenuLeave}>
      <nav className="border-b border-gray-200 bg-white max-md:hidden">
        <div className="mx-auto flex h-[38px] max-w-[1200px] items-center justify-center gap-4 px-3 text-[15px] font-normal text-gray-900">
          {" "}
          <span className="cursor-pointer text-gray-700 transition hover:text-[#C9A24D]">
            New Arrivals
          </span>
          <span className="flex cursor-pointer items-center gap-1 text-gray-700 transition hover:text-[#C9A24D]">
            <img
              src={delivery}
              alt="Express Delivery"
              className="h-[40px] w-[40px] object-contain"
            />
            Express Delivery
          </span>
          {categories.map((cat) => (
            <span
              key={cat.categoryId}
              onMouseEnter={() => handleCategoryEnter(cat)}
              className={`cursor-pointer transition hover:text-[#C9A24D] ${
                activeCategory?.categoryId === cat.categoryId
                  ? "font-medium text-[#C9A24D]"
                  : "text-gray-700"
              }`}
            >
              {cat.categoryName}
            </span>
          ))}
          <span
            className="
              flex items-center gap-1 cursor-pointer
              bg-[#F5C542] hover:bg-[#E6B800]
              text-[#2F2F2F]
             px-2 py-[2px]
rounded-full
text-[10px]
              transition
            "
          >
            <img
              src={offer}
              alt="Offers"
              className="h-[20px] w-[20px] object-contain"
            />
            Offers
          </span>
        </div>
      </nav>

      <MegaMenu
        category={activeCategory}
        subCategories={subCategories}
        open={!!activeCategory && !loading}
      />
    </div>
  );
};

export default NavBar;
