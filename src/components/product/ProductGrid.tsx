import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
  productImagesMap: Record<number, string[]>;
};

const ProductGrid = ({ products, productImagesMap }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.productId}
          product={product}
          images={
            product.productId ? productImagesMap[product.productId] || [] : []
          }
          autoSlide={index === 0}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
