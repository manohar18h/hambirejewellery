import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductBySlug,
  getProductImages,
  getProductWeightOptions,
} from "../api/productApi";
import type { Product } from "../types/product";
import type { ProductWeightOption } from "../types/product";
import ProductImageSlider from "../components/product/ProductImageSlider";

const ProductDetailsPage = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [weightOptions, setWeightOptions] = useState<ProductWeightOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductDetails = async () => {
      if (!productSlug) return;

      try {
        setLoading(true);

        const productData = await getProductBySlug(productSlug);
        setProduct(productData);

        if (productData.productId) {
          try {
            const imageData = await getProductImages(productData.productId);
            const galleryImages = imageData
              .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
              .map((img) => img.imageUrl)
              .filter(Boolean);

            if (galleryImages.length > 0) {
              setImages(galleryImages);
            } else {
              setImages(
                [
                  productData.thumbnailImageUrl,
                  productData.hoverImageUrl,
                ].filter(Boolean) as string[],
              );
            }
          } catch (error) {
            console.error("Failed to load product images", error);
            setImages(
              [productData.thumbnailImageUrl, productData.hoverImageUrl].filter(
                Boolean,
              ) as string[],
            );
          }

          try {
            const weights = await getProductWeightOptions(
              productData.productId,
            );
            setWeightOptions(weights);
          } catch (error) {
            console.error("Failed to load weight options", error);
            setWeightOptions([]);
          }
        } else {
          setImages([]);
          setWeightOptions([]);
        }
      } catch (error) {
        console.error("Failed to load product details", error);
        setProduct(null);
        setImages([]);
        setWeightOptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [productSlug]);

  if (loading) {
    return <div className="p-10 text-lg">Loading product details...</div>;
  }

  if (!product) {
    return <div className="p-10 text-lg">Product not found.</div>;
  }

  const currentPrice =
    product.salePrice || product.totalAmount || product.basePrice || 0;

  const oldPrice =
    product.basePrice &&
    product.salePrice &&
    product.basePrice > product.salePrice
      ? product.basePrice
      : undefined;

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-xl bg-[#f7f7f7]">
            <ProductImageSlider
              images={images}
              alt={product.itemName}
              autoSlide={false}
            />
          </div>
        </div>

        <div>
          <h1 className="text-[32px] font-medium text-[#1c1c1c]">
            {product.itemName}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-[28px] font-semibold text-black">
              ₹{currentPrice.toLocaleString()}
            </span>

            {oldPrice && (
              <span className="text-[20px] text-gray-400 line-through">
                ₹{oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mt-2 text-[15px]">
            <span className="font-semibold text-green-600">20% Off</span>
            <span className="text-gray-500"> on Making Value</span>
          </div>

          {weightOptions.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 text-[18px] font-medium text-[#1c1c1c]">
                Available Weights
              </h3>

              <div className="flex flex-wrap gap-3">
                {weightOptions.map((option) => {
                  const isSelected = option.productId === product.productId;

                  return (
                    <button
                      key={option.productId}
                      onClick={() => navigate(`/product/${option.slug}`)}
                      className={`rounded-md border px-4 py-2 text-[15px] transition ${
                        isSelected
                          ? "border-[#C9A24D] bg-[#fff8ef] text-[#C9A24D]"
                          : "border-gray-300 bg-white text-[#1c1c1c] hover:border-[#C9A24D]"
                      }`}
                    >
                      {option.weight} g ({option.qty} Qty)
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {product.shortDescription && (
            <div className="mt-8">
              <h3 className="mb-2 text-[18px] font-medium text-[#1c1c1c]">
                Description
              </h3>
              <p className="text-[15px] leading-7 text-gray-600">
                {product.shortDescription}
              </p>
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4 text-[15px] text-gray-700">
            {product.metal && (
              <div>
                <span className="font-medium">Metal:</span> {product.metal}
              </div>
            )}

            {product.purity && (
              <div>
                <span className="font-medium">Purity:</span> {product.purity}
              </div>
            )}

            {product.linkedWeight && (
              <div>
                <span className="font-medium">Weight:</span>{" "}
                {product.linkedWeight} g
              </div>
            )}

            {product.size && (
              <div>
                <span className="font-medium">Size:</span> {product.size}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
