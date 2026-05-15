import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSubCategoryBySlug } from "../api/subCategoryApi";
import { getProductsBySubCategory, getProductImages } from "../api/productApi";
import type { SubCategory } from "../types/subCategory";
import type { Product } from "../types/product";
import Breadcrumbs from "../components/common/Breadcrumbs";
import ProductToolbar from "../components/product/ProductToolbar";
import ProductGrid from "../components/product/ProductGrid";
import BenefitsStrip from "../components/common/BenefitsStrip";
import NewsletterStrip from "../components/common/NewsletterStrip";
import SubCategoryHorizontalSlider from "../components/subcategory/SubCategoryHorizontalSlider";

const ProductListingPage = () => {
  const { categorySlug, subCategorySlug } = useParams();

  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [productImagesMap, setProductImagesMap] = useState<
    Record<number, string[]>
  >({});

  useEffect(() => {
    const loadPageData = async () => {
      if (!subCategorySlug) return;

      try {
        setLoading(true);

        const subCategoryData = await getSubCategoryBySlug(subCategorySlug);
        setSubCategory(subCategoryData);

        if (subCategoryData.subCategoryId) {
          const productsData = await getProductsBySubCategory(
            subCategoryData.subCategoryId,
          );
          setProducts(productsData);

          const imageResults = await Promise.all(
            productsData.map(async (product) => {
              if (!product.productId) {
                return { productId: 0, images: [] as string[] };
              }

              try {
                const imgs = await getProductImages(product.productId);

                const galleryImages = imgs
                  .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                  .map((img) => img.imageUrl)
                  .filter(Boolean);

                if (galleryImages.length > 0) {
                  return {
                    productId: product.productId,
                    images: galleryImages,
                  };
                }

                return {
                  productId: product.productId,
                  images: [
                    product.thumbnailImageUrl,
                    product.hoverImageUrl,
                  ].filter(Boolean) as string[],
                };
              } catch (error) {
                console.error("Failed to load product images", error);

                return {
                  productId: product.productId,
                  images: [
                    product.thumbnailImageUrl,
                    product.hoverImageUrl,
                  ].filter(Boolean) as string[],
                };
              }
            }),
          );

          const imageMap: Record<number, string[]> = {};
          imageResults.forEach((item) => {
            if (item.productId) {
              imageMap[item.productId] = item.images;
            }
          });

          setProductImagesMap(imageMap);
        } else {
          setProducts([]);
          setProductImagesMap({});
        }
      } catch (error) {
        console.error("Failed to load product listing page", error);
        setProducts([]);
        setProductImagesMap({});
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [subCategorySlug]);

  if (loading) {
    return <div className="p-10 text-lg">Loading products...</div>;
  }

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <>
      <SubCategoryHorizontalSlider />

      <div className="mx-auto max-w-[1700px] px-10 py-8">
        <Breadcrumbs
          items={[
            "Home",
            "Jewellery",
            "Category",
            categorySlug || "",
            subCategory?.subCategoryName || "Products",
          ]}
        />

        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-[32px] font-medium text-[#0f172a]">
            {subCategory?.subCategoryName || "Products"}{" "}
            <span className="text-[18px] font-normal text-gray-500">
              ({products.length} Designs)
            </span>
          </h1>

          <ProductToolbar />
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500">
            No products found for this subcategory.
          </div>
        ) : (
          <>
            <ProductGrid
              products={visibleProducts}
              productImagesMap={productImagesMap}
            />

            {visibleCount < products.length && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="rounded-md bg-[#b82045] px-10 py-4 text-[18px] font-medium text-white hover:bg-[#a11b3d]"
                >
                  View More
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <BenefitsStrip />
      <NewsletterStrip />
    </>
  );
};

export default ProductListingPage;
