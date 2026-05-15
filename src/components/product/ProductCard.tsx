import { Heart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import ProductImageSlider from "./ProductImageSlider";

type Props = {
  product: Product;
  images?: string[];
  autoSlide?: boolean;
};

const ProductCard = ({ product, images = [], autoSlide = false }: Props) => {
  const currentPrice =
    product.salePrice || product.totalAmount || product.basePrice || 0;

  const oldPrice =
    product.basePrice &&
    product.salePrice &&
    product.basePrice > product.salePrice
      ? product.basePrice
      : undefined;

  const tagText = product.newArrival
    ? "New"
    : product.featured
      ? "Featured"
      : product.trending
        ? "Trending"
        : "";

  const fallbackImages = [
    product.thumbnailImageUrl,
    product.hoverImageUrl,
  ].filter(Boolean) as string[];

  const finalImages = images.length ? images : fallbackImages;

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-md bg-[#f7f7f7]">
        {tagText && (
          <div className="absolute left-2 top-2 z-10 bg-[#dff6ef] px-3 py-1 text-[14px] text-[#1c1c1c]">
            {tagText}
          </div>
        )}

        <button className="absolute right-3 top-3 z-20 text-gray-500 hover:text-red-500">
          <Heart className="h-6 w-6" />
        </button>

        <Link to={`/product/${product.slug}`} className="block">
          <ProductImageSlider
            images={finalImages}
            alt={product.itemName}
            autoSlide={autoSlide}
          />
        </Link>

        <Link
          to={`/product/${product.slug}`}
          className="absolute bottom-3 right-3 z-20 text-gray-500 hover:text-black"
        >
          <ExternalLink className="h-5 w-5" />
        </Link>
      </div>

      <div className="pt-3">
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-medium text-black">
            ₹{currentPrice.toLocaleString()}
          </span>

          {oldPrice && (
            <span className="text-[16px] text-gray-400 line-through">
              ₹{oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mt-1 text-[14px]">
          <span className="font-semibold text-green-600">20% Off</span>
          <span className="text-gray-500"> on Making Value</span>
        </div>

        <Link to={`/product/${product.slug}`}>
          <h3 className="mt-1 line-clamp-2 text-[16px] leading-7 text-[#3a3a3a] hover:text-[#C9A24D]">
            {product.itemName}
          </h3>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
