import api from "./axios";
import type { Product, ProductWeightOption } from "../types/product";

export interface ProductImage {
  imageId?: number;
  imageUrl: string;
  altText?: string;
  sortOrder?: number;
  primaryImage?: boolean;
  imageType?: string;
}

export const getProductsBySubCategory = async (
  subCategoryId: number,
): Promise<Product[]> => {
  const res = await api.get(`/subcategories/${subCategoryId}/products`);
  return res.data;
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  const res = await api.get(`/products/slug/${slug}`);
  return res.data;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products/featured");
  return res.data;
};

export const getTrendingProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products/trending");
  return res.data;
};

export const getNewArrivalProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products/new-arrivals");
  return res.data;
};

export const getProductImages = async (
  productId: number,
): Promise<ProductImage[]> => {
  const res = await api.get(`/products/${productId}/images`);
  return res.data;
};
export const getProductWeightOptions = async (
  productId: number,
): Promise<ProductWeightOption[]> => {
  const res = await api.get(`/products/${productId}/weight-options`);
  return res.data;
};
