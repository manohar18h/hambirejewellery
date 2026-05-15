import type { Category } from "../../types/category";
import type { SubCategory } from "../../types/subCategory";
import { Link } from "react-router-dom";

type Props = {
  category: Category | null;
  subCategories: SubCategory[];
  open: boolean;
};

const MegaMenu = ({ category, subCategories, open }: Props) => {
  if (!open || !category) return null;

  const shopByPrice = [
    "Under ₹10000",
    "₹10000 - ₹20000",
    "₹20000 - ₹50000",
    "₹50000 - ₹1 Lakh",
    "Above ₹1 Lakh",
  ];

  return (
    <div className="absolute left-0 top-full z-50 w-full border-t border-gray-200 bg-white shadow-lg">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-6 px-8 py-8">
        <div className="col-span-5 border-r border-gray-200 pr-6">
          <h3 className="mb-2 text-[15px] font-semibold text-gray-900">
            Shop By Style
          </h3>

          <div className="mb-2 h-[4px] w-[50px] bg-[#EAB38B] [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]" />

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {subCategories.map((sub) => (
              <Link
                key={sub.subCategoryId}
                to={`/category/${category.slug}/${sub.slug}`}
                className="group flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-50"
              >
                <div
                  key={sub.subCategoryId}
                  className="group inline-flex cursor-pointer items-center gap-2"
                >
                  <img
                    src={sub.imageUrl || "https://via.placeholder.com/60"}
                    alt={sub.subCategoryName}
                    className="h-14 w-14 rounded object-cover transition-transform duration-200 group-hover:scale-110"
                  />

                  <span className="text-[14px] text-gray-800 transition-colors duration-200 group-hover:text-[#ce6912]">
                    {sub.subCategoryName}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="col-span-3 border-r border-gray-200 pr-6">
          <h3 className="mb-2 text-[15px] font-semibold text-gray-900">
            Shop By Price
          </h3>

          <div className="mb-2 h-[4px] w-[50px] bg-[#EAB38B] [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]" />

          <div className="flex flex-col gap-3">
            {shopByPrice.map((price) => (
              <span
                key={price}
                className="cursor-pointer text-[14px] text-gray-700 hover:text-[#C9A24D]"
              >
                {price}
              </span>
            ))}
          </div>
        </div>

        <div className="col-span-4">
          <div className="overflow-hidden rounded-xl">
            <img
              src={
                category.bannerImageUrl ||
                "https://via.placeholder.com/400x280?text=Category+Banner"
              }
              alt={category.categoryName}
              className="h-[280px] w-full rounded-xl object-cover transition-transform duration-300 hover:scale-135"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
